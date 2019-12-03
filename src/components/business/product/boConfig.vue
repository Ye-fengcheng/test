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
            <el-input v-model="searchForm.pName" size="mini" placeholder="产品名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="时间">
            <el-date-picker
              size="mini"
              v-model="searchForm.date"
              style="width:100%"
              type="daterange"
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
          <!-- <el-upload
            style="float:left;margin-left:10px;"
            :show-file-list="false"
            :multiple="true"
            :httpRequest="upload">
            <el-button :loading="loading" icon="el-icon-upload2" size="mini" type="primary">上传</el-button>
          </el-upload>  
          &nbsp;&nbsp;
          <el-button size="mini" @click="$util.winOpen('https://tup-templates.tupperware.com.cn/BO%E9%85%8D%E7%BD%AE%E5%AF%BC%E5%85%A5.xlsx')" type="text">下载模板</el-button> -->
          <el-button size="mini" @click="gotoUrl('/frame/product/boUpload')" type="text">BO上传</el-button>
        </div>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="tableLoading"
      style="width: 100%;"
      height="450"
      highlight-current-row
      >
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
        prop="isDiscount"
        label="是否打折"
        width="110">
        <template slot-scope="scope">
          {{scope.row.isDiscount == 1 ?'是':'否'}}
        </template>
      </el-table-column> 
      <el-table-column
        prop="pName"
        label="产品名称"
        width="250">
      </el-table-column>
       <el-table-column
        prop="opType"
        label="操作类型"
        :formatter="formatter"
        width="250">
      </el-table-column>
      <el-table-column
        prop="afterBo"
        label="操作后BO数量"
        width="200">
        <template slot-scope="scope">
          <el-input-number 
            style="width: 120px !important;"
            v-model="scope.row.afterBo"
            :min="0" 
            size="mini"
            label="描述文字"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column
        prop="insertBy"
        label="操作人"
        width="150">
      </el-table-column>
      <el-table-column
        prop="insertTime"
        label="操作时间"
        :formatter="formatter"
        width="150">
      </el-table-column>
      <el-table-column label="操作" fixed="right">
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
          pName:'',
          date:'',
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
      'searchForm.date':function(val){
        if(!val){
          this.searchForm.beginTime = '';
          this.searchForm.endTime = '';
        }
        else{
          this.searchForm.beginTime = val[0];
          this.searchForm.endTime = val[1];
        }
      }
    },
    methods: {
      resetForm(){
        this.searchForm = {
          pCode:'',
          pName:'',
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
            txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss");
        }
        else if(column.property =='opType'){
          if(row[column.property]=='UI'){
            txt = '系统变更'
          }
          else if(row[column.property]=='P'){
            txt = '工厂冲减'
          }
          else
            txt = row[column.property]
        }
        return txt;
      },
      upload(option){     
        this.$util.readExcel(option.file,this.treatDatas)
      },
      treatDatas(datas){
        debugger
        let arr = [];
        for(let i =1;i<datas.sheet0.length;i++){
          arr.push({
            pCode:datas.sheet0[i][0],
            afterBo:datas.sheet0[i][1]
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
        thiz.$tupHttp(thiz,'inventory/getCommonBoStockList','POST',thiz.searchForm).then(res=>{
          thiz.tableData = res.body.models;
          thiz.total = res.body.pageInfo.total
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
