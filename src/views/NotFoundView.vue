<script setup>
// [404 화면]
// WeatherDetailView에서 존재하지 않는 city id로 들어왔을 때 router.replace로 이곳에 도착한다.
import { useRouter } from 'vue-router'
import notFoundCat from '@/asset/404_cat.png'

const router = useRouter() // "대시보드로 돌아가기" 버튼 클릭 시 홈으로 이동시키기 위함
const goBackRoot = () => {
  router.push('/')
}
</script>

<template>
  <div class="wrap">
    <img class="cat" :src="notFoundCat" alt="404" />
    <button class="cta" @click="goBackRoot">대시보드로 돌아가기</button>
  </div>
</template>

<style scoped>
.wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 420px;
  padding: 32px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
  text-align: center;
}

.cat {
  width: 740px;
  height: auto;
}

.code {
  margin: 0 0 8px;
  font-size: 56px;
  font-weight: 800;
  letter-spacing: 0.02em;
  color: #dbe0e6;
}

.title {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 700;
  color: #24292f;
}

.desc {
  margin: 0 0 24px;
  font-size: 13px;
  color: #98a2ae;
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
