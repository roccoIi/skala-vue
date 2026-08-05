<script setup>
defineProps({
  query: {
    type: String,
    default: '',
  },
})

// emit 이벤트 객체를 생성하고, 아래 텍스트 입력란에 입력이벤트가 발생할때마다 "onInput" function이 실행된다.
// 그리고 emit을 통해 부모컴포넌트로 업데이트된 query객체가 올라간다. -> weatherparent 컴포넌트로 넘어가서 계속 읽기 (1)
const emit = defineEmits(['updateQuery'])
const onInput = (e) => {
  emit('updateQuery', e.target.value)
}
</script>

<template>
  <div>
    <input type="text" placeholder="검색어를 입력하세요" :value="query" @input="onInput" />
  </div>
</template>

<style scoped></style>
