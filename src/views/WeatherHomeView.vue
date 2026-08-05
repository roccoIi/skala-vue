<script setup>
// 홈(도시 목록) 화면.
// 데이터 흐름: SearchBar가searchKeyword 갱신
//            → weatherStore.filteredCityLocation(computed)가 재계산 → 카드 그리드 렌더링.
import { useWeatherStore } from '@/stores/weatherStore.js'
import CurrentLocationCard from '../components/exercise/CurrentLocationCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'

const weatherStore = useWeatherStore()

</script>

<template>
  <div class="wrap">
    <header class="header">
      <div>
        <p class="eyebrow">Weather Dashboard</p>
        <h2 class="page-title">대한민국 주요도시 날씨</h2>
      </div>
      <SearchBar />
    </header>

    <p v-if="weatherStore.searchKeyword" class="result-count">
      '{{ weatherStore.searchKeyword }}' 검색 결과 {{ weatherStore.filteredCityLocation.length }}곳
    </p>

    <div class="main-row">
      <div class="cards-col">
        <div v-if="weatherStore.filteredCityLocation.length === 0" class="empty">
          일치하는 검색 결과가 존재하지 않습니다.
        </div>

        <div v-else class="grid">
          <WeatherCard
            v-for="city in weatherStore.filteredCityLocation"
            :key="city.id"
            :city="city"
          />
        </div>
      </div>

      <div class="side-col">
        <CurrentLocationCard />
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  padding: 32px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
  color: #24292f;
}

.header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.eyebrow {
  margin: 0 0 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #4a7fd4;
}

.page-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
}

.result-count {
  margin: -8px 0 16px;
  font-size: 12px;
  color: #57606a;
}

.main-row {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.cards-col {
  flex: 1;
  min-width: 0;
}

.side-col {
  width: 300px;
  flex-shrink: 0;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.empty {
  padding: 40px 0;
  font-size: 14px;
  font-weight: 600;
  color: #98a2ae;
  text-align: center;
}
</style>