<template>
  <div>
    <el-form  :model="searchForm" label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="产品编号">
            <el-input-product-code v-model="searchForm.pCode" size="mini" placeholder="产品编号"></el-input-product-code>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="产品名称">
            <el-input v-model="searchForm.pName" size="mini"  placeholder="产品名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="可用库存数量">
            <el-select v-model="searchForm.stockNumStatus" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="小于0" :value="-1"></el-option>
              <el-option label="等于0" :value="0"></el-option>
              <el-option label="大于0" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>  
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="产品状态">
            <el-select v-model="searchForm.pStatus" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="已上架" :value="1"></el-option>
              <el-option label="未上架" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>    
      <el-form-item>
        <div style="line-height: 26px;">
          <el-button style="float:left" icon="el-icon-search" type="primary" size="mini" @click="loadData(true)">查询</el-button>
          <el-button style="float:left" icon="el-icon-refresh" type="primary" size="mini" @click="resetForm">重置</el-button>
          <el-button style="float:left"  icon="el-icon-download" :loading="loading" size="mini" @click="downLoad()" type="primary">导出</el-button>
          <el-button size="mini" @click="gotoUrl('/frame/product/inventoryTrackingKit')" type="text">KIT产品库存跟踪</el-button>
        </div>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="tableLoading"
      style="width: 100%;"
      height="450"
      @sort-change="sortChange"
      highlight-current-row>
      <el-table-column
        type="index"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="pCode"
        label="产品编号"
        sortable
        width="100">
      </el-table-column>
      <el-table-column
        prop="pName"
        label="产品名称"
        width="250">
      </el-table-column>
      <el-table-column
        prop="jdePrice"
        label="价格"
        sortable
        width="100">
      </el-table-column>
      <el-table-column
        prop="isDiscount"
        label="是否打折"
        width="100">
        <template slot-scope="scope"> 
          {{scope.row.isDiscount == 1 ? '是':'否'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="pSecuritystock"
        label="安全库存"
        sortable
        width="150">
      </el-table-column>
      <el-table-column
        prop="availableStock"
        :sortable="searchForm.selectType==0"
        width="150"
        label="可用库存">
      </el-table-column>
      <el-table-column
        prop="jdeStock"
        label="JDE库存"
        :sortable="searchForm.selectType==0"
        width="150">
      </el-table-column> 
      <el-table-column
        prop="boQuantity"
        label="BO"
         :sortable="searchForm.selectType==0"
        width="150">
      </el-table-column>      
      <el-table-column
        prop="occupyStock"
         :sortable="searchForm.selectType==0"
        label="FMS承诺数"
        width="150">
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
        tableLoading:false,
        searchForm:{
          pCode:'',
          stockNumStatus:'',
          pName:'',
          pStatus:'',
          orderBy:[],
          selectType:0,
          pagingQuery:{
            pageIndex:1,
            pageSize:50
          }
        },
        tableData: [
        ],
        dialogVisible:false,
        itemIndex:-1//当前编辑的行索引
      }
    },
    watch:{
    },
    methods: {
      sortChange(column, prop, order){
        if(column.prop){
          this.searchForm.orderBy = [
            {
              field: this.getColumnName(column.prop),
              order: column.order == 'ascending' ? 1:0
            }
          ]
        }
        else{
          this.searchForm.orderBy = [];
        }
        this.loadData()
      },  
      getColumnName(name){
        let txt = '';
        switch(name){
          case 'pCode':
            txt ='prd_code'
          break;
          case 'jdePrice':
            txt ='jde_price'
          break;
          case 'pSecuritystock':
            txt ='p_securitystock'
          break;
          case 'availableStock':
            txt ='available_stock'
          break;
          case 'boQuantity':
            txt ='bo_quantity'
          break;
          case 'occupyStock':
            txt ='occupy_stock'
          break;
          case 'jdeStock':
            txt ='jde_stock'
          break;
        }
        return txt;
      },
      resetForm(){
        this.searchForm = {
          pCode:'',
          pName:'',
          orderBy:[],
          selectType:0,
          pStatus:'',
          stockNumStatus:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:this.searchForm.pagingQuery.pageSize
          }
        }
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='insertTime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd");
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
            bo:datas.sheet0[i][1]
          })
        }
        let thiz = this;
        this.loading = true;
        thiz.$tupHttp(thiz,'inventory/uploadCommonBoStock','POST',arr).then(res=>{
          thiz.loadData()
          thiz.loading = false;
        },res=>{
          thiz.loading = false;
        }) 
      },
      downLoad(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        delete data.pagingQuery;
        thiz.$tupHttp(thiz,'inventory/exportInventorys','POST',data).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '文件已加入下载队列，稍后前往 "基础设置-内容管理-导出下载" 下载文件'
          });
        },res=>{
          thiz.loading = false;
        })
      },
      saveItem(ind,row){
        let thiz = this;
        this.loading = true;
        thiz.$tupHttp(thiz,'inventory/updateCommonBoStock','POST',row).then(res=>{
          thiz.loadData()
          thiz.loading = false;
        },res=>{
          thiz.loading = false;
        }) 
      },
      editItem(ind,row){
        this.itemIndex = ind;
        this.dialogVisible = true;        
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      },     
      detail(index, row) {
        this.gotoUrl('/frame/terminal/customerInfo/'+row.id)
      },
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData();
      },
      handleSizeChange(val) {
        this.searchForm.pagingQuery.pageSize = val;
        this.loadData();
      },
      loadData(isSearch){
        let thiz = this;
        thiz.tableLoading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        thiz.$tupHttp(thiz,'inventory/getInventoryByPage','POST',thiz.searchForm).then(res=>{
          thiz.tableData = res.body.models;
          thiz.total = res.body.pageInfo ? res.body.pageInfo.total:0
          thiz.tableLoading = false;
        },res=>{
          thiz.tableLoading = false;
        })
      }
    },
    mounted(){
      $('.el-upload__input').hide();
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
