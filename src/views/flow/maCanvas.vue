<template>
  <div id="ma-canvas"></div>
</template>

<script setup>
import MAG6 from './maG6'

import { ref, onMounted } from 'vue'
const ma = ref(null)
const initMaG6 = function () {
  ma.value = new MAG6({
    id: 'ma-canvas',
    scrollBox: 'scroll-box',
    data: [
      { id: 'node1', type: 'card', name: 'node1', success: ['node2', 'node3', 'node4'] },
      { id: 'node2', type: 'card', name: 'node2', success: ['node5', 'node6'] },
      { id: 'node5', type: 'card', name: 'node5', success: [] },
      { id: 'node6', type: 'card', name: 'node6', success: [] },
      { id: 'node3', type: 'card', name: 'node3', success: ['node7', 'node8'] },
      { id: 'node7', type: 'card', name: 'node7', success: [] },
      { id: 'node8', type: 'card', name: 'node8', success: ['node88', 'node89', 'node90', 'node91'] },
      { id: 'node88', type: 'card', name: 'node88', success: [] },
      { id: 'node89', type: 'card', name: 'node89', success: [] },
      { id: 'node90', type: 'card', name: 'node90', success: [] },
      { id: 'node91', type: 'card', name: 'node91', success: [] },
      { id: 'node4', type: 'card', name: 'node4', success: ['node9', 'node10'] },
      { id: 'node9', type: 'card', name: 'node9', success: ['node11'] },
      { id: 'node11', type: 'card', name: 'node11', success: [] },
      { id: 'node10', type: 'card', name: 'node10', success: [] },
    ],
  })
}

onMounted(() => {
  initMaG6()
})
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
}
#ma-canvas {
  width: 100%;
  height: 100%;
}
</style>
