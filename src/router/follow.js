import orders from '@/components/business/follow/orders'
import goods from '@/components/business/follow/goods'
import index from '@/components/business/common/null'

let router = [
  {
    path: 'follow',
    component: index,
    children: [
      {
        path: 'orders',
        component: orders,
        meta: {
          title: '慧管理-追单订单明细',
          requiresAuth: true
        }
      },
      {
        path: 'goods',
        component: goods,
        meta: {
          title: '慧管理-追单产品明细',
          requiresAuth: true
        }
      }
    ]
  }
]

export default router
