import psmPersonList from '@/components/business/psm/psmPersonList'
import psmPersonDetail from '@/components/business/psm/psmPersonDetail'
import psmPersonDel from '@/components/business/psm/psmPersonDel'
import index from '@/components/business/common/null'
let router = [
  {
    path: 'psm',
    component: index,
    children: [
      {
        path: 'psmPersonList',
        component: psmPersonList,
        meta: {
          title: 'PSM管理'
        }
      },
      {
        path: 'psmPersonDetail',
        component: psmPersonDetail,
        meta: {
          title: 'PSM人员详情'
        }
      },
      {
        path: 'psmPersonDel',
        component: psmPersonDel,
        meta: {
          title: 'PSM删除历史'
        }
      }
    ]
  }
]
export default router
