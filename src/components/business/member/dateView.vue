<template>
  <div>
    <el-form  :model="searchForm" label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="区域">
            <tup-arae-select v-model="searchForm.provinceObject" size="mini" :showCheck="true"></tup-arae-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="专卖店编号">
            <el-input v-model="searchForm.jdeCode" size="mini" placeholder="专卖店编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="专卖店名称">
            <el-input v-model="searchForm.storeName" size="mini" placeholder="专卖店名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="分销商编号">
            <el-input v-model="searchForm.distributorCode" size="mini" placeholder="分销商编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="分销商名称">
            <el-input v-model="searchForm.distributorName" size="mini" placeholder="分销商名称"></el-input>
          </el-form-item>
        </el-col>        
        <el-col :span="8">
          <el-form-item label="FS">
            <el-input v-model="searchForm.fsCodeOrName" size="mini" placeholder="FS编号或姓名"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">        
        <el-col :span="8">
          <el-form-item label="DM">
            <el-input v-model="searchForm.cmCodeOrName" size="mini" placeholder="DM编号或姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="日期">
            <el-date-picker
              style="width:100%"
              v-model="searchForm.date2"
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
        prop="startDate"
        label="开始日期"
        width="90">
      </el-table-column>
      <el-table-column
        prop="endDate"
        label="结束日期"
        width="90">
      </el-table-column>
      <el-table-column
        prop="areaCode"
        label="区域编号"
        width="80">
      </el-table-column>
      <el-table-column
        prop="areaName"
        label="区域名称"
        width="100">
      </el-table-column>
      <el-table-column
        prop="provinceCode"
        label="省办编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="provinceName"
        label="省办名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="cmCode"
        label="DM编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="cmName"
        label="DM姓名"
        width="150">
      </el-table-column>
      <el-table-column
        prop="fsCode"
        label="FS编号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="fsName"
        label="FS姓名"
        width="100">
      </el-table-column>
      <el-table-column
        prop="distributorCode"
        label="分销商编号"
        width="100">
      </el-table-column>
       <el-table-column
        prop="distributorName"
        label="分销商姓名"
        width="100">
      </el-table-column>
       <el-table-column
        prop="jdeCode"
        label="专卖店编号（新）"
        width="150">
      </el-table-column>
      <el-table-column
        prop="storeName"
        label="专卖店名称"
        width="100">
      </el-table-column>
      <el-table-column
        prop="addCommonMemberCount"
        label="新普通会员数"
        width="100">
      </el-table-column>
      <el-table-column
        prop="addVipMemberCount"
        label="新高级会员数"
        width="100">
      </el-table-column>
      <el-table-column
        prop="addMemberCount"
        label="新招会员总数"
        width="100">
      </el-table-column>
      <el-table-column
        prop="validVipMemberCount"
        label="有效高级会员数"
        width="150">
      </el-table-column>
      <el-table-column
        prop="validMemberCount"
        label="有效会员总数"
        width="150">
      </el-table-column>
      <el-table-column
        prop="currStoreUpdateCount"
        label="会员本店升级数"
        width="120">
      </el-table-column>
      <el-table-column
        prop="otherStoreUpdateCount"
        label="会员升级转入"
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
        searchForm:{
          provinceObject:[],
          provinces:[],
          cmCodeOrName:'',
          date:'',
          date2:'',
          startDate:'',
          endDate:'',
          distributorCode:'',
          distributorName:'',
          fsCodeOrName:'',
          jdeCode:'',
          storeName:'',
          type:'day',
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
      "searchForm.provinceObject":function(val){
        let datas = [];
        val.map(item=>{
          datas.push(item.code)
        })
        this.searchForm.provinces = datas;
      },
      'searchForm.date2': function (val) {
        if (!val) {
          this.searchForm.startDate = ''
          this.searchForm.endDate = ''
        } else {
          this.searchForm.startDate = val[0]
          this.searchForm.endDate = val[1]
        }
      }
    },
    methods: {
      resetForm(){
        this.searchForm = {
          provinceObject:[],
          provinces:[],
          cmCodeOrName:'',
          date:'',
          distributorCode:'',
          distributorName:'',
          fsCodeOrName:'',
          jdeCode:'',
          storeName:'',
          type:'day',
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
        delete data.date2;
        thiz.$tupHttp(thiz,'statisticsMember/exportStatisticsMember','POST',data).then(res=>{
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
        if(this.loading){
          return false
        }
        this.loading = true
        let thiz = this;
        thiz.tableLoading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
          delete thiz.searchForm.date2;
        thiz.$tupHttp(thiz,'statisticsMember/getStatisticsMember','POST',thiz.searchForm).then(res=>{
          thiz.loading = false
          thiz.tableData = res.body.models;
          thiz.total = res.body.pageInfo.total
          thiz.tableLoading = false;
          if(res.body.extra && thiz.isFirstLoad){
            // thiz.searchForm.date = res.body.extra
            thiz.isFirstLoad = false
          }
        },res=>{
          thiz.tableLoading = false;
        })
      },
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData();
      },
    },
    mounted(){
      // this.loadData();
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
