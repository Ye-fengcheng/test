<template>
  <div>
    <el-form  :model="searchForm" label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="产品/零配件编号">
            <el-input-product-code 
              v-model="searchForm.condition.pCode"
              size="mini">
            </el-input-product-code>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="产品/零配件名称">
            <el-input v-model="searchForm.condition.pName" v-on:keyup.enter="loadData(true)" size="mini"  placeholder="产品/零配件名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="产品状态">
            <el-select v-model="searchForm.condition.pStatus" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="上架" :value="1"></el-option>
              <el-option label="下架" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="产品系列">
            <el-cascader
              size="mini"
              :options="options"
              clearable
              v-model="selectedOptions">
            </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否KIT产品">
            <el-select v-model="searchForm.condition.isKitProduct" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否有产品图片">
            <el-select v-model="searchForm.condition.isImg" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-form-item>
        <div style="line-height: 26px;">
          <el-button style="float:left;" icon="el-icon-search" type="primary" size="mini"  @click="loadData(true)">查询</el-button>
          <el-button style="float:left;" icon="el-icon-refresh" type="primary" size="mini" @click="resetForm">重置</el-button>
          <el-button style="float:left" icon="el-icon-upload2" @click="gotoUrl('/frame/product/productImport')"  size="mini" type="primary">上传kit产品</el-button>
          <el-button style="float:left" icon="el-icon-plus" @click="gotoUrl('/frame/product/addKitProduct')"  size="mini" type="primary">添加kit产品</el-button>
          <el-button style="float:left;" :disabled="searchForm.condition.isKitProduct!=1" icon="el-icon-download" :loading="loading" size="mini" @click="downLoad3()" type="primary">导出KIT产品</el-button>
          <el-button style="float:left" icon="el-icon-upload2" @click="gotoUrl('/frame/product/addPruductImg')"  size="mini" type="primary">批量导入产品图片</el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <div style="line-height: 26px;">
          <el-button style="float:left;" icon="el-icon-download" :loading="loading" size="mini" @click="downLoad()" type="primary">导出基础信息</el-button>
          <el-button style="float:left" icon="el-icon-upload2" @click="gotoUrl('/frame/product/productBaseImport')"  size="mini" type="primary">上传基础信息</el-button>
          <!-- <el-upload
            style="float:left;margin-left:10px;"
            :show-file-list="false"
            :multiple="true"
            :httpRequest="upload">
            <el-button :loading="loading" icon="el-icon-upload2" size="mini" type="primary">上传基础信息</el-button>
          </el-upload>  
          &nbsp;&nbsp;
          <el-button size="mini" style="float:left;margin-left:10px;" @click="$util.winOpen('https://tup-templates.tupperware.com.cn/ProductAttr.xls')" type="text">下载基础信息模板</el-button>
           -->
          <el-button style="float:left;" icon="el-icon-download" :loading="loading" size="mini" @click="downLoad2()" type="primary">导出上下架信息</el-button>
          <el-button style="float:left" icon="el-icon-upload2" @click="gotoUrl('/frame/product/productStatusImport')"  size="mini" type="primary">上传上下架信息</el-button>
          <!-- <el-upload
            style="float:left;margin-left:10px;"
            :show-file-list="false"
            :multiple="true"
            :httpRequest="upload2">
            <el-button :loading="loading" icon="el-icon-upload2" size="mini" type="primary">上传上下架信息</el-button>
          </el-upload>  
          &nbsp;&nbsp;
          <el-button size="mini" style="float:left;margin-left:10px;" @click="$util.winOpen('https://tup-templates.tupperware.com.cn/产品上下架模板.xlsx')" type="text">下载上下架模板</el-button> 
          -->
        </div>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      style="width: 100%;"
      v-loading="tableLoading"
      height="450"
      highlight-current-row
      :default-sort = "{prop: 'date', order: 'descending'}">
      <el-table-column
        type="index"
        label="序号"
        width="50">
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
        width="200">
      </el-table-column>
      <el-table-column
        prop="pEnglishName"
        label="产品英文名称"
        sortable
        width="200">
      </el-table-column>   
      <el-table-column
        prop="jdePrice"
        label="JDE价格"
        width="100">
      </el-table-column>
      <el-table-column
        prop="isDiscount"
        label="是否打折"
        width="110">
        <template slot-scope="scope">
          {{scope.row.isDiscount == 1 ?'是':'否'}}
        </template>
      </el-table-column> 
      <el-table-column
        prop="isKitProduct"
        label="是否KIT产品"
        width="110">
        <template slot-scope="scope">
          {{scope.row.isKitProduct == 1 ?'是':'否'}}
        </template>
      </el-table-column>        
      <el-table-column
        prop="pStatus"
        label="产品启用状态"
        width="110">
        <template slot-scope="scope">
          {{scope.row.pStatus == 1 ?'上架':'下架'}}
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="priceStartTime"
        label="产品启用架时间"
        :formatter="formatter"
        width="200">
         <template slot-scope="scope">
           {{new Date(scope.row.priceStartTime).format("yyyy-MM-dd")}} 至 {{new Date(scope.row.priceEndTime).format("yyyy-MM-dd")}}
         </template>
      </el-table-column> -->
      <!-- <el-table-column
        label="价格有效期"
        width="200">
         <template slot-scope="scope">
           {{new Date(scope.row.priceStartTime).format("yyyy-MM-dd")}} 至 {{new Date(scope.row.priceEndTime).format("yyyy-MM-dd")}}
         </template>
      </el-table-column> -->
      <el-table-column
        prop="catalogs"
        label="产品系列"
        width="180">
        <template slot-scope="scope">
          <div>
            <span v-for="(item,index) in scope.row.catalogs" :key="index">{{item ? (item.catalogName ? item.catalogName :'') : ''}},</span>&nbsp;
          </div>
        </template>
      </el-table-column>
       <el-table-column
        prop="jdeSyncTime"
        label="基础信息更新时间"
        :formatter="formatter"
        width="200">
       </el-table-column>
      <el-table-column
        prop="pOnSaleDate"
        label="产品上下架时间"
        :formatter="formatter"
        width="200">
         <template slot-scope="scope">
           {{scope.row.pOnSaleDate ? new Date(scope.row.pOnSaleDate).format("yyyy-MM-dd")+'至':''}}  {{scope.row.pOffSaleDate ? new Date(scope.row.pOffSaleDate).format("yyyy-MM-dd"):''}}
         </template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">          
          <el-button
            size="mini"          
            type="primary"
            @click="editItem(scope.$index, scope.row)">编辑</el-button>
          <!-- <el-button
            size="mini"          
            type="primary"
            :loading="loading"
            @click="saveItem(scope.$index, scope.row)">保存</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top:15px;">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.pagingQuery.pageIndex"
        :page-sizes="[50, 100, 200]"
        layout="slot,sizes, prev, pager, next, jumper"
        :total="total">
        <span class="el-pagination__total" v-if="total < $baseData.maxNumber">共&nbsp;{{total}}&nbsp;条</span>
        <span class="el-pagination__total" v-else>{{$baseData.maxTitle}}</span>
      </el-pagination>
    </div>
    <el-dialog title="导入出错数据" width="60%" top="5%" :visible.sync="dialogVisible">
      <el-table
        :data="errorTableData"
        style="width: 100%;"
        height="450"
        highlight-current-row
        :default-sort = "{prop: 'date', order: 'descending'}">
        <el-table-column
          prop="excelIndex"
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          prop="pCode"
          label="产品编码"
          width="100">
        </el-table-column>
        <el-table-column
          prop="category"
          label="Category"
          width="100">
        </el-table-column>
        <el-table-column
          prop="isTps"
          label="是否TPS"
          width="150">
        </el-table-column>
        <el-table-column
          prop="orderUnit"
          label="订货单位"
          width="150">
        </el-table-column>
        <el-table-column
          prop="message"
          label="错误信息">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="dialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="导入出错数据" width="80%" top="5%" :visible.sync="dialog2Visible">
      <el-table
        :data="errorTableData"
        style="width: 100%;"
        height="450"
        highlight-current-row
        :default-sort = "{prop: 'date', order: 'descending'}">
        <el-table-column
          prop="excelIndex"
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          prop="pCode"
          label="产品编码"
          width="100">
        </el-table-column>
        <el-table-column
          prop="boQuantity"
          label="Bo值"
          width="100">
        </el-table-column>
        <el-table-column
          prop="pSecuritystock"
          label="安全库存"
          width="150">
        </el-table-column>
        <el-table-column
          prop="pOnSaleDate"
          :formatter="formatter"
          label="产品上架时间"
          width="150">
        </el-table-column>
        <el-table-column
          prop="pOffSaleDate"
          :formatter="formatter"
          label="产品下架时间"
          width="150">
        </el-table-column>
        <el-table-column
          prop="message"
          label="错误信息">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="dialog2Visible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name:'keepAlive-product-onSale',
    data() {
      return {
        selectedOptions:[],
        options: [],
        loading:false,
        tableLoading:false,
        currentPage:1,
        total:0,
        Dictions:{
          brand_type:[],
          sales_platform:[],
          sales_type:[],
          order_unit:[],
          product_gp_management_type:[],
          product_pyramid_type:[]
        },//本页面使用的所有字典
        searchForm:{
          condition:{
            pCode:'',
            pName:'',
            isImg:'',
            pStatus:'',
            catalogCode:'',
            isKitProduct:''
          },
          pagingQuery:{
            pageIndex:1,
            pageSize:50
          }
        },
        dialogVisible:false,
        dialog2Visible:false,
        errorTableData: [
        ],
        tableData: [
        ],
        itemIndex:-1//当前编辑的行索引
      }
    },
    watch:{
      $route:function(val){
        if(val.path == '/frame/product/onSale'){
          if(this.total > 0){
            //有请求过数据需要重新加载列表
            this.loadData()
          }
          this.$util.onKeyCode(this,'loadData',[true])
        }
      },
      selectedOptions:function(val){
        if(val.length == 0){
          this.searchForm.condition.catalogCode = '';
        }
        else{
          this.searchForm.condition.catalogCode = val[1].split('|')[0];
        }
      }
    },
    methods: {
      resetForm(){
        this.selectedOptions = [];
        this.searchForm = {
          condition:{
            pCode:'',
            pName:'',
            isImg:'',
            pStatus:'',
            catalogCode:'',
            isKitProduct:''
          },
          pagingQuery:{
            pageIndex:1,
            pageSize:this.searchForm.pagingQuery.pageSize
          }
        }
      },
      getDicValue(name,code){
        let val = '';
        this.Dictions[code].map(item=>{
          if(name==item.dictName){
            val = item.dictValue;
          }
        })
        return val;
      },
      downLoad(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        delete data.pagingQuery;
        thiz.$tupHttp(thiz,'product/exportProductInfo','POST',data,{},'',true).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '文件已加入下载队列，稍后前往 "基础设置-内容管理-导出下载" 下载文件'
          });
        },res=>{
          thiz.loading = false;
        })
      },
      downLoad2(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        delete data.pagingQuery;
        thiz.$tupHttp(thiz,'product/exportProductOnOffSaleInfo','POST',data,{},'',true).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '文件已加入下载队列，稍后前往 "基础设置-内容管理-导出下载" 下载文件'
          });
        },res=>{
          thiz.loading = false;
        })
      },
      downLoad3(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        delete data.pagingQuery;
        thiz.$tupHttp(thiz,'public-service/product/exportKitProduct','POST',data,{},'/public-service/',false,'').then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '文件已加入下载队列，稍后前往 "基础设置-内容管理-导出下载" 下载文件'
          });
        },res=>{
          thiz.loading = false;
        })
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='priceStartTime' || column.property =='priceEndTime'  || column.property =='jdeSyncTime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss");
        }
        return txt;
      },
      upload(option){     
        this.$util.readExcel(option.file,this.treatDatas)
      },
      treatDatas(datas){
        let arr = [];
        for(let i =1;i<datas.sheet0.length;i++){
          arr.push({
            pCode:datas.sheet0[i][0],
            brand:this.getDicValue(datas.sheet0[i][1],'brand_type'),
            pFaremode:this.getDicValue(datas.sheet0[i][2],'sales_platform'),
            category:datas.sheet0[i][3],
            isTps:datas.sheet0[i][4] == 'Y' ? 1 : 0,
            coreLine:datas.sheet0[i][5],
            integerPoint:datas.sheet0[i][6],
            pProdpyramid:this.getDicValue(datas.sheet0[i][7],'product_pyramid_type'),
            pProdgpmanagement:this.getDicValue(datas.sheet0[i][8],'product_gp_management_type'),
            pMssnmlnprod:datas.sheet0[i][9],
            pProdsalestype:this.getDicValue(datas.sheet0[i][10],'sales_type'),
            pProdguaranteeperiod:datas.sheet0[i][11],
            pProdrolloutdate:datas.sheet0[i][12],
            orderUnit:datas.sheet0[i][13],
            pBoquantity:datas.sheet0[i][14],
            isPromotion:datas.sheet0[i][15] == 'Y' ? 1 : 0,
            isPrint:datas.sheet0[i][16] == 'Y' ? 1 : 0,
            isAuth:datas.sheet0[i][17] == 'Y' ? 1 : 0,
            isPc:datas.sheet0[i][18] == 'Y' ? 1 : 0,
            canReturns:datas.sheet0[i][19] == 'Y' ? 1 : 0,
            isNewproduct:datas.sheet0[i][20] == 'Y' ? 1 : 0,
            isBox:datas.sheet0[i][21] == 'Y' ? 1 : 0,
            isReturn:datas.sheet0[i][22] == 'Y' ? 1 : 0,
            isInteger:datas.sheet0[i][23] == 'Y' ? 1 : 0,
            isAreaPromotion:datas.sheet0[i][24] == 'Y' ? 1 : 0,
            isTemporaryPromotion:datas.sheet0[i][25] == 'Y' ? 1 : 0
          })
        }
        let thiz = this;
        this.loading = true;
        thiz.$tupHttp(thiz,'product/importProductDetails','POST',arr).then(res=>{
          thiz.loading = false;
          if(res.body.valid){
            thiz.$notify.success({
              title: '成功提示',
              message: '操作成功'
            });
            thiz.loadData() 
          }else{
            thiz.errorTableData = res.body.models;
            thiz.dialogVisible = true;
          }             
        },res=>{
          thiz.loading = false;
        }) 
      },
      upload2(option){
        this.$util.readExcel(option.file,this.treatDatas2)
      },
      treatDatas2(datas){
        let arr = [];
        for(let i =1;i<datas.sheet0.length;i++){
          arr.push({
            pCode:datas.sheet0[i][0],
            boQuantity:datas.sheet0[i][1],
            pSecuritystock:datas.sheet0[i][2],
            category1:datas.sheet0[i][6],
            category2:datas.sheet0[i][8],
            pOnSaleDate:datas.sheet0[i][3],
            pOffSaleDate:datas.sheet0[i][4]
          })
        }
        let thiz = this;
        this.loading = true;
        thiz.$tupHttp(thiz,'product/importProductStatus','POST',arr).then(res=>{
          thiz.loading = false;
          if(res.body.valid){
            thiz.$notify.success({
              title: '成功提示',
              message: res.body.message
            });
            thiz.loadData() 
          }else{
            thiz.errorTableData = res.body.models;
            thiz.dialog2Visible = true;
          }             
        },res=>{
          thiz.loading = false;
        }) 
      },
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData();
      },
      handleSizeChange(val) {
        this.searchForm.pagingQuery.pageSize = val;
        this.loadData();
      },
      saveSubCatalogCode(){        
        let thiz = this;
        this.tableData[this.itemIndex].catalogCode = this.selectedOptions[0].split('|')[0];
        this.tableData[this.itemIndex].catalogName = this.selectedOptions[0].split('|')[1];
        this.tableData[this.itemIndex].subCatalogCode = this.selectedOptions[1].split('|')[0];
        this.tableData[this.itemIndex].subCatalogName = this.selectedOptions[1].split('|')[1];
        this.dialogVisible = false;
      },
      saveItem(ind,row){
        let thiz = this;
        this.loading = true;
        thiz.$tupHttp(thiz,'product/updateProduct','POST',row).then(res=>{
          thiz.loadData()
          thiz.loading = false;
        },res=>{
          thiz.loading = false;
        }) 
      },
      editItem(ind,row){
        this.gotoUrl('/frame/product/productDetail/'+row.pCode)        
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      },     
      loadData(isSearch){
        let thiz = this;
        thiz.tableLoading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        this.$baseData.productList(this,this.searchForm).then(res=>{
          thiz.tableData = [];
          thiz.tableData = res.body.models;
          thiz.total = res.body.pageInfo.total
          thiz.tableLoading = false;
        },res=>{
          thiz.tableLoading = false;
        })
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='pOnSaleDate' || column.property =='pOffSaleDate'){ 
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd");
        }
        return txt;
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
      loadDictions(){
        let thiz = this;
        let params = ["brand_type","sales_platform","product_pyramid_type","product_gp_management_type","sales_type","order_unit"];
        this.$baseData.getDicts(this,params,function(data){
          thiz.Dictions = data;
        });
      }
    },
    mounted(){
      $('.el-upload__input').hide();
      this.loadProductCatalog();
      this.loadDictions();
      //this.loadData();
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
