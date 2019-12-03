import boxingList from '@/components/business/purchare/boxingList'
import boxDetailQuery from '@/components/business/purchare/boxDetailQuery'
import boxQuery from '@/components/business/purchare/boxQuery'
import pickingList from '@/components/business/purchare/pickingList'
import pickingUpload from '@/components/business/purchare/pickingUpload'
import unshippedList from '@/components/business/purchare/unshippedList'
import index from '@/components/business/common/null'
let router = [
  {
    path: 'purchare',
    component: index,
    children: [
      {
        path: 'boxingList',
        component: boxingList,
        meta: {
          title: '装箱单汇总查询'
        }
      },
      {
        path: 'pickingList',
        component: pickingList,
        meta: {
          title: '拣货单明细查询'
        }
      },
      {
        path: 'unshippedList',
        component: unshippedList,
        meta: {
          title: '未发货产品查询'
        }
      },
      {
        path: 'boxDetailQuery/:id',
        component: boxDetailQuery,
        meta: {
          title: '关联装箱单查询'
        }
      },
      {
        path: 'boxQuery',
        component: boxQuery,
        meta: {
          title: '装箱单查询'
        }
      },
      {
        path: 'pickingUpload',
        component: pickingUpload,
        meta: {
          title: '物流单导入'
        }
      }
    ]
  }
]
export default router
