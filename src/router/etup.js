import combineList from '@/components/business/etup/combineList'
import addCombine from '@/components/business/etup/addCombine'
import editCombine from '@/components/business/etup/editCombine'
import index from '@/components/business/common/null'
let router = [
  {
    path: 'etup',
    component: index,
    children: [
      {
        path: 'combineList',
        component: combineList,
        meta: {
          title: '组合优惠列表'
        }
      },
      {
        path: 'addCombine',
        component: addCombine,
        meta: {
          title: '新建组合'
        }
      },
      {
        path: 'editCombine',
        component: editCombine,
        meta: {
          title: '编辑组合'
        }
      }
    ]
  }
]
export default router
