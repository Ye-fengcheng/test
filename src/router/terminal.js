import customer from '@/components/business/terminal/customer'
import customerDetail from '@/components/business/terminal/customerDetail'
import otherCustomerDetail from '@/components/business/terminal/otherCustomerDetail'
import customerContact from '@/components/business/terminal/customerContact'
import otherCustomerContact from '@/components/business/terminal/otherCustomerContact'
import dbContact from '@/components/business/terminal/dbContact'
import customerDbDetail from '@/components/business/terminal/customerDbDetail'
import otherCustomer from '@/components/business/terminal/otherCustomer'
import customerDB from '@/components/business/terminal/customerDB'
import customerChangeInfo from '@/components/business/terminal/customerChangeInfo'
import organizationRelationShipInfo from '@/components/business/terminal/organizationRelationShipInfo'
import ClientRoleSet from '@/components/business/terminal/ClientRoleSet'
import log from '@/components/business/terminal/log'
import empLog from '@/components/business/terminal/empLog'
import menu from '@/components/business/terminal/menu'
import role from '@/components/business/terminal/role'
import employees from '@/components/business/terminal/employees'
import organization from '@/components/business/terminal/organization'
import organizationBP from '@/components/business/terminal/organizationBP'
import dbList from '@/components/business/terminal/dbList'
import addDb from '@/components/business/terminal/addDb'
import addOrganization from '@/components/business/terminal/addOrganization'
import addRole from '@/components/business/terminal/addRole'
import editRole from '@/components/business/terminal/editRole'
import hccManage from '@/components/business/terminal/hccManage'
import dbUpload from '@/components/business/terminal/dbUpload'
import index from '@/components/business/common/null'
let router = [
  {
    path:'terminal',
    component:index,
    children:[
      {
        path:'customer',
        component:customer,
        meta: { 
          title:'客户信息'
        }
      },
      {
        path:'otherCustomerDetail/:id/:type',
        component:otherCustomerDetail,
        meta: { 
          title:'其他客户详情'
        }
      }, 
      {
        path:'customerDetail/:id/:type',
        component:customerDetail,
        meta: { 
          title:'客户详情'
        }
      }, 
      {
        path:'customerDbDetail/:id/:type',
        component:customerDbDetail,
        meta: { 
          title:'分销商详情'
        }
      }, 
      {
        path:'customerContact/:id',
        component:customerContact,
        meta: { 
          title:'专卖店合同历史'
        }
      },
      {
        path:'otherCustomerContact/:id',
        component:otherCustomerContact,
        meta: { 
          title:'客户合同历史'
        }
      }, 
      {
        path:'dbContact/:id/:type',
        component:dbContact,
        meta: { 
          title:'分销商合同历史'
        }
      },        
      {
        path:'ClientRoleSet',
        component:ClientRoleSet,
        meta: { 
          title:'客户角色管理'
        }
      },
      {
        path:'customerChangeInfo',
        component:customerChangeInfo,
        meta: { 
          title:'专卖店转让信息'
        }
      }, 
      {
        path:'organizationRelationShipInfo',
        component:organizationRelationShipInfo,
        meta: { 
          title:'组织结构关系快照'
        }
      },           
      {
        path:'dbList',
        component:dbList,
        meta: { 
          title:'DB关系列表'
        }
      },
      {
        path:'dbUpload',
        component:dbUpload,
        meta: { 
          title:'上传DB关系'
        }
      },
      {
        path:'addDb',
        component:addDb,
        meta: { 
          title:'添加Db'
        }
      },      
      {
        path:'organization',
        component:organization,
        meta: { 
          title:'组织结构'
        }
      }, 
      {
        path:'organizationBP',
        component:organizationBP,
        meta: { 
          title:'组织结构'
        }
      },
      {
        path:'addOrganization',
        component:addOrganization,
        meta: { 
          title:'组织结构'
        }
      },           
      {
        path:'otherCustomer',
        component:otherCustomer,
        meta: { 
          title:'其他客户信息'
        }
      },      
      {
        path:'customerDB',
        component:customerDB,
        meta: { 
          title:'客户信息(分销商)'
        }
      },      
      {
        path:'log',
        component:log,
        meta: { 
          title:'专卖店登录日志'
        }
      },
      {
        path:'empLog',
        component:empLog,
        meta: { 
          title:'员工登录日志'
        }
      },
      {
        path:'menu',
        component:menu,
        meta: { 
          title:'菜单管理'
        }
      },
      {
        path:'role/:id',
        component:role,
        meta: { 
          title:'角色管理'
        }
      },
      {
        path:'addRole/:id',
        component:addRole,
        meta: { 
          title:'角色管理'
        }
      },
      {
        path:'editRole/:id/:itemId',
        component:editRole,
        meta: { 
          title:'角色编辑'
        }
      },
      {
        path:'employees',
        component:employees,
        meta: { 
          title:'员工管理'
        }
      },
      {
        path:'hccManage',
        component:hccManage,
        meta: { 
          title:'店员管理'
        }
      }      
    ]
  }
]
export default router;