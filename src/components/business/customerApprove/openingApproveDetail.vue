<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>专卖店申请</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/frame/customerApprove/customerOpeningApprove'}">开店申请</el-breadcrumb-item>
      <el-breadcrumb-item>开店申请详情</el-breadcrumb-item>
    </el-breadcrumb>
    <br/>
    <div v-if="active==4 && activeName =='zero'" style="float:right;z-index:100000;position: absolute;margin-left: 70%;"><el-button @click="printOpeningApprove" type="text">网页打印(客服)</el-button></div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="新开店信息" name="zero">
        <div>
          <el-form :model="model" ref="modelForm" label-width="180px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="专卖店区域：">
                  {{model.regionName}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="专卖店省办：">
                  {{model.provinceName}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="所属城市：">
                  {{model.city}}
                </el-form-item>
              </el-col>              
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="是否为重点（拓展）城市：">
                  {{model.isKeycity == 0 ? '是':'否'}}
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="专卖店地址：">
                  {{model.outletAddress ? model.outletAddress.replace('//','') : ''}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="是否为B计划试点城市：">
                  {{model.isPlancity == 0 ? '是':'否'}}
                </el-form-item>
              </el-col>
              <!-- <el-col :span="8">
                <el-form-item label="店主性别：">
                  {{formatter({'fwi.ownerSex':model.fwi.ownerSex},{property:'fwi.ownerSex'})}}
                </el-form-item>
              </el-col> -->
              <el-col :span="8">
                <el-form-item label="专卖店名称：">
                  {{model.outletName}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="专卖店联系电话：">
                  {{model.outletPhone}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="客户名称：">
                  {{model.clientName}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="面积（长*宽）：">
                  {{model.areaLength}}*{{model.areaWidth}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="与样板店距离（公里）："> 
                  {{model.distanceToSampleshop}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="周边覆盖户数/社区（户）：">
                  {{model.peripheralCoverage}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否有上下水：">
                  {{model.isHavewater==0 ? '是':'否'}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否可以示范：">
                  {{model.isDemonstration==0 ? '是':'否'}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="月租金（元）：">
                  {{model.monthRent}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="店铺类型：">
                  {{formatter({'storeType':model.storeType},{property:'storeType'})}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="店铺性质：">
                  {{formatter({'storeProperty':model.storeProperty},{property:'storeProperty'})}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="拓展人姓名：">
                  {{model.expander}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="维护人（FS）：">
                  {{model.maintainerName}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="找铺人：">
                  {{formatter({'shoppers':model.shoppers},{property:'shoppers'})}}
                </el-form-item>
              </el-col>
            </el-row>            
            <el-row>
              <el-col :span="8">
                <el-form-item label="业务联系人：">
                  {{model.businessContact}}
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="收货仓库/地点：">
                  {{model.receiptAddress ? model.receiptAddress.replace('//',''):''}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="收货联系电话：">
                  {{model.receiptPhone}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="预计开业时间：">
                  {{formatter({'openDate':model.openDate},{property:'openDate'})}}
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="新店主信息" name="first">
        <div>
          <el-form :model="model" ref="modelForm" label-width="180px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="店主姓名：">
                  {{model.storekeeperName}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="店主性别：">
                  {{formatter({'storekeeperSex':model.storekeeperSex},{property:'storekeeperSex'})}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="店主身份证号：">
                  {{model.storekeeperIdcard}}
                </el-form-item>
              </el-col>              
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="店主年龄：">
                  {{model.stroekeeperAge}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否全职：">
                  {{model.isFulltime == 0 ? '是':'否'}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否有经商经验：">
                  {{model.isBussiness == 0 ? '是':'否'}}
                </el-form-item>
              </el-col>              
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="店主身份：">
                  {{model.isMember  == 0 ? '会员':'非会员'}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="信息来源：">
                  {{formatter({'information':model.information},{property:'information'})}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="BOP讲解：">
                  {{formatter({'bop':model.bop},{property:'bop'})}}
                </el-form-item>
              </el-col>
            </el-row>
            <!-- <div class="itemsTitle">合同信息</div><br/>
            <el-row>
              <el-col :span="8">
                <el-form-item label="专卖店合同编号：">
                  {{model.contractNumber}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="合同乙方客户名称：">
                  {{model.contractClientName}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="法人身份证号："> 
                  {{model.legalpersonIdcard}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="合同专卖店地址：">
                  {{model.contractOrganAddress}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="合同有效期：">
                  {{formatter({'contractValidityStart':model.contractValidityStart},{property:'contractValidityStart'})}}
                  -
                  {{formatter({'contractValidityEnd':model.contractValidityEnd},{property:'contractValidityEnd'})}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>            
            <el-col :span="12">
              <el-form-item label="合同封面照片：">
                <div class="img" v-if="model.contractCoverUrl">
                  <img :src="model.contractCoverUrl" @click="showPic(model.contractCoverUrl)" style="width:200px;">
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同首页照片：">
                <div class="img" v-if="model.contractFirstpageUrl">
                  <img :src="model.contractFirstpageUrl" @click="showPic(model.contractFirstpageUrl)" style="width:200px;">
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同签名页照片：">
                <div class="img" v-if="model.contractSignaturepageUrl">
                  <img :src="model.contractSignaturepageUrl" @click="showPic(model.contractSignaturepageUrl)" style="width:200px;">
                </div>
              </el-form-item>
            </el-col>
          </el-row> -->
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="分销商信息" name="second">
        <div>
          <el-form :model="model" ref="modelForm" label-width="180px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="新店上级类型：">
                  {{formatter({'parentStatus':model.parentStatus},{property:'parentStatus'})}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="所属分销商编号：">
                  {{model.dbNo}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="所属分销商名称：">
                  {{model.dbName}}
                </el-form-item>
              </el-col>              
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="样板店城市：">
                  {{model.sampleShopCity}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="分销商架构：">
                  {{model.pSpecialityStoresNum}}
                </el-form-item>
              </el-col>            
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="PSM姓名：">
                  {{model.psmName}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="PSM电话：">
                  {{model.psmPhone}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="一分姓名：">
                  {{model.oneDbName}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="一分样板店城市：">
                  {{model.oneSampleShopCity}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="一分架构："> 
                  {{model.onePSpecialityStoresNum}}
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-tab-pane>
       <el-tab-pane label="发票/图片" name="third">
        <div>
          <el-form :model="model" ref="modelForm" label-width="180px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="是否一般纳税人：">
                  {{model.isTaxpayer == 0 ? '是':(model.isTaxpayer == 1 ? '否（不邮寄发票）':'否（邮寄发票）')}}
                </el-form-item>
              </el-col>              
            </el-row>
            <div class="itemsTitle">票面信息</div><br/>
            <el-row>
              <el-col :span="12">
                <el-form-item label="公司名称：">
                  {{model.companyName}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="公司地址：">
                  {{model.companyAddress}}
                </el-form-item>
              </el-col>            
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="联系电话：">
                  {{model.companyPhone}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="公司税号：">
                  {{model.companyTax}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="开户行：">
                  {{model.openningBank}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="开户账号：">
                  {{model.openningBankNumber}}
                </el-form-item>
              </el-col>
            </el-row>
            <div class="itemsTitle">发票邮寄信息</div><br/>
            <el-row>
              <el-col :span="12">
                <el-form-item label="发票邮寄地址：">
                  {{model.mailAddress ? model.mailAddress.replace('//','') :''}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="收件人姓名：">
                  {{model.consigneeName}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="收件人联系电话：">
                  {{model.consigneePhone}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="营业执照复印件：">
                  <div class="img" v-if="model.businessLicenseUrl">
                    <img :src="model.businessLicenseUrl" @click="showPic(model.businessLicenseUrl)" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="一般纳税人资格证明：">
                  <div class="img" v-if="model.taxpayerQualificationUrl">
                    <img :src="model.taxpayerQualificationUrl" @click="showPic(model.taxpayerQualificationUrl)" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="itemsTitle">专卖店照片</div><br/>
            <el-row>
              <el-col :span="12">
                <el-form-item label="专卖店正面照片：">
                  <div class="img" v-if="model.outletFrontUrl">
                    <img :src="model.outletFrontUrl" @click="showPic(model.outletFrontUrl)" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="专卖店内部照片：">
                  <div class="img" v-if="model.outletInsideUrl">
                    <img :src="model.outletInsideUrl" @click="showPic(model.outletInsideUrl)" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="专卖店左侧照片:">
                  <div class="img" v-if="model.outletLeftUrl">
                    <img :src="model.outletLeftUrl" @click="showPic(model.outletLeftUrl)" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="专卖店右侧照片：">
                  <div class="img" v-if="model.outletRightUrl">
                    <img :src="model.outletRightUrl" @click="showPic(model.outletRightUrl)" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="专卖店所处平面图：">
                  <div class="img" v-if="model.outletFlatUrl">
                    <img :src="model.outletFlatUrl" @click="showPic(model.outletFlatUrl)" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="12">
                <el-form-item label="专卖店平面布局及人流走向图:">
                  <div class="img" v-if="model.outletFlatFlowUrl">
                    <img :src="model.outletFlatFlowUrl" @click="showPic(model.outletFlatFlowUrl)" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="专卖店效果图：">
                  <div class="img" v-if="model.outletEffectUrl">
                    <img :src="model.outletEffectUrl" @click="showPic(model.outletEffectUrl)" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col> -->
              <el-col :span="12">
                <el-form-item label="托管协议照片：">
                  <div class="img" v-if="model.pactUrl">
                    <img :src="model.pactUrl" @click="showPic(model.pactUrl)" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="店主身份证(正面):">
                  <div class="img" v-if="model.idcardUrl">
                    <img :src="model.idcardUrl" @click="showPic(model.idcardUrl)" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="店主身份证(反面):">
                  <div class="img" v-if="model.idcardUrl1">
                    <img :src="model.idcardUrl1" @click="showPic(model.idcardUrl1)" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div style="width:95%;margin:30px 0px 30px 50px;">
      <el-steps :space="200" :active="active" :process-status="pass ? 'process' : 'error'" finish-status="success">
        <el-step title="创建成功"></el-step>
        <el-step title="省办"></el-step>
        <el-step title="区域"></el-step>
        <el-step title="渠道部"></el-step>
        <el-step title="客服"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <div>
        <el-form :model="stepModel" ref="modelForm" label-width="180px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="创建人：">
                {{stepModel.applyUserName+'('+stepModel.applyUser+')'}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建时间：">
                {{formatter({createTime:stepModel.createTime},{property:'createTime'})}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-for="(item,index) in stepModel.steps" :key="index">
            <el-col :span="8">
              <el-form-item :label="getStepName(index)+'审批人：'">
                {{item.auditorName}}({{item.auditorId}})
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="getStepName(index)+'审批时间：'">
                {{formatter({'item.createTime':item.createTime},{property:'item.createTime'})}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="getStepName(index)+'审批备注：'">
                {{item.comment}}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div style="width:100%; text-align:center">
      <el-button @click="$router.go(-1)">返回</el-button>
      <el-button icon="el-icon-close"  @click="noPassdialogVisible = true" type="danger">驳回</el-button>
      <el-button icon="el-icon-check" @click="passdialogVisible = true" type="success">审核通过</el-button>
    </div>
    <el-dialog title="驳回"  width="40%" top="5%" :visible.sync="noPassdialogVisible">
      <el-form :rules="noPassFormRules" :model="noPassForm" ref="noPassForm" label-width="60px">
        <el-form-item label="备注" prop="remark">
          <el-input v-model="noPassForm.remark"  placeholder="备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" :loading="loading" @click="noPass">确认</el-button>
        <el-button size="mini" @click="noPassdialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="审核通过"  width="40%" top="5%" :visible.sync="passdialogVisible">
      <el-form :rules="passFormRules" :model="passForm" ref="passForm" label-width="140px">
        <el-form-item v-if="stepModel.auditStatus==0" label="下级审批人" prop="userIds">
          <el-select v-model="passForm.userIds" size="mini" filterable  placeholder="请选择">
            <el-option
              v-for="item in persons"
              :key="item.pUid"
              :label="item.pName+'('+item.pUid+')'"
              :value="item.pUid">
            </el-option>
          </el-select>
        </el-form-item>   
        <el-form-item v-if="stepModel.auditStatus==4" label="请填写创建的店编" prop="remark">
          <el-input v-model="passForm.remark"  placeholder="请填写创建的店编"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" :loading="loading" @click="passFun">确认</el-button>
        <el-button size="mini" @click="passdialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        noPassdialogVisible:false,
        passdialogVisible:false,
        active:0,
        pass:true,
        fwiForm:{},
        stepModel:{},
        passForm:{
          pass:true,
          remark:' ',
          userIds:''
        },
        noPassForm:{
          pass:false,
          remark:''
        },
        noPassFormRules:{
          remark: [
            { required: true, message: '必填', trigger: 'change' }
          ],
        },
        passFormRules:{
          remark: [
            { required: true, message: '必填', trigger: 'change' }
          ]
        },
        id:this.$route.params.id,
        applyId:this.$route.params.applyId,
        multipleSelection:[],
        customerModel:{},
        model:{
          client:{},
          fwi:{}
        },
        Dictions:{
          outlet_property2:[],
          order_status:[],
          order_type:[],
          pay_status:[],
          return_reason:[],
          outlet_show:[],
          outlet_property:[],
          outlet_address_source:[],
          msg_source:[],
          bop_explain:[]
        },
        loading:false,
        activeName:'zero',
        treeLoading:false,
        persons:[]
      }
    },
    watch:{
    },
    methods: {
      getStepName(ind){
        let txt = ''
        switch(ind){
          case 0:
            txt = '省办'
          break
          case 1:
            txt = '区域'
          break
          case 2:
            txt = '渠道部'
          break
          case 3:
            txt = '客服'
          break
        }
        return txt;
      },
      showPic(picUrl){
        window.open(picUrl)
      },
      updateFwi(row){
        this.pass = row.auditStatus > -1;
        if(this.pass){
          this.active = row.auditStatus + 1 == 6 ? 6 : row.auditStatus;
        }
        else{
          this.active = Math.abs(row.auditStatus) - 1;
        }
      },
      commitData(pass){
        let thiz = this;
        this.loading = true;
        debugger
        let remark = pass ? this.passForm.remark : this.noPassForm.remark;
        let userIds = pass ? this.passForm.userIds : '';
        thiz.$tupHttp(thiz,'manage/openningStoreApplyToPC/audit?applyId='+this.applyId+'&userIds='+userIds+'&pass='+pass+'&remark='+window.encodeURIComponent(remark),'GET').then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功',
            message : '操作成功'
          });
          thiz.gotoUrl('/frame/customerApprove/customerOpeningApprove')
        },res=>{
          thiz.loading = false;
        })
      },
      passFun(){
        this.$refs.passForm.validate((valid) => {
          if (valid) {
            this.commitData(true);
          } else {
            return false;
          }
        });
      },
      noPass(){
        this.$refs.noPassForm.validate((valid) => {
          if (valid) {
            this.commitData(false);
          } else {
            return false;
          }
        });
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
      printOpeningApprove(){
        window.open('/#/printOpeningApprove/'+this.id+'/'+this.applyId)
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
        if(column.property =='pCitoutletproperty'){
          this.Dictions.outlet_property.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }  
        else if(column.property =='pOutletStatus'){
          this.Dictions.outlet_status.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }            
        else if(column.property =='pGradeType'){
          this.Dictions.grade_type.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }          
        else if(column.property =='pCitoutletproperty2'){
          this.Dictions.outlet_property2.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='fwi.visualizeGrade'){
          this.Dictions.visualize_grade.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='fwi.graduationReason'){
          this.Dictions.graduation_reason.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='parentStatus'){
          this.Dictions.superior_type.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })        
        }
        else if(column.property =='information'){
          this.Dictions.msg_source.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='bop'){
          this.Dictions.bop_explain.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='storeProperty'){
          this.Dictions.outlet_property.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='shoppers'){
          this.Dictions.address_source.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        
        else if(column.property =='storekeeperSex'){
          this.Dictions.gender.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='storeType'){
          this.Dictions.outlet_show2.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property == 'createTime' || column.property =='openDate' || column.property =='item.createTime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss");
        }
        else if(column.property =='contractValidityStart' || column.property =='contractValidityEnd' || column.property =='client.pGraduationDate' || 
        column.property == 'contract.pDbProtocolDateE' || column.property == 'contract.pDbProtocolDateS' || column.property == 'contract.updatetime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd");
        }
        return txt;
      },
      saveFwi(){
        let thiz = this;
        this.loading = true;
        thiz.$tupHttp(thiz,'user/updateClientFwi','POST',this.fwiForm).then(res=>{
          thiz.$notify.success({
            title: '成功',
            message : '保存成功'
          });
          thiz.loading = false;
        },res=>{
          thiz.loading = false;
        }) 
      },
      getTaskInfo(){
        let thiz = this;
        thiz.$tupHttp(thiz,'manage/openningStoreApplyToPC/taskInfo?applyId='+this.applyId,'GET').then(res=>{
          let model = res.body.model;  
          thiz.stepModel = model
          if(model){
            thiz.updateFwi(model)
          }
        }) 
      },
      getInfo(){
        let thiz = this;
        thiz.$tupHttp(thiz,'manage/openningStoreApplyToPC/getStoreInfoById?id='+this.id,'GET').then(res=>{
          let model = res.body.model;  
          thiz.model = model; 
        }) 
      },
      getPerson(){
        let thiz = this;
        thiz.$tupHttp(thiz,'manage/openningStoreApplyToPC/getReviewer?applyId='+this.applyId+'&regionNo='+this.$storage.getValue('regionNo')+'&provinceNo='+this.$storage.getValue('provinceNo'),'GET').then(res=>{
          let model = res.body.models;  
          thiz.persons = model; 
        })
      },
      loadDictions(){
        let thiz = this;
        let params = ["superior_type","outlet_property","outlet_address_source","outlet_show","bop_explain","msg_source","outlet_status","grade_type","outlet_property2","visualize_grade","graduation_reason","msg_source","outlet_show","location","address_source","gender","bop_explain","oos_code","outlet_show2"];
        this.$baseData.getDicts(this,params,function(data){
          thiz.Dictions = data;
        });
      }
    },
    mounted(){
      this.getInfo();   
      this.getPerson(); 
      this.getTaskInfo();
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
.img{
  border: #ccc 1px solid;
  padding: 5px;
  width: 210px;
  border-radius: 5px;
}
</style>