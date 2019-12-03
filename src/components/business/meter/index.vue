<template>
<div>
  <div>
    <el-upload
      style="float:left"
      :show-file-list="false"
      :multiple="true"
      v-if="type=='1'"
      :httpRequest="upload">
      <el-button :loading="loading" size="mini" icon="el-icon-upload2" type="primary">财务上传</el-button>
    </el-upload>
    <el-upload
      style="float:left"
      :show-file-list="false"
      :multiple="true"
      v-if="type=='2'"
      :httpRequest="uploadM">
      <el-button :loading="loading" size="mini" icon="el-icon-upload2" type="primary">市场上传</el-button>
    </el-upload>
    <el-upload
      style="float:left"
      :show-file-list="false"
      :multiple="true"
      v-if="type=='3'"
      :httpRequest="uploadH">
      <el-button :loading="loading" size="mini" icon="el-icon-upload2" type="primary">人事上传</el-button>
    </el-upload>
    <el-upload
      style="float:left"
      :show-file-list="false"
      :multiple="true"
      v-if="type=='4'"
      :httpRequest="uploadC">
      <el-button :loading="loading" size="mini" icon="el-icon-upload2" type="primary">客服上传</el-button>
    </el-upload>
    &nbsp;&nbsp;
    <el-button size="mini" @click="$util.winOpen(fileUrl)" type="text">下载模板</el-button>
  </div>
  <br/>
  <el-table
    :data="tableData"
    v-loading="tableLoading"
    style="width: 100%;"
    height="550"
    highlight-current-row
    :default-sort = "{prop: 'date', order: 'descending'}">
    <el-table-column
      type="index"
      label="序号"
      width="50">
    </el-table-column>
    <el-table-column
      prop="saveTime"
      label="日期"
      :formatter="formatter"
      sortable
      width="150">
    </el-table-column>
    <el-table-column
      prop="saveUser"
      label="操作人"
      sortable
      width="120">
    </el-table-column>
    <el-table-column
      prop="reportName"
      label="报表名称"
      width="250">
    </el-table-column>
    <el-table-column
      prop="reportSize"
      label="大小"
      width="100">
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-dropdown @command="handleCommand" size="mini" split-button >
          查看
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="type=='1'" :command="scope.$index+'||F01'">F01</el-dropdown-item>
            <el-dropdown-item v-if="type=='1'" :command="scope.$index+'||F02'">F02</el-dropdown-item>
            <el-dropdown-item v-if="type=='1'" :command="scope.$index+'||F03'">F03</el-dropdown-item>
            <el-dropdown-item v-if="type=='2'" :command="scope.$index+'||M01'">M01</el-dropdown-item>
            <el-dropdown-item v-if="type=='2'" :command="scope.$index+'||M02'">M02</el-dropdown-item>
            <!-- <el-dropdown-item v-if="type=='2'" :command="scope.$index+'||M03'">M03</el-dropdown-item> -->
            <el-dropdown-item v-if="type=='3'" :command="scope.$index+'||H01'">H01</el-dropdown-item>
            <el-dropdown-item v-if="type=='4'" :command="scope.$index+'||C01'">C01</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        &nbsp;
        <el-button
          size="mini"        
          @click="rename(scope.$index, scope.row)">重命名</el-button>
        <el-button
          size="mini"          
          type="primary"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div style="text-align: right;margin-top:15px;">
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="20"
      layout="total,  prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
  <el-dialog title="重命名" width="30%" top="5%" :visible.sync="dialogVisible">
    <el-form ref="fileForm" :model="fileForm" :rules="fileRules" label-width="0px">
      <el-form-item label="" prop="title">          
        <el-input v-model="fileForm.title"  placeholder="名称"></el-input>
      </el-form-item> 
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" size="mini" :loading="loading" @click="saveRename">确认</el-button>
      <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
  export default {
    data() {
      return {
        fileUrl:'',
        type:this.$storage.getValue('type'),
        visible:false,
        fileForm:{
          title:''
        },
        fileRules:{
          title: [
            { required: true, message: '必填', trigger: 'change' }
          ]
        },
        total:0,
        currentPage:1,
        tableLoading:false,
        loading:false,
        dialogVisible:false,
        itemIndex:-1,//当前编辑的行索引
        tableData: [
        ],
        pagingQuery:{pageIndex: 1,pageSize: 20}
      }
    },
    watch:{
      '$route': function(){
        this.id = this.$route.params.id;
        this.loadFiles();
      }
    },
    methods: {
      handleCommand(command){
        let arr = command.split('||');
        this.gotoUrl('/frame/meter/'+arr[1]+'/'+this.tableData[arr[0]].id)
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='saveTime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd");      
        }
        return txt;
      },
      handleCurrentChange(val) {
        this.pagingQuery.pageIndex = val;
        this.loadFiles();
      },
      upload(option){     
        this.$util.readExcel(option.file,this.treatDatas)
      },
      uploadM(option){     
        this.$util.readExcel(option.file,this.treatDatasM)
      },
      uploadH(option){     
        this.$util.readExcel(option.file,this.treatDatasH)
      },
      uploadC(option){     
        this.$util.readExcel(option.file,this.treatDatasC)
      },
      treatDatas(datas,file){
        let arr1 = [],
            arr2 = [],
            arr3 = [];
        let sheet0 = datas.sheet0;
        for(let i = 3;i< sheet0.length;i++){
          arr1.push({
            year : sheet0[i][0],
            month : sheet0[i][1],
            code : sheet0[i][2],
            area : sheet0[i][3],
            province :sheet0[i][4],
            targetPercentageQ1 :sheet0[i][5],
            targetBalanceQ1 :sheet0[i][6],
            targetPercentageQ2 :sheet0[i][7],
            targetBalanceQ2 :sheet0[i][8],
            targetPercentageQ3 :sheet0[i][9],
            targetBalanceQ3 :sheet0[i][10],
            targetPercentageQ4 :sheet0[i][11],
            targetBalanceQ4 :sheet0[i][12],
            targetPercentage2018 :sheet0[i][13],
            targetBalance2018 :sheet0[i][14],
            //V1.2版本新增1个
            quarterlyComplianceRate:sheet0[i][15],
            baseAmount :sheet0[i][16],
            baseLastYear :sheet0[i][17],
            baseQuarterTarget :sheet0[i][18],
            baseAfterSixMonthTarget :sheet0[i][19],
            quantityExclusiveShop :sheet0[i][20],
            quantityNewShop :sheet0[i][21],
            quantityCloseShop :sheet0[i][22],
            quantityUndeterminedShop :sheet0[i][23],
            yieldAverage :sheet0[i][24],
            //V1.2版本新增2个
            yieldYear2017 :sheet0[i][25],
            yieldYearRate2017 :sheet0[i][26],
            yieldSellProportion1 :sheet0[i][27],
            yieldShopQuantityProportion1 :sheet0[i][28],
            yieldSellProportion2  :sheet0[i][29],
            yieldShopQuantityProportion2 :sheet0[i][30],
            yieldSellProportion3  :sheet0[i][31],
            yieldShopQuantityProportion3 :sheet0[i][32],
            developmentFirstOrderAmount :sheet0[i][33],
            developmentAverageYield :sheet0[i][34],
            developmentCloseShopProportion :sheet0[i][35],
            shopRent :sheet0[i][36],
            shopAcreage :sheet0[i][37],
            shopClerkWages :sheet0[i][38],
            shopQuantityProportionB1 :sheet0[i][39],
            shopQuantityProportionB2 :sheet0[i][40],
            shopQuantityProportionB3 :sheet0[i][41],
            shopQuantityProportionA :sheet0[i][42],
            shopControlRates :sheet0[i][43],
            shopDb :sheet0[i][44],
            shopQuantity :sheet0[i][45],
            shopCg :sheet0[i][46],
            shopSingle :sheet0[i][47],
            shopImportantCityQuantity :sheet0[i][48],
            qdbQuantity :sheet0[i][49],
            qdbTargetQuantity :sheet0[i][50],
            qdbIncrease :sheet0[i][51],
            memberAmount  :sheet0[i][52],
            memberVipQuantity  :sheet0[i][53],
            memberVipAverage  :sheet0[i][54],
            salesclerkAmount  :sheet0[i][55],
            salesclerkShopAverage  :sheet0[i][56],
            salesclerkSales  :sheet0[i][57],
            firstOrderProportion  :sheet0[i][58],
            inventoryItoDays  :sheet0[i][59],
            inventoryNotIto  :sheet0[i][60],
            retailSalesReality  :sheet0[i][61],
            retailSalesComparePlan  :sheet0[i][62],
            retailSalesCompareLastYear  :sheet0[i][63],
            netAmountReality :sheet0[i][64],
            netAmountComparePlan :sheet0[i][65],
            netAmountCompareLastYear :sheet0[i][66],
            openShopReality :sheet0[i][67],
            openShopComparePlan :sheet0[i][68],
            openShopCompareLastYear :sheet0[i][69],
            //V1.2版本新增1个
            openShopCompareLastYearRate:sheet0[i][70],
            distributorReality  :sheet0[i][71],
            distributorComparePlan  :sheet0[i][72],
            distributorCompareLastYear  :sheet0[i][73],
            vipMemberReality  :sheet0[i][74],
            vipMemberComparePlan  :sheet0[i][75],
            vipMemberCompareLastYear  :sheet0[i][76],
            comprehensiveReality  :sheet0[i][77],
            comprehensiveCompareLastYear :sheet0[i][78],
            unitReality  :sheet0[i][79],
            unitCompareLastYear  :sheet0[i][80],
            grossMarginComparePlan  :sheet0[i][81],
            grossMarginCompareLastYear :sheet0[i][82]
          })
        }
        let sheet1 = datas.sheet1;
        for(let i = 3;i<sheet1.length;i++){
          arr2.push({
            year : sheet1[i][0],
            month : sheet1[i][1],
            code : sheet1[i][2],
            area : sheet1[i][3],
            province :sheet1[i][4],
            targetPercentageQ1 :sheet1[i][5],
            targetBalanceQ1 :sheet1[i][6],
            targetPercentageQ2 :sheet1[i][7],
            targetBalanceQ2 :sheet1[i][8],
            targetPercentageQ3 :sheet1[i][9],
            targetBalanceQ3 :sheet1[i][10],
            targetPercentageQ4 :sheet1[i][11],
            targetBalanceQ4 :sheet1[i][12],
            targetPercentage2018 :sheet1[i][13],
            targetBalance2018 :sheet1[i][14],
            //V1.2版本新增1个
            quarterlyComplianceRate:sheet1[i][15],
            baseAmount :sheet1[i][16],
            baseLastYear :sheet1[i][17],
            baseQuarterTarget :sheet1[i][18],
            baseAfterSixMonthTarget :sheet1[i][19],
            quantityExclusiveShop :sheet1[i][20],
            quantityNewShop :sheet1[i][21],
            quantityCloseShop :sheet1[i][22],
            quantityUndeterminedShop :sheet1[i][23],
            yieldAverage :sheet1[i][24],
            //V1.2版本新增2个
            yieldYear2017 :sheet1[i][25],
            yieldYearRate2017 :sheet1[i][26],
            yieldSellProportion1 :sheet1[i][27],
            yieldShopQuantityProportion1 :sheet1[i][28],
            yieldSellProportion2  :sheet1[i][29],
            yieldShopQuantityProportion2 :sheet1[i][30],
            yieldSellProportion3  :sheet1[i][31],
            yieldShopQuantityProportion3 :sheet1[i][32],
            developmentFirstOrderAmount :sheet1[i][33],
            developmentAverageYield :sheet1[i][34],
            developmentCloseShopProportion :sheet1[i][35],
            shopRent :sheet1[i][36],
            shopAcreage :sheet1[i][37],
            shopClerkWages :sheet1[i][38],
            shopQuantityProportionB1 :sheet1[i][39],
            shopQuantityProportionB2 :sheet1[i][40],
            shopQuantityProportionB3 :sheet1[i][41],
            shopQuantityProportionA :sheet1[i][42],
            shopControlRates :sheet1[i][43],
            shopDb :sheet1[i][44],
            shopQuantity :sheet1[i][45],
            shopCg :sheet1[i][46],
            shopSingle :sheet1[i][47],
            shopImportantCityQuantity :sheet1[i][48],
            qdbQuantity :sheet1[i][49],
            qdbTargetQuantity :sheet1[i][50],
            qdbIncrease :sheet1[i][51],
            memberAmount  :sheet1[i][52],
            memberVipQuantity  :sheet1[i][53],
            memberVipAverage  :sheet1[i][54],
            salesclerkAmount  :sheet1[i][55],
            salesclerkShopAverage  :sheet1[i][56],
            salesclerkSales  :sheet1[i][57],
            firstOrderProportion  :sheet1[i][58],
            inventoryItoDays  :sheet1[i][59],
            inventoryNotIto  :sheet1[i][60],
            retailSalesReality  :sheet1[i][61],
            retailSalesComparePlan  :sheet1[i][62],
            retailSalesCompareLastYear  :sheet1[i][63],
            netAmountReality :sheet1[i][64],
            netAmountComparePlan :sheet1[i][65],
            netAmountCompareLastYear :sheet1[i][66],
            openShopReality :sheet1[i][67],
            openShopComparePlan :sheet1[i][68],
            openShopCompareLastYear :sheet1[i][69],
            //V1.2版本新增1个
            openShopCompareLastYearRate:sheet1[i][70],
            distributorReality  :sheet1[i][71],
            distributorComparePlan  :sheet1[i][72],
            distributorCompareLastYear  :sheet1[i][73],
            vipMemberReality  :sheet1[i][74],
            vipMemberComparePlan  :sheet1[i][75],
            vipMemberCompareLastYear  :sheet1[i][76],
            comprehensiveReality  :sheet1[i][77],
            comprehensiveCompareLastYear :sheet1[i][78],
            unitReality  :sheet1[i][79],
            unitCompareLastYear  :sheet1[i][80],
            grossMarginComparePlan  :sheet1[i][81],
            grossMarginCompareLastYear :sheet1[i][82]
          })
        }
        let sheet2 = datas.sheet2;
        for(let i = 3;i<sheet2.length;i++){
          arr3.push({
            year : sheet2[i][0],
            month : sheet2[i][1],
            code : sheet2[i][2],
            area : sheet2[i][3],
            province :sheet2[i][4],
            orderGrowthRateJan  :sheet2[i][5]?sheet2[i][5]:'',
            orderGrowthRateFeb  :sheet2[i][6]?sheet2[i][6]:'',
            orderGrowthRateMar  :sheet2[i][7]?sheet2[i][7]:'',
            orderGrowthRateApr  :sheet2[i][8]?sheet2[i][8]:'',
            orderGrowthRateMay  :sheet2[i][9]?sheet2[i][9]:'',
            orderGrowthRateJun  :sheet2[i][10]?sheet2[i][10]:'',
            orderGrowthRateJul  :sheet2[i][11]?sheet2[i][11]:'',
            orderGrowthRateAug  :sheet2[i][12]?sheet2[i][12]:'',
            orderGrowthRateSep :sheet2[i][13]?sheet2[i][13]:'',
            orderGrowthRateOct  :sheet2[i][14]?sheet2[i][14]:'',
            orderGrowthRateNov  :sheet2[i][15]?sheet2[i][15]:'',
            orderGrowthRateDec  :sheet2[i][16]?sheet2[i][16]:'',
            orderGrowthRateQ1  :sheet2[i][17]?sheet2[i][17]:'',
            orderGrowthRateQ2 :sheet2[i][18]?sheet2[i][18]:'',
            orderGrowthRateQ3 :sheet2[i][19]?sheet2[i][19]:'',
            orderGrowthRateQ4 :sheet2[i][20]?sheet2[i][20]:'',
            orderGrowthRateTotalYear :sheet2[i][21]?sheet2[i][21]:'',
            retailSalesGrowthRateJan  :sheet2[i][22]?sheet2[i][22]:'',
            retailSalesGrowthRateFeb  :sheet2[i][23]?sheet2[i][23]:'',
            retailSalesGrowthRateMar  :sheet2[i][24]?sheet2[i][24]:'',
            retailSalesGrowthRateApr  :sheet2[i][25]?sheet2[i][25]:'',
            retailSalesGrowthRateMay   :sheet2[i][26]?sheet2[i][26]:'',
            retailSalesGrowthRateJun :sheet2[i][27]?sheet2[i][27]:'',
            retailSalesGrowthRateJul   :sheet2[i][28]?sheet2[i][28]:'',
            retailSalesGrowthRateAug  :sheet2[i][29]?sheet2[i][29]:'',
            retailSalesGrowthRateSep  :sheet2[i][30]?sheet2[i][30]:'',
            retailSalesGrowthRateOct  :sheet2[i][31]?sheet2[i][31]:'',
            retailSalesGrowthRateNov  :sheet2[i][32]?sheet2[i][32]:'',
            retailSalesGrowthRateDec  :sheet2[i][33]?sheet2[i][33]:'',
            retailSalesGrowthRateQ1  :sheet2[i][34]?sheet2[i][34]:'',
            retailSalesGrowthRateQ2 :sheet2[i][35]?sheet2[i][35]:'',
            retailSalesGrowthRateQ3 :sheet2[i][36]?sheet2[i][36]:'',
            retailSalesGrowthRateQ4 :sheet2[i][37]?sheet2[i][37]:'',
            retailSalesGrowthRateTotalYear :sheet2[i][38]?sheet2[i][38]:'',
          })
        }
        let thiz = this;
        this.loading = true;
        let data = {
          reportName:file.name,
          reportSize:file.size,
          cFinance01List:arr1,
          cFinance02List:arr2,
          cFinance03List:arr3
        }
        thiz.$tupHttp(thiz,'dashBoard/insertCFinance','POST',data).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '导入数据成功'
          });
          thiz.loadData()          
        },res=>{
          thiz.loading = false;
        })
      },
      treatDatasM(datas,file){
        let arr1 = [],
            arr2 = [],
            arr3 = [];
        let sheet0 = datas.sheet0;
        for(let i = 3;i< sheet0.length;i++){
          arr1.push({
            year : sheet0[i][0],
            month : sheet0[i][1],
            code : sheet0[i][2],
            area : sheet0[i][3],
            province :sheet0[i][4],
            monthTup  :sheet0[i][5]?sheet0[i][5]:'',
            monthWaterPurifier :sheet0[i][6]?sheet0[i][6]:'',
            monthClass :sheet0[i][7]?sheet0[i][7]:'',
            monthCustomize  :sheet0[i][8]?sheet0[i][8]:'',
            monthMember  :sheet0[i][9]?sheet0[i][9]:'',
            monthArea  :sheet0[i][10]?sheet0[i][10]:'',
            monthTemporary  :sheet0[i][11]?sheet0[i][11]:'',
            monthGroupBuying  :sheet0[i][12]?sheet0[i][12]:'',
            yearTup  :sheet0[i][13]?sheet0[i][13]:'',
            yearWaterPurifier  :sheet0[i][14]?sheet0[i][14]:'',
            yearClass  :sheet0[i][15]?sheet0[i][15]:'',
            yearCustomize  :sheet0[i][16]?sheet0[i][16]:'',
            yearMember  :sheet0[i][17]?sheet0[i][17]:'',
            //V1.2版本新增5个
            yearGrowthTup :sheet0[i][18]?sheet0[i][18]:'',
            yearGrowthWaterPurifier  :sheet0[i][19]?sheet0[i][19]:'',
            yearGrowthClass  :sheet0[i][20]?sheet0[i][20]:'',
            yearGrowthCustomize :sheet0[i][21]?sheet0[i][21]:'',
            yearGrowthMember  :sheet0[i][22]?sheet0[i][22]:'',
            yearArea  :sheet0[i][23]?sheet0[i][23]:'',
            yearTemporary  :sheet0[i][24]?sheet0[i][24]:'',
            yearGroupBuying  :sheet0[i][25]?sheet0[i][25]:'',
            yearWaterPurifier1 :sheet0[i][26]?sheet0[i][26]:'',
            yearSuit43  :sheet0[i][27]?sheet0[i][27]:'',
            yearPan57  :sheet0[i][28]?sheet0[i][28]:'',
            yearFryPan  :sheet0[i][29]?sheet0[i][29]:'',
            orderRateWaterPurifier  :sheet0[i][30]?sheet0[i][30]:'',
            orderRateSuit43   :sheet0[i][31]?sheet0[i][31]:'',
            orderRatePan57  :sheet0[i][32]?sheet0[i][32]:'',
            orderRateFryPan   :sheet0[i][33]?sheet0[i][33]:'',
            shopOrderWaterPurifier  :sheet0[i][34]?sheet0[i][34]:'',
            shopOrderSuit43  :sheet0[i][35]?sheet0[i][35]:'',
            shopOrderPan57  :sheet0[i][36]?sheet0[i][36]:'',
            shopOrderFryPan  :sheet0[i][37]?sheet0[i][37]:'',
            shopSalesWaterPurifier  :sheet0[i][38]?sheet0[i][38]:'',
            shopSalesSuit43  :sheet0[i][39]?sheet0[i][39]:'',
            shopSalesPan57  :sheet0[i][40]?sheet0[i][40]:'',
            shopSalesFryPan  :sheet0[i][41]?sheet0[i][41]:''
          })
        }
        let sheet1 = datas.sheet1;
        for(let i = 2;i<sheet1.length;i++){
          arr2.push({
            year : sheet1[i][0],
            month : sheet1[i][1],
            code : sheet1[i][2],
            area : sheet1[i][3],
            province :sheet1[i][4],
            topNo  :sheet1[i][5]?sheet1[i][5]:'',
            monthTopProduct  :sheet1[i][6]?sheet1[i][6]:'',
            monthSalesProportion  :sheet1[i][7]?sheet1[i][7]:'',
            monthForecastOrder  :sheet1[i][8]?sheet1[i][8]:'',
            monthRealityOrder  :sheet1[i][9]?sheet1[i][9]:'',
            yearTopProduct  :sheet1[i][10]?sheet1[i][10]:'',
            yearSalesProportion  :sheet1[i][11]?sheet1[i][11]:'',
            yearForecastOrder  :sheet1[i][12]?sheet1[i][12]:'',
            yearRealityOrder  :sheet1[i][13]?sheet1[i][13]:'',
            //V1.2版本新增1个
            yearLastSalesProportion  :sheet1[i][14]?sheet1[i][14]:'',
          })
        }
        /* let sheet2 = datas.sheet2;
        for(let i = 4;i<sheet2.length;i++){
          arr3.push({
            year : sheet2[i][0],
            month : sheet2[i][1],
            code : sheet2[i][2],
            area : sheet2[i][3],
            province :sheet2[i][4],
            monthTup   :sheet2[i][5]?sheet2[i][5]:'',
            monthWaterPurifier   :sheet2[i][6]?sheet2[i][6]:'',
            monthClass   :sheet2[i][7]?sheet2[i][7]:'',
            monthCustomize  :sheet2[i][8]?sheet2[i][8]:'',
            monthMember   :sheet2[i][9]?sheet2[i][9]:'',
            yearTup   :sheet2[i][10]?sheet2[i][10]:'',
            yearWaterPurifier   :sheet2[i][11]?sheet2[i][11]:'',
            yearClass   :sheet2[i][12]?sheet2[i][12]:'',
            yearCustomize  :sheet2[i][13]?sheet2[i][13]:'',
            yearMember   :sheet2[i][14]?sheet2[i][14]:''
          })
        } */
        let thiz = this;
        this.loading = true;
        let data = {
          reportName:file.name,
          reportSize:file.size,
          cMarket01:arr1,
          cMarket02 :arr2
          //cMarket03 :arr303暂时不需要
        }
        thiz.$tupHttp(thiz,'dashBoard/insertcMarket','POST',data).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '导入数据成功'
          });
          thiz.loadData()          
        },res=>{
          thiz.loading = false;
        })
      },
      treatDatasH(datas,file){
        let arr1 = [],
            arr2 = [],
            arr3 = [];
        let sheet0 = datas.sheet0;
        for(let i = 2;i< sheet0.length;i++){
          arr1.push({
            year : sheet0[i][0],
            month : sheet0[i][1],
            code : sheet0[i][2],
            area : sheet0[i][3],
            province :sheet0[i][4],
            marketingRsdpsdShould  : sheet0[i][5]?sheet0[i][5]:'',
            marketingRsdpsdReality : sheet0[i][6]?sheet0[i][6]:'',
            marketingPsdReality  : sheet0[i][7]?sheet0[i][7]:'',
            marketingRmsShould : sheet0[i][8]?sheet0[i][8]:'',
            marketingRmsReality  :sheet0[i][9]?sheet0[i][9]:'',
            developmentRfdpfdShould :sheet0[i][10]?sheet0[i][10]:'',
            developmentRfdReality :sheet0[i][11]?sheet0[i][11]:'',
            developmentPfdReality :sheet0[i][12]?sheet0[i][12]:'',
            expansionRcdpcdShould :sheet0[i][13]?sheet0[i][13]:'',
            expansionRcdReality :sheet0[i][14]?sheet0[i][14]:'',
            expansionPcdReality :sheet0[i][15]?sheet0[i][15]:'',
            pmDistributionRate :sheet0[i][16]?sheet0[i][16]:'',
            pmWorkingYears :sheet0[i][17]?sheet0[i][17]:'',
            pmQuitRate  :sheet0[i][18]?sheet0[i][18]:'',
            pmQuitQuantity   :sheet0[i][19]?sheet0[i][19]:'',
            pmWorkingYearsQuantity1  :sheet0[i][20]?sheet0[i][20]:'',
            pmWorkingYearsQuantity2  :sheet0[i][21]?sheet0[i][21]:'',
            pmWorkingYearsQuantity3  :sheet0[i][22]?sheet0[i][22]:'',
            dmTotalCount :sheet0[i][23]?sheet0[i][23]:'',
            dmDistributionRate  :sheet0[i][24]?sheet0[i][24]:'',
            dmQuitRate  :sheet0[i][25]?sheet0[i][25]:'',
            dmQuitQuantity  :sheet0[i][26]?sheet0[i][26]:'',
            dmWorkingYearsQuantity1 :sheet0[i][27]?sheet0[i][27]:'',
            dmWorkingYearsQuantity2  :sheet0[i][28]?sheet0[i][28]:'',
            dmWorkingYearsQuantity3   :sheet0[i][29]?sheet0[i][29]:'',
            dfsTotalCount  :sheet0[i][30]?sheet0[i][30]:'',
            dfsDistributionRate :sheet0[i][31]?sheet0[i][31]:'',
            dfsQuitRate :sheet0[i][32]?sheet0[i][32]:'',
            dfsQuitQuantity :sheet0[i][33]?sheet0[i][33]:'',
            dfsWorkingYearsQuantity1 :sheet0[i][34]?sheet0[i][34]:'',
            dfsWorkingYearsQuantity2  :sheet0[i][35]?sheet0[i][35]:'',
            dfsWorkingYearsQuantity3   :sheet0[i][36]?sheet0[i][36]:'',
            employeeReality :sheet0[i][37]?sheet0[i][37]:'',
            employeePlan  :sheet0[i][38]?sheet0[i][38]:'',
            employeeLastYear   :sheet0[i][39]?sheet0[i][39]:'',
            employeeComparePlan  :sheet0[i][40]?sheet0[i][40]:'',
            employeeCompareYear :sheet0[i][41]?sheet0[i][41]:''
          })
        }
        let thiz = this;
        this.loading = true;
        let data = {
          reportName:file.name,
          reportSize:file.size,
          cHrList:arr1
        }

        thiz.$tupHttp(thiz,'dashBoard/insertCHr','POST',data).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '导入数据成功'
          });
          thiz.loadData()          
        },res=>{
          thiz.loading = false;
        })
      },
      treatDatasC(datas,file){
        let arr1 = [],
            arr2 = [],
            arr3 = [];
        let sheet0 = datas.sheet0;
        for(let i = 2;i< sheet0.length;i++){
          arr1.push({
            year : sheet0[i][0],
            month : sheet0[i][1],
            code : sheet0[i][2],
            area : sheet0[i][3],
            province :sheet0[i][4],
            monthDelayDays   : sheet0[i][5]?sheet0[i][5]:'',
            monthLackProductRate : sheet0[i][6]?sheet0[i][6]:'',
            monthAfterSaleService : sheet0[i][7]?sheet0[i][7]:'',
            yearDelayDays   :sheet0[i][8]?sheet0[i][8]:'',
            yearLackProductRate  :sheet0[i][9]?sheet0[i][9]:'',
            yearAfterSaleService  :sheet0[i][10]?sheet0[i][10]:'',
            yearAfterSaleServiceSubsidy  :sheet0[i][11]?sheet0[i][11]:''
          })
        }
        let thiz = this;
        this.loading = true;
        let data = {
          reportName:file.name,
          reportSize:file.size,
          cCustomerServicesList:arr1
        }

        thiz.$tupHttp(thiz,'dashBoard/insertCCustomerServices','POST',data).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '导入数据成功'
          });
          thiz.loadData()          
        },res=>{
          thiz.loading = false;
        })
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      }, 
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      commitRename(){        
        let thiz = this;
        this.loading = true;
        let data = this.$util.deepClone(this.tableData[this.itemIndex]);
        data.reportName = this.fileForm.title;

        this.$tupHttp(this,'dashBoard/reNameOrDeleteDashBoard?reNameOrDeleteType=2','POST',data).then(res=>{
          thiz.loadData();
          thiz.loading = false;
          thiz.dialogVisible = false;
        },res=>{
          thiz.loading = false;
        })
      },
      saveRename(){
        this.$refs.fileForm.validate((valid) => {
          if (valid) {
            this.commitRename();
          } else {
            return false;
          }
        });
      },
      rename(index, row) {
        this.fileForm.title = row.reportName;
        this.itemIndex = index;
        this.dialogVisible = true;
      },
      handleDelete(index, row) {
        console.log(index, row);
      },
      handleEdit(index, row) {
        console.log(index, row);
      },
      copy(index, row){
        const input = document.createElement('input');
        document.body.appendChild(input);
        input.setAttribute('value', row.ossUrl);
        input.select();
        if (document.execCommand('copy')) {
            document.execCommand('copy');
            console.log('复制成功');
        }
        document.body.removeChild(input);
      },
      handleDelete(index, row) {        
        let thiz = this;
        this.$confirm('此操作将永久删除记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          this.$tupHttp(this,'dashBoard/reNameOrDeleteDashBoard?reNameOrDeleteType=1','POST',row).then(res=>{
            thiz.loadData();
            thiz.loading = false;
          },res=>{
            thiz.loading = false;
          })
        }).catch(() => {
          this.loading = false;         
        });
        
      },
      getFileUrl(){
        switch(this.type){
          case '1':
            this.fileUrl = 'https://tup-templates.oss-cn-hangzhou.aliyuncs.com/财务部仪表盘业务基础数据导入模板.xlsx'
          break;
          case '2':
            this.fileUrl = 'https://tup-templates.oss-cn-hangzhou.aliyuncs.com/市场部仪表盘业务基础数据导入模板.xlsx'
          break;
          case '3':
            this.fileUrl = 'https://tup-templates.oss-cn-hangzhou.aliyuncs.com/人事部仪表盘业务基础数据导入模板.xlsx'
          break;
          case '4':
            this.fileUrl = 'https://tup-templates.oss-cn-hangzhou.aliyuncs.com/客服部仪表盘业务基础数据导入模板.xlsx'
          break;
        }
      },
      loadData(){
        let thiz = this;
        thiz.tableLoading = true;
        this.$tupHttp(this,'dashBoard/getAllDashBoardList?roleType='+this.type+'&page=1&size=20','GET').then(res=>{
          thiz.tableData = res.body.models
          thiz.total = res.body.pageInfo ? res.body.pageInfo.total :0;
          thiz.tableLoading = false;
        },res=>{
          thiz.tableLoading = false;
        })
      }
    },
    mounted(){
      if(!this.type){
        //没有权限
        this.$notify.info({
          title: '信息提示',
          message: '没有权限进入'
        });
        this.$router.push({ path: '/frame/meter/detail' });
        return;
      }
      $('.el-upload__input').hide();
      this.getFileUrl()
      this.loadData()
    }
  }
</script>
