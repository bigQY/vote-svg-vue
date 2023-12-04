import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/votes',
    },
    {
      path: '/votes',
      name: 'votes',
      component: () => import('../views/VoteListView.vue')
    }
  ]
})

export default router
