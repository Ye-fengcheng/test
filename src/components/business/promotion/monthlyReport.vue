<template>
  <div>
    <el-form  :model="monthForm"  label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
         <el-col :span="8">
          <el-form-item label="区域">            
            <tup-arae-select type="area" size="mini" v-model="monthForm.areaObject"  ></tup-arae-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="省办">            
            <tup-arae-select v-model="monthForm.provinceObject"></tup-arae-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="专卖店编号">
            <el-input v-model="monthForm.condition.clientId" size="mini" placeholder="专卖店编号"></el-input>
          </el-form-item>
        </el-col>
        
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="报表状态">
            <el-select v-model="monthForm.condition.reportStatus" size="mini" clearable filterable  placeholder="请选择">
              <el-option
                v-for="item in Dictions.weekly_report_status"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">          
          <el-form-item label="FS">
            <el-input v-model="monthForm.condition.fs" size="mini" placeholder="FS"></el-input>
          </el-form-item>
        </el-col>        
        <el-col :span="8">
          <el-form-item label="DM">
            <el-input v-model="monthForm.condition.dm" size="mini" placeholder="DM"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="年">
            <el-select v-model="monthForm.condition.year" size="mini" clearable filterable  placeholder="请选择">
              <el-option
                v-for="item in years"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">   
          <el-form-item label="月">
            <el-select v-model="monthForm.condition.month" size="mini" clearable filterable  placeholder="请选择">
              <el-option
                v-for="item in months"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>     
        <el-col :span="8">          
          <el-form-item label="专卖店类型">
            <el-select v-model="monthForm.condition.storeType" size="mini" clearable filterable  placeholder="请选择">
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
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="loadMonthData(true)">查询</el-button>
        <el-button icon="el-icon-refresh" type="primary" size="mini" @click="resetFormMonth">重置</el-button>
        <el-button type="primary" @click="downLoadMonthData" :loading="loading" icon="el-icon-download" size="mini">导出</el-button>
        <el-button icon="el-icon-minus" :disabled="multipleSelectionMonth.length==0" size="mini" :loading="loading" @click="rejects" type="danger">批量拒绝</el-button>
        <el-button icon="el-icon-check" :disabled="multipleSelectionMonth.length==0" size="mini" :loading="loading" @click="approves" type="primary">批量审批</el-button>
      </el-form-item>
    </el-form>    
    <el-table
      :data="monthData"
      show-summary
      :summary-method="getSummariesMonth"
      @selection-change="handleSelectionChangeMonth"
      v-loading="tableLoading"
      style="width: 100%;"
      height="450"
      highlight-current-row
      :default-sort = "{prop: 'date', order: 'descending'}">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        type="index"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="clientId"
        label="客户ID"
        width="80">
      </el-table-column>
      <el-table-column
        prop="clientOrganName"
        label="专卖店名称"
        width="80">
      </el-table-column>
      <el-table-column
        prop="clientName"
        label="客户名称"
        width="80">
      </el-table-column>
      <el-table-column
        prop="reportStatus"
        :formatter="formatter"
        label="报表状态"
        sortable
        width="100">
      </el-table-column>
      <el-table-column
        prop="storeType"
        :formatter="formatter"
        label="专卖店类型"
        width="100">
      </el-table-column>
      <el-table-column
        prop="channelType"
        label="渠道类型"
        width="100">
      </el-table-column>   
      <el-table-column
        prop="regionName"
        label="区域"
        width="80">
      </el-table-column>
      <el-table-column
        prop="provinceName"
        label="省办"
        width="80">
      </el-table-column>
      <el-table-column
        prop="year"
        label="年"
        width="60">
      </el-table-column>
      <el-table-column
        prop="month"
        label="月"
        width="60">
      </el-table-column>
      <el-table-column
        prop="week"
        label="周"
        width="60">
      </el-table-column>
      <el-table-column
        prop="counterSaleAmts"
        label="专卖店/专柜销售额"
        width="100">
      </el-table-column>
      <el-table-column
        prop="lijiaSalesAmts"
        label="理家课堂销售额"
        width="100">
      </el-table-column>
      <el-table-column
        prop="grpbSalesAmts"
        label="团购销售额"
        width="100">
      </el-table-column>      
      <el-table-column
        prop="customisedSalesAmts"
        label="私人订制销售额"
        width="100">
      </el-table-column>      
      <el-table-column
        prop="othersSalesAmts"
        label="其他销售额"
        width="100">
      </el-table-column>
      <el-table-column
        prop="onlinesaleamt"
        label="线上销售额"
        width="100">
      </el-table-column>
      <el-table-column
        prop="totalSalesAmts"
        label="零售总额"
        width="100">
      </el-table-column>
      <el-table-column
        prop="naturalCustomerNo"
        label="自然入店顾客数"
        width="100">
      </el-table-column>
      <el-table-column
        prop="comebackCustomerNo"
        label="回店会员数"
        width="100">
      </el-table-column>
      <el-table-column
        prop="customisedCustomerNo"
        label="私人订制顾客数"
        width="100">
      </el-table-column>
      <el-table-column
        prop="lijiaCustomerNo"
        label="参加理家课堂顾客数"
        width="100">
      </el-table-column>
      <el-table-column
        prop="totalCustomerNo"
        label="顾客总数"
        width="100">
      </el-table-column>
      <el-table-column
        prop="lijiaPrsttTimes"
        label="理家课堂次数"
        width="100">
      </el-table-column>
      <el-table-column
        prop="imdtlyPrsttTimes"
        label="即时示范次数"
        width="100">
      </el-table-column>
      <el-table-column
        prop="totalPrsttTimes"
        label="主动销售活动次数"
        width="100">
      </el-table-column>
      <el-table-column
        prop="comOrderAmt"
        label="直接从公司下单"
        width="100">
      </el-table-column>
      <el-table-column
        prop="transferAmt"
        label="调度额"
        width="100">
      </el-table-column>
      <el-table-column
        prop="lijiaFulltimeConsutantNo"
        label="在职理家顾问数"
        width="100">
      </el-table-column>
      <el-table-column
        prop="totalOrderAmt"
        label="专卖店订货总额"
        width="100">
      </el-table-column>
      <el-table-column
        prop="managerNo"
        label="店长数量"
        width="100">
      </el-table-column>
      <el-table-column
        prop="isManager"
        label="是否店长"
        width="100">
        <template slot-scope="scope">
          {{scope.row.isManager == 1 ? '是':'否'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="managerName"
        label="店长姓名"
        width="100">
      </el-table-column>
      <el-table-column
        prop="managerType"
        label="店长身份"
        width="100">
      </el-table-column>
      <el-table-column
        prop="reportDesc"
        label="备注"
        width="100">
      </el-table-column>

      <el-table-column
        prop="decorationCharge"
        label="装修总费用"
        width="100">
      </el-table-column>
      <el-table-column
        prop="operationCharge"
        label="经营费用"
        width="100">
      </el-table-column>
      <el-table-column
        prop="laborCharge"
        label="人工支出"
        width="100">
      </el-table-column>
      <el-table-column
        prop="roomCharge"
        label="房租"
        width="100">
      </el-table-column>
      <el-table-column
        prop="lightWaterCharge"
        label="水电费"
        width="100">
      </el-table-column>
      <el-table-column
        prop="promoCharge"
        label="促销费"
        width="100">
      </el-table-column>
      <el-table-column
        prop="phoneCharge"
        label="电话费"
        width="100">
      </el-table-column>
      <el-table-column
        prop="logisticalCharge"
        label="运输费"
        width="100">
      </el-table-column>
      <el-table-column
        prop="taxCharge"
        label="税费"
        width="100">
      </el-table-column>
      <el-table-column
        prop="othersCharge"
        label="其他费用"
        width="100">
      </el-table-column>
      <el-table-column
        prop="psmCharge"
        label="PSM费用"
        width="100">
      </el-table-column>
      <el-table-column
        prop="warehouseCharge"
        label="仓库费用"
        width="100">
      </el-table-column>
      <el-table-column
        prop="hasWechat"
        label="店主是否开通微信"
        width="100">
        <template slot-scope="scope">
          {{scope.row.hasWechat == 1 ? '是':'否'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="wechatGrpNo"
        label="建立微信群数量"
        width="100">
      </el-table-column>
      <el-table-column
        prop="wechatMembersNo"
        label="加入微信群会员数量"
        width="150">
      </el-table-column>
      <el-table-column
        prop="waterPurifierSalesAmts"
        label="净水器销售数量"
        width="100">
      </el-table-column>
      <el-table-column
        prop="waterPurifierSalesAmount"
        label="净水器销售金额"
        width="100">
      </el-table-column>
      <el-table-column
        prop="slimBeautySetNo"
        label="纤巧超值套装销售数量（套）"
        width="100">
      </el-table-column>
      <el-table-column
        prop="slimBeautySetAmts"
        label="纤巧超值套装销售金额"
        width="100">
      </el-table-column>
      <el-table-column
        prop="sskitSaleNo"
        label="43件套销售数量（套）"
        width="100">
      </el-table-column>
      <el-table-column
        prop="sskitSaleAmts"
        label="43件套销售金额"
        width="100">
      </el-table-column>
      <el-table-column
        prop="wqpanSaleNo"
        label="5.7L锅销售数量（只）"
        width="100">
      </el-table-column>
      <el-table-column
        prop="wqpanSaleAmts"
        label="5.7L锅销售金额"
        width="100">
      </el-table-column>
      <el-table-column
        prop="slevelPanSaleNo"
        label="三层炒锅销售数量（只）"
        width="100">
      </el-table-column>
      <el-table-column
        prop="slevelPanSaleAmts"
        label="三层炒锅销售金额"
        width="100">
      </el-table-column>
      <el-table-column
        prop="cupSaleNo"
        label="水杯销售数量（只）"
        width="100">
      </el-table-column>
      <el-table-column
        prop="cupSaleAmount"
        label="水杯销售金额"
        width="100">
      </el-table-column>
      <el-table-column
        prop="thermosSaleNo"
        label="保温杯销售数量（只）"
        width="100">
      </el-table-column>
      <el-table-column
        prop="thermosSaleAmount"
        label="保温杯销售金额"
        width="100">
      </el-table-column>
      <el-table-column
        prop="wbmlCupSaleNo"
        label="500ML保温杯销售数量（只）"
        width="150">
      </el-table-column>
      <el-table-column
        prop="otherSaleAmts"
        label="其他产品销售金额"
        width="150">
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top:15px;">
      <el-pagination
        @current-change="handleMonthCurrentChange"
        background
        :current-page="monthForm.pagingQuery.pageIndex"
        :page-size="20"
        layout="total, prev, pager, next, jumper"
        :total="monthTotal">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        multipleSelection:[],
        multipleSelectionMonth:[],
        activeName:'week',
        loading:false,
        years:[],
        weeks:[],
        months:[
          {
            value: '1',
            label: '1'
          },
          {
            value: '2',
            label: '2'
          },
          {
            value: '3',
            label: '3'
          },
          {
            value: '4',
            label: '4'
          },
          {
            value: '5',
            label: '5'
          },
          {
            value: '6',
            label: '6'
          },
          {
            value: '7',
            label: '7'
          },
          {
            value: '8',
            label: '8'
          },
          {
            value: '9',
            label: '9'
          },
          {
            value: '10',
            label: '10'
          },
          {
            value: '11',
            label: '11'
          },
          {
            value: '12',
            label: '12'
          }
        ],
        currentPage:1,
        tableLoading:false,
        total:0,
        monthTotal:0,
        Dictions:{
          weekly_report_status:[],
          outlet_property2:[]
        },//本页面使用的所有字典
        searchForm:{
          provinceObject:[],
          condition:{
            provinceCodes:[],
            clientId:'',
            storeType:'',
            storeStatus:'',
            reportStatus:'',
            reportType:'1',
            year:'',
            month:'',
            week:'',
            fs:'',
            dm:''
          },          
          pagingQuery:{
            pageIndex:1,
            pageSize:20
          }
        },
        monthForm:{
          provinceObject:[],
          areaObject:[],
          sProvince:[],
          sRegion:[],
          condition:{
            provinceCodes:[],
            clientId:'',
            storeType:'',
            storeStatus:'',
            reportStatus:'',
            reportType:'2',
            year:'',
            month:'',
            week:'',
            fs:'',
            dm:''
          },          
          pagingQuery:{
            pageIndex:1,
            pageSize:20
          }
        },
        tableData: [
        ],
        weekSum:{},
        monthData: [
        ],
        monthSum:{},
        options: [
          {
            value: '2',
            label: '星期一'
          },
          {
            value: '3',
            label: '星期二'
          },
          {
            value: '4',
            label: '星期三'
          },
          {
            value: '5',
            label: '星期四'
          },
          {
            value: '6',
            label: '星期五'
          },
          {
            value: '7',
            label: '星期六'
          },
          {
            value: '1',
            label: '星期天'
          },
        ],
        setForm:{
          finYear:'',
          finWeek:''
        },
        model:{
          finYear:'',
          finWeek:'',
          auditDay:'',
          auditHour:'',
          auditMinute:'',
          createBy:'',
          createTime:'',// 创建时间 
          finWeek:'',//财务周 
          finYear:'',//财务年
          id:'',
          operator :'',
          reportEndDay:'' ,// 结束填报时间-天 
          reportEndHour:'',//结束填报时间-小时
          reportEndMinute:'',//结束填报时间-分
          reportStartDay:'',//开始填报时间-天
          reportStartHour:'',//开始填报时间-小时
          reportStartMinute:'',//开始填报时间-分
          updateBy:'',//更新人 
          updateTime:''//更新时间
        },
        audit:'',
        reportEnd:'',
        reportStart:''
      }
    },
    watch:{
      "model.finWeek":function(val){
        this.setForm.finYear = this.model.finYear
        this.setForm.finWeek = val
        if(this.setForm.finYear && this.setForm.finWeek){
          this.initData()
        }
      },
      "monthForm.areaObject":function(val){
        let datas = [];
        val.map(item=>{
          if(item.code !='999')
            datas.push(item.code)
        })
        this.monthForm.sRegion = datas;
      },
      "monthForm.provinceObject":function(val){
        let datas = [];
        val.map(item=>{
          if(item.code !='999')
            datas.push(item.code)
        })
        this.monthForm.sProvince = datas;
      },
      audit:function(val){
        let arr = val.split(":")
        this.model.auditHour = arr[0];
        this.model.auditMinute = arr[1];
      },
      reportStart:function(val){
        let arr = val.split(":")
        debugger
        this.model.reportStartHour = arr[0];
        this.model.reportStartMinute = arr[1];
      },
      reportEnd:function(val){
        let arr = val.split(":")
        this.model.reportEndHour = arr[0];
        this.model.reportEndMinute = arr[1];
      }
    },
    methods: {
      resetFormMonth(){
        this.monthForm = {
          provinceObject:[],
          areaObject:[],
          sProvince:[],
          sRegion:[],
          condition:{
            provinceCodes:[],
            clientId:'',
            storeType:'',
            storeStatus:'',
            reportStatus:'',
            reportType:'2',
            year:'',
            month:'',
            week:'',
            fs:'',
            dm:''
          },          
          pagingQuery:{
            pageIndex:1,
            pageSize:20
          }
        }
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='reportStatus'){
          this.Dictions.weekly_report_status.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='storeType'){
          this.Dictions.outlet_property2.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        return txt;
      },
      isIntNum(val){
        let regPos = /^\d+(\.\d+)?$/; //非负浮点数
        let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        if(regPos.test(val) || regNeg.test(val)){
          return true;
        }else{
          return false;
        }
      },
      getSummaries(param) {
        let thiz = this;
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计';
            return;
          }
          sums[index] = thiz.isIntNum(thiz.weekSum[column.property]) ? thiz.weekSum[column.property]:''
        });

        return sums;
      },
      getSummariesMonth(param) {
        let thiz = this;
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计';
            return;
          }
          sums[index] = thiz.isIntNum(thiz.monthSum[column.property]) ? thiz.monthSum[column.property]:''
        });

        return sums;
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(val);
      },
      handleSelectionChangeMonth(val) {
        this.multipleSelectionMonth = val;
        console.log(val);
      },
      rejects(){
        let thiz = this;
        thiz.loading = true;
        let data = [];        
        data = this.multipleSelectionMonth;
        this.$confirm('是否确认批量拒绝操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          thiz.$tupHttp(thiz,'report/batchReject','POST',data).then(res=>{
            thiz.loading = false;
            thiz.loadMonthData();
          },res=>{
            thiz.loading = false;
          }) 
        }).catch(() => {    
          thiz.loading = false;  
        });        
      },
      approves(){
        let thiz = this;
        thiz.loading = true;
        let data = [];        
        data = this.multipleSelectionMonth;
        this.$confirm('是否确认批量审批操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          thiz.$tupHttp(thiz,'report/batchConfirm','POST',data).then(res=>{
            thiz.loading = false;
            thiz.loadMonthData();
          },res=>{
            thiz.loading = false;
          }) 
        }).catch(() => {    
          thiz.loading = false;  
        });        
      },
      commit(){
        let thiz = this;
        thiz.loading = true;
        thiz.$tupHttp(thiz,'report/saveSetting','POST',thiz.model).then(res=>{
          thiz.loading = false;
          if(res.body.success){
            thiz.$notify.success({
              title: '提示',
              message: '操作成功'
            });
          }
          if(res.body.model){
            thiz.model.id = res.body.model.id
          }
        },res=>{
          thiz.loading = false;
        })
      },
      downLoad(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        delete data.pagingQuery;
        thiz.$tupHttp(thiz,'report/exportList','POST',data).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '文件已加入下载队列，稍后前往 "基础设置-内容管理-导出下载" 下载文件'
          });
        },res=>{
          thiz.loading = false;
        })
      },
      downLoadMonthData(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.monthForm);
        delete data.pagingQuery;
        thiz.$tupHttp(thiz,'report/exportList','POST',data).then(res=>{
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
      loadData(isSearch){
        let thiz = this;
        thiz.tableLoading = true;
        if(isSearch)
          thiz.monthForm.pagingQuery.pageIndex = 1;//重置为第一页
        thiz.$tupHttp(thiz,'report/getList','POST',thiz.monthForm).then(res=>{
          thiz.tableData = res.body.models;
          thiz.weekSum = res.body.extra;
          thiz.total = res.body.pageInfo ? res.body.pageInfo.total:0
          thiz.tableLoading = false;
        },res=>{
          thiz.tableLoading = false;
        })
      },
      loadMonthData(isSearch){
        let thiz = this;
        thiz.tableLoading = true;
        if(isSearch)
          thiz.monthForm.pagingQuery.pageIndex = 1;//重置为第一页
        thiz.$tupHttp(thiz,'report/getList','POST',thiz.monthForm).then(res=>{
          thiz.monthData = res.body.models;
          thiz.monthSum = res.body.extra;
          thiz.monthTotal = res.body.pageInfo ? res.body.pageInfo.total:0
          thiz.tableLoading = false;
        },res=>{
          thiz.tableLoading = false;
        })
      },
      handleCurrentChange(val) {
        this.monthForm.pagingQuery.pageIndex = val;
        this.loadData();
      },
      handleMonthCurrentChange(val) {
        this.monthForm.pagingQuery.pageIndex = val;
        this.loadMonthData();
      },
      loadDictions(){
        let thiz = this;
        let params = ["outlet_property2","weekly_report_status"];
        this.$baseData.getDicts(this,params,function(data){
          thiz.Dictions = data;
        });
      }
    },
    mounted(){
      this.loadMonthData();
      this.loadDictions();
      this.$util.onKeyCode(this,'loadData',[true])
      let currentYear = (new Date()).getFullYear();
      for(let i=currentYear;i>=parseInt(currentYear-20);i--){
        this.years.push({
          value:i,
          lable:i
        })
      }
      for(let i=1;i<54;i++){
        this.weeks.push({
          value: ''+i,
          label: i
        })
      }
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
.dialog-footer{
  margin-top: 10px;
  text-align: center;
}
</style>

