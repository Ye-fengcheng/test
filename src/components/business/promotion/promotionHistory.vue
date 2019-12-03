<template>
  <div>
    <el-form  :model="searchForm" label-width="120px" class="demo-form-inline">   

      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="规则标题">
            <el-input v-model="searchForm.title" size="mini" placeholder="规则标题"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工号">
            <el-input v-model="searchForm.userId" size="mini" placeholder="工号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="时间">
            <el-date-picker
              v-model="searchForm.date"
              size="mini"
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
      </div>
        </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="tableLoading"
      style="width: 100%;"
      height="480"
      highlight-current-row>
      <el-table-column
        type="index"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="userId"
        label="工号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="userName"
        label="姓名"
        sortable
        width="100">
      </el-table-column>
      <el-table-column
        prop="action"
        label="操作"
        width="120">
      </el-table-column>
      <el-table-column
        prop="themeTitle"
        label="操作主题名称"
        width="150">
      </el-table-column>
      <el-table-column
        prop="type"
        label="主题类型"
        width="120">
        <template slot-scope="scope">
          {{scope.row.type == 0 ? '首订促销':'普订促销'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="itemTitle"
        label="操作规则标题"
        width="150">
      </el-table-column>
      <el-table-column
        prop="createTime"
        :formatter="formatter"
        label="操作时间">
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
        loading:false,
        currentPage:1,
        total:10,
        searchForm:{
          date:[],
          title:'',
          userId:'',
          endTime:'',
          startTime:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:50
          }
        },
        tableData: [
        ],
        tableLoading:false,
        dialogVisible:false,
        itemIndex:-1,//当前编辑的行索引
        isFirst:true
      }
    },
    watch:{
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
      resetForm(){
        this.searchForm = {
          date:[],
          title:'',
          userId:'',
          endTime:'',
          startTime:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:this.searchForm.pagingQuery.pageSize
          }
        }
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='isVaild'){
          if(row[column.property]==1)
            txt = '启用'
          else
            txt = '停用'
        }
        else if(column.property =='createTime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss");
        }
        return txt;
      },
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData();
      },
      handleSizeChange(val) {
        this.searchForm.pagingQuery.pageSize = val;
        this.loadData();
      },
      getArea(){
        let val = this.$refs.areaSelect.getValues();
        if(!val){
          val = this.areaData;
        }
        if(val.isarea==='1'){
          let codeArray = [];
          val.targetAreas.map(item=>{
            codeArray.push(item.code);
          })
          if(this.isFirst)
            this.tableData[this.itemIndex].firstBookProviceCodes = codeArray.join(',');
          else
            this.tableData[this.itemIndex].commonBookProviceCodes = codeArray.join(',');
        }
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      },     
      detail(index, row) {
        this.gotoUrl('/frame/terminal/customerInfo/'+row.id)
      },
      loadData(isSearch){
        let thiz = this;
        thiz.tableLoading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        thiz.$tupHttp(thiz,'promotion/logs','POST',thiz.searchForm).then(res=>{
          let tableData = res.body.models;
          thiz.tableData = tableData;
          thiz.total = res.body.pageInfo.total;
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
