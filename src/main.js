// 앱 진입점: Vue 인스턴스를 만들고 전역 플러그인(Pinia 상태 관리, Vue Router, Element Plus UI)을 등록한 뒤
// #app 엘리먼트에 마운트한다. 이후 모든 화면 전환은 router가, 전역 상태 공유는 pinia가 담당한다.
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(createPinia()) // stores/weatherStore.js 등에서 useXxxStore()로 접근 가능하게 함
app.use(router) // App.vue의 <RouterView/>가 이 라우터의 현재 경로에 맞는 화면을 렌더링
app.use(ElementPlus) // SearchBar.vue의 el-autocomplete 등 Element Plus 컴포넌트 전역 등록

app.mount('#app')
