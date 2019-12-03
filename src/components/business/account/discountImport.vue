<template>
  <div v-loading="loading">
    <div style="line-height: 26px;">
      <el-upload
        style="float:left;margin-left:10px;"
        :show-file-list="false"
        :multiple="true"
        :httpRequest="upload">
        <el-button icon="el-icon-upload2"  :loading="loading" size="mini" type="primary">上传</el-button>
      </el-upload>  
      &nbsp;&nbsp;
      <el-button size="mini" @click="$util.winOpen('static/useJs/doc/Discount.xlsx?'+$util.getRandom())" type="text">下载模板</el-button>
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
        width="180">
      </el-table-column>
      <el-table-column
        prop="creator"
        label="操作人"
        sortable
        width="120">
      </el-table-column>
      <el-table-column
        prop="num"
        label="操作数量"
        width="100">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="120">
        <template slot-scope="scope">          
          {{scope.row.status==1 ? '成功':'失败'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注">
      </el-table-column>
      <el-table-column
        prop="resultUrl"
        label="下载"
        width="150">
        <template slot-scope="scope">          
          <el-button
            size="mini"          
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
        layout="slot,prev, pager, next, jumper"
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
            discountA:datas.sheet0[i][1],
            discountB:datas.sheet0[i][2],
            discountC:datas.sheet0[i][3],
            discountD:datas.sheet0[i][4],
            remark:datas.sheet0[i][5]
          })
        }
        let thiz = this;
        this.loading = true;

        thiz.$tupHttp(thiz,'account/fund/import/v1','POST',{items:arr,remark:file.name.split('.')[0]}).then(res=>{
          thiz.loadData()
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '成功导入'
          });
        },res=>{
          thiz.loadData()
          thiz.loading = false;
        }) 
      },
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData();
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      },     
      downLoad(index, row) {
        window.open(row.resultUrl)
      },
      loadData(isSearch){
        let thiz = this;
        thiz.tableLoading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        thiz.$tupHttp(thiz,'account/fund/list/v1','POST',thiz.searchForm).then(res=>{
          thiz.tableData = res.body.models;
          thiz.total = res.body.pageInfo.total
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
