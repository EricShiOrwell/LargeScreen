import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

import App from './App.vue'
import router from './router'

window.CESIUM_BASE_URL = '/Cesium/';

const app = createApp(App)

app.use(Antd)

app.use(createPinia())
app.use(router)

app.mount('#app')
