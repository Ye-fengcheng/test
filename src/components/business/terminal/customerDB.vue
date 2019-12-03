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
            <tup-arae-select v-model="searchForm.provinceObject"  ></tup-arae-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="分销商编号">
            <el-input v-model="searchForm.sDbStr" size="mini" placeholder="分销商编号"></el-input>
          </el-form-item>
        </el-col>        
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="DFS编号">
            <el-input v-model="searchForm.fs" size="mini" placeholder="DFS编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="DM工号">
            <el-input v-model="searchForm.dm" size="mini" placeholder="DM工号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="上级分销商编号">
            <el-input v-model="searchForm.citparentno" size="mini" placeholder="上级分销商编号"></el-input>
          </el-form-item>
        </el-col>        
      </el-row>
      <el-row :gutter="5">        
        <el-col :span="8">
          <el-form-item label="分销商姓名">
            <el-input v-model="searchForm.name" size="mini" placeholder="分销商姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="结业日期">
            <el-date-picker
              v-model="searchForm.graduationDate"
              style="width:100%"
              type="daterange"
              size="mini"
              value-format="yyyy-MM-dd"
              :default-time="['00:00:00', '23:59:59']"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="挑战日期">
            <el-date-picker
              v-model="searchForm.challengeDate"
              style="width:100%"
              type="daterange"
              size="mini"
              value-format="yyyy-MM-dd"
              :default-time="['00:00:00', '23:59:59']"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">        
        <el-col :span="8">
          <el-form-item label="状态">
            <el-select v-model="searchForm.outletStatuses2" size="mini" multiple clearable filterable  placeholder="请选择">
              <el-option
                v-for="item in Dictions.distributor_status"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col> 
         <el-col :span="8">
          <el-form-item label="OOS编号">
            <el-input v-model="searchForm.cnid" size="mini" placeholder="OOS编号"></el-input>
          </el-form-item>
        </el-col> 
        <el-col :span="8">
          <el-form-item label="档案编号">
            <el-input v-model="searchForm.archivesNo" size="mini" placeholder="档案编号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">        
        <el-col :span="8">
          <el-form-item label="开业日期">
            <el-date-picker
              v-model="searchForm.openningDate"
              style="width:100%"
              type="daterange"
              size="mini"
              value-format="yyyy-MM-dd"
              :default-time="['00:00:00', '23:59:59']"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="DFS编号是否为空">
            <el-select v-model="searchForm.dfsNoEmpty" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="是" :value="0"></el-option>
              <el-option label="否" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="城市">
            <el-input v-model="searchForm.cityno" size="mini" placeholder="城市"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="loadData(true)">查询</el-button>
        <el-button icon="el-icon-refresh" type="primary" size="mini" @click="resetForm">重置</el-button>
        <el-button icon="el-icon-download" @click="downLoad" :loading="loading" size="mini" type="primary">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="tableLoading"
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
        label="分销商编号"
        width="120">
      </el-table-column>      
      <el-table-column
        prop="pName"
        label="分销商名称"
        width="100">
      </el-table-column>  
      <el-table-column
        prop="pCitregionoffice"
        label="区域"
        width="80">
      </el-table-column>
      <el-table-column
        prop="pCitprovincialoffice"
        label="省办"
        sortable
        width="80">
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
        prop="pCitparentno"
        label="上级分销商编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="pCitparent"
        label="上级分销商名称"
        width="120">
      </el-table-column>
      <!-- <el-table-column
        prop="pAllowBusiness"
        label="启用下单"
        width="90">
        <template slot-scope="scope">
          <el-switch
            :active-value="true"
            :inactive-value="false"
            v-model="scope.row.pAllowBusiness">
          </el-switch>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="pDiscountvalue"
        label="代表店折扣率"
        width="100">
      </el-table-column>
      <el-table-column
        prop="pClassification"
        label="挑战方案"
        width="100">
      </el-table-column>
      <el-table-column
        prop="pGradeNo1"
        label="分销商级别"
        width="100">
      </el-table-column>         
      <el-table-column
        prop="pOutletStatus"
        label="分销商状态"
        :formatter="formatter"
        width="100">
      </el-table-column>   
      <el-table-column
        prop="pCitchanneltype"
        label="渠道类型"
        width="100">
      </el-table-column>
      <el-table-column
        prop="pGradeType"
        label="客户层级"
        width="100">
      </el-table-column>
      <el-table-column
        prop="pOosCode"
        label="财务等级"
        :formatter="formatter"
        width="100">
      </el-table-column> 
      <el-table-column
        prop="pOioCount"
        label="有效店数"
        width="100">
      </el-table-column>
      <el-table-column
        prop="pOutletCount"
        label="已开业店数"
        width="100">
      </el-table-column>
      <el-table-column
        prop="pSeedCount"
        label="种子店数"
        width="100">
      </el-table-column>
      <el-table-column
        prop="pRepresentUid"
        label="代表店编号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="pRepresentName"
        label="代表店名称"
        width="100">
      </el-table-column>
      <!--<el-table-column
        prop="pCitoutletproperty"
        :formatter="formatter"
        label="专卖店性质"
        width="100">
      </el-table-column>
      <el-table-column
        prop="pOutletStatus"
        label="专卖店状态"
        :formatter="formatter"
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
      </el-table-column>-->
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
      <!-- <el-table-column
        prop="pName"
        label="店员数量（无）"
        width="100">
      </el-table-column> -->
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
        prop="pCitylevel"
        label="城市级别"
        width="100">
      </el-table-column>
      <el-table-column
        prop="pAddress2"
        label="分销商店地址"
        width="100">
      </el-table-column>
      <el-table-column
        prop="pSpMobile"
        label="送货联系电话"
        width="100">
      </el-table-column>
      <el-table-column
        prop="pAddress1"
        label="送货地址"
        width="100">
      </el-table-column>
      <el-table-column
        prop="contract.pDbProtocolNo"
        label="分销商合同编号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="contract.pAuthorizeNo"
        label="分销商合同授权书编号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="contract.pArchivesNo"
        label="分销商合同档案编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="contract.pCardNo1"
        label="分销商合同法人身份证号码"
        width="140">
      </el-table-column>
      <el-table-column
        prop="contract.pOrganName"
        label="分销商合同乙方客户名称"
        width="100">
      </el-table-column>
      <el-table-column
        prop="contract.pDbProtocolAddr"
        label="分销商合同样板店地址"
        width="100">
      </el-table-column>
      <el-table-column
        prop="contract.pDbProtocolDateS"
        label="分销商合同开始日期"
        width="100">
        <template slot-scope="scope">
          {{scope.row.contract ? (scope.row.contract.pDbProtocolDateS ? new Date(scope.row.contract.pDbProtocolDateS).format("yyyy-MM-dd"):'' ):''}}
        </template>
      </el-table-column>
      <el-table-column
        prop="contract.pDbProtocolDateE"
        label="分销商合同结束日期"
        width="100">
        <template slot-scope="scope">
          {{scope.row.contract ? (scope.row.contract.pDbProtocolDateE ? new Date(scope.row.contract.pDbProtocolDateE).format("yyyy-MM-dd"):'' ):''}}
        </template>
      </el-table-column>
      <el-table-column
        prop="contract.pCgProtocolNo"
        label="挑战者协议编号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="contract.pArchivesNo2"
        label="挑战者合同档案编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="contract.pCgProtocolDateS"
        label="挑战者协议开始时间"
        width="100">
        <template slot-scope="scope">
          {{scope.row.contract ? (scope.row.contract.pCgProtocolDateS ? new Date(scope.row.contract.pCgProtocolDateS).format("yyyy-MM-dd"):'' ):''}}
        </template>
      </el-table-column>
      <el-table-column
        prop="contract.pCgProtocolDateE"
        label="挑战者协议结束时间"
        width="100">
        <template slot-scope="scope">
          {{scope.row.contract ? (scope.row.contract.pCgProtocolDateE ? new Date(scope.row.contract.pCgProtocolDateE).format("yyyy-MM-dd"):'' ):''}}
        </template>
      </el-table-column>
      <el-table-column
        prop="contract.pCardNo2"
        label="挑战者合法人身份证号码"
        width="100">
      </el-table-column>
      <el-table-column
        prop="contract.pOrganName2"
        label="挑战者合同乙方客户名称"
        width="100">
      </el-table-column>
      <el-table-column
        prop="contract.pDbProtocolAddr2"
        label="挑战者合同样板店地址"
        width="100">
      </el-table-column>
      <el-table-column
        prop="fMonth"
        label="当前财务月"
        width="100">
        <template slot-scope="scope">
          {{fMonth}}
        </template>
      </el-table-column> 
      <el-table-column
        fixed="right"
        label="操作"
        width="180">
        <template slot-scope="scope">
          <el-button @click="view(scope.$index,scope.row)" type="text" size="small">详情</el-button>
          <el-button @click="resetPass(scope.$index,scope.row)" :loading="loading" type="text" size="small">重置密码</el-button>
           <!--<el-button @click="updateContract(scope.$index,scope.row)" :loading="loading" type="text" size="small">更改合同</el-button>
          <el-button @click="updateFwi(scope.$index,scope.row)" :loading="loading" type="text" size="small">更改fwi</el-button>    -->       
          <!-- <el-button
            size="mini"          
            type="primary"
            :loading="loading"
            @click="saveItem(scope.$index, scope.row)">保存</el-button> -->
        </template>
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
    <el-dialog title="转让" width="30%" top="15%" :visible.sync="dialogVisible">
      <el-form  :model="approveForm" label-width="80px" >
        <el-form-item label="新店编号">            
          <el-input v-model="approveForm.newClientId" placeholder="新店编号"></el-input>
        </el-form-item>
      </el-form>     
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" size="mini" @click="transfer">确认</el-button>
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="更改合同信息" width="70%" top="10%" :visible.sync="contractDialogVisible">
      <el-form  :model="contractForm" label-width="150px" >
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="身份证号码">
              <el-input v-model="contractForm.pCardNo1"  placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="挑战者协议编号">
              <el-input v-model="contractForm.pCgProtocolNo"  placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="挑战者协议开始日期">
              <el-date-picker
                style="width:100%"
                v-model="contractForm.pCgProtocolDateS"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="挑战者协议结束日期">
              <el-date-picker
                style="width:100%"
                v-model="contractForm.pCgProtocolDateE"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
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
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="合同客户名称">
              <el-input v-model="contractForm.pOrganName"  placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同编号">
              <el-input v-model="contractForm.pDbProtocolNo"  placeholder=""></el-input>
            </el-form-item>
          </el-col>          
        </el-row>
        <el-row :gutter="5">
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
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="合同联系地址">
              <el-input v-model="contractForm.pDbProtocolAddr"  placeholder=""></el-input>
            </el-form-item>
          </el-col>  
          <el-col :span="12" v-show="false">
            <el-form-item label="客户编号">
              <el-input v-model="contractForm.pCustomerid" :disabled="true"  placeholder=""></el-input>
            </el-form-item>
          </el-col>        
        </el-row>
        <el-row :gutter="5">  
          <el-col :span="12">
            <el-form-item label="合同正面图片">
              <tup-picture-select :limit="1" v-model="pic1"></tup-picture-select>
            </el-form-item>
          </el-col>          
          <el-col :span="12">
            <el-form-item label="合同签名页图片">
              <tup-picture-select :limit="1" v-model="pic2"></tup-picture-select>
            </el-form-item>
          </el-col>
        </el-row> 
      </el-form>     
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" size="mini" @click="saveContract">保存</el-button>
        <el-button size="mini" @click="contractDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="更改fwi" width="70%" top="10%" :visible.sync="fwiDialogVisible">
      <el-form  :model="fwiForm" label-width="150px" >
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
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="店员月工资">
              <el-input-number v-model="fwiForm.clerkmonthlysalary " :min="0" label="描述文字"></el-input-number>
            </el-form-item>
          </el-col> 
          <el-col :span="12">
            <el-form-item label="员工身份">
              <el-input v-model="fwiForm.empDegree" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
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
          <el-col :span="12">
             <el-form-item label="是否有驻店员工">
               <el-switch
                :active-value="true"
                :inactive-value="false"
                v-model="fwiForm.hasStationEmp">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="门店位置">
              <el-select style="width:100%" v-model="fwiForm.location" clearable filterable  placeholder="请选择">
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
             <el-form-item label="平均月销售">
              <el-input-number v-model="fwiForm.monthSalesAvg " :min="0" label="描述文字"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
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
          <el-col :span="12">
             <el-form-item label="面积(平方米)">
              <el-input-number v-model="fwiForm.outletArea " :min="0" label="描述文字"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="门店外观">
              <el-select style="width:100%" v-model="fwiForm.outletShow" clearable filterable  placeholder="请选择">
                <el-option
                  v-for="item in Dictions.outlet_show"
                  :key="item.dictValue"
                  :label="item.dictName"
                  :value="item.dictValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col> 
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
        </el-row>
        <el-row :gutter="5">  
          <el-col :span="12">
             <el-form-item label="月盈亏平衡">
              <el-input-number v-model="fwiForm.profitAndLoss " :min="0" label="描述文字"></el-input-number>
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
            <el-form-item label="店主年龄">
              <el-input v-model="fwiForm.shopkeeperage" placeholder=""></el-input>
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
        <div class="itemsTitle">专卖店图片(最多2张)</div>
        <tup-picture-select :limit="2" v-model="pics"></tup-picture-select>
      </el-form>     
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" size="mini" @click="saveFwi">保存</el-button>
        <el-button size="mini" @click="fwiDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name:'keepAlive-terminal-customerDB',
    data() {
      return {
        dialogVisible:false,
        approveForm:{
          newClientId:'',
          oldClientId:''
        },
        pics:[],
        fMonth:'',
        loading:false,
        currentPage:1,
        total:10,
        Dictions:{
          oos_code:[],
          outlet_status:[],
          outlet_property:[],
          visualize_grade:[],
          graduation_reason:[],
          msg_source:[],
          outlet_show:[],
          outlet_property2:[],
          location:[],
          grade_type:[],
          address_source:[],
          gender:[],
          bop_explain:[],
          distributor_status:[]
        },//本页面使用的所有字典
        searchForm:{
          organName:'',
          dfsNoEmpty:'',
          dm:'',
          effectiveOIO:'',
          citorganlevel:5,
          fs:'',
          sProvince:[],
          provinceObject:[],
          sRegion:[],
          areaObject:[],
          cityno:'',
          cnid:'',
          name:'',
          citparentno:'',
          graduationDate:[],
          clientTypeList:[],
          challengeDate:[],
          firstorderDate:[],
          openningDate:[],
          sDbStr:'',
          outletStatus2:'',
          outletStatuses2:['8796118941787'],
          citoutletproperty:'',
          archivesNo:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:50
          }
        },
        tableData: [],
        tableLoading:false,
        contractForm:{},
        fwiForm:{},
        contractDialogVisible:false,
        fwiDialogVisible:false,
        pic1:[],
        pic2:[]
      }
    },
    watch:{
      $route:function(val){
        if(val.path == '/frame/terminal/customerDB'){
          this.$util.onKeyCode(this,'loadData',[true])
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
      },
      pics:function(pics){
        if(pics.length > 0){
          this.fwiForm.photo = pics[0].url;
        }
        if(pics.length > 1){
          this.fwiForm.photo2 = pics[1].url;
        }
      },
      pic1:function(pics){
        if(pics.length > 0){
          this.contractForm.pCoverPhoto = pics[0].url;
        }
      },
      pic2:function(pics){
        if(pics.length > 0){
          this.contractForm.pSignPhoto = pics[0].url;
        }
      }
    },
    methods: {
      resetForm(){
        this.searchForm = {
          dm:'',
          effectiveOIO:'',
          citorganlevel:5,
          clientTypeList:[],
          fs:'',
          dfsNoEmpty:'',
          sProvince:[],
          provinceObject:[],
          sRegion:[],
          areaObject:[],
          cityno:'',
          cnid:'',
          citparentno:'',
          archivesNo:'',
          name:'',
          graduationDate:[],
          challengeDate:[],
          firstorderDate:[],
          openningDate:[],
          sDbStr:'',
          outletStatus2:'',
          outletStatuses2:['8796118941787'],
          citoutletproperty:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:this.searchForm.pagingQuery.pageSize
          }
        }
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
            if(row[column.property.split('.')[0]] && row[column.property.split('.')[0]][column.property.split('.')[1]]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='fwi.graduationReason'){
          this.Dictions.graduation_reason.map(item=>{
            if(row[column.property.split('.')[0]] && row[column.property.split('.')[0]][column.property.split('.')[1]]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='fwi.msgSource'){
          this.Dictions.msg_source.map(item=>{
            if(row[column.property.split('.')[0]] && row[column.property.split('.')[0]][column.property.split('.')[1]]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='fwi.outletShow'){
          this.Dictions.outlet_show.map(item=>{
            if(row[column.property.split('.')[0]] && row[column.property.split('.')[0]][column.property.split('.')[1]]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='fwi.location'){
          this.Dictions.location.map(item=>{
            if(row[column.property.split('.')[0]] && row[column.property.split('.')[0]][column.property.split('.')[1]]==item.dictValue){
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
        else if(column.property =='fwi.addressSource'){
          this.Dictions.address_source.map(item=>{
            if(row[column.property.split('.')[0]] && row[column.property.split('.')[0]][column.property.split('.')[1]]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='fwi.bopExplain'){
          this.Dictions.bop_explain.map(item=>{
            if(row[column.property.split('.')[0]] && row[column.property.split('.')[0]][column.property.split('.')[1]]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='fwi.ownerSex'){
          this.Dictions.gender.map(item=>{
            if(row[column.property.split('.')[0]] && row[column.property.split('.')[0]][column.property.split('.')[1]]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='pFirstorderDate' || column.property =='pOpenningDate' || column.property =='pGraduationDate'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd");
        }
        else if(column.property == 'contract.pCgProtocolDateE'){
          if(row[column.property.split('.')[0]] && row[column.property.split('.')[0]][column.property.split('.')[1]])
            txt = new Date(row[column.property]).format("yyyy-MM-dd");
        }
        return txt;
      },
      view(ind,row){
        this.gotoUrl('/frame/terminal/customerDbDetail/'+row.pUid+'/zero')
      },
      downLoad(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        delete data.pagingQuery;
        thiz.$tupHttp(thiz,'user/export/v2','POST',data).then(res=>{
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
      showTransfer(ind,row){
        this.dialogVisible = true;
        this.approveForm.oldClientId = row.pUid
      },
      updateContract(ind,row){
        this.contractDialogVisible = true;
        this.contractForm = row.contract ? row.contract:{}
        this.contractForm.pCustomerid = row.pUid;
        if(this.contractForm.pCoverPhoto){
          this.pic1 = [{url:this.contractForm.pCoverPhoto}]
        }
        if(this.contractForm.pSignPhoto){
          this.pic2 = [{url:this.contractForm.pSignPhoto}]
        }
      },
      updateFwi(ind,row){
        this.fwiDialogVisible = true;
        this.fwiForm = row.fwi ? row.fwi:{}
        this.fwiForm.clientId = row.pUid;
        if(row.fwi.photo){
          this.pics.push({
            url :row.fwi.photo
          })
        }
        if(row.fwi.photo2){
          this.pics.push({
            url :row.fwi.photo2
          })
        }
      },
      saveContract(){
        let thiz = this;
        this.loading = true;
        thiz.$tupHttp(thiz,'user/updateClientContract','POST',this.contractForm).then(res=>{
          thiz.loadData()
          thiz.contractForm = {};
          thiz.loading = false;
          thiz.contractDialogVisible = false;
        },res=>{
          thiz.loading = false;
        }) 
      }, 
      saveFwi(){
        let thiz = this;
        this.loading = true;
        thiz.$tupHttp(thiz,'user/updateClientFwi','POST',this.fwiForm).then(res=>{
          thiz.loadData()
          thiz.fwiForm = {};
          thiz.pics = [];
          thiz.loading = false;
          thiz.fwiDialogVisible = false;
        },res=>{
          thiz.loading = false;
        }) 
      }, 
      transfer(ind,row){
        let thiz = this;
        this.loading = true;
        thiz.$tupHttp(thiz,'user/transfer?from='+this.approveForm.oldClientId+'&to='+this.approveForm.newClientId,'GET').then(res=>{
          thiz.loadData()
          thiz.approveForm = {
            newClientId:'',
            oldClientId:''
          };
          thiz.loading = false;
          thiz.dialogVisible = false;
        },res=>{
          thiz.loading = false;
        }) 
      }, 
      saveItem(ind,row){
        let thiz = this;
        this.loading = true;
        let pAllowBusiness = row.pAllowBusiness ? 1:0;
        thiz.$tupHttp(thiz,'user/updateTradeStatus?clientId='+row.pUid+'&tradeStatus='+pAllowBusiness,'GET').then(res=>{
          thiz.loadData()
          thiz.loading = false;
        },res=>{
          thiz.loading = false;
        }) 
      },  
      resetPass(index, row) {
        let thiz = this;        
        this.$confirm('此操作将重置密码, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          thiz.loading = true;
          thiz.$tupHttp(thiz,'user/resetPassword?clientId='+row.pUid,'GET').then(res=>{
            thiz.loading = false;
            thiz.$notify.success({
              title: '成功提示',
              message: '重置密码成功'
            });
          },res=>{
            thiz.loading = false;
          }) 
        }).catch(() => {    
          thiz.loading = false;  
        });
      },
      detail(index, row) {
        this.gotoUrl('/frame/terminal/customerInfo/'+row.id)
      },
      loadData(isSearch){
        let thiz = this;
        thiz.tableLoading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        thiz.$tupHttp(thiz,'user/list/v2','POST',thiz.searchForm).then(res=>{
          thiz.tableData = res.body.models;
          thiz.total = res.body.pageInfo.total
          thiz.tableLoading = false;
        },res=>{
          thiz.tableLoading = false;
        })
      },
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData();
      },
      handleSizeChange(val) {
        this.searchForm.pagingQuery.pageSize = val;
        this.loadData();
      },
      loadDictions(){
        let thiz = this;
        let params = ["outlet_property","oos_code","distributor_status","outlet_status","grade_type","outlet_property2","visualize_grade","graduation_reason","msg_source","outlet_show","location","address_source","gender","bop_explain"];
        this.$baseData.getDicts(this,params,function(data){
          thiz.Dictions = data;
        });
      },
      getFMonth(){
        let thiz = this;   
        let today = new Date();     
        this.$tupHttp(this,'monForFinancing/selectByMonth?date='+today.format("yyyy-MM-dd"),'GET').then(res=>{
          if(res.body.model){
            thiz.fMonth = res.body.model.financingMonth
          }
        })
      }
    },
    mounted(){
      this.getFMonth();
      this.loadDictions();
      this.$util.onKeyCode(this,'loadData',[true])
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
