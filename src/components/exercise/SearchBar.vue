<script setup>
// [도시 검색창]
// weatherStore.searchKeyword를 직접 읽고 쓴다
// el-autocomplete는 :model-value로 store 값을 그대로 표시하고,
// @update:model-value로 타이핑마다 그 결과를 실시간으로 반영한다.
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useWeatherStore } from '@/stores/weatherStore.js'

const weatherStore = useWeatherStore()

// [한글 IME 실시간 반영 우회 처리]
// el-autocomplete가 내부적으로 감싸고 있는 el-input은 한글 조합 중(isComposing === true)에는
// @update:model-value 이벤트를 아예 발생시키지 않는다 (Element Plus의 의도된 동작 —
// 완성되지 않은 음절이 값으로 잡히는 걸 막기 위함). 그 결과 "부" 같은 음절이 완성되기 전까지는
// store.searchKeyword가 갱신되지 않아 카드 목록 필터링이 실시간으로 반영되지 않는 문제가 있었다.
// → el-autocomplete가 감싸고 있는 실제 <input> DOM 엘리먼트를 직접 찾아 네이티브 input 이벤트를
//   붙임으로써, Element Plus의 조합 중 이벤트 억제 로직을 우회하고 매 키 입력마다 store를 갱신한다.

const autocompleteRef = ref() // <el-autocomplete ref="autocompleteRef">로 컴포넌트 인스턴스를 참조하기 위한 템플릿 ref
let nativeInputEl = null // autocompleteRef를 통해 얻어올 실제 <input> DOM 엘리먼트 (반응형일 필요가 없어 일반 변수로 선언)

// 네이티브 input 이벤트 핸들러: 조합 중간 글자(예: 'ㅂ', '부', '부산' 진행 단계)까지 포함해
// DOM에 실제로 입력된 값(event.target.value)을 그대로 store에 반영한다.
const handleNativeInput = (event) => {
  weatherStore.searchKeyword = event.target.value
}

// 컴포넌트가 마운트된 뒤에야 el-autocomplete가 렌더링한 실제 DOM에 접근할 수 있으므로 onMounted에서 연결한다.
// autocompleteRef.value.inputRef는 el-autocomplete가 감싸고 있는 el-input 인스턴스,
// 그 인스턴스의 .ref가 진짜 <input> 엘리먼트다 (el-input이 expose로 노출).
onMounted(() => {
  nativeInputEl = autocompleteRef.value?.inputRef?.ref
  nativeInputEl?.addEventListener('input', handleNativeInput)
})

// 컴포넌트가 사라질 때 리스너를 정리해 메모리 누수/중복 등록을 방지한다.
onBeforeUnmount(() => {
  nativeInputEl?.removeEventListener('input', handleNativeInput)
})

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

// el-autocomplete가 조합 완료 후(또는 영문/숫자 등 조합이 필요 없는 입력 시) 발생시키는 update:model-value 핸들러.
// handleNativeInput이 이미 대부분의 경우 store를 갱신해두므로 사실상 같은 값을 한 번 더 쓰는 것이지만,
// el-autocomplete 내부 로직과의 정합성을 위해 남겨둔다.
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
      ref="autocompleteRef"
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
