<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item >产品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/frame/product/onSale'}">基础信息</el-breadcrumb-item>
      <el-breadcrumb-item>批量导入产品信息</el-breadcrumb-item>
    </el-breadcrumb>
    <br/>
    <div style="line-height: 26px;">
      <el-row>
        <el-col :span="18">
          <el-upload
            style="float:left;margin-left:10px;"
            ref="upload"
            :file-list="fileList"
            :auto-upload="false"
            :multiple="false"
            :httpRequest="upload">
            <el-button :loading="loading" size="mini" type="primary">选取文件</el-button>
          </el-upload>  
          &nbsp;&nbsp;
          <el-button size="mini" @click="$util.winOpen('static/useJs/doc/KitProduct.xlsx?'+$util.getRandom())" type="text">下载模板</el-button>
        </el-col>
        <el-col :span="6" style="text-align:right"><el-button size="mini" @click="$router.go(-1)">返回</el-button></el-col>
      </el-row>
      <el-input
        style="margin:10px 0px 10px 10px;width:500px"
        type="textarea"
        :rows="2"
        placeholder="备注说明"
        v-model="remark">
      </el-input>
      <el-row>
        <el-col :span="18">
          <el-button icon="el-icon-upload2" style="margin-left:10px"  size="mini" type="success" @click="submitUpload">导入</el-button>
        </el-col>
      </el-row>
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
        prop="createTime"
        label="操作时间"
        :formatter="formatter"
        width="180">
      </el-table-column>
      <el-table-column
        prop="operator"
        label="操作人"
        sortable
        width="120">
      </el-table-column>
      <el-table-column
        prop="operateNums"
        label="操作数量"
        width="100">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="120">
        <template slot-scope="scope">          
          {{scope.row.status==0 ? '成功':(scope.row.status==1 ? '失败':'处理中')}}
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注">
      </el-table-column>
      <el-table-column
        prop="errorDataUrl"
        label="数据"
        width="150">
        <template slot-scope="scope">          
          <el-button
            size="mini"         
            v-if="scope.row.errorDataUrl" 
            type="primary"
            @click="downLoad(scope.$index, scope.row)">下载</el-button>
        </template>
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
          type="index"
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          prop="kitCode"
          label="KIT产品编号"
          width="150">
        </el-table-column>
        <el-table-column
          prop="kitName"
          label="KIT产品中文名称"
          width="150">
        </el-table-column>
        <el-table-column
          prop="kitPrice"
          label="KIT产品价格"
          width="100">
        </el-table-column>
        <el-table-column
          prop="pCode"
          label="产品编号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="qty"
          label="数量"
          width="80">
        </el-table-column>
        <el-table-column
          prop="remark"
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
        fileList:[],
        remark:'',
        areaData:{
          isarea:'1',
          data:[]
        },
        tableHeight:parseInt(document.documentElement.clientHeight-160),
        loading:false,
        currentPage:1,
        total:0,
        searchForm:{
          pagingQuery:{
            pageIndex:1,
            pageSize:20
          }
        },
        tableData: [
        ],
        tableLoading:false,
        errorTableData: [
        ],
        dialogVisible:false
      }
    },
    watch:{
    },
    methods: {
      formatter(row, column) {
        let txt = ''
        if(column.property =='createTime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss");
        }
        return txt;
      },
      submitUpload() {
        this.$refs.upload.submit();
      },
      upload(option){     
        this.$util.readExcel(option.file,this.treatDatas)
      },
      treatDatas(datas,file){
        let arr = [];
        for(let i =1;i<datas.sheet0.length;i++){
          if(datas.sheet0[i][6] && datas.sheet0[i][7]){
            arr.push({
              kitCode:datas.sheet0[i][0],
              kitName:datas.sheet0[i][1],
              kitPrice:datas.sheet0[i][2],
              isDiscount:datas.sheet0[i][3],
              pOnSaleDate:datas.sheet0[i][4],
              pOffSaleDate:datas.sheet0[i][5],
              pCode:datas.sheet0[i][6],
              qty:datas.sheet0[i][7]
            }) 
          }   
          if(datas.sheet0[i][8] && datas.sheet0[i][9]){
            arr.push({
              kitCode:datas.sheet0[i][0],
              kitName:datas.sheet0[i][1],
              kitPrice:datas.sheet0[i][2],
              isDiscount:datas.sheet0[i][3],
              pOnSaleDate:datas.sheet0[i][4],
              pOffSaleDate:datas.sheet0[i][5],
              pCode:datas.sheet0[i][8],
              qty:datas.sheet0[i][9]
            }) 
          }
          if(datas.sheet0[i][10] && datas.sheet0[i][11]){
            arr.push({
              kitCode:datas.sheet0[i][0],
              kitName:datas.sheet0[i][1],
              kitPrice:datas.sheet0[i][2],
              isDiscount:datas.sheet0[i][3],
              pOnSaleDate:datas.sheet0[i][4],
              pOffSaleDate:datas.sheet0[i][5],
              pCode:datas.sheet0[i][10],
              qty:datas.sheet0[i][11]
            }) 
          }
          if(datas.sheet0[i][12] && datas.sheet0[i][13]){
            arr.push({
              kitCode:datas.sheet0[i][0],
              kitName:datas.sheet0[i][1],
              kitPrice:datas.sheet0[i][2],
              isDiscount:datas.sheet0[i][3],
              pOnSaleDate:datas.sheet0[i][4],
              pOffSaleDate:datas.sheet0[i][5],
              pCode:datas.sheet0[i][12],
              qty:datas.sheet0[i][13]
            }) 
          }     
          if(datas.sheet0[i][14] && datas.sheet0[i][15]){
            arr.push({
              kitCode:datas.sheet0[i][0],
              kitName:datas.sheet0[i][1],
              kitPrice:datas.sheet0[i][2],
              isDiscount:datas.sheet0[i][3],
              pOnSaleDate:datas.sheet0[i][4],
              pOffSaleDate:datas.sheet0[i][5],
              pCode:datas.sheet0[i][14],
              qty:datas.sheet0[i][15]
            }) 
          }       
        }
        let thiz = this;
        this.loading = true;
        thiz.$tupHttp(thiz,'product/product/addKitProduct','POST',{kitProductList:arr,remark:this.remark}).then(res=>{
          thiz.loading = false;
          thiz.fileList = [];
            thiz.remark = '';
          if(res.body.valid){            
            thiz.$notify.success({
              title: '成功提示',
              message: '成功导入'
            });
            thiz.loadData()
          }else{
            thiz.errorTableData = res.body.models;
            thiz.dialogVisible = true;
          }
        },res=>{
          thiz.loading = false;
          //thiz.loadData()
        }) 
      },
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData();
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      },     
      detail(index, row){
        this.gotoUrl('/frame/order/backendOrder/sfProductOrderImportList/'+row.id)   
      },
      downLoad(index, row) {
        window.open(row.errorDataUrl)
      },
      loadData(isSearch){
        let thiz = this;
        thiz.tableLoading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        thiz.$tupHttp(thiz,'product/product/selectRecords','POST',thiz.searchForm).then(res=>{
          thiz.tableData = res.body.models;
          thiz.tableLoading = false;
          thiz.total = res.body.pageInfo.total ? res.body.pageInfo.total : 0;          
        },res=>{
          thiz.tableLoading = false;
        })
      }
    },
    mounted(){
      $('.el-upload__input').hide();
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
