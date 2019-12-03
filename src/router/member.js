import dateView from '@/components/business/member/dateView'
import weekView from '@/components/business/member/weekView'
import monthView from '@/components/business/member/monthView'
import memberBackStoreReport from '@/components/business/member/memberBackStoreReport'
import storeReportCoupon from '@/components/business/member/storeReportCoupon'
import bennefitReport from '@/components/business/member/bennefitReport'
import couponUsageDetail from '@/components/business/member/couponUsageDetail'
import index from '@/components/business/common/null'
let router = [
  {
    path:'member',
    component:index,
    children:[
      {
        path:'dateView',
        component:dateView,
        meta: { 
          title:'会员招募日报表'
        }
      },
      {
        path:'weekView',
        component:weekView,
        meta: { 
          title:'会员招募周报表'
        }
      },
      {
        path:'monthView',
        component:monthView,
        meta: { 
          title:'会员招募月报表'
        }
      },      
      {
        path:'memberBackStoreReport',
        component:memberBackStoreReport,
        meta: { 
          title:'会员回店报表'
        }
      },
      {
        path:'storeReportCoupon',
        component:storeReportCoupon,
        meta: { 
          title:'优惠券使用统计(店)'
        }
      },
      {
        path:'bennefitReport',
        component:bennefitReport,
        meta: { 
          title:'优惠券效益报表'
        }
      },
      {
        path:'couponUsageDetail',
        component:couponUsageDetail,
        meta: { 
          title:'优惠券使用明细'
        }
      }      
    ]
  }
]
export default router;