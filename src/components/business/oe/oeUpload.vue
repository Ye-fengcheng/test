<template>
  <div v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item >预估定量</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/frame/oe/oeDetail'}">预估订单明细</el-breadcrumb-item>
      <el-breadcrumb-item>上传数据</el-breadcrumb-item>
    </el-breadcrumb>
    <br/>
    <div style="line-height: 26px;">
      <el-upload
        style="float:left;margin-left:10px;margin-top:-7px"
        :show-file-list="false"
        :multiple="true"
        :httpRequest="upload">
        <el-button :loading="loading" icon="el-icon-upload2" size="mini" type="primary">上传数据</el-button>
      </el-upload>  
      &nbsp;&nbsp;
      <el-button size="mini" style="float:left;margin-left:10px;" @click="$util.winOpen('static/useJs/doc/预估定量明细导入模板.xlsx?'+$util.getRandom())" type="text">下载模板</el-button>
    </div>
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
        prop="createTime"
        label="操作时间"
        :formatter="formatter"
        width="180">
      </el-table-column>
      <el-table-column
        prop="createBy"
        label="操作人"
        sortable
        width="120">
      </el-table-column>
      <el-table-column
        prop="count"
        label="操作数量"
        width="120">
      </el-table-column>      
      <el-table-column
        prop="status"
        label="状态"
        width="120">
        <template slot-scope="scope">          
          {{scope.row.status==1 ? '成功':(scope.row.status==-1) ?'失败':'进行中'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="url"
        label="下载"
        width="150">
        <template slot-scope="scope">          
          <el-button
            size="mini"          
            v-show="scope.row.status != 0"
            type="primary"
            @click="downLoad(scope.$index, scope.row)">下载</el-button>
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
        areaData:{
          isarea:'1',
          data:[]
        },
        tableHeight:parseInt(document.documentElement.clientHeight-160),
        loading:false,
        currentPage:1,
        total:0,
        searchForm:{
          pagingQuery:{
            pageIndex:1,
            pageSize:20
          }
        },
        tableData: [
        ],
        tableLoading:false
      }
    },
    watch:{
    },
    methods: {
      upload(option){     
        this.$util.readExcel(option.file,this.treatDatas)
      },
      treatDatas(datas,file){
        let arr = [];
        for(let i =1;i<datas.sheet0.length;i++){
          arr.push({
            clientId:datas.sheet0[i][0],
            productName:datas.sheet0[i][1],
            estimatedQuantity:datas.sheet0[i][2],
            monthlyAverageSales:datas.sheet0[i][3],
            currentInventory:datas.sheet0[i][4],
            year:datas.sheet0[i][5],
            month:datas.sheet0[i][6]
          })
        }
        let thiz = this;
        this.loading = true;
        thiz.$tupHttp(thiz,'orderEstimate/importOrderEstimated','POST',arr,{},'/manage-psi/',false,'').then(res=>{
          thiz.loadData()
          thiz.loading = false;
          thiz.$notify.success({
            title: '提示',
            message: '操作成功'
          });
        },res=>{
          thiz.loadData()
          thiz.loading = false;
        }) 
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='createTime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss");
        }
        return txt;
      },
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData();
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      },     
      downLoad(index, row) {
        window.open(row.url)
      },
      loadData(isSearch){
        let thiz = this;
        thiz.tableLoading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        thiz.$tupHttp(thiz,'orderEstimate/importFileList','POST',thiz.searchForm,{},'/manage-psi/',false,'').then(res=>{
          thiz.tableData = res.body.models;
          thiz.total = res.body.pageInfo ? res.body.pageInfo.total:0
          thiz.tableLoading = false;
        },res=>{
          thiz.tableLoading = false;
        })
      }
    },
    mounted(){
      $('.el-upload__input').hide();
      this.loadData();
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
