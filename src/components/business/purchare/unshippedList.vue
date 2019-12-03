<template>
  <div v-loading="loading">
    <el-form  :model="searchForm"  label-width="120px" class="demo-form-inline">
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
          <el-form-item label="FMS订单号">
            <el-input v-model="searchForm.orderNo" size="mini" placeholder="FMS订单号"></el-input>
          </el-form-item>
        </el-col>   
        <el-col :span="8">
          <el-form-item label="订单创建日期">
            <el-date-picker
              style="width:100%"
              v-model="searchForm.date"
              size="mini"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">        
        <el-col :span="16">
          <el-form-item label="产品编号">
            <el-select
              style="width:100%"
              v-model="searchForm.pCodeList"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="请输入产品编号"
              :remote-method="remoteMethod"
              :loading="loading">
              <el-option
                v-for="item in productList"
                :key="item.pCode"
                :label="item.pCode+'('+item.pName+')'"
                :value="item.pCode">
              </el-option>
            </el-select>
            <!-- <el-input v-model="searchForm.pCodeObject" size="mini" placeholder="产品编号，多个适用,隔开"></el-input> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button  style="float:left;margin-left:10px;" type="primary" icon="el-icon-search" size="mini" @click="loadData(true)">查询</el-button>
        <el-button style="float:left;margin-left:10px;"  icon="el-icon-refresh" type="primary" size="mini" @click="resetForm">重置</el-button>
        <el-button style="float:left;margin-left:10px;" icon="el-icon-download" @click="downLoad" :loading="loading" size="mini" type="primary">导出</el-button>
      </el-form-item>
    </el-form>   
    <el-table
      :data="tableData"
      v-loading="tableLoading"
      style="width: 100%;"
      :height="tableHeight"
      highlight-current-row
      :default-sort = "{prop: 'date', order: 'descending'}">
      <el-table-column
        type="index"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="areaName"
        label="区域"
        sortable
        width="80">
      </el-table-column>
      <el-table-column
        prop="provinceName"
        label="省办"
        sortable
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
        width="150">
      </el-table-column>
      <el-table-column
        prop="clientPName"
        label="客户名"
        width="100">
      </el-table-column>
      <el-table-column
        prop="parentClientId"
        label="分销商编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="parentClientName"
        label="分销商名称"
        width="120">
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
        prop="fs"
        label="DFS工号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="fsName"
        label="DFS人员"
        width="100">
      </el-table-column>
      <el-table-column
        prop="orderNo"
        label="FMS订单号"
        width="120">
      </el-table-column>      
      <el-table-column
        prop="orderType"
        :formatter="formatter"
        label="订单类型"
        width="120">
      </el-table-column>
      <el-table-column
        prop="orderCreateTime"
        :formatter="formatter"
        label="订单创建日期"
        width="120">
      </el-table-column>
      <el-table-column
        prop="pCode"
        label="产品编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="pName"
        label="产品名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="kitCode"
        label="所属套装产品编号"
        width="140">
      </el-table-column>
      <el-table-column
        prop="kitName"
        label="所属套装产品名称"
        width="140">
      </el-table-column>     
      <el-table-column
        prop="unsdsoqs"
        label="未发货数量"
        width="100">
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top:15px;">
      <el-pagination
        @current-change="handleCurrentChange"
        background
        :current-page="searchForm.pagingQuery.pageIndex"
        :page-size="50"
        layout="prev ,pager, next"
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
        Dictions:{
          order_type:[]
        },//所有的字典
        areaData:{
          isarea:'1',
          data:[]
        },
        errorTableData:[],
        dialogVisible:false,
        tableHeight:parseInt(document.documentElement.clientHeight-160),
        loading:false,
        currentPage:1,
        total:0,
        productList:[],
        searchForm:{
          sDbStr:'',
          sProvince:[],
          provinceObject:[],
          sRegion:[],
          areaObject:[],
          clientId:'',
          date:'',
          orderCreateTimeBeginTime:'',
          orderCreateTimeEndTime :'',
          pCode:'',
          pCodeList:[],
          orderNo:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:50
          }
        },
        tableData: [
        ],
        tableLoading:false
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
          this.searchForm.orderCreateTimeBeginTime = '';
          this.searchForm.orderCreateTimeEndTime = '';
        }
        else{
          this.searchForm.orderCreateTimeBeginTime = val[0];
          this.searchForm.orderCreateTimeEndTime = val[1];
        }
      },
    },
    methods: {
      resetForm(){
        this.searchForm = {
          sDbStr:'',
          sProvince:[],
          provinceObject:[],
          sRegion:[],
          areaObject:[],
          clientId:'',
          date:'',
          orderCreateTimeBeginTime:'',
          orderCreateTimeEndTime :'',
          pCode:'',
          pCodeList:[],
          orderNo:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:this.searchForm.pagingQuery.pageSize
          }
        }
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='orderCreateTime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss");
        }
        else if(column.property =='orderType'){
          this.Dictions.order_type.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })  
        }
        return txt;
      },
      view(ind,row){
        this.gotoUrl('/frame/purchare/boxDetailQuery/'+row.id)
      },
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData();
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      },     
      remoteMethod(query){        
        if(query.length < 4){
          this.productList = []
          return;
        }
        let thiz = this;
        let searchParam = {
          condition:{
            pCode: query,
            pName: "",
            catalogCode:""
          },
          pagingQuery:{
            pageIndex:1,
            pageSize:10
          }
        }
        thiz.$baseData.productList(thiz,searchParam).then(res=>{
          thiz.productList  = res.body.models;
        })
      },
      downLoad(){        
        let thiz = this;
        if(new Date(thiz.searchForm.orderCreateTimeEndTime).diff(new Date(thiz.searchForm.orderCreateTimeBeginTime)) > 92 || !thiz.searchForm.orderCreateTimeBeginTime){
          thiz.$notify.error({
            title: '错误提示',
            message: '订单创建日期不能超过92天或者为空'
          });
          return ;
        }
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        delete data.pagingQuery;
        thiz.$tupHttp(thiz,'purchase/unshipped/export','POST',data,{},'/manage-psi/',false,'').then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '文件已加入下载队列，稍后前往 "基础设置-内容管理-导出下载" 下载文件'
          });
        },res=>{
          thiz.loading = false;
        })
      },
      loadData(isSearch){
        let thiz = this;
        if(new Date(thiz.searchForm.orderCreateTimeEndTime).diff(new Date(thiz.searchForm.orderCreateTimeBeginTime)) > 92 || !thiz.searchForm.orderCreateTimeBeginTime){
          thiz.$notify.error({
            title: '错误提示',
            message: '订单创建日期不能超过92天或者为空'
          });
          return ;
        }
        thiz.tableLoading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        thiz.$tupHttp(thiz,'purchase/unshipped/list','POST',thiz.searchForm,{},'/manage-psi/',false,'').then(res=>{
          thiz.tableData = res.body.models;
          let pageIndex = thiz.searchForm.pagingQuery.pageIndex 
          if(res.body.models && res.body.models.length > 0){
            thiz.total = (pageIndex-1)*50 + (res.body.models.length == 50 ? 51:res.body.models.length)
          }
          else{
            thiz.total = pageIndex*50
          }
          thiz.tableLoading = false;
        },res=>{
          thiz.tableLoading = false;
        })
      },
      loadDictions(){
        let thiz = this;
        let params = ["order_type"];
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
          }
        })
      }
    },
    mounted(){
      this.$util.onKeyCode(this,'loadData',[true])
      this.loadDictions();
      this.getFMonth();
      let currentYear = (new Date()).getFullYear()+1;
      for(let i=currentYear;i>=parseInt(currentYear-10);i--){
        this.years.push({
          value:i,
          lable:i
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
</style>
