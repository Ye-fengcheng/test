<template>
  <div class="epmsFrame">    
    <div>
      <frameNav :user-name="$storage.getName()">
        <!-- <el-button slot="project-left" type="primary">项目切换</el-button> -->
      </frameNav>
    </div>
    <div>
      <div ref="lm" style="width:220px;background-color: #fff;z-index:100;position: fixed;overflow-x:hidden;margin-top: 10px;overflow-y:auto;border-right: solid 1px #e6e6e6;" v-show="!!$store.state.common.platform">
        <el-col :span="24" class="leftMenu" ref="leftMenu">
          <el-menu style="border-right: solid 0px #e6e6e6;" :unique-opened="uniqueOpened" :default-openeds="defaultOpeneds" :default-active="activeIndex" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" @select="handleSelect" :collapse="$store.state.common.isCollapse">
            <el-submenu index="1" v-show="$store.state.common.platform == 2" v-if="getPower('L2_Product_Class_FMS','L2_Product_Maintain_FMS','L2_Product_Limit_FMS','L2_Inventory_Tracking_FMS','L3_Quota_Area_Province_FMS','L3_Quota_Store_FMS','L3_Quota_Product_FMS','L2_BO_Config_FMS','L2_BO_List_FMS','L3_Ou_Area_FMS','L3_Ou_Province_FMS','L3_Ou_Store_FMS')">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span slot="title">产品管理</span>
              </template>  
              <el-submenu index="1-1" v-if="getPower('L2_Product_Maintain_FMS','L2_Product_Class_FMS')">
                <template slot="title">
                  <span slot="title">产品信息</span>
                </template>
                <el-menu-item v-if="getPower('L2_Product_Maintain_FMS')" index="/frame/product/onSale">基础信息</el-menu-item>
                <el-menu-item v-if="getPower('L2_Product_Class_FMS')" index="/frame/product/classification">产品分类</el-menu-item>
              </el-submenu>            
              
              <el-submenu index="1-2" v-if="getPower('L2_Product_Limit_FMS','L3_Quota_Area_Province_FMS','L3_Quota_Store_FMS','L3_Quota_Product_FMS','L2_Specified_Give_FMS')">
                <template slot="title">
                  <span slot="title">可定范围</span>
                </template>
                <el-menu-item v-if="getPower('L2_Product_Limit_FMS')" index="/frame/product/limit">可定范围</el-menu-item>
                <el-submenu index="1-2-1" v-if="getPower('L3_Quota_Product_Log_FMS','L3_Quota_Area_Province_FMS','L3_Quota_Store_FMS','L3_Quota_Product_FMS')">
                  <template slot="title">
                    <span slot="title">配额管理</span>
                  </template>
                  <el-menu-item v-if="getPower('L3_Quota_Store_FMS')" index="/frame/product/storeQuota">按门店设置</el-menu-item>
                  <el-menu-item v-if="getPower('L3_Quota_Store_Used_FMS')" index="/frame/product/storeQuotaUsed">门店设配额使用记录</el-menu-item>
                  <el-menu-item v-if="getPower('L3_Quota_Product_FMS')" index="/frame/product/productQuota">按产品设置</el-menu-item>
                  <el-menu-item v-if="getPower('L3_Quota_Product_Used_FMS')" index="/frame/product/productQuotaUsed">产品配额使用记录</el-menu-item>
                  <el-menu-item v-if="getPower('L3_Quota_Area_Province_FMS')" index="/frame/product/areaQuota">按区域/省办设置</el-menu-item>
                  <el-menu-item v-if="getPower('L3_Quota_Area_Province_Used_FMS')" index="/frame/product/areaQuotaUsed">区域省办配额使用记录</el-menu-item>
                  <el-menu-item v-if="getPower('L3_Quota_Product_Log_FMS')" index="/frame/product/quotaHistory">配额操作日志</el-menu-item>
                  
                </el-submenu>
                <el-menu-item v-if="getPower('L2_Specified_Give_FMS')" index="/frame/product/specifiedGive">指定赠送</el-menu-item>

              </el-submenu>  
              <el-submenu index="1-3" v-if="getPower('L2_Inventory_Tracking_FMS','L2_BO_Config_FMS','L2_BO_List_FMS')">
                <template slot="title">
                  <span slot="title">库存管理</span>
                </template>
                <el-menu-item v-if="getPower('L2_Inventory_Tracking_FMS')" index="/frame/product/inventoryTracking">库存跟踪</el-menu-item>
                <el-menu-item v-if="getPower('L2_BO_Config_FMS')" index="/frame/product/boConfig">BO配置</el-menu-item>
                <el-menu-item v-if="getPower('L2_BO_List_FMS')" index="/frame/product/boList">BO流水</el-menu-item>
              </el-submenu>      
              <el-submenu index="1-4" v-if="getPower('L3_Ou_Area_FMS','L3_Ou_Province_FMS','L3_Ou_Store_FMS')">
                <template slot="title">
                  <span slot="title">订货比例</span>
                </template>
                <!-- <el-menu-item v-if="getPower('L3_Ou_Area_FMS')" index="/frame/product/proportionArea">区域</el-menu-item> -->
                <el-menu-item v-if="getPower('L3_Ou_Province_FMS')" index="/frame/product/proportionProvince">区域/省办</el-menu-item>
                <el-menu-item v-if="getPower('L3_Ou_Store_FMS')" index="/frame/product/proportionOutlet">门店</el-menu-item>                  
              </el-submenu>
              <!-- <el-menu-item index="/frame/multiMedia/index/1">套装产品配置</el-menu-item> -->
            </el-submenu>            
            <el-submenu index="2" v-show="$store.state.common.platform == 2"  v-if="getPower('L2_Promotion_Manage_FMS','L2_Order_Plan_FMS','L2_Promotion_Log_FMS')">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span slot="title">营销管理</span>
              </template>
              <el-menu-item v-if="getPower('L2_Order_Plan_FMS')" index="/frame/order/orderPlan">下单计划</el-menu-item>
              <el-menu-item v-if="getPower('L2_Promotion_Manage_FMS')" index="/frame/promotion/index">促销管理</el-menu-item>
              <el-menu-item v-if="getPower('L2_Promotion_Log_FMS')" index="/frame/promotion/promotionHistory" >促销管理-日志</el-menu-item>
              
            </el-submenu>
            
            <el-submenu index="3" v-show="$store.state.common.platform == 2"  v-if="getPower('L2_Order_Manage_FMS','L2_Order_Detai_Query_FMS','L2_Order_Approve_CS_FMS','L2_Order_Approve_Finance_FMS','L2_Delivery_Confirm_FMS')">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span slot="title">订单管理</span>
              </template>              
              <el-menu-item v-if="getPower('L2_Order_Manage_FMS')" index="/frame/order/orderManage">订单综合查询</el-menu-item>
              <!-- <el-menu-item v-if="getPower('L2_Order_BackEnd_Manage_FMS')" index="/frame/order/orderBackendManage">后台订单综合查询</el-menu-item> -->
              <el-menu-item v-if="getPower('L2_Order_Detai_Query_FMS')" index="/frame/order/orderDetailList" >订单明细查询</el-menu-item>
              <el-menu-item v-if="getPower('L2_Order_Approve_CS_FMS')" index="/frame/order/orderForCs">客服订单审核</el-menu-item>
              <el-menu-item v-if="getPower('L2_Order_Approve_Finance_FMS')" index="/frame/order/orderForFinance">财务订单审核</el-menu-item>
              <el-menu-item v-if="getPower('L2_Delivery_Confirm_FMS')" index="/frame/order/deliverConfirm">发货确认单</el-menu-item>
            </el-submenu>
            <el-submenu index="4" v-show="$store.state.common.platform == 2"  v-if="getPower('L3_Customer_Service_Approve_Area_L_FMS','L3_Customer_Service_Manage_FMS','L3_Customer_Service_Approve_L_FMS','L3_Customer_Service_Approve_C_FMS','L3_Customer_Service_Approve_B_FMS')">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span slot="title">售后管理</span>
              </template>                
              <el-menu-item v-if="getPower('L3_Customer_Service_Manage_FMS')" index="/frame/order/customerServiceApply">售后申报查询</el-menu-item>
              <!-- <el-menu-item v-if="getPower('L3_Customer_Service_Manage_Other_FMS')" index="/frame/order/addOtherOrder">其他售后单导入</el-menu-item> -->
              <el-menu-item v-if="getPower('L3_Customer_Service_Approve_L_FMS')" index="/frame/order/customerServiceApproveL">售后申请物流审核</el-menu-item>
              <el-menu-item v-if="getPower('L3_Customer_Service_Approve_Area_L_FMS')" index="/frame/order/customerServiceApproveAreaL">售后申请区域物流审核</el-menu-item>
              <el-menu-item v-if="getPower('L3_Customer_Service_Approve_C_FMS')" index="/frame/order/customerServiceApproveC">售后申请制单客服审核</el-menu-item>
              <el-menu-item v-if="getPower('L3_Customer_Service_Approve_B_FMS')" index="/frame/order/customerServiceApproveB">售后申请高级客服审核</el-menu-item>              
            </el-submenu>
            <el-submenu index="5" v-show="$store.state.common.platform == 2"  v-if="getPower('L3_S2_Special_Order_FMS','L3_SF_Special_Order_FMS','L3_SJ_Special_Order_FMS','L3_SB_Special_Order_FMS','L3_SS_Special_Order_FMS','L3_SJ_Tmp_Order_FMS','L3_SJ_Tmz_Order_FMS','L3_SR_Tmz_Order_FMS','L3_Return_Order_Goods_FMS','L3_Return_Order_Goods_records_FMS','L2_Order_BackEnd_Approve_FMS')">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span slot="title">后台订单管理</span>
              </template>
              <el-submenu index="5-1" v-if="getPower('L3_S2_Special_Order_FMS','L3_SF_Special_Order_FMS','L3_SJ_Special_Order_FMS','L3_SB_Special_Order_FMS','L3_SS_Special_Order_FMS','L3_SJ_Tmp_Order_FMS','L3_SJ_Tmz_Order_FMS','L3_SR_Tmz_Order_FMS')">
                <template slot="title">
                  <span slot="title">后台订单草稿</span>
                </template>
                <el-menu-item v-if="getPower('L3_S2_Special_Order_FMS')" index="/frame/order/backendOrder/specialOrderList">S2特殊订单</el-menu-item>  
                <el-menu-item v-if="getPower('L3_SF_Special_Order_FMS')" index="/frame/order/backendOrder/sfProductOrderList">SF产品申请表</el-menu-item>                 
                <el-menu-item v-if="getPower('L3_SJ_Special_Order_FMS')" index="/frame/order/backendOrder/sjProductOrderList">SJ内部申请表</el-menu-item>                 
                <el-menu-item v-if="getPower('L3_SB_Special_Order_FMS')" index="/frame/order/backendOrder/sbProductOrderList">SB B2B订单</el-menu-item>                 
                <el-menu-item v-if="getPower('L3_SS_Special_Order_FMS')" index="/frame/order/backendOrder/ssProductOrderList">SS员工自购单</el-menu-item>                 
                <el-menu-item v-if="getPower('L3_SR_Tmz_Order_FMS')" index="/frame/order/backendOrder/srProductOrderList">SR售后订单</el-menu-item>                              
                <el-menu-item v-if="getPower('L3_SJ_Tmp_Order_FMS')" index="/frame/order/backendOrder/tzpOrderList">正调整单</el-menu-item>                 
                <el-menu-item v-if="getPower('L3_SJ_Tmz_Order_FMS')" index="/frame/order/backendOrder/tzmOrderList">负调整单</el-menu-item>  
              </el-submenu>
              <el-submenu index="5-2" v-if="getPower('L3_Return_Order_Goods_FMS','L3_Return_Order_Goods_records_FMS')">
                <template slot="title">
                  <span slot="title">退单退货处理</span>
                </template>
                <el-menu-item v-if="getPower('L3_Return_Order_Goods_FMS')" index="/frame/order/returnOrderAndGoods">退单退货处理</el-menu-item>
                <el-menu-item v-if="getPower('L3_Return_Order_Goods_records_FMS')" index="/frame/order/returnHistory">退单退货查询</el-menu-item>               
              </el-submenu>
              <el-menu-item v-if="getPower('L2_Order_BackEnd_Approve_FMS')" index="/frame/order/backendOrder/orderForCs">后台订单审核</el-menu-item>
              <el-menu-item v-if="getPower('L2_OrderDetail_BackEnd_Approve_FMS')" index="/frame/order/backendOrder/orderDetailList">后台订单明细审核</el-menu-item>
            </el-submenu>
            <el-submenu index="6" v-show="$store.state.common.platform == 2"  v-if="getPower('L2_Terminal_Customer_FMS','L2_Account_Query_FMS','L2_Account_Money_Import_FMS','L2_Discount_Import_FMS','L2_Discount_List_FMS','L2_Customer_Contact_FMS','L3_Recharge_Online_FMS','L3_Recharge_OffLine_FMS','L3_Recharge_OffLine_CS_FMS','L3_Recharge_OffLine_Finance_FMS','L2_Client_Change_Info')">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span slot="title">客户管理</span>
              </template>
              <el-menu-item v-if="getPower('L2_Terminal_Customer_FMS')"  index="/frame/terminal/customer">专卖店信息</el-menu-item>
              <el-menu-item v-if="getPower('L2_mssStore_employee')"  index="/frame/terminal/hccManage">HCC管理</el-menu-item>
              <el-menu-item v-if="getPower('L2_Terminal_Customer_DB_FMS')"  index="/frame/terminal/customerDB">分销商信息</el-menu-item>              
              <el-menu-item v-if="getPower('L2_Other_Customer_FMS')"  index="/frame/terminal/otherCustomer">其他客户信息</el-menu-item>              
              <el-menu-item v-if="getPower('L2_Client_Change_Info')" index="/frame/terminal/customerChangeInfo">专卖店转让信息</el-menu-item>
              <el-submenu index="6-1" v-if="getPower('L2_Account_Query_FMS','L2_Account_Money_Import_FMS','L2_Discount_Import_FMS','L2_Discount_List_FMS','L2_Customer_Contact_FMS')">
                <template slot="title">
                  <span slot="title">账户管理</span>
                </template>       
                <el-menu-item v-if="getPower('L2_Account_Query_FMS')" index="/frame/account/accountQuery">账户查询</el-menu-item>       
                <el-menu-item v-if="getPower('L2_Account_Money_Import_FMS')" index="/frame/account/moneyImport">款项导入</el-menu-item>
                <el-menu-item v-if="getPower('L2_Discount_Import_FMS')" index="/frame/account/discountImport">折扣差导入</el-menu-item>
                <el-menu-item v-if="getPower('L2_Discount_List_FMS')" index="/frame/account/discountList">折扣差流水</el-menu-item>
                <el-menu-item v-if="getPower('L2_Customer_Contact_FMS')" index="/frame/account/customerContacts">客户往来</el-menu-item>
                <el-menu-item v-if="getPower('L2_Customer_Contact_Finance_FMS')" index="/frame/account/customerContactsFinance">客户往来(做账)</el-menu-item>
              </el-submenu>
              <el-submenu index="6-2" v-if="getPower('L3_Recharge_Online_FMS','L3_Recharge_OffLine_FMS','L3_Recharge_OffLine_CS_FMS','L3_Recharge_OffLine_Finance_FMS')">
                <template slot="title">
                  <span slot="title">充值管理</span>
                </template>
                <el-menu-item v-if="getPower('L3_Recharge_Online_FMS')" index="/frame/account/online">线上充值</el-menu-item>
                <el-menu-item v-if="getPower('L3_Recharge_OffLine_FMS')" index="/frame/account/underLine">线下充值</el-menu-item>
                <el-menu-item v-if="getPower('L3_Recharge_OffLine_CS_FMS')" index="/frame/account/underLineForCs">线下充值(客服)</el-menu-item>
                <el-menu-item v-if="getPower('L3_Recharge_OffLine_Finance_FMS')" index="/frame/account/underLineForFinance">线下充值(财务)</el-menu-item>
              </el-submenu>
            </el-submenu>
            <el-submenu index="7" v-show="$store.state.common.platform == 2"  v-if="getPower('L2_PSI_CII','L2_PSI_PF')">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span slot="title">进销存管理</span>
              </template>
              <el-menu-item v-if="getPower('L2_PSI_CII')"  index="/frame/psi/clientProStock">产品库存综合</el-menu-item>
              <el-menu-item v-if="getPower('L2_PSI_PF')"  index="/frame/psi/stockLog">产品库存流水</el-menu-item>
            </el-submenu>   
            <el-submenu index="8" v-show="$store.state.common.platform == 2"  v-if="getPower('L2_OE_Detail','L2_Estimated_Product_Set','L2_OE_Switch')">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span slot="title">预估定量</span>
              </template>
              <el-menu-item v-if="getPower('L2_OE_Detail')"  index="/frame/oe/oeDetail">预估定量明细</el-menu-item>
              <el-menu-item v-if="getPower('L2_Estimated_Product_Set')"  index="/frame/oe/productSet">预估产品设置</el-menu-item>
              <el-menu-item v-if="getPower('L2_OE_Switch')"  index="/frame/oe/paramSet">填报时间设置</el-menu-item>
            </el-submenu>
            <el-submenu index="9" v-show="$store.state.common.platform == 2"  v-if="getPower('L2_BoxingNo_Query_FMS','L2_All_Boxing_Query_FMS','L2_Picking_Detail_Query_FMS','L2_Unshipped_Product_Query_FMS')">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span slot="title">进销存</span>
              </template>
              <el-menu-item v-if="getPower('L2_BoxingNo_Query_FMS')"  index="/frame/purchare/boxQuery">装箱单查询</el-menu-item>
              <el-menu-item v-if="getPower('L2_All_Boxing_Query_FMS')"  index="/frame/purchare/boxingList">装箱单汇总查询</el-menu-item>
              <el-menu-item v-if="getPower('L2_Picking_Detail_Query_FMS')"  index="/frame/purchare/pickingList">拣货单明细查询</el-menu-item>
              <el-menu-item v-if="getPower('L2_Unshipped_Product_Query_FMS')"  index="/frame/purchare/unshippedList">未发货产品查询</el-menu-item>
            </el-submenu>               
            <el-submenu index="10" v-show="$store.state.common.platform == 3"  v-if="getPower('L3_Report_Query_FMS','L3_Report_Tracking_FMS')">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span slot="title">销售报表</span>
              </template>
              <el-menu-item v-if="getPower('L3_Report_Query_FMS')" index="/frame/promotion/weeklyReport">周报查询</el-menu-item>
              <el-menu-item v-if="getPower('L3_Report_Month_Query_FMS')" index="/frame/promotion/monthlyReport">月报查询</el-menu-item>
              <el-menu-item v-if="getPower('L3_Report_Set_FMS')" index="/frame/promotion/weeklyReportSet">周月报填写时间设置</el-menu-item>
              <el-menu-item v-if="getPower('L3_Report_Tracking_FMS')" index="/frame/promotion/wadReport">周/月报跟踪</el-menu-item>               
            </el-submenu>
            <el-submenu index="11" v-show="$store.state.common.platform == 4"  v-if="getPower('L2_Power_Employer_Manage_FMS','L2_Power_Menu_Manage_FMS','L2_Power_Role_Manage_FMS','L2_Power_Log_FMS','L2_Organization_Manage')">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span slot="title">基础设置</span>
              </template>
              <el-menu-item v-if="getPower('L2_Power_Employer_Manage_FMS')" index="/frame/terminal/employees">员工管理</el-menu-item>
              <el-menu-item v-if="getPower('L2_Client_Role_Set')" index="/frame/terminal/ClientRoleSet">客户角色管理</el-menu-item>
              <el-menu-item v-if="getPower('L2_Power_Menu_Manage_FMS')" index="/frame/terminal/menu">菜单管理</el-menu-item>
              <el-menu-item v-if="getPower('L2_Power_Role_Manage_FMS')" index="/frame/terminal/role/1">角色管理</el-menu-item>
              <el-menu-item v-if="getPower('L2_Organization_Manage')" index="/frame/terminal/organization">组织结构</el-menu-item>
              <el-menu-item v-if="getPower('L2_SystemParam_Set')" index="/frame/systemParam">基础参数设置信息</el-menu-item>
              <el-menu-item v-if="getPower('L2_SystemParam_TimeAndOrder_Set')" index="/frame/systemParamTOSet">时间和订单设置</el-menu-item>
              <el-menu-item v-if="getPower('L2_SystemParam_Holidays_Set')" index="/frame/systemParamHolidaySet">节假日设置</el-menu-item>
              <el-menu-item v-if="getPower('L2_SystemParam_Rate_Set')" index="/frame/systemParamRSet">费率及优惠比例设置</el-menu-item>
              <el-menu-item v-if="getPower('L2_SystemParam_FMonth_Set')" index="/frame/systemParamFMonthSet">财务月设置</el-menu-item>
              <el-menu-item v-if="getPower('L2_SystemParam_Set_Log')" index="/frame/systemParamLog">基础参数设置日志</el-menu-item>
              <el-menu-item v-if="getPower('L2_Power_Log_FMS')" index="/frame/terminal/log">专卖店登录日志</el-menu-item>
              <el-menu-item v-if="getPower('L2_Power_Emp_Log_FMS')" index="/frame/terminal/empLog">员工登录日志</el-menu-item>
            </el-submenu>
            <el-submenu index="12" v-show="$store.state.common.platform == 1" v-if="getPower('L2_mssmember','L2_mssMember_Transfer','L2_mssMember_Buy','L2_mssMember_Modify','L2_mssMember_Label')">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span slot="title">会员管理</span>
              </template>
              <el-menu-item v-if="getPower('L2_mssmember')" index="/frame/mssMember/mssMemberList">会员列表</el-menu-item>
              <el-menu-item v-if="getPower('L2_mssMember_Transfer')" index="/frame/mssMember/mssMemberTransfer">会员转移</el-menu-item>
              <el-menu-item v-if="getPower('L2_mssMember_Buy')" index="/frame/mssMember/mssMemberBuy">购买记录</el-menu-item>
              <el-menu-item v-if="getPower('L2_mssMember_Modify')" index="/frame/mssMember/mssMemberModify">修改记录</el-menu-item>
              <el-menu-item v-if="getPower('L2_mssMember_Label')" index="/frame/mssMember/mssMemberLabel">标签管理</el-menu-item>
              <el-menu-item v-if="getPower('L2_memberevent_list')" index="/frame/mssMember/mssMemberEvent">会员事件</el-menu-item>
            </el-submenu>
            <el-submenu index="13" v-show="$store.state.common.platform == 1"  v-if="getPower('L2_Activity_List_FMS','L2_Activity_Add_FMS')">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span slot="title">营销工具</span>
              </template>  
              <el-submenu index="13-1" v-if="getPower('L2_Activity_List_FMS','L2_Activity_Add_FMS')">
                <template slot="title">
                  <span slot="title">活动邀约</span>
                </template>
                <el-menu-item v-if="getPower('L2_Activity_List_FMS')" index="/frame/activity/activityList">活动列表</el-menu-item>
                <el-menu-item v-if="getPower('L2_Activity_Add_FMS')" index="/frame/activity/activityAdd">发布活动</el-menu-item>
                <el-menu-item v-if="getPower('L2_Activity_Record')" index="/frame/activity/activityRecord">预约记录</el-menu-item>
              </el-submenu>
              <el-submenu index="13-2" v-if="getPower('L3_Vote_Setup','L3_Vote_Check', 'L3_Vote_Log')">
                <template slot="title">
                  <span slot="title">投票活动</span>
                </template>
                <el-menu-item v-if="getPower('L3_Vote_Setup')" index="/frame/vote/voteSetup">投票设置</el-menu-item>
                <el-menu-item v-if="getPower('L3_Vote_Check')" index="/frame/vote/voteCheck">报名审核</el-menu-item>
                <el-menu-item v-if="getPower('L3_Vote_Log')" index="/frame/vote/voteLog">投票日志</el-menu-item>
              </el-submenu>
              <el-submenu index="13-3" v-if="getPower('L3_Source_Batch_List','L3_Source_Template_List')">
                <template slot="title">
                  <span slot="title">溯源信息维护</span>
                </template>
                <el-menu-item v-if="getPower('L3_Source_Batch_List')" index="/frame/sourceInfo/sourceBatch">批次查询</el-menu-item>
                <el-menu-item v-if="getPower('L3_Source_Template_List')" index="/frame/sourceInfo/sourceTemplate">h5模板管理</el-menu-item>
              </el-submenu>
              <el-submenu index="13-4" v-if="getPower('L3_Advert_List')">
                <template slot="title">
                  <span slot="title">广告管理</span>
                </template>
                <el-menu-item v-if="getPower('L3_Advert_List')" index="/frame/advertManage/advertList">广告列表</el-menu-item>
              </el-submenu>
            </el-submenu>
            <el-submenu index="14" v-show="$store.state.common.platform == 1" v-if="getPower('L2_Statistics_Member_view','L2_Benefit_Member_Back_Store_Report','L2_Benefit_Store_Report','L2_Benefit_Report','L2_biCouponExport')">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span slot="title">报表统计</span>
              </template>      
              <el-menu-item v-if="getPower('L2_Statistics_Member_view')"  index="/frame/member/dateView">会员招募日报表</el-menu-item>
              <el-menu-item v-if="getPower('L2_Statistics_Member_view')" index="/frame/member/weekView">会员招募周报表</el-menu-item>
              <el-menu-item v-if="getPower('L2_Statistics_Member_view')" index="/frame/member/monthView">会员招募月报表</el-menu-item>
              <el-menu-item v-if="getPower('L2_Benefit_Member_Back_Store_Report')" index="/frame/member/memberBackStoreReport">会员回店报表</el-menu-item>
              <el-menu-item v-if="getPower('L2_BenefitCouponDetail_view')" index="/frame/member/couponUsageDetail">优惠券使用明细</el-menu-item>
              <el-menu-item v-if="getPower('L2_Benefit_Store_Report')" index="/frame/member/storeReportCoupon">优惠券使用统计(店)</el-menu-item>
              <el-menu-item v-if="getPower('L2_Benefit_Report')" index="/frame/member/bennefitReport">优惠券效益报表</el-menu-item>   
              <el-menu-item v-if="getPower('L2_biCouponExport')" index="/frame/couponExport/couponList">优惠券核销下载</el-menu-item>          
            </el-submenu>
            <el-submenu index="15" v-show="$store.state.common.platform == 1"  v-if="getPower('L2_Gift_List')">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span slot="title">订单处理</span>
              </template>
              <el-submenu index="15-1" v-show="$store.state.common.platform == 1"  v-if="getPower('L2_Gift_List')">
                <template slot="title">
                  <span slot="title">高会礼品订单</span>
                </template>
                <el-menu-item v-if="getPower('L2_mssgift_order')" index="/frame/giftExport/giftHandle">高会礼品订单处理</el-menu-item>
                <el-menu-item v-if="getPower('L2_Gift_List')" index="/frame/giftExport/giftList">高会礼品订单导出</el-menu-item>
              </el-submenu>
            </el-submenu>
            <el-submenu index="16" v-show="$store.state.common.platform == 1"  v-if="getPower('L2_Maintain_Manage_FMS','L2_Probability_Manage_FMS','L2_etupActivityLog_FMS','L2_combine_List')">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span slot="title">eTup商城</span>
              </template>
              <el-submenu index="16-1" v-show="$store.state.common.platform == 1"  v-if="getPower('L2_Maintain_Manage_FMS','L2_Probability_Manage_FMS','L2_etupActivityLog_FMS')">
                <template slot="title">
                  <span slot="title">活动配置</span>
                </template>
                <el-menu-item v-if="getPower('L2_Maintain_Manage_FMS')" index="/frame/etupActivity/maintain">活动维护</el-menu-item>
                <el-menu-item v-if="getPower('L2_Probability_Manage_FMS')" index="/frame/etupActivity/probability">中奖概率设置</el-menu-item>
                <el-menu-item v-if="getPower('L2_etupActivityLog_FMS')" index="/frame/etupActivity/activityLog">活动日志(会员)</el-menu-item>
              </el-submenu>
              <el-submenu index="16-2" v-show="$store.state.common.platform == 1"  v-if="getPower('L2_combine_List')">
                <template slot="title">
                  <span slot="title">促销活动</span>
                </template>
                <el-menu-item v-if="getPower('L2_combine_List')" index="/frame/etup/combineList">组合促销</el-menu-item>
              </el-submenu>
              <el-submenu index="16-3" v-show="$store.state.common.platform == 1"  v-if="getPower('L2_warmHeart_Manage')">
                <template slot="title">
                  <span slot="title">暖心说活动</span>
                </template>
                <el-menu-item v-if="getPower('L3_warmHeart_List')" index="/frame/warmHeart/warmHeartList">卡片维护</el-menu-item>
              </el-submenu>
            </el-submenu>
            <el-submenu index="17" v-show="$store.state.common.platform == 1"  v-if="getPower('L2_Sale_Import')">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span slot="title">销售录入</span>
              </template>
              <el-menu-item v-if="getPower('L2_Sale_Import')"  index="/frame/psi/saleImportLog">销售录入</el-menu-item>
            </el-submenu>  
            <el-submenu index="18" v-show="$store.state.common.platform == 3"  v-if="getPower('L2_Business_Profit','L2_Business_Target','L2_Business_Switch','L2_Db_Manege','L2_Organization_Relationship_Info')">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span slot="title">微管理</span>
              </template>
              <el-menu-item v-if="getPower('L2_Business_Profit')" index="/frame/annualPlan/profit">店利润测算</el-menu-item>
              <el-menu-item v-if="getPower('L2_Business_Target')" index="/frame/annualPlan/target">店目标预估</el-menu-item>
              <el-menu-item v-if="getPower('L2_Db_Target')" index="/frame/annualPlan/dbTarget">DB目标分解</el-menu-item>
              <el-menu-item v-if="getPower('L2_Business_Switch')" index="/frame/annualPlan/paramSet">填报设置</el-menu-item>              
              <el-menu-item v-if="getPower('L2_Db_Manege')" index="/frame/terminal/dbList">DB关系</el-menu-item>
              <el-menu-item v-if="getPower('L2_Organization_Relationship_Info')" index="/frame/terminal/organizationRelationShipInfo">组织机构关系快照</el-menu-item>
            </el-submenu>
            <el-submenu index="19" v-show="$store.state.common.platform == 3" v-if="getPower('L2_PsmList_Manage_FMS','L2_PsmList_Del_FMS')">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span slot="title">PSM管理</span>
              </template>
              <el-menu-item v-if="getPower('L2_PsmList_Manage_FMS')" index="/frame/psm/psmPersonList">人员管理</el-menu-item>
              <el-menu-item v-if="getPower('L2_PsmList_Del_FMS')" index="/frame/psm/psmPersonDel">删除历史</el-menu-item>
            </el-submenu>
            <el-submenu index="20" v-show="$store.state.common.platform == 3" v-if="getPower('L2_Data_Import','L2_All_Manage_Detail')">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span slot="title">生意仪表盘</span>
              </template>
              <el-menu-item v-if="getPower('L2_Data_Import')" index="/frame/meter/index">数据录入查看</el-menu-item>
              <el-menu-item v-if="getPower('L2_All_Manage_Detail')" index="/frame/meter/detail">区域全面管理预览</el-menu-item>
            </el-submenu>   
            <el-submenu index="21" v-show="$store.state.common.platform == 3" v-if="getPower('L2_Follow_Order_Detail','L2_Follow_Product_Detail')">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span slot="title">跟单管理</span>
              </template>      
              <el-menu-item v-if="getPower('L2_Follow_Order_Detail')" index="/frame/follow/orders">跟单订单明细</el-menu-item>
              <el-menu-item v-if="getPower('L2_Follow_Product_Detail')" index="/frame/follow/goods">跟单产品明细</el-menu-item>
            </el-submenu>     
            <el-submenu index="22" v-show="$store.state.common.platform == 3" v-if="getPower('L2_Product_Data_Import','L2_Product_Data_Detail')">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span slot="title">产品分类数据维护</span>
              </template>      
              <el-menu-item v-if="getPower('L2_Product_Data_Import')" index="/frame/product/productClassImport">数据导入</el-menu-item>
              <el-menu-item v-if="getPower('L2_Product_Data_Detail')" index="/frame/product/productClassification">产品分类数据查看</el-menu-item>
              <el-menu-item v-if="getPower('L2_Product_Hot_Detail')" index="/frame/product/hotProduct">重点热卖数据查看</el-menu-item>
            </el-submenu>  
            <el-submenu index="23" v-show="$store.state.common.platform == 3" v-if="getPower('L2_Stock_Data_View','L2_Stock_Product_Manage')">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span slot="title">库存盘点数据</span>
              </template>      
              <el-menu-item v-if="getPower('L2_Stock_Data_View')"  index="/frame/stock/stockDataView">库存盘点数据查看</el-menu-item>
              <el-menu-item v-if="getPower('L2_Stock_Product_Manage')" index="/frame/stock/stockProductManage">库存产品信息维护</el-menu-item>
            </el-submenu> 
            <el-submenu index="24" v-show="$store.state.common.platform == 3" v-if="getPower('L2_Customer_Opening_Approve_Query','L2_Customer_Open_Approve_Query','L2_Customer_Close_Approve_Query','L2_Customer_Opening_Approve','L2_Customer_Open_Approve','L2_Customer_Close_Approve','L2_Submit_Close_Approve')">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span slot="title">专卖店申请</span>
              </template>      
              <el-menu-item v-if="getPower('L2_Customer_Opening_Approve_Query')" index="/frame/customerApprove/allCustomerOpeningApprove">开店申请查询</el-menu-item>
              <el-menu-item v-if="getPower('L2_Customer_Opening_Approve')" index="/frame/customerApprove/customerOpeningApprove">开店申请</el-menu-item>
              <el-menu-item v-if="getPower('L2_Customer_Open_Approve_Query')" index="/frame/customerApprove/allCustomerOpenApprove">开业申请查询</el-menu-item>
              <el-menu-item v-if="getPower('L2_Customer_Open_Approve')" index="/frame/customerApprove/customerOpenApprove">开业申请</el-menu-item>
              <el-menu-item v-if="getPower('L2_Customer_Close_Approve_Query')" index="/frame/customerApprove/allCustomerCloseApprove">结业申请查询</el-menu-item>
              <el-menu-item v-if="getPower('L2_Customer_Close_Approve')" index="/frame/customerApprove/customerCloseApprove">结业申请</el-menu-item>
              <el-menu-item v-if="getPower('L2_Submit_Close_Approve')" index="/frame/customerApprove/addCloseApprove">发起结业申请</el-menu-item>
            </el-submenu>
            <el-submenu index="25" v-show="$store.state.common.platform == 3" v-if="getPower('L1_Hui_Class_ClassRoom_Manage','L1_Hui_Class_Column_Manage')">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span slot="title">慧课堂</span>
              </template>
              <el-menu-item v-if="getPower('L1_Hui_Class_ClassRoom_Manage')" index="/frame/course/courseManage">课件管理</el-menu-item>
              <el-menu-item v-if="getPower('L1_Hui_Class_Column_Manage')" index="/frame/course/columnManage">栏目管理</el-menu-item>
            </el-submenu>
            <el-submenu index="26" v-show="$store.state.common.platform == 4"  v-if="getPower('L2_Multimedia_Pic_FMS','L2_Multimedia_Document_FMS','L2_Multimedia_Video_FMS','L2_Export_Download_FMS')">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span slot="title">内容管理</span>
              </template>
              <el-menu-item v-if="getPower('L2_Multimedia_Pic_FMS')"  index="/frame/multiMedia/index/1">图片</el-menu-item>
              <el-menu-item v-if="getPower('L2_Multimedia_Document_FMS')"  index="/frame/multiMedia/index/3">文档</el-menu-item>
              <el-menu-item v-if="getPower('L2_Multimedia_Video_FMS')"  index="/frame/multiMedia/index/2">视音频</el-menu-item>
              <el-menu-item v-if="getPower('L2_Export_Download_FMS')"  index="/frame/multiMedia/downLoad">导出下载</el-menu-item>
            </el-submenu>
            <el-submenu index="27" v-show="$store.state.common.platform == 4" v-if="getPower('L2_JgMsg_Push')">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span slot="title">消息管理</span>
              </template>
              <el-menu-item v-if="getPower('L2_JgMsg_Push')" index="/frame/message/jgMsgList">极光消息推送</el-menu-item>
              <el-menu-item v-if="getPower('L2_JgMsg_Type_Push')" index="/frame/message/jgMsgTypeList">推送类型管理</el-menu-item>
            </el-submenu>
            <el-submenu index="28" v-show="$store.state.common.platform == 3"  v-if="getPower('L1_RewardPlan')">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span slot="title">专卖店奖励计划</span>
              </template>
              <el-menu-item v-if="getPower('L1_RewardPlan')" index="/frame/awardScheme/awardList">奖励管理</el-menu-item>         
            </el-submenu>
            <el-submenu index="29" v-show="$store.state.common.platform == 4"  v-if="getPower('L1_version_Manage')">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span slot="title">版本管理</span>
              </template>
              <el-menu-item v-if="getPower('L2_version_List')" index="/frame/versionManage/versionList">版本管理</el-menu-item>         
            </el-submenu>
          </el-menu>
        </el-col>
      </div>      
      <div ref="right" style="padding: 20px 15px 0px 20px;overflow: hidden;margin-bottom:10px; margin-left: 220px;margin-top: 50px;">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import vTags from './tags.vue'
export default {
  data () {
    return {
      platform: this.$store.state.common.platform,
      activeIndex: '1',
      uniqueOpened: true,
      defaultOpeneds: [],
      tagsList: []
    }
  },
  components: {
    vTags
  },
  watch: {
    $route: function (val) {
      this.activeIndex = val.fullPath
    },
    '$store.state.common.isCollapse': function (val) {
      this.responseLayout(val)
    }
  },
  mounted () {
    this.responseLayout(this.$store.state.isCollapse)
  },
  methods: {
    getPower () {
      let thiz = this
      let args = arguments
      let result = false
      for (let i = 0; i < args.length; i++) {
        if (thiz.$store.state.common.power[args[i]] == true) {
          result = true
          break
        }
      }
      return result
    },
    responseLayout (val) {
      if (val) {
        this.$refs.right.style.marginLeft = '64px'
      } else {
        this.$refs.right.style.marginLeft = '180px'
      }
    },
    handleSelect (key, keyPath) {
      if (process.env.NODE_ENV == 'production') {
        this.$router.push({ path: key })
        // window.open('/#'+key)
      } else {
        this.$router.push({ path: key })
      }
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  },
  mounted () {
    this.activeIndex = this.$route.fullPath
    $('.leftMenu').css('height', (document.documentElement.clientHeight - 52) + 'px')
    let thiz = this;
    let userName = '';
    window.addEventListener("storage", function (e) {
      if(e.key == 'userName'){
        userName = e.newValue
      }
      if(e.key == 'token' && e.newValue != e.oldValue){   
        
        if(!e.newValue){
          thiz.$router.push({ path: '/login' });  
          return;
        }   
        else{
          thiz.$alert('当前页面已过期，浏览器检测到你('+userName+')已在其它地方登录,请关闭或刷新页面','登录用户切换',{
            showClose:false,
            showConfirmButton:false
          });
        }        
      }
    })
  }
}
</script>

<style>
.leftMenu {
  height: 0px;
}
.el-menu-item i{
  float: right;
}
</style>
