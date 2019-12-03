import jgMsgList from '@/components/business/message/jgMsgList'
import jgMsgAdd from '@/components/business/message/jgMsgAdd'
import jgMsgEdit from '@/components/business/message/jgMsgEdit'
import jgMsgTypeList from '@/components/business/message/jgMsgTypeList'
import index from '@/components/business/common/null'
let router = [
  {
    path: 'message',
    component: index,
    children: [
      {
        path: 'jgMsgList',
        component: jgMsgList,
        meta: {
          title: '极光消息推送'
        }
      },
      {
        path: 'jgMsgTypeList',
        component: jgMsgTypeList,
        meta: {
          title: '推送类型管理'
        }
      },
      {
        path: 'jgMsgAdd',
        component: jgMsgAdd,
        meta: {
          title: '极光消息推送'
        }
      },
      {
        path: 'jgMsgEdit',
        component: jgMsgEdit,
        meta: {
          title: '极光消息推送'
        }
      }
    ]
  }
]
export default router
