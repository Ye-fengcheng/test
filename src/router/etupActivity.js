import maintain from '@/components/business/etupActivity/maintain'
import probability from '@/components/business/etupActivity/probability'
import activityLog from '@/components/business/etupActivity/activityLog'
import index from '@/components/business/common/null'
let router = [
  {
    path: 'etupActivity',
    component: index,
    children: [
      {
        path: 'maintain',
        component: maintain,
        meta: {
          title: '活动维护'
        }
      },
      {
        path: 'probability',
        component: probability,
        meta: {
          title: '中奖概率设置'
        }
      },
      {
        path: 'activityLog',
        component: activityLog,
        meta: {
          title: '活动日志(会员)'
        }
      }
    ]
  }
]
export default router
