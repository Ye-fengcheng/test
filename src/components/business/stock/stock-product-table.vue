<template>
  <div>
    <div v-show="!disabled">
      <el-button style="float:left" icon="el-icon-plus"  @click="addProduct(1)" size="mini" >添加</el-button>
      <el-button style="float:left" icon="el-icon-plus"  @click="addProduct(10)" size="mini" >添加10条</el-button>
			<br/><br/>
		</div>            
    <el-table
      :data="products"
      style="width: 99%;"
      :height="tableHeight"
      @row-click="handleClick"
      highlight-current-row>
      <el-table-column
        type="index"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="topN"
        label="TOP_N">
        <template slot-scope="scope">
					{{scope.row.topN}}
          <el-autocomplete
						v-show="!disabled"
            placeholder="不少于2个字"
            :fetch-suggestions="queryTopNAsync"
            @select="topNSelect"
            size="mini"
            v-model="scope.row.pCode">
            <template slot-scope="{ item }">
              <div style="text-overflow: ellipsis;overflow: hidden;">{{ item.topN }}</div>
              <span style="color: #b4b4b4;">{{ item.itemName }}</span>
            </template>
          </el-autocomplete>
        </template>
      </el-table-column>   
      <el-table-column
        prop="itemNo"
        label="产品编号">
        <template slot-scope="scope">
					<div style="width: 150px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" :title="scope.row.itemNo">{{scope.row.itemNo}}</div>
          <el-autocomplete
						v-show="!disabled && !scope.row.noPcodeSelect"
            placeholder="输入产品编号"
            :fetch-suggestions="queryProductAsync"
            @select="handleSelect"
            size="mini"
            v-model="scope.row.itemNoKey">
						<el-button @click="selectProduct(scope.$index, scope.row)" slot="append" icon="el-icon-search"></el-button>
            <template slot-scope="{ item }">
              <div style="text-overflow: ellipsis;overflow: hidden;">{{ item.itemNo }}</div>
              <span style="color: #b4b4b4;">{{ item.chineseName }}({{item.topN}})</span>
            </template>
          </el-autocomplete>
        </template>
      </el-table-column>  
			<el-table-column
        prop="productName"
        width="150"
        label="产品名称">
        <template slot-scope="scope">
					<div style="width: 150px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" :title="scope.row.productName">{{scope.row.productName}}</div>
        </template>
      </el-table-column>
			<el-table-column
        prop="unit"
        width="80"
        label="单位">
				<template slot-scope="scope">
          <el-input
            size="mini"
						:disabled="disabled"
            v-model="scope.row.unit">
          </el-input>
        </template>
      </el-table-column>  
			<el-table-column
        prop="price"
        width="120"
        label="价格">
        <template slot-scope="scope">
          <el-input
            size="mini"
						:disabled="disabled"
            v-model="scope.row.price">
          </el-input>
        </template>
      </el-table-column>    
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button icon="el-icon-tickets" v-show="!disabled"  @click="copyProduct(scope.$index, scope.row)" size="mini"></el-button>
          <el-button icon="el-icon-delete" v-show="!disabled"  @click="deleteConProduct(scope.$index, scope.row)" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="选择产品"
      :visible.sync="visible"  
      width="60%">
      <el-form :inline="true" :model="searchParam" class="demo-form-inline">
        <el-form-item label="产品编号">
          <el-input clearable v-model="searchParam.itemNo" style="width:150px;" placeholder="产品编号"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input clearable v-model="searchParam.chineseName" style="width:150px;" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchProduct()">查询</el-button>
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
          prop="itemNo"
          label="产品编号">
        </el-table-column>  
        <el-table-column
          prop="chineseName"
          label="产品名称">
        </el-table-column> 
				<el-table-column
          prop="topN"
          label="TOP_N">
        </el-table-column> 
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'stockProductTable',
  model: {
    prop: 'value',
    event: 'add'
  },
  props: {
    type: {
      type: String,
      default: ""
		},
		disabled:{
			type: Boolean,
      default: false
		},
    value:{
      type: Array,
      default: []
    },
    first:{
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      areaData:{
        isarea:'1',
        data:[]
      },
      tableHeight:parseInt(document.documentElement.clientHeight-200),
      currentRow:{},
      products:this.value,
      fileUrl:'',
      visible:false,
      productData:[],
      dialogVisible:false,
      itemIndex:-1,//当前编辑的行索引
      searchParam:{
				chineseName:'',
				itemNo:'',
				pagingQuery:{
					pageIndex:1,
					pageSize:20
				}
			}
    }
  },
  watch:{
    value:function(val){
      this.products = val;
    }
  },
  methods: { 
    queryTopNAsync(queryString, cb) {
			if(queryString.length < 2){
				cb([])
				return;
      }
      let thiz = this;
      thiz.$tupHttp(this,'stockProductManage/getMktDataByTopN?topNOrItemNo='+queryString,'GET').then(res=>{
        let productData = res.body.models;
        cb(productData)
      })
      
    },
    queryProductAsync(queryString, cb) {
      if(queryString.length < 4){
        cb([])
        return;
      }
      let thiz = this;
      let searchParam = {
				itemNo:queryString,
				pagingQuery:{
					pageIndex:1,
					pageSize:10
				}
			}
			thiz.$tupHttp(this,'stockProductManage/getMktProdClassification','POST',searchParam).then(res=>{
        let productData = res.body.models;
        cb(productData)
      })
    },
    topNSelect(row){
      this.currentRow.productName = row.itemName;
			this.currentRow.itemNo = row.itemNo;
			this.currentRow.topN = row.topN;
      this.currentRow.noPcodeSelect = true;
			this.currentRow.price = row.price ? Math.min.apply(null, row.price.split(',')):0;
    },
    handleSelect(row) {
      this.currentRow.productName = row.chineseName;
			this.currentRow.itemNo = row.itemNo;
			this.currentRow.topN = row.topN;
			this.currentRow.price = row.price ? row.price:0;
    },
    handleClick(row, event, column){
      this.currentRow = row;
    },
    addProduct(num){
      if(!num){
        num = 1;
			}
      for(let i=0;i<num;i++){
        this.products.push({
					itemNo:'',
					price:0,
					productName:'',
					rowId:'',
					topN:'',
					unit:''
        });
      }      
      this.$emit('add',this.products);
    },
    editItemProvince(ind,row){
      this.itemIndex = ind;
      this.setArea(ind);
      this.dialogVisible = true;        
    },
    copyProduct(ind,row){
      this.products.push({
				itemNo:row.itemNo,
				price:row.price,
				productName:row.productName,
				rowId:'',
				topN:row.topN,
				unit:row.unit
			});
    },
    deleteConProduct(ind,row){
      this.products.splice(ind,1);
    },
    selectProduct(ind,row){
      this.currentRow = row;
      this.visible = true;
    },
    rowDblClick(row, event){
			this.visible = false;
      this.currentRow.productName = row.chineseName;
			this.currentRow.itemNo = row.itemNo;
			this.currentRow.topN = row.topN;
			this.currentRow.price = row.price ? row.price:0;
      //清除之前的搜索选项
      this.searchParam.chinese = '';
      this.searchParam.itemNo = '';
      this.searchProduct();
    },
    searchProduct(){
      let thiz = this;
      this.$tupHttp(this,'stockProductManage/getMktProdClassification','POST',thiz.searchParam).then(res=>{
        thiz.productData = res.body.models;
      })
    }
  },
  mounted () {
    this.searchProduct()
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

