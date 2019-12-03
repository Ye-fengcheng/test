<template>
  <div>
    <div>
      <el-button icon="el-icon-plus" size="mini" @click="gotoUrl('/frame/promotion/addOrderPlan')" type="success">添加</el-button>
      <el-button icon="el-icon-delete" :disabled="multipleSelection.length==0" size="mini" :loading="loading" @click="deleteData" type="danger">删除</el-button>
    </div>
    <el-table
      :data="tableData"
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
        prop="name"
        label="名称">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        :formatter="formatter"
        width="100">
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="开始时间"
        width="100">
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="结束时间"
        width="100">
      </el-table-column>
      <el-table-column
        prop="creater"
        label="创建人"
        width="100">
      </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button
            :disabled="scope.row.status==1"
            size="mini"          
            type="primary"
            @click="useItem(scope.$index, scope.row)">启用</el-button>
            <el-button
            size="mini"          
            type="primary"
            @click="editItem(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top:15px;">
      <el-pagination
        @size-change="handleSizeChange"
        background
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="2"
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
        currentPage:1,
        total:10,
        multipleSelection:[],
        tableData: [
          {
            name: '2018年5月下单计划',
            status : 1
          },
          {
            name: '2018年4月下单计划',
            status : 0
          },
          {
            name: '2018年3月下单计划',
            status : 0
          },
          {
            name: '2018年2月下单计划',
            status : 0
          },
          {
            name: '2018年1月下单计划',
            status : 0
          }
        ]
      }
    },
    watch:{
    },
    methods: {
      gotoUrl(url){
        this.$router.push({ path: url });
      }, 
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }, 
      formatter(row, column) {
        let txt = '';
        if(column.property =='status'){
          if(row.status=='0'){
            txt='停用'
          }
          else{
            txt='启用'
          }
        }
        return txt;
      },   
      detail(index, row) {
        this.gotoUrl('/frame/terminal/customerInfo/'+row.id)
      },
      loadData(){

      },
      deleteData(){
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
          thiz.$tupHttp(thiz,'orderPlan/deletes','POST',data).then(res=>{
            thiz.loading = false;
            thiz.loadData();
          },res=>{
            thiz.loading = false;
          }) 
        }).catch(() => {    
          thiz.loading = false;  
        });
      }
    },
    mounted(){
      this.loadData()
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
