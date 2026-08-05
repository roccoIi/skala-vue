<script setup>
defineProps({
  query: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['updateQuery'])

const onInput = (e) => {
  emit('updateQuery', e.target.value)
}
</script>

<template>
  <div class="search-wrap">
    <div class="search-box">
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
      <input
        class="search"
        type="text"
        placeholder="도시 검색"
        :value="query"
        @input="onInput"
      />
    </div>
  </div>
</template>

<style scoped>
.search-wrap {
  width: 260px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  background: #f5f6f8;
  border-radius: 999px;
  box-sizing: border-box;
  transition: background 0.15s ease;
}

.search-box:focus-within {
  background: #eef4fc;
}

.icon {
  flex-shrink: 0;
}

.search {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
}
</style>
