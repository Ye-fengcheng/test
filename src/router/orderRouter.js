import orderManage from '@/components/business/order/orderManage'
import orderDetailList from '@/components/business/order/orderDetailList'
import orderBackendManage from '@/components/business/order/orderBackendManage'
import orderForCs from '@/components/business/order/orderForCs'
import backOrderForCs from '@/components/business/order/backendOrder/orderForCs'
import backOrderDetailList from '@/components/business/order/backendOrder/orderDetailList'
import orderPlan from '@/components/business/order/orderPlan'
import orderForFinance from '@/components/business/order/orderForFinance'
import deliverConfirm from '@/components/business/order/deliverConfirm'
import deliverConfirmLog from '@/components/business/order/deliverConfirmLog'
import customerOrders from '@/components/business/order/customerOrders'
import customerOrderGoods from '@/components/business/order/customerOrderGoods'
import specialOrder from '@/components/business/order/backendOrder/specialOrder'
import specialOrderList from '@/components/business/order/backendOrder/specialOrderList'
import specialOrderReturnList from '@/components/business/order/backendOrder/specialOrderReturnList'
import specialOrderImport from '@/components/business/order/backendOrder/specialOrderImport'
import specialOrderImportList from '@/components/business/order/backendOrder/specialOrderImportList'
import backOrderEdit from '@/components/business/order/backendOrder/backOrderEdit'
import backTzOrderEdit from '@/components/business/order/backendOrder/backTzOrderEdit'
import sfProductOrder from '@/components/business/order/backendOrder/sfProductOrder'
import sfProductOrderList from '@/components/business/order/backendOrder/sfProductOrderList'
import sfProductOrderReturnList from '@/components/business/order/backendOrder/sfProductOrderReturnList'
import sfProductOrderImport from '@/components/business/order/backendOrder/sfProductOrderImport'
import sfProductOrderImportList from '@/components/business/order/backendOrder/sfProductOrderImportList'
import sjProductOrder from '@/components/business/order/backendOrder/sjProductOrder'
import sjProductOrderList from '@/components/business/order/backendOrder/sjProductOrderList'
import sjProductOrderReturnList from '@/components/business/order/backendOrder/sjProductOrderReturnList'
import sjProductOrderImport from '@/components/business/order/backendOrder/sjProductOrderImport'
import sjProductOrderImportList from '@/components/business/order/backendOrder/sjProductOrderImportList'
import sbProductOrder from '@/components/business/order/backendOrder/sbProductOrder'
import sbProductOrderList from '@/components/business/order/backendOrder/sbProductOrderList'
import sbProductOrderReturnList from '@/components/business/order/backendOrder/sbProductOrderReturnList'
import sbProductOrderImport from '@/components/business/order/backendOrder/sbProductOrderImport'
import sbProductOrderImportList from '@/components/business/order/backendOrder/sbProductOrderImportList'
import ssProductOrder from '@/components/business/order/backendOrder/ssProductOrder'
import ssProductOrderList from '@/components/business/order/backendOrder/ssProductOrderList'
import ssProductOrderReturnList from '@/components/business/order/backendOrder/ssProductOrderReturnList'
import ssProductOrderImport from '@/components/business/order/backendOrder/ssProductOrderImport'
import ssProductOrderImportList from '@/components/business/order/backendOrder/ssProductOrderImportList'
import srProductOrder from '@/components/business/order/backendOrder/srProductOrder'
import srProductOrderList from '@/components/business/order/backendOrder/srProductOrderList'
import srProductOrderReturnList from '@/components/business/order/backendOrder/srProductOrderReturnList'
import srProductOrderImport from '@/components/business/order/backendOrder/srProductOrderImport'
import srProductOrderImportList from '@/components/business/order/backendOrder/srProductOrderImportList'
import tzpOrder from '@/components/business/order/backendOrder/tzpOrder'
import tzpOrderList from '@/components/business/order/backendOrder/tzpOrderList'
import tzpOrderReturnList from '@/components/business/order/backendOrder/tzpOrderReturnList'
import tzpOrderImport from '@/components/business/order/backendOrder/tzpOrderImport'
import tzpOrderImportList from '@/components/business/order/backendOrder/tzpOrderImportList'
import tzmOrder from '@/components/business/order/backendOrder/tzmOrder'
import tzmOrderList from '@/components/business/order/backendOrder/tzmOrderList'
import tzmOrderReturnList from '@/components/business/order/backendOrder/tzmOrderReturnList'
import tzmOrderImport from '@/components/business/order/backendOrder/tzmOrderImport'
import tzmOrderImportList from '@/components/business/order/backendOrder/tzmOrderImportList'
import customerServiceApply from '@/components/business/order/customerServiceApply'
import returnOrderAndGoods from '@/components/business/order/returnOrderAndGoods'
import returnHistory from '@/components/business/order/returnHistory'
import orderDetail from '@/components/business/order/orderDetail'
import orderDetailView from '@/components/business/order/orderDetailView'
import orderDetailViewCs from '@/components/business/order/orderDetailViewCs'
import customerServiceApproveL from '@/components/business/order/customerServiceApproveL'
import customerServiceApproveAreaL from '@/components/business/order/customerServiceApproveAreaL'
import customerServiceApproveC from '@/components/business/order/customerServiceApproveC'
import customerServiceApproveB from '@/components/business/order/customerServiceApproveB'
import csOrderDetailView from '@/components/business/order/csOrderDetailView'
import csOrderDetailLogistics from '@/components/business/order/csOrderDetailLogistics'
import csOrderDetailSeniorCS from '@/components/business/order/csOrderDetailSeniorCS'
import csOrderDetailCustomerService from '@/components/business/order/csOrderDetailCustomerService'
import addOtherOrder from '@/components/business/order/addOtherOrder'
import index from '@/components/business/common/null'
let router = [
  {
    path: 'order',
    component: index,
    children: [
      {
        path:'orderManage',
        component:orderManage,
        meta: { 
          title:'订单综合查询'
        }
      },
      {
        path:'orderBackendManage',
        component:orderBackendManage,
        meta: { 
          title:'后台订单综合查询'
        }
      },
      {
        path:'orderDetailList',
        component:orderDetailList,
        meta: { 
          title:'订单明细查询'
        }
      },
      {
        path:'orderForFinance',
        component:orderForFinance,
        meta: { 
          title:'订单-财务审核'
        }
      },
      {
        path: 'orderForCs',
        component: orderForCs,
        meta: {
          title: '订单-客服审核'
        }
      },
      
      {
        path: 'backendOrder/orderForCs',
        component: backOrderForCs,
        meta: {
          title: '订单-客服审核'
        }
      },
      {
        path: 'backendOrder/orderDetailList',
        component: backOrderDetailList,
        meta: {
          title: '后台订单明细-客服审核'
        }
      },
      {
        path: 'orderPlan',
        component: orderPlan,
        meta: {
          title: '订单-下单计划'
        }
      },
      {
        path: 'deliverConfirm',
        component: deliverConfirm,
        meta: {
          title: '订单-发货确认单'
        }
      },
      {
        path: 'deliverConfirmLog',
        component: deliverConfirmLog,
        meta: {
          title: '订单-发货确认单操作日志'
        }
      },
      {
        path: 'customerOrders',
        component: customerOrders,
        meta: {
          title: '订单-客户跟单-跟单订单明细'
        }
      },
      {
        path: 'customerOrderGoods',
        component: customerOrderGoods,
        meta: {
          title: '订单-客户跟单-跟单产品明细'
        }
      },
      {
        path: 'backendOrder/specialOrder',
        component: specialOrder,
        meta: {
          title: '订单-后台单创建-S2特殊订单'
        }
      },
      {
        path: 'backendOrder/specialOrderImport',
        component: specialOrderImport,
        meta: {
          title: '订单-后台单创建-S2特殊订单导入'
        }
      }, 
      {
        path: 'backendOrder/specialOrderImportList/:id',
        component: specialOrderImportList,
        meta: {
          title: '订单-后台单创建-S2特殊订单导入列表'
        }
      },    
      {
        path: 'backendOrder/specialOrderList',
        component: specialOrderList,
        meta: {
          title: '后台订单-后台单创建-S2特殊订单'
        }
      }, 
      {
        path: 'backendOrder/specialOrderReturnList',
        component: specialOrderReturnList,
        meta: {
          title: '后台订单-后台单创建-驳回S2特殊订单'
        }
      },            
      {
        path: 'backendOrder/sfProductOrder',
        component: sfProductOrder,
        meta: {
          title: '订单-后台单创建-SF产品申请表'
        }
      },
      {
        path: 'backendOrder/sfProductOrderImport',
        component: sfProductOrderImport,
        meta: {
          title: '订单-后台单创建-SF产品申请表导入'
        }
      }, 
      {
        path: 'backendOrder/sfProductOrderImportList/:id',
        component: sfProductOrderImportList,
        meta: {
          title: '订单-后台单创建-SF产品申请表导入列表'
        }
      },    
      {
        path: 'backendOrder/sfProductOrderList',
        component: sfProductOrderList,
        meta: {
          title: '后台订单-后台单创建-SF产品申请表列表'
        }
      }, 
      {
        path: 'backendOrder/sfProductOrderReturnList',
        component: sfProductOrderReturnList,
        meta: {
          title: '后台订单-后台单创建-驳回SF产品申请表'
        }
      },
      {
        path: 'backendOrder/sjProductOrder',
        component: sjProductOrder,
        meta: {
          title: '订单-后台单创建-SJ内部申请表'
        }
      },
      {
        path: 'backendOrder/sjProductOrderImport',
        component: sjProductOrderImport,
        meta: {
          title: '订单-后台单创建-SJ内部申请表导入'
        }
      }, 
      {
        path: 'backendOrder/sjProductOrderImportList/:id',
        component: sjProductOrderImportList,
        meta: {
          title: '订单-后台单创建-SJ内部申请表导入列表'
        }
      },    
      {
        path: 'backendOrder/sjProductOrderList',
        component: sjProductOrderList,
        meta: {
          title: '后台订单-后台单创建-SJ内部申请表列表'
        }
      }, 
      {
        path: 'backendOrder/sjProductOrderReturnList',
        component: sjProductOrderReturnList,
        meta: {
          title: '后台订单-后台单创建-驳回SJ内部申请表'
        }
      },
      {
        path: 'backendOrder/sbProductOrder',
        component: sbProductOrder,
        meta: {
          title: '订单-后台单创建-SB B2B订单'
        }
      },
      {
        path: 'backendOrder/sbProductOrderImport',
        component: sbProductOrderImport,
        meta: {
          title: '订单-后台单创建-SB B2B订单'
        }
      }, 
      {
        path: 'backendOrder/sbProductOrderImportList/:id',
        component: sbProductOrderImportList,
        meta: {
          title: '订单-后台单创建-SB B2B订单导入列表'
        }
      },    
      {
        path: 'backendOrder/sbProductOrderList',
        component: sbProductOrderList,
        meta: {
          title: '后台订单-后台单创建-SB B2B订单列表'
        }
      }, 
      {
        path: 'backendOrder/sbProductOrderReturnList',
        component: sbProductOrderReturnList,
        meta: {
          title: '后台订单-后台单创建-驳回SB B2B订单列表'
        }
      },
      {
        path: 'backendOrder/ssProductOrder',
        component: ssProductOrder,
        meta: {
          title: '订单-后台单创建-SS员工自购单'
        }
      },
      {
        path: 'backendOrder/ssProductOrderImport',
        component: ssProductOrderImport,
        meta: {
          title: '订单-后台单创建-SS员工自购单'
        }
      }, 
      {
        path: 'backendOrder/ssProductOrderImportList/:id',
        component: ssProductOrderImportList,
        meta: {
          title: '订单-后台单创建-SS员工自购单导入列表'
        }
      },    
      {
        path: 'backendOrder/ssProductOrderList',
        component: ssProductOrderList,
        meta: {
          title: '后台订单-后台单创建-SS员工自购单列表'
        }
      }, 
      {
        path: 'backendOrder/ssProductOrderReturnList',
        component: ssProductOrderReturnList,
        meta: {
          title: '后台订单-后台单创建-驳回SS员工自购单列表'
        }
      },
      {
        path: 'backendOrder/srProductOrder',
        component: srProductOrder,
        meta: {
          title: '订单-后台单创建-SR售后订单'
        }
      },
      {
        path: 'backendOrder/srProductOrderImport',
        component: srProductOrderImport,
        meta: {
          title: '订单-后台单创建-SR售后订单'
        }
      }, 
      {
        path: 'backendOrder/srProductOrderImportList/:id',
        component: srProductOrderImportList,
        meta: {
          title: '订单-后台单创建-SR售后订单导入列表'
        }
      },    
      {
        path: 'backendOrder/srProductOrderList',
        component: srProductOrderList,
        meta: {
          title: '后台订单-后台单创建-SR售后订单列表'
        }
      }, 
      {
        path: 'backendOrder/srProductOrderReturnList',
        component: srProductOrderReturnList,
        meta: {
          title: '后台订单-后台单创建-驳回SR售后订单列表'
        }
      },
      {
        path: 'backendOrder/tzpOrder',
        component: tzpOrder,
        meta: {
          title: '订单-后台单创建-正调整单'
        }
      },
      {
        path: 'backendOrder/tzpOrderImport',
        component: tzpOrderImport,
        meta: {
          title: '订单-后台单创建-正调整单'
        }
      }, 
      {
        path: 'backendOrder/tzpOrderImportList/:id',
        component: tzpOrderImportList,
        meta: {
          title: '订单-后台单创建-正调整单导入列表'
        }
      },    
      {
        path: 'backendOrder/tzpOrderList',
        component: tzpOrderList,
        meta: {
          title: '后台订单-后台单创建-正调整单列表'
        }
      }, 
      {
        path: 'backendOrder/tzpOrderReturnList',
        component: tzpOrderReturnList,
        meta: {
          title: '后台订单-后台单创建-驳回正调整单列表'
        }
      },
      {
        path: 'backendOrder/tzmOrder',
        component: tzmOrder,
        meta: {
          title: '订单-后台单创建-负调整单'
        }
      },
      {
        path: 'backendOrder/tzmOrderImport',
        component: tzmOrderImport,
        meta: {
          title: '订单-后台单创建-负调整单'
        }
      }, 
      {
        path: 'backendOrder/tzmOrderImportList/:id',
        component: tzmOrderImportList,
        meta: {
          title: '订单-后台单创建-负调整单导入列表'
        }
      },    
      {
        path: 'backendOrder/tzmOrderList',
        component: tzmOrderList,
        meta: {
          title: '后台订单-后台单创建-负调整单列表'
        }
      }, 
      {
        path: 'backendOrder/tzmOrderReturnList',
        component: tzmOrderReturnList,
        meta: {
          title: '后台订单-后台单创建-驳回负调整单列表'
        }
      },
      {
        path: 'customerServiceApply',
        component: customerServiceApply,
        meta: {
          title: '订单-售后申请-售后申请管理'
        }
      },
      {
        path: 'returnOrderAndGoods',
        component: returnOrderAndGoods,
        meta: {
          title: '订单-退单退货处理'
        }
      },
      {
        path: 'returnHistory',
        component: returnHistory,
        meta: {
          title: '订单-退单退货操作记录'
        }
      },      
      {
        path: 'backendOrder/backOrderEdit/:id/:type',
        component: backOrderEdit,
        meta: {
          title: '后台订单-后台订单修改'
        }
      },
      {
        path: 'backendOrder/backTzOrderEdit/:id/:type/:adjust',
        component: backTzOrderEdit,
        meta: {
          title: '后台订单-后台订单修改'
        }
      },
      {
        path: 'orderDetail/:orderNo',
        component: orderDetail,
        meta: {
          title: '订单-订单退货处理'
        }
      },
      {
        path: 'orderDetailView/:orderNo',
        component: orderDetailView,
        meta: {
          title: '订单-订单详情'
        }
      },
      {
        path: 'orderDetailViewCs/:orderNo',
        component: orderDetailViewCs,
        meta: {
          title: '订单-客服预览订单详情'
        }
      },
      {
        path: 'customerServiceApproveL',
        component: customerServiceApproveL,
        meta: {
          title: '订单-售后申请-物流审核'
        }
      },
      {
        path: 'customerServiceApproveAreaL',
        component: customerServiceApproveAreaL,
        meta: {
          title: '订单-售后申请-区域物流审核'
        }
      },
      {
        path: 'customerServiceApproveC',
        component: customerServiceApproveC,
        meta: {
          title: '订单-售后申请-制单客服审核'
        }
      },
      {
        path: 'customerServiceApproveB',
        component: customerServiceApproveB,
        meta: {
          title: '订单-售后申请-高级客服审核'
        }
      },
      {
        path: 'csOrderDetailView/:id',
        component: csOrderDetailView,
        meta: {
          title: '订单-售后申请-详情'
        }
      },
      {
        path: 'csOrderDetailLogistics/:id/:type',
        component: csOrderDetailLogistics,
        meta: {
          title: '订单-售后申请-物流审核'
        }
      },
      {
        path: 'csOrderDetailCustomerService/:id',
        component: csOrderDetailCustomerService,
        meta: {
          title: '订单-售后申请-制单客服审核'
        }
      },
      {
        path: 'csOrderDetailSeniorCS/:id',
        component: csOrderDetailSeniorCS,
        meta: {
          title: '订单-售后申请-高级客服审核'
        }
      },
      {
        path: 'addOtherOrder',
        component: addOtherOrder,
        meta: {
          title: '订单-售后申请-导入其他售后单'
        }
      }           
    ]
  }
]
export default router
