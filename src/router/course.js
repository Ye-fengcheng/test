import courseManage from '@/components/business/course/courseManage'
import courseAdd from '@/components/business/course/courseAdd'
import columnManage from '@/components/business/course/columnManage'
import columnAdd from '@/components/business/course/columnAdd'
import index from '@/components/business/common/null'
let router = [
  {
    path: 'course',
    component: index,
    children: [
      {
        path: 'courseManage',
        component: courseManage,
        meta: {
          title: '慧课堂-课件管理'
        }
      },
      {
        path: 'courseAdd',
        component: courseAdd,
        meta: {
          title: '慧课堂-课件管理'
        }
      },
      {
        path: 'columnManage',
        component: columnManage,
        meta: {
          title: '慧课堂-栏目管理'
        }
      },
      {
        path: 'columnAdd',
        component: columnAdd,
        meta: {
          title: '慧课堂-栏目管理'
        }
      }
    ]
  }
]
export default router
