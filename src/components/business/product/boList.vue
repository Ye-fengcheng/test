<template>
  <div>
    <el-form  :model="searchForm" label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="产品编号">
            <el-input-product-code v-model="searchForm.pCode" size="mini"  placeholder="产品编号"></el-input-product-code>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="产品名称">
            <el-input v-model="searchForm.pName" size="mini" placeholder="产品名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="时间">
            <el-date-picker
              size="mini"
              v-model="searchForm.date"
              style="width:100%"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder="开始日期"
              :default-time="['00:00:00', '23:59:59']"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>    
      <el-form-item>
        <div style="line-height: 26px;">
          <el-button style="float:left" icon="el-icon-search" type="primary" size="mini" @click="loadData(true)">查询</el-button>
          <el-button style="float:left" icon="el-icon-refresh" type="primary" size="mini" @click="resetForm">重置</el-button>
          <el-button style="float:left"  icon="el-icon-download" :loading="loading" size="mini" @click="downLoad()" type="primary">导出</el-button>
        </div>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="tableLoading"
      style="width: 100%;"
      height="450"
      highlight-current-row
      >
      <el-table-column
        type="index"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="pCode"
        label="产品编号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="pName"
        label="产品名称"
        width="250">
      </el-table-column>
      <el-table-column
        prop="isDiscount"
        label="是否打折"
        width="110">
        <template slot-scope="scope">
          {{scope.row.isDiscount == 1 ?'是':'否'}}
        </template>
      </el-table-column> 
      <el-table-column
        prop="opType"
        label="操作类型"
        width="150">
      </el-table-column>
      <el-table-column
        prop="beforeBo"
        label="调整前BO值"
        width="150">
      </el-table-column>
      <el-table-column
        prop="boQuantity"
        label="调整值"
        width="100">
        <template slot-scope="scope">
          {{scope.row.afterBo - scope.row.beforeBo}}
        </template>
      </el-table-column>
      <el-table-column
        prop="afterBo"
        label="操作后BO数量"
        width="150">
      </el-table-column>
      <el-table-column
        prop="insertBy"
        label="操作人"
        width="150">
      </el-table-column>
      <el-table-column
        prop="insertTime"
        label="操作时间"
        :formatter="formatter"
        width="180"
        >
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top:15px;">
      <el-pagination
        background
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
        selectedOptions:[],
        options: [],
        loading:false,
        currentPage:1,
        total:0,
        tableLoading:false,
        searchForm:{
          pCode:'',
          pName:'',
          date:'',
          beginTime:'',
          endTime:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:50
          }
        },
        tableData: [
        ],
        dialogVisible:false,
        itemIndex:-1//当前编辑的行索引
      }
    },
    watch:{
      'searchForm.date':function(val){
        if(!val){
          this.searchForm.beginTime = '';
          this.searchForm.endTime = '';
        }
        else{
          this.searchForm.beginTime = val[0];
          this.searchForm.endTime = val[1];
        }
      }
    },
    methods: {
      resetForm(){
        this.searchForm = {
          pCode:'',
          pName:'',
          date:'',
          beginTime:'',
          endTime:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:this.searchForm.pagingQuery.pageSize
          }
        }
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='insertTime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss");
        }
        return txt;
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      },     
      detail(index, row) {
        this.gotoUrl('/frame/terminal/customerInfo/'+row.id)
      },
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData();
      },
      handleSizeChange(val) {
        this.searchForm.pagingQuery.pageSize = val;
        this.loadData();
      },
      downLoad(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        delete data.pagingQuery;

        thiz.$tupHttp(thiz,'inventory/exportCommonBoDetailList','POST',data).then(res=>{
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
        if(new Date(thiz.searchForm.endTime).diff(new Date(thiz.searchForm.beginTime)) > 92 || !thiz.searchForm.beginTime){
          thiz.$notify.error({
            title: '错误提示',
            message: '时间不能超过92天或者为空'
          });
          return ;
        }
        thiz.tableLoading = true;        
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页        
        thiz.searchForm.pCode = thiz.searchForm.pCode.trim();
        thiz.searchForm.pName = thiz.searchForm.pName.trim();
        thiz.$tupHttp(thiz,'inventory/getCommonBoDetailList','POST',thiz.searchForm).then(res=>{
          thiz.tableData = res.body.models;
          thiz.total = res.body.pageInfo.total
          thiz.tableLoading = false;
        },res=>{
          thiz.tableLoading = false;
        })
      },
      getFMonth(){
        let thiz = this;   
        let today = new Date();     
        this.$tupHttp(this,'monForFinancing/selectByMonth?date='+today.format("yyyy-MM-dd"),'GET').then(res=>{
          if(res.body.model){
            thiz.fMonth = [new Date(res.body.model.startDate).format("yyyy-MM-dd"),new Date(res.body.model.endDate).format("yyyy-MM-dd")]
            thiz.searchForm.date = thiz.fMonth
            setTimeout(function(){
              thiz.loadData();
            })            
          }
        })
      }
    },
    mounted(){
      this.getFMonth();
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
