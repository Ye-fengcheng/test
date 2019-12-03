<template>
  <div>
    <el-input
      placeholder="请选择"
      :size="size"
      v-model="code">
      <el-button @click="showDialog()" :size="size" slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <el-dialog
      title="选择员工"
      :visible.sync="visible"  
      append-to-body
      width="60%">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="区域">            
          <tup-arae-select type="area" size="mini" v-model="searchForm.areasObject"></tup-arae-select>
        </el-form-item>
        <el-form-item label="省办">
          <tup-arae-select size="mini" v-model="searchForm.provinceObject"></tup-arae-select>
        </el-form-item>
        <el-form-item label="员工编号">
          <el-input v-model="searchForm.pUid" size="mini" placeholder="员工编号"></el-input>
        </el-form-item>
          <el-form-item label="员工姓名">
          <el-input v-model="searchForm.pName" size="mini" placeholder="员工姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="loadData(true)">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        @row-dblclick="rowDblClick"
        style="width: 100%;height:300px;overflow-y:scroll">
        <el-table-column
          type="index"
          label="序号"
          width="55">
        </el-table-column>
        <el-table-column
        prop="pUid"
        label="员工编号"
        width="80">
      </el-table-column>
      <el-table-column
        prop="pName"
        label="姓名"
        sortable
        width="80">
      </el-table-column>
      <el-table-column
        prop="pRegion"
        label="区域"
        width="120">
      </el-table-column>
      <el-table-column
        prop="pProvince"
        label="省办"
        width="120">
      </el-table-column>
      <el-table-column
        prop="pCityno"
        label="城市"
        width="150">
      </el-table-column>
      <el-table-column
        prop="pFscode"
        label="DFS编号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="pPositionabbr"
        label="职位"
        width="100">
      </el-table-column>
      <el-table-column
        prop="isDisable"
        label="账号状态"
        width="100">
        <template slot-scope="scope">
          {{scope.row.isDisable == 1 ? '禁用':'启用'}}
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
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'elInputEmployees',
  model: {
    prop: 'value',
    event: 'add'
  },
  props: {
    size: {
      type: String,
      default: ""
    },
    value:{
      type: String,
      default: ''
    }
  },
  data(){
    return {
      code:this.value,
      visible:false,
      tableData:[],
      total:0,
      searchForm:{
        provinceObject:[],
        areasObject:[],
        provinces:[],
        regions:[],
        isDisable:0,
        pUid:'',
        pName:'',
        pagingQuery:{
          pageIndex:1,
          pageSize:20
        }
      }
    }
  },
  watch:{
    value:function(val){
      this.code = val;
    },
    code:function(val){
      this.$emit('add',val);
    },
    "searchForm.areasObject":function(val){
      let datas = [];
      val.map(item=>{
        if(item.code !='999')
          datas.push(item.code)
      })
      this.searchForm.regions = datas;
    },
    "searchForm.provinceObject":function(val){
      let datas = [];
      val.map(item=>{
        if(item.code !='999')
          datas.push(item.code)
      })
      this.searchForm.provinces = datas;
    },
  },
  methods: {    
    showDialog(){
      this.visible = true;
    },
    resetForm(){
      this.searchForm = {
        provinceObject:[],
        areasObject:[],
        provinces:[],
        regions:[],
        isDisable:0,
        pUid:'',
        pName:'',
        pagingQuery:{
          pageIndex:1,
          pageSize:20
        }
      }
    },
    rowDblClick(row, event){
      this.visible = false;
      this.code = row.pUid;      
      this.$emit('add',row.pUid);
      //清除之前的搜索选项
      this.resetForm();
      this.loadData();
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
      thiz.$tupHttp(thiz,'employee/listAllEmployees','POST',thiz.searchForm).then(res=>{
        thiz.tableData = res.body.models;
        thiz.total = res.body.pageInfo.total
        thiz.tableLoading = false;
      },res=>{
        thiz.tableLoading = false;
      })
    },
  },
  mounted () {
    //this.loadData();
  },
  computed: {
  }
}
</script>

<style scoped>
.leftTree{
    overflow-x: hidden;
    overflow-y: scroll;
    height: 400px;
}
</style>

