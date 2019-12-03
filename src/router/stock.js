import stockProductManage from '@/components/business/stock/stockProductManage'
import addstockProSetting from '@/components/business/stock/addstockProSetting'
import stockProDetail from '@/components/business/stock/stockProDetail'
import stockProEdit from '@/components/business/stock/stockProEdit'
import stockDataView from '@/components/business/stock/stockDataView' 
import index from '@/components/business/common/null'
let router = [
  {
    path:'stock',
    component:index,
    children:[
      {
        path:'stockDataView',
        component:stockDataView,
        meta: { 
          title:'库存盘点数据查看'
        }
      },      
      {
        path:'stockProductManage',
        component:stockProductManage,
        meta: { 
          title:'库存产品信息维护'
        }
      },
      {
        path:'addstockProSetting',
        component:addstockProSetting,
        meta: { 
          title:'库存产品信息创建'
        }
      },
      {
        path:'stockProDetail/:rowId',
        component:stockProDetail,
        meta: { 
          title:'库存产品信息详情'
        }
      },
      {
        path:'stockProEdit/:rowId',
        component:stockProEdit,
        meta: { 
          title:'库存产品信息修改'
        }
      }
    ]
  }
]
export default router;