import Vue from 'vue'
import Router from 'vue-router'
import frame from '@/components/business/common/frame'
import printCustomer from '@/components/business/common/printCustomer'
import printDb from '@/components/business/common/printDb'
import frameNoLeft from '@/components/business/common/frameNoleft'
import login from '@/components/business/common/login'
import changePwdByPhone from '@/components/business/common/changePwdByPhone'
import password from '@/components/business/common/password'
import systemParam from '@/components/business/common/systemParam'
import systemParamTOSet from '@/components/business/common/systemParamTOSet'
import systemParamRSet from '@/components/business/common/systemParamRSet'
import systemParamLog from '@/components/business/common/systemParamLog'
import systemParamHolidaySet from '@/components/business/common/systemParamHolidaySet'
import systemParamFMonthSet from '@/components/business/common/systemParamFMonthSet'
import choose from '@/components/business/common/choose'
import { store } from '../store'
import annualMeetRouter from './annualMeetRouter'
import contentRouter from './contentRouter'
import orderRouter from './orderRouter'
import weeklyRouter from './weeklyRouter'
import catalogRouter from './catalogRouter'
import promotionRouter from './promotionRouter'
import userRouter from './userRouter'
import dbRouter from './dbRouter'
import multiMediaRouter from './multiMediaRouter'
import terminal from './terminal'
import account from './account'
import product from './product'
import welcome from '@/components/business/common/welcome'
import meter from './meter'
import activity from './activity'
import vote from './vote'
import psm from './psm'
import psi from './psi'
import oe from './oe'
import purchare from './purchare'
import member from './member'
import stock from './stock'
import follow from './follow'
import etup from './etup'
import etupActivity from './etupActivity'
import annualPlan from './annualPlan'
import giftExport from './giftExport'
import customerApprove from './customerApprove'
import couponExport from './couponExport'
import message from './message'
import mssMember from './mssMember'
import course from './course'
import awardScheme from './awardScheme'
import warmHeart from './warmHeart'
import printOpeningApprove from '@/components/business/common/printOpeningApprove'
import sourceInfo from './sourceInfo'
import versionManage from './versionManage'
import advertManage from './advertManage'

Vue.use(Router)

let mainRouter = {
  path: '/frame',
  component: frame,
  children: [
    {
      path: 'password',
      component: password
    },
    {
      path: 'systemParam',
      component: systemParam
    },
    {
      path: 'systemParamTOSet',
      component: systemParamTOSet
    },  
    {
      path: 'systemParamRSet',
      component: systemParamRSet
    }, 
    {
      path: 'systemParamLog',
      component: systemParamLog
    },  
    {
      path: 'systemParamHolidaySet',
      component: systemParamHolidaySet
    }, 
    {
      path: 'systemParamFMonthSet',
      component: systemParamFMonthSet
    },    
    {
      path: 'welcome',
      component: welcome
    },
    ...orderRouter,
    ...contentRouter,
    ...weeklyRouter,
    ...member,
    ...stock,
    ...catalogRouter,
    ...promotionRouter,
    ...userRouter,
    ...dbRouter,
    ...multiMediaRouter,
    ...terminal,
    ...account,
    ...follow,
    ...product,
    ...meter,
    ...activity,
    ...vote,
    ...psm,
    ...psi,
    ...oe,
    ...purchare,
    ...etupActivity,
    ...etup,
    ...annualPlan,
    ...giftExport,
    ...customerApprove,
    ...couponExport,
    ...message,
    ...mssMember,
    ...course,
    ...awardScheme,
    ...warmHeart,
    ...sourceInfo,
    ...versionManage,
    ...advertManage
  ]
}
let mainNoLeftRouter = {
  path: '/frameNoLeft',
  name: 'frameNoLeft',
  component: frameNoLeft,
  children: [
    ...weeklyRouter
  ]
}
let router = new Router({
  routes: [
    {
      path: '/',
      component: login
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/changePwdByPhone',
      component: changePwdByPhone
    },
    {
      path: '/choose',
      component: choose
    },
    {
      path: '/printCustomer/:id',
      component: printCustomer,
      meta: {
        title: '打印',
        requiresAuth: true
      }
    },
    {
      path: '/printDb/:id',
      component: printDb,
      meta: {
        title: '打印',
        requiresAuth: true
      }
    },
    {
      path: '/printOpeningApprove/:id/:applyId',
      component: printOpeningApprove,
      meta: {
        title: '打印',
        requiresAuth: true
      }
    },    
    mainRouter,
    annualMeetRouter,
    mainNoLeftRouter
  ]
})

router.beforeEach((to, from, next) => {
  to.matched.map(record => {
    let title = '特百惠统一管理平台'
    if (record.meta.title) {
      title = record.meta.title
    }
    document.title = title
  })
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!window.localStorage.getItem('token')) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  }

  next()
})
export default router
