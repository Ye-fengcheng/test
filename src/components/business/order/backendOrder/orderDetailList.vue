<template>
  <div>
    <el-form  :model="searchForm" label-width="120px" class="demo-form-inline">
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
           <el-form-item label="订单编号">
            <el-input v-model="searchForm.orderNo" size="mini" placeholder="订单编号"></el-input>
          </el-form-item>          
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="16">
          <el-form-item label="产品编号">
            <el-select
              style="width:100%"
              v-model="searchForm.pCodeList"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="请输入产品编号"
              :remote-method="remoteMethod"
              :loading="loading">
              <el-option
                v-for="item in productList"
                :key="item.pCode"
                :label="item.pCode+'('+item.pName+')'"
                :value="item.pCode">
              </el-option>
            </el-select>
            <!-- <el-input v-model="searchForm.pCodeObject" size="mini" placeholder="产品编号，多个适用,隔开"></el-input> -->
          </el-form-item>
        </el-col>    
        <el-col :span="8">
          <el-form-item label="产品名称">
            <el-input v-model="searchForm.pName" size="mini" placeholder="产品名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="分销商编号">
            <el-input v-model="searchForm.sDbStr" size="mini"  placeholder="分销商编号"></el-input>
          </el-form-item>
        </el-col>       
        <el-col :span="8">
          <el-form-item label="团购标识">
            <el-select v-model="searchForm.groupFlag" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>         
        </el-col>
        <el-col :span="8">    
          <el-form-item label="创建日期">
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
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="专卖店编号">
            <el-input v-model="searchForm.clientId" size="mini" placeholder="专卖店编号"></el-input>
          </el-form-item>
        </el-col>  
        <el-col :span="8">
          <el-form-item label="专卖店名称">
            <el-input v-model="searchForm.clientName" size="mini" placeholder="专卖店名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否打折">
            <el-select v-model="searchForm.isDiscount" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>    
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="订单类型">
            <el-select v-model="searchForm.orderTypeListTmp" size="mini" multiple="" placeholder="请选择">
              <el-option label="B2B订单" value="SB"></el-option>
              <el-option label="产品申请表" value="SF"></el-option>
              <el-option label="内部申请表" value="SJ"></el-option>
              <el-option label="售后订单" value="SR"></el-option>
              <el-option label="员工自购订单" value="SS"></el-option>
              <el-option label="特殊订单" value="TS"></el-option>
              <el-option label="调整订单" value="TZ"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="订单备注">
            <el-input v-model="searchForm.orderRemark" size="mini" placeholder="订单备注"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="明细备注">
            <el-input v-model="searchForm.remark" size="mini" placeholder="明细备注"></el-input>
          </el-form-item>
        </el-col>
      </el-row>  
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="付款状态">
            <el-select v-model="searchForm.payStatus" size="mini" clearable filterable  placeholder="请选择">
              <el-option
                v-for="item in Dictions.pay_status"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="制单人">
            <el-input v-model="searchForm.createBy" size="mini" placeholder="制单人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="送货对象编号">
            <el-input v-model="searchForm.shipTo" size="mini" placeholder="送货对象编号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button icon="el-icon-check" @click="editItems" :disabled="multipleSelection.length == 0" :loading="loading" size="mini" type="success">批量审核</el-button>
        <el-button type="primary" icon="el-icon-search" :loading="loading" size="mini" @click="loadData(true)">查询</el-button>
        <el-button  icon="el-icon-refresh" type="primary" size="mini" @click="resetForm">重置</el-button>
        <el-button icon="el-icon-download" @click="downLoad" :loading="loading" size="mini" type="primary">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      ref="orderTable"
      v-loading="tableLoading"
      style="width: 100%;"
      :summary-method="getSummaries"
      show-summary
      height="450"
      highlight-current-row
       @selection-change="handleSelectionChange"
      :default-sort = "{prop: 'date', order: 'descending'}">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column> 
      <el-table-column
        type="index"
        label="序号"
        width="50">
      </el-table-column>    
      <el-table-column
        prop="orderNo"
        label="订单号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="orderType"
        :formatter="formatter"
        label="订单类型"
        width="100">
      </el-table-column>  
      <el-table-column
        prop="declarationTypeInt"
        label="申报类型"
        :formatter="formatter"
        width="100">
      </el-table-column>
      <el-table-column
        prop="applyType"
        label="申请类型"
        width="100">
      </el-table-column>
      <el-table-column
        prop="projectName"
        label="项目名称"
        width="100">
      </el-table-column>    
      <!-- <el-table-column
        prop="pCitglcategory"
        label="产品性质"
        width="100">
      </el-table-column> -->      
      <el-table-column
        prop="areaName"
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
        prop="parentClientId"
        label="分销商编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="parentClientName"
        label="分销商名称"
        width="120">
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
        prop="shipTo"
        label="送货对象"
        width="120">
      </el-table-column>
      <el-table-column
        prop="orderStatus"
        label="订单状态"
        :formatter="formatter"
        width="100">
      </el-table-column>
      <el-table-column
        prop="payStatus"
        label="付款状态"
        :formatter="formatter"
        width="100">
      </el-table-column>
      <el-table-column
        prop="pCode"
        label="产品编号"
        width="100">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.pCode.substring(0,5)=='98071'"
            type="text"
            @click="view(scope.row)">{{scope.row.pCode}}</el-button>          
          <span v-else>{{scope.row.pCode}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="pName"
        label="产品名称"
        width="100">
      </el-table-column>
      <el-table-column
        prop="orderUnitPrice"
        label="单价（元）"
        width="100">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.orderUnitPrice,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="citQuantity"
        label="发货数量"
        width="100">
      </el-table-column>
      <el-table-column
        prop="beforeBenifitPrice"
        label="优惠前零售额"
        width="150">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.beforeBenifitPrice,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="isDiscount"
        label="打折属性"
        width="100">
        <template slot-scope="scope">
          {{scope.row.isDiscount==1 ? '是':'否'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="groupFlag"
        label="团购标识"
        width="100">
        <template slot-scope="scope">
          {{scope.row.groupFlag==1 ? '是':'否'}}
        </template>
      </el-table-column> 
      <el-table-column
        prop="inserttime"
        label="创建日期"
        :formatter="formatter"
        width="100">
      </el-table-column>
      <el-table-column
        prop="createBy"
        label="制单人"
        width="100">
      </el-table-column>
      <el-table-column
        prop="orderRemark"
        label="订单备注"
        width="100">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="明细备注"
        width="100">
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top:15px;">
      <el-pagination
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
    <el-dialog :title="title" width="80%" top="2%" :visible.sync="dialogVisible">
      <el-table
        :data="subTableData"
        style="width: 100%;"
        height="350"
        highlight-current-row
        :default-sort = "{prop: 'date', order: 'descending'}">
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
          prop="pName"
          label="产品名称"
          width="100">
        </el-table-column>
        <el-table-column
          prop="pCitglcategory"
          label="产品性质"
          width="100">
        </el-table-column>    
        <el-table-column
          prop="orderQty"
          label="订货数量"
          width="100">
        </el-table-column>
        <el-table-column
          prop="orderUnit"
          label="订货单位"
          width="100">
        </el-table-column>
        <el-table-column
          prop="orderRatio"
          label="订货比率"
          width="100">
        </el-table-column>
        <el-table-column
          prop="deliverQty"
          label="发货数量（套/件）"
          width="100">
        </el-table-column>
        <el-table-column
          prop="citUnitPrice"
          label="单价（元/套）"
          width="100">
        </el-table-column>
        <el-table-column
          prop="isDiscount"
          label="打折属性"
          width="100">
          <template slot-scope="scope">
            {{scope.row.isDiscount==1 ? '是':'否'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="beforeBenifitPrice"
          label="优惠前零售额"
          width="150">
          <template slot-scope="scope"> 
            {{$util.formatThousand(scope.row.beforeBenifitPrice,2)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="allCouponMoney"
          label="优惠券金额"
          width="100">
          <template slot-scope="scope"> 
            {{$util.formatThousand(scope.row.couponMoney + scope.row.dDiscountDiffMoney,2)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="couponMoney"
          label="折扣差C金额"
          width="100">
          <template slot-scope="scope"> 
            {{$util.formatThousand(scope.row.couponMoney,2)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="dDiscountDiffMoney"
          label="活动类优惠券金额"
          width="100">
          <template slot-scope="scope"> 
            {{$util.formatThousand(scope.row.dDiscountDiffMoney,2)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="afterCouponDiscountPrice"
          label="优惠后打折零售额"
          width="150">
          <template slot-scope="scope"> 
            {{$util.formatThousand(scope.row.afterCouponDiscountPrice,2)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="afterCouponPrice"
          label="优惠后零售额"
          width="150">
          <template slot-scope="scope"> 
            {{$util.formatThousand(scope.row.afterCouponPrice,2)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="accountPayable"
          label="应付金额"
          width="150">
          <template slot-scope="scope"> 
            {{$util.formatThousand(scope.row.accountPayable,2)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="aDiscountDiffMoney"
          label="支付折扣差A金额"
          width="100">
          <template slot-scope="scope"> 
            {{$util.formatThousand(scope.row.aDiscountDiffMoney,2)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="bDiscountDiffMoney"
          label="支付折扣差B金额"
          width="100">
          <template slot-scope="scope"> 
            {{$util.formatThousand(scope.row.bDiscountDiffMoney,2)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="actuallyPayment"
          label="实际应付金额"
          width="150">
          <template slot-scope="scope"> 
            {{$util.formatThousand(scope.row.actuallyPayment,2)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="citExtendedPrice"
          label="销售净额"
          width="150">
          <template slot-scope="scope"> 
            {{$util.formatThousand(scope.row.citExtendedPrice,2)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="realDiscountRate"
          label="实际折扣率"
          width="100">
          <template slot-scope="scope"> 
            {{(scope.row.realDiscountRate*1).toFixed(2)}}%
          </template>
        </el-table-column>
        <el-table-column
          prop="techDiscountRate"
          label="技术折扣率"
          width="100">
          <template slot-scope="scope"> 
            {{(scope.row.techDiscountRate*1).toFixed(2)}}%
          </template>
        </el-table-column>  
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="dialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="审核" width="30%" top="10%" :visible.sync="approveDialogVisible">
      <el-form  :model="approveForm" label-width="80px" >
        <el-form-item label="通过">            
          <el-switch
            :active-value="1"
            :inactive-value="0"
            v-model="approveForm.pass">
          </el-switch>
        </el-form-item>
        <el-form-item v-show="approveForm.pass==0" label="退回原因">            
          <el-select v-model="approveForm.returnReason" clearable filterable  placeholder="请选择">
            <el-option
              v-for="item in Dictions.return_reason"
              :key="item.dictValue"
              :label="item.dictName"
              :value="item.dictValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">            
         <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="approveForm.orderRemark">
          </el-input>
        </el-form-item>
        <el-form-item label="是否团购">            
          <el-switch
            :active-value="1"
            :inactive-value="0"
            v-model="approveForm.groupFlag">
          </el-switch>
        </el-form-item>
      </el-form>     
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" size="mini" @click="saveItem">确认</el-button>
        <el-button size="mini" @click="approveDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        productList:[],
        fMonth:[],
        summaries:{},
        Dictions:{
          outlet_property2:[],
          order_status:[],
          order_type:[],
          pay_status:[],
          return_reason:[],
          declaration_type_order:[],
          order_project_type:[],
          order_apply_type:[],
          promotion_prd_type:[]
        },//所有的字典
        loading:false,
        currentPage:1,
        approveForm:{
          pass:1,
          groupFlag:0,
          returnReason:'6',
          orderRemark:''
        },
        approveDialogVisible:false,
        total:0,
        tableLoading:false,
        searchForm:{
          fsName:'',
          payStatus:'',
          clientType:'',
          orderStatus:'',
          orderStatusList:['1'],
          parentClientId:'',
          findType:2,
          orderTypeList:['SB','SS','SF','SJ','SR','TS','TZ'],
          orderTypeListTmp:[],
          returnReason:'',
          orderType:'',
          declarationTypeInt:'',
          shipTo:'',
          orderRemark:'',
          isDiscount:'',
          pCodeList:[],
          promotionName:'',
          sDbStr:'',
          orderNo:'',
          orderUnitPriceMin:'',
          orderUnitPriceMax:'',
          promotionPrdType:'',
          pCitglcategory:'',
          sProvince:[],
          provinceObject:[],
          sRegion:[],
          areaObject:[],
          promotionPrdTypeList:[],
          dfs:'',
          clientId:'',
          clientName:'',
          groupFlag:'',
          date:'',
          auditbyFinanceTimeArray:'',
          auditbyFinanceStartTime:'',
          auditbyFinanceEndTime:'',
          endTime:'',
          startTime:'',
          promotionRemark:'',
          remark:'',
          createBy:'',
          isKit:'',
          pName:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:50
          }
        },
        tableData: [
        ],
        multipleSelection:[],
        dialogVisible:false,
        title:'',
        subTableData:[]
      }
    },
    watch:{
      'searchForm.auditbyFinanceTimeArray':function(val){
        if(!val){
          this.searchForm.auditbyFinanceStartTime = '';
          this.searchForm.auditbyFinanceEndTime = '';
        }
        else{
          this.searchForm.auditbyFinanceStartTime = val[0];
          this.searchForm.auditbyFinanceEndTime = val[1];
        }
      },
      "searchForm.orderTypeListTmp":function(val){
        if(val.length == 0){
          this.searchForm.orderTypeList = ['SB','SS','SF','SJ','SR','TS','TZ']
        }
        else{
          this.searchForm.orderTypeList = val
        }
      },
      'searchForm.date':function(val){
        if(!val){
          this.searchForm.startTime = '';
          this.searchForm.endTime = '';
        }
        else{
          this.searchForm.startTime = val[0];
          this.searchForm.endTime = val[1];
        }
      },
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
      }
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      editItems() {
        this.approveForm = {
          pass:1,
          returnReason:'6',
          orderRemark:''
        }
        this.approveDialogVisible = true;  
      },
      remoteMethod(query){        
        if(query.length < 4){
          this.productList = []
          return;
        }
        let thiz = this;
        let searchParam = {
          condition:{
            pCode: query,
            pName: "",
            catalogCode:""
          },
          pagingQuery:{
            pageIndex:1,
            pageSize:10
          }
        }
        thiz.$baseData.productList(thiz,searchParam).then(res=>{
          thiz.productList  = res.body.models;
        })
      },
      resetForm(){
        this.searchForm = {
          fsName:'',
          declarationTypeInt:'',
          payStatus:'',
          clientType:'',
          orderStatus:'',
          orderRemark:'',
          orderStatusList:['1'],
          parentClientId:'',
          findType:2,
          orderTypeList:['SB','SS','SF','SJ','SR','TS','TZ'],
          orderTypeListTmp:[],
          returnReason:'',
          orderType:'',
          isDiscount:'',
          pCodeList:[],
          promotionName:'',
          shipTo:'',
          sDbStr:'',
          orderNo:'',
          orderUnitPriceMin:'',
          orderUnitPriceMax:'',
          promotionPrdType:'',
          pCitglcategory:'',
          sProvince:[],
          provinceObject:[],
          sRegion:[],
          areaObject:[],
          promotionPrdTypeList:[],
          dfs:'',
          clientId:'',
          clientName:'',
          groupFlag:'',
          date:this.fMonth,
          endTime:'',
          startTime:'',
          promotionRemark:'',
          remark:'',
          createBy:'',
          isKit:'',
          pName:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:this.searchForm.pagingQuery.pageSize
          }
        }
        /* let today = new Date();
        let t = today.getTime()-92*1000*60*60*24;
        let day92 = new Date(t);
        this.searchForm.date = [new Date(today.getFullYear()+'-'+(today.getMonth()+1)+'-01').format("yyyy-MM-dd"),new Date(today.getFullYear(),today.getMonth()+1,0).format("yyyy-MM-dd")]
        */        
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='returnReason'){
          this.Dictions.return_reason.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        else if(column.property =='orderType'){
          this.Dictions.order_type.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })  
        }
        else if(column.property =='payStatus'){
          this.Dictions.pay_status.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })  
        }
        else if(column.property =='declarationTypeInt'){
          this.Dictions.declaration_type_order.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })  
        }
        else if(column.property =='applyType'){
          this.Dictions.order_project_type.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })  
        }
        else if(column.property =='orderStatus'){
          this.Dictions.order_status.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })  
        }
        else if(column.property =='projectName'){
          this.Dictions.order_apply_type.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })  
        }
        else if(column.property =='createtime' || column.property =='auditbyClientTime' 
        || column.property =='auditbyFinanceTime' || column.property =='returntime' || column.property =='inserttime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss");
        }
        return txt;
      },
      view(row){
        this.dialogVisible = true; 
        this.title = 'kit产品:'+row.pCode+'('+row.pName+')'
        
        this.getSubProduct(row);  
      },
      getSubProduct(row){
        let thiz = this;
        thiz.$tupHttp(thiz,'order/getSubProduceList/'+row.id,'GET').then(res=>{
          if(res.body.models)
            thiz.subTableData = res.body.models;
        })        
      },
      downLoad(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        delete data.pagingQuery;
        thiz.$tupHttp(thiz,'order/exportClientOrderDetailList','POST',data,{Accept: '*/*'},'',true).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '文件已加入下载队列，稍后前往 "基础设置-内容管理-导出下载" 下载文件'
          });
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
      saveItem(){
        let thiz = this;
        thiz.loading = true;
        let data = {
          pass:this.approveForm.pass,          
          returnReason:this.approveForm.returnReason,
          orderRemark:this.approveForm.orderRemark,
          groupFlag:this.approveForm.groupFlag,
          orderList:[]
        };
        this.multipleSelection.map(item=>{
          let isHad = data.orderList.some(m=>{
            return m.orderNo == item.orderNo
          })
          if(!isHad){
            data.orderList.push({
              orderNo:item.orderNo,
              returnReason:this.approveForm.returnReason,
              orderRemark:this.approveForm.orderRemark,
              groupFlag:this.approveForm.groupFlag,
            })
          }          
        })
        thiz.$tupHttp(thiz,'order/auditbyBatchByBackend','POST',data).then(res=>{
          thiz.$notify.success({
            title: '提示',
            message: '操作成功'
          });
          thiz.loading = false;
          thiz.approveDialogVisible = false;
          thiz.loadData();          
        },res=>{
          thiz.loading = false;
        })
      },
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData();
      },
      handleSizeChange(val) {
        this.searchForm.pagingQuery.pageSize = val;
        this.loadData();
      },
      getSummaries(param) {
        let thiz = this;
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '统计';
            return;
          }
          const values = thiz.summaries[column.property];
          if (!!values || values == 0) {      
            if(column.property == 'orderQty' || column.property == 'citQuantity')     
              sums[index] = thiz.$util.formatThousand(values,0);
            else 
              sums[index] = thiz.$util.formatThousand(values,2);
          } else {
            sums[index] = '';
          }
        });
        return sums;
      },
      loadData(isSearch){
        let thiz = this;
        thiz.tableLoading = true;
        thiz.loading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        this.$tupHttp(this,'order/getClientOrderDetailList','POST',thiz.searchForm).then(res=>{
          thiz.tableData = res.body.models
          thiz.tableLoading = false;
          thiz.total = res.body.pageInfo.total ? res.body.pageInfo.total : 0;
          thiz.loading = false;
        },res=>{
          thiz.tableLoading = false;
          thiz.loading = false;
        })
        if(thiz.searchForm.pagingQuery.pageIndex == 1){
          this.loadSum()
        } 
      },
      loadSum(){
        let thiz = this;
        this.$tupHttp(this,'order/sumByClientOrderDetailList','POST',thiz.searchForm).then(res=>{
          if(res.body.model){
            thiz.summaries = res.body.model
            thiz.$refs.orderTable.doLayout()
          }
        })
      },
      loadDictions(){
        let thiz = this;
        let params = ["order_type","order_status","outlet_property2","pay_status","return_reason",'declaration_type_order','order_project_type','order_apply_type','promotion_prd_type'];
        this.$baseData.getDicts(this,params,function(data){
          thiz.Dictions = data;
        });
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
      this.loadDictions();
      this.getFMonth();
      this.$util.onKeyCode(this,'loadData',[true])
      /* let today = new Date();
      let t = today.getTime()-92*1000*60*60*24;
      let day92 = new Date(t);
      this.searchForm.date = [new Date(today.getFullYear()+'-'+(today.getMonth()+1)+'-01').format("yyyy-MM-dd"),new Date(today.getFullYear(),today.getMonth()+1,0).format("yyyy-MM-dd")]
      */    
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
