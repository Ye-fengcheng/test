<template>
  <div>
    <el-form :model="model" ref="modelForm" style="width:98%" label-width="130px">
      <el-row :gutter="5">        
        <el-col :span="8">
          <el-form-item label="财务周">
            <el-date-picker
              v-model="model.finYear"
              style="width:48%"
              type="year"
              size="mini"
              placeholder="选择年">
            </el-date-picker>
            <el-select v-model="model.finWeek" style="width:48%" size="mini" clearable filterable  placeholder="选择周">
              <el-option
                v-for="item in weeks"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="12">
          <el-form-item label="开始填写日期"  prop="reportStartDay">
            <el-select v-model="model.reportStartDay" disabled placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开始填写时间" prop="reportStart">
            <el-time-select
              v-model="reportStart"
              :picker-options="{
                start: '00:00',
                step: '00:05',
                end: '23:45'
              }"
              placeholder="选择时间">
            </el-time-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="结束填写日期"  prop="reportEndDay">
            <el-select v-model="model.reportEndDay" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束填写时间" prop="reportEnd">
            <el-time-select
              v-model="reportEnd"
              :picker-options="{
                start: '00:00',
                step: '00:05',
                end: '23:45'
              }"
              placeholder="选择时间">
            </el-time-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="12">
          <el-form-item label="审核结束日期"  prop="auditDay">
            <el-select v-model="model.auditDay" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="审核结束时间" prop="audit">
            <el-time-select
              v-model="audit"
              :picker-options="{
                start: '00:00',
                step: '00:05',
                end: '23:45'
              }"
              placeholder="选择时间">
            </el-time-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="commit" :loading="loading" type="primary">提交</el-button>
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
      "searchForm.provinceObject":function(val){
        let datas = [];
        val.map(item=>{
          if(item.code !='999')
            datas.push(item.code)
        })
        this.searchForm.condition.provinceCodes = datas;
      },
      "monthForm.provinceObject":function(val){
        let datas = [];
        val.map(item=>{
          if(item.code !='999')
            datas.push(item.code)
        })
        this.monthForm.condition.provinceCodes = datas;
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
      resetForm(){
        this.searchForm = {
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
        }
      },
      resetFormMonth(){
        this.monthForm = {
          provinceObject:[],
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
        if(this.activeName == 'week'){
          data = this.multipleSelection;
        }
        else if(this.activeName == 'month'){
          data = this.multipleSelectionMonth;
        }
        this.$confirm('是否确认批量拒绝操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          thiz.$tupHttp(thiz,'report/batchReject','POST',data).then(res=>{
            thiz.loading = false;
            if(thiz.activeName == 'week'){
              thiz.loadData();
            }
            else{
              thiz.loadMonthData();
            }
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
        if(this.activeName == 'week'){
          data = this.multipleSelection;
        }
        else if(this.activeName == 'month'){
          data = this.multipleSelectionMonth;
        }
        this.$confirm('是否确认批量审批操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          thiz.$tupHttp(thiz,'report/batchConfirm','POST',data).then(res=>{
            thiz.loading = false;
            if(thiz.activeName == 'week'){
              thiz.loadData();
            }
            else{
              thiz.loadMonthData();
            }
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
      initData(){
        let thiz = this;
        this.years =[];
        let currentYear = (new Date()).getFullYear();
        for(let i=currentYear;i>=parseInt(currentYear-20);i--){
          this.years.push({
            value:i,
            lable:i
          })
        }
        //获取周报填写时间设置
        thiz.$tupHttp(thiz,'report/loadSetting','POST',thiz.setForm).then(res=>{
          if(!!res.body.model) {
            thiz.model = res.body.model;
            thiz.audit = thiz.model.auditHour + ":" + thiz.model.auditMinute;
            thiz.reportEnd = thiz.model.reportEndHour + ":" +  thiz.model.reportEndMinute;
            thiz.reportStart = thiz.model.reportStartHour + ":" + thiz.model.reportStartMinute;
          }
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
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        thiz.$tupHttp(thiz,'report/getList','POST',thiz.searchForm).then(res=>{
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
        this.searchForm.pagingQuery.pageIndex = val;
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
      this.initData();
      this.loadDictions();
      this.$util.onKeyCode(this,'loadData',[true])
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

