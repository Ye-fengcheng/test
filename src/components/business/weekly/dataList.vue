<template>
  <div>
    <el-form :inline="true" :model="form" class="demo-form-inline">
      <el-form-item label="专卖店编号">
        <el-input v-model="form.condition.organNo" style="width:100px;" placeholder="专卖店编号"></el-input>
      </el-form-item>
      <el-form-item label="财务年">
        <el-select v-model="form.condition.pYear" clearable filterable  style="width:100px;" placeholder="财务年">
          <el-option
            v-for="item in years"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="财务月">
        <el-select v-model="form.condition.pMonth" clearable filterable style="width:100px;" placeholder="请选择">
          <el-option label="1" value="1"></el-option>
          <el-option label="2" value="2"></el-option>
          <el-option label="3" value="3"></el-option>
          <el-option label="4" value="4"></el-option>
          <el-option label="5" value="5"></el-option>
          <el-option label="6" value="6"></el-option>
          <el-option label="7" value="7"></el-option>
          <el-option label="8" value="8"></el-option>
          <el-option label="9" value="9"></el-option>
          <el-option label="10" value="10"></el-option>
          <el-option label="11" value="11"></el-option>
          <el-option label="12" value="12"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="财务周">
        <el-select v-model="form.condition.pWeek" clearable filterable style="width:100px;" placeholder="财务周">
          <el-option
            v-for="item in weeks"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="loadData">查询</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-button icon="el-icon-download" @click="exportExcel" type="success">导出到Excel</el-button>
    </div>
    <el-table
      :data="datas"
      style="width: 100%;"
      height="440"
      highlight-current-row>
      <el-table-column
        type="index"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="region"
        label="区域"
        sortable
        width="80">
      </el-table-column>
      <el-table-column
        prop="province"
        label="省份"
        sortable
        width="80">
      </el-table-column>
      <el-table-column
        prop="organNo"
        label="店编"
        sortable
        width="80">
      </el-table-column>
      <el-table-column
        prop="organName"
        label="店名"
        sortable
        width="150">
      </el-table-column>
      <el-table-column
        prop="time"
        label="周报时间"
        :formatter="formatter"
        width="150">
      </el-table-column>
      <el-table-column
        prop="pCounterSaleAmts"
        label="专卖店/专柜销售额"
        sortable
        width="100">
      </el-table-column>
      <el-table-column
        prop="pLijiaSalesAmts"
        label="理家课堂销售额"
        sortable
        width="100">
      </el-table-column>
      <el-table-column
        prop="pGrpbSalesAmts"
        label="团购销售额"
        sortable
        width="100">
      </el-table-column>
      <el-table-column
        prop="pCustomisedSalesAmts"
        label="私人订制销售额"
        sortable
        width="100">
      </el-table-column>
      <el-table-column
        prop="pOthersSalesAmts"
        label="其他销售额"
        sortable
        width="100">
      </el-table-column>
      <el-table-column
        prop="pDealAmts"
        label="成交笔数"
        sortable
        width="100">
      </el-table-column>
      <el-table-column
        prop="pBreakevenpoint"
        label="盈亏平衡点"
        sortable
        width="100">
      </el-table-column>
      <el-table-column
        prop="pTotalSalesAmts"
        label="销售总额"
        sortable
        width="100">
      </el-table-column>
      <el-table-column
        prop="pTotalCustomerNo"
        label="顾客总数"
        sortable
        width="100">
      </el-table-column>
      <el-table-column
        prop="pNaturalCustomerNo"
        label="自然入店顾客"
        sortable
        width="100">
      </el-table-column>
      <el-table-column
        prop="pComebackCustomerNo"
        label="回店会员数"
        sortable
        width="100">
      </el-table-column>
      <el-table-column
        prop="pCustomisedCustomerNo"
        label="私人订制顾客数"
        sortable
        width="100">
      </el-table-column>
      <el-table-column
        prop="pLijiaCustomerNo"
        label="参加理家课堂顾客数"
        sortable
        width="100">
      </el-table-column>
      <el-table-column
        prop="pTotalPrsttTimes"
        label="主动销售活动次数"
        sortable
        width="100">
      </el-table-column>
      <el-table-column
        prop="pCustomisedPrsttTimes"
        label="私人订制次数"
        sortable
        width="100">
      </el-table-column>
      <el-table-column
        prop="pLijiaPrsttTimes"
        label="理家课堂次数"
        sortable
        width="100">
      </el-table-column>
      <el-table-column
        prop="pImdtlyPrsttTimes"
        label="即时示范次数"
        sortable
        width="100">
      </el-table-column>
      <el-table-column
        prop="pWaterPurifierSalesAmts"
        label="净水器销售数量"
        sortable
        width="100">
      </el-table-column>
      <el-table-column
        prop="pTotalOrderAmt"
        label="专卖店订货额合计"
        sortable
        width="100">
      </el-table-column>
      <el-table-column
        prop="pComOrderAmt"
        label="直接从公司下单"
        sortable
        width="100">
      </el-table-column>
      <el-table-column
        prop="pTransferAmt"
        label="调货额"
        sortable
        width="100">
      </el-table-column>
      <el-table-column
        prop="pLijiaFulltimeConsutantNo"
        label="在职理家顾问数"
        sortable
        width="100">
      </el-table-column>
      <el-table-column
        prop="pIsManager"
        label="是否店长"
        :formatter="formatter"
        width="100">
      </el-table-column>
      <el-table-column
        prop="pManagerName"
        label="店长姓名"
        width="100">
      </el-table-column>
      <el-table-column
        prop="pManagerType"
        label="店长身份"
        :formatter="formatter"
        width="100">
      </el-table-column>
      <el-table-column
        prop="pReportDesc"
        label="备注"
        width="200">
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top:15px;">
      <el-pagination
        @current-change="handleCurrentChange"
        background
        :current-page="form.pagingQuery.pageIndex"
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
      let weeks = [],years=[];
      for(let i=1;i<55;i++){
        weeks.push(i)
      }
      for(let i=1990;i<2048;i++){
        years.push(i)
      }
      return {
        total:0,
        form: {
          condition:{
            organNo:'',
            pMonth: '',
            pWeek: '',
            pYear: '',
            orderBy:[],
            pReportType:'',// 报表类型 (周报8796113666139，月报8796113698907)
          },
          pagingQuery:{
            pageIndex: 0,
            pageSize: 20
          }
        },
        weeks:weeks,
        years:years,
        currentPage:1,
        datas: [
        ]
      }
    },
    methods: {
      handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.form.pagingQuery.pageIndex =  parseInt(val-1);
        this.loadData();
      },
      formatter(row, column) {
        debugger
        let txt = '';
        if(column.property =='time'){
          txt = row.pYear+'年第'+row.pWeek+'周';
        }
        else if(column.property =='pIsManager'){
          if(row.pIsManager==1){
            txt='是'
          }
          else{
            txt='否'
          }
        }
        else if(column.property =='pManagerType'){
          if(row.pManagerType==1){
            txt='雇员'
          }
          else{
            txt='投资人'
          }
        }
        return txt;
      },
      exportExcel(){
        let thiz = this;
        thiz.$tupHttp(thiz,'export','POST',thiz.form).then(res=>{
          debugger
          let a = document.createElement('a');
          let blob = new Blob([res.data],{ type:'text/plain' } );
          let url = window.URL.createObjectURL(blob);
          let fileName = '周报月报数据.csv';
          a.href = url;
          a.download = fileName;
          a.click();
          window.URL.revokeObjectURL(url);
        })
      },
      loadData(){
        let thiz = this;
        thiz.$tupHttp(thiz,'list','POST',thiz.form).then(res=>{
          debugger
          if(res.body.success){
            thiz.datas = res.body.models;
            debugger
            thiz.total = res.body.paging.totalRows;
          }
        })
      }
    },
    mounted(){
      this.loadData()
    }
  }
</script>
<style scoped>
.demo-form-inline{
  margin-bottom: 10px;
  padding: 25px  25px 0px;
  border-radius: 4px;
  border: 1px solid #eee;
}
</style>
