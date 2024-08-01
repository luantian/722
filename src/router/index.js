import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import("@/views/Test.vue"), },
    { path: '/test', component: () => import("@/views/Test2.vue"), },
  ],
})

export default router