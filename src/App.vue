<template>
  <el-container class="layout-container">
    <el-header class="layout-header">Header</el-header>
    <el-container>
      <el-aside class="layout-aside">
        <el-menu default-active="2" class="el-menu-vertical-demo" :router="true">
          <el-menu-item index="/flow">
            <span>G6流程图</span>
          </el-menu-item>
          <el-menu-item index="/calc">
            <span>计算公式</span>
          </el-menu-item>
          <el-menu-item index="/createFile">
            <span>页面配置生成</span>
          </el-menu-item>
          <el-menu-item index="/cut-file">
            <span>文件切割</span>
          </el-menu-item>
          <!-- add-menu -->
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>
<style scoped lang="scss">
.layout-container {
  height: 100vh;
  .layout-header {
    line-height: 60px;
    border-bottom: 1px solid #e6e6e6;
  }
  .layout-aside {
    border-right: 1px solid #e6e6e6;
    width: 200px;
  }
}
</style>
