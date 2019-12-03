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
          <el-form-item label="分销商编号">
            <el-input v-model="searchForm.dbNo" size="mini"  placeholder="分销商编号"></el-input>
          </el-form-item>          
        </el-col>        
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="日期">
            <el-date-picker
              v-model="searchForm.date"
              style="width:100%"
              size="mini"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="专卖店编号">
            <el-input v-model="searchForm.clientId" size="mini"  placeholder="专卖店编号"></el-input>
          </el-form-item>          
        </el-col> 
        <el-col :span="8">
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" size="mini" filterable  placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="审核中" :value="0"></el-option>
              <el-option label="已驳回" :value="-1"></el-option>
              <el-option label="已成功" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="loadData(true)">查询</el-button>
        <el-button  icon="el-icon-refresh" type="primary" size="mini" @click="resetForm">重置</el-button>
        <el-button icon="el-icon-download" :loading="loading" size="mini" @click="downLoad()" type="primary">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="tableLoading"
      style="width: 100%;"
      height="450"
      highlight-current-row
      @selection-change="handleSelectionChange">
      <el-table-column
        type="index"
        label="序号"
        width="50">
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
        prop="city"
        label="城市"
        width="100">
      </el-table-column>
      <el-table-column
        prop="clientName2"
        label="客户名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="clientId"
        label="专卖店编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="clientName"
        label="专卖店名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="dbNo"
        label="分销商编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="dbName"
        label="分销商名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="fs"
        label="DFS工号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="fsName"
        label="DFS姓名"
        width="100">
      </el-table-column>
      <el-table-column
        prop="dm"
        label="DM工号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="dmName"
        label="DM姓名"
        width="100">
      </el-table-column>
      <el-table-column
        prop="auditStatus"
        label="申请状态"
        :formatter="formatter"
        width="100">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="发起时间"
        :formatter="formatter"
        width="150">
      </el-table-column> 
      <el-table-column
        prop="step1"
        label="PCD/PM审批人"
        width="150">
        <template slot-scope="scope">
          {{scope.row.steps && scope.row.steps.length >= 1 ? scope.row.steps[0].auditorId+'-'+scope.row.steps[0].auditorName:''}}
        </template> 
      </el-table-column>
      <el-table-column
        prop="step1"
        label="PCD/PM审批时间"
        width="150">
        <template slot-scope="scope">
          {{scope.row.steps && scope.row.steps.length >= 1 ? new Date(scope.row.steps[0].createTime).format("yyyy-MM-dd hh:mm:ss"):''}}
        </template> 
      </el-table-column>
      <el-table-column
        prop="step1"
        label="PCD/PM审批备注"
        width="150">
        <template slot-scope="scope">
          {{scope.row.steps && scope.row.steps.length >= 1 ? scope.row.steps[0].comment:''}}
        </template> 
      </el-table-column>
      <el-table-column
        prop="step1"
        label="RCD/RM审批人"
        width="150">
        <template slot-scope="scope">
          {{scope.row.steps && scope.row.steps.length >= 2 ? scope.row.steps[1].auditorId+'-'+scope.row.steps[1].auditorName:''}}
        </template> 
      </el-table-column>
      <el-table-column
        prop="step1"
        label="RCD/RM审批时间"
        width="150">
        <template slot-scope="scope">
          {{scope.row.steps && scope.row.steps.length >= 2 ? new Date(scope.row.steps[1].createTime).format("yyyy-MM-dd hh:mm:ss"):''}}
        </template> 
      </el-table-column>
      <el-table-column
        prop="step1"
        label="RCD/RM审批备注"
        width="150">
        <template slot-scope="scope">
          {{scope.row.steps && scope.row.steps.length >= 2 ? scope.row.steps[1].comment:''}}
        </template> 
      </el-table-column>
      <el-table-column
        prop="step1"
        label="渠道审批人"
        width="150">
        <template slot-scope="scope">
          {{scope.row.steps && scope.row.steps.length >= 3 ? scope.row.steps[2].auditorId+'-'+scope.row.steps[2].auditorName:''}}
        </template> 
      </el-table-column>
      <el-table-column
        prop="step1"
        label="渠道审批时间"
        width="150">
        <template slot-scope="scope">
          {{scope.row.steps && scope.row.steps.length >= 3 ? new Date(scope.row.steps[2].createTime).format("yyyy-MM-dd hh:mm:ss"):''}}
        </template> 
      </el-table-column>
      <el-table-column
        prop="step1"
        label="渠道审批备注"
        width="150">
        <template slot-scope="scope">
          {{scope.row.steps && scope.row.steps.length >= 3 ? scope.row.steps[2].comment:''}}
        </template> 
      </el-table-column>
      <el-table-column
        prop="step1"
        label="客服审批人"
        width="150">
        <template slot-scope="scope">
          {{scope.row.steps && scope.row.steps.length >= 4 ? scope.row.steps[3].auditorId+'-'+scope.row.steps[3].auditorName:''}}
        </template> 
      </el-table-column>
      <el-table-column
        prop="step1"
        label="客服审批时间"
        width="150">
        <template slot-scope="scope">
          {{scope.row.steps && scope.row.steps.length >= 4 ? new Date(scope.row.steps[3].createTime).format("yyyy-MM-dd hh:mm:ss"):''}}
        </template> 
      </el-table-column>
      <el-table-column
        prop="step1"
        label="客服审批备注"
        width="150">
        <template slot-scope="scope">
          {{scope.row.steps && scope.row.steps.length >= 4 ? scope.row.steps[3].comment:''}}
        </template> 
      </el-table-column>
      <el-table-column
        prop="remark"
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="approve(scope.$index,scope.row)" type="text" size="small">代审核</el-button>
          <el-button @click="detail(scope.$index,scope.row)" type="text" size="small">查看详情</el-button>
        </template>        
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top:15px;">
      <el-pagination
        @current-change="handleCurrentChange"
        background
        :current-page="searchForm.pagingQuery.pageIndex"
        :page-size="50"
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
    name:'keepAlive-customerApprove-allCustomerOpeningApprove',
    data() {
      return {
        Dictions:{
          flow_audit_status:[]
        },//所有的字典
        multipleSelection:[],
        loading:false,
        dialogVisible:false,
        currentPage:1,
        total:0,
        tableLoading:false,
        searchForm:{   
          sProvince:[],
          provinceObject:[],
          sRegion:[],
          areaObject:[],
          status:'',
          date:'',
          startTime:'',
          endTime:'',
          clientId:'',
          dbNo:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:50
          }
        },
        status:2,
        tableData: [
        ]
      }
    },
    watch:{
      $route:function(val){
        if(val.path == '/frame/customerApprove/allCustomerOpeningApprove'){
          if(this.total > 0){
            //有请求过数据需要重新加载列表
            this.loadData()
          }
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
      'searchForm.date':function(val){
        if(!val){
          this.searchForm.startTime = '';
          this.searchForm.endTime = '';
        }
        else{
          this.searchForm.startTime = val[0];
          this.searchForm.endTime = val[1];
        }
      }
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
        this.searchForm.declarationIds = [];
        val.map(item=>{
          this.searchForm.declarationIds.push(item.id)
        })
      },
      resetForm(){
        this.searchForm = {
          sProvince:[],
          provinceObject:[],
          sRegion:[],
          areaObject:[],
          status:'',
          date:'',
          startTime:'',
          endTime:'',
          clientId:'',
          dbNo:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:50
          }
        }
      },
      saveData(){
        let thiz = this;
        thiz.loading = true;
        let data = [];
        this.multipleSelection.map(item=>{
          data.push({
            id:item.id,
            reason:this.comForm.reason,
            remark:this.comForm.remark,
            status:this.comForm.status
          })
        })
        thiz.$tupHttp(thiz,'declaration/updateDeclaration','POST',data).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '操作成功'
          });
          thiz.dialogVisible = false;
          thiz.loadData();
        },res=>{
          thiz.loading = false;
        })
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='auditStatus'){
          this.Dictions.flow_audit_status.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })  
        }
        else if(column.property =='createTime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd");
        }
        else if(column.property =='logisticsAuditTime' || column.property =='serviceAuditTime' || column.property =='seniorServiceAuditTime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss");
        }
        return txt;
      },
      approve(index, row) {
        this.gotoUrl('/frame/customerApprove/openingApproveDetail/'+row.applyInfoId+'/'+row.id)
      },
      downLoad(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        thiz.$tupHttp(thiz,'manage/openningStoreApplyToPC/export/v2','POST',data,{Accept: '*/*'},'',true).then(res=>{
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
        this.gotoUrl('/frame/customerApprove/openingDetail/'+row.applyInfoId+'/'+row.id+'/all')
      },
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData();
      },
      loadData(isSearch){
        let thiz = this;
        thiz.tableLoading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        let url = 'manage/openningStoreApplyToPC/queryList'
        this.$tupHttp(this,url,'POST',thiz.searchForm).then(res=>{
          thiz.status = thiz.searchForm.status
          thiz.tableData = res.body.models
          thiz.tableLoading = false;
          thiz.total = res.body.pageInfo.total ? res.body.pageInfo.total : 0;          
        },res=>{
          thiz.tableLoading = false;
        })
      },
      loadDictions(){
        let thiz = this;
        let params = ["flow_audit_status"];
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
            thiz.searchForm.date = thiz.fMonth
            setTimeout(function(){
              thiz.loadData(true)
            })            
          }
        })
      }
    },
    mounted(){
      this.loadDictions();
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
