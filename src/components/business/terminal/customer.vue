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
          <el-form-item label="专卖店编号">
            <el-input v-model="searchForm.organId" size="mini" placeholder="专卖店编号"></el-input>
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
          <el-form-item label="上级分销商编号">
            <el-input v-model="searchForm.sDbStr" size="mini" placeholder="上级分销商编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="DM工号">
            <el-input v-model="searchForm.dm" size="mini" placeholder="DM工号"></el-input>
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
          <el-form-item label="首订日期">
            <el-date-picker
              style="width:100%"
              v-model="searchForm.firstorderDate"
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
      </el-row>
      <el-row :gutter="5">
        <!-- <el-col :span="8">
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
        </el-col> -->
        <el-col :span="8">
          <el-form-item label="有效OIO">
            <el-select v-model="searchForm.effectiveOIO" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态">
            <el-select v-model="searchForm.outletStatuses" size="mini" multiple clearable filterable  placeholder="请选择">
              <el-option
                v-for="item in Dictions.outlet_status"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col> 
        <el-col :span="8">
          <el-form-item label="专卖店类型">
            <el-select v-model="searchForm.clientTypeList" size="mini" multiple placeholder="请选择">
              <el-option
                v-for="item in Dictions.outlet_property2"
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
          <el-form-item label="城市">
            <el-input v-model="searchForm.cityno" size="mini" placeholder="城市"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="OOS编号">
            <el-input v-model="searchForm.cnid" size="mini" placeholder="OOS编号"></el-input>
          </el-form-item>
        </el-col>        
        <el-col :span="8">
          <el-form-item label="专卖店性质">
            <el-select v-model="searchForm.citoutletproperty" size="mini" clearable filterable  placeholder="请选择">
              <el-option
                v-for="item in Dictions.outlet_property"
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
          <el-form-item label="专卖店地址">
            <el-input v-model="searchForm.address2" size="mini" placeholder="专卖店地址"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="专卖店名称">
            <el-input v-model="searchForm.organName" size="mini" placeholder="专卖店名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="档案编号">
            <el-input v-model="searchForm.archivesNo" size="mini" placeholder="档案编号"></el-input>
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
        label="分销商编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="pCitparent"
        label="分销商名称"
        width="120">
      </el-table-column>
      <el-table-column
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
      </el-table-column>
      <el-table-column
        prop="pDiscountvalue"
        label="门店折扣率"
        width="100">
      </el-table-column>
      <el-table-column
        prop="pGradeNo1"
        label="专卖店级别"
        width="100">
      </el-table-column>
      <el-table-column
        prop="pCitchanneltype"
        label="渠道类型"
        width="100">
      </el-table-column>
      <el-table-column
        prop="pOosCode"
        label="财务等级"
        :formatter="formatter"
        width="100">
      </el-table-column> 
      <el-table-column
        prop="pCitoutletproperty"
        :formatter="formatter"
        label="专卖店性质"
        width="100">
      </el-table-column>
      <!-- <el-table-column
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
        prop="pSampleCount"
        label="种子店数"
        width="100">
      </el-table-column> -->
      <el-table-column
        prop="pCitoutletproperty2"
        label="专卖店类型"
        :formatter="formatter"
        width="100">
      </el-table-column>
      <el-table-column
        prop="pOutletStatus"
        label="专卖店状态"
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
        prop="pRepresentUid"
        label="代表店编号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="pRepresentName"
        label="代表店名称"
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
        label="专卖店地址"
        width="100">
      </el-table-column>
      <el-table-column
        prop="pSpMobile"
        label="送货联系电话"
        width="100">
      </el-table-column>
      <el-table-column
        prop="pAddress1"
        label="发货地址"
        width="100">
      </el-table-column>       
      <el-table-column
        prop="contract.pDbProtocolNo"
        label="专卖店合同编号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="contract.pAuthorizeNo"
        label="专卖店合同授权书编号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="contract.pArchivesNo"
        label="档案编号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="contract.pCardNo1"
        label="法人身份证号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="contract.pOrganName"
        label="合同乙方客户名称"
        width="100">
      </el-table-column>
      <el-table-column
        prop="contract.pDbProtocolAddr"
        label="合同专卖店地址"
        width="100">
      </el-table-column>
      <el-table-column
        prop="contract.pDbProtocolDateS"
        label="合同有效开始日期"
        width="100">
        <template slot-scope="scope">
          {{scope.row.contract ? (scope.row.contract.pDbProtocolDateS ? new Date(scope.row.contract.pDbProtocolDateS).format("yyyy-MM-dd"):'' ):''}}
        </template>
      </el-table-column>
      <el-table-column
        prop="contract.pDbProtocolDateE"
        label="合同有效结束日期"
        width="100">
        <template slot-scope="scope">
          {{scope.row.contract ? (scope.row.contract.pDbProtocolDateE ? new Date(scope.row.contract.pDbProtocolDateE).format("yyyy-MM-dd"):'' ):''}}
        </template>
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
        prop="outletTransferRecord"
        label="是否转让店"
        width="100">
        <template slot-scope="scope">
          {{scope.row.outletTransferRecord ? '是':'否'}}
        </template>
      </el-table-column> 
      <el-table-column
        prop="outletTransferRecord.oldOutlet"
        label="旧店编号"
        width="100">
        <template slot-scope="scope">
          {{scope.row.outletTransferRecord ? scope.row.outletTransferRecord.oldOutlet : ''}}
        </template>
      </el-table-column> 
      <el-table-column
        fixed="right"
        label="操作"
        width="220">
        <template slot-scope="scope">
          <el-button @click="view(scope.$index,scope.row)" type="text" size="small">详情</el-button>
          <el-button @click="resetPass(scope.$index,scope.row)" :loading="loading" type="text" size="small">重置密码</el-button>
          <el-button @click="showTransfer(scope.$index,scope.row)" :loading="loading" type="text" size="small">转让</el-button>
          <!--<el-button @click="updateContract(scope.$index,scope.row)" :loading="loading" type="text" size="small">更改合同</el-button>
          <el-button @click="updateFwi(scope.$index,scope.row)" :loading="loading" type="text" size="small">更改fwi</el-button> -->          
          <el-button
            size="mini"          
            type="primary"
            :loading="loading"
            @click="saveItem(scope.$index, scope.row)">保存</el-button>
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
      <el-form  :model="approveForm" label-width="120px" >
        <el-form-item label="待转让专卖店编号">            
          {{approveForm.oldClientId}}
        </el-form-item>
        <el-form-item label="待转让专卖店名称">            
          {{approveForm.pOrganName2}}
        </el-form-item>
        <el-form-item label="预计转让日期">            
          {{approveForm.oTime}}
        </el-form-item>
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
            <el-form-item label="合同联系地址">
              <el-input v-model="contractForm.pDbProtocolAddr"  placeholder=""></el-input>
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
        <el-row :gutter="5">  
          <el-col :span="12" v-show="false">
            <el-form-item label="客户编号">
              <el-input v-model="contractForm.pCustomerid" :disabled="true"  placeholder=""></el-input>
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
    name:'keepAlive-terminal-customer',
    data() {
      return {
        dialogVisible:false,
        approveForm:{
          newClientId:'',
          oldClientId:''
        },
        pics:[],
        loading:false,
        currentPage:1,
        total:10,
        Dictions:{
          outlet_status:[],
          outlet_property:[],
          visualize_grade:[],
          graduation_reason:[],
          oos_code:[],
          msg_source:[],
          outlet_show:[],
          outlet_property2:[],
          location:[],
          grade_type:[],
          address_source:[],
          gender:[],
          bop_explain:[]
        },//本页面使用的所有字典
        searchForm:{
          effectiveDB:'',
          dm:'',
          address2:'',
          effectiveOIO:1,
          citorganlevel:6,
          cnid:'',
          sProvince:[],
          provinceObject:[],
          sRegion:[],
          areaObject:[],
          fs:'',
          organName:'',
          graduationDate:[],
          clientTypeList:[],
          challengeDate:[],
          firstorderDate:[],
          openningDate:[],
          organId:'',
          outletStatus:'',
          outletStatuses:[],
          cityno:'',
          citoutletproperty:'',
          archivesNo:'',
          sDbStr:'',
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
        pic2:[],
        fMonth:''
      }
    },
    watch:{
      $route:function(val){
        if(val.path == '/frame/terminal/customer'){
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
          effectiveDB:'',
          dm:'',
          address2:'',
          effectiveOIO:1,
          citorganlevel:6,
          clientTypeList:[],
          fs:'',
          organName:'',
          sProvince:[],
          provinceObject:[],
          sRegion:[],
          areaObject:[],
          graduationDate:[],
          challengeDate:[],
          firstorderDate:[],
          openningDate:[],
          organId:'',
          cityno:'',
          cnid:'',
          outletStatus:'',
          outletStatuses:[],
          citoutletproperty:'',
          sDbStr:'',
          archivesNo:'',
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
        else if(column.property =='pOosCode'){
          this.Dictions.oos_code.map(item=>{
            if(row[column.property]==item.dictValue){
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
      downLoad(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        delete data.pagingQuery;
        thiz.$tupHttp(thiz,'user/export/v1','POST',data).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '文件已加入下载队列，稍后前往 "基础设置-内容管理-导出下载" 下载文件'
          });
        },res=>{
          thiz.loading = false;
        })
      },
      view(ind,row){
        this.gotoUrl('/frame/terminal/customerDetail/'+row.pUid+'/zero')
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      },   
      showTransfer(ind,row){
        this.dialogVisible = true;
        this.approveForm.oldClientId = row.pUid
        this.approveForm.pOrganName2 = row.pOrganName2
        this.approveForm.oTime = new Date().format("yyyy-MM-dd")
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
        if(this.fwiForm.photo){
          this.pics.push({
            url :row.fwi.photo
          })
        }
        if(this.fwiForm.photo2){
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
        thiz.$tupHttp(thiz,'user/list/v1','POST',thiz.searchForm).then(res=>{
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
        let params = ["outlet_property","outlet_status","grade_type","outlet_property2","visualize_grade","graduation_reason","msg_source","outlet_show","location","address_source","gender","bop_explain","oos_code"];
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
      //this.loadData();
      this.getFMonth()
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
