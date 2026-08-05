import { createRouter, createWebHistory } from 'vue-router'
import WeatherHomeView from '../views/WeatherHomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: WeatherHomeView, // home은 페이지의 진입점이기에 static loading적용
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/WeatherAboutView.vue'), //Dynamic Loading을 적용하면서 Lazy Loading적용
    },
    {
      // :id는 WeatherCard 클릭 시 city.id(예: 'city_01')로 채워지고,
      // WeatherDetailView에서 route.params.id로 읽어 cityLocation 배열과 매칭한다.
      path: '/detail/:id',
      name: 'detail',
      component: () => import('../views/WeatherDetailView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router
