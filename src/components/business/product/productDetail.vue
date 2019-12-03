<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>产品信息</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/frame/product/onSale' }">基础信息</el-breadcrumb-item>
      <el-breadcrumb-item>产品详情</el-breadcrumb-item>
    </el-breadcrumb>
    <br/>      
    <div class="itemsTitle"></div>
    <div>
      <el-form :model="model" :rules="modelRules" ref="modelForm" label-width="220px">
        <el-form-item style="margin-bottom:0px" label="产品编号：">          
          {{model.pCode}}
        </el-form-item>
        <el-form-item style="margin-bottom:0px" label="产品名称（中文）："   prop="pName">          
          <el-input v-model="model.pName" :disabled="model.productAttr.isKitProduct != 1"  placeholder=""></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom:0px" label="产品名称（英文）：">          
          <el-input v-model="model.pEnglishName" :disabled="model.productAttr.isKitProduct != 1" placeholder=""></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom:0px" label="产品状态：" >          
          {{model.productAttr.pStatus==1 ? '上架':'下架'}}
        </el-form-item>
        <el-form-item label="产品上下架日期" prop="pSaleDate">
          <el-date-picker
            v-model="pSaleDate"
            type="daterange"
            range-separator="-"            
            start-placeholder="开始日期"
            :default-time="['00:00:00', '23:59:59']"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>        
        <el-form-item style="margin-bottom:0px" label="产品有效期：" >    
          <el-date-picker
            v-model="pExpriceDate"
            type="daterange"
            range-separator="-"
            :disabled="model.productAttr.isKitProduct != 1"
            start-placeholder="开始日期"
            :default-time="['00:00:00', '23:59:59']"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item style="margin-bottom:0px" label="价格有效期：" prop="priceExpriceDate">        
          <el-date-picker
            v-model="priceExpriceDate"
            :disabled="model.productAttr.isKitProduct != 1"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            :default-time="['00:00:00', '23:59:59']"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        
        <el-form-item style="margin-bottom:0px" label="价格：" prop="price">     
          <el-input-number  v-model="model.price" :disabled="model.productAttr.isKitProduct != 1" placeholder=""></el-input-number>
        </el-form-item> 
        <el-form-item style="margin-bottom:0px" label="JDE库存：">          
          {{model.jdeStock}}
        </el-form-item>
        <el-form-item style="margin-bottom:0px" label="可用库存：">          
          {{model.availableStock}}
        </el-form-item>  
        <el-form-item label="BO数量">
          <el-input-number disabled v-model="model.productAttr.pBoquantity" :min="0" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item label="安全库存">
          <el-input-number v-model="model.productAttr.pSecuritystock" :min="0" label="描述文字"></el-input-number>
        </el-form-item> 
        <div class="itemsTitle" v-if="model.productAttr.isKitProduct == 1">子产品维护</div> 
        <el-row :gutter="5" v-if="model.productAttr.isKitProduct == 1">
          <el-col :span="24">
            <el-popover
              placement="bottom"
              width="360"
              v-model="visible">
                <el-form ref="comForm" :model="comForm" :rules="comRules" label-width="120px">
                  <el-form-item label="子产品编号" prop="pCode">          
                    <el-input-product-code 
                      v-model="comForm.pCode"
                      size="mini"></el-input-product-code>
                  </el-form-item> 
                  <el-form-item label="数量" prop="qty">          
                    <el-input-number 
                      v-model="comForm.qty"
                      :min="1" 
                      size="mini"
                      label="描述文字"></el-input-number>
                  </el-form-item> 
                </el-form>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="commitSub" :loading="loading">确定</el-button>
              </div>
              <el-button slot="reference"  icon="el-icon-plus" size="mini" type="success">添加子产品</el-button>
            </el-popover>
            <br/><br/>
            <el-table
              :data="subProducts"
              style="width: 99%;"
              border
              height="200"
              highlight-current-row>
              <el-table-column
                prop="pCode"
                label="产品编号"
                width="250">
                <template slot-scope="scope">
                  <el-input-product-code 
                    v-model="scope.row.pCode"
                    @onSelect="handleSelect"
                    :param="scope"
                    size="mini"></el-input-product-code>
                </template>
              </el-table-column>
              <el-table-column
                prop="pName"
                label="产品名称"
                width="250">
              </el-table-column>
              <!-- <el-table-column
                prop="pStatus"
                label="状态"
                width="100">
                <template slot-scope="scope">
                  {{scope.row.pStatus == 1 ? '上架':(scope.row.pStatus == 2 ? '下架':'')}}
                </template>
              </el-table-column>   -->
              <el-table-column
                prop="qty"
                label="数量"
                width="120">
                <template slot-scope="scope">
                  <el-input-number 
                    v-model="scope.row.qty"
                    :min="1" 
                    size="mini"
                    label="描述文字"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                prop="percentage"
                label="金额占比"
                width="120">
                <template slot-scope="scope">
                  {{$util.formatThousand((scope.row.percentage ? scope.row.percentage : 0)*100,2)}}%
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作">
                <template slot-scope="scope">
                  <el-button icon="el-icon-check"  @click="saveSub(scope.$index, scope.row)" type="primary" size="mini">保存</el-button>
                  <el-button icon="el-icon-delete" :disabled="subProducts.length == 1"  @click="deleteProduct(scope.$index, scope.row)" size="mini"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>      
        <div class="itemsTitle">JDE产品描述</div>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="是否打折">
              <el-switch
                :disabled="model.productAttr.isKitProduct != 1"
                :active-value="1"
                :inactive-value="0"
                v-model="model.isDiscount">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="国际条码">
              <el-input v-model="model.pCit3rditemnumber" :disabled="model.productAttr.isKitProduct != 1"  placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="货号（短）">
              <el-input v-model="model.pCitshortnumber" :disabled="true"  placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="BU">
              <el-input v-model="model.pCitbu" :disabled="true" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="装箱单位">
              <el-input v-model="model.pCit2nduom" :disabled="true"  placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Related Unit of Measure">
              <el-input v-model="model.pCitrelatedunitofmeasure" :disabled="true" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="Unit of Measure">
              <el-input v-model="model.pCitunitofmeasure" :disabled="true"  placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Discount">
              <el-input v-model="model.pCitdiscountornot" :disabled="true" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="Item Pool Code">
              <el-input v-model="model.pCititempoolcode" :disabled="true"  placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Landed Cost Rule">
              <el-input v-model="model.pCitlandedcostrule" :disabled="true" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="Master Planning Family">
              <el-input v-model="model.pCitmasterplanningfamily" :disabled="true"  placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Regular Limited Release">
              <el-input v-model="model.pCitregularlimitedrelease" :disabled="true" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="CIT Product Category">
              <el-input v-model="model.pCitprodcategory" :disabled="true"  placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="销售目录名称">
              <el-input v-model="model.pCitsalescatalog" :disabled="true" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="Sales Category3">
              <el-input v-model="model.pCitsalescategory3" :disabled="true"  placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Sales Category4">
              <el-input v-model="model.pCitsalescategory4" :disabled="true" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="Sales Category7">
              <el-input v-model="model.pCitsalescategory7" :disabled="true"  placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Sales Category10">
              <el-input v-model="model.pCitsalescategory10" :disabled="true" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="Stocking Type">
              <el-input v-model="model.pCitstockingtype" :disabled="true"  placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Warehouse Process Group 1">
              <el-input v-model="model.pCitwarehouseprocessgrp1" :disabled="true" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="Warehouse Process Group 2">
              <el-input v-model="model.pCitwarehouseprocessgrp2" :disabled="true"  placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Warehouse Process Group 3">
              <el-input v-model="model.pCitwarehouseprocessgrp3" :disabled="true" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="User ID">
              <el-input v-model="model.pCituserid" :disabled="true"  placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源于CIT">
              <el-radio v-model="model.pFromcit" :disabled="true" label="1">是</el-radio>
              <el-radio v-model="model.pFromcit" :disabled="true" label="2">否</el-radio>
              <el-radio v-model="model.pFromcit" :disabled="true" label="">无</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="产品线">
              <el-input v-model="model.pCitprodline" :disabled="true"  placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Item Dimension Group">
              <el-input v-model="model.pCititemdimensiongroup" :disabled="true" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="小单位">
              <el-select v-model="model.productAttr.orderSmallUnit" clearable filterable :disabled="model.productAttr.isKitProduct != 1" placeholder="请选择">
                <el-option
                  v-for="item in Dictions.order_unit"
                  :key="item.dictValue"
                  :label="item.dictName"
                  :value="item.dictValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否允许欠交">
               <el-switch
                :disabled="model.productAttr.isKitProduct != 1"
                :active-value="true"
                :inactive-value="false"
                v-model="model.pCitboallowed">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="装箱量">
              <el-input-number v-model="model.pCitconversion" :disabled="model.productAttr.isKitProduct != 1"  placeholder=""></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="打折产品">
              <el-input v-model="model.pCitmembercharacter" :disabled="true" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="产品属性">
              <el-input v-model="model.pCitglcategory" :disabled="model.productAttr.isKitProduct != 1"  placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否零配件">
              <el-switch
                :disabled="true"
                :active-value="1"
                :inactive-value="0"
                v-model="model.isParts">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="itemsTitle">产品销售类型</div>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="Brand">
              <el-select v-model="model.productAttr.brand" clearable filterable  placeholder="请选择">
                <el-option
                  v-for="item in Dictions.brand_type"
                  :key="item.dictValue"
                  :label="item.dictName"
                  :value="item.dictValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否主推">
              <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="model.productAttr.isPromotion">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="销售平台">
              <el-input v-model="model.productAttr.pFaremode" disabled placeholder="销售平台"></el-input>
              <!-- <el-select v-model="model.productAttr.pFaremode" clearable filterable  placeholder="请选择">
                <el-option
                  v-for="item in Dictions.sales_platform"
                  :key="item.dictValue"
                  :label="item.dictName"
                  :value="item.dictValue">
                </el-option>
              </el-select> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Category">
              <el-input v-model="model.productAttr.category" disabled placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="itemsTitle">产品其它属性</div>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="是否TPS">
              <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="model.productAttr.isTps">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否有包装盒">
              <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="model.productAttr.isBox">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="Core line">
              <el-input v-model="model.productAttr.coreLine" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="积分值">
              <el-input v-model="model.productAttr.integerPoint" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="是否印刷">
              <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="model.productAttr.isPrint">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可退换货">
              <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="model.productAttr.canReturns">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="是否授权">
              <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="model.productAttr.isAuth">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保质期">
              <el-input v-model="model.productAttr.pProdguaranteeperiod" placeholder="保质期"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="是否PC产品">
              <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="model.productAttr.isPc">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上市时间">
              <el-date-picker
                v-model="model.productAttr.pProdrolloutdate"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="Product Pyramid ">
              <el-select v-model="model.productAttr.pProdpyramid" clearable filterable  placeholder="请选择">
                <el-option
                  v-for="item in Dictions.product_pyramid_type"
                  :key="item.dictValue"
                  :label="item.dictName"
                  :value="item.dictValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订货单位">
              <el-select v-model="model.productAttr.orderUnit" clearable filterable  placeholder="请选择">
                <el-option
                  v-for="item in Dictions.order_unit"
                  :key="item.dictValue"
                  :label="item.dictName"
                  :value="item.dictValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="Product GP Management">
              <el-select v-model="model.productAttr.pProdgpmanagement" clearable filterable  placeholder="请选择">
                <el-option
                  v-for="item in Dictions.product_gp_management_type"
                  :key="item.dictValue"
                  :label="item.dictName"
                  :value="item.dictValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="新产品标识">
              <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="model.productAttr.isNewproduct">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="Mission Million Products">
              <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="model.productAttr.pMssnmlnprod">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否换货">
              <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="model.productAttr.isReturn">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="Sales Type">
              <el-select v-model="model.productAttr.pProdsalestype" clearable filterable  placeholder="请选择">
                <el-option
                  v-for="item in Dictions.sales_type"
                  :key="item.dictValue"
                  :label="item.dictName"
                  :value="item.dictValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否积分">
              <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="model.productAttr.isInteger">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="是否区域促销">
              <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="model.productAttr.isAreaPromotion">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否临时促销">
              <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="model.productAttr.isTemporaryPromotion">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="itemsTitle">产品图片</div>
        <tup-picture-select v-model="pics"></tup-picture-select>
      </el-form>
    </div>
    <div class="dialog-footer">
      <el-button @click="$router.go(-1)">返回</el-button>
      <el-button @click="commit" :loading="loading" type="primary">保存</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        pCode:this.$route.params.pCode,
        loading:false,
        pics:[          
        ],
        pSaleDate:'',
        pExpriceDate:'',
        priceExpriceDate:'',
        Dictions:{
          brand_type:[],
          sales_platform:[],
          sales_type:[],
          order_unit:[],
          product_gp_management_type:[],
          product_pyramid_type:[]
        },//本页面使用的所有字典
        model:{
          productAttr:{},
          pSaleDate:'',
          pExpriceDate:'',
          priceExpriceDate:'',
        },
        modelRules:{
          pName: [
            { required: true, message: '必填', trigger: 'change' }
          ],
          pSaleDate: [
            { required: true, message: '必填', trigger: 'change' }
          ],
          priceExpriceDate: [
            { required: true, message: '必填', trigger: 'change' }
          ],
          price: [
            { required: true, message: '必填', trigger: 'change' }
          ]
        },
        comForm:{
          kitCode:this.$route.params.pCode,
          pCode:'',
          qty:1
        },
        visible:false,
        comRules:{
          pCode: [
            { required: true, message: '必填', trigger: 'change' }
          ]
        },
        subProducts:[]
      }
    },
    watch:{
      'comForm.pCode':function(val){
        this.visible = true;
      },
      'pSaleDate':function(val){
        this.model.pSaleDate = val;
        if(!val){
          this.model.productAttr.pOnSaleDate = '';
          this.model.productAttr.pOffSaleDate = '';
        }
        else{
          this.model.productAttr.pOnSaleDate = val[0];
          this.model.productAttr.pOffSaleDate = val[1];
        }
      },
      'pExpriceDate':function(val){
        this.model.pExpriceDate = val;
        if(!val){
          this.model.productAttr.pOnlinedate = '';
          this.model.productAttr.pOfflinedate = '';
        }
        else{
          this.model.productAttr.pOnlinedate = val[0];
          this.model.productAttr.pOfflinedate = val[1];
        }
      },
      $route:function(val){
        if(val.path.indexOf("/frame/product/productDetail") != -1){
          if(this.pCode == val.params.pCode){
            return;
          }
          this.pCode = val.params.pCode
          this.loadData();
        }
      },
      'priceExpriceDate':function(val){
        this.model.pExpriceDate = priceExpriceDate;
        if(!val){
          this.model.priceStartTime = '';
          this.model.priceEndTime = '';
        }
        else{
          this.model.priceStartTime = val[0];
          this.model.priceEndTime = val[1];
        }
      }
    },
    methods: {
      saveSub(ind,row){
        let thiz = this;
        this.loading = true;
        this.$tupHttp(this,'product/product/updateKitProduct','POST',row).then(res=>{
          thiz.$notify.success({
            title: '成功',
            message : '保存成功'
          });
          thiz.loading = false;
        },res=>{
          thiz.loading = false;
        })
      },
      deleteProduct(ind,row){
        let thiz = this;
        thiz.loading = true;
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          thiz.$tupHttp(thiz,'product/product/deleteKitProductByCode?pCode='+row.pCode+'&kitCode='+thiz.pCode,'GET').then(res=>{
            thiz.loading = false;
            thiz.subProducts.splice(ind,1);
          },res=>{
            thiz.loading = false;
          }) 
        }).catch(() => {    
          thiz.loading = false;  
        });
        
      },
      handleSelect(product,scope){     
        scope.row.pCode = product.pCode
        scope.row.pName = product.pName
        scope.row.pStatus = product.pStatus
      },
      commitSubData(){        
        let thiz = this;
        this.loading = true;
        this.$tupHttp(this,'product/product/addPCodeByKitProduct','POST',this.comForm).then(res=>{
          thiz.loadData();
          thiz.comForm = {
            kitCode:thiz.$route.params.pCode,
            pCode:'',
            qty:1
          },
          thiz.loading = false;
          thiz.visible = false;
        },res=>{
          thiz.loading = false;
          thiz.visible = false;
        })
      },
      commitSub(){        
        this.$refs.comForm.validate((valid) => {
          if (valid) {
            this.commitSubData();
          } else {
            return false;
          }
        });
      },
      commitData(){
        let thiz = this;
        this.loading = true;
        let data = this.$util.deepClone(this.model);
        if(this.pics.length>0){
          let pic = this.pics[0];
          if(!pic.id){
            data.productImgs=[{
              pPicLocation:pic.url,
              pSize:pic.size,
              pFilename:pic.name
            }]
          }
        }
        thiz.$tupHttp(thiz,'product/updateProductDetail','POST',data).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功',
            message : '保存成功'
          });
          thiz.loadData();
        },res=>{
          thiz.loading = false;
        })
      }, 
      commit(){
        this.$refs.modelForm.validate((valid) => {
          if (valid) {
            if(this.subProducts.length == 0 && this.model.productAttr.isKitProduct == 1){
              this.$notify.error({
                title: '出错提示',
                message : '子产品不能为空'
              });
              return ;
            }
            this.commitData();
          } else {
            return false;
          }
        });
      },
      loadData(){
        let thiz = this;
        thiz.$tupHttp(thiz,'product/getProductDetail/'+this.pCode,'GET').then(res=>{
          let model = res.body.model;
          thiz.model = model;
          thiz.subProducts = model.kitProducts ? model.kitProducts:[]
          let productImgs = res.body.model.productImgs;
          if(!!thiz.model.productAttr.pOnSaleDate){
            thiz.pSaleDate = [new Date(thiz.model.productAttr.pOnSaleDate),new Date(thiz.model.productAttr.pOffSaleDate)]
            thiz.model.pSaleDate = [new Date(thiz.model.productAttr.pOnSaleDate),new Date(thiz.model.productAttr.pOffSaleDate)]
          }
          if(!!thiz.model.productAttr.pOnlinedate){
            thiz.pExpriceDate = [new Date(thiz.model.productAttr.pOnlinedate),new Date(thiz.model.productAttr.pOfflinedate)]
            thiz.model.pExpriceDate = [new Date(thiz.model.productAttr.pOnlinedate),new Date(thiz.model.productAttr.pOfflinedate)]
          }
          if(!!thiz.model.priceStartTime){
            thiz.priceExpriceDate = [new Date(thiz.model.priceStartTime),new Date(thiz.model.priceEndTime)]
            thiz.model.priceExpriceDate = [new Date(thiz.model.priceStartTime),new Date(thiz.model.priceEndTime)]
          }         
          if(productImgs.length>0){
            let pic =productImgs[0];
            pic.name = productImgs[0].pFilename;
            pic.url = productImgs[0].pPicLocation;
            pic.size = productImgs[0].pSize;
            thiz.pics = [pic];
          }
          
        }) 
      },
      loadDictions(){
        let thiz = this;
        let params = ["brand_type","sales_platform","product_pyramid_type","product_gp_management_type","sales_type","order_unit"];
        this.$baseData.getDicts(this,params,function(data){
          thiz.Dictions = data;
        });
      }
    },
    mounted(){
      this.loadDictions()
      this.loadData();
    }
  }
</script>
<style scoped>
.itemsTitle{
  font-size: 16px;
  color: rgb(223, 8, 8);
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
}
.dialog-footer{
  margin-top: 10px;
  text-align: right;
}
.grid-content{
  border: 0px solid #eee;
  padding: 5px;
  border-radius: 5px;
}
.transition-box {
  margin-bottom: 10px;
  width: 80px;
  height: 80px;
  border-radius: 4px;
  background-color: #409EFF;
  text-align: center;
  color: #fff;
  padding: 30px 20px;
  box-sizing: border-box;
  margin-right: 20px;
}
</style>


