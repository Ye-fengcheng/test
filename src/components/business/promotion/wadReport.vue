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
            <tup-arae-select v-model="searchForm.provinceObject"></tup-arae-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="专卖店编号">
            <el-input v-model="searchForm.condition.clientId" size="mini" placeholder="专卖店编号"></el-input>
          </el-form-item>
        </el-col>
        
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="年">
            <el-select v-model="searchForm.condition.year" size="mini" clearable filterable  placeholder="请选择">
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
            <el-select v-model="searchForm.condition.month" size="mini" clearable filterable  placeholder="请选择">
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
          <el-form-item label="周">
            <el-select v-model="searchForm.condition.week" size="mini" clearable filterable  placeholder="请选择">
              <el-option
                v-for="item in weeks"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">          
          <el-form-item label="专卖店状态">
            <el-select v-model="searchForm.condition.storeStatus" size="mini" clearable filterable  placeholder="请选择">
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
          <el-form-item label="报表类型">
            <el-select v-model="searchForm.condition.reportType" size="mini" filterable  placeholder="请选择">
              <el-option label="周报" value="1"></el-option>
              <el-option label="月报" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="loadData(true)">查询</el-button>
        <el-button icon="el-icon-refresh" type="primary" size="mini" @click="resetForm">重置</el-button>
        <el-button type="primary" @click="downLoad" :loading="loading" icon="el-icon-download" size="mini">导出查询数据</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      @selection-change="handleSelectionChange"
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
        prop="reportType"
        :formatter="formatter"
        label="报表类型"
        sortable>
      </el-table-column>
      <el-table-column
        prop="storeStatus"
        :formatter="formatter"
        label="专卖店状态">
      </el-table-column>
      <el-table-column
        prop="regionName"
        label="区域">
      </el-table-column>
      <el-table-column
        prop="provinceName"
        label="省办">
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
    </el-table>
    <div style="text-align: right;margin-top:15px;">
      <el-pagination
        @current-change="handleCurrentChange"
        background
        :current-page="searchForm.pagingQuery.pageIndex"
        :page-size="20"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        loading:false,
        years:[],
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
        weeks:[],
        currentPage:1,
        tableLoading:false,
        total:0,
        monthTotal:0,
        Dictions:{
          weekly_report_status:[],
          outlet_status:[]
        },//本页面使用的所有字典
        searchForm:{
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
        tableData: [
        ]
      }
    },
    watch:{
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
      }
    },
    methods: {
      resetForm(){  
        this.searchForm = {
          provinceObject:[],
          areaObject:[],
          sProvince:[],
          sRegion:[],
          condition:{
            provinceCodes:[],
            sRegion:[],
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
      formatter(row, column) {
        let txt = ''
        if(column.property =='reportType'){
          if(row[column.property]=='1'){
            txt = '周报'
          }         
          else{
            txt ='月报'
          }
        }
        else if(column.property =='storeStatus'){
          this.Dictions.outlet_status.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        return txt;
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
      },
      downLoad(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        delete data.pagingQuery;
        thiz.$tupHttp(thiz,'report/exportUnFinishedList','POST',data).then(res=>{
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
        thiz.$tupHttp(thiz,'report/getUnFinishedList','POST',thiz.searchForm).then(res=>{
          thiz.tableData = res.body.models;
          thiz.total = res.body.pageInfo ? res.body.pageInfo.total:0
          thiz.tableLoading = false;
        },res=>{
          thiz.tableLoading = false;
        })
      },
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData();
      },
      loadDictions(){
        let thiz = this;
        let params = ["outlet_status","weekly_report_status"];
        this.$baseData.getDicts(this,params,function(data){
          thiz.Dictions = data;
        });
      }
    },
    mounted(){
      this.initData();
      this.loadData();
      this.$util.onKeyCode(this,'loadData',[true])
      this.loadDictions();
      for(let i=1;i<54;i++){
        this.weeks.push({
          value: i,
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

