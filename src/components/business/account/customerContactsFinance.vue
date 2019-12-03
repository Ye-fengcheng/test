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
          <el-form-item  label="专卖店编号">
            <el-input v-model="searchForm.clientId" size="mini" placeholder="专卖店编号"></el-input>
          </el-form-item> 
        </el-col>
        
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="财务审核时间">
           <el-date-picker
              v-model="searchForm.financeDate"
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
          <el-form-item label="流水类型">
            <el-select v-model="searchForm.billTypes" size="mini" multiple placeholder="请选择">
              <el-option
                v-for="item in Dictions.bill_type"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">    
          <el-form-item label="充值类型">
            <el-select v-model="searchForm.chargeTypes" size="mini" multiple placeholder="请选择">
              <el-option
                v-for="item in Dictions.charge_type"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue">
              </el-option>
            </el-select>
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
        label="流水号"
        width="120">
      </el-table-column>      
      <el-table-column
        prop="bizNo"
        label="单据编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="sum"
        label="交易金额"
        width="120">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.sum/100,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="clientId"
        label="专卖店编号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="client"
        label="客户名称"
        width="120">
      </el-table-column>     
      <el-table-column
        prop="chargeTypeAccounting"
        label="充值类型的会计科目"
        width="180">
      </el-table-column>
      <el-table-column
        prop="chargeTypeName"
        label="充值类型名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="chargeType"
        width="120"
        label="充值类型编码">
      </el-table-column>
      <el-table-column
        prop="createTime"
        :formatter="formatter"
        label="财务审核时间"
        sortable
        width="150">
      </el-table-column>
      <el-table-column
        prop="billType"
        :formatter="formatter"
        label="流水类型">
      </el-table-column>      
      <el-table-column
        prop="remark"
        label="备注">
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
          account_type:[],
          bank:[],
          charge_type:[],
          bill_type:[]
        },
        searchForm:{
          provinceObject:[],
          areaObject:[],
          sRegion:[],
          sProvince:[],
          bank:'',
          date:'',
          billNo:'',
          startTime:'',
          endTime:'',
          financeDate:'',
          auditStartTime:'',
          auditEndTime:'',
          action:'',
          clientId:'',
          chargeTypes:[],
          billTypes:[],
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
      'searchForm.financeDate':function(val){
        if(!val){
          this.searchForm.auditStartTime = '';
          this.searchForm.auditEndTime = '';
        }
        else{
          this.searchForm.auditStartTime = val[0];
          this.searchForm.auditEndTime = val[1];
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
      }
    },
    methods: {
      formatter(row, column) {
        let txt = ''
        if(column.property =='type'){
          this.Dictions.account_type.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='createTime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss");
        }
        else if(column.property =='billType'){
          this.Dictions.bill_type.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='chargeType'){
          this.Dictions.charge_type.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        
        return txt;
      },
      resetForm(){
        this.searchForm = {
          provinceObject:[],
          areaObject:[],
          sRegion:[],
          sProvince:[],
          bank:'',
          date:'',
          billNo:'',
          startTime:'',
          endTime:'',
          financeDate:'',
          auditStartTime:'',
          auditEndTime:'',
          action:'',
          clientId:'',
          chargeTypes:[],
          billTypes:[],
          pagingQuery:{
            pageIndex:1,
            pageSize:this.searchForm.pagingQuery.pageSize
          }
        }
      },
      downLoad(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        delete data.pagingQuery;

        thiz.$tupHttp(thiz,'account/cash/export/v2','POST',data).then(res=>{
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
        if(new Date(thiz.searchForm.auditEndTime).diff(new Date(thiz.searchForm.auditStartTime)) > 92 || !thiz.searchForm.auditStartTime){
          thiz.$notify.error({
            title: '错误提示',
            message: '财务审核时间不能超过92天或者为空'
          });
          return ;
        }
        thiz.tableLoading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        thiz.$tupHttp(thiz,'account/cash/list/v2','POST',thiz.searchForm).then(res=>{
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
        let params = ["account_type","bank","charge_type","bill_type"];
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
            thiz.searchForm.financeDate = thiz.fMonth          
          }
        })
      }
    },
    mounted(){
      //this.getFMonth();
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
