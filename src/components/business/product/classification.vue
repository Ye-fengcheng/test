<template>
  <div>
    <el-form  :model="searchForm" label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="产品编号">
            <el-input-product-code v-model="searchForm.condition.pCode" size="mini" placeholder="产品编号"></el-input-product-code>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="产品名称">
            <el-input v-model="searchForm.condition.pName" size="mini" placeholder="产品名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否分类">
            <el-select v-model="searchForm.condition.isCatalog" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="未分类" :value="0"></el-option>
              <el-option label="已分类" :value="1"></el-option>
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
              v-model="classification">
            </el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="loadData(true)">查询</el-button>
        <el-button icon="el-icon-refresh" type="primary" size="mini" @click="resetForm">重置</el-button>
        <el-button icon="el-icon-download" :loading="loading" size="mini" @click="downLoad()" type="primary">导出</el-button>
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
            <el-button 
            @click="editItem(scope.$index, scope.row)"
            size="mini" 
            icon="el-icon-edit"></el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">          
          <el-button
            size="mini"          
            type="primary"
            @click="saveItem(scope.$index, scope.row)">保存</el-button>
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
    <el-dialog title="选择产品系列"  width="30%" top="15%" :visible.sync="dialogVisible">
      <el-button @click="addCatalog" :disabled="selectedOptions.length>=2" size="mini" icon="el-icon-plus">添加分类</el-button>
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
        classification:[],
        selectedOptions:[],
        options: [],
        loading:false,
        currentPage:1,
        total:0,
        searchForm:{
          condition:{
            pCode:'',
            pName:'',
            isCatalog:'',
            catalogCode:''
          },
          pagingQuery:{
            pageIndex:1,
            pageSize:50
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
      classification:function(val){
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
        this.searchForm = {
          condition:{
            pCode:'',
            pName:'',
            isCatalog:'',
            catalogCode:''
          },
          pagingQuery:{
            pageIndex:1,
            pageSize:this.searchForm.pagingQuery.pageSize
          }
        }
        this.classification = []
      },
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData();
      },
      handleSizeChange(val) {
        this.searchForm.pagingQuery.pageSize = val;
        this.loadData();
      },
      downLoad(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        delete data.pagingQuery;
        thiz.$tupHttp(thiz,'product/exportProductCatalog','POST',data,{},'',true).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '文件已加入下载队列，稍后前往 "基础设置-内容管理-导出下载" 下载文件'
          });
        },res=>{
          thiz.loading = false;
        })
      },
      saveSubCatalogCode(){      
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
        let thiz = this;
        if(!row.catalogs){
          thiz.$notify.info({
            title: '提示',
            message: '该产品还没有做分类维护，可能会影响产品在app和web端的显示！'
          });
        }
        thiz.$tupHttp(thiz,'product/updateProductCatalog','POST',[row]).then(res=>{
          thiz.loadData()
          thiz.loading = false;
        },res=>{
          thiz.loading = false;
        }) 
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
      addCatalog(){
        this.selectedOptions.push([])
      },
      deleteCatalog(index){
        this.selectedOptions.splice(index,1)
      },  
      editItem(ind,row){
        this.itemIndex = ind;
        this.getSelectedOptions(ind);
        this.dialogVisible = true;        
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
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页1111
        this.$baseData.productList(this,this.searchForm).then(res=>{
          thiz.tableData = [];
          thiz.tableData = res.body.models;
          thiz.total = res.body.pageInfo.total
          thiz.tableLoading = false;
        },res=>{
          thiz.tableLoading = false;
        })
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
      }
    },
    mounted(){
      this.loadProductCatalog()
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
