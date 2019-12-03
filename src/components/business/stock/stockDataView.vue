<template>
  <div>
    <el-form  :model="searchForm" label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="区域">            
            <tup-arae-select type="area" size="mini" v-model="searchForm.areaObject"  ></tup-arae-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="省办" size="mini">
            <tup-arae-select v-model="searchForm.provinceObject" :showCheck="true" ></tup-arae-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="分销商编号" size="mini">
            <el-input v-model="searchForm.sDbStr"  placeholder="分销商编号"></el-input>
          </el-form-item>
        </el-col>
        
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="专卖店编号" size="mini">
            <el-input v-model="searchForm.pOrganId"  placeholder="专卖店编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="产品名称/编号" size="mini">
            <el-input v-model="searchForm.productNameOrId"  placeholder="产品名称/编号"></el-input>
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
        <el-button icon="el-icon-download" :loading="loading" size="mini" @click="downLoad()" type="primary">导出</el-button>
        <el-button icon="el-icon-upload2" :loading="loading" size="mini" @click="batchSubmitForDraft()" type="primary">提交所有草稿</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="tableLoading"
      :summary-method="getSummaries"
      show-summary
      style="width: 100%;"
      height="450"
      ref="productTable"
      highlight-current-row>
      <el-table-column
        type="index"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="regionName"
        label="区域"
        width="100">
      </el-table-column>
      <el-table-column
        prop="provinceName"
        label="省办"
        width="100">
      </el-table-column>
      <el-table-column
        prop="pCitparentno"
        label="分销商编号"
        width="150">
      </el-table-column>
      <el-table-column
        prop="pCitparent"
        label="分销商名称"
        sortable
        width="150">
      </el-table-column>
      <el-table-column
        prop="pUid"
        label="专卖店编号"
        width="150">
      </el-table-column>
      <el-table-column
        prop="pOrganName2"
        label="专卖店名称"
        width="150">
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
        prop="manageArea"
        label="经营面积"
        width="250">
      </el-table-column>
      <el-table-column
        prop="monthRent"
        label="店月租金"
        width="150">
      </el-table-column>
      <el-table-column
        prop="monthSalary"
        label="月人工工资 "
        width="250">
      </el-table-column>
      <el-table-column
        prop="topN"
        label="TOP_N"
        width="150">
      </el-table-column>
      <el-table-column
        prop="manageId"
        label="产品编号"
        width="150">
      </el-table-column>
      <el-table-column
        prop="productName"
        label="产品名称"
        width="150">
      </el-table-column>
      <el-table-column
        prop="unit"
        label="单位"
        width="90">
      </el-table-column>
      <el-table-column
        prop="price"
        label="JDE单价"
        width="120">
      </el-table-column>
      <el-table-column
        prop="shopCount"
        label="店面只数"
        width="150">
      </el-table-column>
      <el-table-column
        prop="storehouseCount"
        label="仓库只数"
        width="150">
      </el-table-column>
      <el-table-column
        prop="totalCount"
        label="总数"
        width="120">
      </el-table-column>
      <el-table-column
        prop="stockMoney"
        label="总金额"
        width="150">
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top:15px;">
      <span style="float:left;padding:10px;">已提交店数:{{extra}}</span>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="searchForm.pagingQuery.pageIndex"
        :page-size="20"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        code:'',
        codeType:'',
        extra:0,
        summaries:{},
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
          provinceObject:[],
          sProvince:[],
          sRegion:[],
          areaObject:[],
          sDbStr:'',
          pOrganId:'',
          productNameOrId:'',
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
      "searchForm.provinceObject":function(val){
        let datas = [];
        val.map(item=>{
          if(item.code !='00')
            datas.push(item.code)
        })
        this.searchForm.sProvince = datas;
      },
      "searchForm.areaObject":function(val){
        let datas = [];
        val.map(item=>{
          if(item.code !='999')
            datas.push(item.code)
        })
        this.searchForm.sRegion = datas;
      },
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
          provinceObject:[],
          sProvince:[],
          sRegion:[],
          areaObject:[],
          sDbStr:'',
          pOrganId:'',
          productNameOrId:'',
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
      initData(){
        debugger
        if(!!this.$storage.getValue('provinceNo')){
          this.code = this.$storage.getValue('provinceNo');
          this.codeType = 'province';
          this.searchForm.provinceObject = [{code:this.code,codeType:'province',name:this.$storage.getValue('province')}]
        }
        else{
          if(!!this.$storage.getValue('regionNo')){
            this.codeType = 'region';
            this.code = this.$storage.getValue('regionNo');
            this.searchForm.provinceObject = [{code:this.code,codeType:'region',name:this.$storage.getValue('region')}]
          }
          else{
            this.codeType = 'country';
            this.code = '00';
            this.searchForm.provinceObject = [{code:this.code,name:'全国',codeType:'country'}]
          }
        }
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
      batchSubmitForDraft(){
        let thiz = this;
        thiz.loading = true;
        this.$confirm('此操作会将所有草稿都提交, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          thiz.$tupHttp(thiz,'stockProductManage/batchSubmitForDraft','POST',null).then(res=>{
            thiz.loading = false;
            thiz.loadData();
            this.loadSum();
          },res=>{
            thiz.loading = false;
          }) 
        }).catch(() => {    
          thiz.loading = false;  
        });
      },
      downLoad(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        thiz.$tupHttp(thiz,'stockProductManage/exportStockProductDetail','POST',data).then(res=>{
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
        this.gotoUrl('/frame/product/productDetail/'+row.itemNo+'/'+row.rowId)          
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      },     
      detail(index, row) {
        this.gotoUrl('/frame/terminal/customerInfo/'+row.id)
      },
      getSummaries(param) {
        let thiz = this;
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '统计';
            return;
          }
          const values = thiz.summaries[column.property];
          if (!!values || values == 0) {      
            if(column.property == 'stockMoney')     
              sums[index] = thiz.$util.formatThousand(values,2);
            else 
              sums[index] = thiz.$util.formatThousand(values,0);
          } else {
            sums[index] = '';
          }
        });
        return sums;
      },
      loadSum(){
        let thiz = this;
        this.$tupHttp(this,'stockProductManage/getStockProductDetailTotal','POST',thiz.searchForm).then(res=>{
          thiz.extra = res.body.extra
          if(res.body.model){
            thiz.summaries = res.body.model
            thiz.$refs.productTable.doLayout()
          }
        })
      },
      loadData(isSearch){
        let thiz = this;
        thiz.tableLoading = true;
        if(isSearch){
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        }          
        this.$tupHttp(this,'stockProductManage/getStockProductDetail','POST',thiz.searchForm).then(res=>{
          thiz.tableData = res.body.models
          thiz.total = res.body.pageInfo ? res.body.pageInfo.total :0;
          thiz.tableLoading = false;
        },res=>{
          thiz.tableLoading = false;
        })
        if(isSearch){
          //加载统计
          thiz.loadSum()
        } 
      }
    },
    mounted(){
      this.loadData(true);
      //this.initData()
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
