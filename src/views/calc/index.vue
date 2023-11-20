<template>
  <div>
    <EditTextArea ref="editor" v-model="text" v-modal:textArr="textArr" />
    <!-- <EditTextArea  v-model="text1" contentId="isk"  /> -->
  </div>
</template>

<script setup>
import EditTextArea from './edit-textarea.vue'
import { ref, onMounted } from 'vue'
const text = ref('12345')
const text1 = ref('9876')
const editor = ref(null)

onMounted(() => {
  // 获取编辑器内容
  // setTimeout(() => {
  //   text.value = '000000000'
  // }, 1000)
})
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
}
</style>
