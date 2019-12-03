<template>
  <div>
    <div>
      <el-button icon="el-icon-plus" :disabled="products.length===1 && type==='kit' " @click="addProduct" size="mini" ></el-button>
      <!-- 
        <el-upload
        style="float:left;margin-left:10px;"
        :show-file-list="false"
        :multiple="true"
        :httpRequest="upload">
        <el-button size="mini" type="primary">上传</el-button>
      </el-upload>   
      &nbsp;     
      <el-button v-if="type!='kit'" @click="$util.winOpen(fileUrl)" size="mini" type="text">点击下载模板</el-button>
      -->    
  </div>            
    <el-table
      :data="products"
      style="width: 99%;"
      @row-click="handleClick"
      highlight-current-row>
      <el-table-column
        prop="productCode"
        width="280"
        label="产品编号">
        <template slot-scope="scope">
          <el-autocomplete
            placeholder="不少于4个字"
            :fetch-suggestions="queryProductAsync"
            @select="handleSelect"
            size="mini"
            v-model="scope.row.productCode">
            <el-button @click="selectProduct(scope.$index, scope.row)" slot="append" icon="el-icon-search"></el-button>
            <template slot-scope="{ item }">
              <div style="text-overflow: ellipsis;overflow: hidden;font-size:10px">{{ item.pCode }}</div>
              <span style="color: #b4b4b4;font-size:10px">{{ item.pName }}</span>
            </template>
          </el-autocomplete>
        </template>
      </el-table-column>  
      <el-table-column
        prop="productName"
        label="产品名称">
      </el-table-column>    
      <el-table-column
        prop="productNum"
        width="110"
        label="订货比例">
        <template slot-scope="scope">
          <el-button v-show="giftpack == 0" type="text" :disabled="!scope.row.productCode" @click="loadProportion(scope.row.productCode)" size="mini">查看详情</el-button>      
          <span v-show="giftpack == 1">1</span>
        </template>
      </el-table-column>      
      <el-table-column
        prop="productNum"
        width="110"
        v-if="type=='kit'"
        label="数量">
        <template slot-scope="scope">
          <el-input-number 
            v-model="scope.row.productNum"
            :min="1" 
            size="mini"
            label="描述文字"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column
        prop="jdePrice"
        width="80"
        label="JDE价格">
      </el-table-column>     
      <el-table-column
        prop="productPriceOld"
        width="110"
        label="价格">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.productPriceOld"
            size="mini"
            label="描述文字"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="MQQ"
        width="110"
        v-if="first==true"
        label="起订量">
        <template slot-scope="scope">
          <el-input-number 
            v-model="scope.row.MQQ"
            :min="0" 
            size="mini"
            label="描述文字"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button icon="el-icon-plus"   @click="addProduct" size="mini"></el-button>
          <el-button icon="el-icon-delete"  @click="deleteConProduct(scope.$index, scope.row)" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="订货比例"
      :visible.sync="proportionVisible"  
      width="70%">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="区域/省办" name="zero">
          <el-table
            :data="tableData"
            style="width: 100%;"
            height="450"
            highlight-current-row>
            <el-table-column
              type="index"
              label="序号"
              width="50">
            </el-table-column>
            <el-table-column
              prop="areaName"
              label="区域"
              width="100">
            </el-table-column>
            <el-table-column
              prop="provinceName"
              label="省办"
              width="100">
            </el-table-column>
            <el-table-column
              prop="pCode"
              label="产品编号"
              width="100">
            </el-table-column>
            <el-table-column
              prop="pName"
              label="产品名称"
              sortable
              width="250">
            </el-table-column>
            <el-table-column
              prop="catalogs"
              label="产品系列"
              width="250">
              <template slot-scope="scope">
                <div>
                  <span v-for="(item,index) in (scope.row.catalogs ? scope.row.catalogs:[])" :key="index">{{item ? (item.catalogName ? item.catalogName :'') : ''}},</span>&nbsp;
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="price"
              label="单价"
              sortable
              width="80">
            </el-table-column>
            <el-table-column
              prop="orderRatio"
              label="订货比率"
              width="150">
            </el-table-column>
            <el-table-column
              prop="inserttime"
              label="创建时间"
              :formatter="formatter"
              sortable
              width="150">
            </el-table-column>
            <el-table-column
              prop="updatetime"
              label="修改时间"
              :formatter="formatter"
              sortable
              width="150">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="门店" name="first">
          <el-table
            :data="tableData1"
            style="width: 100%;"
            height="450"
            highlight-current-row>
            <el-table-column
              type="index"
              label="序号"
              width="50">
            </el-table-column>
            <el-table-column
              prop="areaCode"
              label="门店"
              width="100">
            </el-table-column>
            <el-table-column
              prop="pCode"
              label="产品编号"
              width="100">
            </el-table-column>
            <el-table-column
              prop="pName"
              label="产品名称"
              sortable
              width="250">
            </el-table-column>
            <el-table-column
              prop="catalogs"
              label="产品系列"
              width="250">
              <template slot-scope="scope">
                <div>
                  <span v-for="(item,index) in (scope.row.catalogs ? scope.row.catalogs:[])" :key="index">{{item ? (item.catalogName ? item.catalogName :'') : ''}},</span>&nbsp;
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="price"
              label="单价"
              sortable
              width="80">
            </el-table-column>
            <el-table-column
              prop="orderRatio"
              label="订货比率"
              width="150">
            </el-table-column>
            <el-table-column
              prop="inserttime"
              label="创建时间"
              :formatter="formatter"
              sortable
              width="150">
            </el-table-column>
            <el-table-column
              prop="updatetime"
              label="修改时间"
              :formatter="formatter"
              sortable
              width="150">
            </el-table-column>
          </el-table>
        </el-tab-pane>
    </el-tabs>
    </el-dialog>
    <el-dialog
      title="选择产品"
      :visible.sync="visible"  
      width="70%">
      <el-form :inline="true" :model="searchParam" class="demo-form-inline">
        <el-form-item label="产品编号">
          <el-input size="mini" clearable v-model="searchParam.condition.pCode" style="width:150px;" placeholder="产品编号"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input size="mini" clearable v-model="searchParam.condition.pName" style="width:150px;" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="产品系列">
          <el-cascader
            size="mini"
            :options="options"
            clearable
            v-model="selectedOptions">
          </el-cascader>
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
  name: 'tupProductSelect',
  model: {
    prop: 'value',
    event: 'add'
  },
  props: {
    type: {
      type: String,
      default: ""
    },
    giftpack: {
      type: Number,
      default: 0
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
      tableData:[],
      tableData1:[],
      currentPage:1,
      activeName:'zero',
      total:10,
      multipleSelection:[],
      selectedOptions:[],
      options: [],
      ind:0,
      currentRow:{},
      products:this.value,
      fileUrl:'',
      visible:false,
      proportionVisible:false,
      productData:[],
      searchParam:{
        condition:{
          pCode: "",
          pName: "",
          catalogCode:""
        },
        pagingQuery:{
          pageIndex:1,
          pageSize:50
        }
      }
    }
  },
  watch:{
    value:function(val){
      this.products = val;
    },
    selectedOptions:function(val){
      if(val.length == 0){
        this.searchParam.condition.catalogCode = '';
      }
      else{
        this.searchParam.condition.catalogCode = val[1].split('|')[0];
      }
    }
  },
  methods: { 
    formatter(row, column) {
      let txt = ''
      if(column.property =='inserttime' || column.property =='updatetime'){
        if(row[column.property])
          txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss");
      }
      return txt;
    },
    loadData(pCode){
      let thiz = this;
      let searchForm = {
        date:[],
        condition:{
          pCode:pCode,
          type:1,
        },
        pagingQuery:{
          pageIndex:1,
          pageSize:20
        }
      }
      thiz.$tupHttp(thiz,'product/listOrderProportion','POST',searchForm).then(res=>{
        thiz.tableData = res.body.models;
      })
      let searchForm1  = {
        date:[],
        condition:{
          pCode:pCode,
          type:2,
        },
        pagingQuery:{
          pageIndex:1,
          pageSize:20
        }
      }
      thiz.$tupHttp(thiz,'product/listOrderProportion','POST',searchForm1).then(res=>{
        thiz.tableData1 = res.body.models;
      })
    },
    loadProportion(pCode){
      this.proportionVisible = true;
      this.loadData(pCode)
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
    handleSelect(row) {
      this.currentRow.productName = row.pName;
      this.currentRow.productCode = row.pCode;
      this.currentRow.jdePrice = row.jdePrice;
      this.currentRow.productPriceOld = row.jdePrice ? row.jdePrice : 0
      this.currentRow.productPriceNew = row.jdePrice ? row.jdePrice : 0
      this.addProduct()
    },
    handleClick(row, event, column){
      this.currentRow = row;
    },
    handleCurrentChange(val) {
      this.searchParam.pagingQuery.pageIndex = val;
      this.searchProduct();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },   
    upload(option){     
      this.$util.readExcel(option.file,this.treatDatas)
    },
    treatDatas(datas){
      let arr = [];
      for(let i =1;i<datas.sheet0.length;i++){
        if(this.type=='kit'){
          arr.push({
            productName:datas.sheet0[i][0],
            productCode:datas.sheet0[i][1],
            productNum:datas.sheet0[i][2],
            productPriceOld:0,
            productPriceNew:0,
            MQQ:this.first ? datas.sheet0[i][3] : 0
          })
        }
        else if(this.type=='discount'){
          arr.push({
            productName:datas.sheet0[i][0],
            productCode:datas.sheet0[i][1],
            productNum:1,
            productPriceOld:datas.sheet0[i][2],
            productPriceNew:datas.sheet0[i][3],
            MQQ:0
          })
        }
        else{
          arr.push({
            productName:datas.sheet0[i][0],
            productCode:datas.sheet0[i][1],
            productNum:1,
            productPriceOld:datas.sheet0[i][2],
            productPriceNew:datas.sheet0[i][3],
            MQQ:this.first ? datas.sheet0[i][4] : 0
          })
        }        
      }
      let concatArr = this.products.concat(arr)
      let uniqueArr = [];
      concatArr.forEach((item)=>{
        let had = uniqueArr.some(data=>{
          return data.productCode == item.productCode
        })
        if(!had)
          uniqueArr.push(item)
      })
      this.products = uniqueArr;
      this.$emit('add',this.products);
    },
    getOptions(datas){
      let thiz = this;
      let options = [];
      if(datas){
        datas.map(item=>{
          item.value = item.code+'|'+item.codeDesc;
          item.label = item.codeDesc;
          if(item.childCatalogs)
            item.children = thiz.getOptions(item.childCatalogs)
          options.push(item);
        })
      }
      return options;
    },
    loadProductCatalog(){
      let thiz = this;
      this.$baseData.productCatalog(this).then(res=>{
        let datas = res.body.models;
        thiz.options = thiz.getOptions(datas);
      })
    },
    addProduct(){
      this.products.push({
        productName:'',
        productCode:'',
        productNum:1,
        jdePrice:0,
        productPriceOld:0,
        productPriceNew:0,
        MQQ:0
      });
      this.$emit('add',this.products);
    },
    adds(){
      this.products.splice(this.ind,1);
      this.multipleSelection.map(item=>{
        this.products.push({
          productName:item.pName,
          productCode:item.pCode,
          productNum:1,
          jdePrice:item.jdePrice,
          productPriceOld:item.jdePrice ? item.jdePrice : 0,
          productPriceNew:item.jdePrice ? item.jdePrice : 0,
          MQQ:0
        });
      })
      this.$emit('add',this.products);
      this.visible = false;
      this.multipleSelection = [];
      //清除之前的搜索选项
      this.searchParam.condition.pCode = '';
      this.searchParam.condition.pName = '';
      this.searchParam.condition.catalogCode = '';
      this.searchProduct(true);
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
      this.currentRow.productName = row.pName;
      this.currentRow.productCode = row.pCode;
      this.currentRow.jdePrice = row.jdePrice;
      this.currentRow.productPriceOld = row.jdePrice ? row.jdePrice : 0
      this.currentRow.productPriceNew = row.jdePrice ? row.jdePrice : 0
      //清除之前的搜索选项
      this.searchParam.condition.pCode = '';
      this.searchParam.condition.pName = '';
      this.searchParam.condition.catalogCode = '';
      this.searchProduct(true);
    },
    searchProduct(isSearch){
      let thiz = this;
      if(isSearch)
        thiz.searchParam.pagingQuery.pageIndex = 1;//重置为第一页
      thiz.$baseData.productList(thiz,thiz.searchParam).then(res=>{
        thiz.productData = res.body.models;
        thiz.total = res.body.pageInfo.total
      })
    }
  },
  mounted () {
    $('.el-upload__input').hide();
    if(this.type=='discount'){
      this.fileUrl = 'http://smb.tupperware.net.cn/templates/优惠产品.xlsx'
    }
    else{
      if(this.first){
        this.fileUrl = 'http://smb.tupperware.net.cn/templates/满赠-搭配-产品(首订).xlsx'
      }
      else{
        this.fileUrl = 'http://smb.tupperware.net.cn/templates/满赠-搭配-产品.xlsx'
      }
    }
    //this.searchProduct(true);
    this.loadProductCatalog();
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

