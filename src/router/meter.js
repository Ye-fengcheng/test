import F01 from '@/components/business/meter/F01'
import F02 from '@/components/business/meter/F02'
import F03 from '@/components/business/meter/F03'
import M01 from '@/components/business/meter/M01'
import M02 from '@/components/business/meter/M02'
import M03 from '@/components/business/meter/M03'
import H01 from '@/components/business/meter/H01'
import C01 from '@/components/business/meter/C01'
import ind from '@/components/business/meter/index'
import detail from '@/components/business/meter/detail'
import index from '@/components/business/common/null'
import welcome from '@/components/business/common/welcome'
let router = [
  {
    path:'meter',
    component:index,
    children:[
      {
        path:'welcome',
        component:welcome,
        meta: { 
          title:'慧管理-欢迎页'
        }
      },
      {
        path:'index',
        component:ind,
        meta: { 
          title:'慧管理-数据导入查看'
        }
      },
      {
        path:'detail',
        component:detail,
        meta: { 
          title:'慧管理-业务预览图'
        }
      },
      {
        path:'F01/:id',
        component:F01,
        meta: { 
          title:'慧管理-财务F01'
        }
      },
      {
        path:'F02/:id',
        component:F02,
        meta: { 
          title:'慧管理-财务F02'
        }
      },
      {
        path:'F03/:id',
        component:F03,
        meta: { 
          title:'慧管理-财务F03'
        }
      },
      {
        path:'M01/:id',
        component:M01,
        meta: { 
          title:'慧管理-市场M01'
        }
      },
      {
        path:'M02/:id',
        component:M02,
        meta: { 
          title:'慧管理-市场M02'
        }
      },
      {
        path:'M03/:id',
        component:M03,
        meta: { 
          title:'慧管理-市场M03'
        }
      },
      {
        path:'H01/:id',
        component:H01,
        meta: { 
          title:'慧管理-人事H01'
        }
      },
      {
        path:'C01/:id',
        component:C01,
        meta: { 
          title:'慧管理-客服C01'
        }
      }
    ]
  }
]
export default router;