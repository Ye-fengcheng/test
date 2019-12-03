
import product from '@/components/business/catalog/product'
import index from '@/components/business/common/null'
let router = [
  {
    path:'catalog',
    component:index,
    children:[
      {
        path:'product',
        component:product,
        meta: { 
          requiresAuth: false ,//需要验证登录
          title:'产品管理'
        }
      }
    ]
  }
]
export default router;