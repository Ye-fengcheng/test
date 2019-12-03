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
        prop="areaCode"
        v-if="type == 1"
        label="地区设置"
        width="150">
        <template slot-scope="scope">
          <div>
            {{scope.row.areaCode == '999' ?'全国' :scope.row.provinceName}}
            <el-button 
            @click="editItemProvince(scope.$index, scope.row)"
            size="mini" 
            icon="el-icon-edit"></el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="areaCode"
        v-if="type == 2"
        width="180"
        label="门店编号">
        <template slot-scope="scope">
          <el-input
            style="width:150px"
            v-model="scope.row.areaCode"
            size="mini"
            label="描述文字"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="pCode"
        width="250"
        label="产品编号">
        <template slot-scope="scope">
          <el-autocomplete
            placeholder="不少于4个字"
            :fetch-suggestions="queryProductAsync"
            @select="handleSelect"
            size="mini"
            v-model="scope.row.pCode">
            <el-button @click="selectProduct(scope.$index, scope.row)" slot="append" icon="el-icon-search"></el-button>
            <template slot-scope="{ item }">
              <div style="text-overflow: ellipsis;overflow: hidden;font-size:10px">{{ item.pCode }}</div>
              <span style="color: #b4b4b4;font-size:10px">{{ item.pName }}</span>
            </template>
          </el-autocomplete>
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
        prop="orderRatio"
        width="180"
        label="订货比比率">
        <template slot-scope="scope">
          <el-input-number 
            style="width:180px"
            v-model="scope.row.orderRatio"
            :min="1" 
            size="mini"
            label="描述文字"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button icon="el-icon-tickets"  @click="copyProduct(scope.$index, scope.row)" size="mini"></el-button>
          <el-button icon="el-icon-delete"  @click="deleteConProduct(scope.$index, scope.row)" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="选择地区" width="30%" top="5%" :visible.sync="dialogVisible">
      <tup-arae-store-select ref="areaSelect" v-model="areaData" :needstore="false"></tup-arae-store-select>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="saveArea">确认</el-button>
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="选择产品"
      :visible.sync="visible"  
      width="60%">
      <el-form :inline="true" :model="searchParam" class="demo-form-inline">
        <el-form-item label="产品编号">
          <el-input size="mini" clearable v-model="searchParam.condition.pCode" style="width:150px;" placeholder="产品编号"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input size="mini" clearable v-model="searchParam.condition.pName" style="width:150px;" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="searchProduct(true)">查询</el-button>
          <el-button type="success" :disabled="multipleSelection.length==0" size="mini" @click="adds()">批量选择</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="productData"
        @row-dblclick="rowDblClick"
        @selection-change="handleSelectionChange"
        style="width: 100%;height:300px;overflow-y:scroll">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
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
  name: 'fmsPropotionTable',
  model: {
    prop: 'value',
    event: 'add'
  },
  props: {
    type: {
      type: Number,
      default: 1
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
      multipleSelection:[],
      ind:-1,
      total:0,
      products:this.value,
      fileUrl:'',
      visible:false,
      productData:[],
      dialogVisible:false,
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
    handleSelect(row) {
      this.currentRow.pName = row.pName;
      this.currentRow.pCode = row.pCode;
    },
    handleClick(row, event, column){
      this.currentRow = row;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    handleCurrentChange(val) {
      this.searchParam.pagingQuery.pageIndex = val;
      this.searchProduct();
    },
    addProduct(num){
      if(!num){
        num = 1;
      }
      for(let i=0;i<num;i++){
        this.products.push({
          areaCode:'',
          provinceName:'',
          pCode:'',
          orderRatio:'',
          type:this.type
        });
      }      
      this.$emit('add',this.products);
    },
    adds(){
      this.products.splice(this.ind,1);
      this.multipleSelection.map(item=>{
        this.products.push({
          areaCode:'',
          provinceName:'',
          pCode:item.pCode,
          orderRatio:'',
          type:this.type
        });
      })
      this.$emit('add',this.products);
      this.visible = false;
      this.multipleSelection = [];
      //清除之前的搜索选项
      this.searchParam.condition.pCode = '';
      this.searchParam.condition.pName = '';
      this.searchProduct();
    },
    getArea(){
      let val = this.$refs.areaSelect.getValues();
      if(!val){
        val = this.areaData;
      }
      if(val.isarea==='1'){
        let codeArray = [];
        let nameArray = [];
        val.targetAreas.map(item=>{
          codeArray.push(item.code);
          nameArray.push(item.name);
        })
        this.products[this.itemIndex].areaCode = codeArray.join(',');
        this.products[this.itemIndex].provinceName = nameArray.join(',');
      }
    },
    setArea(val){
      let thiz = this;  
      let areas = this.products[val].areaCode.split(',');
      let names = this.products[val].provinceName.split(',');
      if(areas){
        let datas = [];
        for(let i=0;i<areas.length;i++){
          datas.push({
            code:areas[i],
            name:names[i]
          })
        }
        setTimeout(function(){
          thiz.areaData = {
            isarea:'1',
            data: datas
          }
        })          
      }
      else{
        setTimeout(function(){
          thiz.areaData = {
            isarea:'1',
            data: []
          }
        }) 
      } 
    },
    saveArea(){     
      this.getArea();
      this.dialogVisible = false;
    },
    editItemProvince(ind,row){
      this.itemIndex = ind;
      this.setArea(ind);
      this.dialogVisible = true;        
    },
    copyProduct(ind,row){
      this.products.push({
        areaCode:row.areaCode,
        provinceName:row.provinceName,
        pCode:row.pCode,
        orderRatio:row.orderRatio,
        type:row.type
      });
    },
    deleteConProduct(ind,row){
      this.products.splice(ind,1);
    },
    selectProduct(ind,row){
      this.currentRow = row;
      this.ind = ind;
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
    searchProduct(isSearch){
      let thiz = this;
      if(isSearch)
        thiz.searchParam.pagingQuery.pageIndex = 1;//重置为第一页
      thiz.$baseData.productList(thiz,thiz.searchParam).then(res=>{
        thiz.productData = res.body.models;
        thiz.total = res.body.pageInfo ? res.body.pageInfo.total:0
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

