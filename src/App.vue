<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import UnitToggler from './components/exercise/UnitToggler.vue'

const route = useRoute()

const activeIndex = computed(() => {
  if (route.path === '/') return 0
  if (route.path.startsWith('/about')) return 1
  if (route.name === 'notFound') return 2
  return -1
})

const today = new Date().toLocaleDateString('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'short',
})
</script>

<template>
  <div class="layout">
    <aside class="sidebar">
      <nav class="nav">
        <div
          class="nav-indicator"
          :style="{
            transform: `translateY(${activeIndex * 52}px)`,
            opacity: activeIndex === -1 ? 0 : 1,
          }"
        />

        <RouterLink to="/" class="nav-link" :class="{ 'is-active': activeIndex === 0 }">
          <svg class="nav-icon" viewBox="0 0 24 24" width="16" height="16" fill="none">
            <path
              d="M4 11.5 12 4l8 7.5"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M6 10v9h12v-9"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>Home</span>
        </RouterLink>
        <RouterLink to="/about" class="nav-link" :class="{ 'is-active': activeIndex === 1 }">
          <svg class="nav-icon" viewBox="0 0 24 24" width="16" height="16" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" />
            <line
              x1="12"
              y1="11"
              x2="12"
              y2="16"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
            <circle cx="12" cy="7.5" r="1" fill="currentColor" />
          </svg>
          <span>About</span>
        </RouterLink>
        <RouterLink to="/not-found" class="nav-link" :class="{ 'is-active': activeIndex === 2 }">
          <svg class="nav-icon" viewBox="0 0 24 24" width="16" height="16" fill="none">
            <path
              d="M12 4 21 19H3z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <line
              x1="12"
              y1="10"
              x2="12"
              y2="14"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
            <circle cx="12" cy="16.5" r="1" fill="currentColor" />
          </svg>
          <span>NotFound</span>
        </RouterLink>
      </nav>

      <div class="unit-wrap">
        <UnitToggler />
      </div>

      <p class="today">{{ today }}</p>
    </aside>

    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  min-height: 100vh;
  padding: 24px;
  background: #f5f6f8;
  box-sizing: border-box;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 250px;
  flex-shrink: 0;
  padding: 24px 16px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 24px;
  height: calc(100vh - 48px);
  box-sizing: border-box;
}

.unit-wrap {
  margin-top: auto;
  padding-top: 16px;
}

.today {
  margin: 0;
  padding-top: 18px;
  font-size: 13px;
  color: #57606a;
  text-align: center;
  border-top: 1px solid #e5e7eb;
}

.nav {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  background: #2ecc71;
  border-radius: 10px;
  box-shadow: 0 6px 14px rgba(46, 204, 113, 0.35);
  transition:
    transform 0.28s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.2s ease;
  z-index: 0;
}

.nav-link {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  height: 44px;
  padding: 0 14px;
  border-radius: 10px;
  font-weight: 600;
  color: #24292f;
  text-decoration: none;
  box-sizing: border-box;
  transition: color 0.15s ease;
}

.nav-icon {
  flex-shrink: 0;
  color: inherit;
}

.nav-link:hover {
  background: #f0f2f5;
}

.nav-link.is-active {
  color: #fff;
}

.nav-link.is-active:hover {
  background: transparent;
}

.content {
  flex: 1;
  min-width: 0;
}
</style>
