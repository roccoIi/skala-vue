<script setup>
//[섭씨/화씨 전환 스위치]
// 클릭 → weatherStore.changeCelsius()가 store의 celsius 값을 토글
//      → celsius를 참조하는 모든 화면(홈 카드, 현재 위치, 상세 페이지)의 온도 표시가 즉시 갱신
import { useWeatherStore } from '@/stores/weatherStore.js'

const weatherStore = useWeatherStore()

// 스위치 클릭 시 스토어의 changeCelsius를 호출해 전역 온도 단위를 토글
const cgCelsius = () => {
  weatherStore.changeCelsius()
}
</script>

<template>
  <div class="wrap">
    <span class="unit-text" :class="{ active: weatherStore.celsius }">°C</span>

    <button
      class="switch"
      :class="{ on: !weatherStore.celsius }"
      type="button"
      role="switch"
      :aria-checked="!weatherStore.celsius"
      @click="cgCelsius"
    >
      <span class="knob" />
    </button>

    <span class="unit-text" :class="{ active: !weatherStore.celsius }">°F</span>
  </div>
</template>

<style scoped>
.wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.unit-text {
  font-size: 12px;
  font-weight: 600;
  color: #98a2ae;

  &.active {
    color: #24292f;
  }
}

.switch {
  position: relative;
  width: 36px;
  height: 20px;
  padding: 0;
  border: none;
  border-radius: 999px;
  background: #d0d7de;
  cursor: pointer;
  transition: background 0.2s ease;

  &.on {
    background: #2ecc71;
  }
}

.knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
}

.switch.on .knob {
  transform: translateX(16px);
}
</style>
