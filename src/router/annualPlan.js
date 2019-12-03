import profit from '@/components/business/annualPlan/profit'
import target from '@/components/business/annualPlan/target'
import paramSet from '@/components/business/annualPlan/paramSet'
import dbTarget from '@/components/business/annualPlan/dbTarget'
import index from '@/components/business/common/null'
let router = [
  {
    path: 'annualPlan',
    component: index,
    children: [
      {
        path: 'profit',
        component: profit,
        meta: {
          title: '微管理-专卖店净利润测算'
        }
      },
      {
        path: 'target',
        component: target,
        meta: {
          title: '微管理-专卖店目标预估'
        }
      },
      {
        path: 'paramSet',
        component: paramSet,
        meta: {
          title: '填报时间设置'
        }
      },
      {
        path: 'dbTarget',
        component: dbTarget,
        meta: {
          title: '微管理-DB目标分解'
        }
      }
    ]
  }
]
export default router
