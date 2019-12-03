<template>
  <div>
    <el-form  :model="searchForm" label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="操作内容">
            <el-select v-model="searchForm.type" size="mini" clearable filterable  placeholder="请选择">
              <el-option
                v-for="item in Dictions.system_parameters"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="员工编号">
            <el-input v-model="searchForm.updateBy" size="mini" placeholder="员工编号"></el-input>
          </el-form-item>
        </el-col>  
        <el-col :span="8">
          <el-form-item label="员工姓名">
            <el-input v-model="searchForm.updateByName" size="mini" placeholder="员工姓名"></el-input>
          </el-form-item>
        </el-col>       
        <el-col :span="8">
          <el-form-item label="操作时间">
            <el-date-picker
              v-model="searchForm.date"
              type="daterange"
              style="width:100%"
              size="mini"
              value-format="yyyy-MM-dd"
              :default-time="['00:00:00', '23:59:59']"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search"  size="mini" @click="loadData(true)">查询</el-button>
        <el-button icon="el-icon-refresh" type="primary" size="mini" @click="resetForm">重置</el-button>
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
        prop="type"
        label="操作内容"
        :formatter="formatter"
        width="120">
      </el-table-column>
      <el-table-column
        prop="beforeValue"
        label="修改前"
        width="100">
      </el-table-column>
      <el-table-column
        prop="afterValue"
        label="修改后"
        width="100">
      </el-table-column>
      <el-table-column
        prop="updateBy"
        label="工号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="updateByName"
        label="员工名称"
        sortable
        width="120">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="操作时间"
        :formatter="formatter">
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top:15px;">
      <el-pagination
        @current-change="handleCurrentChange"
        background
        :current-page="searchForm.pagingQuery.pageIndex"
        :page-size="50"
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
        Dictions:{
          system_parameters:[]
        },
        loading:false,
        currentPage:1,
        tableLoading:false,
        total:0,
        searchForm:{
          beginTime:'',
          endTime:'',
          date:'',
          updateBy:'',
          updateByName:'',
          type:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:50
          }
        },
        tableData: [
        ]
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
          beginTime:'',
          endTime:'',
          date:'',
          updateBy:'',
          updateByName:'',
          type:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:50
          }
        }
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='type'){
          this.Dictions.system_parameters.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='updateTime'){
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
      downLoad(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        delete data.pagingQuery;
        thiz.$tupHttp(thiz,'employee/login/export','POST',data).then(res=>{
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
            message: '操作时间不能超过92天或者为空'
          });
          return ;
        }
        thiz.tableLoading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        thiz.$tupHttp(thiz,'systemParameters/recordList','POST',thiz.searchForm,{},'/system-parameters/',false,'').then(res=>{
          thiz.tableData = res.body.models;
          thiz.total = res.body.pageInfo ? res.body.pageInfo.total:0
          thiz.tableLoading = false;
        },res=>{
          thiz.tableLoading = false;
        })
      },
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData();
      },
      loadDictions(){
        let thiz = this;
        let params = ["system_parameters"];
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
      this.loadDictions();
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
