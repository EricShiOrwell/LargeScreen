import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/mainpage/HomeView.vue')
    }
  ]
})

window.configItem = null

router.beforeEach(async (to, from) => {

})
export default router
