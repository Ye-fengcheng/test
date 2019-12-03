<template>
  <div>
    <el-form  :model="searchForm" label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="主题">
            <el-input v-model="searchForm.title" size="mini"  placeholder="主题"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" size="mini" clearable filterable placeholder="请选择">
              <el-option label="启用" :value="1"></el-option>
              <el-option label="停用" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="时间"  size="mini"  prop="date">
            <el-date-picker
              v-model="searchForm.date"
              style="width:100%"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              value-format="yyyy-MM-dd"
              :default-time="['00:00:00', '23:59:59']"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <div style="line-height: 26px;">
          <el-button style="float:left;" icon="el-icon-search" type="primary" size="mini" @click="loadData(true)">查询</el-button>
          <el-button style="float:left;" icon="el-icon-refresh" type="primary" size="mini" @click="resetForm">重置</el-button>
          <el-button icon="el-icon-plus" size="mini" @click="gotoUrl('/frame/promotion/addPromotion')" type="primary">添加</el-button>
          <el-button icon="el-icon-delete" :disabled="multipleSelection.length==0" size="mini" :loading="loading" @click="deletePromotion" type="danger">删除</el-button>
        </div>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="tableLoading"
      style="width: 100%;"
      height="450"
      highlight-current-row
      @selection-change="handleSelectionChange"
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
        prop="online"
        label="状态"
        :formatter="formatter"
        sortable
        width="100">
      </el-table-column>
      <el-table-column
        prop="title"
        label="促销主题"
        sortable
        width="200">
      </el-table-column>
      <el-table-column
        prop="promotionThemeType"
        label="促销类型"
        sortable
        width="100">
        <template slot-scope="scope">
          {{scope.row.promotionThemeType == 0 ? '首订促销':'普订促销'}}
        </template>
      </el-table-column>      
      <el-table-column
        prop="startDate"
        label="开始时间"
        width="150">
      </el-table-column>
      <el-table-column
        prop="endDate"
        label="结束时间"
        width="150">
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button
            size="mini"          
            type="primary"
            @click="editItem(scope.$index, scope.row)">主题编辑</el-button>
            <el-button
            size="mini"          
            type="primary"
            @click="promotionEdit(scope.$index, scope.row)">促销规则</el-button>
        </template>
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
    <el-dialog title="添加规则" :close-on-click-modal="false" width="90%" top="5%" :visible.sync="addDialogVisible">
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name:'keepAlive-promotion-index',
    data() {
      return {
        multipleSelection:[],
        searchForm:{
          title:'',
          status:'',
          startDate:'',
          endDate:'',
          date:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:50
          }
        },
        total:0,
        loading:false,
        tableLoading:false,
        currentPage:1,
        addDialogVisible:false,
        addComDialogVisible:false,
        tableData: [
        ]
      }
    },
    watch:{
      $route:function(val){
        if(val.path == '/frame/promotion/index'){
          this.$util.onKeyCode(this,'loadData',[true])
        }
      },
      'searchForm.date':function(val){
        if(!val){
          this.searchForm.startDate = '';
          this.searchForm.endDate = '';
        }
        else{
          this.searchForm.startDate = val[0];
          this.searchForm.endDate = val[1];
        }
      }
    },
    methods: {
      resetForm(){
        this.searchForm = {
          title:'',
          status:'',
          startDate:'',
          endDate:'',
          date:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:this.searchForm.pagingQuery.pageSize
          }
        }
      },
      showAddDialog(){
        this.addDialogVisible = true;
      },
      loadData(isSearch){
        let thiz = this;
        thiz.tableLoading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        thiz.$tupHttp(thiz,'promotion/list','POST',thiz.searchForm).then(res=>{
          thiz.tableData = res.body.models;
          thiz.total = res.body.pageInfo.total;
          thiz.tableLoading = false;
        },res=>{
          thiz.tableLoading = false;
        }) 
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      },      
      handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      },
      handleSizeChange(val) {
        this.searchForm.pagingQuery.pageSize = val;
        this.loadData();
      },
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData();
      },
      handleSizeChange(val) {
        this.searchForm.pagingQuery.pageSize = val;
        this.loadData();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(val);
      },
      deletePromotion(){
        let thiz = this;
        thiz.loading = true;
        let data = [];
        this.multipleSelection.map(item=>{
          data.push(item.id)
        })
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          thiz.$tupHttp(thiz,'promotion/deletes','POST',data).then(res=>{
            thiz.loading = false;
            thiz.loadData();
          },res=>{
            thiz.loading = false;
          }) 
        }).catch(() => {    
          thiz.loading = false;  
        });
        
      },
      formatter(row, column) {
        let txt = '';
        if(column.property =='online'){
          if(row.online){
            txt='启用'
          }
          else{
            txt='停用'
          }
        }
        return txt;
      },
      editItem(index, row) {
        this.gotoUrl('/frame/promotion/promotionDetail/'+row.id+'/'+row.promotionThemeType)
      },
      promotionEdit(index, row) {
        this.gotoUrl('/frame/promotion/promotionGuide/'+row.id+'/'+row.promotionThemeType)
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
