import classification from '@/components/business/product/classification'
import onSale from '@/components/business/product/onSale'
import limit from '@/components/business/product/limit'
import inventoryTracking from '@/components/business/product/inventoryTracking'
import inventoryTrackingKit from '@/components/business/product/inventoryTrackingKit'
import boConfig from '@/components/business/product/boConfig'
import boUpload from '@/components/business/product/boUpload'
import boList from '@/components/business/product/boList'
import productQuota from '@/components/business/product/productQuota'
import addProductQuota from '@/components/business/product/addProductQuota'
import productImport from '@/components/business/product/productImport'
import productBaseImport from '@/components/business/product/productBaseImport'
import productStatusImport from '@/components/business/product/productStatusImport'
import productQuotaUsed from '@/components/business/product/productQuotaUsed'
import storeQuota from '@/components/business/product/storeQuota'
import storeQuotaUsed from '@/components/business/product/storeQuotaUsed'
import areaQuota from '@/components/business/product/areaQuota'
import areaQuotaUsed from '@/components/business/product/areaQuotaUsed'
import addQuota from '@/components/business/product/addQuota'
import addStoreQuota from '@/components/business/product/addStoreQuota'
import proportionArea from '@/components/business/product/proportionArea'
import productDetail from '@/components/business/product/productDetail'
import productClassImport from '@/components/business/product/productClassImport'
import productClassification from '@/components/business/product/productClassification'
import productDetailHgl from '@/components/business/product/productDetailHgl'
import hotProduct from '@/components/business/product/hotProduct'
import proportionProvince from '@/components/business/product/proportionProvince'
import addProportionP from '@/components/business/product/addProportionP'
import addKitProduct from '@/components/business/product/addKitProduct'
import addProportionC from '@/components/business/product/addProportionC'
import proportionOutlet from '@/components/business/product/proportionOutlet'
import proportionProvinceImport from '@/components/business/product/proportionProvinceImport'
import proportionOutletImport from '@/components/business/product/proportionOutletImport'
import addPruductImg from '@/components/business/product/addPruductImg'
import specifiedGive from '@/components/business/product/specifiedGive'
import specifiedGiveImport from '@/components/business/product/specifiedGiveImport'
import quotaHistory from '@/components/business/product/quotaHistory'
import index from '@/components/business/common/null'
let router = [
  {
    path:'product',
    component:index,
    children:[
      {
        path:'classification',
        component:classification,
        name:'product-classification',
        meta: { 
          title:'产品分类'
        }
      },
      {
        path:'specifiedGive',
        component:specifiedGive,
        meta: { 
          title:'指定赠送'
        }
      },
      {
        path:'specifiedGiveImport',
        component:specifiedGiveImport,
        meta: { 
          title:'上传指定赠送'
        }
      },      
      {
        path:'onSale',
        component:onSale,
        name:'onsale',
        meta: { 
          title:'产品上架维护'
        }
      },      
      {
        path:'addProportionP',
        component:addProportionP,
        meta: { 
          title:'批量创建区域/省办订货比例'
        }
      },
      {
        path:'addProportionC',
        component:addProportionC,
        meta: { 
          title:'批量创建门店订货比例'
        }
      },
      {
        path:'productImport',
        component:productImport,
        meta: { 
          title:'产品上传'
        }
      }, 
      {
        path:'addKitProduct',
        component:addKitProduct,
        meta: { 
          title:'添加Kit产品'
        }
      },            
      {
        path:'addPruductImg',
        component:addPruductImg,
        meta: { 
          title:'批量导入产品图片'
        }
      },
      {
        path:'limit',
        component:limit,
        name:'product-limit',
        meta: { 
          title:'可定范围'
        }
      },
      {
        path:'inventoryTracking',
        component:inventoryTracking,
        meta: { 
          title:'库存跟踪'
        }
      },
      {
        path:'inventoryTrackingKit',
        component:inventoryTrackingKit,
        meta: { 
          title:'Kit库存跟踪'
        }
      },
      {
        path:'boConfig',
        component:boConfig,
        meta: { 
          title:'BO配置'
        }
      },
      {
        path:'boUpload',
        component:boUpload,
        meta: { 
          title:'BO上传日志'
        }
      },      
      {
        path:'boList',
        component:boList,
        meta: { 
          title:'BO流水'
        }
      },
      {
        path:'productQuota',
        component:productQuota,
        meta: { 
          title:'产品配额'
        }
      },
      {
        path:'addProductQuota',
        component:addProductQuota,
        meta: { 
          title:'批量创建产品配额'
        }
      },      
      {
        path:'productQuotaUsed',
        component:productQuotaUsed,
        meta: { 
          title:'产品配额使用记录'
        }
      },
      {
        path:'quotaHistory',
        component:quotaHistory,
        meta: { 
          title:'配额操作流水'
        }
      },      
      {
        path:'storeQuota',
        component:storeQuota,
        meta: { 
          title:'门店配额'
        }
      },
      {
        path:'storeQuotaUsed',
        component:storeQuotaUsed,
        meta: { 
          title:'门店配额使用记录'
        }
      },     
      {
        path:'addStoreQuota',
        component:addStoreQuota,
        meta: { 
          title:'批量创建门店配额'
        }
      },      
      {
        path:'areaQuota',
        component:areaQuota,
        meta: { 
          title:'区域配额'
        }
      },
      {
        path:'areaQuotaUsed',
        component:areaQuotaUsed,
        meta: { 
          title:'区域省办配额使用记录'
        }
      },
      {
        path:'proportionArea',
        component:proportionArea,
        meta: { 
          title:'订货比例区域'
        }
      },
      {
        path:'proportionProvince',
        component:proportionProvince,
        meta: { 
          title:'订货比例省办'
        }
      },
      {
        path:'proportionOutletImport',
        component:proportionOutletImport,
        meta: { 
          title:'慧管理-上传门店订货比例'
        }
      },
      {
        path:'proportionProvinceImport',
        component:proportionProvinceImport,
        meta: { 
          title:'慧管理-上传区域省办订货比例'
        }
      },      
      {
        path:'proportionOutlet',
        component:proportionOutlet,
        meta: { 
          title:'订货比例门店'
        }
      },
      {
        path:'productDetail/:pCode',
        component:productDetail,
        meta: { 
          title:'产品详情',
          notKeepAlive:true
        }
      },
      {
        path:'addQuota',
        component:addQuota,
        meta: { 
          title:'批量创建配额'
        }
      },
      {
        path:'productClassImport',
        component:productClassImport,
        meta: { 
          title:'慧管理-产品分类数据导入'
        }
      },
      {
        path:'productClassification',
        component:productClassification,
        meta: { 
          title:'慧管理-产品数据查看'
        }
      },
      {
        path:'productBaseImport',
        component:productBaseImport,
        meta: { 
          title:'会生意-批量上传产品基础信息'
        }
      },
      {
        path:'productStatusImport',
        component:productStatusImport,
        meta: { 
          title:'会生意-批量上传上下架信息'
        }
      },      
      {
        path:'productDetailHgl/:itemNo/:rowId',
        component:productDetailHgl,
        meta: { 
          title:'慧管理-产品详情'
        }
      },
      {
        path:'hotProduct',
        component:hotProduct,
        meta: { 
          title:'慧管理-重点热卖数据查看'
        }
      }        
    ]
  }
]
export default router;