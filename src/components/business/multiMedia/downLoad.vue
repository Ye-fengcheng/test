<template>
  <div>
    <el-form  :model="searchForm" label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="20">
          <el-form-item label="时间">
           <el-date-picker
              v-model="searchForm.date"
              type="daterange"
              size="mini"
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
          <el-button  icon="el-icon-search" type="primary" size="mini" @click="loadData(true)">查询</el-button>
          <el-button icon="el-icon-delete" :disabled="multipleSelection.length==0" size="mini" :loading="loading" @click="deletes" type="danger">删除</el-button>
        </div>
        </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="tableLoading"
      style="width: 100%;"
      height="450"
      @selection-change="handleSelectionChange"
      highlight-current-row
      :default-sort = "{prop: 'date', order: 'descending'}">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        type="index"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="applicationName"
        label="调用模块"
        width="100">
      </el-table-column>
      <el-table-column
        prop="fileName"
        label="文件名称"
        width="150">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间 "
        :formatter="formatter"
        width="100">
      </el-table-column>
      <el-table-column
        prop="operator"
        label="创建人 "
        width="100">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态 "
        width="100">
        <template slot-scope="scope">
          {{scope.row.status == 1 ?'成功': (scope.row.status == 0 ?'进行中':'失败')}}
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注">
        <template slot-scope="scope">
          <el-tooltip placement="top">
            <div slot="content">
              <div style="width:250px">
                {{scope.row.remark}}
              </div>
            </div>
            <span class="lineCamp">{{scope.row.remark}}</span>
          </el-tooltip>
          
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.url"
            size="mini"
            :loading="loading"
            @click="download(scope.$index, scope.row)">下载</el-button>
          <el-button
            size="mini"          
            type="primary"
            :loading="loading"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
        loading:false,
        total:0,
        searchForm:{
          date:[],
          endTime:'',
          beginTime:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:20
          }
        },
        tableData: [
        ],
        tableLoading:false,
        multipleSelection:[]
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
      deletes(){
        let thiz = this;        
        let data = [];
        this.multipleSelection.map(item=>{
          data.push({id:item.id})
        })
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          thiz.loading = true;
          thiz.$tupHttp(thiz,'exportFile/batchDelete','POST',data).then(res=>{
            thiz.loading = false;
            thiz.loadData();
          },res=>{
            thiz.loading = false;
          }) 
        }).catch(() => {    
          thiz.loading = false;  
        });        
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(val);
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='createTime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd");
        }
        return txt;
      },
      download(index, row) {
        //window.open(row.url)
        let thiz = this;
        this.loading = true;
        var url = this.$serviceIp+'/backend/load/smbDownloadfile?id='+row.id;
        var xhr = new XMLHttpRequest();        
        xhr.open('POST', url, true);        // 也可以使用POST方式，根据接口
        xhr.setRequestHeader("x_auth_token",window.localStorage.getItem('token'));
        xhr.setRequestHeader("x_request_platform","WEB");
        xhr.setRequestHeader("x_user_id",window.localStorage.getItem('pUid'));
        xhr.setRequestHeader("x_request_application",'dmz_web');
        xhr.responseType = "blob";    // 返回类型blob
        // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
        xhr.onload = function () {
          // 请求完成
          thiz.loading = false;
          if (this.status === 200) {
            // 返回200
            var data = this.response;
            const blob = new Blob([data]);
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.download = row.fileName;
            a.href = blobUrl;
            a.click();
            a.removeNode(true);
          }
        };
        // 发送ajax请求
        xhr.send() 
      },
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData();
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      },  
      handleDelete(index, row) {        
        let thiz = this;
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          this.$tupHttp(this,'exportFile/delete','POST',row).then(res=>{
            thiz.loadData();
            thiz.loading = false;
          },res=>{
            thiz.loading = false;
          })
        }).catch(() => {
          this.loading = false;         
        });
        
      },   
      detail(index, row) {
        this.gotoUrl('/frame/terminal/customerInfo/'+row.id)
      },
      loadData(isSearch){
        let thiz = this;
        thiz.tableLoading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        thiz.$tupHttp(thiz,'exportFile/list','POST',thiz.searchForm).then(res=>{
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
.lineCamp{
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>
