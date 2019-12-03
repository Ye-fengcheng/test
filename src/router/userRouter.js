
import customerAccount from '@/components/business/user/customerAccount'
import createCustomerAccount from '@/components/business/user/createCustomerAccount'

import index from '@/components/business/common/null'
let router = [
  {
    path:'user',
    component:index,
    children:[
      {
        path:'customerAccount',
        component:customerAccount,
        meta: { 
          requiresAuth: false ,//需要验证登录
          title:'用户-客户账号'
        }
      },
      {
        path:'createCustomerAccount',
        component:createCustomerAccount,
        meta: { 
          requiresAuth: false ,//需要验证登录
          title:'用户-创建客户账号'
        }
      }
    ]
  }
]
export default router;