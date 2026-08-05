<script setup>
// [도시 상세 화면]
// 데이터 흐름:
// 1) URL의 :id로 cityLocation에서 해당 city 찾기
// 2) city가 정해지면 watchEffect가 스토어의 weatherInfoDetail/forecastList를 비우고
//    getWeatherInfo/getForecastInfo를 재호출 → 응답이 스토어에 채워지면 화면이 다시 렌더링
// 3) city를 못 찾으면(잘못된 id) notFound 라우트로 리다이렉트
import { computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWeatherStore } from '@/stores/weatherStore.js'

const weatherStore = useWeatherStore() 
const route = useRoute() 
const router = useRouter()

// city id별 배경 이미지 파일들을 가져옴
const cityImages = import.meta.glob('/src/asset/city_images/*.jpg', {
  eager: true,
  import: 'default',
})

// WeatherCard 클릭 시 router.push로 넘어온 id와 도시별 좌표 데이터 매칭
const city = computed(() => weatherStore.cityLocation.find((c) => c.id === route.params.id))

// city.id와 일치하는 파일명을 cityImages에서 찾아 배경으로 사용
const heroImage = computed(() => {
  if (!city.value) return null
  const entry = Object.entries(cityImages).find(([path]) => path.endsWith(`/${city.value.id}.jpg`))
  return entry ? entry[1] : null
})

// watchEffect가 호출한 getWeatherInfo 응답 결과
const weather = computed(() => weatherStore.weatherInfoDetail)

// OpenWeather 아이콘 이미지 URL 조립. weather가 아직 없으면 빈 문자열
const iconUrl = computed(() => {
  const icon = weather.value?.weather?.[0]?.icon
  return icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : ''
})

// UNIX 타임스탬프(초)를 'HH:MM' 형식의 한국어 시각 문자열로 변환 (일출/일몰/업데이트 시각 표시에 공통 사용)
const formatTime = (unixSeconds) => {
  if (!unixSeconds) return '-'
  return new Date(unixSeconds * 1000).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// weather.dt(응답이 온 시각)를 화면 상단에 표시
const updatedAt = computed(() => formatTime(weather.value?.dt))

// 오늘의 최저~최고 기온 구간에서 현재 기온의 상대 위치(0~100%). "일교차 위치" 위젯의 마커 좌표로 사용
const tempRangePercent = computed(() => {
  if (!weather.value) return 0
  const { temp, temp_min: min, temp_max: max } = weather.value.main
  if (max === min) return 50
  return Math.min(100, Math.max(0, ((temp - min) / (max - min)) * 100))
})

// 풍향(도 단위). "풍향 · 풍속" 위젯의 나침반 바늘 회전 각도로 사용
const windDeg = computed(() => weather.value?.wind?.deg ?? 0)

// weatherStore.forecastList를 그대로 참조 — 예보 차트가 순회하는 원본 데이터
const forecast = computed(() => weatherStore.forecastList)
const chartHeight = 100 // 예보 막대그래프 트랙의 최대 높이(px), barHeight 계산의 기준값

// 예보 목록 중 최저/최고 기온을 구해 막대그래프 높이의 상대적 비율 계산에 사용
const tempBounds = computed(() => {
  if (!forecast.value?.length) return { min: 0, max: 1 }
  const temps = forecast.value.map((item) => item.main.temp)
  return { min: Math.min(...temps), max: Math.max(...temps) }
})

// 예보 항목 하나(item)의 기온을 tempBounds 구간에 비례한 막대 높이(px)로 변환
const barHeight = (item) => {
  const { min, max } = tempBounds.value
  const range = max - min || 1
  return Math.max(4, ((item.main.temp - min) / range) * chartHeight)
}

// 예보 항목의 UNIX 타임스탬프를 '일 시' 형식(예: '6일 15시')으로 변환
const formatSlot = (unixSeconds) => {
  const d = new Date(unixSeconds * 1000)
  return `${d.getDate()}일 ${d.getHours()}시`
}

// city.value가 바뀔 때마다(다른 도시 상세로 바로 이동하는 경우 포함) 자동 재실행
// 이전 도시의 날씨/예보가 잠깐이라도 화면에 남지 않도록 먼저 null로 비운 뒤 새로 요청한다.
watchEffect(() => {
  if (!city.value) {
    router.replace({ name: 'notFound' })
    return
  }
  weatherStore.weatherInfoDetail = null
  weatherStore.forecastList = null
  weatherStore.getWeatherInfo(city.value.lat, city.value.lon)
  weatherStore.getForecastInfo(city.value.lat, city.value.lon)
})
</script>

<template>
  <div v-if="city" class="wrap">
    <div class="hero" :style="heroImage ? { backgroundImage: `url(${heroImage})` } : {}">
      <div class="hero-scrim" />
      <RouterLink to="/" class="back">← 목록으로</RouterLink>
      <div class="hero-text">
        <p class="region">{{ city.region }}</p>
        <h2 class="name">{{ city.name }}</h2>
        <p class="coords">{{ city.lat.toFixed(4) }}°N · {{ city.lon.toFixed(4) }}°E</p>
      </div>
    </div>

    <div v-if="!weather" class="loading">날씨 정보를 불러오는 중입니다...</div>

    <div v-else class="body">
      <div class="section-header">
        <h4>실시간 현황</h4>
        <span class="updated-chip">업데이트 {{ updatedAt }}</span>
      </div>

      <div class="now">
        <img v-if="iconUrl" class="icon" :src="iconUrl" alt="" />
        <div class="now-main">
          <p class="temp">
            {{ weatherStore.displayTemp(Math.round(weather.main.temp))
            }}{{ weatherStore.unitSymbol }}
          </p>
          <p class="desc">{{ weather.weather[0].main }}</p>
        </div>
        <div class="minmax">
          <span
            >최고 {{ weatherStore.displayTemp(Math.round(weather.main.temp_max))
            }}{{ weatherStore.unitSymbol }}</span
          >
          <span
            >최저 {{ weatherStore.displayTemp(Math.round(weather.main.temp_min))
            }}{{ weatherStore.unitSymbol }}</span
          >
        </div>
      </div>

      <div class="forecast-section">
        <span class="widget-label">5일 기온 예보 (3시간 간격)</span>

        <div v-if="!forecast" class="forecast-loading">예보를 불러오는 중입니다...</div>
        <div v-else-if="forecast.length === 0" class="forecast-loading">
          예보를 불러올 수 없습니다.
        </div>

        <div v-else class="forecast-chart">
          <div v-for="item in forecast" :key="item.dt" class="forecast-col">
            <span class="f-max"
              >{{ weatherStore.displayTemp(Math.round(item.main.temp))
              }}{{ weatherStore.unitSymbol }}</span
            >
            <div class="f-bar-track" :style="{ height: chartHeight + 'px' }">
              <div
                class="f-bar"
                :class="{ warm: item.main.temp > 25 }"
                :style="{ height: barHeight(item) + 'px' }"
              />
            </div>
            <img
              class="f-icon"
              :src="`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`"
              alt=""
            />
            <span class="f-day">{{ formatSlot(item.dt) }}</span>
          </div>
        </div>
      </div>

      <div class="widgets">
        <div class="widget range-widget">
          <span class="widget-label">일교차 위치</span>
          <div class="range-track">
            <div class="range-marker" :style="{ left: tempRangePercent + '%' }" />
          </div>
          <div class="range-endpoints">
            <span
              >{{ weatherStore.displayTemp(Math.round(weather.main.temp_min))
              }}{{ weatherStore.unitSymbol }}</span
            >
            <span
              >{{ weatherStore.displayTemp(Math.round(weather.main.temp_max))
              }}{{ weatherStore.unitSymbol }}</span
            >
          </div>
        </div>

        <div class="widget ring-widget">
          <span class="widget-label">습도</span>
          <div class="ring" :style="{ '--pct': weather.main.humidity }">
            <div class="ring-inner">
              <span class="ring-value">{{ weather.main.humidity }}%</span>
            </div>
          </div>
        </div>

        <div class="widget compass-widget">
          <span class="widget-label">풍향 · 풍속</span>
          <div class="compass">
            <span class="needle" :style="{ transform: `rotate(${windDeg}deg)` }">↑</span>
          </div>
          <span class="compass-speed">{{ weather.wind.speed }}m/s</span>
        </div>
      </div>

      <div class="stats">
        <div class="stat">
          <span class="label">체감</span>
          <span class="value"
            >{{ weatherStore.displayTemp(Math.round(weather.main.feels_like))
            }}{{ weatherStore.unitSymbol }}</span
          >
        </div>
        <div class="stat">
          <span class="label">기압</span>
          <span class="value">{{ weather.main.pressure }}hPa</span>
        </div>
        <div class="stat">
          <span class="label">가시거리</span>
          <span class="value">{{ (weather.visibility / 1000).toFixed(1) }}km</span>
        </div>
        <div class="stat">
          <span class="label">구름량</span>
          <span class="value">{{ weather.clouds.all }}%</span>
        </div>
        <div class="stat">
          <span class="label">일출</span>
          <span class="value">{{ formatTime(weather.sys.sunrise) }}</span>
        </div>
        <div class="stat">
          <span class="label">일몰</span>
          <span class="value">{{ formatTime(weather.sys.sunset) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
  overflow: hidden;
}

.hero {
  position: relative;
  height: 220px;
  padding: 20px 28px;
  background: linear-gradient(135deg, #3a4456, #1e2530);
  background-size: cover;
  background-position: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #fff;
}

.hero-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.15) 60%,
    rgba(0, 0, 0, 0.35) 100%
  );
}

.back {
  position: relative;
  z-index: 1;
  align-self: flex-start;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  text-decoration: none;
  opacity: 0.85;
}

.back:hover {
  opacity: 1;
}

.hero-text {
  position: relative;
  z-index: 1;
}

.region {
  margin: 0 0 2px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  opacity: 0.85;
}

.name {
  margin: 0 0 4px;
  font-size: 28px;
  font-weight: 800;
}

.coords {
  margin: 0;
  font-size: 12px;
  font-family: ui-monospace, 'SF Mono', monospace;
  opacity: 0.75;
}

.loading {
  padding: 40px 0;
  font-size: 13px;
  color: #98a2ae;
  text-align: center;
}

.body {
  padding: 24px 28px 28px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.section-header h4 {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #24292f;
}

.updated-chip {
  padding: 4px 10px;
  background: #f5f6f8;
  border-radius: 999px;
  font-size: 11px;
  color: #57606a;
}

.now {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}

.icon {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
}

.now-main {
  flex: 1;
}

.temp {
  margin: 0;
  font-size: 34px;
  font-weight: 800;
  color: #24292f;
  line-height: 1;
}

.desc {
  margin: 4px 0 0;
  font-size: 13px;
  color: #57606a;
}

.minmax {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  font-size: 12px;
  color: #98a2ae;
}

.forecast-section {
  margin-bottom: 20px;
  padding: 16px;
  background: #f5f6f8;
  border-radius: 14px;
}

.forecast-loading {
  padding: 30px 0;
  font-size: 12px;
  color: #98a2ae;
  text-align: center;
}

.forecast-chart {
  display: flex;
  gap: 4px;
  margin-top: 12px;
  padding-bottom: 4px;
  overflow-x: auto;
}

.forecast-col {
  flex: 1;
  min-width: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.f-max {
  font-size: 11px;
  font-weight: 700;
  color: #24292f;
}

.f-bar-track {
  display: flex;
  align-items: flex-end;
  width: 6px;
}

.f-bar {
  width: 6px;
  border-radius: 999px;
  background: linear-gradient(to top, #4a7fd4, #8bb0ea);
}

.f-bar.warm {
  background: linear-gradient(to top, #e0533d, #f5a623);
}

.f-icon {
  width: 26px;
  height: 26px;
}

.f-day {
  font-size: 10px;
  font-weight: 600;
  color: #57606a;
  white-space: nowrap;
}

.widgets {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

.widget {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 16px;
  background: #f5f6f8;
  border-radius: 14px;
}

.widget-label {
  align-self: flex-start;
  font-size: 11px;
  color: #98a2ae;
}

.range-widget {
  align-items: stretch;
  justify-content: center;
}

.range-track {
  position: relative;
  height: 6px;
  border-radius: 999px;
  background: linear-gradient(to right, #4a7fd4, #f5a623, #e0533d);
}

.range-marker {
  position: absolute;
  top: 50%;
  width: 14px;
  height: 14px;
  background: #fff;
  border: 3px solid #24292f;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.range-endpoints {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 600;
  color: #57606a;
}

.ring-widget {
  justify-content: center;
}

.ring {
  --pct: 0;
  width: 68px;
  height: 68px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: conic-gradient(#4a7fd4 calc(var(--pct) * 1%), #e5e7eb 0);
}

.ring-inner {
  width: calc(100% - 12px);
  height: calc(100% - 12px);
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring-value {
  font-size: 13px;
  font-weight: 700;
  color: #24292f;
}

.compass-widget {
  justify-content: center;
}

.compass {
  position: relative;
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.needle {
  font-size: 22px;
  color: #4a7fd4;
  transition: transform 0.2s ease;
}

.compass-speed {
  font-size: 13px;
  font-weight: 700;
  color: #24292f;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: #f5f6f8;
  border-radius: 12px;
}

.label {
  font-size: 11px;
  color: #98a2ae;
}

.value {
  font-size: 15px;
  font-weight: 700;
  color: #24292f;
}
</style>
