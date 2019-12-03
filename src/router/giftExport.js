import giftList from '@/components/business/giftExport/giftList'
import giftHandle from '@/components/business/giftExport/giftHandle'
import index from '@/components/business/common/null'

let router = [
  {
    path: 'giftExport',
    component: index,
    children: [
      {
        path: 'giftList',
        component: giftList,
        meta: {
          title: '高会礼品订单导出'
        }
      },
      {
        path: 'giftHandle',
        component: giftHandle,
        meta: {
          title: '高会礼品订单处理'
        }
      }
    ]
  }
]
export default router
