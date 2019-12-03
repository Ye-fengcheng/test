import advertList from '@/components/business/advertManage/advertList'
import addAdvert from '@/components/business/advertManage/addAdvert'
import index from '@/components/business/common/null'
let router = [
  {
    path: 'advertManage',
    component: index,
    children: [
      {
        path: 'advertList',
        component: advertList,
        meta: {
          title: '广告管理'
        }
      },
      {
        path: 'addAdvert',
        component: addAdvert,
        meta: {
          title: '添加广告'
        }
      }
    ]
  }
]
export default router
