<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>客户管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/frame/terminal/customerDb'}">分销商信息</el-breadcrumb-item>
      <el-breadcrumb-item>分销商详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row>
      <el-col :span="18">   
        &nbsp;     
      </el-col>
      <el-col :span="6" style="text-align:right"><el-button @click="gotoUrl('/frame/terminal/customerDB')">返回</el-button></el-col>
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
                <el-form-item label="分销商编号：">
                  {{model.pUid}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="分销商名称：">
                  {{model.pOrganName2}}
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
                <el-form-item label="分销商地址：">
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
                <el-form-item label="上级分销商编号：">
                  {{model.pCitparentno}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="上级分销商名称：">
                  {{model.pCitparent}}
                </el-form-item>
              </el-col>
            </el-row>
            <div class="itemsTitle"></div>
            <el-row>
              <el-col :span="12">
                <el-form-item label="分销商状态：">
                  {{formatter({pOutletStatus:model.pOutletStatus},{property:'pOutletStatus'})}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="门店折扣率：">
                  {{model.pDiscountvalue}}%
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
                <el-form-item label="挑战方案：">
                  {{model.pClassification}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="分销商级别：">
                  {{model.pGradeNo1}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="分销商层级：">
                  {{model.pGradeType}}
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
                <el-form-item label="有效店数：">
                  {{model.pOioCount}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="已开业店数：">
                  {{model.pOutletCount}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="种子店数：">
                  {{model.pSeedCount}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="代表店编号：">
                  {{model.pRepresentUid}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="代表店名称：">
                  {{model.pRepresentName}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="首订日期：">
                  {{formatter({pFirstorderDate:model.pFirstorderDate},{property:'pFirstorderDate'})}}
                </el-form-item>
              </el-col>
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
      <el-tab-pane label="架构信息" name="first">
        <div>
          <el-form :model="model" ref="modelForm" label-width="180px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="挑战方案：">
                  {{model.pClassification}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="分销商级别：">
                  {{model.pGradeNo1}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="渠道类型：">
                  {{model.pCitchanneltype}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="有效店数：">
                  {{model.pOioCount}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="已开业店数：">
                  {{model.pOutletCount}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="种子店数：">
                  {{model.pSeedCount}}
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="itemsTitle">架构内专卖店信息</div>
          <el-table
            :data="tableData"
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
              prop="pCnid"
              label="OOS编号"
              width="120">
            </el-table-column>      
            <el-table-column
              prop="pUid"
              label="专卖店编号"
              width="120">
            </el-table-column>
            <el-table-column
              prop="pOrganName2"
              label="专卖店名称"
              width="150">
            </el-table-column>
            <el-table-column
              prop="pName"
              label="客户名"
              width="100">
            </el-table-column> 
            <el-table-column
              prop="pDm"
              label="DM工号"
              width="100">
            </el-table-column>
            <el-table-column
              prop="pDmName"
              label="DM姓名"
              width="100">
            </el-table-column>
            <el-table-column
              prop="pFs"
              label="DFS工号"
              width="100">
            </el-table-column>
            <el-table-column
              prop="pFsName"
              label="DFS人员"
              width="100">
            </el-table-column>
            <el-table-column
              prop="pDiscountvalue"
              label="门店折扣率"
              width="100">
            </el-table-column>
            <el-table-column
              prop="pCitoutletproperty"
              :formatter="formatter"
              label="专卖店性质"
              width="100">
            </el-table-column>
            <el-table-column
              prop="pOutletStatus"
              label="专卖店状态"
              :formatter="formatter1"
              width="100">
            </el-table-column>
            <el-table-column
              prop="pCitoutletproperty2"
              label="专卖店类型"
              :formatter="formatter"
              width="100">
            </el-table-column>
            <el-table-column
              prop="proxyStore"
              label="是否代管店"
              width="100">
              <template slot-scope="scope">
                {{scope.row.pCitoutletproperty2 == 8796121202779 ? '是':'否'}}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="是否代表店"
              width="100">
              <template slot-scope="scope">
                {{scope.row.pCitoutletproperty2 == 8796121170011 ? '是':'否'}}
              </template>        
            </el-table-column>
            <el-table-column
              prop="pIsseed"
              label="是否种子店"
              width="100">
              <template slot-scope="scope">
                {{scope.row.pIsseed == 1 ? '是':'否'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="pOosCode"
              label="财务等级"
              :formatter="formatter"
              width="100">
            </el-table-column>      
            <el-table-column
              prop="pOpenningDate"
              label="开业日期"
              :formatter="formatter"
              width="100">
            </el-table-column>
            <el-table-column
              prop="pFirstorderDate"
              label="首订日期"
              :formatter="formatter"
              width="100">
            </el-table-column>
            <el-table-column
              prop="pGraduationDate"
              label="结业日期"
              :formatter="formatter"
              width="100">
            </el-table-column>
            <el-table-column
              prop="pAddress4"
              label="联系人"
              width="100">
            </el-table-column>
            <el-table-column
              prop="pBmMobile"
              label="联系电话"
              width="100">
            </el-table-column>
            <el-table-column
              prop="pEmail"
              label="系统激活Email"
              width="100">
            </el-table-column>
            <el-table-column
              prop="pMobile"
              label="系统激活手机"
              width="100">
            </el-table-column>
            <el-table-column
              prop="pCityno"
              label="城市"
              width="100">
            </el-table-column>
            <el-table-column
              prop="pActiveCity"
              label="激活城市"
              width="100">
            </el-table-column>
            <el-table-column
              prop="pActiveArea"
              label="城区"
              width="100">
            </el-table-column>
            <el-table-column
              prop="pAddress2"
              label="专卖店地址"
              width="100">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="80">
              <template slot-scope="scope">
                <el-button @click="view(scope.$index,scope.row)" type="text" size="small">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="挑战者合同信息" name="third">
        <div>
          <el-form :model="contractForm" ref="modelForm" label-width="180px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="合同审核状态：">
                  {{contractForm.status == 1 ? "审核通过":"审核中"}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="分销商名称：">
                  {{model.pOrganName2}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="分销商编号：">
                  {{model.pUid}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="上级分销商编号：">
                  {{model.pCitparentno}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="上级分销商名称：">
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
              
              <el-col :span="12">
                <el-form-item label="挑战方案：">
                  {{model.pClassification}}
                </el-form-item>
              </el-col>
            </el-row>            
            <div>
              <div class="itemsTitle">挑战者合同</div><br/>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="挑战者合同编号：">
                    <el-input v-model="contractForm.pCgProtocolNo"  placeholder=""></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="挑战者档案编号："> 
                    <el-input v-model="contractForm.pArchivesNo2"  placeholder=""></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="挑战者合同开始有效期：">
                   <el-date-picker
                      style="width:100%"
                      v-model="contractForm.pCgProtocolDateS"
                      placeholder="选择日期时间">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="挑战者合同结束日期：">
                    <el-date-picker
                      style="width:100%"
                      v-model="contractForm.pCgProtocolDateE"
                      placeholder="选择日期时间">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
              <el-col :span="12">
                <el-form-item label="挑战者合同乙方客户名称：">
                  <el-input v-model="contractForm.pOrganName2"  placeholder=""></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="法人身份证号："> 
                  <el-input v-model="contractForm.pCardNo2"  placeholder=""></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="挑战者合同样板店地址：">
                  <el-input v-model="contractForm.pDbProtocolAddr2"  placeholder=""></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备注：">
                  <el-input v-model="contractForm.remark2"  placeholder=""></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="更新日期：">
                  {{model.contract ? formatter({'contract.updatetime2':model.contract.updatetime2},{property:'contract.updatetime2'}) : ''}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="更新人：">
                  {{model.contract ? model.contract.updateby2:''}}
                </el-form-item>
              </el-col>
            </el-row>
              <el-row :gutter="5">  
                <el-col :span="12">
                  <el-form-item label="挑战者合同封面图片">
                    <tup-picture-select :limit="1" v-model="pic8"></tup-picture-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="挑战者合同首页图片">
                    <tup-picture-select :limit="1" v-model="pic9"></tup-picture-select>
                  </el-form-item>
                </el-col>          
                <el-col :span="12">
                  <el-form-item label="挑战者合同签名页图片">
                    <tup-picture-select :limit="1" v-model="pic10"></tup-picture-select>
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
            </div>
            <el-col :span="24" style="text-align:right">
              <el-button type="primary" :loading="loading" @click="saveContract2">保存</el-button>    
              <el-button type="primary" @click="toContactHistory('third')">查看历史合同列表</el-button>   
            </el-col>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="分销商合同信息" name="second">
        <div>
          <el-form :model="contractForm" ref="modelForm" label-width="180px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="合同审核状态：">
                  {{contractForm.status == 1 ? "审核通过":"审核中"}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="分销商名称：">
                  {{model.pOrganName2}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="分销商编号：">
                  {{model.pUid}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="上级分销商编号：">
                  {{model.pCitparentno}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="上级分销商名称：">
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
              
              <el-col :span="12">
                <el-form-item label="挑战方案：">
                  {{model.pClassification}}
                </el-form-item>
              </el-col>
            </el-row>
            <div>
              <div class="itemsTitle">分销商合同</div><br/>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="分销商合同编号：">
                    <el-input v-model="contractForm.pDbProtocolNo"  placeholder=""></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              
              <el-row>
                <el-col :span="12">
                  <el-form-item label="分销商合同开始有效期：">
                   <el-date-picker
                      style="width:100%"
                      v-model="contractForm.pDbProtocolDateS"
                      placeholder="选择日期时间">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="分销商合同结束日期：">
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
                  <el-form-item label="分销商合同授权书编号：">
                    {{contractForm.pAuthorizeNo}}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="档案编号："> 
                    <el-input v-model="contractForm.pArchivesNo"  placeholder=""></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
              <el-col :span="12">
                <el-form-item label="合同乙方客户名称：">
                  <el-input v-model="contractForm.pOrganName"  placeholder=""></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="法人身份证号："> 
                  <el-input v-model="contractForm.pCardNo1"  placeholder=""></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="合同样板店地址：">
                  <el-input v-model="contractForm.pDbProtocolAddr"  placeholder=""></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备注：">
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
                  <el-form-item label="分销商合同封面图片">
                    <tup-picture-select :limit="1" v-model="pic5"></tup-picture-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="分销商合同首页图片">
                    <tup-picture-select :limit="1" v-model="pic6"></tup-picture-select>
                  </el-form-item>
                </el-col>          
                <el-col :span="12">
                  <el-form-item label="分销商合同签名页图片">
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
            </div>
            <el-col :span="24" style="text-align:right">
              <el-button type="primary" :loading="loading" @click="saveContract">保存</el-button>
              <el-button type="primary" @click="toContactHistory('second')">查看历史合同列表</el-button>   
              <el-button @click="printHT">打印授权书</el-button>        
            </el-col>
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
        tableData:[],
        fwiForm:{},
        pic1:[],
        pic2:[],
        pic3:[],
        pic4:[],
        pic5:[],
        pic6:[],
        pic7:[],
        pic8:[],
        pic9:[],
        pic10:[],
        clientId:this.$route.params.id,
        multipleSelection:[],
        customerModel:{},
        model:{},
        contractForm:{},
        Dictions:{
          outlet_property2:[],
          order_status:[],
          order_type:[],
          pay_status:[],
          return_reason:[],
          distributor_status:[],
          grade_type:[]
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
          this.fwiForm.photo2 = ''
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
          this.contractForm.pDbFrontPhoto = pics[0].url;
        }
        else{
          this.contractForm.pDbFrontPhoto = ''
        }
      },
      pic6:function(pics){
        if(pics.length > 0){
          this.contractForm.pDbCoverPhoto = pics[0].url;
        }
        else{
          this.contractForm.pDbCoverPhoto = ''
        }
      },
      pic7:function(pics){
        if(pics.length > 0){
          this.contractForm.pDbSignPhoto = pics[0].url;
        }
        else{
          this.contractForm.pDbSignPhoto = ''
        }
      },
      pic8:function(pics){
        if(pics.length > 0){
          this.contractForm.pCgFrontPhoto = pics[0].url;
        }
        else{
          this.contractForm.pCgFrontPhoto = ''
        }
      },
      pic9:function(pics){
        if(pics.length > 0){
          this.contractForm.pCgCoverPhoto = pics[0].url;
        }
        else{
          this.contractForm.pCgCoverPhoto = ''
        }
      },
      pic10:function(pics){
        if(pics.length > 0){
          this.contractForm.pCgSignPhoto = pics[0].url;
        }
        else{
          this.contractForm.pCgSignPhoto = ''
        }
      }
    },
    methods: {
      toContactHistory(type){
        this.gotoUrl('/frame/terminal/dbContact/'+this.clientId+'/'+type)
      },
      printHT(){
        window.open('/#/printDb/'+this.clientId)
      },
      printHTWin7(){
        window.open('/#/printDbWin7/'+this.clientId)
      },
      showPic(picUrl){
        window.open(picUrl)
      },
      updateFwi(row){
        this.fwiForm = row.fwi ? row.fwi:{}
        this.fwiForm.clientId = row.pUid;
        this.contractForm = row.contract ? row.contract :{}
        this.contractForm.pCustomerid = row.pUid;
        if(this.contractForm.pDbFrontPhoto){
          this.pic5.push({
            url :this.contractForm.pDbFrontPhoto
          })
        }
        if(this.contractForm.pDbCoverPhoto){
          this.pic6.push({
            url :this.contractForm.pDbCoverPhoto
          })
        }
        if(this.contractForm.pDbSignPhoto){
          this.pic7.push({
            url :this.contractForm.pDbSignPhoto
          })
        }
        if(this.contractForm.pCgFrontPhoto){
          this.pic8.push({
            url :this.contractForm.pCgFrontPhoto
          })
        }
        if(this.contractForm.pCgCoverPhoto){
          this.pic9.push({
            url :this.contractForm.pCgCoverPhoto
          })
        }
        if(this.contractForm.pCgSignPhoto){
          this.pic10.push({
            url :this.contractForm.pCgSignPhoto
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
          this.Dictions.distributor_status.map(item=>{
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
        else if(column.property =='fwi.msgSource'){
          this.Dictions.msg_source.map(item=>{
            if(row[column.property]==item.dictValue){
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
        column.property == 'contract.pCgProtocolDateE' || column.property == 'contract.pCgProtocolDateS' || column.property == 'contract.pDbProtocolDateE'|| column.property == 'contract.pDbProtocolDateS' || column.property == 'contract.updatetime'
         || column.property == 'contract.updatetime2'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd");
        }
        return txt;
      },
      formatter1(row, column) {
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
        else if(column.property =='fwi.msgSource'){
          this.Dictions.msg_source.map(item=>{
            if(row[column.property]==item.dictValue){
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
        column.property == 'contract.pCgProtocolDateE' || column.property == 'contract.pCgProtocolDateS' || 
        column.property == 'contract.pDbProtocolDateE'|| column.property == 'contract.pDbProtocolDateS' || column.property == 'contract.updatetime' 
        || column.property == 'contract.updatetime2'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd");
        }
        return txt;
      },
      view(ind,row){
        this.gotoUrl('/frame/terminal/customerDetail/'+row.pUid+'/zero')
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
      saveContract2(){
        let thiz = this;
        this.loading = true;
        thiz.$tupHttp(thiz,'user/updateClientContract2','POST',this.contractForm).then(res=>{
          thiz.$notify.success({
            title: '成功',
            message : '保存挑战者合同成功'
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
          thiz.$notify.success({
            title: '成功',
            message : '保存分销商合同成功'
          });
          thiz.loading = false;
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
      loadData(){
        let thiz = this;
        thiz.tableLoading = true;
        let searchForm = {
          effectiveOIO:'',
          citorganlevel:6,
          sDbStr:this.clientId,
          pagingQuery:{
            pageIndex:1,
            pageSize:100
          }
        }
        thiz.$tupHttp(thiz,'user/list/v1','POST',searchForm).then(res=>{
          thiz.tableData = res.body.models;
        })
      },
      loadDictions(){
        let thiz = this;
        let params = ["distributor_status","outlet_property","outlet_status","grade_type","outlet_property2","visualize_grade","graduation_reason","msg_source","outlet_show","location","address_source","gender","bop_explain","oos_code"];
        this.$baseData.getDicts(this,params,function(data){
          thiz.Dictions = data;
        });
      }
    },
    mounted(){
      this.getInfo();    
      this.loadData();
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