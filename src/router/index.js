import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/home.vue'
import About from '@/views/about.vue'
import calc from '@/views/calc/index.vue'
import flow from '@/views/flow/index.vue'
import createFile from '@/views/createFile/index.vue'

const routes = [
  { path: '/home', component: Home },
  { path: '/about', component: About },
  { path: '/calc', component: () => import('@/views/calc/index.vue') },
  { path: '/flow', component: () => import('@/views/flow/index.vue') },
  { path: '/createFile', component: createFile },
  // add-router
	{ path: '/cut-file', component: () => import('@/views/cut-file/index.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
