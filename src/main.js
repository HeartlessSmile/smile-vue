import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index'
import { ElMessage, ElMessageBox } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'
const app = createApp(App)
app.use(router)
app.use(ElMessage)
app.use(ElMessageBox)
app.mount('#app')
