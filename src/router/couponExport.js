import couponList from '@/components/business/couponExport/couponList'
import index from '@/components/business/common/null'
let router = [
  {
    path: 'couponExport',
    component: index,
    children: [
      {
        path: 'couponList',
        component: couponList,
        meta: {
          title: '优惠券数据下载'
        }
      }
    ]
  }
]
export default router
