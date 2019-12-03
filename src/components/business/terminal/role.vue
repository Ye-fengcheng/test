<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane v-for="item in menuData" :key="item.dictValue" :label="item.dictName" :name="item.dictValue">
      </el-tab-pane>
    </el-tabs>
   
    <el-form  :model="searchForm" label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="角色名称">
            <el-input v-model="searchForm.search" size="mini" placeholder="角色名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item>
            <el-button  icon="el-icon-search" type="primary" size="mini" @click="loadData(true)">查询</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="14">
        </el-col>
      </el-row>      
     
    </el-form>
    <el-button icon="el-icon-plus" size="mini" @click="gotoUrl('/frame/terminal/addRole/'+activeName)" type="primary">添加</el-button>
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
        prop="id"
        label="角色编号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="code"
        label="角色代码"
        sortable
        width="250">
      </el-table-column>
       <el-table-column
        prop="name"
        label="角色名称"
        sortable
        width="250">
      </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">          
          <el-button
            size="mini"          
            type="primary"
            @click="editItem(scope.$index, scope.row)">编辑</el-button>
            <el-button
            size="mini"          
            type="primary"
            v-if="scope.row.isDefault == 0"
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
        activeName:this.$route.params.id,
        menuData:[],
        selectedOptions:[],
        options: [],
        loading:false,
        currentPage:1,
        total:0,
        tableLoading:false,
        searchForm:{
          search:'',
          platform:this.$route.params.id,
          pagingQuery:{
            pageIndex:1,
            pageSize:20
          }
        },
        tableData: [
        ],
        dialogVisible:false,
        itemIndex:-1//当前编辑的行索引
      }
    },
    watch:{
      activeName:function(val){
        this.searchForm.platform = val;
        this.searchForm.search = '';
        this.loadData()
      }
    },
    methods: {
      formatter(row, column) {
        let txt = ''
        if(column.property =='insertTime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd");
        }
        return txt;
      },
      upload(option){     
        this.$util.readExcel(option.file,this.treatDatas)
      },
      handleDelete(index, row) {        
        let thiz = this;
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          this.$tupHttp(this,'employee/userRole/deleteRole?roleId='+row.id,'GET').then(res=>{
            thiz.loadData();
            thiz.loading = false;
          },res=>{
            thiz.loading = false;
          })
        }).catch(() => {
          this.loading = false;         
        });
        
      },
      treatDatas(datas){
        debugger
        let arr = [];
        for(let i =1;i<datas.sheet0.length;i++){
          arr.push({
            pCode:datas.sheet0[i][0],
            bo:datas.sheet0[i][1]
          })
        }
        let thiz = this;
        this.loading = true;
        thiz.$tupHttp(thiz,'product/importProductArea','POST',arr).then(res=>{
          thiz.loadData()
          thiz.loading = false;
        },res=>{
          thiz.loading = false;
        }) 
      },
      saveItem(ind,row){
      },
      editItem(ind,row){
        this.gotoUrl('/frame/terminal/editRole/'+row.platform+'/'+row.id)     
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
      loadData(isSearch){
        let thiz = this;
        thiz.tableLoading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        thiz.$tupHttp(thiz,'employee/role/roleList','POST',thiz.searchForm).then(res=>{
          thiz.tableData = res.body.models;
          thiz.total = res.body.pageInfo.total
          thiz.tableLoading = false;
        },res=>{
          thiz.tableLoading = false;
        })
      },
      loadMenu(){
        let thiz = this;
        let params = ["platform_type"];
        this.$baseData.getDicts(this,params,function(data){
          thiz.menuData = data.platform_type;
        });
      }
    },
    mounted(){
      this.loadMenu();
      this.loadData()
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
