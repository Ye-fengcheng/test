<template>
  <div>
    <div style="line-height: 26px;">
      <el-upload
        style="float:left;"
        :show-file-list="false"
        :multiple="true"
        :httpRequest="upload">
        <el-button icon="el-icon-upload2"  :loading="loading" size="mini" type="primary">产品分类上传</el-button>
      </el-upload>  
      &nbsp;&nbsp;
      <el-button style="float:left;margin-left:5px;" size="mini" @click="$util.winOpen('static/useJs/doc/ClassProduct.xlsx?'+$util.getRandom())" type="text">产品分类下载模板</el-button>
      
      <el-upload
        :show-file-list="false"
        style="float:left;margin-left:5px;"
        :multiple="true"
        :httpRequest="upload1">
        <el-button icon="el-icon-upload2"  :loading="loading" size="mini" type="primary">重点热卖产品上传</el-button>
      </el-upload>  
      <el-button size="mini" @click="$util.winOpen('static/useJs/doc/HotProduct.xlsx?'+$util.getRandom())" type="text">重点热卖产品下载模板</el-button>
    </div>
    <br/>
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
        prop="createTime"
        label="操作时间"
        :formatter="formatter"
        width="180">
      </el-table-column>
      <el-table-column
        prop="createUser"
        label="操作人"
        sortable
        width="120">
      </el-table-column>
      <el-table-column
        prop="operand"
        label="操作数量"
        width="100">
      </el-table-column>
      <el-table-column
        prop="type"
        label="导入类型"
        width="100">
         <template slot-scope="scope">          
          {{scope.row.type==2 ? '重点热卖':'产品分类'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态">
        <template slot-scope="scope">          
          {{scope.row.status==1 ? '成功':'失败'}}
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="resultUrl"
        label="下载">
        <template slot-scope="scope">          
          <el-button
            size="mini"          
            type="primary"
            @click="downLoad(scope.$index, scope.row)">下载</el-button>
        </template>
      </el-table-column> -->
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
  </div>
</template>

<script>
  export default {
    data() {
      return {
        Dictions:{
          retail_price_range:[
            {
              dictCode: "retail_price_range",
              dictName: "普及类",
              dictValue: "1"
            },
            {
              dictCode: "retail_price_range",
              dictName: "低价位",
              dictValue: "2"
            },
            {
              dictCode: "retail_price_range",
              dictName: "中价位",
              dictValue: "3"
            },
            {
              dictCode: "retail_price_range",
              dictName: "高价组合",
              dictValue: "4"
            },
            {
              dictCode: "retail_price_range",
              dictName: "高价单品",
              dictValue: "5"
            },
            {
              dictCode: "retail_price_range",
              dictName: "超级高价",
              dictValue: "6"
            },
            {
              dictCode: "retail_price_range",
              dictName: "OT",
              dictValue: "7"
            },
            {
              dictCode: "retail_price_range",
              dictName: "周年庆",
              dictValue: "8"
            },
            {
              dictCode: "retail_price_range",
              dictName: "首订",
              dictValue: "9"
            }
          ]
        },
        areaData:{
          isarea:'1',
          data:[]
        },
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
        tableLoading:false
      }
    },
    watch:{
    },
    methods: {
      upload(option){     
        this.$util.readExcel(option.file,this.treatDatas)
      },
      treatDatas(datas){
        let arr = [];
        for(let i =1;i<datas.sheet0.length;i++){
          if(!!datas.sheet0[i][0]){
            arr.push({
              itemNo:datas.sheet0[i][0] ? datas.sheet0[i][0] : '',
              productDescription:datas.sheet0[i][1] ? datas.sheet0[i][1] : '',
              chineseName:datas.sheet0[i][2] ? datas.sheet0[i][2] : '',
              platform:datas.sheet0[i][3] ? datas.sheet0[i][3] : '',              
              category:datas.sheet0[i][4] ? datas.sheet0[i][4] : '',
              chinaSubCategory:datas.sheet0[i][5] ? datas.sheet0[i][5] : '',
              prodLine:datas.sheet0[i][6] ? datas.sheet0[i][6] : '',
              gpManagement:datas.sheet0[i][7] ? datas.sheet0[i][7] : '',
              salesType:datas.sheet0[i][8] ? datas.sheet0[i][8] : '',
              pyramid:datas.sheet0[i][9] ? datas.sheet0[i][9] : '',
              globalCategory:datas.sheet0[i][10] ? datas.sheet0[i][10] : '',
              globalSubCategory:datas.sheet0[i][11] ? datas.sheet0[i][11] : '',
              globalProdLine:datas.sheet0[i][12] ? datas.sheet0[i][12] : '',
              memberSuit:datas.sheet0[i][13] ? datas.sheet0[i][13] : '',
              /* regionalPromotion:datas.sheet0[i][14] ? datas.sheet0[i][14] : '',
              temporaryPromotion:datas.sheet0[i][15] ? datas.sheet0[i][15] : '',
              groupPurchase:datas.sheet0[i][16] ? datas.sheet0[i][16] : '', */
              retailPriceRange:this.getDicValue(datas.sheet0[i][14],'retail_price_range'),
              topN:datas.sheet0[i][15] ? datas.sheet0[i][15] : '',
              topNCoefficient:datas.sheet0[i][16] ? datas.sheet0[i][16] : 1,
            })
          }
        }
        let thiz = this;
        this.loading = true;
        thiz.$tupHttp(thiz,'mktProdClassification/insertMktProdClass','POST',arr).then(res=>{
          thiz.loadData()
          thiz.loading = false;
        },res=>{
          thiz.loading = false;
        }) 
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
      upload1(option){   
        this.$util.readExcel(option.file,this.treatDatas1)  
      },
      treatDatas1(datas){
        let arr = [];
        for(let i =1;i<datas.sheet0.length;i++){
          if(!!datas.sheet0[i][1] || !!datas.sheet0[i][0] || !!datas.sheet0[i][2]){
            arr.push({
              productName:datas.sheet0[i][0] ? datas.sheet0[i][0] : '',
              productNo:datas.sheet0[i][1] ? datas.sheet0[i][1] : '',
              number:datas.sheet0[i][2] ? datas.sheet0[i][2] : ''
            })
          }
        }
        let thiz = this;
        this.loading = true;
        thiz.$tupHttp(thiz,'hotSaleProduct/insertHotSaleProduct','POST',arr).then(res=>{
          thiz.loadData()
          thiz.loading = false;
        },res=>{
          thiz.loading = false;
        }) 
      },
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData();
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='createTime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd");
        }
        return txt;
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      },     
      downLoad(index, row) {
        let thiz = this;
        thiz.loading = true;
        thiz.$tupHttp(thiz,'mktProdClassification/exportMktProdClassificationExcel?marketProductClassificationId='+row.rowId,'POST','').then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '文件已加入下载队列，稍后前往 "内容管理-导出下载" 下载文件'
          });
        },res=>{
          thiz.loading = false;
        })
      },
      loadDictions(){
        let thiz = this;
        let params = ["retail_price_range"];
        this.$baseData.getDicts(this,params,function(data){
          thiz.Dictions = data;
        });
      },
      loadData(isSearch){
        let thiz = this;
        thiz.tableLoading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        thiz.$tupHttp(thiz,'mktProdClassification/getMarktProductClassification','POST',thiz.searchForm).then(res=>{
          thiz.tableData = res.body.models;
          thiz.total = res.body.pageInfo.total
          thiz.tableLoading = false;
        },res=>{
          thiz.tableLoading = false;
        })
      }
    },
    mounted(){
      this.loadDictions();
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
