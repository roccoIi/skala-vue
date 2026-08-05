<script setup>
// 프로젝트 소개용 정적 페이지.
import { useRouter } from 'vue-router'

const router = useRouter()
const goRootPage = () => {
  router.push('/')
}

// 상단 통계 카드 3개에 표시할 값 (하드코딩된 소개용 수치)
const stats = [
  { label: '등록된 도시', value: '20곳' },
  { label: '연동 API', value: '3개' },
  { label: '예보 간격', value: '3시간' },
]

// 개발 단계별 설명을 나열하는 타임라인 목록 (하드코딩)
const timeline = [
  { period: '1단계', text: '도시 이름과 임의의 기온을 나열하는 정적 목록으로 시작' },
  { period: '2단계', text: '지역·좌표 데이터를 분리하고, 검색으로 필터링되는 카드 그리드로 전환' },
  { period: '3단계', text: '실제 위경도로 날씨 API를 호출해 카드마다 실시간 값을 받아오도록 연결' },
  { period: '4단계', text: '상세 화면에 5일 예보, 위치 기반 날씨, 단위 토글을 붙여 지금 형태로' },
]
</script>

<template>
  <div class="wrap">
    <h2 class="title">프로젝트 설명</h2>

    <p class="lead">Vue 3 학습을 위해 만든 날씨 대시보드입니다.</p>

    <div class="stat-grid">
      <div v-for="s in stats" :key="s.label" class="stat">
        <span class="stat-value">{{ s.value }}</span>
        <span class="stat-label">{{ s.label }}</span>
      </div>
    </div>

    <div class="section">
      <h3>제작 순서</h3>
      <ol class="timeline">
        <li v-for="t in timeline" :key="t.period">
          <span class="period">{{ t.period }}</span>
          <span class="text">{{ t.text }}</span>
        </li>
      </ol>
    </div>

    <div class="section">
      <h3>사용 툴</h3>
      <p class="stack">Vue 3 · Vite · Pinia · Vue Router · Axios</p>
    </div>

    <p class="note">
      도시 카드에 있는 위경도 값은 정확한 행정 중심점이 아니라 대략적인 좌표입니다.
    </p>

    <button class="cta" @click="goRootPage">대시보드로 돌아가기</button>
  </div>
</template>

<style scoped>
.wrap {
  padding: 32px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
}

.title {
  margin: 0 0 16px;
  font-size: 22px;
  font-weight: 700;
  color: #24292f;
}

.lead {
  margin: 0 0 20px;
  font-size: 14px;
  line-height: 1.8;
  color: #444b52;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 28px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px;
  background: #f5f6f8;
  border-radius: 12px;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #24292f;
}

.stat-label {
  font-size: 11px;
  color: #98a2ae;
}

.section {
  margin-bottom: 24px;
}

.section h3 {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 700;
  color: #24292f;
}

.timeline {
  margin: 0;
  padding: 0;
  list-style: none;
}

.timeline li {
  display: flex;
  gap: 12px;
  padding: 10px 0;
  border-top: 1px solid #eef0f2;
  font-size: 13px;
  line-height: 1.6;
}

.timeline li:first-child {
  border-top: none;
}

.period {
  flex-shrink: 0;
  width: 44px;
  font-weight: 700;
  color: #4a7fd4;
}

.text {
  color: #57606a;
}

.stack {
  margin: 0;
  font-size: 13px;
  color: #57606a;
}

.note {
  margin: 0 0 28px;
  padding: 12px 14px;
  background: #f5f6f8;
  border-radius: 10px;
  font-size: 12px;
  line-height: 1.7;
  color: #6b7280;
}

.cta {
  padding: 9px 18px;
  background: #fff;
  color: #4a7fd4;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid #4a7fd4;
  border-radius: 8px;
  cursor: pointer;
}

.cta:hover {
  background: #eef4fc;
}
</style>
