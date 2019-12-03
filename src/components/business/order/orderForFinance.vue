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
          <el-form-item label="专卖店编号">
            <el-input v-model="searchForm.clientId" size="mini" placeholder="专卖店编号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="分销商编号">
            <el-input v-model="searchForm.sDbStr" size="mini" placeholder="分销商编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="DFS人员">
            <el-input v-model="searchForm.fsName" size="mini" placeholder="DFS人员"></el-input>
          </el-form-item>
        </el-col>        
        <el-col :span="8">
          <el-form-item label="订单编号">
            <el-input v-model="searchForm.orderNo" size="mini" placeholder="订单编号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="订单类型">
            <el-select v-model="searchForm.orderTypeList" size="mini" multiple placeholder="请选择">
              <el-option
                v-for="item in Dictions.order_type"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col> 
        <el-col :span="8">
          <el-form-item label="专卖店类型">
            <el-select v-model="searchForm.clientTypeList" size="mini" multiple placeholder="请选择">
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
          <el-form-item label="订单状态">
            <el-select v-model="searchForm.orderStatusList" size="mini" multiple placeholder="请选择">
              <el-option
                v-for="item in Dictions.order_status"
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
          <el-form-item label="客户层级">
            <el-select v-model="searchForm.organLevel" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="0" :value="0"></el-option>
              <el-option label="1" :value="1"></el-option>
              <el-option label="2" :value="2"></el-option>
              <el-option label="3" :value="3"></el-option>
              <el-option label="4" :value="4"></el-option>
              <el-option label="5" :value="5"></el-option>
              <el-option label="6" :value="6"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">          
          <el-form-item label="专卖店名称">
            <el-input v-model="searchForm.clientName" size="mini" placeholder="专卖店名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button icon="el-icon-import" v-if="searchForm.orderStatusList.length === 1 && searchForm.orderStatusList[0]==='2'" @click="editItems" :disabled="multipleSelection.length == 0" :loading="loading" size="mini" type="success">批量审核</el-button>
        <el-button type="primary"  icon="el-icon-search" size="mini" @click="loadData(true)">查询</el-button>
        <el-button icon="el-icon-refresh" type="primary" size="mini" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="tableLoading"
      style="width: 100%;"
      height="450"
      highlight-current-row
      :default-sort = "{prop: 'date', order: 'descending'}"
       @selection-change="handleSelectionChange">
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
        prop="productPay"
        label="订单零售价"
        width="100">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.productPay,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="orderNo"
        label="订单号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="orderStatus"
        label="订单状态"
        :formatter="formatter"
        width="100">
      </el-table-column>
      <el-table-column
        prop="createtime"
        :formatter="formatter"
        label="创建日期"
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
        prop="afterCouponPrice"
        label="优惠后零售额"
        width="100">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.afterCouponPrice,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="discountRate"
        label="门店折扣率"
        width="100">
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
        prop="auditbyClientTime"
        :formatter="formatter"
        label="客服审核日期"
        width="100">
      </el-table-column>
      <el-table-column
        prop="auditbyFinanceTime"
        :formatter="formatter"
        label="财务审核日期"
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
        prop="returnReason"
        label="退回原因"
        :formatter="formatter"
        width="100">
      </el-table-column>
      <el-table-column
        prop="returntime"
        :formatter="formatter"
        label="退回时间"
        width="100">
      </el-table-column>
      <el-table-column
        prop="orderType"
        :formatter="formatter"
        label="订单类型"
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
        prop="fsName"
        label="DFS人员"
        width="100">
      </el-table-column>
      <el-table-column
        prop="payStatus"
        label="付款状态"
        :formatter="formatter"
        width="100">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button @click="compute(scope.$index,scope.row)" v-show="scope.row.orderStatus =='2'" :loading="loading" type="primary" size="small">重新计算</el-button>
          <el-button @click="view(scope.$index,scope.row)" type="text" size="small">订单详情</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button @click="editItem(scope.$index,scope.row)" type="text" size="small">审核</el-button>
        </template>
      </el-table-column> -->
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
    <el-dialog title="审核" width="30%" top="5%" :visible.sync="dialogVisible">
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
      </el-form>     
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" size="mini" @click="saveItem">确认</el-button>
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name:'keepAlive-order-orderForFinance',
    data() {
      return {
        Dictions:{
          outlet_property2:[],
          customer_property:[],
          order_status:[],
          order_type:[],
          pay_status:[],
          return_reason:[]
        },//所有的字典
        multipleSelection:[],
        loading:false,
        currentPage:1,
        total:0,
        tableLoading:false,
        approveForm:{
          pass:1,
          returnReason:'',
          orderRemark:''
        },
        dialogVisible:false,
        searchForm:{
          fsName:'',
          orderStatusList:['2'],
          sDbStr:'',
          orderNo:'',
          sProvince:[],
          provinceObject:[],
          sRegion:[],
          areaObject:[],
          payStatus:'2',
          findType:3,
          clientName:'',
          orderTypeList:[],
          clientTypeList:[],
          clientId:'',
          organLevel:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:50
          }
        },
        itemIndex:-1,//当前编辑的行索引        
        item:{},//当前编辑的行
        tableData: [
        ]
      }
    },
    watch:{
      $route:function(val){
        if(val.path == '/frame/order/orderForFinance'){
          this.$util.onKeyCode(this,'loadData',[true])
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
      resetForm(){
        this.searchForm = {
          fs:'',
          orderStatusList:['2'],
          payStatus:'2',
          sDbStr:'',
          orderNo:'',
          sProvince:[],
          provinceObject:[],
          sRegion:[],
          areaObject:[],
          orderTypeList:[],
          clientTypeList:[],
          clientName:'',
          findType:3,
          clientId:'',
          organLevel:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:this.searchForm.pagingQuery.pageSize
          }
        }
      },
      compute(ind,row){
        let thiz = this;
        thiz.loading = true;
        this.$confirm('此操作将重新计算该笔订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          thiz.$tupHttp(thiz,'order/repay?orderNo='+row.orderNo,'POST',null).then(res=>{
            thiz.loading = false;
            thiz.loadData();
          },res=>{
            thiz.loading = false;
          }) 
        }).catch(() => {    
          thiz.loading = false;  
        });
      },
      view(ind,row){
        this.gotoUrl('/frame/order/orderDetailView/'+row.orderNo)
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
      downLoad(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        delete data.pagingQuery;
        thiz.$tupHttp(thiz,'product/exportProductArea','POST',data).then(res=>{
          thiz.loading = false;
        },res=>{
          thiz.loading = false;
        })
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      },   
      editItems() {
        this.approveForm = {
          pass:1,
          returnReason:'',
          orderRemark:''
        }
        this.dialogVisible = true;  
      },  
      editItem(index, row) {
        this.approveForm = {
          pass:1,
          returnReason:'',
          orderRemark:''
        }
        this.itemIndex = index;
        this.item = row;
        this.dialogVisible = true;  
      },
      saveItem(){
        let thiz = this;
        thiz.loading = true;
        let data = {
          pass:this.approveForm.pass,
          returnReason:this.approveForm.returnReason,
          orderRemark:this.approveForm.orderRemark,
          orderList:[]
        };
        this.multipleSelection.map(item=>{
          data.orderList.push({
            orderNo:item.orderNo
          })
        })
        thiz.$tupHttp(thiz,'order/auditbyBatchByFinance','POST',data).then(res=>{          
          thiz.$notify({
            title: '提示',
            message: '操作成功'
          });
          thiz.loading = false;
          thiz.dialogVisible = false;
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
      loadData(isSearch){
        let thiz = this;
        thiz.tableLoading = true;
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
      loadDictions(){
        let thiz = this;
        let params = ["order_type","order_status","customer_property","pay_status","return_reason","outlet_property2"];
        this.$baseData.getDicts(this,params,function(data){
          thiz.Dictions = data;
        });
      }
    },
    mounted(){
      this.loadDictions();
      //this.loadData()
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
