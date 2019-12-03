<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单详情查看</el-breadcrumb-item>
    </el-breadcrumb>
    <br/>
    <el-form label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="订单号：">
            {{orderNo}}
          </el-form-item>   
        </el-col>
        <el-col :span="12">
          <el-form-item label="订单类型：">
            {{formatter({orderType:model.orderType},{property:'orderType'})}}
          </el-form-item>    
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="专卖店编号：">
            {{model.clientId}}
          </el-form-item>  
        </el-col>
        <el-col :span="12" style="text-align:right">
          <el-button icon="el-icon-import"  @click="editItem" :loading="loading" v-show="!isApproved"  type="success">审核</el-button>
          <el-button @click="$router.go(-1)">返回</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="产品订单详细" name="zero">
        <el-table
          :data="model.details"
          ref="orderTable"
          style="width: 100%;"
          height="450"
          highlight-current-row
          @selection-change="handleSelectionChange"
          :default-sort = "{prop: 'date', order: 'descending'}">
          <el-table-column
            type="index"
            label="序号"
            width="50">
          </el-table-column>      
          <el-table-column
            prop="lineno"
            label="产品明细行数"
            width="100">
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
          <el-table-column
            prop="promotionPrdType"
            label="产品类型"
            :formatter="formatter"
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
            prop="deliverQty"
            label="发货数量（套/件）"
            width="100">
            <template slot-scope="scope">
              {{scope.row.citQuantity}}
            </template>
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
            prop="citUnitPrice"
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
            width="100">
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
            width="100">
            <template slot-scope="scope"> 
              {{$util.formatThousand(scope.row.afterCouponDiscountPrice,2)}}
            </template>
          </el-table-column>
          <el-table-column
            prop="afterCouponPrice"
            label="优惠后零售额"
            width="100">
            <template slot-scope="scope"> 
              {{$util.formatThousand(scope.row.afterCouponPrice,2)}}
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="门店折扣率"
            width="100">
            <template slot-scope="scope">
              {{model.discountRate}}%
            </template>
          </el-table-column>
          <el-table-column
            prop="accountPayable"
            label="应付金额"
            width="100">
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
            width="100">
            <template slot-scope="scope"> 
              {{$util.formatThousand(scope.row.actuallyPayment,2)}}
            </template>
          </el-table-column>
          <el-table-column
            prop="citExtendedPrice"
            label="销售净额"
            width="100">
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
            prop="promotionName"
            label="促销名称"
            width="100">
            <template slot-scope="scope">
              <div :title="scope.row.promotionName" class="textOverflow">{{scope.row.promotionName}}</div>
            </template>
          </el-table-column>  
          <el-table-column
            prop="pickNo"
            label="拣货单号"
            width="100">
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="订单信息" name="first">
        <div>
          <el-form :model="model" ref="modelForm" label-width="180px">
            <h5>>>专卖店信息</h5>
            <el-row>
              <el-col :span="12">
                <el-form-item label="区域：">
                  {{model.areaName +'-'+model.areaCode}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="省办：">
                  {{model.provinceName +'-'+model.provinceCode}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="DM工号：">
                  {{model.dm}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="DM姓名：">
                  {{model.dmName}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="DFS工号：">
                  {{model.fs}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="DFS姓名：">
                  {{model.fsName}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="分销商编号：">
                  {{model.parentClientId}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="分销商名称：">
                  {{model.parentClientName}}
                </el-form-item>
              </el-col>              
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="挑战方案：">
                  {{model.classification}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
              </el-col>              
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="专卖店名称：">
                  {{model.clientName}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="专卖店状态：">
                  {{model.pOutletStatus}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="专卖店类型：">
                  {{model.clientType}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="专卖店性质：">
                  {{formatter({outletProperty:model.outletProperty},{property:'outletProperty'})}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="送货对象编号：">
                  {{model.shipTo}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="送货对象名称：">
                  {{model.shipToName}}
                </el-form-item>
              </el-col>
            </el-row>
            <div class="itemsTitle"></div>
            <h5>>>订单信息</h5>
            <el-row>
              <el-col :span="12">
                <el-form-item label="创建日期：">
                  {{formatter({createtime:model.createtime},{property:'createtime'})}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="订单状态：">
                  {{formatter({orderStatus:model.orderStatus},{property:'orderStatus'})}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="订单类型：">
                  {{formatter({orderType:model.orderType},{property:'orderType'})}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="申报类型：">
                  {{formatter({declarationTypeInt:model.declarationTypeInt},{property:'declarationTypeInt'})}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="付款日期："> 
                  {{formatter({payTime:model.payTime},{property:'payTime'})}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="付款状态："> 
                  {{formatter({payStatus:model.payStatus},{property:'payStatus'})}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="订单备注：">
                  {{model.orderRemark}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="客服审核日期：">
                  {{formatter({auditbyClientTime:model.auditbyClientTime},{property:'auditbyClientTime'})}}
                </el-form-item>
              </el-col>
               <el-col :span="12">
                <el-form-item label="客服审核备注：">
                  {{model.auditbyClientRemark}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="财务审核日期：">
                 {{formatter({auditbyFinanceTime:model.auditbyFinanceTime},{property:'auditbyFinanceTime'})}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="财务审核备注：">
                  {{model.auditbyFinanceRemark}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="退回原因：">
                  {{formatter({returnReason:model.returnReason},{property:'returnReason'})}}
                </el-form-item> 
              </el-col>
              <el-col :span="12">
                <el-form-item label="退回时间：">
                  {{formatter({returntime:model.returntime},{property:'returntime'})}}
                </el-form-item> 
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="订单失效时间：">
                  {{model.autoReturnTime}}
                </el-form-item> 
              </el-col>
            </el-row>
            <div class="itemsTitle"></div>
            <h5>>>订单价格信息</h5>
            <el-row>              
              <el-col :span="12">
                <el-form-item label="订单零售价：">
                  {{$util.formatThousand(model.productPay,2)}}
                </el-form-item>
              </el-col>              
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="不打折产品金额：">
                  {{$util.formatThousand(model.productPrice,2)}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="打折产品金额：">
                  {{$util.formatThousand(model.discountProductPrice,2)}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="优惠金额：">
                  {{$util.formatThousand(model.couponMoney,2)}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="优惠后打折产品金额：">
                  {{$util.formatThousand(model.afterCouponPrice,2)}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="优惠后订单零售价：">
                  {{$util.formatThousand(model.couponTotalAmount,2)}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>            
              <el-col :span="12">
                <el-form-item label="门店折扣率：">
                  {{model.discountRate}}%
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="本单应付金额：">
                   {{$util.formatThousand(model.discountProductPay+model.productPrice,2)}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="产生折扣差金额：">
                  {{$util.formatThousand(model.discountDiffMoney,2)}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="支付折扣差A金额：">
                  {{$util.formatThousand(model.aDiscountDiffMoney,2)}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="支付折扣差B金额：">
                  {{$util.formatThousand(model.bDiscountDiffMoney,2)}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="实际应付金额：">
                  {{$util.formatThousand(model.mustPay,2)}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="销售净额：">
                  {{$util.formatThousand(model.netSales,2)}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="实际折扣率：">
                  {{model.realDiscountRate}}%
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="打折产品技术折扣率：">
                  {{model.techDiscountproductRate}}%
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="不打折产品技术折扣率：">
                  {{model.techDiscountnonproductRate}}%
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="超过阈值：">
                  {{model.excessThreshold==1 ? '是':'否'}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否自付运费：">
                  {{model.isSelfPayFreight==1 ? '是':(model.isSelfPayFreight==0 ? '否':'')}}
                </el-form-item>
              </el-col>              
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="是否团购：">
                  {{model.groupFlag==1 ? '是':'否'}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="原订单号：">
                  {{model.oldOrderNo}}
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="审核" width="30%" top="10%" :visible.sync="dialogVisible">
      <el-form  :model="approveForm" label-width="80px" >
        <el-form-item label="通过">            
          <el-switch
            :active-value="1"
            :inactive-value="0"
            v-model="approveForm.pass">
          </el-switch>
        </el-form-item>
        <el-form-item v-show="approveForm.pass==0" label="退回原因">            
          <el-select v-model="approveForm.returnReason" clearable filterable  placeholder="请选择">
            <el-option
              v-for="item in Dictions.return_reason"
              :key="item.dictValue"
              :label="item.dictName"
              :value="item.dictValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">            
         <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="approveForm.orderRemark">
          </el-input>
        </el-form-item>
        <el-form-item label="是否团购">            
          <el-switch
            :active-value="1"
            :inactive-value="0"
            v-model="approveForm.groupFlag">
          </el-switch>
        </el-form-item>
      </el-form>     
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" size="mini" @click="saveItem">确认</el-button>
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="title" width="80%" top="2%" :visible.sync="dialogVisible1">
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
          prop="deliverQty"
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
        <el-button type="primary" size="mini" @click="dialogVisible1 = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        orderNo:this.$route.params.orderNo,
        multipleSelection:[],
        customerModel:{},
        model:{},
        Dictions:{
          outlet_property2:[],
          outlet_property:[],
          order_status:[],
          order_type:[],
          pay_status:[],
          return_reason:[],
          promotion_prd_type:[],
          declaration_type_order:[]
        },
        comForm:{
          title:'',
          description:'',
          isarea:'',
          areas:[],
          time:null,
          status:0,
          promotionThemeType:0
        },
        comRules:{
          title: [
            { required: true, message: '必填', trigger: 'change' }
          ],
          time: [
            { required: true, message: '必填', trigger: 'change' }
          ]
        },
        loading:false,
        activeName:'zero',
        treeLoading:false,
        approveForm:{
          pass:1,
          groupFlag:0,
          returnReason:'',
          orderRemark:''
        },
        dialogVisible:false,
        isApproved:false,
        dialogVisible1:false,
        title:'',
        subTableData:[]
      }
    },
    watch:{
    },
    methods: {
      view(row){
        this.dialogVisible1 = true; 
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
      editItem() {
        this.approveForm = {
          pass:1,
          returnReason:'',
          orderRemark:''
        }
        this.dialogVisible = true;  
      }, 
      saveItem(){
        let thiz = this;
        if(this.approveForm.pass==0 && !this.approveForm.returnReason){
          thiz.$notify.error({
            title: '错误提示',
            message: '审核不通过时退回原因必选'
          });
          return;
        }
        thiz.loading = true;
        let data = {
          pass:this.approveForm.pass,
          returnReason:this.approveForm.returnReason,
          orderRemark:this.approveForm.orderRemark,
          groupFlag:this.approveForm.groupFlag,
          orderList:[{orderNo:this.orderNo}]
        };
        thiz.$tupHttp(thiz,'order/auditbyBatch','POST',data).then(res=>{
          thiz.$notify({
            title: '提示',
            message: '操作成功'
          });
          thiz.gotoUrl('/frame/order/orderForCs')
          thiz.loading = false;
          thiz.dialogVisible = false;
          thiz.isApproved = true;          
        },res=>{
          thiz.loading = false;
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      returnGoods(){
        let thiz = this;
        this.loading = true;
        let txt = '订单尚未发货，是否确认退货?';
        if(this.model.orderStatus == 6){
          txt = '订单已发货，是否确认为客户退货?'
        }
        let data = {
          orderNo : this.orderNo,
          details : this.multipleSelection
        }
        this.$confirm(txt, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          thiz.$tupHttp(thiz,'order/fullOrPartReturn','POST',data).then(res=>{
            thiz.gotoUrl('/frame/order/returnOrderAndGoods')
          },res=>{
            thiz.loading = false;
          }) 
        }).catch(() => {    
          thiz.loading = false;  
        });
        
      },
      commitData(){
        let thiz = this;
        this.loading = true;
        let data = this.$util.deepClone(thiz.comForm);
        thiz.$tupHttp(thiz,'promotion/update','POST',data).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功',
            message : '保存成功'
          });
          thiz.promotionThemeType = thiz.comForm.promotionThemeType;
        },res=>{
          thiz.loading = false;
        })
      }, 
      commit(){
        this.$refs.comForm.validate((valid) => {
          if (valid) {
            this.commitData();
          } else {
            return false;
          }
        });
      },
      showAddDialog(){
        this.addDialogVisible = true;
      },
      gotoUrl(url){
        this.$router.push({ path: url });
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
        else if(column.property =='declarationTypeInt'){
          this.Dictions.declaration_type_order.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })  
        }
        else if(column.property =='promotionPrdType'){
          this.Dictions.promotion_prd_type.map(item=>{
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
        else if(column.property =='outletProperty'){
          this.Dictions.outlet_property.map(item=>{
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
        else if(column.property =='createtime' || column.property =='auditbyClientTime' 
        || column.property =='auditbyFinanceTime' || column.property =='returntime' || column.property =='payTime' 
        || column.property == 'autoReturntime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss");
        }
        return txt;
      },
      getInfo(){
        let thiz = this;
        thiz.$tupHttp(thiz,'order/queryOrderDetails?orderNo='+this.orderNo,'GET').then(res=>{
          let model = res.body.model;  
          thiz.model = model; 
        }) 
      },
      loadDictions(){
        let thiz = this;
        let params = ["declaration_type_order","order_type","order_status","outlet_property","outlet_property2","pay_status","return_reason","promotion_prd_type"];
        this.$baseData.getDicts(this,params,function(data){
          thiz.Dictions = data;
        });
      }
    },
    mounted(){
      this.getInfo();    
      this.loadDictions();  
    }
  }
</script>

<style scoped>
.itemsTitle{
  font-size: 20px;
  border-bottom: 1px solid #ccc;
}
.dialog-footer{
  margin-top: 30px;
  text-align: center;
}
</style>