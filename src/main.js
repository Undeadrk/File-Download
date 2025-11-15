import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/style/main.css'
import { createPinia } from 'pinia'

import Vant from 'vant';


import 'vant/lib/index.css';


const app = createApp(App)
const pinia = createPinia()
app.use(router)
app.use(pinia)
app.use(Vant);
/*
TODO: 注册全局异常处理器
// 全局异常处理器
app.config.errorHandler = (err, vm, info) => {
  console.error('全局异常:', err)
  console.error('异常组件:', vm)
  console.error('异常信息:', info)
  
  // 可以在这里添加错误上报逻辑
  // 例如：将错误发送到错误监控服务
}

// 捕获未处理的Promise拒绝
window.addEventListener('unhandledrejection', event => {
  console.error('未处理的Promise拒绝:', event.reason)
  // 可以在这里添加错误上报逻辑
  event.preventDefault() // 阻止默认的控制台错误输出
})

*/

app.mount('#app')
