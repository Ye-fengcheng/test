<template>
  <div v-loading="loading">
    <el-form  :model="searchForm"  label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="年">
            <el-select v-model="searchForm.estimatedYear" size="mini" clearable filterable  placeholder="请选择">
              <el-option
                v-for="item in years"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">   
          <el-form-item label="月">
            <el-select v-model="searchForm.estimatedMonth" size="mini" clearable filterable  placeholder="请选择">
              <el-option
                v-for="item in months"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>       
      </el-row>
      <el-form-item>
        <el-button  style="float:left;margin-left:10px;margin-top:5px;" type="primary" icon="el-icon-search" size="mini" @click="loadData(true)">查询</el-button>
        <el-upload
        style="float:left;margin-left:10px;"
        :show-file-list="false"
        :multiple="true"
        :httpRequest="upload">
        <el-button icon="el-icon-upload2"  :loading="loading" size="mini" type="primary">导入</el-button>
      </el-upload>  
      &nbsp;&nbsp;
      <el-button size="mini" @click="$util.winOpen('static/useJs/doc/预估产品导入模板.xlsx?'+$util.getRandom())" type="text">下载模板</el-button>
      </el-form-item>
    </el-form>   
    <div style="line-height: 26px;">
      
    </div>
    <el-table
      :data="tableData"
      v-loading="tableLoading"
      style="width: 100%;"
      :height="tableHeight"
      highlight-current-row
      :default-sort = "{prop: 'date', order: 'descending'}">
      <el-table-column
        type="index"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="productName"
        label="产品名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="price"
        label="单价"
        sortable
        width="80">
      </el-table-column>
      <el-table-column
        prop="unit"
        label="单位"
        width="80">
      </el-table-column>
      <el-table-column
        prop="stockProduct"
        label="盘点产品名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="estimatedYear"
        label="填报财务年"
        width="120">
      </el-table-column>
      <el-table-column
        prop="estimatedMonth"
        label="填报财务月"
        width="120">
      </el-table-column>
      <el-table-column
        prop="updateDatetime"
        width="120"
        :formatter="formatter"
        label="操作时间">
      </el-table-column> 
      <el-table-column
        prop="updateUser"
        label="操作人">
      </el-table-column>    
    </el-table>
    <div style="text-align: right;margin-top:15px;">
      <el-pagination
        @current-change="handleCurrentChange"
        background
        :current-page="searchForm.pagingQuery.pageIndex"
        :page-size="20"
        layout="slot,prev, pager, next, jumper"
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
          prop="productName"
          label="产品名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="price"
          label="单价"
          sortable
          width="80">
        </el-table-column>
        <el-table-column
          prop="unit"
          label="单位"
          width="80">
        </el-table-column>
        <el-table-column
          prop="stockProduct"
          label="盘点产品名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="estimatedYear"
          label="填报财务年"
          width="120">
        </el-table-column>
        <el-table-column
          prop="estimatedMonth"
          label="填报财务月"
          width="120">
        </el-table-column>
        <el-table-column
          prop="message"
          label="错误信息"
          width="150">
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
        years:[],
        months:[
          {
            value: 1,
            label: '1'
          },
          {
            value: 2,
            label: '2'
          },
          {
            value: 3,
            label: '3'
          },
          {
            value: 4,
            label: '4'
          },
          {
            value: 5,
            label: '5'
          },
          {
            value: 6,
            label: '6'
          },
          {
            value: 7,
            label: '7'
          },
          {
            value: 8,
            label: '8'
          },
          {
            value: '9',
            label: '9'
          },
          {
            value: 10,
            label: '10'
          },
          {
            value: 11,
            label: '11'
          },
          {
            value: 12,
            label: '12'
          }
        ],
        areaData:{
          isarea:'1',
          data:[]
        },
        errorTableData:[],
        dialogVisible:false,
        tableHeight:parseInt(document.documentElement.clientHeight-160),
        loading:false,
        currentPage:1,
        total:0,
        searchForm:{
          estimatedMonth:'',
          estimatedYear:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:20
          }
        },
        tableData: [
        ],
        tableLoading:false
      }
    },
    watch:{
    },
    methods: {
       formatter(row, column) {
        let txt = ''
        if(column.property =='updateDatetime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss");
        }
        return txt;
      },
      upload(option){     
        this.$util.readExcel(option.file,this.treatDatas)
      },
      treatDatas(datas,file){
        let arr = [];
        for(let i =1;i<datas.sheet0.length;i++){
          arr.push({
            productName:datas.sheet0[i][0],
            price:datas.sheet0[i][1],
            unit:datas.sheet0[i][2],
            stockProduct:datas.sheet0[i][3],
            estimatedYear:datas.sheet0[i][4],
            estimatedMonth:datas.sheet0[i][5]
          })
        }
        let thiz = this;
        this.loading = true;
        thiz.$tupHttp(thiz,'productEstimate/batchInsert','POST',arr,{},'/manage-psi/',false,'').then(res=>{
          thiz.loadData()
          thiz.loading = false;
          if(res.body.valid){
            thiz.$notify.success({
              title: '提示',
              message: '批量插入成功'
            });
          }else{
            thiz.$notify.error({
              title: '错误提示',
              message: '部分数据有误'
            });
            thiz.errorTableData = res.body.models;
            thiz.dialogVisible = true;
          } 
        },res=>{
          //thiz.loadData()
          thiz.loading = false;
        }) 
      },
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData();
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      },     
      downLoad(index, row) {
        window.open(row.resultUrl)
      },
      loadData(isSearch){
        let thiz = this;
        if(!thiz.searchForm.estimatedYear || !thiz.searchForm.estimatedMonth){
          thiz.$notify.error({
            title: '错误提示',
            message: '年月不能为空'
          });
          return;
        }
        thiz.tableLoading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        thiz.$tupHttp(thiz,'productEstimate/getProductEstimate','POST',thiz.searchForm,{},'/manage-psi/',false,'').then(res=>{
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
      let currentYear = (new Date()).getFullYear()+1;
      for(let i=currentYear;i>=parseInt(currentYear-10);i--){
        this.years.push({
          value:i,
          lable:i
        })
      }
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
