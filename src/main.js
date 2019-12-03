import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import 'lib-flexible'
import '@/utils/appback.js'

//  用户登录验证
import { getUserInfo } from "@/utils/user"
import { closeGuide } from "@/utils/guide"

import { Table, TableColumn } from "element-ui"

import { Button, PullRefresh, RadioGroup, Radio, Field, Notify, Popup, Uploader, DatetimePicker, Picker, Sticky, Loading, Toast, Tab, Tabs, SwipeCell, Cell, CellGroup, Checkbox, CheckboxGroup, Dialog, List, Lazyload, Skeleton, Image  } from 'vant';

Vue.use(Table)
   .use(TableColumn)
   .use(Button)
   .use(PullRefresh)
   .use(RadioGroup)
   .use(Radio)
   .use(Field)
   .use(Notify)
   .use(Popup)
   .use(Uploader)
   .use(Picker)
   .use(DatetimePicker)
   .use(Sticky)
   .use(Loading)
   .use(Toast)
   .use(Tab)
   .use(Tabs)
   .use(SwipeCell)
   .use(Cell)
   .use(CellGroup)
   .use(Checkbox)
   .use(CheckboxGroup)
   .use(Dialog)
   .use(List)
   .use(Lazyload)
   .use(Skeleton)
   .use(Image)

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  // next()
  let isLogin = getUserInfo()
  let guideShow = localStorage.getItem('guideShow')
  if(!guideShow && to.path != '/guide') {
    next({name: 'guide'})
    closeGuide()
  }else {
    if(to.path != '/login' && !isLogin && to.path != '/guide') {
      next({name: 'login'})
    }else {
      next()
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
