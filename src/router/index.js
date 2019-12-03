import Vue from 'vue'
import Router from 'vue-router'
import { checkGuide } from "@/utils/guide"

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: to => {
        if(checkGuide()) {
          return '/course'
        }else {
          return '/guide'
        }
      }
    },
    
    /* 引导页 */
    { 
      path: '/guide',
      name: 'guide',
      /* webpackChunkName: "guide" */
      component: () => import('@/views/guide/index')
    },
    /* 引导页 */

    /* 课程 */
    {
      path: '/course',
      name: 'course',
      meta: { showFooter: true, keepAlive: true },
      /* webpackChunkName: "course" */ 
      component: () => import('@/views/course')
    },
    {
      path: '/course/courseDetail/:course', // 课程详情
      name: 'courseDetail',
      /* webpackChunkName: "courseDetail" */ 
      component: () => import('@/views/course/courseDetail')
    },
    /* 课程 */
    
    /* 考试 */
    {
      path: '/exam',
      name: 'exam',
      meta: { showFooter: true, keepAlive: true },
      /* webpackChunkName: "exam" */ 
      component: () => import('@/views/exam/index')
    },
    {
      path: '/exam/notes/:exam', // 考试须知
      name: 'examNotes',
      /* webpackChunkName: "examNotes" */ 
      component: () => import('@/views/exam/components/TestNotes')
    },
    {
      path: '/exam/questionSelsect', // 单项试题练习
      name: 'questionSelect',
      /* webpackChunkName: "questioinSelect" */ 
      component: () => import('@/views/exam/questionSelect')
    },
    {
      path: '/exam/answerTest/:exam', // 考试答题
      name: 'answerTest',
      /* webpackChunkName: "answerTest" */ 
      component: () => import('@/views/exam/answerTest')
    },
    {
      path: '/exam/testExam', // 模拟考试
      name: 'testExam',
      /* webpackChunkName: "testExam" */ 
      component: () => import('@/views/exam/testExam'),
      meta: { keepAlive: true}
    },
    {
      path: '/exam/examResult/:result', // 考试结果
      name: 'examResult',
      /* webpackChunkName: "examResult" */ 
      component: () => import('@/views/exam/examResult')
    },

    /* 登录 */
    {
      path: '/login',
      name: 'login',
      /* webpackChunkName: "login" */ 
      component: () => import('@/views/login')
    },
    /* 登录 */

    /* 个人中心路由 */
    {
      path: '/mine',
      name: 'mine',
      meta: { showFooter: true, keepAlive: true },
      /* webpackChunkName: "mine" */ 
      component: () => import('@/views/mine')
    },
    {
      path: '/mine/userInfo', // 个人信息
      name: 'userInfo',
      /* webpackChunkName: "userInfo" */ 
      component: () => import('@/views/mine/userInfo')
    },
    {
      path: '/mine/userInfo/changeTel', // 修改手机号
      name: 'changeTel',
      /* webpackChunkName: "changeTel" */ 
      component: () => import('@/views/mine/changeTel')
    },
    {
      path: '/mine/userInfo/changeName', // 修改用户名
      name: 'changeName',
      /* webpackChunkName: "changeName" */ 
      component: () => import('@/views/mine/changeName')
    },
    {
      path: '/mine/message', // 消息
      name: 'message',
      /* webpackChunkName: "message" */ 
      component: () => import('@/views/mine/message')
    },
    {
      path: '/mine/message/:msg', // 消息详情
      name: 'msgDetail',
      /* webpackChunkName: "msgDetail" */ 
      component: () => import('@/views/mine/msgDetail')
    },
    {
      path: '/mine/order', // 工单
      name: 'taskList',
      /* webpackChunkName: "orderList" */ 
      component: () => import('@/views/mine/orderList')
    },
    {
      path: '/mine/myOrder', // 我上报的工单
      name: 'myOrder',
      /* webpackChunkName: "myOrderList" */ 
      component: () => import('@/views/mine/myOrderList')
    },
    {
      path: '/mine/createRepair', // 工单报修
      name: 'createRepair',
      /* webpackChunkName: "createRepair" */ 
      component: () => import('@/views/mine/createRepair')
    },
    {
      path: '/mine/order/:order', // 工单详情
      name: 'order',
      /* webpackChunkName: "createRepair" */ 
      component: () => import('@/views/mine/order')
    },
    {
      path: '/mine/workTable', // 值日表
      name: 'workTable',
      /* webpackChunkName: "workTable" */ 
      component: () => import('@/views/mine/workTable')
    },
    {
      path: '/mine/attendance', // 请假申请
      name: 'attendance',
      /* webpackChunkName: "attendance" */ 
      component: () => import('@/views/mine/attendance')
    },
    {
      path: '/mine/setting', // 设置页
      name: 'setting',
      /* webpackChunkName: "setting" */ 
      component: () => import('@/views/mine/setting')
    },
    {
      path: '/mine/setting/changePwd', // 修改密码
      name: 'changePwd',
      /* webpackChunkName: "changePass" */ 
      component: () => import('@/views/mine/setting/changePwd')
    },
    {
      path: '/mine/setting/feedBack', // 意见反馈
      name: 'feedBack',
      /* webpackChunkName: "feedBack" */ 
      component: () => import('@/views/mine/setting/feedBack')
    },
    /* 个人中心路由 */
  ]
})
