<script setup>
// 홈 화면 우측 사이드바의 "현재 위치 날씨" 패널.
// 데이터 흐름: onMounted → 브라우저 Geolocation API로 위경도 획득
//            → weatherStore.getWeatherInfo(lat, lon) 호출 (axios → OpenWeather API)
//            → 응답이 weatherStore.weatherInfoDetail에 저장 → 아래 weather computed가 이를 읽어 렌더링.
import { computed, onMounted, ref } from 'vue'
import { useWeatherStore } from '@/stores/weatherStore.js'

const weatherStore = useWeatherStore()

const status = ref('loading') // 패널 표시 상태: loading | ready | error
const lat = ref(null) // Geolocation으로 얻은 현재 위도
const lon = ref(null) // Geolocation으로 얻은 현재 경도

// lat/lon을 중심으로 한 소규모 영역(bbox)을 계산해 OpenStreetMap embed iframe의 src로 사용
const mapUrl = computed(() => {
  if (lat.value === null || lon.value === null) return ''
  const delta = 0.035 // bbox 한 변의 절반 크기(도 단위) — 지도 확대 정도를 결정
  const bbox = [lon.value - delta, lat.value - delta, lon.value + delta, lat.value + delta].join(
    '%2C',
  )
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat.value}%2C${lon.value}`
})

// CurrentLocationCard와 WeatherDetailView가 weatherInfoDetail을 공유하므로,
// 이 컴포넌트가 마운트되어 getWeatherInfo를 호출한 이후의 최신 응답이 여기 반영된다.
const weather = computed(() => weatherStore.weatherInfoDetail)

// OpenWeather 아이콘 코드로 아이콘 이미지 URL 조립
const iconUrl = computed(() => {
  const icon = weather.value?.weather?.[0]?.icon
  return icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : ''
})

// UNIX 타임스탬프(초)를 'HH:MM' 형식으로 변환 (일출/일몰 시각 표시에 사용)
const formatTime = (unixSeconds) => {
  if (!unixSeconds) return '-'
  return new Date(unixSeconds * 1000).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 컴포넌트가 화면에 붙는 시점에 브라우저에게 위치 권한을 요청한다.
// 사용자가 허용하면 콜백이 실행되어 위경도를 얻고, 그 값으로 스토어의 API 호출 함수를 실행한다.
// (권한 거부/오류 시 콜백이 호출되지 않아 status가 계속 'loading'에 머무는 점은 알려진 한계)
onMounted(() => {
  navigator.geolocation.getCurrentPosition(async (position) => {
    lat.value = position.coords.latitude
    lon.value = position.coords.longitude
    await weatherStore.getWeatherInfo(lat.value, lon.value)
    status.value = 'ready'
  })
})
</script>

<template>
  <div class="panel">
    <p class="eyebrow">Current Location</p>
    <h3 class="title">현재 날씨</h3>

    <div v-if="status === 'loading'" class="state">위치 정보를 가져오는 중입니다...</div>
    <div v-else-if="status === 'error'" class="state error">현재 위치정보와 날씨를 불러오는데 실패했습니다.</div>

    <template v-else>
      <iframe
        class="map"
        :src="mapUrl"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      />

      <div v-if="weather" class="weather">
        <div class="weather-main">
          <img v-if="iconUrl" class="weather-icon" :src="iconUrl" alt="" />
          <div>
            <p class="place">{{ weather.name || '알 수 없는 위치' }}</p>
            <p class="temp">
              {{ weatherStore.displayTemp(Math.round(weather.main.temp))
              }}{{ weatherStore.unitSymbol }}
            </p>
          </div>
        </div>
        <p class="desc">{{ weather.weather[0].description }}</p>

        <div class="stats">
          <div class="stat">
            <span class="stat-label">체감</span>
            <span class="stat-value"
              >{{ weatherStore.displayTemp(Math.round(weather.main.feels_like))
              }}{{ weatherStore.unitSymbol }}</span
            >
          </div>
          <div class="stat">
            <span class="stat-label">습도</span>
            <span class="stat-value">{{ weather.main.humidity }}%</span>
          </div>
          <div class="stat">
            <span class="stat-label">바람</span>
            <span class="stat-value">{{ weather.wind.speed }}m/s</span>
          </div>
          <div class="stat">
            <span class="stat-label">일출</span>
            <span class="stat-value">{{ formatTime(weather.sys.sunrise) }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">일몰</span>
            <span class="stat-value">{{ formatTime(weather.sys.sunset) }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.panel {
  background: #f5f6f8;
  border-radius: 16px;
  padding: 18px;
  box-sizing: border-box;
}

.eyebrow {
  margin: 0 0 2px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #4a7fd4;
}

.title {
  margin: 0 0 14px;
  font-size: 15px;
  font-weight: 700;
  color: #24292f;
}

.state {
  padding: 24px 0;
  font-size: 13px;
  color: #57606a;
  text-align: center;
}

.state.error {
  color: #c0392b;
}

.map {
  width: 100%;
  height: 160px;
  border: none;
  border-radius: 12px;
  margin-bottom: 14px;
}

.weather-main {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 2px;
}

.weather-icon {
  width: 44px;
  height: 44px;
}

.place {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: #57606a;
}

.temp {
  margin: 0;
  font-size: 26px;
  font-weight: 800;
  color: #24292f;
}

.desc {
  margin: 0 0 14px;
  font-size: 12px;
  color: #98a2ae;
}

.stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 10px;
  background: #fff;
  border-radius: 10px;
}

.stat-label {
  font-size: 10.5px;
  color: #98a2ae;
}

.stat-value {
  font-size: 13px;
  font-weight: 700;
  color: #24292f;
}
</style>
