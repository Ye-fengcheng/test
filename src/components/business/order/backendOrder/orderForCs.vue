<template>
  <div>
    <el-form  :model="searchForm" label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="地区">            
            <tup-arae-select v-model="searchForm.provinceObject" size="mini"></tup-arae-select>
          </el-form-item>
        </el-col>
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
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="分销商编号">
            <el-input v-model="searchForm.parentClientId" size="mini" placeholder="分销商编号"></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
          <el-form-item label="DFS人员">
            <el-input v-model="searchForm.fsName" size="mini" placeholder="DFS人员"></el-input>
          </el-form-item>
        </el-col> -->        
        <el-col :span="8">
          <el-form-item label="订单编号">
            <el-input v-model="searchForm.orderNo" size="mini" placeholder="订单编号"></el-input>
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
      </el-row>
      <el-row :gutter="5">
        
        <!-- <el-col :span="8">
          <el-form-item label="专卖店类型">
            <el-select v-model="searchForm.clientType" size="mini" clearable filterable  placeholder="请选择">
              <el-option
                v-for="item in Dictions.outlet_property2"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col> -->        
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
                
        <!-- <el-col :span="8">
          <el-form-item label="退回原因">
            <el-select v-model="searchForm.returnReason" size="mini" clearable filterable  placeholder="请选择">
              <el-option
                v-for="item in Dictions.return_reason"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
        
      </el-row>
      <el-row :gutter="5">
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
        <el-col :span="8">
          <el-form-item label="订单备注">
            <el-input v-model="searchForm.orderRemark" size="mini" placeholder="订单备注"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="制单人">
            <el-input v-model="searchForm.createBy" size="mini" placeholder="制单人工号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="送货对象编号">
            <el-input v-model="searchForm.shipTo" size="mini" placeholder="送货对象编号"></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
          <el-form-item label="状态">
            <el-select v-model="searchForm.orderStatus" size="mini" placeholder="请选择">
              <el-option label="待审批" :value="9"></el-option>
              <el-option label="待审阅" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
      </el-row>
      <el-form-item>
        <el-button icon="el-icon-check" v-if="searchForm.orderStatusList.length === 1 && searchForm.orderStatusList[0]==='1'" @click="editItems" :disabled="multipleSelection.length == 0" :loading="loading" size="mini" type="success">批量审核</el-button>
        <!-- <el-button icon="el-icon-import" @click="reviewItems" :disabled="multipleSelection.length == 0" :loading="loading" size="mini" type="danger">批量审阅</el-button> -->
        <el-button type="primary" icon="el-icon-search" size="mini" @click="loadData(true)">查询</el-button>
        <el-button icon="el-icon-refresh" type="primary" size="mini" @click="resetForm">重置</el-button>
        <el-button icon="el-icon-download" @click="downLoad" :loading="loading" size="mini" type="primary">导出</el-button>
        <el-button icon="el-icon-check"  @click="editItems(e,true)" :disabled="total == 0" :loading="loading" size="mini" type="success">全部审核</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      ref="orderTable"
      v-loading="tableLoading"
      :summary-method="getSummaries"
      show-summary
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
        prop="orderNo"
        label="订单号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="orderType"
        label="订单类型"
        :formatter="formatter"
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
        sortable
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
        sortable
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
        prop="beforeBenifitPrice"
        label="优惠前零售额"
        sortable
        width="150">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.beforeBenifitPrice,2)}}
        </template>
      </el-table-column>      
      <el-table-column
        prop="couponTotalAmount"
        label="优惠后零售额"
        width="100">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.couponTotalAmount,2)}}
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
        prop="groupFlag"
        label="团购标识"
        width="100">
        <template slot-scope="scope">
          {{scope.row.groupFlag==1 ? '是':'否'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="createtime"
        label="创建日期"
        :formatter="formatter"
        width="150">
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
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button @click="view(scope.$index,scope.row)" type="text" size="small">订单详情</el-button>
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
    <el-dialog :title="title" width="30%" top="10%" :visible.sync="dialogVisible">
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
        <!-- <el-form-item label="是否团购">            
          <el-switch
            :active-value="1"
            :inactive-value="0"
            v-model="approveForm.groupFlag">
          </el-switch>
        </el-form-item> -->
      </el-form>     
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" v-if="!isAll" size="mini" @click="saveItem">确认</el-button>
        <el-button type="primary" :loading="loading" v-if="isAll" size="mini" @click="saveAll">全部处理</el-button>
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name:'keepAlive-order-backendOrder-orderForCs',
    data() {
      return {
        isAll:true,
        title:'批量审核',
        summaries:{},
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        Dictions:{
          customer_property:[],
          order_status:[],
          outlet_property2:'',
          order_type:[],
          pay_status:[],
          return_reason:[],
          declaration_type_order:[],
          order_project_type:[],
        },//所有的字典
        multipleSelection:[],
        loading:false,
        currentPage:1,
        approveForm:{
          pass:1,
          returnReason:'6',
          orderRemark:''
        },
        dialogVisible:false,
        total:0,
        tableLoading:false,
        searchForm:{
          fs:'',
          isReview:'',
          orderStatusList:['1'],
          parentClientId:'',
          orderTypeList:['SB','SS','SF','SJ','SR','TS','TZ'],
          orderTypeListTmp:[],
          orderRemark:'',
          createBy:'',
          findType:2,
          orderNo:'',
          provinceCodeList:[],
          provinceObject:[],
          clientName:'',
          clientId:'',
          groupFlag:'',
          clientType:'',
          payStatus:'',
          returnReason:'',
          shipTo:'',
          date:'',
          endTime:'',
          startTime:'',
          excessThreshold:'',
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
        if(val.path == '/frame/order/backendOrder/orderForCs'){
          this.$util.onKeyCode(this,'loadData',[true])
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
      "searchForm.orderStatus":function(val){
        if(val == 1){
          this.searchForm.isReview = 0;
        }
        else{
          this.searchForm.isReview = '';
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
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      resetForm(){
        this.searchForm = {
          fs:'',
          isReview:'',
          orderStatusList:['1'],
          parentClientId:'',
          findType:2,
          orderTypeList:['SB','SS','SF','SJ','SR','TS','TZ'],
          orderTypeListTmp:[],
          orderRemark:'',
          createBy:'',
          orderNo:'',
          provinceCodeList:[],
          provinceObject:[],
          clientName:'',
          clientId:'',
          groupFlag:'',
          shipTo:'',
          clientType:'',
          payStatus:'',
          returnReason:'',
          date:'',
          endTime:'',
          startTime:'',
          excessThreshold:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:this.searchForm.pagingQuery.pageSize
          }
        }
      },
      save(ind,row){
        let thiz = this;
        this.loading = true;
        thiz.$tupHttp(thiz,'order/updateAutoReturnTime','POST',row).then(res=>{
          thiz.loadData()
          thiz.loading = false;
        },res=>{
          thiz.loading = false;
        }) 
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
        else if(column.property =='payStatus'){
          this.Dictions.pay_status.map(item=>{
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
        else if(column.property =='createtime' || column.property =='auditbyClientTime' 
        || column.property =='auditbyFinanceTime' || column.property =='returntime' || column.property =='autoReturnTime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss");
        }
        return txt;
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
      editItems(e,isAll) {
        this.isAll = isAll
        if(isAll){
          this.title = '全部审核'
        }else{
          this.title = '批量审核'
        }
        this.approveForm = {
          pass:1,
          returnReason:'6',
          orderRemark:''
        }
        this.dialogVisible = true;  
      },   
      editItem(index, row) {
        this.approveForm = {
          pass:1,
          returnReason:'6',
          orderRemark:''
        }
        this.itemIndex = index;
        this.item = row;
        this.dialogVisible = true;  
      },
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData();
      },
      handleSizeChange(val) {
        this.searchForm.pagingQuery.pageSize = val;
        this.loadData();
      },
      reviewItems(){
        let thiz = this;
        thiz.loading = true;
        let data = {
          orderNoList:[]
        };
        this.multipleSelection.map(item=>{
          data.orderNoList.push(item.orderNo)
        })
        this.$confirm('是否批量确认审阅勾选的订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          thiz.$tupHttp(thiz,'order/reviewBatch','POST',data).then(res=>{
            thiz.loading = false;
            thiz.$notify.success({
              title: '提示',
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
      saveAll(){
        let thiz = this;
        thiz.loading = true;
        let data = {
          pass:this.approveForm.pass,
          returnReason:this.approveForm.returnReason,
          orderRemark:this.approveForm.orderRemark,
          isCondition:1,
          fmsClientOrderVO:this.searchForm
        };
        thiz.$tupHttp(thiz,'order/auditbyBatchByBackend','POST',data).then(res=>{
          thiz.$notify({
            title: '提示',
            message: '操作成功，数据量过大需等待系统处理，请在5分钟后刷新页面查看处理结果。'
          });
          thiz.loading = false;
          thiz.dialogVisible = false;
          thiz.loadData();          
        },res=>{
          thiz.loading = false;
        })
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
        thiz.$tupHttp(thiz,'order/auditbyBatchByBackend','POST',data).then(res=>{
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
        if(thiz.searchForm.pagingQuery.pageIndex == 1){
          this.loadSum()
        }        
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
        let params = ["order_type","order_status","outlet_property2","customer_property","pay_status","return_reason","declaration_type_order","order_project_type"];
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
            setTimeout(function(){
              thiz.loadData();
            })            
          }
        })
      }
    },
    mounted(){
      this.loadDictions()
      this.getFMonth()
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
