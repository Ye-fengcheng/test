import sourceBatch from '@/components/business/sourceInfo/sourceBatch'
import selectTemplate from '@/components/business/sourceInfo/selectTemplate'
import sourceBatchAdd from '@/components/business/sourceInfo/sourceBatchAdd'
import sourceTemplate from '@/components/business/sourceInfo/sourceTemplate'
import sourceTemplateAdd from '@/components/business/sourceInfo/sourceTemplateAdd'
import sourceBatchEdit from '@/components/business/sourceInfo/sourceBatchEdit'
import index from '@/components/business/common/null'
let router = [
  {
    path: 'sourceInfo',
    component: index,
    children: [
      {
        path: 'sourceBatch',
        component: sourceBatch,
        meta: {
          title: '批次查询'
        }
      },
      {
        path: 'selectTemplate',
        component: selectTemplate,
        meta: {
          title: '选择模板'
        }
      },
      {
        path: 'sourceBatchAdd',
        component: sourceBatchAdd,
        meta: {
          title: '新增批次'
        }
      },
      {
        path: 'sourceBatchEdit',
        component: sourceBatchEdit,
        meta: {
          title: '编辑批次'
        }
      },
      {
        path: 'sourceTemplate',
        component: sourceTemplate,
        meta: {
          title: '模板管理'
        }
      },
      {
        path: 'sourceTemplateAdd',
        component: sourceTemplateAdd,
        meta: {
          title: '编辑模板'
        }
      }
    ]
  }
]
export default router
