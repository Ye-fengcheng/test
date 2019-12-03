import mssMemberList from '@/components/business/mssMember/mssMemberList'
import mssMemberDetail from '@/components/business/mssMember/mssMemberDetail'
import mssMemberTransfer from '@/components/business/mssMember/mssMemberTransfer'
import mssMemberBuy from '@/components/business/mssMember/mssMemberBuy'
import mssMemberModify from '@/components/business/mssMember/mssMemberModify'
import mssMemberLabel from '@/components/business/mssMember/mssMemberLabel'
import mssMemberEvent from '@/components/business/mssMember/mssMemberEvent'
import index from '@/components/business/common/null'
let router = [
  {
    path: 'mssMember',
    component: index,
    children: [
      {
        path: 'mssMemberList',
        component: mssMemberList,
        meta: {
          title: '会员管理-会员列表'
        }
      },
      {
        path: 'mssMemberDetail',
        component: mssMemberDetail,
        meta: {
          title: '会员管理-会员详情'
        }
      },
      {
        path: 'mssMemberTransfer',
        component: mssMemberTransfer,
        meta: {
          title: '会员管理-会员转移'
        }
      },
      {
        path: 'mssMemberBuy',
        component: mssMemberBuy,
        meta: {
          title: '会员管理-购买记录'
        }
      },
      {
        path: 'mssMemberModify',
        component: mssMemberModify,
        meta: {
          title: '会员管理-修改记录'
        }
      },
      {
        path: 'mssMemberLabel',
        component: mssMemberLabel,
        meta: {
          title: '会员管理-标签管理'
        }
      },
      {
        path: 'mssMemberEvent',
        component: mssMemberEvent,
        meta: {
          title: '会员管理-会员事件'
        }
      }
    ]
  }
]
export default router
