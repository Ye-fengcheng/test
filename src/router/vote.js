import voteSetup from '@/components/business/vote/voteSetup'
import voteCheck from '@/components/business/vote/voteCheck'
import voteLog from '@/components/business/vote/voteLog'
import addVote from '@/components/business/vote/addVote'
import editVote from '@/components/business/vote/editVote'
import issueCoupon from '@/components/business/vote/issueCoupon'
import index from '@/components/business/common/null'
let router = [
  {
    path: 'vote',
    component: index,
    children: [
      {
        path: 'voteSetup',
        component: voteSetup,
        meta: {
          title: '投票设置'
        }
      },
      {
        path: 'voteCheck',
        component: voteCheck,
        meta: {
          title: '报名审核'
        }
      },
      {
        path: 'voteLog',
        component: voteLog,
        meta: {
          title: '投票日志'
        }
      },
      {
        path: 'addVote',
        component: addVote,
        meta: {
          title: '新增投票'
        }
      },
      {
        path: 'editVote',
        component: editVote,
        meta: {
          title: '编辑投票'
        }
      },
      {
        path: 'issueCoupon',
        component: issueCoupon,
        meta: {
          title: '批量发奖'
        }
      }
    ]
  }
]
export default router
