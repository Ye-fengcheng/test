<template>
  <div>
    <div>
      <el-button icon="el-icon-plus" @click="addGift" size="mini" ></el-button>
      <!-- <el-upload
        style="float:left;margin-left:10px;"
        :show-file-list="false"
        :multiple="true"
        :httpRequest="upload">
        <el-button size="mini" type="primary">上传</el-button>
      </el-upload>   
      &nbsp;     
      <el-button size="mini" @click="$util.winOpen('http://smb.tupperware.net.cn/templates/促销-赠品.xlsx')" type="text">点击下载模板</el-button>
     -->
    </div>
    <el-table
      :data="gifts"
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
        label="数量(小单位)"
        width="110">
        <template slot-scope="scope">
          <el-input-number 
          v-model="scope.row.productNum"
          :min="1" 
          size="mini"
          label="描述文字"></el-input-number>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="productPercent"
        label="赠品比率"
        width="110">
        <template slot-scope="scope">
          <el-input-number 
          v-model="scope.row.productPercent"
          :min="1" 
          size="mini"
          label="描述文字"></el-input-number>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="jdePrice"
        width="80"
        label="JDE价格">
      </el-table-column> 
      <el-table-column
        prop="productPrice"
        label="单价"
        width="100">
        <template slot-scope="scope">
          <el-input
          v-model="scope.row.productPrice"
          size="mini"
          label="描述文字"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button icon="el-icon-plus"  @click="addGift" size="mini"></el-button>
          <el-button icon="el-icon-delete"  @click="deleteGifts(scope.$index, scope.row)" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
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
  name: 'tupGiftSelect',
  model: {
    prop: 'value',
    event: 'add'
  },
  props: {
    value:{
      type: Array,
      default: []
    }
  },
  data(){
    return {
      currentPage:1,
      total:10,
      multipleSelection:[],
      selectedOptions:[],
      options: [],
      ind:0,
      currentRow:{},
      gifts:this.value,
      visible:false,
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
      this.gifts = val;
    },
    selectedOptions:function(val){
      debugger
      if(val.length == 0){
        this.searchParam.condition.catalogCode = '';
      }
      else{
        this.searchParam.condition.catalogCode = val[1].split('|')[0];
      }
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
      this.currentRow.productName = row.pName;
      this.currentRow.productCode = row.pCode;
      this.currentRow.jdePrice = row.jdePrice;
      this.currentRow.productPrice = row.jdePrice ? row.jdePrice : 0
      this.addGift()
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
        arr.push({
          productName:datas.sheet0[i][0],
          productCode:datas.sheet0[i][1],
          productNum:datas.sheet0[i][2],
          productPercent:datas.sheet0[i][3],
          productPrice:datas.sheet0[i][4]
        })     
      }
      let concatArr = this.gifts.concat(arr)
      let uniqueArr = [];
      concatArr.forEach((item)=>{
        let had = uniqueArr.some(data=>{
          return data.productCode == item.productCode
        })
        if(!had)
          uniqueArr.push(item)
      })
      this.gifts = uniqueArr;
      this.$emit('add',this.gifts);
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
    addGift(){
      this.gifts.push({
        productName:'',
        productCode:'',
        productNum:1,
        jdePrice:0,
        productPercent:1,
        productPrice:0
      });
      this.$emit('add',this.gifts);
    },
    adds(){
      this.gifts.splice(this.ind,1);
      this.multipleSelection.map(item=>{
        this.gifts.push({
          productName:item.pName,
          productCode:item.pCode,
          productNum:1,
          jdePrice:item.jdePrice,
          productPercent:1,
          productPrice:item.jdePrice ? item.jdePrice : 0
        });
      })
      this.$emit('add',this.gifts);
      this.visible = false;
      this.multipleSelection = [];
      //清除之前的搜索选项
      this.searchParam.condition.pCode = '';
      this.searchParam.condition.pName = '';
      this.searchParam.condition.catalogCode = '';
      this.searchProduct(true);
    },
    deleteGifts(ind,row){
      this.gifts.splice(ind,1);
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
      this.currentRow.productPrice = row.jdePrice ? row.jdePrice : 0
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

