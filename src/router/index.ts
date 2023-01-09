import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'
import { useUserStore } from '@/stores/user'
import { trackRouter } from "vue-gtag-next";
import { registerGuard } from "./Guard";
import NProgress from 'nprogress'

const routes = setupLayouts(generatedRoutes)
const currentRoute = useRoute()

const router = createRouter({
  //history: createWebHistory(),
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView,
    // },
    ...routes,
  ],
  
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// router.beforeEach((to, _, next) => {
//   const userStore = useUserStore()
//   //const isAuthenticated = useIsAuthenticated()
//   const { isLoggedIn, isAdmin} = storeToRefs(userStore)
//   document.title = to.meta?.title as string|| to.name as string || 'Unknown'
//  if (to.meta.requiresAuth && !isLoggedIn.value) {
// //  if ( !isLoggedIn.value) {
//    return next({ name: 'not-authorized', query: { redirect: to.fullPath }})
//    //return next()
//   } else {
//     return next()
//   }
// })

router.beforeEach((to, from, next) => {
  console.log('path ' + to.path)
  if (to.path !== from.path) {
    NProgress.start()
  }
  next()
})

router.afterEach(() => {
  NProgress.done()
})

registerGuard(router);

trackRouter(router, {
  template(to, from) {
    const userStore = useUserStore()
    const { userId, userCompany, userType } = storeToRefs(userStore)
    return {
      page_title:  document.title,
      page_path: to.fullPath,
      user_id: userId.value,
      user_type: userType.value,
      user_company: userCompany.value
    }
  }
})

export default router
