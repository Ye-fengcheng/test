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
            <el-input v-model="searchForm.sDbStr" size="mini"  placeholder="分销商编号"></el-input>
          </el-form-item>          
        </el-col>        
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">          
          <el-form-item label="专卖店编号">
            <el-input v-model="searchForm.clientId" size="mini" placeholder="专卖店编号"></el-input>
          </el-form-item>
        </el-col>
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
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" size="mini" filterable  placeholder="请选择">
              <el-option label="待审核" :value="2"></el-option>
              <el-option label="审核中" :value="0"></el-option>
              <el-option label="已驳回" :value="-1"></el-option>
              <el-option label="已成功" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="类型">
            <el-select v-model="searchForm.source" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="客户发起" :value="1"></el-option>
              <el-option label="RCD发起" :value="0"></el-option>
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
        prop="citregionoffice"
        label="区域"
        width="80">
      </el-table-column>
      <el-table-column
        prop="citprovincialoffice"
        label="省办"
        width="80">
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
        prop="citparentno"
        label="分销商编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="citparent"
        label="分销商名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="auditStatus"
        label="申请状态"
        :formatter="formatter"
        width="100">
      </el-table-column>
      <el-table-column
        prop="source"
        label="类型"
        width="150">
        <template slot-scope="scope"> 
          {{scope.row.source == 1 ? '客户发起':'RCD发起'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="发起时间"
        :formatter="formatter"
        width="150">
      </el-table-column> 
      <el-table-column
        prop="remark"
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="approve(scope.$index,scope.row)" v-show="status == 2" type="text" size="small">审核</el-button>
          <el-button @click="detail(scope.$index,scope.row)" v-show="status != 2" type="text" size="small">查看详情</el-button>
        </template>        
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
          date:'',
          startTime:'',
          endTime:'',
          clientId:'',
          sDbStr:'',
          status:2,
          source:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:20
          }
        },
        tableData: [
        ],
        status:2,
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
          date:'',
          startTime:'',
          endTime:'',
          clientId:'',
          sDbStr:'',
          status:2,
          source:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:20
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
      downLoad(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        thiz.$tupHttp(thiz,'flow/graduation/export','POST',data,{Accept: '*/*'},'',true).then(res=>{
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
      approve(index, row) {
        this.gotoUrl('/frame/customerApprove/closeApproveDetail/'+row.id)
      },
      detail(index, row) {
        this.gotoUrl('/frame/customerApprove/closeDetail/'+row.id+'/other')
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
        let url = 'flow/graduation/tasks'
        if(thiz.searchForm.status != 2){
          url = 'flow/graduation/history'
        }
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
      }
    },
    mounted(){
      this.loadDictions();
      this.loadData()
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
