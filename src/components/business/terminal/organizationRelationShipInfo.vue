<template>
  <div>
    <el-form  :model="searchForm" label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="专卖店编号">
            <el-input v-model="searchForm.clientId" size="mini" placeholder="专卖店编号"></el-input>
          </el-form-item>
        </el-col>     
        <el-col :span="8">
          <el-form-item label="财务年周">
            <el-date-picker
              v-model="searchForm.dyear"
              style="width:48%"
              type="year"
              value-format="yyyy"
              size="mini"
              placeholder="选择年">
            </el-date-picker>
            <el-select v-model="searchForm.dweek" style="width:48%" size="mini" clearable filterable  placeholder="选择周">
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
        prop="dweek"
        label="周"
        width="80">
      </el-table-column>
      <el-table-column
        prop="dmonth"
        label="月"
        width="80">
      </el-table-column>      
      <el-table-column
        prop="dyear"
        label="年"
        width="80">
      </el-table-column>
      <el-table-column
        prop="regionName"
        label="区域名称"
        width="100">
      </el-table-column>
      <el-table-column
        prop="provincialOfficeName"
        label="省办名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="customerId"
        label="客户编号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="fsName"
        label="DFS"
        width="100">
      </el-table-column>
      <el-table-column
        prop="dmName"
        label="片区负责人"
        width="120">
      </el-table-column>
       <el-table-column
        prop="parentName"
        label="上级分销商"
        width="100">
      </el-table-column>
       <el-table-column
        prop="organLevel"
        label="客户层级"
        width="100">
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top:15px;">
      <el-pagination
        @current-change="handleCurrentChange"
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
        isFirstLoad:true,
        loading:false,
        currentPage:1,
        total:10,
        weeks:[],
        searchForm:{
          clientId:'',
          dyear:'',
          dweek:'',
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
    },
    methods: {
      resetForm(){
        this.searchForm = {
          clientId:'',
          dyear:'',
          dweek:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:20
          }
        }
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='pFirstorderDate' || column.property =='pGraduationDate'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd");
        }
        return txt;
      },
      downLoad(){
        if(this.loading){
          return false
        }      
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        delete data.pagingQuery;
        thiz.$tupHttp(thiz,'user/staticSnapshot/export','POST',data).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '文件已加入下载队列，稍后前往 "内容管理-导出下载" 下载文件'
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
        this.loading = true
        let thiz = this;
        thiz.tableLoading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        thiz.$tupHttp(thiz,'user/staticSnapshot/list','POST',thiz.searchForm).then(res=>{
          thiz.loading = false
          thiz.tableData = res.body.models;
          thiz.total = res.body.pageInfo ? res.body.pageInfo.total :0 
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
    },
    mounted(){
      this.loadData();
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
</style>
