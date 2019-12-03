import setTime from '@/components/business/weekly/setTime'
import dataList from '@/components/business/weekly/dataList'
import index from '@/components/business/common/null'
let router = [
  {
    path:'weekly',
    component:index,
    children:[
      {
        path:'setTime',
        component:setTime,
        meta: { 
          requiresAuth: false ,//需要验证登录
          title:'专卖店周报/月报时间设置'
        }
      },
      {
        path:'dataList',
        component:dataList,
        meta: { 
          requiresAuth: false ,//需要验证登录
          title:'专卖店周报/月报列表'
        }
      }
    ]
  }
]
export default router;