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
          <el-form-item label="收款银行">
            <el-select v-model="searchForm.bank" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="建设银行" value="8796113174619"></el-option>
              <el-option label="工商银行" value="8796113076315"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">        
        <el-col :span="8">
          <el-form-item label="打款时间">
           <el-date-picker
              v-model="searchForm.date"
              style="width:100%"
              type="daterange"
              size="mini"
              range-separator="-"
              start-placeholder="开始日期"
              :default-time="['00:00:00', '23:59:59']"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">    
          <el-form-item  label="分销商编号">
            <el-input v-model="searchForm.citparentno" size="mini" placeholder="分销商编号"></el-input>
          </el-form-item> 
        </el-col>
        <el-col :span="8">
          <el-form-item label="付款金额范围">
            <el-input style="width:40%" v-model="searchForm.startNum" value="" size="mini">
            </el-input>
            至
            <el-input style="width:40%" v-model="searchForm.endNum" size="mini" >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="客户提交时间">
           <el-date-picker
              v-model="searchForm.commitDate"
              style="width:100%"
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
        prop="citregionoffice"
        label="区域"
        width="80">
      </el-table-column>
      <el-table-column
        prop="citprovincialoffice"
        label="省办"
        sortable
        width="100">
      </el-table-column>
      <el-table-column
        prop="citparentno"
        label="分销商编号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="citparent"
        label="分销商名称"
        width="100">
      </el-table-column>
      <el-table-column
        prop="creatorId"
        label="专卖店编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="creator"
        label="客户名"
        width="120">
      </el-table-column>
      <el-table-column
        prop="bank"
        label="收款银行"
        sortable
        width="150">
        <template slot-scope="scope"> 
          {{scope.row.bank == '8796113174619' ? '建设银行':'工商银行'}}
        </template>
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
        prop="balance"
        width="120"
        label="货款金额">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.balance/100,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="deposit"
        width="120"
        label="保证金金额">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.deposit/100,2)}}
        </template>
      </el-table-column>

      <el-table-column
        prop="auditor1"
        label="客服审核">
      </el-table-column>
      <el-table-column
        prop="auditor2"
        label="财务审核">
      </el-table-column>
      <!-- <el-table-column
        prop="createTime"   
        :formatter="formatter"
        width="150"     
        label="打款时间">
      </el-table-column> -->
      <el-table-column
        prop="createTime"
        :formatter="formatter"
        width="150"   
        label="客户提交时间">
      </el-table-column>
      <el-table-column
        prop="auditor1Time"
        :formatter="formatter"
        width="150"   
        label="客服审核时间">
      </el-table-column>
      <el-table-column
        prop="auditStatus"
        :formatter="formatter"
        label="状态">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="80">
        <template slot-scope="scope">
          <el-button @click="editItem(scope.$index,scope.row)" type="text" size="small">审核</el-button>
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
          audit_status:[]
        },
        searchForm:{
          provinceObject:[],
          citprovincialoffices:[],
          date:'',
          citparentno:'',
          amount:[],
          startNum:'',
          endNum:'',
          startTime:'',
          endTime:'',
          commitDate:'',
          commitStartTime:'',
          commitEndTime:'',
          bank:'',
          clientId:'',
          status:'8796113272923',
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
      'searchForm.commitDate':function(val){
        if(!val){
          this.searchForm.commitStartTime = '';
          this.searchForm.commitEndTime = '';
        }
        else{
          this.searchForm.commitStartTime = val[0];
          this.searchForm.commitEndTime = val[1];
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
          startTime:'',
          endTime:'',
          commitDate:'',
          commitStartTime:'',
          commitEndTime:'',
          bank:'',
          clientId:'',
          status:'8796113272923',
          pagingQuery:{
            pageIndex:1,
            pageSize:this.searchForm.pagingQuery.pageSize
          }
        }
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='auditStatus'){
          this.Dictions.audit_status.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='createTime' || column.property =='commitTime'  || column.property =='auditor1Time'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss");
        }
        else if(column.property =='bank'){
          this.Dictions.bank.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        return txt;
      },
      editItem(index, row) {
        this.gotoUrl('/frame/account/underLineDetail/'+row.id)
      },
      downLoad(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        delete data.pagingQuery;
        thiz.$tupHttp(thiz,'account/charge/offline/export/v1','POST',data).then(res=>{
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
        if(thiz.searchForm.startNum>0 || thiz.searchForm.endNum>1){
          thiz.searchForm.amount = [thiz.searchForm.startNum,thiz.searchForm.endNum]
        }
        thiz.$tupHttp(thiz,'account/charge/offline/list/v1','POST',thiz.searchForm).then(res=>{
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
      loadDictions(){
        let thiz = this;
        let params = ["audit_status","bank"];
        this.$baseData.getDicts(this,params,function(data){
          thiz.Dictions = data;
        });
      },
      getFMonth(){
        let thiz = this;   
        let today = new Date();     
        this.$tupHttp(this,'monForFinancing/selectByMonth?date='+today.format("yyyy-MM-dd"),'GET').then(res=>{
          if(res.body.model){
            thiz.fMonth = [new Date(res.body.model.startDate).format("yyyy-MM-dd"),new Date(res.body.model.endDate).format("yyyy-MM-dd")]
            thiz.searchForm.commitDate = thiz.fMonth
            setTimeout(function(){
              thiz.loadData();
            })            
          }
        })
      }
    },
    mounted(){
      this.loadDictions()
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
