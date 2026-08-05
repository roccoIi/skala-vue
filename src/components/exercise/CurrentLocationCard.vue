<script setup>
import { computed, onMounted, ref } from 'vue'
import { useWeatherStore } from '@/stores/weatherStore.js'

const weatherStore = useWeatherStore()

const status = ref('loading') // loading | ready | error
const errorMessage = ref('')
const lat = ref(null)
const lon = ref(null)

const mapUrl = computed(() => {
  if (lat.value === null || lon.value === null) return ''
  const delta = 0.035
  const bbox = [lon.value - delta, lat.value - delta, lon.value + delta, lat.value + delta].join(
    '%2C',
  )
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat.value}%2C${lon.value}`
})

const weather = computed(() => weatherStore.weatherInfoDetail)

const iconUrl = computed(() => {
  const icon = weather.value?.weather?.[0]?.icon
  return icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : ''
})

const formatTime = (unixSeconds) => {
  if (!unixSeconds) return '-'
  return new Date(unixSeconds * 1000).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

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
    <div v-else-if="status === 'error'" class="state error">{{ errorMessage }}</div>

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
