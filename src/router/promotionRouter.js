
import nll from '@/components/business/common/null'
import index from '@/components/business/promotion/index'
import addPromotion from '@/components/business/promotion/addPromotion'
import promotionGuide from '@/components/business/promotion/promotionGuide'
import promotionDetail from '@/components/business/promotion/promotionDetail'
import addOrderGuide from '@/components/business/promotion/addOrderGuide'
import addOrderGuideAC from '@/components/business/promotion/addOrderGuideAC'
import addOrderGuideKIT from '@/components/business/promotion/addOrderGuideKIT'
import addOrderGuideNew from '@/components/business/promotion/addOrderGuideNew'
import addOrderGuideDiscount from '@/components/business/promotion/addOrderGuideDiscount'
import orderPlan from '@/components/business/promotion/orderPlan'
import addOrderPlan from '@/components/business/promotion/addOrderPlan'
import editOrderGuideKIT from '@/components/business/promotion/editOrderGuideKIT'
import editOrderGuideDiscount from '@/components/business/promotion/editOrderGuideDiscount'
import editOrderGuideAC from '@/components/business/promotion/editOrderGuideAC'
import editOrderGuideNew from '@/components/business/promotion/editOrderGuideNew'
import editOrderGuide from '@/components/business/promotion/editOrderGuide'
import weeklyReport from '@/components/business/promotion/weeklyReport'
import promotionHistory from '@/components/business/promotion/promotionHistory'
import wadReport from '@/components/business/promotion/wadReport'
import monthlyReport from '@/components/business/promotion/monthlyReport'
import weeklyReportSet from '@/components/business/promotion/weeklyReportSet'
import viewOrderGuideDiscount from '@/components/business/promotion/viewOrderGuideDiscount'
import viewOrderGuideAC from '@/components/business/promotion/viewOrderGuideAC'
import viewOrderGuide from '@/components/business/promotion/viewOrderGuide'
let router = [
  {
    path:'promotion',
    component:nll,
    children:[
      {
        path:'index',
        component:index,
        meta: { 
          requiresAuth: true ,//需要验证登录
          title:'促销管理'
        }
      },
      {
        path:'orderPlan',
        component:orderPlan
      },
      {
        path:'addOrderPlan',
        component:addOrderPlan
      },
      {
        path:'addPromotion',
        component:addPromotion,
        meta: { 
          requiresAuth: true ,//需要验证登录
          title:'添加促销'
        }
      },
      {
        path:'promotionHistory',
        component:promotionHistory,
        meta: { 
          title:'促销管理日志'
        }
      },      
      {
        path:'promotionGuide/:promotionId/:promotionThemeType',
        component:promotionGuide,
        meta: { 
          title:'促销规则详情'
        }
      },
      {
        path:'promotionDetail/:promotionId/:promotionThemeType',
        component:promotionDetail,
        meta: { 
          title:'促销详情'
        }
      },
      {
        path:'addOrderGuide/:promotionId/:promotionThemeType',
        component:addOrderGuide,
        meta: { 
          title:'添加满单促销'
        }
      },
      {
        path:'addOrderGuideAC/:promotionId/:promotionThemeType',
        component:addOrderGuideAC,
        meta: { 
          title:'添加买赠促销'
        }
      },
      {
        path:'addOrderGuideKIT/:promotionId/:promotionThemeType',
        component:addOrderGuideKIT
      },
      {
        path:'addOrderGuideNew/:promotionId/:promotionThemeType',
        component:addOrderGuideNew
      },
      {
        path:'addOrderGuideDiscount/:promotionId/:promotionThemeType',
        component:addOrderGuideDiscount,
        meta: { 
          title:'添加优惠促销'
        }
      },
      {
        path:'editOrderGuideKIT/:promotionId/:itemId/:promotionThemeType',
        component:editOrderGuideKIT
      },
      {
        path:'editOrderGuideDiscount/:promotionId/:itemId/:promotionThemeType',
        component:editOrderGuideDiscount,
        meta: { 
          title:'编辑优惠促销'
        }
      },
      {
        path:'editOrderGuide/:promotionId/:itemId/:promotionThemeType',
        component:editOrderGuide,
        meta: { 
          title:'编辑满单促销'
        }
      },
      {
        path:'editOrderGuideAC/:promotionId/:itemId/:promotionThemeType',
        component:editOrderGuideAC,
        meta: { 
          title:'编辑买赠促销'
        }
      },
      {
        path:'viewOrderGuideDiscount/:promotionId/:itemId/:promotionThemeType',
        component:viewOrderGuideDiscount,
        meta: { 
          title:'查看优惠促销'
        }
      },
      {
        path:'viewOrderGuide/:promotionId/:itemId/:promotionThemeType',
        component:viewOrderGuide,
        meta: { 
          title:'查看满单促销'
        }
      },
      {
        path:'viewOrderGuideAC/:promotionId/:itemId/:promotionThemeType',
        component:viewOrderGuideAC,
        meta: { 
          title:'查看买赠促销'
        }
      },
      {
        path:'editOrderGuideNew/:promotionId/:itemId/:promotionThemeType',
        component:editOrderGuideNew
      },      
      {
        path:'weeklyReport',
        component:weeklyReport,
        meta: { 
          title:'周报查询'
        }
      },
      {
        path:'monthlyReport',
        component:monthlyReport,
        meta: { 
          title:'月报查询'
        }
      }, 
      {
        path:'weeklyReportSet',
        component:weeklyReportSet,
        meta: { 
          title:'周月报填写时间设置'
        }
      },      
      {
        path:'wadReport',
        component:wadReport,
        meta: { 
          title:'周月报跟踪'
        }
      }
    ]
  }
]
export default router;