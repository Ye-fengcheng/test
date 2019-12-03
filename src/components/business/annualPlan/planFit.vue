<template>
  <div >
    <el-form  :model="searchForm"  label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="区域">            
            <tup-arae-select type="area" size="mini" v-model="searchForm.areaObject"  ></tup-arae-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="省办">            
            <tup-arae-select v-model="searchForm.provinceObject"></tup-arae-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="分销商编号">
            <el-input v-model="searchForm.sDbStr" size="mini"  placeholder="分销商编号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">        
        <el-col :span="8">          
          <el-form-item label="专卖店编号">
            <el-input v-model="searchForm.clientId" size="mini" placeholder="专卖店编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">          
          <el-form-item label="DFS工号">
            <el-input v-model="searchForm.fsNo" size="mini" placeholder="DFS工号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">          
          <el-form-item label="DFS姓名">
            <el-input v-model="searchForm.fsName" size="mini" placeholder="DFS姓名"></el-input>
          </el-form-item>
        </el-col>   
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">          
          <el-form-item label="DM工号">
            <el-input v-model="searchForm.dmNo" size="mini" placeholder="DM工号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">          
          <el-form-item label="DM姓名">
            <el-input v-model="searchForm.dmName" size="mini" placeholder="DM姓名"></el-input>
          </el-form-item>
        </el-col>  
        <el-col :span="8">
          <el-form-item label="日期">
            <el-date-picker
              style="width:100%"
              v-model="searchForm.date"
              size="mini"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button  style="float:left;margin-left:10px;" type="primary" icon="el-icon-search" size="mini" @click="loadData(true)">查询</el-button>
        <el-button style="float:left;margin-left:10px;"  icon="el-icon-refresh" type="primary" size="mini" @click="resetForm">重置</el-button>
        <el-button style="float:left;margin-left:10px;" icon="el-icon-download" @click="downLoad" :loading="loading" size="mini" type="primary">导出</el-button>
      </el-form-item>
    </el-form>   
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
        prop="regionName"
        label="区域"
        sortable
        width="80">
      </el-table-column>
      <el-table-column
        prop="provinceName"
        label="省办"
        sortable
        width="80">
      </el-table-column>
      <el-table-column
        prop="clientId"
        label="专卖店编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="clientName"
        label="专卖店名称"
        width="150">
      </el-table-column>   
      <el-table-column
        prop="dbNo"
        label="分销商编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="dbName"
        label="分销商名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="dmNo"
        label="DM工号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="dmName"
        label="DM姓名"
        width="100">
      </el-table-column>
      <el-table-column
        prop="fsNo"
        label="DFS工号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="fsName"
        label="DFS人员"
        width="100">
      </el-table-column>
      
      <el-table-column
        prop="actAmt"
        label="实际销售额"
        width="100">
      </el-table-column>
      <el-table-column
        prop="stockAmt"
        label="库存金额"
        width="150">
      </el-table-column>
      <el-table-column
        prop="vip"
        label="VIP数"
        width="150">
      </el-table-column>
      <el-table-column
        prop="cit43SaleQty"
        label="43件套销售数量"
        width="130">
      </el-table-column>
      <el-table-column
        prop="cit43StockQty"
        label="43件套库存数量"
        width="130">
      </el-table-column>
      <el-table-column
        prop="jacketedkettleSaleQty"
        label="套锅销售数量"
        width="100">
      </el-table-column>
      <el-table-column
        prop="jacketedkettleStockQty"
        label="套锅库存数量"
        width="100">
      </el-table-column>
      <el-table-column
        prop="pressurecookerSaleQty"
        width="120"
        label="高压锅销售数量">
      </el-table-column>    
      <el-table-column
        prop="pressurecookerStockQty"
        width="120"
        label="高压锅库存数量">
      </el-table-column> 
      <el-table-column
        prop="micropanSaleQty"
        width="140"
        label="高能微烤锅销售数量">
      </el-table-column> 
      <el-table-column
        prop="micropanStockQty"
        width="140"
        label="高能微烤锅库存数量">
      </el-table-column> 
      <el-table-column
        prop="waterpurifierSaleQty"
        width="120"
        label="净水器销售数量">
      </el-table-column> 
      <el-table-column
        prop="waterpurifierStockQty"
        width="120"
        label="净水器库存数量">
      </el-table-column> 
      <el-table-column
        prop="slimpotSaleQty"
        width="120"
        label="纤巧壶销售数量">
      </el-table-column> 
      <el-table-column
        prop="slimpotStockQty"
        width="120"
        label="纤巧壶库存数量">
      </el-table-column> 
      <el-table-column
        prop="freecupSaleQty"
        width="120"
        label="随心杯销售数量">
      </el-table-column> 
      <el-table-column
        prop="freecupStockQty"
        width="120"
        label="随心杯库存数量">
      </el-table-column> 
      <el-table-column
        prop="thermosSaleQty"
        width="120"
        label="保温瓶销售数量">
      </el-table-column> 
      <el-table-column
        prop="thermosStockQty"
        width="120"
        label="保温瓶库存数量">
      </el-table-column> 
      <el-table-column
        prop="renovationCosts"
        label="装修费用"
        width="150">
      </el-table-column>
      <el-table-column
        prop="renovationMonth"
        label="开业或重装修月数"
        width="150">
      </el-table-column>
      <el-table-column
        prop="renovationDiscountAmt"
        label="装修月折旧额"
        width="150">
      </el-table-column>
      <el-table-column
        prop="monthRent"
        label="店铺月均租金"
        width="150">
      </el-table-column>
      <el-table-column
        prop="hcc"
        label="HCC人数（不含店长）"
        width="180">
      </el-table-column>
      <el-table-column
        prop="hccWorkTime"
        label="HCC平均在岗时间"
        width="150">
      </el-table-column>
      <el-table-column
        prop="storeManager"
        label="全职店长人数"
        width="150">
      </el-table-column>
      <el-table-column
        prop="storeManagerReward"
        label="店长全年总工资"
        width="150">
      </el-table-column>
      <el-table-column
        prop="utilityFee"
        label="月均水电气及网络费"
        width="150">
      </el-table-column>
      <el-table-column
        prop="taxes"
        label="月均税费及杂费"
        width="150">
      </el-table-column>
      <el-table-column
        prop="workMonth"
        label="经营月数"
        width="100">
      </el-table-column>
      <el-table-column
        prop="feeTotal"
        label="费用合计"
        width="100">
      </el-table-column>
      <el-table-column
        prop="pDiscountvalue"
        label="进货折扣"
        width="100">
        <template slot-scope="scope"> 
          {{scope.row.pDiscountvalue ? $util.formatThousand(scope.row.pDiscountvalue,0)+'%':''}}
        </template>
      </el-table-column>
      <el-table-column
        prop="netProfit"
        label="净利润额"
        width="100">
      </el-table-column>
      <el-table-column
        prop="netProfitRate"
        label="净利润率"
        width="100">
        <template slot-scope="scope"> 
          {{scope.row.netProfitRate ? $util.formatThousand(scope.row.netProfitRate*100,0)+'%':''}}
        </template>
      </el-table-column>
      <el-table-column
        prop="msg1"
        label="主推产品销售比"
        width="150">
      </el-table-column>
      <el-table-column
        prop="msg2"
        label="库存天数"
        width="100">
      </el-table-column>
      <el-table-column
        prop="msg3"
        label="HCC人数+在岗时间+店长人数"
        width="150">
      </el-table-column>
      <el-table-column
        prop="msg4"
        label="人员费用/销售额"
        width="150">
      </el-table-column>
      <el-table-column
        prop="msg5"
        label="净利润额+净利润率"
        width="150">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        :formatter="formatter"
        label="更新时间">
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top:15px;">
      <el-pagination
        @current-change="handleCurrentChange"
        background
        :current-page="searchForm.pagingQuery.pageIndex"
        :page-size="50"
        layout="prev , next"
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
          sDbStr:'',
          sProvince:[],
          provinceObject:[],
          sRegion:[],
          areaObject:[],
          dmNo:'',
          dmName:'',
          fsNo:'',
          fsName:'',
          date:'',
          startTime:'',
          endTime:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:50
          }
        },
        tableData: [
        ],
        tableLoading:false
      }
    },
    watch:{
      "searchForm.areaObject":function(val){
        let datas = [];
        val.map(item=>{
          if(item.code !='999')
            datas.push(item.code)
        })
        this.searchForm.sRegion = datas;
      },
      "searchForm.provinceObject":function(val){
        let datas = [];
        val.map(item=>{
          if(item.code !='999')
            datas.push(item.code)
        })
        this.searchForm.sProvince = datas;
      },
      'searchForm.date':function(val){
        if(!val){
          this.searchForm.deliverBeginTime = '';
          this.searchForm.deliverEndTime = '';
        }
        else{
          this.searchForm.deliverBeginTime = val[0];
          this.searchForm.deliverEndTime = val[1];
        }
      },
    },
    methods: {
      resetForm(){
        this.searchForm = {
          sDbStr:'',
          sProvince:[],
          provinceObject:[],
          sRegion:[],
          areaObject:[],
          dmNo:'',
          dmName:'',
          fsNo:'',
          fsName:'',
          date:'',
          startTime:'',
          endTime:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:this.searchForm.pagingQuery.pageSize
          }
        }
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='arrivalTime' || column.property =='updateTime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss");
        }
        return txt;
      },
      view(ind,row){
        this.gotoUrl('/frame/purchare/boxDetailQuery/'+row.id)
      },
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData();
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      },     
      downLoad(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        delete data.pagingQuery;
        thiz.$tupHttp(thiz,'profitCalculation/profitCalculationExport','POST',data,{},'/manage-psi/',false,'').then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '文件已加入下载队列，稍后前往 "基础设置-内容管理-导出下载" 下载文件'
          });
        },res=>{
          thiz.loading = false;
        })
      },
      loadData(isSearch){
        let thiz = this;
        thiz.tableLoading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        thiz.$tupHttp(thiz,'profitCalculation/getProfitCalculation','POST',thiz.searchForm,{},'/manage-psi/',false,'').then(res=>{
          thiz.tableData = res.body.models;
          thiz.total += res.body.models ? res.body.models.length:0
          thiz.tableLoading = false;
        },res=>{
          thiz.tableLoading = false;
        })
      },
      getFMonth(){
        let thiz = this;   
        let today = new Date();     
        this.$tupHttp(this,'monForFinancing/selectByMonth?date='+today.format("yyyy-MM-dd"),'GET').then(res=>{
          if(res.body.model){
            thiz.fMonth = [new Date(res.body.model.startDate).format("yyyy-MM-dd"),new Date(res.body.model.endDate).format("yyyy-MM-dd")]
            thiz.searchForm.date = thiz.fMonth           
          }
        })
      }
    },
    mounted(){
      this.$util.onKeyCode(this,'loadData',[true])
      //this.getFMonth();
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
