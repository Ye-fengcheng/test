import activity from '@/components/business/activity/activity'
import activityAdd from '@/components/business/activity/activityAdd'
import activityEdit from '@/components/business/activity/activityEdit'
import activityList from '@/components/business/activity/activityList'
import activityRecord from '@/components/business/activity/activityRecord'
import index from '@/components/business/common/null'
let router = [
  {
    path: 'activity',
    component: index,
    children: [
      {
        path: 'activity',
        component: activity,
        meta: {
          title: '查看活动'
        }
      },
      {
        path: 'activityAdd',
        component: activityAdd,
        meta: {
          title: '发布活动'
        }
      },
      {
        path: 'activityEdit',
        component: activityEdit,
        meta: {
          title: '修改活动'
        }
      },
      {
        path: 'activityList',
        component: activityList,
        meta: {
          title: '活动列表'
        }
      },
      {
        path: 'activityRecord',
        component: activityRecord,
        meta: {
          title: '预约记录'
        }
      }
    ]
  }
]
export default router
