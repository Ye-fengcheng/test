import dbProvinceExamine from '@/components/business/db/dbProvinceExamine'
import examineProvince from '@/components/business/db/examineProvince'
import dbAreaExamine from '@/components/business/db/dbAreaExamine'
import examineArea from '@/components/business/db/examineArea'
import index from '@/components/business/common/null'
let router = [
  {
    path:'db',
    component:index,
    children:[
      {
        path:'dbProvinceExamine',
        component:dbProvinceExamine,
        meta: { 
          requiresAuth: false ,//需要验证登录
          title:'专卖店状态变更省办审核'
        }
      },
      {
        path:'examineProvince',
        component:examineProvince,
        meta: { 
          requiresAuth: false ,//需要验证登录
          title:'专卖店状态变更省办审核'
        }
      },
      {
        path:'dbAreaExamine',
        component:dbAreaExamine,
        meta: { 
          requiresAuth: false ,//需要验证登录
          title:'专卖店状态变更省办审核'
        }
      },
      {
        path:'examineArea',
        component:examineArea,
        meta: { 
          requiresAuth: false ,//需要验证登录
          title:'专卖店状态变更省办审核'
        }
      }
    ]
  }
]
export default router;