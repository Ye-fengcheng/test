import productSet from '@/components/business/oe/productSet'
import oeDetail from '@/components/business/oe/oeDetail'
import oeUpload from '@/components/business/oe/oeUpload'
import paramSet from '@/components/business/oe/paramSet'
import index from '@/components/business/common/null'
let router = [
  {
    path: 'oe',
    component: index,
    children: [
      {
        path: 'productSet',
        component: productSet,
        meta: {
          title: '预估产品设置'
        }
      },
      {
        path: 'oeDetail',
        component: oeDetail,
        meta: {
          title: '预估定量明细'
        }
      },
      {
        path: 'oeUpload',
        component: oeUpload,
        meta: {
          title: '预估定量明细上传'
        }
      },
      {
        path: 'paramSet',
        component: paramSet,
        meta: {
          title: '填报时间设置'
        }
      }
    ]
  }
]
export default router
