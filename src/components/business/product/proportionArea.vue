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
           <el-form-item label="产品系列">
            <el-cascader
              :options="options"
              clearable
              size="mini"
              v-model="selectedOptions">
            </el-cascader>
          </el-form-item>
        </el-col>
      </el-row>      
      <el-row :gutter="5">
        <el-col :span="16">
          <el-form-item label="有效时间">
            <el-date-picker
              v-model="searchForm.date"
              type="daterange"
              size="mini"
              value-format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder="开始日期"
              :default-time="['00:00:00', '23:59:59']"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <div style="line-height: 26px;">
          <el-button style="float:left" icon="el-icon-search" type="primary" size="mini" @click="loadData(true)">查询</el-button>
          <el-button style="float:left" icon="el-icon-refresh" type="primary" size="mini" @click="resetForm">重置</el-button>
          <el-upload
            style="float:left;margin-left:10px;"
            :show-file-list="false"
            :multiple="true"
            :httpRequest="upload">
            <el-button :loading="loading" icon="el-icon-upload2" size="mini" type="primary">上传</el-button>
          </el-upload>  
          &nbsp;&nbsp;
          <el-button size="mini" @click="$util.winOpen('https://tup-templates.tupperware.com.cn/OrderProportionArea.xls')" type="text">下载模板</el-button>
        </div>
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
        prop="areaName"
        label="区域"
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
      </el-table-column><!-- 
      <el-table-column
        prop="ration"
        label="比例"
        width="150">
        <template slot-scope="scope">
          <div>
            <el-input-number 
            v-model="scope.row.ration"
            :min="0" 
            size="mini"
            label="描述文字"></el-input-number>
          </div>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="orderRatio"
        label="订货比率"
        width="150">
        <template slot-scope="scope">
          <el-input-number 
            v-model="scope.row.orderRatio"
            :min="0" 
            size="mini"
            label="描述文字"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column
        prop="price"
        label="单价"
        sortable
        width="80">
      </el-table-column>
      <el-table-column
        prop="priceStartTime"
        label="有效开始时间"
        :formatter="formatter"
        sortable
        width="150">
      </el-table-column>
      <el-table-column
        prop="priceEndTime"
        label="有效结束时间"
        :formatter="formatter"
        sortable
        width="150">
      </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">          
          <el-button
            size="mini"          
            type="primary"
            :loading="loading"
            @click="saveItem(scope.$index, scope.row)">保存</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top:15px;">
      <el-pagination
        @current-change="handleCurrentChange"
        background
        :current-page="searchForm.pagingQuery.pageIndex"
        :page-size="20"
        layout="total, prev, pager, next, jumper"
        :total="total">
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
          prop="areaCode"
          label="区域"
          width="100">
        </el-table-column>
        <el-table-column
          prop="pCode"
          label="产品编号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="orderRatio"
          label="订货比率"
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
  </div>
</template>

<script>
  export default {
    data() {
      return {
        areaData:{
          isarea:'1',
          data:[]
        },
        loading:false,
        currentPage:1,
        total:0,
        searchForm:{
          date:[],
          condition:{
            pCode:'',
            pName:'',
            catalogCode:'',
            periodStart:'',
            periodEnd:'',
            type:0
          },
          pagingQuery:{
            pageIndex:1,
            pageSize:20
          }
        },
        selectedOptions:[],
        options: [],
        errorTableData: [
        ],
        tableData: [
        ],
        tableLoading:false,
        dialogVisible:false
      }
    },
    watch:{
      'searchForm.date':function(val){
        if(!val){
          this.searchForm.condition.periodStart = '';
          this.searchForm.condition.periodEnd = '';
        }
        else{
          this.searchForm.condition.periodStart = val[0];
          this.searchForm.condition.periodEnd = val[1];
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
          date:[],
          condition:{
            pCode:'',
            pName:'',
            catalogCode:'',
            periodStart:'',
            periodEnd:'',
            type:0
          },
          pagingQuery:{
            pageIndex:1,
            pageSize:20
          }
        }
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='priceStartTime' || column.property =='priceEndTime'){
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
            areaCode:datas.sheet0[i][0],
            pCode:datas.sheet0[i][1],
            ration:datas.sheet0[i][2],
            orderRatio:datas.sheet0[i][3]
          })
        }
        let thiz = this;
        this.loading = true;
        thiz.$tupHttp(thiz,'product/importOrderProportionByArea','POST',arr).then(res=>{
          thiz.loading = false;
          if(res.body.valid){
            thiz.loadData() 
          }else{
            thiz.errorTableData = res.body.models;
            thiz.dialogVisible = true;
          }                   
        },res=>{
          thiz.loading = false;
        }) 
      },
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData();
      },
      saveItem(ind,row){
        let thiz = this;
        this.loading = true;
        thiz.$tupHttp(thiz,'product/updateOrderProportion','POST',[row]).then(res=>{
          thiz.loadData()
          thiz.loading = false;
        },res=>{
          thiz.loading = false;
        }) 
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
        thiz.$tupHttp(thiz,'product/listOrderProportion','POST',thiz.searchForm).then(res=>{
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
      $('.el-upload__input').hide();
      this.loadData();
      this.loadProductCatalog();
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
