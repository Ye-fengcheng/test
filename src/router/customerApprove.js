import customerOpenApprove from '@/components/business/customerApprove/customerOpenApprove'
import customerOpeningApprove from '@/components/business/customerApprove/customerOpeningApprove'
import addCloseApprove from '@/components/business/customerApprove/addCloseApprove'
import openApproveDetail from '@/components/business/customerApprove/openApproveDetail'
import closeApproveDetail from '@/components/business/customerApprove/closeApproveDetail'
import closeDetail from '@/components/business/customerApprove/closeDetail'
import customerCloseApprove from '@/components/business/customerApprove/customerCloseApprove'
import allCustomerOpenApprove from '@/components/business/customerApprove/allCustomerOpenApprove'
import allCustomerCloseApprove from '@/components/business/customerApprove/allCustomerCloseApprove'
import allCustomerOpeningApprove from '@/components/business/customerApprove/allCustomerOpeningApprove'
import openDetail from '@/components/business/customerApprove/openDetail'
import openingDetail from '@/components/business/customerApprove/openingDetail'
import openingApproveDetail from '@/components/business/customerApprove/openingApproveDetail'
import index from '@/components/business/common/null'

let router = [
  {
    path: 'customerApprove',
    component: index,
    children: [
      {
        path: 'customerOpenApprove',
        component: customerOpenApprove,
        meta: {
          title: '慧管理-开业申请',
          requiresAuth: true
        }
      },
      {
        path: 'allCustomerOpenApprove',
        component: allCustomerOpenApprove,
        meta: {
          title: '慧管理-开业申请查询',
          requiresAuth: true
        }
      },
      {
        path: 'customerOpeningApprove',
        component: customerOpeningApprove,
        meta: {
          title: '慧管理-开店申请',
          requiresAuth: true
        }
      },
      {
        path: 'customerCloseApprove',
        component: customerCloseApprove,
        meta: {
          title: '慧管理-结业申请',
          requiresAuth: true
        }
      },
      {
        path: 'allCustomerCloseApprove',
        component: allCustomerCloseApprove,
        meta: {
          title: '慧管理-结业申请查询',
          requiresAuth: true
        }
      }, 
      {
        path: 'allCustomerOpeningApprove',
        component: allCustomerOpeningApprove,
        meta: {
          title: '慧管理-开店申请查询',
          requiresAuth: true
        }
      },           
      {
        path: 'addCloseApprove',
        component: addCloseApprove,
        meta: {
          title: '慧管理-发起结业申请',
          requiresAuth: true
        }
      },      
      {
        path: 'openApproveDetail/:id',
        component: openApproveDetail,
        meta: {
          title: '慧管理-开业申请详情',
          requiresAuth: true
        }
      },
      {
        path: 'closeApproveDetail/:id',
        component: closeApproveDetail,
        meta: {
          title: '慧管理-结业申请详情',
          requiresAuth: true
        }
      },
      {
        path: 'closeDetail/:id/:type',
        component: closeDetail,
        meta: {
          title: '慧管理-结业申请详情',
          requiresAuth: true
        }
      },
      {
        path: 'openDetail/:id/:type',
        component: openDetail,
        meta: {
          title: '慧管理-开业申请详情',
          requiresAuth: true
        }
      },
      {
        path: 'openingDetail/:id/:applyId/:type',
        component: openingDetail,
        meta: {
          title: '慧管理-开店申请详情',
          requiresAuth: true
        }
      },
      ,
      {
        path: 'openingApproveDetail/:id/:applyId',
        component: openingApproveDetail,
        meta: {
          title: '慧管理-开店申请详情',
          requiresAuth: true
        }
      }
    ]
  }
]

export default router
