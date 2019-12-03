

import login from '@/components/business/annualMetting/login'
import order from '@/components/business/annualMetting/order'
import orderList from '@/components/business/annualMetting/orderList'
import orderListKf from '@/components/business/annualMetting/orderListKf'
import index from '@/components/business/common/null'
let router = {
  path: '/annualMeeting',
  name: 'annualMeeting',
  component: index,
  children: [
    {
      path:'login',
      component:login,
      meta: { 
        title:'特百惠特卖平台-登陆'
      }
    },
    {
      path:'order',
      component:order,
      meta: { 
        title:'特百惠特卖平台-员工下单'
      }
    },
    {
      path:'orderList',
      component:orderList,
      meta: { 
        title:'特百惠特卖平台-财务订单查询'
      }
    },
    {
      path:'orderListKf',
      component:orderListKf,
      meta: { 
        title:'特百惠特卖平台-客服订单查询'
      }
    }
  ]
}
export default router;