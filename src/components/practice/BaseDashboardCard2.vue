<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <section>
    <h2>{{ title }}</h2>
    <slot />
  </section>
</template>

<style scoped></style>
