<template>
  <div>
    <el-form  :model="searchForm" label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="区域">            
            <tup-arae-select type="area" size="mini" v-model="searchForm.areaObject"  ></tup-arae-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="省办">            
            <tup-arae-select v-model="searchForm.provinceObject"></tup-arae-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
           <el-form-item label="订单编号">
            <el-input v-model="searchForm.orderNo" size="mini" placeholder="订单编号"></el-input>
          </el-form-item>          
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="分销商编号">
            <el-input v-model="searchForm.sDbStr" size="mini"  placeholder="分销商编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="订单类型">
            <el-select v-model="searchForm.orderTypeList" size="mini" multiple  placeholder="请选择">
              <el-option
                v-for="item in Dictions.order_type"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>          
        </el-col>        
        <el-col :span="8">
          <el-form-item label="团购标识">
            <el-select v-model="searchForm.groupFlag" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>         
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="专卖店编号">
            <el-input v-model="searchForm.clientId" size="mini" placeholder="专卖店编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="专卖店类型">
            <el-select v-model="searchForm.clientType" size="mini" clearable filterable  placeholder="请选择">
              <el-option
                v-for="item in Dictions.outlet_property2"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>        
        <el-col :span="8">
          <el-form-item label="付款状态">
            <el-select v-model="searchForm.payStatus" size="mini" clearable filterable  placeholder="请选择">
              <el-option
                v-for="item in Dictions.pay_status"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="订单状态">
            <el-select v-model="searchForm.orderStatusList" size="mini" multiple  placeholder="请选择">
              <el-option
                v-for="item in Dictions.order_status"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>        
        <el-col :span="8">
          <el-form-item label="退回原因">
            <el-select v-model="searchForm.returnReason" size="mini" clearable filterable  placeholder="请选择">
              <el-option
                v-for="item in Dictions.return_reason"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否打折">
            <el-select v-model="searchForm.isDiscount" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="16">
          <el-form-item label="产品编号">
            <el-select
              style="width:100%"
              v-model="searchForm.pCodeList"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="请输入产品编号"
              :remote-method="remoteMethod"
              :loading="loading">
              <el-option
                v-for="item in productList"
                :key="item.pCode"
                :label="item.pCode+'('+item.pName+')'"
                :value="item.pCode">
              </el-option>
            </el-select>
            <!-- <el-input v-model="searchForm.pCodeObject" size="mini" placeholder="产品编号，多个适用,隔开"></el-input> -->
          </el-form-item>
        </el-col>        
        <el-col :span="8">
          <el-form-item label="促销名称">
            <el-input v-model="searchForm.promotionName" size="mini" placeholder="促销名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="是否kit产品">
            <el-select v-model="searchForm.isKit" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">    
          <el-form-item label="创建日期">
            <el-date-picker
              style="width:100%"
              v-model="searchForm.date"
              size="mini"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>     
        </el-col>
        <!-- <el-col :span="8">
          <el-form-item label="产品打折属性">
            <el-select v-model="searchForm.promotionPrdType" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="换购" :value="2"></el-option>
              <el-option label="换赠" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :span="8">
          <el-form-item label="产品单价范围">
            <el-input v-model="searchForm.orderUnitPriceMin" style="width:60px" size="mini" placeholder=""></el-input>
            -
            <el-input v-model="searchForm.orderUnitPriceMax" style="width:60px" size="mini" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        
        <!-- <el-col :span="8">
          <el-form-item label="产品性质">
            <el-select v-model="searchForm.pCitglcategory" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="SP" value="SP"></el-option>
              <el-option label="FG" value="FG"></el-option>
              <el-option label="FT" value="FT"></el-option>
              <el-option label="MK" value="MK"></el-option>
              <el-option label="PS" value="PS"></el-option>
              <el-option label="BU" value="BU"></el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="促销备注">
            <el-select v-model="searchForm.promotionRemark" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="空" value="0"></el-option>
              <el-option label="临时促销" value="1"></el-option>
              <el-option label="区域促销" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>   
        <el-col :span="8">    
          <el-form-item label="财务审核日期">
            <el-date-picker
              style="width:100%"
              v-model="searchForm.auditbyFinanceTimeArray"
              size="mini"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>     
        </el-col> 
        <el-col :span="8">
          <el-form-item label="订单备注">
            <el-input v-model="searchForm.orderRemark" size="mini" placeholder="订单备注"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="产品类型">
            <el-select v-model="searchForm.promotionPrdTypeList" size="mini" multiple  placeholder="请选择">
              <el-option
                v-for="item in Dictions.promotion_prd_type"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">    
          <el-form-item label="客服审核日期">
            <el-date-picker
              style="width:100%"
              v-model="searchForm.date2"
              size="mini"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>     
        </el-col>
        <el-col :span="8">
          <el-form-item label="产品名称">
            <el-input v-model="searchForm.pName" size="mini" placeholder="产品名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否超过阈值">
            <el-select v-model="searchForm.excessThreshold" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="零售价是否为0">
            <el-select v-model="searchForm.beforeBenifitPriceIsZero" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="明细备注">
            <el-input v-model="searchForm.remark" size="mini" placeholder="明细备注"></el-input>
          </el-form-item>
        </el-col>
      </el-row>      
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" :loading="loading" size="mini" @click="loadData(true)">查询</el-button>
        <el-button  icon="el-icon-refresh" type="primary" size="mini" @click="resetForm">重置</el-button>
        <el-button icon="el-icon-download" @click="downLoad" :loading="loading" size="mini" type="primary">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      ref="orderTable"
      v-loading="tableLoading"
      style="width: 100%;"
      :summary-method="getSummaries"
      show-summary
      height="450"
      highlight-current-row
      :default-sort = "{prop: 'date', order: 'descending'}">
      <el-table-column
        type="index"
        label="序号"
        width="50">
      </el-table-column>      
      <el-table-column
        prop="pCode"
        label="产品编号"
        width="100">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.pCode.substring(0,5)=='98071'"
            type="text"
            @click="view(scope.row)">{{scope.row.pCode}}</el-button>          
          <span v-else>{{scope.row.pCode}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="pName"
        label="产品名称"
        width="100">
      </el-table-column>
      <!-- <el-table-column
        prop="pCitglcategory"
        label="产品性质"
        width="100">
      </el-table-column> -->      
      <el-table-column
        prop="areaName"
        label="区域"
        sortable
        width="80">
      </el-table-column>
      <el-table-column
        prop="provinceName"
        label="省办"
        sortable
        width="80">
      </el-table-column>
      <el-table-column
        prop="dm"
        label="DM工号"
        width="80">
      </el-table-column>
      <el-table-column
        prop="dmName"
        label="DM姓名"
        width="100">
      </el-table-column>
      <el-table-column
        prop="fs"
        label="DFS工号"
        width="100">
      </el-table-column>  
      <el-table-column
        prop="fsName"
        label="DFS姓名"
        width="100">
      </el-table-column>  
      <el-table-column
        prop="parentClientId"
        label="分销商编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="parentClientName"
        label="分销商名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="clientId"
        label="专卖店编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="clientName"
        label="专卖店名称"
        width="150">
      </el-table-column>
      <el-table-column
        prop="clientPName"
        label="客户名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="orderQty"
        label="订货数量"
        width="100">
      </el-table-column>
      <el-table-column
        prop="orderUnit"
        label="订货单位"
        width="100">
      </el-table-column>
      <el-table-column
        prop="orderRatio"
        label="订货比率"
        width="100">
      </el-table-column>
      <el-table-column
        prop="citQuantity"
        label="发货数量（套/件）"
        width="100">
      </el-table-column>
      <el-table-column
        prop="orderUnitPrice"
        label="订购单价（元/套）"
        width="100">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.orderUnitPrice,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="最小产品单价"
        width="100">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.prdPrice,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="isDiscount"
        label="打折属性"
        width="100">
        <template slot-scope="scope">
          {{scope.row.isDiscount==1 ? '是':'否'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="beforeBenifitPrice"
        label="优惠前零售额"
        width="150">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.beforeBenifitPrice,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="allCouponMoney"
        label="优惠券金额"
        width="100">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.couponMoney + scope.row.dDiscountDiffMoney,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="couponMoney"
        label="折扣差C金额"
        width="100">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.couponMoney,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="dDiscountDiffMoney"
        label="活动类优惠券金额"
        width="100">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.dDiscountDiffMoney,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="afterCouponDiscountPrice"
        label="优惠后打折零售额"
        width="150">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.afterCouponDiscountPrice,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="afterCouponPrice"
        label="优惠后零售额"
        width="150">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.afterCouponPrice,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="discountRate"
        label="门店折扣率"
        width="100">
        <template slot-scope="scope"> 
          {{scope.row.discountRate}}%
        </template>
      </el-table-column>
      <el-table-column
        prop="accountPayable"
        label="应付金额"
        width="150">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.accountPayable,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="aDiscountDiffMoney"
        label="支付折扣差A金额"
        width="100">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.aDiscountDiffMoney,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="bDiscountDiffMoney"
        label="支付折扣差B金额"
        width="100">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.bDiscountDiffMoney,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="actuallyPayment"
        label="实际应付金额"
        width="150">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.actuallyPayment,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="citExtendedPrice"
        label="销售净额"
        width="150">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.citExtendedPrice,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="realDiscountRate"
        label="实际折扣率"
        width="100">
        <template slot-scope="scope"> 
          {{scope.row.realDiscountRate}}%
        </template>
      </el-table-column>
      <el-table-column
        prop="techDiscountRate"
        label="技术折扣率"
        width="100">
        <template slot-scope="scope"> 
          {{(scope.row.techDiscountRate*1).toFixed(2)}}%
        </template>
      </el-table-column>  
      <el-table-column
        prop="inserttime"
        label="创建日期"
        :formatter="formatter"
        width="100">
      </el-table-column>
      <el-table-column
        prop="auditbyClientTime"
        label="客服审核日期"
        :formatter="formatter"
        width="100">
      </el-table-column>
      <el-table-column
        prop="auditbyFinanceTime"
        label="财务审核日期"
        :formatter="formatter"
        width="100">
      </el-table-column>  
      <el-table-column
        prop="orderNo"
        label="订单号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="orderType"
        :formatter="formatter"
        label="订单类型"
        width="100">
      </el-table-column>
      <el-table-column
        prop="orderStatus"
        label="订单状态"
        :formatter="formatter"
        width="100">
      </el-table-column> 
      <el-table-column
        prop="promotionName"
        label="促销名称"
        width="100">
        <template slot-scope="scope">
          <div :title="scope.row.promotionName" class="textOverflow">{{scope.row.promotionName}}</div>
        </template>
      </el-table-column>  
      <el-table-column
        prop="promotionRemark"
        label="促销备注"
        width="100">
        <template slot-scope="scope">
          {{scope.row.promotionRemark=='1' ? '临时促销': (scope.row.promotionRemark=='2' ? '区域促销':'空')}}
        </template>
      </el-table-column>  
      <el-table-column
        prop="groupFlag"
        label="是否团购"
        width="100">
        <template slot-scope="scope">
          {{scope.row.groupFlag==1 ? '是':'否'}}
        </template>
      </el-table-column>  
      <el-table-column
        prop="outletProperty"
        label="专卖店性质"
        width="100">
      </el-table-column>
      <el-table-column
        prop="declarationTypeInt"
        label="申报类型"
        :formatter="formatter"
        width="100">
      </el-table-column>
      <el-table-column
        prop="applyType"
        label="申请类型"
        width="100">
      </el-table-column>
      <el-table-column
        prop="projectName"
        label="项目名称"
        :formatter="formatter"
        width="100">
      </el-table-column>
      <el-table-column
        prop="oldOrderNo"
        label="原订单号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="orderRemark"
        label="订单备注"
        width="100">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="明细备注"
        width="100">
      </el-table-column>
      <el-table-column
        prop="pickNo"
        label="拣货单号"
        width="100">
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top:15px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.pagingQuery.pageIndex"
        :page-sizes="[50, 100, 200]"
        layout="slot,sizes, prev, pager, next, jumper"
        :total="total">
        <span class="el-pagination__total" v-if="total < $baseData.maxNumber">共&nbsp;{{total}}&nbsp;条</span>
        <span class="el-pagination__total" v-else>{{$baseData.maxTitle}}</span>
      </el-pagination>
    </div>
    <el-dialog :title="title" width="80%" top="2%" :visible.sync="dialogVisible">
      <el-table
        :data="subTableData"
        style="width: 100%;"
        height="350"
        highlight-current-row
        :default-sort = "{prop: 'date', order: 'descending'}">
        <el-table-column
          type="index"
          label="序号"
          width="50">
        </el-table-column>      
        <el-table-column
          prop="pCode"
          label="产品编号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="pName"
          label="产品名称"
          width="100">
        </el-table-column>
        <el-table-column
          prop="pCitglcategory"
          label="产品性质"
          width="100">
        </el-table-column>    
        <el-table-column
          prop="orderQty"
          label="订货数量"
          width="100">
        </el-table-column>
        <el-table-column
          prop="orderUnit"
          label="订货单位"
          width="100">
        </el-table-column>
        <el-table-column
          prop="orderRatio"
          label="订货比率"
          width="100">
        </el-table-column>
        <el-table-column
          prop="citQuantity"
          label="发货数量（套/件）"
          width="100">
        </el-table-column>
        <el-table-column
          prop="citUnitPrice"
          label="单价（元/套）"
          width="100">
        </el-table-column>
        <el-table-column
          prop="isDiscount"
          label="打折属性"
          width="100">
          <template slot-scope="scope">
            {{scope.row.isDiscount==1 ? '是':'否'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="beforeBenifitPrice"
          label="优惠前零售额"
          width="150">
          <template slot-scope="scope"> 
            {{$util.formatThousand(scope.row.beforeBenifitPrice,2)}}
          </template>
        </el-table-column>
        <el-table-column
            prop="allCouponMoney"
            label="优惠券金额"
            width="100">
            <template slot-scope="scope"> 
              {{$util.formatThousand(scope.row.couponMoney + scope.row.dDiscountDiffMoney,2)}}
            </template>
          </el-table-column>
          <el-table-column
            prop="couponMoney"
            label="折扣差C金额"
            width="100">
            <template slot-scope="scope"> 
              {{$util.formatThousand(scope.row.couponMoney,2)}}
            </template>
          </el-table-column>
          <el-table-column
            prop="dDiscountDiffMoney"
            label="活动类优惠券金额"
            width="100">
            <template slot-scope="scope"> 
              {{$util.formatThousand(scope.row.dDiscountDiffMoney,2)}}
            </template>
          </el-table-column>
        <el-table-column
          prop="afterCouponDiscountPrice"
          label="优惠后打折零售额"
          width="150">
          <template slot-scope="scope"> 
            {{$util.formatThousand(scope.row.afterCouponDiscountPrice,2)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="afterCouponPrice"
          label="优惠后零售额"
          width="150">
          <template slot-scope="scope"> 
            {{$util.formatThousand(scope.row.afterCouponPrice,2)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="accountPayable"
          label="应付金额"
          width="150">
          <template slot-scope="scope"> 
            {{$util.formatThousand(scope.row.accountPayable,2)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="aDiscountDiffMoney"
          label="支付折扣差A金额"
          width="100">
          <template slot-scope="scope"> 
            {{$util.formatThousand(scope.row.aDiscountDiffMoney,2)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="bDiscountDiffMoney"
          label="支付折扣差B金额"
          width="100">
          <template slot-scope="scope"> 
            {{$util.formatThousand(scope.row.bDiscountDiffMoney,2)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="actuallyPayment"
          label="实际应付金额"
          width="150">
          <template slot-scope="scope"> 
            {{$util.formatThousand(scope.row.actuallyPayment,2)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="citExtendedPrice"
          label="销售净额"
          width="150">
          <template slot-scope="scope"> 
            {{$util.formatThousand(scope.row.citExtendedPrice,2)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="realDiscountRate"
          label="实际折扣率"
          width="100">
          <template slot-scope="scope"> 
            {{(scope.row.realDiscountRate*1).toFixed(2)}}%
          </template>
        </el-table-column>
        <el-table-column
          prop="techDiscountRate"
          label="技术折扣率"
          width="100">
          <template slot-scope="scope"> 
            {{(scope.row.techDiscountRate*1).toFixed(2)}}%
          </template>
        </el-table-column>  
        <el-table-column
          prop="pickNo"
          label="拣货单号"
          width="100">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="dialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        productList:[],
        fMonth:[],
        summaries:{},
        Dictions:{
          outlet_property2:[],
          order_status:[],
          order_type:[],
          pay_status:[],
          return_reason:[],
          declaration_type_order:[],
          order_project_type:[],
          order_apply_type:[],
          promotion_prd_type:[]
        },//所有的字典
        loading:false,
        currentPage:1,
        total:0,
        tableLoading:false,
        searchForm:{
          fsName:'',
          payStatus:'',
          clientType:'',
          orderStatus:'',
          orderStatusList:[],
          excessThreshold:'',
          beforeBenifitPriceIsZero:'',
          returnReason:'',
          orderType:'',
          orderTypeList:[],
          declarationTypeInt:'',
          orderRemark:'',
          isDiscount:'',
          pCodeList:[],
          promotionName:'',
          orderTypeList:[],
          sDbStr:'',
          orderNo:'',
          orderUnitPriceMin:'',
          orderUnitPriceMax:'',
          promotionPrdType:'',
          pCitglcategory:'',
          sProvince:[],
          provinceObject:[],
          sRegion:[],
          areaObject:[],
          promotionPrdTypeList:[],
          dfs:'',
          clientId:'',
          groupFlag:'',
          date:'',
          date2:'',
          auditbyClientStartTime:'',
          auditbyClientEndTime:'',
          auditbyFinanceTimeArray:'',
          auditbyFinanceStartTime:'',
          auditbyFinanceEndTime:'',
          endTime:'',
          startTime:'',
          remark:'',
          promotionRemark:'',
          isKit:'',
          pName:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:50
          }
        },
        tableData: [
        ],
        dialogVisible:false,
        title:'',
        subTableData:[]
      }
    },
    watch:{
      'searchForm.auditbyFinanceTimeArray':function(val){
        if(!val){
          this.searchForm.auditbyFinanceStartTime = '';
          this.searchForm.auditbyFinanceEndTime = '';
        }
        else{
          this.searchForm.auditbyFinanceStartTime = val[0];
          this.searchForm.auditbyFinanceEndTime = val[1];
        }
      },
      'searchForm.date':function(val){
        if(!val){
          this.searchForm.startTime = '';
          this.searchForm.endTime = '';
        }
        else{
          this.searchForm.startTime = val[0];
          this.searchForm.endTime = val[1];
        }
      },
      'searchForm.date2':function(val){
        if(!val){
          this.searchForm.auditbyClientStartTime = '';
          this.searchForm.auditbyClientEndTime = '';
        }
        else{
          this.searchForm.auditbyClientStartTime = val[0];
          this.searchForm.auditbyClientEndTime = val[1];
        }
      },
      "searchForm.areaObject":function(val){
        let datas = [];
        val.map(item=>{
          if(item.code !='999')
            datas.push(item.code)
        })
        this.searchForm.sRegion = datas;
      },
      "searchForm.provinceObject":function(val){
        let datas = [];
        val.map(item=>{
          if(item.code !='999')
            datas.push(item.code)
        })
        this.searchForm.sProvince = datas;
      }
    },
    methods: {
      remoteMethod(query){        
        if(query.length < 4){
          this.productList = []
          return;
        }
        let thiz = this;
        let searchParam = {
          condition:{
            pCode: query,
            pName: "",
            catalogCode:""
          },
          pagingQuery:{
            pageIndex:1,
            pageSize:10
          }
        }
        thiz.$baseData.productList(thiz,searchParam).then(res=>{
          thiz.productList  = res.body.models;
        })
      },
      resetForm(){
        this.searchForm = {
          fsName:'',
          declarationTypeInt:'',
          payStatus:'',
          clientType:'',
          orderStatus:'',
          orderRemark:'',
          orderStatusList:[],
          excessThreshold:'',
          beforeBenifitPriceIsZero:'',
          returnReason:'',
          orderType:'',
          orderTypeList:[],
          isDiscount:'',
          pCodeList:[],
          promotionName:'',
          orderTypeList:[],
          sDbStr:'',
          orderNo:'',
          orderUnitPriceMin:'',
          orderUnitPriceMax:'',
          promotionPrdType:'',
          pCitglcategory:'',
          sProvince:[],
          provinceObject:[],
          sRegion:[],
          areaObject:[],
          promotionPrdTypeList:[],
          dfs:'',
          clientId:'',
          groupFlag:'',
          date:this.fMonth,
          endTime:'',
          startTime:'',
          date2:'',
          auditbyClientStartTime:'',
          auditbyClientEndTime:'',
          remark:'',
          promotionRemark:'',
          isKit:'',
          pName:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:this.searchForm.pagingQuery.pageSize
          }
        }
        /* let today = new Date();
        let t = today.getTime()-92*1000*60*60*24;
        let day92 = new Date(t);
        this.searchForm.date = [new Date(today.getFullYear()+'-'+(today.getMonth()+1)+'-01').format("yyyy-MM-dd"),new Date(today.getFullYear(),today.getMonth()+1,0).format("yyyy-MM-dd")]
        */        
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='returnReason'){
          this.Dictions.return_reason.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='orderType'){
          this.Dictions.order_type.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })  
        }
        else if(column.property =='payStatus'){
          this.Dictions.pay_status.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })  
        }
        else if(column.property =='declarationTypeInt'){
          this.Dictions.declaration_type_order.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })  
        }
        else if(column.property =='orderStatus'){
          this.Dictions.order_status.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })  
        }
        else if(column.property =='projectName'){
          this.Dictions.order_project_type.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })  
        }
        else if(column.property =='createtime' || column.property =='auditbyClientTime' 
        || column.property =='auditbyFinanceTime' || column.property =='returntime' || column.property =='inserttime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss");
        }
        return txt;
      },
      view(row){
        this.dialogVisible = true; 
        this.title = 'kit产品:'+row.pCode+'('+row.pName+')'
        
        this.getSubProduct(row);  
      },
      getSubProduct(row){
        let thiz = this;
        thiz.$tupHttp(thiz,'order/getSubProduceList/'+row.id,'GET').then(res=>{
          if(res.body.models)
            thiz.subTableData = res.body.models;
        })        
      },
      downLoad(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        delete data.pagingQuery;
        thiz.$tupHttp(thiz,'order/exportClientOrderDetailList','POST',data,{Accept: '*/*'},'',true).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '文件已加入下载队列，稍后前往 "基础设置-内容管理-导出下载" 下载文件'
          });
        },res=>{
          thiz.loading = false;
        })
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      },     
      detail(index, row) {
        this.gotoUrl('/frame/terminal/customerInfo/'+row.id)
      },
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData();
      },
      handleSizeChange(val) {
        this.searchForm.pagingQuery.pageSize = val;
        this.loadData();
      },
      getSummaries(param) {
        let thiz = this;
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '统计';
            return;
          }
          const values = thiz.summaries[column.property];
          if (!!values || values == 0) {      
            if(column.property == 'orderQty' || column.property == 'citQuantity')     
              sums[index] = thiz.$util.formatThousand(values,0);
            else 
              sums[index] = thiz.$util.formatThousand(values,2);
          } else {
            sums[index] = '';
          }
        });
        return sums;
      },
      loadData(isSearch){
        let thiz = this;
        if(!thiz.searchForm.auditbyFinanceStartTime){
          if(!thiz.searchForm.auditbyClientStartTime){
            if(new Date(thiz.searchForm.endTime).diff(new Date(thiz.searchForm.startTime)) > 92 || !thiz.searchForm.startTime){
              thiz.$notify.error({
                title: '错误提示',
                message: '创建日期不能超过92天或者为空'
              });
              return ;
            }
          }
          else{
            if(new Date(thiz.searchForm.auditbyClientEndTime).diff(new Date(thiz.searchForm.auditbyClientStartTime)) > 92 || !thiz.searchForm.auditbyClientStartTime){
              thiz.$notify.error({
                title: '错误提示',
                message: '客服审核日期不能超过92天或者为空'
              });
              return ;
            }
          }
        }else{
          if(new Date(thiz.searchForm.auditbyFinanceEndTime).diff(new Date(thiz.searchForm.auditbyFinanceStartTime)) > 92 || !thiz.searchForm.auditbyFinanceStartTime){
            thiz.$notify.error({
              title: '错误提示',
              message: '财务审核日期不能超过92天或者为空'
            });
            return ;
          }
        }  
        thiz.tableLoading = true;
        thiz.loading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        this.$tupHttp(this,'order/getClientOrderDetailList','POST',thiz.searchForm).then(res=>{
          thiz.tableData = res.body.models
          thiz.tableLoading = false;
          thiz.total = res.body.pageInfo.total ? res.body.pageInfo.total : 0;
          thiz.loading = false;
        },res=>{
          thiz.tableLoading = false;
          thiz.loading = false;
        })
        if(thiz.searchForm.pagingQuery.pageIndex == 1){
          this.loadSum()
        } 
      },
      loadSum(){
        let thiz = this;
        this.$tupHttp(this,'order/sumByClientOrderDetailList','POST',thiz.searchForm).then(res=>{
          if(res.body.model){
            thiz.summaries = res.body.model
            thiz.$refs.orderTable.doLayout()
          }
        })
      },
      loadDictions(){
        let thiz = this;
        let params = ["order_type","order_status","outlet_property2","pay_status","return_reason",'declaration_type_order','order_project_type','order_apply_type','promotion_prd_type'];
        this.$baseData.getDicts(this,params,function(data){
          thiz.Dictions = data;
        });
      },
      getFMonth(){
        let thiz = this;   
        let today = new Date();     
        this.$tupHttp(this,'monForFinancing/selectByMonth?date='+today.format("yyyy-MM-dd"),'GET').then(res=>{
          if(res.body.model){
            thiz.fMonth = [new Date(res.body.model.startDate).format("yyyy-MM-dd"),new Date(res.body.model.endDate).format("yyyy-MM-dd")]
            thiz.searchForm.date = thiz.fMonth
          }
        })
      }
    },
    mounted(){
      this.loadDictions();
      this.getFMonth();
      this.$util.onKeyCode(this,'loadData',[true])
      /* let today = new Date();
      let t = today.getTime()-92*1000*60*60*24;
      let day92 = new Date(t);
      this.searchForm.date = [new Date(today.getFullYear()+'-'+(today.getMonth()+1)+'-01').format("yyyy-MM-dd"),new Date(today.getFullYear(),today.getMonth()+1,0).format("yyyy-MM-dd")]
      */    
    }
  }
</script>
<style scoped>
.itemsTitle{
  font-size: 20px;
  border-bottom: 1px solid #ccc;
}
.demo-form-inline{
  margin-bottom: 10px;
  padding: 25px  25px 0px;
  border-radius: 4px;
  border: 1px solid #eee;
}
</style>
