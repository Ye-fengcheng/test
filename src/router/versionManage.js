import versionList from '@/components/business/versionManage/versionList'
import index from '@/components/business/common/null'
let router = [
  {
    path: 'versionManage',
    component: index,
    children: [
      {
        path: 'versionList',
        component: versionList,
        meta: {
          title: '版本管理'
        }
      }
    ]
  }
]
export default router
