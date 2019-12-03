import warmHeartList from '@/components/business/warmHeart/warmHeartList'
import addWarmHeart from '@/components/business/warmHeart/addWarmHeart'
import index from '@/components/business/common/null'
let router = [
  {
    path: 'warmHeart',
    component: index,
    children: [
      {
        path: 'warmHeartList',
        component: warmHeartList,
        meta: {
          title: '卡片维护列表'
        }
      },
      {
        path: 'addWarmHeart',
        component: addWarmHeart,
        meta: {
          title: '卡片内容'
        }
      }
    ]
  }
]
export default router
