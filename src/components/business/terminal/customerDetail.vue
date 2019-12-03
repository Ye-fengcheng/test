<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>客户管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/frame/terminal/customer'}">专卖店信息</el-breadcrumb-item>
      <el-breadcrumb-item>专卖店详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row>
      <el-col :span="18">   
        &nbsp;     
      </el-col>
      <el-col :span="6" style="text-align:right"><el-button @click="$router.go(-1)">返回</el-button></el-col>
    </el-row>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="基本信息" name="zero">
        <div>
          <el-form :model="model" ref="modelForm" label-width="180px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="OOS编号：">
                  {{model.pCnid}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="专卖店编号：">
                  {{model.pUid}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="专卖店名称：">
                  {{model.pOrganName2}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="客户名：">
                  {{model.pName}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="区域：">
                  {{model.pCitregionoffice}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="省办：">
                  {{model.pCitprovincialoffice}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="片区：">
                  {{model.pDistrictoffice}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="城市：">
                  {{model.pCityno}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="城市级别："> 
                  {{model.pCitylevel}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="专卖店地址：">
                  {{model.pAddress2}}
                </el-form-item>
              </el-col>
            </el-row>
            <div class="itemsTitle"></div>
            <el-row>
              <el-col :span="12">
                <el-form-item label="DM工号：">
                  {{model.pDm}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="DM姓名：">
                  {{model.pDmName}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="DFS工号：">
                  {{model.pFs}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="DFS姓名：">
                  {{model.pFsName}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="分销商编号：">
                  {{model.pCitparentno}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="分销商名称：">
                  {{model.pCitparent}}
                </el-form-item>
              </el-col>
            </el-row>
            
            <div class="itemsTitle"></div>
            <el-row>
              <el-col :span="12">
                <el-form-item label="门店折扣率：">
                  {{model.pDiscountvalue}}%
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="专卖店状态：">
                  {{formatter({pOutletStatus:model.pOutletStatus},{property:'pOutletStatus'})}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="专卖店级别：">
                  {{model.pGradeNo1}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="专卖店性质：">
                  {{formatter({pCitoutletproperty:model.pCitoutletproperty},{property:'pCitoutletproperty'})}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>              
              <el-col :span="12">
                <el-form-item label="专卖店类型：">
                  {{formatter({pCitoutletproperty2:model.pCitoutletproperty2},{property:'pCitoutletproperty2'})}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否代表店：">
                  {{model.pCitoutletproperty2 == 8796121170011 ? '是':'否'}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>              
              <el-col :span="12">
                <el-form-item label="是否代管店：">
                  {{model.pCitoutletproperty2 == 8796121202779 ? '是':'否'}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否种子店：">
                  {{model.pIsseed==1 ? '是':'否'}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>              
              <el-col :span="12">
                <el-form-item label="是否转让店：">
                  {{model.outletTransferRecord ? '是':'否'}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="旧店编号：">
                  {{model.outletTransferRecord ? model.outletTransferRecord.oldOutlet :''}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>              
              <el-col :span="12">
                <el-form-item label="财务等级：">
                  {{formatter({pOosCode:model.pOosCode},{property:'pOosCode'})}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="首订日期：">
                  {{formatter({pFirstorderDate:model.pFirstorderDate},{property:'pFirstorderDate'})}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>              
              <el-col :span="12">
                <el-form-item label="开业日期：">
                  {{formatter({pOpenningDate:model.pOpenningDate},{property:'pOpenningDate'})}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="结业日期：">
                  {{formatter({pGraduationDate:model.pGraduationDate},{property:'pGraduationDate'})}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>              
              <el-col :span="12">
                <el-form-item label="渠道类型：">
                  {{model.pCitchanneltype}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="理家顾问数量：">
                  {{fwiForm.homeConsultantNum}}
                </el-form-item>
              </el-col>
            </el-row>
            
            <div class="itemsTitle"></div>
            <el-row>
              <el-col :span="12">
                <el-form-item label="联系人：">
                  {{model.pAddress4}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系电话：">
                  {{model.pBmMobile}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="系统激活E-mail：">
                  {{model.pEmail}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="系统激活手机号：">
                  {{model.pMobile}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="送货电话：">
                  {{model.pSpMobile}}
                </el-form-item> 
              </el-col>              
              <el-col :span="12">
                <el-form-item label="送货地址：">
                  {{model.pAddress1}}
                </el-form-item> 
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="FWI" name="first">
        <el-form  :model="fwiForm" label-width="150px" >
          <el-row :gutter="5">
            <el-col :span="12">
              <el-form-item label="店主性别">
                <el-select style="width:100%" v-model="fwiForm.ownerSex" clearable filterable  placeholder="请选择">
                  <el-option
                    v-for="item in Dictions.gender"
                    :key="item.dictValue"
                    :label="item.dictName"
                    :value="item.dictValue">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="店主年龄">
                <el-input v-model="fwiForm.shopkeeperage" placeholder=""></el-input>
              </el-form-item>
            </el-col>            
          </el-row>
          <el-row :gutter="5">
            <el-col :span="12">
              <el-form-item label="业务员">
                <el-input-number v-model="fwiForm.saleMan " :min="0" label="描述文字"></el-input-number>
              </el-form-item>
            </el-col> 
            <el-col :span="12">
              <el-form-item label="人员配置">
                <el-input v-model="fwiForm.salesCount" placeholder=""></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="12">
              <el-form-item label="开店员工">
                <el-input-number v-model="fwiForm.setupEmp " :min="0" label="描述文字"></el-input-number>
              </el-form-item>
            </el-col> 
            <el-col :span="12">
              <el-form-item label="员工身份">
                <el-select style="width:100%" v-model="fwiForm.empDegree" clearable filterable placeholder="请选择">
                  <el-option label="DFS" value="DFS"></el-option>
                  <el-option label="DM" value="DM"></el-option>
                  <el-option label="PCD" value="PCD"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="12">
              <el-form-item label="是否有驻店员工">
                <el-switch
                  :active-value="true"
                  :inactive-value="false"
                  v-model="fwiForm.hasStationEmp">
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="BOP讲解">
                <el-select style="width:100%" v-model="fwiForm.bopExplain" clearable filterable  placeholder="请选择">
                  <el-option
                    v-for="item in Dictions.bop_explain"
                    :key="item.dictValue"
                    :label="item.dictName"
                    :value="item.dictValue">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>            
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="面积(平方米)">
                <el-input-number v-model="fwiForm.outletArea " :min="0" label="描述文字"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="租金">
                <el-input-number v-model="fwiForm.rentCost " :min="0" label="描述文字"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="12">
              <el-form-item label="店员月工资">
                <el-input-number v-model="fwiForm.clerkmonthlysalary " :min="0" label="描述文字"></el-input-number>
              </el-form-item>
            </el-col> 
            <el-col :span="12">
              <el-form-item label="平均月销售">
                <el-input-number v-model="fwiForm.monthSalesAvg" :min="0" label="描述文字"></el-input-number>
              </el-form-item>
            </el-col>   
          </el-row>
          <el-row :gutter="5">  
            <el-col :span="12">
              <el-form-item label="月盈亏平衡">
                <el-input-number v-model="fwiForm.profitAndLoss" :min="0" label="描述文字"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="itemsTitle"></div><br/>
          <el-row :gutter="5">            
            <el-col :span="12">
              <el-form-item label="地址来源">
                <el-select style="width:100%" v-model="fwiForm.addressSource" clearable filterable  placeholder="请选择">
                  <el-option
                    v-for="item in Dictions.address_source"
                    :key="item.dictValue"
                    :label="item.dictName"
                    :value="item.dictValue">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col> 
            <el-col :span="12">
              <el-form-item label="信息来源">
                <el-select style="width:100%" v-model="fwiForm.msgSource" clearable filterable  placeholder="请选择">
                  <el-option
                    v-for="item in Dictions.msg_source"
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
              <el-form-item label="门店位置">
                <el-select style="width:100%" disabled v-model="fwiForm.location" clearable filterable  placeholder="请选择">
                  <el-option
                    v-for="item in Dictions.location"
                    :key="item.dictValue"
                    :label="item.dictName"
                    :value="item.dictValue">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col> 
            <el-col :span="12">
              <el-form-item label="门店外观">
                <el-select style="width:100%" disabled v-model="fwiForm.outletShow" clearable filterable  placeholder="请选择">
                  <el-option
                    v-for="item in Dictions.outlet_show"
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
              <el-form-item label="店面形象">
                <el-select style="width:100%" v-model="fwiForm.visualizeGrade" clearable filterable  placeholder="请选择">
                  <el-option
                    v-for="item in Dictions.visualize_grade"
                    :key="item.dictValue"
                    :label="item.dictName"
                    :disabled="['G3','G4'].indexOf(item.dictName) == -1"
                    :value="item.dictValue">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>   
            <el-col :span="12">
              <el-form-item label="关店原因">
                <el-select style="width:100%" v-model="fwiForm.graduationReason" clearable filterable  placeholder="请选择">
                  <el-option
                    v-for="item in Dictions.graduation_reason"
                    :key="item.dictValue"
                    :label="item.dictName"
                    :value="item.dictValue">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>   
            <el-col :span="12" v-show="false">
              <el-form-item label="客户编号">
                <el-input v-model="fwiForm.clientId" :disabled="true"  placeholder=""></el-input>
              </el-form-item>
            </el-col>        
          </el-row>
          <div class="itemsTitle"></div><br/>
          <el-row :gutter="5">  
            <el-col :span="12">
              <el-form-item label="店铺正面图片">
                <tup-picture-select :limit="1" v-model="pic1"></tup-picture-select>
              </el-form-item>
            </el-col>          
            <el-col :span="12">
              <el-form-item label="店铺内部图片">
                <tup-picture-select :limit="1" v-model="pic2"></tup-picture-select>
              </el-form-item>
            </el-col>
          </el-row>   
          <el-row :gutter="5">   
            <el-col :span="12">
              <el-form-item label="店铺左侧图片">
                <tup-picture-select :limit="1" v-model="pic3"></tup-picture-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="店铺右侧图片">
                <tup-picture-select :limit="1" v-model="pic4"></tup-picture-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="5">   
            <el-col :span="24" style="text-align:right">
              <el-button type="primary" :loading="loading" @click="saveFwi">保存FWI</el-button>      
            </el-col>
          </el-row>
        </el-form> 
      </el-tab-pane>
      <el-tab-pane label="合同信息" name="second">
        <div>
          <el-form :model="model" ref="modelForm" label-width="180px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="合同审核状态：">
                  {{contractForm.status == 1 ? "审核通过":"审核中"}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="专卖店编号：">
                  {{model.pUid}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="专卖店名称：">
                  {{model.pOrganName2}}
                </el-form-item>
              </el-col>              
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="客户名：">
                  {{model.pName}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="专卖店状态：">
                  {{formatter({pOutletStatus:model.pOutletStatus},{property:'pOutletStatus'})}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="分销商编号：">
                  {{model.pCitparentno}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="分销商名称：">
                  {{model.pCitparent}}
                </el-form-item>
              </el-col>              
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="区域：">
                  {{model.pCitregionoffice}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="省办：">
                  {{model.pCitprovincialoffice}}
                </el-form-item>
              </el-col>
            </el-row>
            <div class="itemsTitle"></div>
            <br/>
            <el-form :model="contractForm" label-width="150px" >
              <el-row>
                <el-col :span="12">
                  <el-form-item label="合同编号">
                    <el-input v-model="contractForm.pDbProtocolNo"  placeholder=""></el-input>
                  </el-form-item>
                </el-col> 
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="合同乙方客户名称">
                    <el-input v-model="contractForm.pOrganName"  placeholder=""></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="身份证号码">
                    <el-input v-model="contractForm.pCardNo1"  placeholder=""></el-input>
                  </el-form-item>
                </el-col>         
              </el-row>
              <el-row>                
                <el-col :span="12">
                  <el-form-item label="合同专卖店地址">
                    <el-input v-model="contractForm.pDbProtocolAddr"  placeholder=""></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="合同有效期开始日期">
                    <el-date-picker
                      style="width:100%"
                      v-model="contractForm.pDbProtocolDateS"
                      placeholder="选择日期时间">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="合同有效期结束日期">
                    <el-date-picker
                      style="width:100%"
                      v-model="contractForm.pDbProtocolDateE"
                      placeholder="选择日期时间">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                <el-form-item label="专卖店授权书编号：">
                  {{model.contract ? model.contract.pAuthorizeNo:''}}
                </el-form-item>
              </el-col>
                <el-col :span="12">
                  <el-form-item label="档案编号">
                    <el-input v-model="contractForm.pArchivesNo"  placeholder=""></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="备注">
                    <el-input v-model="contractForm.remark"  placeholder=""></el-input>
                  </el-form-item>
                </el-col>          
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="更新日期：">
                    {{model.contract ? formatter({'contract.updatetime':model.contract.updatetime},{property:'contract.updatetime'}) : ''}}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="更新人：">
                    {{model.contract ? model.contract.updateby:''}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="5">  
                <el-col :span="12">
                  <el-form-item label="合同封面图片">
                    <tup-picture-select :limit="1" v-model="pic5"></tup-picture-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="合同首页图片">
                    <tup-picture-select :limit="1" v-model="pic6"></tup-picture-select>
                  </el-form-item>
                </el-col>          
                <el-col :span="12">
                  <el-form-item label="合同签名页图片">
                    <tup-picture-select :limit="1" v-model="pic7"></tup-picture-select>
                  </el-form-item>
                </el-col>
              </el-row>   
              <el-row :gutter="5">  
                <el-col :span="12" v-show="false">
                  <el-form-item label="客户编号">
                    <el-input v-model="contractForm.pCustomerid" :disabled="true"  placeholder=""></el-input>
                  </el-form-item>
                </el-col>        
              </el-row>
            </el-form>
            <el-row :gutter="5">   
              <el-col :span="24" style="text-align:right">
                <el-button type="primary" :loading="loading" @click="saveContract">保存合同</el-button>
                <el-button type="primary" @click="toContactHistory">查看历史合同列表</el-button>   
                <el-button @click="printHT">打印授权书</el-button>          
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="新开店信息" name="third">
        <div>
          <el-form :model="model" label-width="180px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="区域：">
                  {{model.storeApply.regionName}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="省办：">
                  {{model.storeApply.provinceName}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="城市：">
                  {{model.storeApply.city}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="重点城市：">
                  {{model.storeApply.isKeycity == 1 ? '是':(model.storeApply.isKeycity == 0 ? '否':'')}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="专卖店名称：">
                  {{model.storeApply.outletName}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="拓展人：">
                  {{model.storeApply.expander}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="店铺详细地址：">
                  {{model.storeApply.outletAddress}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="与样板店距离(公里数)：">
                  {{model.storeApply.distanceToSampleshop}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="周边覆盖户数/社区：">
                  {{model.storeApply.peripheralCoverage}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="找铺人：">
                  {{model.storeApply.shoppers == 0 ? '员工找店':(model.storeApply.shoppers == 1 ? '店主找店':((model.storeApply.shoppers == 2 ? '分销商找店':'')))}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="面积（㎡）：">
                  {{model.storeApply.areaLength ? (model.storeApply.areaLength * model.storeApply.areaWidth):''}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否有上下水：">
                  {{model.storeApply.isHavewater == 0 ? '是':(model.storeApply.isKeycity == 1 ? '否':'')}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="可以示范：">
                  {{model.storeApply.isDemonstration == 0 ? '是':(model.storeApply.isKeycity == 1 ? '否':'')}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="月租金：">
                  {{model.storeApply.monthRent}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="渠道类型：">
                  {{model.pCitchanneltype}}
                </el-form-item>
              </el-col>
            </el-row>
            <div class="itemsTitle">发票信息</div><br/>
            <el-row>
              <el-col :span="8">
                <el-form-item label="是否一般纳税人：">
                  {{model.storeApply.isTaxpayer == 0 ? '是':(model.storeApply.isTaxpayer == 1 ? '否（不邮寄发票）':'否（邮寄发票）')}}
                </el-form-item>
              </el-col>              
            </el-row>
            <div v-show="model.storeApply.isTaxpayer == 0">
              <div class="itemsTitle">票面信息</div><br/>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="公司名称：">
                    {{model.storeApply.companyName}}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="公司地址：">
                    {{model.storeApply.companyAddress}}
                  </el-form-item>
                </el-col>            
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="联系电话：">
                    {{model.storeApply.companyPhone}}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="公司税号：">
                    {{model.storeApply.companyTax}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="开户行：">
                    {{model.storeApply.openningBank}}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="开户账号：">
                    {{model.storeApply.openningBankNumber}}
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="itemsTitle">发票邮寄信息</div><br/>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="发票邮寄地址：">
                    {{model.storeApply.mailAddress ? model.storeApply.mailAddress.replace('//','') :''}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="收件人姓名：">
                    {{model.storeApply.consigneeName}}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="收件人联系电话：">
                    {{model.storeApply.consigneePhone}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="营业执照复印件：">
                    <div class="img" v-if="model.storeApply.businessLicenseUrl">
                      <img :src="model.storeApply.businessLicenseUrl" @click="showPic(model.storeApply.businessLicenseUrl)" style="width:200px;">
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="一般纳税人资格证明：">
                    <div class="img" v-if="model.storeApply.taxpayerQualificationUrl">
                      <img :src="model.storeApply.taxpayerQualificationUrl" @click="showPic(model.storeApply.taxpayerQualificationUrl)" style="width:200px;">
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div class="itemsTitle">新店主信息</div>
            <el-row>
              <el-col :span="12">
                <el-form-item label="店主姓名：">
                  {{model.storeApply.storekeeperName}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="店主年龄：">
                  {{model.storeApply.stroekeeperAge}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="店主性别：">
                  {{model.storeApply.storekeeperSex == 0 ?'男':(model.storeApply.isKeycity == 1 ? '女':'')}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否全职：">
                  {{model.storeApply.isFulltime == 0 ? '是':(model.storeApply.isKeycity == 1 ? '否':'')}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="店主身份：">
                  {{model.storeApply.isMember  == 0 ? '会员':model.storeApply.isMember  == 1 ? '非会员':''}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否有经商经验：">
                  {{model.storeApply.isBussiness == 0 ?'是':(model.storeApply.isKeycity == 1 ? '否':'')}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="信息来源：">
                  {{formatter({'storeApply.information':model.storeApply.information},{property:'storeApply.information'})}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="BOP讲解：">
                  {{model.storeApply.bop  == 0 ? '员工':(model.storeApply.isKeycity == 1 ? '分销商':'')}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="店主身份证号：">
                  {{model.storeApply.storekeeperIdcard}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="店主身份证(正面):">
                  <div class="img" v-if="model.storeApply.idcardUrl">
                    <img :src="model.storeApply.idcardUrl" @click="showPic(model.storeApply.idcardUrl)" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="店主身份证(反面):">
                  <div class="img" v-if="model.storeApply.idcardUrl1">
                    <img :src="model.storeApply.idcardUrl1" @click="showPic(model.storeApply.idcardUrl1)" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="itemsTitle">分销商信息</div>
            <el-row>
              <el-col :span="12">
                <el-form-item label="分销商姓名：">
                  {{model.storeApply.dbName}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="样板店城市：">
                  --
                </el-form-item>
              </el-col>                
            </el-row>
            <el-row>
              <el-col :span="12">
                  <el-form-item label="架构：">
                    --
                  </el-form-item>
                </el-col>
              <el-col :span="12">
                <el-form-item label="PSM姓名：">
                  {{model.storeApply.psmName}}
                </el-form-item>
              </el-col>
            </el-row>  
            <el-row>
              <el-col :span="12">
                <el-form-item label="PSM电话：">
                  {{model.storeApply.psmPhone}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="一分姓名：">
                  --
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="一分样板店所在城市：">
                  --
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="架构：">
                  --
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="资料提交时间：">
                  {{formatter({'storeApply.createTime':model.storeApply.createTime},{property:'storeApply.createTime'})}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="预计开业时间：">
                  {{formatter({'storeApply.openDate':model.storeApply.openDate},{property:'storeApply.openDate'})}}
                </el-form-item>
              </el-col>
            </el-row>
            <div class="itemsTitle">专卖店图片</div>
            <el-row :gutter="5">  
              <el-col :span="8">
                <el-form-item label="店铺正面图片：">
                  <div class="img" v-if="model.storeApply && model.storeApply.outletFrontUrl">
                    <img :src="model.storeApply.outletFrontUrl" @click="showPic(model.storeApply.outletFrontUrl)" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="店铺内部图片：">
                  <div class="img" v-if="model.storeApply && model.storeApply.outletInsideUrl">
                    <img :src="model.storeApply.outletInsideUrl" @click="showPic(model.storeApply.outletInsideUrl)" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="店铺左侧图片：">
                  <div class="img" v-if="model.storeApply && model.storeApply.outletLeftUrl">
                    <img :src="model.storeApply.outletLeftUrl" @click="showPic(model.storeApply.outletLeftUrl)" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="5">  
              <el-col :span="8">
                <el-form-item label="店铺右侧图片：">
                  <div class="img" v-if="model.storeApply && model.storeApply.outletRightUrl">
                    <img :src="model.storeApply.outletRightUrl" @click="showPic(model.storeApply.outletRightUrl)" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="布局及人流走向：">
                  <div class="img" v-if="model.storeApply && model.storeApply.outletFlatFlowUrl">
                    <img :src="model.storeApply.outletFlatFlowUrl" @click="showPic(model.storeApply.outletFlatFlowUrl)" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="店铺所处平面图：">
                  <div class="img" v-if="model.storeApply && model.storeApply.outletFlatUrl">
                    <img :src="model.storeApply.outletFlatUrl" @click="showPic(model.storeApply.outletFlatUrl)" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="5">  
              <el-col :span="8">
                <el-form-item label="店铺效果图：">
                  <div class="img" v-if="model.storeApply && model.storeApply.outletEffectUrl">
                    <img :src="model.storeApply.outletEffectUrl" @click="showPic(model.storeApply.outletEffectUrl)" style="width:200px;">
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        fwiForm:{},
        pic1:[],
        pic2:[],
        pic3:[],
        pic4:[],
        pic5:[],
        pic6:[],
        pic7:[],
        clientId:this.$route.params.id,
        multipleSelection:[],
        customerModel:{},
        model:{},
        Dictions:{
          outlet_property2:[],
          order_status:[],
          order_type:[],
          pay_status:[],
          return_reason:[]
        },
        contractForm:{},
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
        activeName:this.$route.params.type,
        treeLoading:false
      }
    },
    watch:{      
      pic1:function(pics){
        if(pics.length > 0){
          this.fwiForm.photo = pics[0].url;
        }
        else{
          this.fwiForm.photo = ''
        }
      },
      pic2:function(pics){
        if(pics.length > 0){
          this.fwiForm.photo2 = pics[0].url;
        }
        else{
          this.fwiForm.photo3 = ''
        }
      },
      pic3:function(pics){
        if(pics.length > 0){
          this.fwiForm.photo3 = pics[0].url;
        }
        else{
          this.fwiForm.photo3 = ''
        }
      },
      pic4:function(pics){
        if(pics.length > 0){
          this.fwiForm.photo4 = pics[0].url;
        }
        else{
          this.fwiForm.photo4 = ''
        }
      },
      pic5:function(pics){
        if(pics.length > 0){
          this.contractForm.pFrontPhoto = pics[0].url;
        }
        else{
          this.contractForm.pFrontPhoto = ''
        }
      },
      pic6:function(pics){
        if(pics.length > 0){
          this.contractForm.pCoverPhoto = pics[0].url;
        }
        else{
          this.contractForm.pCoverPhoto = ''
        }
      },
      pic7:function(pics){
        if(pics.length > 0){
          this.contractForm.pSignPhoto = pics[0].url;
        }
        else{
          this.contractForm.pSignPhoto = ''
        }
      }
    },
    methods: {
      toContactHistory(){
        this.gotoUrl('/frame/terminal/customerContact/'+this.clientId)
      },
      printHT(){
        window.open('/#/printCustomer/'+this.clientId)
      },
      printHTWin7(){
        window.open('/#/printCustomerWin7/'+this.clientId)
      },
      showPic(picUrl){
        window.open(picUrl)
      },
      updateFwi(row){
        this.fwiForm = row.fwi ? row.fwi:{}
        this.model.storeApply = row.storeApply ? row.storeApply : {}
        this.fwiForm.clientId = row.pUid;
        this.contractForm = row.contract ? row.contract :{}
        this.contractForm.pCustomerid = row.pUid;
        if(this.contractForm.pFrontPhoto){
          this.pic5.push({
            url :this.contractForm.pFrontPhoto
          })
        }
        if(this.contractForm.pCoverPhoto){
          this.pic6.push({
            url :this.contractForm.pCoverPhoto
          })
        }
        if(this.contractForm.pSignPhoto){
          this.pic7.push({
            url :this.contractForm.pSignPhoto
          })
        }
        if(this.fwiForm.photo){
          this.pic1.push({
            url :row.fwi.photo
          })
        }
        if(this.fwiForm.photo2){
          this.pic2.push({
            url :row.fwi.photo2
          })
        }
        if(this.fwiForm.photo3){
          this.pic3.push({
            url :row.fwi.photo3
          })
        }
        if(this.fwiForm.photo4){
          this.pic4.push({
            url :row.fwi.photo4
          })
        }
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
        else if(column.property =='storeApply.information'){
          this.Dictions.msg_source.map(item=>{
            if(row[column.property.split('.')[0]] && row[column.property.split('.')[0]][column.property.split('.')[1]]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='fwi.outletShow'){
          this.Dictions.outlet_show.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='fwi.location'){
          this.Dictions.location.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='fwi.addressSource'){
          this.Dictions.address_source.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='fwi.bopExplain'){
          this.Dictions.bop_explain.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        
        else if(column.property =='fwi.ownerSex'){
          this.Dictions.gender.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='pOosCode'){
          this.Dictions.oos_code.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='pFirstorderDate' || column.property =='pOpenningDate' || column.property =='pGraduationDate' || 
        column.property == 'contract.pDbProtocolDateE' || column.property == 'contract.pDbProtocolDateS' || column.property == 'contract.updatetime' 
        || column.property == 'storeApply.openDate' || column.property == 'storeApply.createTime'){
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
            message : '保存FWI成功'
          });
          thiz.loading = false;
        },res=>{
          thiz.loading = false;
        }) 
      },
      saveContract(){
        let thiz = this;
        this.loading = true;
        thiz.$tupHttp(thiz,'user/updateClientContract','POST',this.contractForm).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功',
            message : '保存合同成功'
          });
        },res=>{
          thiz.loading = false;
        }) 
      },
      getInfo(){
        let thiz = this;
        thiz.$tupHttp(thiz,'user/info/v1?clientId='+this.clientId,'GET').then(res=>{
          let model = res.body.model;  
          thiz.model = model; 
          if(model){
            thiz.updateFwi(model)
          }
        }) 
      },
      loadDictions(){
        let thiz = this;
        let params = ["outlet_property","outlet_status","grade_type","outlet_property2","visualize_grade","graduation_reason","msg_source","outlet_show","location","address_source","gender","bop_explain","oos_code"];
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
.img{
  border: #ccc 1px solid;
  padding: 5px;
  width: 210px;
  border-radius: 5px;
}
</style>