import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/mainpage/index.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login/index.vue')
    },
    {
      path: '/dataExcel',
      name: 'dataExcel',
      component: () => import('../views/excel/index.vue')
    },
    // {
    //   path: '/dataExcel',
    //   name: 'dataExcel',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

window.configItem = null

router.beforeEach(async (to, from) => {
  if (!window.configItem) {
    try {
      let data = await fetch('/config.json').then(response => { return response.json() })
      if (data.configItem) {
        window.configItem = data.configItem
      } else {
        alert('配置文件错误')
      }
    } catch (error) {
      alert('配置文件缺失')
    }
  }
  if (!window.configItem)
    return false
  if (!sessionStorage.token && to.name !== 'login')
    return { name: 'login' }
  // if (
  //   // 检查用户是否已登录
  //   !isAuthenticated &&
  //   // ❗️ 避免无限重定向
  //   to.name !== 'Login'
  // ) {
  //   // 将用户重定向到登录页面
  //   return { name: 'Login' }
  // }
})
export default router
