<template>
  <div>
    <el-form  :model="searchForm" label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="工号/姓名" size="mini">
            <el-input v-model="searchForm.nameOrId"  placeholder="工号/姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="盘点时间段"  size="mini"  prop="date">
            <el-date-picker
              v-model="searchForm.date"
              :picker-options="pickerOptions1"
              value-format="yyyy-M"
              style="width:100%"
              type="month">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="loadData(true)">查询</el-button>
        <el-button icon="el-icon-refresh" type="primary" size="mini" @click="resetForm">重置</el-button>
        <el-button icon="el-icon-plus" size="mini" @click="gotoUrl('/frame/stock/addstockProSetting')" type="primary">添加</el-button>
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
        prop="year"
        label="年份"
        width="100">
      </el-table-column>
      <el-table-column
        prop="month"
        label="月份"
        width="100">
      </el-table-column>
      <el-table-column
        prop="productNumber"
        label="产品数"
        width="150">
      </el-table-column>
      <el-table-column
        prop="saveUserId"
        label="操作工号"
        sortable
        width="150">
      </el-table-column>
      <el-table-column
        prop="saveUserName"
        label="操作人姓名"
        width="150">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="操作时间"
        :formatter="formatter"
        width="100">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="150">
        <template slot-scope="scope">     
          {{scope.row.status == 2 ? '停用':'启用'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">     
          <el-button
            v-if="scope.row.status == 2 || scope.row.status == 3"
            size="mini"          
            type="text"
            :loading="loading"
            @click="viewItem(scope.$index, scope.row)">查看详情</el-button>     
          <el-button
            size="mini"    
            v-if="scope.row.status == 1"      
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
        pickerOptions1:{
          disabledDate(time) {
            return (time.getMonth() != 5 && time.getMonth() != 11);
          }
        },
        selectedOptions:[],
        options: [],
        loading:false,
        currentPage:1,
        total:0,
        searchForm:{
          nameOrId:'',
          date:'',
          year:'',
          month:'',
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
      'searchForm.date':function(val){
        if(!val){
          this.searchForm.year = '';
          this.searchForm.month = '';
        }
        else{
          this.searchForm.year = val.split('-')[0];
          this.searchForm.month = val.split('-')[1];
        }
      }
    },
    methods: {
      resetForm(){
        this.searchForm = {
          nameOrId:'',
          date:'',
          year:'',
          month:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:20
          }
        }
      },
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData();
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='createTime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss");
        }
        return txt;
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
      viewItem(ind,row){
        this.gotoUrl('/frame/stock/stockProDetail/'+row.rowId)          
      },
      editItem(ind,row){
        this.gotoUrl('/frame/stock/stockProEdit/'+row.rowId)          
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
        this.$tupHttp(this,'stockProductManage/getStockProductView','POST',thiz.searchForm).then(res=>{
          thiz.tableData = res.body.models
          thiz.total = res.body.pageInfo ? res.body.pageInfo.total :0;
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
      }
    },
    mounted(){
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
