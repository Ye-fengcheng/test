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
            <el-input v-model="searchForm.clientId" size="mini" placeholder="专卖店编号"></el-input>
          </el-form-item>
        </el-col>
        
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="首订日期">
            <el-date-picker
              style="width:100%"
              v-model="searchForm.firstorderDate"
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
          <el-form-item label="结业日期">
            <el-date-picker
              style="width:100%"
              v-model="searchForm.graduationDate"
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
          <el-form-item label="审批时间段">
            <el-date-picker
              style="width:100%"
              v-model="searchForm.createTime"
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
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="loadData(true)" :loading="loading">查询</el-button>
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
        prop="createTime"
        label="审批时间"
        :formatter="formatter"
        width="90">
      </el-table-column>
      <el-table-column
        prop="areaCode"
        label="审批状态"
        width="80">
        <template slot-scope="scope">
          {{'审核通过'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="citregionoffice"
        label="区域"
        width="100">
      </el-table-column>
      <el-table-column
        prop="citprovincialoffice"
        label="省办"
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
        prop="oldOutlet"
        label="旧专卖店编号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="oldOutletName"
        label="旧专卖店名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="graduationDate"
        :formatter="formatter"
        label="旧专卖店结业日期"
        width="130">
      </el-table-column>      
      <el-table-column
        prop="newOutlet"
        label="新专卖店编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="newOutletName"
        label="新专卖店名称"
        width="120">
      </el-table-column>
       <el-table-column
        prop="firstorderDate"
        :formatter="formatter"
        label="新专卖店首订日期">
      </el-table-column>
      <!-- <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-button @click="view(scope.$index,scope.row)" type="text" size="small">查看详情</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <div style="text-align: right;margin-top:15px;">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="searchForm.pagingQuery.pageIndex"
        :page-size="20"
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
    name:'keepAlive-terminal-customerChangeInfo',
    data() {
      return {
        loading:false,
        currentPage:1,
        total:10,
        searchForm:{
          sProvince:[],
          provinceObject:[],
          sRegion:[],
          areaObject:[],
          clientId:'',
          firstorderDate:[],
          graduationDate:[],
          createTime:[],
          pagingQuery:{
            pageIndex:1,
            pageSize:20
          }
        },
        tableData: [],
        tableLoading:false,
      }
    },
    watch:{
      $route:function(val){
        if(val.path == '/frame/terminal/customerChangeInfo'){
          this.getFMonth();
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
      "searchForm.createTime":function(val){
        if(!val){
          this.searchForm.createTime = []
        }
      }
    },
    methods: {
      resetForm(){
        this.searchForm = {
          sProvince:[],
          provinceObject:[],
          sRegion:[],
          areaObject:[],
          clientId:'',
          firstorderDate:[],
          graduationDate:[],
          createTime:[],
          pagingQuery:{
            pageIndex:1,
            pageSize:20
          }
        }
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='firstorderDate' || column.property =='createTime' 
        || column.property =='graduationDate'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd");
        }
        return txt;
      },
      downLoad(){
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        delete data.pagingQuery;
        thiz.$tupHttp(thiz,'user/transfer/export','POST',data).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '文件已加入下载队列，稍后前往 "内容管理-导出下载" 下载文件'
          });
        },res=>{
          thiz.loading = false;
        })
      },
      view(ind,row){
        this.gotoUrl('/frame/terminal/customerChangeView/'+row.id)
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      },   
      loadData(isSearch){
        let thiz = this;
        if(thiz.searchForm.createTime.length == 0){
          thiz.$notify.error({
            title: '错误提示',
            message: '创建日期不能超过92天或者为空'
          });
          return ;
        }
        else{
          if(new Date(thiz.searchForm.createTime[1]).diff(new Date(thiz.searchForm.createTime[0])) > 92){
            thiz.$notify.error({
              title: '错误提示',
              message: '创建日期不能超过92天或者为空'
            });
            return ;
          }
        }
        this.loading = true        
        thiz.tableLoading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        delete thiz.searchForm.date2;
        thiz.$tupHttp(thiz,'user/transfer/list','POST',thiz.searchForm).then(res=>{
          thiz.loading = false
          thiz.tableData = res.body.models;
          thiz.total = res.body.pageInfo.total
          thiz.tableLoading = false;
        },res=>{
          thiz.loading = false
          thiz.tableLoading = false;
        })
      },
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData();
      },
      getFMonth(){
        let thiz = this;   
        let today = new Date();     
        this.$tupHttp(this,'monForFinancing/selectByMonth?date='+today.format("yyyy-MM-dd"),'GET').then(res=>{
          if(res.body.model){
            thiz.fMonth = [new Date(res.body.model.startDate).format("yyyy-MM-dd"),new Date(res.body.model.endDate).format("yyyy-MM-dd")]
            thiz.searchForm.createTime = thiz.fMonth           
          }
        })
      }
    },
    mounted(){
      this.getFMonth();
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
