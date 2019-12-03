<template>
  <div>
    <el-form  :model="searchForm" label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="地区">            
            <tup-arae-select v-model="searchForm.provinceObject"></tup-arae-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="专卖店编号">
            <el-input v-model="searchForm.clientId" size="mini" placeholder="专卖店编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">          
          <el-form-item label="DFS编号">
            <el-input v-model="searchForm.fs" size="mini" placeholder="DFS编号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="分销商编号">
            <el-input v-model="searchForm.parentClientId" size="mini"  placeholder="分销商编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="订单状态">
            <el-select v-model="searchForm.orderStatusTemp" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="财务已审核" :value="3"></el-option>
              <el-option label="已提交到ERP" :value="4"></el-option>
              <el-option label="已从ERP接收" :value="5"></el-option>
              <el-option label="已发货" :value="6"></el-option>
              <el-option label="已完成" :value="8"></el-option>
            </el-select>
          </el-form-item>
        </el-col>        
        <el-col :span="8">
          <el-form-item label="订单编号">
            <el-input v-model="searchForm.orderNo" size="mini" placeholder="专卖店名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="团购标识">
            <el-select v-model="searchForm.groupFlag" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="专卖店性质">
            <el-select v-model="searchForm.clientType" size="mini" clearable filterable  placeholder="请选择">
              <el-option
                v-for="item in Dictions.outlet_property2"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>        
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
      </el-row>
       <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="订单类型">
            <el-select v-model="searchForm.orderType1" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="首订订单" value="SW"></el-option>
              <el-option label="普通订单" value="S2"></el-option>
              <el-option label="特殊订单" value="TS"></el-option>
              <el-option label="售后订单" value="SR"></el-option>
              <el-option label="内部申请表" value="SJ"></el-option>
              <el-option label="产品申请表" value="SF"></el-option>
              <el-option label="员工自购订单" value="SS"></el-option>
              <el-option label="B2B订单" value="SB"></el-option>
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
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="loadData(true)">查询</el-button>
        <el-button  icon="el-icon-refresh" type="primary" size="mini" @click="resetForm">重置</el-button>
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
      :default-sort = "{prop: 'date', order: 'descending'}">
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
        prop="createtime"
        label="创建日期"
        :formatter="formatter"
        width="120">
      </el-table-column>
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
        prop="pOutletStatus"
        label="专卖店状态"
        width="100">
      </el-table-column>
      <el-table-column
        prop="clientType"
        label="专卖店性质"
        width="100">
      </el-table-column>
      <el-table-column
        prop="payStatus"
        label="付款状态"
        :formatter="formatter"
        width="100">
      </el-table-column>
      <el-table-column
        prop="orderStatus"
        label="订单状态"
        :formatter="formatter"
        width="100">
      </el-table-column>
      <el-table-column
        prop="productPay"
        label="订单零售价"
        width="100">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.productPay,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="discountProductPrice"
        label="打折产品金额"
        width="100">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.discountProductPrice,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="productPrice"
        label="不打折产品金额"
        width="100">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.productPrice,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="couponMoney"
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
        prop="afterCouponPrice"
        label="优惠后打折产品金额"
        width="100">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.afterCouponPrice,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="couponTotalAmount"
        label="优惠后订单零售价"
        width="100">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.couponTotalAmount,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="discountRate"
        label="门店折扣率"
        width="100">
        <template slot-scope="scope"> 
          {{scope.row.discountRate}}%
        </template>
      </el-table-column>
      <el-table-column
        prop="accountPayable"
        label="本单应付金额"
        width="100">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.accountPayable,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="discountDiffMoney"
        label="产生折扣差金额"
        width="100">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.discountDiffMoney,2)}}
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
        prop="mustPay"
        label="实际应付"
        width="100">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.mustPay,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="netSales"
        label="销售净额"
        width="100">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.netSales,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="realDiscountRate"
        label="实际折扣率"
        width="100">
      </el-table-column>
      <el-table-column
        prop="techDiscountproductRate"
        label="打折产品技术折扣率"
        width="100">
      </el-table-column>  
      <el-table-column
        prop="techDiscountnonproductRate"
        label="不打折产品技术折扣率"
        width="100">
      </el-table-column>  
      <el-table-column
        prop="excessThreshold"
        label="超过阈值"
        width="100">
        <template slot-scope="scope">
          {{scope.row.excessThreshold==1 ? '是':'否'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="orderType"
        :formatter="formatter"
        label="订单类型"
        width="100">
      </el-table-column>
      <el-table-column
        prop="payTime"
        label="付款日期"
        :formatter="formatter"
        width="100">
      </el-table-column>
      <el-table-column
        prop="auditbyClientTime"
        label="客服审核日期"
        :formatter="formatter"
        width="100">
      </el-table-column>
      <el-table-column
        prop="returnReason"
        :formatter="formatter"
        label="退回原因"
        width="100">
      </el-table-column>
      <el-table-column
        prop="returntime"
        label="退回时间"
        :formatter="formatter"
        width="100">
      </el-table-column>
      <el-table-column
        prop="auditbyFinanceTime"
        label="财务审核日期"
        :formatter="formatter"
        width="100">
      </el-table-column>     
      <el-table-column
        prop="payStatus"
        label="付款标记"
        width="100">
        <template slot-scope="scope">
          {{scope.row.payStatus==1 ? '是':'否'}}
        </template>
      </el-table-column>  
      <el-table-column
        prop="isSelfPayFreight"
        label="是否自付运费"
        width="100">
        <template slot-scope="scope">
          {{scope.row.isSelfPayFreight==1 ? '是':'否'}}
        </template>
      </el-table-column>  
      <el-table-column
        prop="orderRemark"
        label="备注"
        width="100">
      </el-table-column>  
      <el-table-column
        prop="shipTo"
        label="送货对象编号"
        width="100">
      </el-table-column>  
      <el-table-column
        prop="shipToName"
        label="送货对象名称"
        width="100">
      </el-table-column>  
      <el-table-column
        prop="fs"
        label="DFS编码"
        width="100">
      </el-table-column>  
      <el-table-column
        prop="fsName"
        label="DFS姓名"
        width="100">
      </el-table-column>  
      <el-table-column
        prop="groupFlag"
        label="是否团购"
        width="100">
        <template slot-scope="scope">
          {{scope.row.groupFlag==1 ? '是':'否'}}
        </template>
      </el-table-column>  
      <el-table-column
        fixed="right"
        label="操作"
        width="220">
        <template slot-scope="scope">
          <el-button @click="showDialog(scope.$index,scope.row)" :loading="loading" type="text" size="small">整单退单退货</el-button>
          <el-button @click="returnGoods(scope.$index,scope.row)" type="text" size="small">产品退单退货</el-button>
        </template>
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
    <el-dialog :title="txt" width="30%" top="5%" :visible.sync="dialogVisible">
      <el-form  :model="approveForm" ref="comForm" :rules="comRules" label-width="80px" >
        <el-form-item label="备注" prop="orderRemark">            
         <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="approveForm.orderRemark">
          </el-input>
        </el-form-item>
      </el-form>     
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" size="mini" @click="commit">确认</el-button>
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name:'keepAlive-order-returnOrderAndGoods',
    data() {
      return {
        summaries:{},
        Dictions:{
          outlet_property2:[],
          order_status:[],
          order_type:[],
          pay_status:[],
          return_reason:[]
        },//所有的字典
        loading:false,
        currentPage:1,
        total:0,
        tableLoading:false,
        txt:'订单尚未发货，是否确认退货?',
        dialogVisible:false,
        row:{},
        approveForm:{
          orderRemark:''
        },
        comRules:{
          orderRemark: [
            { required: true, message: '必填', trigger: 'change' }
          ]
        },
        searchForm:{
          fsName:'',
          payStatus:'',
          clientType:'',
          orderStatusTemp:'',
          orderType1:'',
          orderTypeList:["SW", "S2", "TS", "SR", "SJ", "SF", "SS", "SB"],
          orderStatusList:[3, 4, 5, 6, 8],
          parentClientId:'',
          orderNo:'',
          provinceCodeList:[],
          provinceObject:[],
          fs:'',
          clientId:'',
          groupFlag:'',
          date:'',
          endTime:'',
          startTime:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:50
          }
        },
        tableData: [
        ]
      }
    },
    watch:{
      $route:function(val){
        if(val.path == '/frame/order/returnOrderAndGoods'){
          this.$util.onKeyCode(this,'loadData',[true])
        }
      },
      'searchForm.orderType1':function(val){
        if(val){
          this.searchForm.orderTypeList = [val]
        }
        else{
          this.searchForm.orderTypeList = ["SW", "S2", "TS", "SR", "SJ", "SF", "SS", "SB"]
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
      'searchForm.orderStatusTemp':function(val){
        if(val){
          this.searchForm.orderStatusList = [val]
        }
        else{
          this.searchForm.orderStatusList = [3,4,5,6,8]
        }
      },
      "searchForm.provinceObject":function(val){
        let datas = [];
        val.map(item=>{
          if(item.code !='999')
            datas.push(item.code)
        })
        this.searchForm.provinceCodeList = datas;
      }
    },
    methods: {
      showDialog(ind,row){
        this.dialogVisible = true;
        this.row = row;
        this.approveForm = {
          orderRemark:''
        }
        if(this.model.orderStatus == 6){
          this.txt = '订单已发货，是否确认为客户退货?'
        }
      },
      commitData(){
        let thiz = this;
        this.loading = true;
        let data = this.row;
        data.orderRemark = this.approveForm.orderRemark
        thiz.$tupHttp(thiz,'order/fullOrPartReturn','POST',data).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '操作成功'
          });
          thiz.approveForm = {
            orderRemark:''
          }
          thiz.dialogVisible = false;
          thiz.loadData();
        },res=>{
          thiz.loading = false;
        })
      }, 
      commit(){
        this.$refs.comForm.validate((valid) => {
          if (valid) {
            this.commitData();
          } else {
            return false;
          }
        });
      },
      resetForm(){
        this.searchForm = {
          fs:'',
          payStatus:'',
          clientType:'',
          orderStatus:'',
          orderType1:'',
          orderTypeList:["SW", "S2", "TS", "SR", "SJ", "SF", "SS", "SB"],
          orderStatusList:[3, 4, 5, 6, 8],
          parentClientId:'',
          orderNo:'',
          provinceCodeList:[],
          provinceObject:[],
          fs:'',
          clientId:'',
          groupFlag:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:this.searchForm.pagingQuery.pageSize
          }
        }
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
        else if(column.property =='orderStatus'){
          this.Dictions.order_status.map(item=>{
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
        else if(column.property =='createtime' || column.property =='auditbyClientTime' 
        || column.property =='auditbyFinanceTime' || column.property =='returntime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd");
        }
        return txt;
      },
      returnGoods(ind,row){
        this.gotoUrl('/frame/order/orderDetail/'+row.orderNo)
      },
      returnOrder(ind,row){
        let thiz = this;
        thiz.loading = true;
        let txt = '订单尚未发货，是否确认退货?';
        if(row.orderStatus == 6){
          txt = '订单已发货，是否确认为客户退货?'
        }
        this.$confirm(txt, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          thiz.$tupHttp(thiz,'order/fullOrPartReturn','POST',row).then(res=>{
            thiz.loading = false;
            thiz.$notify.success({
              title: '成功提示',
              message: '操作成功'
            });
            thiz.loadData();
          },res=>{
            thiz.loading = false;
          }) 
        }).catch(() => {    
          thiz.loading = false;  
        });
        
      },
      downLoad(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        delete data.pagingQuery;
        thiz.$tupHttp(thiz,'order/exportClientOrderList','POST',data,{Accept: '*/*'},'',true).then(res=>{
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
          //console.log(column.property+':'+values)
          if (!!values) {            
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
        this.loadSum()
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        this.$tupHttp(this,'order/getClientOrderList','POST',thiz.searchForm).then(res=>{
          thiz.tableData = res.body.models
          thiz.tableLoading = false;
          thiz.total = res.body.pageInfo.total ? res.body.pageInfo.total : 0;          
        },res=>{
          thiz.tableLoading = false;
        })
      },
      loadSum(){
        let thiz = this;
        this.$tupHttp(this,'order/sumByClientOrderList','POST',thiz.searchForm).then(res=>{
          if(res.body.model){
            thiz.summaries = res.body.model
            thiz.$refs.orderTable.doLayout()
          }
        })
      },
      loadDictions(){
        let thiz = this;
        let params = ["order_type","order_status","outlet_property2","pay_status","return_reason"];
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
      this.getFMonth();
      this.loadDictions();
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
