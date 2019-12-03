<template>
  <div>
    <el-form  :model="searchForm" label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="chineseName">
            <el-input v-model="searchForm.chineseName"  placeholder="chineseName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="itemNo">
            <el-input v-model="searchForm.itemNo"  placeholder="itemNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
        </el-col>
      </el-row>
      <el-form-item>
        <el-button style="float:left" type="primary" icon="el-icon-search" size="mini" @click="loadData(true)">查询</el-button>
        <el-button style="float:left" icon="el-icon-download" :loading="loading" size="mini" @click="downLoad()" type="primary">导出</el-button>
      </el-form-item>
    </el-form>
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
        prop="itemNo"
        label="Item_No"
        width="100">
      </el-table-column>
      <el-table-column
        prop="productDescription"
        label="Product_Description"
        width="250">
      </el-table-column>
      <el-table-column
        prop="chineseName"
        label="Chinese_Name"
        width="250">
      </el-table-column>
      <el-table-column
        prop="platform"
        label="Platform"
        sortable
        width="150">
      </el-table-column>
      <el-table-column
        prop="retailPriceRange"
        label="零售价格区间"
        width="100">
      </el-table-column>   
      <el-table-column
        prop="topN"
        label="TOP_N"
        width="100">
      </el-table-column>
      <el-table-column
        prop="topNCoefficient"
        label="TOP_N系数"
        width="100">
      </el-table-column>
      <el-table-column
        prop="masterSales"
        label="master_sales"
        width="150">
      </el-table-column>
      <el-table-column
        prop="category"
        label="Category"
        sortable
        width="150">
      </el-table-column>
      <el-table-column
        prop="chinaSubCategory"
        label="China_Sub_Category"
        sortable
        width="250">
      </el-table-column>
      <el-table-column
        prop="prodLine"
        label="Prod_Line"
        width="150">
      </el-table-column>
      <el-table-column
        prop="gpManagement"
        label="GP_management "
        sortable
        width="250">
      </el-table-column>
      <el-table-column
        prop="salesType"
        label="Sales_Type"
        sortable
        width="250">
      </el-table-column>
      <el-table-column
        prop="pyramid"
        label="Pyramid"
        sortable
        width="150">
      </el-table-column>
      <el-table-column
        prop="globalCategory"
        label="Global_Category"
        width="150">
      </el-table-column>
      <el-table-column
        prop="globalSubCategory"
        label=" Global_Sub_Category"
        width="150">
      </el-table-column>
      <el-table-column
        prop="globalProdLine"
        label="Global_Prod_Line"
        width="150">
      </el-table-column>
      <el-table-column
        prop="memberSuit"
        label="会员套装"
        width="150">
        <template slot-scope="scope">   
          {{scope.row.memberSuit== 'Y' ? '是' : (scope.row.memberSuit== 'N' ? '否' : '')}}
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="regionalPromotion"
        label="区域促销"
        width="150">
        <template slot-scope="scope">   
          {{scope.row.regionalPromotion== 'Y' ? '是' : (scope.row.regionalPromotion== 'N' ? '否' : '')}}
        </template>
      </el-table-column>
      <el-table-column
        prop="temporaryPromotion"
        label="临时促销"
        width="150">
        <template slot-scope="scope">   
          {{scope.row.temporaryPromotion== 'Y' ? '是' : (scope.row.temporaryPromotion== 'N' ? '否' : '')}}
        </template>
      </el-table-column>
      <el-table-column
        prop="groupPurchase"
        label="团购"
        width="150">
        <template slot-scope="scope">   
          {{scope.row.groupPurchase== 'Y' ? '是' : (scope.row.groupPurchase== 'N' ? '否' : '')}}
        </template>
      </el-table-column> -->
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">          
          <el-button
            size="mini"          
            type="text"
            :loading="loading"
            @click="editItem(scope.$index, scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top:15px;">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="searchForm.pagingQuery.pageIndex"
        :page-size="20"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog title="选择产品系列"  width="30%" top="15%" :visible.sync="dialogVisible">
      <el-button @click="addCatalog" size="mini" icon="el-icon-plus">添加分类</el-button>
      <br/>
      <div style="margin-top:5px;" v-for="(item,index) in selectedOptions" :key="index">
        <el-cascader
          :options="options"
          v-model="selectedOptions[index]">
        </el-cascader>
        &nbsp;
        <el-button @click="deleteCatalog(index)" icon="el-icon-delete"></el-button>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="saveSubCatalogCode">确认</el-button>
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        selectedOptions:[],
        options: [],
        loading:false,
        currentPage:1,
        total:0,
        Dictions:{
          retail_price_range : []
        },
        searchForm:{
          chineseName:'',
          itemNo:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:20
          }
        },
        tableData: [
        ],
        dialogVisible:false,
        tableLoading:false,
        itemIndex:-1//当前编辑的行索引
      }
    },
    watch:{
    },
    methods: {
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData();
      },
      saveSubCatalogCode(){      
        debugger  
        let thiz = this;
        let catalogs = [];
        this.selectedOptions.map(item=>{
          let data = {};
          data.parentCatalogCode = item[0].split('|')[0]
          data.parentCatalogName= item[0].split('|')[1]
          data.catalogCode = item[1].split('|')[0]
          data.catalogName= item[1].split('|')[1]
          catalogs.push(data)
        })
        this.tableData[this.itemIndex].catalogs = catalogs;
        this.dialogVisible = false;
      },
      saveItem(ind,row){
        debugger
        let thiz = this;
        this.loading = true;
        thiz.$tupHttp(thiz,'product/updateProductCatalog','POST',[row]).then(res=>{
          thiz.loadData()
          thiz.loading = false;
        },res=>{
          thiz.loading = false;
        }) 
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='retailPriceRange'){
          this.Dictions.retail_price_range.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }       
        return txt;
      },
      getSelectedOptions(val){
        let datas =[];
        let catalogs = this.tableData[val].catalogs ? this.tableData[val].catalogs:[];
        catalogs.map(item=>{
          let data = [];
          data.push(item.parentCatalogCode+'|'+item.parentCatalogName)
          data.push(item.catalogCode+'|'+item.catalogName)
          datas.push(data)
        })
        this.selectedOptions = datas;        
      },
      downLoad(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        thiz.$tupHttp(thiz,'mktProdClassification/createMktProdClassificationExcelByDTO','POST',data).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '文件已加入下载队列，稍后前往 "内容管理-导出下载" 下载文件'
          });
        },res=>{
          thiz.loading = false;
        })
      },
      addCatalog(){
        this.selectedOptions.push([])
      },
      deleteCatalog(index){
        this.selectedOptions.splice(index,1)
      },  
      editItem(ind,row){
        this.gotoUrl('/frame/product/productDetailHgl/'+row.itemNo+'/'+row.rowId)          
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      },     
      detail(index, row) {
        this.gotoUrl('/frame/terminal/customerInfo/'+row.id)
      },
      loadData(isSearch){
        let thiz = this;
        thiz.tableLoading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页

        this.$tupHttp(this,'mktProdClassification/getMktProdClassification','POST',thiz.searchForm).then(res=>{
          thiz.tableData = res.body.models
          thiz.total = res.body.pageInfo ? res.body.pageInfo.total :0;
          thiz.tableLoading = false;
        },res=>{
          thiz.tableLoading = false;
        })
      },
      loadDictions(){
        let thiz = this;
        let params = ["retail_price_range"];
        this.$baseData.getDicts(this,params,function(data){
          thiz.Dictions = data;
        });
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
      }
    },
    mounted(){
      this.loadDictions();
      this.loadData();
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
