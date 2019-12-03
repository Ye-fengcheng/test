<template>
  <div>
    <div style="line-height: 26px;width:500px;">
      <el-upload
        style="float:left;margin-left:10px;"
        ref="upload"
        :file-list="fileList"
        :auto-upload="false"
        :limit="1"
        :multiple="false"
        :httpRequest="upload">
        <el-button  :loading="loading" size="mini" type="primary">选取文件</el-button>
      </el-upload>  
      &nbsp;&nbsp;
      <el-button size="mini" @click="$util.winOpen('static/useJs/doc/Money.xlsx?'+$util.getRandom())" type="text">下载模板</el-button>
      <el-input
        style="float:left;margin:10px 0px 10px 10px;"
        type="textarea"
        :rows="2"
        placeholder="备注说明"
        v-model="remark">
      </el-input>
      <br/><br/>
      <el-button icon="el-icon-upload2"  style="float:left;margin-left:10px;" size="small" type="success" @click="submitUpload">导入</el-button>
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
        layout="slot, prev, pager, next, jumper"
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
        fileList:[],
        remark:'',
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
      formatter(row, column) {
        let txt = ''
        if(column.property =='createTime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss");
        }
        return txt;
      },
      submitUpload() {
        this.$refs.upload.submit();
      },
      upload(option){     
        this.$util.readExcel(option.file,this.treatDatas)
      },
      treatDatas(datas,file){
        let arr = [];
        for(let i =1;i<datas.sheet0.length;i++){
          if(datas.sheet0[i][0] || datas.sheet0[i][1] || datas.sheet0[i][2]){
            arr.push({
              clientId:datas.sheet0[i][0],
              amount:datas.sheet0[i][1],
              //accountType:datas.sheet0[i][2],
              chargeType:datas.sheet0[i][2],
              remark:datas.sheet0[i][5]
            })
          }          
        }
        let thiz = this;
        this.loading = true;
        
        thiz.$tupHttp(thiz,'account/money/import','POST',{items:arr,remark:thiz.remark}).then(res=>{
          thiz.loadData()
          thiz.$notify.success({
            title: '成功提示',
            message: '成功导入'
          });
          thiz.loading = false;
          thiz.fileList = [];
          thiz.remark = '';
        },res=>{
          thiz.loading = false;
          thiz.fileList = [];
          thiz.loadData()
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
        thiz.$tupHttp(thiz,'account/money/list/v1','POST',thiz.searchForm).then(res=>{
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
