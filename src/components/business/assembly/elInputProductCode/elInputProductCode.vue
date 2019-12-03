<template>
  <div>
    <!-- <el-input
      placeholder="选择产品"
      v-model="productCode"
      :size="size"
      :disabled="true">
      <el-button @click="selectProduct()" :size="size" slot="append" icon="el-icon-search"></el-button>
    </el-input>  -->   
    <el-autocomplete
      placeholder="不少于4个字"
      :fetch-suggestions="queryProductAsync"
      @select="handleSelect"
      :size="size"
      v-model="productCode">
      <el-button @click="selectProduct()" :size="size" slot="append" icon="el-icon-search"></el-button>
      <template slot-scope="{ item }">
        <div style="text-overflow: ellipsis;overflow: hidden;font-size:10px">{{ item.pCode }}</div>
        <span style="color: #b4b4b4;font-size:10px">{{ item.pName }}</span>
      </template>
    </el-autocomplete>
    <el-dialog
      title="选择产品"
      :visible.sync="visible"  
      append-to-body
      width="60%">
      <el-form :inline="true" :model="searchParam" class="demo-form-inline">
        <el-form-item label="关键字">
          <el-input clearable v-model="searchParam.search" style="width:150px;" size="mini" placeholder="产品编号/产品名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="searchProduct(true)">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="productData"
        @row-dblclick="rowDblClick"
        style="width: 100%;height:300px;overflow-y:scroll">
        <el-table-column
          type="index"
          label="序号"
          width="55">
        </el-table-column>
        <el-table-column
          prop="pCode"
          label="产品编号">
        </el-table-column>  
        <el-table-column
          prop="pName"
          label="产品名称">
        </el-table-column> 
      </el-table>
      <div style="text-align: right;margin-top:15px;">
        <el-pagination
          @current-change="handleCurrentChange"
          background
          :current-page="searchParam.pagingQuery.pageIndex"
          :page-size="50"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'elInputProductCode',
  model: {
    prop: 'value',
    event: 'add'
  },
  props: {
    type: {
      type: String,
      default: ""
    },
    param:{
      type : Object,
      defaule :{}
    },
    size: {
      type: String,
      default: "mini"
    },
    pStatus: {
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
      total:0,
      productCode:this.value,
      visible:false,
      productData:[],
      searchParam:{
        search:'',
        type:2,
        pStatus:this.pStatus,
        pagingQuery:{
          pageIndex:0,
          pageSize:50
        }
      }
    }
  },
  watch:{
    value:function(val){
      this.productCode = val;
    }
  },
  methods: {    
    selectProduct(){
      this.visible = true;
    },
    queryProductAsync(queryString, cb) {
      this.productCode = queryString;
      this.$emit('add',this.productCode);
      if(queryString.length < 4){
        cb([])
        return;
      }
      let thiz = this;
      let searchParam = {
          search: queryString,
          type:2,
          pagingQuery:{
            pageIndex:1,
            pageSize:10
          }
      }
      thiz.$tupHttp(thiz,'product/product/selectProductBypCodeOrpName','POST',searchParam).then(res=>{
        let productData = res.body.models;
        cb(productData)
      })
    },
    handleSelect(row) {
      this.productCode = row.pCode      
      this.$emit('add',this.productCode);
      this.$emit('onSelect',row,this.param);
    },
    rowDblClick(row, event){
      this.visible = false;
      this.productCode = row.pCode      
      this.$emit('add',this.productCode);
      this.$emit('onSelect',row,this.param);
      //清除之前的搜索选项
      this.searchParam.search = '';
      this.searchProduct(true);
    },
    handleCurrentChange(val) {
      this.searchParam.pagingQuery.pageIndex = val;
      this.searchProduct();
    },
    searchProduct(isSearch){
      let thiz = this;
      if(isSearch)
        thiz.searchParam.pagingQuery.pageIndex = 1;//重置为第一页
      thiz.$tupHttp(thiz,'product/product/selectProductBypCodeOrpName','POST',thiz.searchParam).then(res=>{
        thiz.productData = res.body.models;
        thiz.total = res.body.pageInfo.total
      })
    }
  },
  mounted () {
    //this.searchProduct();
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

