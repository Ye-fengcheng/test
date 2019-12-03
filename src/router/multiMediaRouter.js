
import nll from '@/components/business/common/null'
import index from '@/components/business/multiMedia/index'
import downLoad from '@/components/business/multiMedia/downLoad'
let router = [
  {
    path:'multiMedia',
    component:nll,
    children:[
      {
        path:'index/:id',
        component:index,
        meta: { 
          title:'内容管理'
        }
      },
      {
        path:'downLoad',
        component:downLoad,
        meta: { 
          title:'导出下载'
        }
      }
    ]
  }
]
export default router;