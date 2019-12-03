<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item >产品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/frame/product/onSale'}">基础信息</el-breadcrumb-item>
      <el-breadcrumb-item>上传产品基础信息</el-breadcrumb-item>
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
          <el-button size="mini" @click="$util.winOpen('static/useJs/doc/BaseProduct.xlsx?'+$util.getRandom())" type="text">下载模板</el-button>
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
        prop="createBy"
        label="操作人"
        sortable
        width="120">
      </el-table-column>
      <el-table-column
        prop="importQuantity"
        label="操作数量"
        width="100">
      </el-table-column>
      <el-table-column
        prop="importResult"
        label="状态"
        width="120">
        <template slot-scope="scope">          
          {{scope.row.importResult==1 ? '成功':(scope.row.importResult==0 ? '失败':'处理中')}}
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注">
      </el-table-column>
      <el-table-column
        prop="csvUrl"
        label="数据"
        width="150">
        <template slot-scope="scope">          
          <el-button
            size="mini"         
            v-if="scope.row.csvUrl" 
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
        Dictions:{
          brand_type:[],
          sales_platform:[],
          sales_type:[],
          order_unit:[],
          product_gp_management_type:[],
          product_pyramid_type:[]
        },//本页面使用的所有字典
        areaData:{
          isarea:'1',
          data:[]
        },
        tableHeight:parseInt(document.documentElement.clientHeight-160),
        loading:false,
        currentPage:1,
        total:0,
        searchForm:{
          condition:{
            type:1,
          },          
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
      getDicValue(name,code){
        let val = '';
        this.Dictions[code].map(item=>{
          if(name==item.dictName){
            val = item.dictValue;
          }
        })
        return val;
      },
      upload(option){     
        this.$util.readExcel(option.file,this.treatDatas)
      },
      treatDatas(datas,file){
        let arr = [];
        for(let i =1;i<datas.sheet0.length;i++){
          arr.push({
            pCode:datas.sheet0[i][0],
            brand:this.getDicValue(datas.sheet0[i][1],'brand_type'),
            pFaremode:datas.sheet0[i][2],
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
            //pBoquantity:datas.sheet0[i][14],
            isPromotion:datas.sheet0[i][14] == 'Y' ? 1 : 0,
            isPrint:datas.sheet0[i][15] == 'Y' ? 1 : 0,
            isAuth:datas.sheet0[i][16] == 'Y' ? 1 : 0,
            isPc:datas.sheet0[i][17] == 'Y' ? 1 : 0,
            canReturns:datas.sheet0[i][18] == 'Y' ? 1 : 0,
            isNewproduct:datas.sheet0[i][19] == 'Y' ? 1 : 0,
            isBox:datas.sheet0[i][20] == 'Y' ? 1 : 0,
            isReturn:datas.sheet0[i][21] == 'Y' ? 1 : 0,
            isInteger:datas.sheet0[i][22] == 'Y' ? 1 : 0,
            isAreaPromotion:datas.sheet0[i][23] == 'Y' ? 1 : 0,
            isTemporaryPromotion:datas.sheet0[i][24] == 'Y' ? 1 : 0
          })
        }
        let thiz = this;
        this.loading = true;
        thiz.$tupHttp(thiz,'product/importProductDetails','POST',{list:arr ,remark:this.remark}).then(res=>{
          thiz.loading = false;
          thiz.fileList = [];
          thiz.remark = '';
          thiz.$notify.success({
            title: '成功提示',
            message: '操作成功'
          });
          thiz.loadData()      
        },res=>{
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
      detail(index, row){
        this.gotoUrl('/frame/order/backendOrder/sfProductOrderImportList/'+row.id)   
      },
      downLoad(index, row) {
        window.open(row.csvUrl)
      },
      loadData(isSearch){
        let thiz = this;
        thiz.tableLoading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        thiz.$tupHttp(thiz,'product/product/selectImportRecords','POST',thiz.searchForm).then(res=>{
          thiz.tableData = res.body.models;
          thiz.tableLoading = false;
          thiz.total = res.body.pageInfo.total ? res.body.pageInfo.total : 0;          
        },res=>{
          thiz.tableLoading = false;
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
      this.loadData();
      this.loadDictions();
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
