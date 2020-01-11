import router from './router'
import store from './store'
import { Message } from 'element-ui'
// 是一个进度条插件
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// 白名单
const whiteList = ['/login'] // no redirect whitelist

// 路由守卫, 路由跳转之前执行
router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken() // 获取当前的token值
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' }) // 跳转到主页
      NProgress.done() // 结束进度条
    } else {
      const hasGetUserInfo = store.getters.name // 获取用户信息
      if (hasGetUserInfo) {
        // 包含用户信息
        next()
      } else {
        try {
          // get user info 获取用户信息
          await store.dispatch('user/getInfo') // 派发action

          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken') // 清空token
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // 当前跳转到的地址包含在不需要登录的白名单中
      // in the free login whitelist, go directly
      next() // 基础执行
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`) // 跳转到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
