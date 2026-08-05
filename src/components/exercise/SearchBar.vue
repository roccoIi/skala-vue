<script setup>
// 도시 검색창. weatherStore.searchKeyword를 직접 읽고 쓴다 (props/emit 중계 없음).
// el-autocomplete는 :model-value로 store 값을 그대로 표시하고,
// @update:model-value(타이핑할 때마다 발생)로 store 값을 즉시 갱신해 실시간 반영을 보장한다.
import { useWeatherStore } from '@/stores/weatherStore.js'

const weatherStore = useWeatherStore() // searchKeyword 읽기/쓰기 + 자동완성 후보를 위한 cityLocation 조회용

// el-autocomplete가 입력할 때마다 호출하는 콜백.
// queryString(사용자가 입력 중인 값)으로 도시명/지역명을 매칭해 드롭다운에 보여줄 후보를 cb로 전달한다.
const querySearch = (queryString, cb) => {
  const keyword = queryString.trim()
  const results = keyword
    ? weatherStore.cityLocation.filter(
        (city) => city.name.includes(keyword) || city.region.includes(keyword),
      )
    : weatherStore.cityLocation

  cb(results.map((city) => ({ value: city.name, region: city.region })))
}

// 사용자가 직접 타이핑할 때마다 store.searchKeyword를 갱신 → filteredCityLocation이 즉시 재계산됨
const onInput = (value) => {
  weatherStore.searchKeyword = value
}

// 드롭다운에서 항목을 클릭/선택할 때: 선택한 도시명으로 검색어를 확정
const onSelect = (item) => {
  weatherStore.searchKeyword = item.value
}
</script>

<template>
  <div class="search-wrap">
    <el-autocomplete
      class="search-autocomplete"
      :model-value="weatherStore.searchKeyword"
      :fetch-suggestions="querySearch"
      placeholder="도시 검색"
      clearable
      @update:model-value="onInput"
      @select="onSelect"
    >
      <template #prefix>
        <svg class="icon" viewBox="0 0 24 24" width="16" height="16" fill="none">
          <circle cx="11" cy="11" r="7" stroke="#98a2ae" stroke-width="2" />
          <line
            x1="16.5"
            y1="16.5"
            x2="21"
            y2="21"
            stroke="#98a2ae"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </template>
      <template #default="{ item }">
        <span class="option-name">{{ item.value }}</span>
        <span class="option-region">{{ item.region }}</span>
      </template>
    </el-autocomplete>
  </div>
</template>

<style scoped>
.search-wrap {
  width: 260px;
}

.search-autocomplete {
  width: 100%;
}

.icon {
  flex-shrink: 0;
  margin-left: 4px;
}

.option-name {
  margin-right: 8px;
  font-size: 13px;
}

.option-region {
  font-size: 12px;
  color: #98a2ae;
}
</style>

<style>
.search-autocomplete .el-input__wrapper {
  padding: 9px 16px;
  background: #f5f6f8;
  border-radius: 999px;
  box-shadow: none;
}

.search-autocomplete .el-input__wrapper.is-focus {
  background: #eef4fc;
  box-shadow: none;
}

.search-autocomplete .el-input__inner {
  font-size: 13px;
}
</style>
