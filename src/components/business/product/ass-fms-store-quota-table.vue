<template>
  <div>
    <div>
      <el-button style="float:left" icon="el-icon-plus" :disabled="products.length > 99" @click="addProduct(1)" size="mini" >添加</el-button>
      <el-button style="float:left" icon="el-icon-plus" :disabled="products.length > 90" @click="addProduct(10)" size="mini" >添加10条</el-button>
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
        fixed
        width="50">
      </el-table-column>
      <el-table-column
        prop="clientId"
        width="250"
        label="专卖店编号">
        <template slot-scope="scope">
          <el-input-customer size="mini" v-model="scope.row.client" :param="scope.row" @onSelect="handleRowSelect" ></el-input-customer>
        </template>
      </el-table-column>
      <el-table-column
        prop="clientName"
        label="专卖店名称"
        width="120">
      </el-table-column>  
      <el-table-column
        prop="pCode"
        width="250"
        label="产品编号">
        <template slot-scope="scope">
          <el-input-product-code 
            v-model="scope.row.pCode"
            :param="scope"
            :pStatus="1"
            @onSelect="handleSelect"
            size="mini">
          </el-input-product-code>
         <!--  <el-input
            placeholder="选择产品"
            v-model="scope.row.pCode"
            size="mini"
            :disabled="true">
            <el-button @click="selectProduct(scope.$index, scope.row)" slot="append" icon="el-icon-search"></el-button>
          </el-input> -->
        </template>
      </el-table-column>   
      <el-table-column
        prop="pName"
        label="产品名称"
        width="150">
      </el-table-column>       
      <el-table-column
        prop="quotaQty"
        width="100"
        label="配额数量">
        <template slot-scope="scope">
          <el-input 
            v-model="scope.row.quotaQty"
            size="mini"
            label="描述文字"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="mustQty"
        width="100"
        label="必定数量">
        <template slot-scope="scope">
          <el-input 
            v-model="scope.row.mustQty"
            size="mini"
            label="描述文字"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="mqq"
        width="100"
        label="最低订量">
        <template slot-scope="scope">
          <el-input 
            v-model="scope.row.mqq"
            size="mini"
            label="描述文字"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="isAccumulate"
        width="110"
        label="是否累计">
        <template slot-scope="scope">
          <el-switch
            :active-value="1"
            :inactive-value="0"
            v-model="scope.row.isAccumulate">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="beginTime"
        width="170"
        label="开始时间">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.beginTime"
            size="mini"
            style="width:140px"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column
        prop="endTime"
        width="170"
        label="结束时间">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.endTime"
            style="width:140px"
            size="mini"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column
      width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button icon="el-icon-tickets"  @click="copyProduct(scope.$index, scope.row)" size="mini"></el-button>
          <el-button icon="el-icon-delete"  @click="deleteConProduct(scope.$index, scope.row)" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="选择产品"
      :visible.sync="visible"  
      width="60%">
      <el-form :inline="true" :model="searchParam" class="demo-form-inline">
        <el-form-item label="产品编号">
          <el-input clearable v-model="searchParam.condition.pCode" style="width:150px;" placeholder="产品编号"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input clearable v-model="searchParam.condition.pName" style="width:150px;" placeholder="名称"></el-input>
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
          prop="pCode"
          label="产品编号">
        </el-table-column>  
        <el-table-column
          prop="pName"
          label="产品名称">
        </el-table-column> 
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'fmsQuotaTable',
  model: {
    prop: 'value',
    event: 'add'
  },
  props: {
    type: {
      type: String,
      default: ""
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
      areaData1:{
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
      dialogAreaVisible:false,
      itemIndex:-1,//当前编辑的行索引
      searchParam:{
        condition:{
          pCode: "",
          pName: "",
          pStatus:1
        },
        pagingQuery:{
          pageIndex:0,
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
    handleRowSelect(param,row){
      param.clientName = row.pOrganName2
      param.clientId = row.pUid
    },
    queryProductAsync(queryString, cb) {
      if(queryString.length < 4){
        cb([])
        return;
      }
      let thiz = this;
      let searchParam = {
        condition:{
          pCode: queryString,
          pName: "",
          catalogCode:""
        },
        pagingQuery:{
          pageIndex:1,
          pageSize:10
        }
      }
      thiz.$baseData.productList(thiz,searchParam).then(res=>{
        let productData = res.body.models;
        cb(productData)
      })
    },
    handleSelect(product,scope){     
      scope.row.pName = product.pName
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
          regionName:'',
          clientId:'',
          clientName:'',
          isAccumulate:0,
          regionCodes:'',
          mustQty:'',
          mqq:'',
          pCode:'',
          pName:'',
          quotaQty:1,
          beginTime:'',
          endTime:''
        });
      }      
      this.$emit('add',this.products);
    },
    editItemRegion(ind,row){
      this.itemIndex = ind;
      this.setArea1(ind);
      this.dialogAreaVisible = true;        
    },
    editItemProvince(ind,row){
      this.itemIndex = ind;
      this.setArea(ind);
      this.dialogVisible = true;        
    },
    copyProduct(ind,row){
      this.products.push({
          clientId:row.clientId,
          client:row.client,
          clientName:row.clientName,
          pCode:row.pCode,
          pName:row.pName,
          isAccumulate:row.isAccumulate,
          mustQty:row.mustQty,
          mqq:row.mqq,
          quotaQty:row.quotaQty,
          beginTime:row.beginTime,
          endTime:row.endTime
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
      this.currentRow.pName = row.pName;
      this.currentRow.pCode = row.pCode;
      //清除之前的搜索选项
      this.searchParam.condition.pCode = '';
      this.searchParam.condition.pName = '';
      this.searchProduct();
    },
    searchProduct(){
      let thiz = this;
      thiz.$baseData.productList(thiz,thiz.searchParam).then(res=>{
        thiz.productData = res.body.models;
      })
    }
  },
  mounted () {
    $('.el-upload__input').hide();
    this.searchProduct();
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
.el-input-number--mini {
  width: 110px !important;
}
</style>

