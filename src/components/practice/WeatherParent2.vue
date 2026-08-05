<script setup>
import { ref } from 'vue'
import BaseDashboardCard2 from './BaseDashboardCard2.vue'
import SearchBar2 from './SearchBar2.vue'
import WeatherCard2 from './WeatherCard2.vue'

// const weatherList = ref([
//   { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
//   { id: 'city_02', name: '수원', temp: 24, status: '비' },
//   { id: 'city_03', name: '부산', temp: 26, status: '구름' },
//   { id: 'city_07', name: '전주', temp: 21, status: '맑음' },
//   { id: 'city_04', name: '경주', temp: 30, status: '번개' },
//   { id: 'city_05', name: '울산', temp: 23, status: '맑음' },
//   { id: 'city_06', name: '광주', temp: 22, status: '우박' },
// ])

const searchCity = ref('')
const changeCity = (value) => {
  searchCity.value = value
}

// const filteredWeatherList = computed(() => {
//   const searchKeyword = searchCity.value.trim
//   if (searchKeyword.length === 0) return weatherList.value
//   return weatherList.value.filter((city) => city.name.includes(searchKeyword))
// })
</script>

<template>
  <div class="warp">
    <h1>과제 3: 날씨(컴포넌트)</h1>

    <BaseDashboardCard2 title="도시 검색">
      <!-- (1) SearchBar에서 설정한 emit 이벤트명이 updateQuery이다. 해당 이벤트가 발생했을때 (v-on) (changeCity)함수를 실행한다. -->
      <SearchBar2 :query="searchCity" @updateQuery="changeCity" />
    </BaseDashboardCard2>

    <BaseDashboardCard2 title="지역별 날씨 현황">
      <WeatherCard2 />
    </BaseDashboardCard2>
  </div>
</template>

<style scoped></style>
