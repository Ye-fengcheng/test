<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>售后申报</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: path}">售后申请物流审核</el-breadcrumb-item>
      <el-breadcrumb-item>售后申请详情</el-breadcrumb-item>
    </el-breadcrumb>
    <br/>
    <el-row>
      <el-col :span="6">
        <B>申报号：{{model.sbno}}</B>        
      </el-col>
      <el-col :span="12">
        <B>申报类型：{{formatter({type:model.type},{property:'type'})}}</B>             
      </el-col>     
      <el-col :span="6" style="text-align:right">
        <el-button icon="el-icon-import" @click="dialogVisible = true"  type="success">审核</el-button>
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <B>专卖店编号：{{model.clientId}}</B>    
      </el-col> 
      <el-col :span="6">
        <B>专卖店名称：{{model.pOrganName2}}</B>             
      </el-col>
      <el-col :span="6">
        <B>客户名：{{model.clientName}}</B>        
      </el-col>
    </el-row>
    <br/>
    <el-row>
      <el-col :span="6">
        <B>分销商编号：{{model.pCitparentno}}</B>    
      </el-col> 
      <el-col :span="6">
        <B>分销商名称：{{model.pCitparent}}</B>             
      </el-col>
    </el-row>
    <br/>
    <el-row style="margin-bottom:15px;" v-if="model.isImport == 1">
      <el-col :span="8">
        <B>导入说明：</B>本单为客服导入数据        
      </el-col>
      <el-col :span="8">
        <B>订单头备注：</B>  {{model.orderHeadRemark}}           
      </el-col>
      <el-col :span="8">
        <B>明细备注：</B>{{model.detailRemark}}    
      </el-col>
    </el-row>
    <el-tabs v-model="activeName" type="card">      
      <el-tab-pane label="申报信息" name="zero">
        <div>
          <div class="itemsTitle">订单到货信息</div> 
          <el-form :model="model" ref="modelForm" label-width="180px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="原订单编号：">
                  {{model.orderNo}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="JDE订单号：">
                  {{model.jdeNo}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="捡货单号：">
                  {{model.pickSlipNo}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="所在装箱号：">
                  {{model.containerNo}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="到货日期：">
                  {{formatter({receivedDate:model.receivedDate},{property:'receivedDate'})}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="实收数量：">
                  {{model.realityNumber}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="重量（KG）：">
                  {{model.weight}}
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="itemsTitle">申报信息-客户填写内容</div> 
          <el-form :model="model" ref="modelForm" label-width="180px">            
            <el-row>
              <el-col :span="8">
                <el-form-item label="申报产品编号/零配件编号：">
                  {{model.declarationProductNo}}
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="申报产品名称/零配件名称：">
                  {{model.declarationProductName}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="申报数量：">
                  {{model.declarationQuantity}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="申报单位：">
                  {{model.declarationUnit}}
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="情况说明：">
                  {{model.description}}
                </el-form-item>
              </el-col>
            </el-row> 
          </el-form>
          <div class="itemsTitle">申报照片</div><br/>
          <el-form v-if="model.type == 1" :model="model" ref="modelForm" label-width="180px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="物流标签（正面）：" >
                  <div class="img" v-if="model.photos.length > 0">
                    <img :src="model.photos[0]" @click="showPic(model.photos[0])" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="重量喷码（背面）：">
                  <div class="img" v-if="model.photos.length > 1">
                    <img :src="model.photos[1]" @click="showPic(model.photos[1])" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>              
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="箱单内容（箱内）：">
                  <div class="img" v-if="model.photos.length > 2">
                    <img :src="model.photos[2]" @click="showPic(model.photos[2])" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="多发实物：">
                  <div class="img" v-if="model.photos.length > 3">
                    <img :src="model.photos[3]" @click="showPic(model.photos[3])" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>              
              <el-col :span="12">
                <el-form-item label="整箱称重：">
                  <div class="img" v-if="model.photos.length > 4">
                    <img :src="model.photos[4]" @click="showPic(model.photos[4])" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-form v-else-if="model.type == 2" :model="model" ref="modelForm" label-width="180px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="物流标签（正面）：" >
                  <div class="img" v-if="model.photos.length > 0">
                    <img :src="model.photos[0]" @click="showPic(model.photos[0])" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="重量喷码（背面）：">
                  <div class="img" v-if="model.photos.length > 1">
                    <img :src="model.photos[1]" @click="showPic(model.photos[1])" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>              
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="箱单内容（箱内）：">
                  <div class="img" v-if="model.photos.length > 2">
                    <img :src="model.photos[2]" @click="showPic(model.photos[2])" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="错发实物：">
                  <div class="img" v-if="model.photos.length > 3">
                    <img :src="model.photos[3]" @click="showPic(model.photos[3])" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>              
              <el-col :span="12">
                <el-form-item label="整箱称重：">
                  <div class="img" v-if="model.photos.length > 4">
                    <img :src="model.photos[4]" @click="showPic(model.photos[4])" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-form v-else-if="model.type == 3" :model="model" ref="modelForm" label-width="180px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="物流标签（正面）：" >
                  <div class="img" v-if="model.photos.length > 0">
                    <img :src="model.photos[0]" @click="showPic(model.photos[0])" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="重量喷码（背面）：">
                  <div class="img" v-if="model.photos.length > 1">
                    <img :src="model.photos[1]" @click="showPic(model.photos[1])" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>              
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="箱单内容（箱内）：">
                  <div class="img" v-if="model.photos.length > 2">
                    <img :src="model.photos[2]" @click="showPic(model.photos[2])" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="整箱完整图：">
                  <div class="img" v-if="model.photos.length > 3">
                    <img :src="model.photos[3]" @click="showPic(model.photos[3])" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>              
              <el-col :span="12">
                <el-form-item label="整箱称重：">
                  <div class="img" v-if="model.photos.length > 4">
                    <img :src="model.photos[4]" @click="showPic(model.photos[4])" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-form v-else-if="model.type == 4" :model="model" ref="modelForm" label-width="180px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="产品破损图片：" >
                  <div class="img" v-if="model.photos.length > 0">
                    <img :src="model.photos[0]" @click="showPic(model.photos[0])" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="外箱情况照片：">
                  <div class="img" v-if="model.photos.length > 1">
                    <img :src="model.photos[1]" @click="showPic(model.photos[1])" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>              
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="物流标签照片：">
                  <div class="img" v-if="model.photos.length > 2">
                    <img :src="model.photos[2]" @click="showPic(model.photos[2])" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="补充照片：">
                  <div class="img" v-if="model.photos.length > 3">
                    <img :src="model.photos[3]" @click="showPic(model.photos[3])" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="产品退回快递照片：">
                  <div class="img" v-if="model.photos.length > 4">
                    <img :src="model.photos[4]" @click="showPic(model.photos[4])" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-form v-else-if="model.type == 6" :model="model" ref="modelForm" label-width="180px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="产品缺陷图片：" >
                  <div class="img" v-if="model.photos.length > 0">
                    <img :src="model.photos[0]" @click="showPic(model.photos[0])" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="补充照片：">
                  <div class="img" v-if="model.photos.length > 1">
                    <img :src="model.photos[1]" @click="showPic(model.photos[1])" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>              
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="补充照片：">
                  <div class="img" v-if="model.photos.length > 2">
                    <img :src="model.photos[2]" @click="showPic(model.photos[2])" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="补充照片：">
                  <div class="img" v-if="model.photos.length > 3">
                    <img :src="model.photos[3]" @click="showPic(model.photos[3])" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="产品退回快递照片：">
                  <div class="img" v-if="model.photos.length > 4">
                    <img :src="model.photos[4]" @click="showPic(model.photos[4])" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="itemsTitle">修改申报信息-物流主管填写内容</div> 
          <el-form :model="model" ref="modelForm" label-width="180px">            
            <el-row>
              <el-col :span="8">
                <el-form-item label="申报产品编号/零配件编号：">
                  <el-input-product-code 
                    v-model="model.expressDeclarationProductNo"
                    :param="model"
                    @onSelect="handleSelect"
                    size="mini"></el-input-product-code>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="申报产品名称/零配件名称：">
                  {{model.expressDeclarationProductName}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="申报数量：">
                  <el-input-number 
                    v-model="model.expressDeclarationQuantity"
                    :min="0" 
                    size="mini"
                    label="描述文字"></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="申报单位：">
                  <el-input 
                    v-model="model.expressDeclarationUnit"
                    size="mini"
                    label="描述文字"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="情况说明：">
                  <el-input 
                    v-model="model.expressDeclarationReason"
                    size="mini"
                    label="描述文字"></el-input>
                </el-form-item>
              </el-col>
            </el-row> 
          </el-form>
          <div class="itemsTitle" v-if="model.type != 1">修改申报信息-制单客服填写内容</div> 
          <el-form :model="model" v-if="model.type != 1" ref="modelForm" label-width="180px">            
            <el-row>
              <el-col :span="8">
                <el-form-item label="申报产品编号/零配件编号：">
                  {{model.serviceDeclarationProductNo}}
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="申报产品名称/零配件名称：">
                  {{model.serviceDeclarationProductName}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="申报数量：">
                  {{model.serviceDeclarationQuantity}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="申报单位：">
                  {{model.serviceDeclarationUnit}}
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="情况说明：">
                  {{model.serviceDeclarationReason}}
                </el-form-item>
              </el-col>
            </el-row> 
          </el-form>
          <div class="itemsTitle" v-if="model.type != 1">更换/补发/等价交换产品信息</div> 
          <el-form :model="model" v-if="model.type != 1" ref="modelForm" label-width="180px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="等价交换：">
                  {{model.isEqualExchange == 1? '是':'否'}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="margin-left:101px">
              <el-col :span="24">
                <el-table
                  :data="model.exchangeProductVos"
                  style="width: 99%;"
                  border=""
                  height="200"
                  highlight-current-row>
                  <el-table-column
                    type="index"
                    label="序号"
                    width="50">
                  </el-table-column>
                  <el-table-column
                    prop="supplyProductNo"
                    label="产品/零配件编号"
                    width="150">
                  </el-table-column>
                  <el-table-column
                    prop="supplyProductName"
                    label="产品名称"
                    width="100">
                  </el-table-column>
                  <el-table-column
                    prop="supplyTime"
                    label="创建日期"
                    :formatter="formatter"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="supplyNumber"
                    label="订单数量"
                    width="100">
                  </el-table-column>
                  <el-table-column
                    prop="supplyUnit"
                    label="订货单位"
                    width="100">
                  </el-table-column>
                  <el-table-column
                    prop="supplyPrice"
                    label="优惠价格（元）">
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
            <el-row style="margin-top:15px;">
              <el-col :span="24">
                <el-form-item label="送货对象：">
                  {{model.sendTarget}}
                </el-form-item>
                <el-form-item label="送货地址：">
                  {{model.sendAddress}}
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="审核记录" name="four">
        <el-table
          :data="model.dvList"
          style="width: 99%;"
          height="350"
          highlight-current-row>
          <el-table-column
            type="index"
            label="序号"
            width="50">
          </el-table-column>
          <el-table-column
            prop="verificationType"
            label="审核角色"
            width="100">
            <template slot-scope="scope">
              {{scope.row.verificationType == 1 ? '物流审核' :(scope.row.verificationType == 2 ? '制单客服审核':'高级客服审核')}}
            </template>
          </el-table-column>
          <el-table-column
            prop="verificationClientName"
            label="审核人"
            width="100">
          </el-table-column>
          <el-table-column
            prop="verificationStatus"
            label="审核结果"
            width="100">
            <template slot-scope="scope">
              {{scope.row.verificationStatus == 0 ? '特殊处理' :(scope.row.verificationStatus == 1 ? '通过':'未通过')}}
            </template>
          </el-table-column>
          <el-table-column
            prop="verificationTime"
            label="审核时间"
            :formatter="formatter"
            width="150">
          </el-table-column>
          <el-table-column
            prop="reason"
            label="理由"
            :formatter="formatter"
            width="100">
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注">
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="售后产品物流信息" v-if="model.type != 3" name="five">
        <div>
          <el-form :model="model" ref="modelForm" label-width="180px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="快递单号：">
                  {{model.backExpressNo}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="快递公司：">
                  {{model.backExpressCompany}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="物流确认收货时间：">
                  {{formatter({backExpressCommitTime:model.backExpressCommitTime},{property:'backExpressCommitTime'})}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
              </el-col>
            </el-row>
            <el-row v-if="model.expressStatus == 0">
              <el-col :span="24" style="text-align:right">
                <el-button type="primary"  @click="confirm">确认收货</el-button>
              </el-col>
            </el-row>
          </el-form>
          
        </div>
      </el-tab-pane>
      <el-tab-pane label="订单信息" name="one">
        <div>
          <el-table
            :data="details"
            ref="orderTable"
            style="width: 100%;"
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
              label="区域"
              width="100">
              <template slot-scope="scope"> 
                {{model.regionCode}}
              </template>
            </el-table-column>
            <el-table-column
              prop="pCode"
              label="省办"
              width="100">
              <template slot-scope="scope"> 
                {{model.provinceCode}}
              </template>
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
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-row>
      <el-col :span="18">
        &nbsp;      
      </el-col>      
      <el-col :span="6" style="text-align:right">
        <el-button icon="el-icon-import" @click="dialogVisible = true"  type="success">审核</el-button>
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-col>
    </el-row>
    <el-dialog title="审核"  width="25%" top="15%" :visible.sync="dialogVisible">
      <el-form :model="comForm" ref="comForm" label-width="60px">
        <el-form-item label="通过" prop="status">
            <el-switch v-model="comForm.status" :active-value="3" :inactive-value="4"></el-switch>
          </el-form-item> 
        <el-form-item label="理由" v-if="comForm.status == 4" prop="reason">
          <el-select v-model="comForm.reason" size="mini" clearable filterable  placeholder="请选择">
            <el-option
              v-for="item in Dictions.declaration_reject_reason"
              :key="item.dictValue"
              :label="item.dictName"
              :value="item.dictValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="comForm.remark"  placeholder="备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" :loading="loading" @click="saveData">确认</el-button>
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        customer:{},
        details:[],
        path:this.$route.params.type == 'area' ? '/frame/order/customerServiceApproveAreaL' : '/frame/order/customerServiceApproveL',
        id:this.$route.params.id,
        type:this.$route.params.type,
        multipleSelection:[],
        customerModel:{},
        dialogVisible:false,
        model:{
        },
        Dictions:{
          declaration_type:[],
          declaration_status:[],
          declaration_reject_reason:[]
        },
        comForm:{
          status:3,
          remark:'',
          reason:''
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
        treeLoading:false
      }
    },
    watch:{
      customer:function(val){
        this.model.sendTarget = val.pUid
        this.model.sendAddress = val.pAddress1
      }
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSelect(product,scope){     
        scope.expressDeclarationProductName = product.pName
      },
      confirm(){
        let thiz = this;
        this.loading = true;
        let txt = '是否确认收货?';
        let data = [{
          id: this.model.id,
          expressStatus: 1
        }]
        this.$confirm(txt, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          thiz.$tupHttp(thiz,'declaration/updateDeclaration','POST',data).then(res=>{
            thiz.loading = false;
            thiz.$notify.success({
              title: '成功提示',
              message: '操作成功'
            });
            thiz.getInfo()
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
      showPic(picUrl){
        window.open(picUrl)
      },
      showAddDialog(){
        this.addDialogVisible = true;
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      },      
      editItem(index, row) {
        this.gotoUrl('/frame/order/areaConfig')
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='type'){
          this.Dictions.declaration_type.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })  
        }
        else if(column.property =='reason'){
          this.Dictions.declaration_reject_reason.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })  
        }
        else if(column.property =='status'){
          this.Dictions.declaration_status.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })  
        }
        else if(column.property =='createTime' || column.property =='logisticsAuditTime' 
        || column.property =='serviceAuditTime' || column.property =='seniorServiceAuditTime' 
        || column.property =='receivedDate' || column.property =='verificationTime'
        || column.property =='backDeliveryTime' || column.property =='verificationTime'
        || column.property =='backReachTime' || column.property == 'supplyTime' ||column.property == 'backExpressCommitTime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss");
        }
        return txt;
      },
      saveData(){
        let thiz = this;
        if(this.comForm.reason == 7 && !this.comForm.remark){
          thiz.$notify.error({
            title: '错误提示',
            message: '备注需要填写'
          });
          return;
        }
        thiz.loading = true;
        let data = [];
        data.push({
          id:this.model.id,
          reason:this.comForm.reason,
          remark:this.comForm.remark,
          status:this.comForm.status,
          expressDeclarationProductNo:this.model.expressDeclarationProductNo,
          expressDeclarationProductName:this.model.expressDeclarationProductName,
          expressDeclarationQuantity:this.model.expressDeclarationQuantity,
          expressDeclarationUnit:this.model.expressDeclarationUnit,
          expressDeclarationReason:this.model.expressDeclarationReason,
        })
        thiz.$tupHttp(thiz,'declaration/updateDeclaration','POST',data).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '操作成功'
          });
          thiz.dialogVisible = false;
          thiz.gotoUrl(thiz.path);
        },res=>{
          thiz.loading = false;
        })
      },
      getOrderDetail(orderNo){
        let thiz = this;
        thiz.$tupHttp(thiz,'order/queryOrderDetails?orderNo='+orderNo,'GET').then(res=>{
          let model = res.body.model;  
          thiz.details = model.details; 
        }) 
      },
      getInfo(){
        let thiz = this;
        thiz.$tupHttp(thiz,'declaration/getDeclaration?id='+this.id,'GET').then(res=>{
          let model = res.body.model;  
          if(!model.photos){
            model.photos = [];
          }
          if(!model.expressDeclarationProductNo){
            model.expressDeclarationProductNo = model.declarationProductNo
          }
          if(!model.expressDeclarationProductName){
            model.expressDeclarationProductName = model.declarationProductName
          }
          if(!model.expressDeclarationQuantity){
            model.expressDeclarationQuantity = model.declarationQuantity
          }
          if(!model.expressDeclarationUnit){
            model.expressDeclarationUnit = model.declarationUnit
          }
          if(!model.expressDeclarationReason){
            model.expressDeclarationReason = model.description
          }
          thiz.model = model;           
          thiz.customer = { pUid : model.sendTarget, pAddress1 : model.sendAddress }
          if(model.orderNo){
            thiz.getOrderDetail(model.orderNo)
          }
        }) 
      },
      loadDictions(){
        let thiz = this;
        let params = ["declaration_type","declaration_status","declaration_reject_reason"];
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
  font-size: 16px;
  border-bottom: 1px solid #ccc;
}
.dialog-footer{
  margin-top: 30px;
  text-align: center;
}
.img{
  border: #ccc 1px solid;
  padding: 5px;
  width: 210px;
  border-radius: 5px;
}
</style>