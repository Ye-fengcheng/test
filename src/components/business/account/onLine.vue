<template>
  <div>
    <el-form  :model="searchForm" label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="地区">            
            <tup-arae-select v-model="searchForm.provinceObject"  ></tup-arae-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">    
          <el-form-item  label="专卖店编号">
            <el-input v-model="searchForm.clientId" size="mini" placeholder="专卖店编号"></el-input>
          </el-form-item> 
        </el-col>
        <el-col :span="8">
          <el-form-item label="充值渠道">
            <el-select v-model="searchForm.bank" size="mini" clearable filterable  placeholder="请选择">
              <el-option
                v-for="item in Dictions.bank"
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
          <el-form-item label="支付状态">
            <el-select v-model="searchForm.payStatus" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="未付款" value="0"></el-option>
              <el-option label="已付款" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item  label="专卖店名称">
            <el-input v-model="searchForm.organName" size="mini" placeholder="专卖店名称"></el-input>
          </el-form-item> 
        </el-col>
        <el-col :span="8">
          <el-form-item  label="支付流水号">
            <el-input v-model="searchForm.billNo" size="mini" placeholder="支付流水号"></el-input>
          </el-form-item> 
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="交易时间">
           <el-date-picker
              v-model="searchForm.date"
              type="daterange"
              size="mini"
              range-separator="-"
              start-placeholder="开始日期"
              :default-time="['00:00:00', '23:59:59']"
              end-placeholder="结束日期">
            </el-date-picker>
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
        prop="billNo"
        label="银行流水号"
        width="130">
      </el-table-column>
      <el-table-column
        prop="creatorId"
        label="专卖店编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="creator"
        label="专卖店名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="amount"
        label="付款金额"
        width="100">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.amount/100,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="fee"
        label="手续费"
        width="150">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.fee/100,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="balance"
        label="付款货款金额">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.balance/100,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="deposit"
        label="付款保证金金额">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.deposit/100,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="bank"
        :formatter="formatter"
        label="充值渠道">
      </el-table-column>
      <el-table-column
        prop="supplement"
        label="补单人">
      </el-table-column>      
      <el-table-column
        prop="createTime"
        :formatter="formatter"
        width="100"
        label="交易时间">
      </el-table-column>
      <el-table-column
        prop="payStatus"
        :formatter="formatter"
        label="状态">
      </el-table-column>
      <el-table-column
        prop="reason"
        label="失败原因">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button v-if="scope.row.payStatus == 0" @click="budan(scope.$index,scope.row)" :loading="loading" type="text" size="small">申请补单</el-button>
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
  </div>
</template>

<script>
  export default {
    data() {
      return {
        loading:false,
        currentPage:1,
        tableLoading:false,
        total:0,
        Dictions:{
          bank:[],
          pay_status:[]
        },
        searchForm:{
          provinceObject:[],
          citprovincialoffices:[],
          date:'',
          organName:'',
          billNo:'',
          startTime:'',
          endTime:'',
          bank:'',
          clientId:'',
          payStatus:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:50
          }
        },
        tableData: [
        ]
      }
    },
    watch:{
      'searchForm.date':function(val){
        if(!val){
          this.searchForm.startTime = '';
          this.searchForm.endTime = '';
        }
        else{
          this.searchForm.startTime = val[0];
          this.searchForm.endTime = val[1];
        }
      },
      "searchForm.provinceObject":function(val){
        let datas = [];
        val.map(item=>{
          if(item.code !='999')
            datas.push(item.code)
        })
        this.searchForm.citprovincialoffices = datas;
      }
    },
    methods: {
      resetForm(){
        this.searchForm = {
          provinceObject:[],
          citprovincialoffices:[],
          date:'',
          organName:'',
          billNo:'',
          startTime:'',
          endTime:'',
          bank:'',
          clientId:'',
          payStatus:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:this.searchForm.pagingQuery.pageSize
          }
        }
      },
      budan(index, row) {
        let thiz = this;
        thiz.loading = true;
        thiz.$tupHttp(thiz,'account/charge/budan/'+row.id,'GET').then(res=>{
          thiz.loading = false;
          thiz.$notify.info({
            title: '提示',
            message: res.body.message
          });
          thiz.loadData()
        },res=>{
          thiz.loading = false;
        })
      }, 
      formatter(row, column) {
        let txt = ''
        if(column.property =='bank'){
          this.Dictions.bank.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='payStatus'){
          this.Dictions.pay_status.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='createTime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss");
        }
        return txt;
      },
      downLoad(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        delete data.pagingQuery;
        thiz.$tupHttp(thiz,'account/charge/online/export/v1','POST',data).then(res=>{
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
        if(new Date(thiz.searchForm.endTime).diff(new Date(thiz.searchForm.startTime)) > 92 || !thiz.searchForm.startTime){
          thiz.$notify.error({
            title: '错误提示',
            message: '交易时间不能超过92天或者为空'
          });
          return ;
        }
        thiz.tableLoading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        thiz.$tupHttp(thiz,'account/charge/online/list/v1','POST',thiz.searchForm).then(res=>{
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
      handleSizeChange(val) {
        this.searchForm.pagingQuery.pageSize = val;
        this.loadData();
      },
      getFMonth(){
        let thiz = this;   
        let today = new Date();     
        this.$tupHttp(this,'monForFinancing/selectByMonth?date='+today.format("yyyy-MM-dd"),'GET').then(res=>{
          if(res.body.model){
            thiz.fMonth = [new Date(res.body.model.startDate).format("yyyy-MM-dd"),new Date(res.body.model.endDate).format("yyyy-MM-dd")]
            thiz.searchForm.date = thiz.fMonth
          }
        })
      },
      loadDictions(){
        let thiz = this;
        let params = ["bank","pay_status"];
        this.$baseData.getDicts(this,params,function(data){
          thiz.Dictions = data;
        });
      }
    },
    mounted(){
      this.loadDictions()
      //this.loadData();
      this.getFMonth()
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
