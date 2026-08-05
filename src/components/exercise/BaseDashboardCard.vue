<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <section class="panel">
    <h3 v-if="title" class="panel-title">{{ title }}</h3>
    <slot />
  </section>
</template>

<style scoped>
.panel {
  margin-bottom: 14px;
  padding: 12px;
}

.panel-title {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 700;
}
</style>
