<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const cityImages = import.meta.glob('/src/asset/city_images/*.jpg', {
  eager: true,
  import: 'default',
})

const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
})

const router = useRouter()

const cardImage = computed(() => {
  const entry = Object.entries(cityImages).find(([path]) =>
    path.endsWith(`/${props.city.id}.jpg`),
  )
  return entry ? entry[1] : null
})

const coordText = computed(() => `${props.city.lat.toFixed(2)}°N · ${props.city.lon.toFixed(2)}°E`)

const moveDetail = () => {
  router.push({
    name: 'detail',
    params: {
      id: props.city.id,
    },
  })
}
</script>

<template>
  <div
    class="card"
    :class="{ selected }"
    :style="cardImage ? { backgroundImage: `url(${cardImage})` } : {}"
    @click="moveDetail"
  >
    <div class="scrim" />

    <span class="region">{{ city.region }}</span>

    <div class="card-bottom">
      <div class="place">
        <h3 class="name">{{ city.name }}</h3>
        <p class="coords">{{ coordText }}</p>
      </div>
      <span class="detail-link">상세보기 →</span>
    </div>
  </div>
</template>

<style scoped>
.card {
  position: relative;
  aspect-ratio: 3 / 4;
  border-radius: 18px;
  overflow: hidden;
  background: linear-gradient(135deg, #3a4456, #1e2530);
  background-size: cover;
  background-position: center;
  color: #fff;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 24px rgba(20, 24, 33, 0.25);
}

.card.selected {
  outline: 2px solid #4a7fd4;
}

.scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.75) 0%,
    rgba(0, 0, 0, 0.2) 45%,
    rgba(0, 0, 0, 0.05) 100%
  );
}

.region {
  position: absolute;
  top: 14px;
  left: 16px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  opacity: 0.85;
}

.card-bottom {
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 14px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
}

.name {
  margin: 0 0 3px;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.2;
}

.coords {
  margin: 0;
  font-size: 10.5px;
  font-family: ui-monospace, 'SF Mono', monospace;
  opacity: 0.75;
}

.detail-link {
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 600;
  opacity: 0.85;
  white-space: nowrap;
  transition: opacity 0.15s ease;
}

.card:hover .detail-link {
  opacity: 1;
}
</style>