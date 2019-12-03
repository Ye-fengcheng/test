import clientProStock from '@/components/business/psi/clientProStock'
import stockLog from '@/components/business/psi/stockLog'
import saleImportLog from '@/components/business/psi/saleImportLog'
import index from '@/components/business/common/null'
let router = [
  {
    path: 'psi',
    component: index,
    children: [
      {
        path: 'clientProStock',
        component: clientProStock,
        meta: {
          title: '产品库存综合'
        }
      },
      {
        path: 'stockLog',
        component: stockLog,
        meta: {
          title: '产品库存流水'
        }
      },
      {
        path: 'saleImportLog',
        component: saleImportLog,
        meta: {
          title: '销售录入'
        }
      }
    ]
  }
]
export default router
