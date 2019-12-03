import accountQuery from '@/components/business/account/accountQuery'
import moneyImport from '@/components/business/account/moneyImport'
import discountImport from '@/components/business/account/discountImport'
import discountList from '@/components/business/account/discountList'
import customerContacts from '@/components/business/account/customerContacts'
import underLine from '@/components/business/account/underLine'
import underLineDetail from '@/components/business/account/underLineDetail'
import underLineDetailView from '@/components/business/account/underLineDetailView'
import underLineForCs from '@/components/business/account/underLineForCs'
import underLineForFinance from '@/components/business/account/underLineForFinance'
import customerContactsFinance from '@/components/business/account/customerContactsFinance'
import onLine from '@/components/business/account/onLine'
import index from '@/components/business/common/null'
let router = [
  {
    path:'account',
    component:index,
    children:[
      {
        path:'accountQuery',
        component:accountQuery,
        meta: { 
          title:'FMS后台-账户查询'
        }
      },
      {
        path:'moneyImport',
        component:moneyImport,
        meta: { 
          title:'FMS后台-款项导入'
        }
      },
      {
        path:'discountImport',
        component:discountImport,
        meta: { 
          title:'FMS后台-折扣差导入'
        }
      },      
      {
        path:'discountList',
        component:discountList,
        meta: { 
          title:'FMS后台-折扣差流水'
        }
      },
      {
        path:'customerContacts',
        component:customerContacts,
        meta: { 
          title:'FMS后台-客户往来'
        }
      },
      {
        path:'customerContactsFinance',
        component:customerContactsFinance,
        meta: { 
          title:'FMS后台-客户往来(做账流水)'
        }
      },
      {
        path:'underLine',
        component:underLine,
        meta: { 
          title:'FMS后台-线下充值'
        }
      },
      {
        path:'underLineDetail/:id',
        component:underLineDetail,
        meta: { 
          title:'FMS后台-线下充值审核'
        }
      },
      {
        path:'underLineDetailView/:id',
        component:underLineDetailView,
        meta: { 
          title:'FMS后台-线下充值查看'
        }
      },
      {
        path:'underLineForFinance',
        component:underLineForFinance,
        meta: { 
          title:'FMS后台-线下充值财务审核'
        }
      },
      {
        path:'underLineForCs',
        component:underLineForCs,
        meta: { 
          title:'FMS后台-线下充值客服审核'
        }
      },
      {
        path:'onLine',
        component:onLine,
        meta: { 
          title:'FMS后台-线上充值'
        }
      }       
    ]
  }
]
export default router;