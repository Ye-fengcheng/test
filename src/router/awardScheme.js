import awardList from '@/components/business/awardScheme/awardList'
import awardAdd from '@/components/business/awardScheme/awardAdd'
import index from '@/components/business/common/null'
let router = [
  {
    path: 'awardScheme',
    component: index,
    children: [
      {
        path: 'awardList',
        component: awardList,
        meta: {
          title: '奖励管理'
        }
      },
      {
        path: 'awardAdd',
        component: awardAdd,
        meta: {
          title: '奖励管理'
        }
      }
    ]
  }
]
export default router
