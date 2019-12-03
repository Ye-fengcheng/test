<template>
  <div>
    <el-table
      :data="tableData"
      v-loading="tableLoading"
      style="width: 100%;"
      height="500"
      highlight-current-row
      :default-sort = "{prop: 'date', order: 'descending'}">
      <el-table-column
        prop="year"
        label="年"
        fixed="left"
        width="80">
      </el-table-column>
      <el-table-column
        prop="month"
        fixed="left"
        label="月"
        width="50">
      </el-table-column>
      <el-table-column
        prop="area"
        fixed="left"
        label="区域"
        width="100">
      </el-table-column>
      <el-table-column
        prop="province"
        fixed="left"
        label="省办"
        width="100">
      </el-table-column>
      <el-table-column label="当月" align="center">
        <el-table-column label="平台" align="center">
          <el-table-column
            prop="monthTup"
            label="TUP销售占比"
            width="120">
          </el-table-column>
          <el-table-column
            prop="monthWaterPurifier"
            label="净水器销售占比"
            width="120">
          </el-table-column>
          <el-table-column
            prop="monthClass"
            label="理家课堂销售占比"
            width="140">
          </el-table-column>
          <el-table-column
            prop="monthCustomize"
            label="私人定制销售占比"
            width="140">
          </el-table-column>
          <el-table-column
            prop="monthMember"
            label="会员销售占比"
            width="110">
          </el-table-column>
        </el-table-column>
        <el-table-column label="促销" align="center">
          <el-table-column
            prop="monthArea"
            label="区域促销占比"
            width="120">
          </el-table-column>
          <el-table-column
            prop="monthTemporary"
            label="临时促销占比"
            width="120">
          </el-table-column>
          <el-table-column
            prop="monthGroupBuying"
            label="团购占比"
            width="100">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="年累计" align="center">
        <el-table-column label="平台" align="center">
          <el-table-column
            prop="yearTup"
            label="TUP销售占比"
            width="120">
          </el-table-column>
          <el-table-column
            prop="yearWaterPurifier"
            label="净水器销售占比"
            width="120">
          </el-table-column>
          <el-table-column
            prop="yearClass"
            label="理家课堂销售占比"
            width="140">
          </el-table-column>
          <el-table-column
            prop="yearCustomize"
            label="私人定制销售占比"
            width="140">
          </el-table-column>
          <el-table-column
            prop="yearMember"
            label="会员销售占比"
            width="110">
          </el-table-column>
        </el-table-column>
        <el-table-column label="平台贡献净额增长率" align="center">
          <el-table-column
            prop="yearGrowthTup"
            label="TUP销售占比"
            width="120">
          </el-table-column>
          <el-table-column
            prop="yearGrowthWaterPurifier"
            label="净水器销售占比"
            width="120">
          </el-table-column>
          <el-table-column
            prop="yearGrowthClass"
            label="理家课堂销售占比"
            width="140">
          </el-table-column>
          <el-table-column
            prop="yearGrowthCustomize"
            label="私人定制销售占比"
            width="140">
          </el-table-column>
          <el-table-column
            prop="yearGrowthMember"
            label="会员销售占比"
            width="110">
          </el-table-column>
        </el-table-column>
        <el-table-column label="促销" align="center">
          <el-table-column
            prop="yearArea"
            label="区域促销占比"
            width="120">
          </el-table-column>
          <el-table-column
            prop="yearTemporary"
            label="临时促销占比"
            width="120">
          </el-table-column>
          <el-table-column
            prop="yearGroupBuying"
            label="团购占比"
            width="100">
          </el-table-column>
        </el-table-column>
        <el-table-column label="进出比" align="center">
          <el-table-column
            prop="yearWaterPurifier1"
            label="净水器进出比"
            width="120">
          </el-table-column>
          <el-table-column
            prop="yearSuit43"
            label="43件套进出比"
            width="120">
          </el-table-column>
          <el-table-column
            prop="yearPan57"
            label="5.7升锅进出比"
            width="120">
          </el-table-column>
          <el-table-column
            prop="yearFryPan"
            label="三层炒锅进出比"
            width="120">
          </el-table-column>
        </el-table-column>
        <el-table-column label="订购率" align="center">
          <el-table-column
            prop="orderRateWaterPurifier"
            label="净水器进出比"
            width="120">
          </el-table-column>
          <el-table-column
            prop="orderRateSuit43"
            label="43件套进出比"
            width="120">
          </el-table-column>
          <el-table-column
            prop="orderRatePan57"
            label="5.7升锅进出比"
            width="120">
          </el-table-column>
          <el-table-column
            prop="orderRateFryPan"
            label="三层炒锅进出比"
            width="120">
          </el-table-column>
        </el-table-column>
        <el-table-column label="店均订购" align="center">
          <el-table-column
            prop="shopOrderWaterPurifier"
            label="净水器进出比"
            width="120">
          </el-table-column>
          <el-table-column
            prop="shopOrderSuit43"
            label="43件套进出比"
            width="120">
          </el-table-column>
          <el-table-column
            prop="shopOrderPan57"
            label="5.7升锅进出比"
            width="120">
          </el-table-column>
          <el-table-column
            prop="shopOrderFryPan"
            label="三层炒锅进出比"
            width="120">
          </el-table-column>
        </el-table-column>
        <el-table-column label="店均销售" align="center">
          <el-table-column
            prop="shopSalesWaterPurifier"
            label="净水器进出比"
            width="120">
          </el-table-column>
          <el-table-column
            prop="shopSalesSuit43"
            label="43件套进出比"
            width="120">
          </el-table-column>
          <el-table-column
            prop="shopSalesPan57"
            label="5.7升锅进出比"
            width="120">
          </el-table-column>
          <el-table-column
            prop="shopSalesFryPan"
            label="三层炒锅进出比"
            width="120">
          </el-table-column>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        id:this.$route.params.id,
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
      gotoUrl(url){
        this.$router.push({ path: url });
      },     
      downLoad(index, row) {
        window.open(row.resultUrl)
      },
      loadData(){
        let thiz = this;
        thiz.tableLoading = true;
        thiz.$tupHttp(thiz,'dashBoard/getTableDetail?tableType=M01','POST',{id:this.id}).then(res=>{
          thiz.tableData = res.body.models;
          thiz.tableLoading = false;
        },res=>{
          thiz.tableLoading = false;
        })
      }
    },
    mounted(){
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
