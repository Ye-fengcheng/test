<template>
  <div>
    <el-form  :model="searchForm" label-width="140px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="地区">            
            <tup-arae-select v-model="searchForm.provinceObject"></tup-arae-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="分销商编号">
            <el-input v-model="searchForm.sDbStr" size="mini"  placeholder="分销商编号"></el-input>
          </el-form-item>          
        </el-col>
        <el-col :span="8">          
          <el-form-item label="申报产品编号">
            <el-input v-model="searchForm.productNo" size="mini" placeholder="申报产品编号"></el-input>
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
          <el-form-item label="售后订单编号">
            <el-input v-model="searchForm.newOrderNo" size="mini"  placeholder="售后订单编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申报类型">
            <el-select v-model="searchForm.typeList" multiple size="mini" clearable filterable  placeholder="请选择">
              <el-option
                v-for="item in Dictions.declaration_type"
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
          <el-form-item label="申报号">
            <el-input v-model="searchForm.sbno" size="mini" placeholder="申报号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申报提交时间">
            <el-date-picker
              v-model="searchForm.date"
              style="width:100%"
              size="mini"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="审核状态">
            <el-select v-model="searchForm.statusList" multiple size="mini" clearable filterable  placeholder="请选择">
              <el-option
                v-for="item in Dictions.declaration_status"
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
          <el-form-item label="是否暂停">
            <el-select v-model="searchForm.isSuspend" clearable filterable size="mini" placeholder="请选择">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">          
          <el-form-item label="更换产品编号">
            <el-input v-model="searchForm.equalExchangeProduct" size="mini" placeholder="更换产品编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">          
          <el-form-item label="申报产品名称(客户)">
            <el-input v-model="searchForm.productName" size="mini" placeholder="申报产品名称(客户)"></el-input>
          </el-form-item>
        </el-col>        
      </el-row>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="loadData(true)">查询</el-button>
        <el-button  icon="el-icon-refresh" type="primary" size="mini" @click="resetForm">重置</el-button>
        <el-button icon="el-icon-download" @click="downLoad" :loading="loading" size="mini" type="primary">{{multipleSelection.length == 0 ? '导出':'导出勾选订单'}}</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="tableLoading"
      ref="table1"
      style="width: 100%;"
      height="450"
      @sort-change="sortChange"
      highlight-current-row
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
        prop="sbno"
        label="申报号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="submitTime"
        :formatter="formatter"
        label="客户提交/修改申报时间"
        width="100">
      </el-table-column>
      <el-table-column
        prop="type"
        label="申报类型"
        :formatter="formatter"
        width="100">
      </el-table-column>
      <el-table-column
        prop="status"
        label="审批状态"
        :formatter="formatter"
        width="120">
      </el-table-column>
      <el-table-column
        prop="newOrderNo"
        label="售后订单编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="regionCode"
        label="区域"
        width="80">
      </el-table-column>
      <el-table-column
        prop="province"
        label="省办"
        sortable
        width="80">
        <template slot-scope="scope">
          {{scope.row.provinceCode}}
        </template>
      </el-table-column>
      <el-table-column
        prop="pCitparentno"
        label="分销商编号"
        sortable
        width="120">
      </el-table-column>
      <el-table-column
        prop="pCitparent"
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
        prop="pOrganName2"
        label="专卖店名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="clientName"
        label="客户名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="orderNo"
        label="原订单编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="productNo"
        label="产品编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="productName"
        label="产品名称"
        width="120">
      </el-table-column>     
      <el-table-column
        prop="declarationProductNo"
        label="申报产品编号"
        sortable
        width="160">
      </el-table-column>
      <el-table-column
        prop="declarationProductName"
        label="申报产品名称"
        width="150">
      </el-table-column>
      <el-table-column
        prop="declarationQuantity"
        label="申报数量"
        width="120">
      </el-table-column>
      <el-table-column
        prop="declarationUnit"
        label="申报单位"
        width="150">
      </el-table-column>
      <el-table-column
        prop="description"
        label="情况说明"
        width="150">
        <template slot-scope="scope">
          <div class="overflow" :title="scope.row.description">{{scope.row.description}}</div>
        </template>        
      </el-table-column>      
      <el-table-column
        prop="expressDeclarationProductNo"
        label="物流受理产品编号"
        sortable
        width="160">
      </el-table-column>
      <el-table-column
        prop="expressDeclarationProductName"
        label="物流受理产品名称"
        width="150">
      </el-table-column>
      <el-table-column
        prop="expressDeclarationQuantity"
        label="物流受理数量"
        width="120">
      </el-table-column>
      <el-table-column
        prop="serviceDeclarationProductNo"
        label="客服受理产品编号"
        width="150">
      </el-table-column>
      <el-table-column
        prop="serviceDeclarationProductName"
        label="客服受理产品名称"
        width="150">
      </el-table-column>
      <el-table-column
        prop="serviceDeclarationQuantity"
        label="客服受理数量"
        width="120">
      </el-table-column>
      <el-table-column
        prop="changeProductNo"
        label="更换产品编号"
        width="150">
      </el-table-column>
      <el-table-column
        prop="changeProductName"
        label="更换产品名称"
        width="150">
      </el-table-column>  
      <el-table-column
        prop="changeProductQuantity"
        label="更换产品数量"
        width="150">
      </el-table-column>    
      <el-table-column
        prop="isEqualExchange"
        label="是否等价交换"
        width="120">        
        <template slot-scope="scope">
          {{scope.row.isEqualExchange == 1 ? '是':'否'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="isSuspend"
        label="是否暂停"
        width="120">        
        <template slot-scope="scope">
          {{scope.row.isSuspend == 1 ? '是':'否'}}
        </template>
      </el-table-column> 
      <el-table-column
        prop="jdeNo"
        label="JDE订单号"
        width="100">
      </el-table-column> 
      <el-table-column
        prop="pickSlipNo"
        label="拣货单号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="containerNo"
        label="所在装箱号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="receivedDate"
        label="到货日期"
        :formatter="formatter"
        width="100">
      </el-table-column>
      <el-table-column
        prop="realityNumber"
        label="实收数量"
        width="100">
      </el-table-column>
      <el-table-column
        prop="weight"
        label="重量"
        width="80">
      </el-table-column>
      <el-table-column
        prop="logisticsAuditTime"
        label="物流审核时间"
        :formatter="formatter"
        width="150">
      </el-table-column>
      <el-table-column
        prop="serviceAuditTime"
        label="制单客服确认时间"
        :formatter="formatter"
        width="150">
      </el-table-column>
      <el-table-column
        prop="seniorServiceAuditTime"
        label="高级客服审核时间"
        :formatter="formatter"
        width="150">
      </el-table-column>
      <el-table-column
        prop="backExpressNo"
        label="退回快递单号"
        width="150">
      </el-table-column>
      <el-table-column
        prop="backExpressCompany"
        label="快递公司"
        width="150">
      </el-table-column>
      <el-table-column
        prop="backDeliveryTime"
        label="发货日期"
        :formatter="formatter"
        width="150">
      </el-table-column>
      <el-table-column
        prop="backReachTime"
        label="预计到货日期"
        :formatter="formatter"
        width="150">
      </el-table-column> 
      <el-table-column
        prop="backExpressCommitTime"
        label="物流确认到货日期"
        :formatter="formatter"
        width="150">
      </el-table-column> 
      <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-button @click="detail(scope.$index,scope.row)" type="text" size="small">查看详情</el-button>
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
  </div>
</template>

<script>
  export default {
    name:'keepAlive-order-customerServiceApply',
    data() {
      return {
        Dictions:{
          declaration_status:[],
          declaration_type:[]
        },//所有的字典
        multipleSelection:[],
        loading:false,
        currentPage:1,
        total:0,
        tableLoading:false,
        searchForm:{       
          provinceObject:[],
          sProvince:[],
          productNo:'',
          productName:'',
          isSuspend:'',
          sDbStr:'',
          date:'',
          startTime:'',
          endTime:'',
          equalExchangeProduct:'',
          clientId:'',
          newOrderNo:'',
          sbno:'',
          type:'',
          status:'',
          typeList:[],
          statusList:[],
          declarationIds:[],//勾选的数据
          isNeedPrivilegeController:0,
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
        if(val.path == '/frame/order/customerServiceApply'){
          this.$util.onKeyCode(this,'loadData',[true])
        }
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
          this.searchForm.startTime = '';
          this.searchForm.endTime = '';
        }
        else{
          this.searchForm.startTime = val[0];
          this.searchForm.endTime = val[1];
        }
      }
    },
    methods: {
      sortChange(column, prop, order){
        if(column.prop){
          this.searchForm.orderBy = [
            {
              field: this.getColumnName(column.prop),
              order: column.order == 'ascending' ? 1:0
            }
          ]
        }
        else{
          this.searchForm.orderBy = [];
        }
        //this.$refs.table1.clearSort()
        this.loadData(true)         
      }, 
      getColumnName(name){
        let txt = '';
        switch(name){
          case 'province':
            txt ='province_code'
          break;
          case 'pCitparentno':
            txt ='p_citparent'
          break;
          case 'clientId':
            txt ='client_id'
          break;
          case 'declarationProductNo':
            txt ='declaration_product_no'
          break;
          case 'expressDeclarationProductNo':
            txt ='express_declaration_product_no'
          break;
          case 'serviceDeclarationProductNo':
            txt ='service_declaration_product_no'
          break;
        }
        return txt;
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        this.searchForm.declarationIds = [];
        val.map(item=>{
          this.searchForm.declarationIds.push(item.id)
        })
      },
      resetForm(){
        this.searchForm = {
          provinceObject:[],
          sProvince:[],
          productNo:'',
          productName:'',
          sDbStr:'',
          date:'',
          startTime:'',
          isSuspend:'',
          endTime:'',
          equalExchangeProduct:'',
          clientId:'',
          newOrderNo:'',
          sbno:'',
          type:'',
          status:'',
          typeList:[],
          statusList:[],
          declarationIds:this.searchForm.declarationIds,
          isNeedPrivilegeController:0,
          pagingQuery:{
            pageIndex:1,
            pageSize:this.searchForm.pagingQuery.pageSize
          }
        }
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='type'){
          this.Dictions.declaration_type.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })  
        }
        else if(column.property =='status'){
          this.Dictions.declaration_status.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })  
        }
        else if(column.property =='createTime' || column.property == 'submitTime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd");
        }
        else if(column.property =='logisticsAuditTime' || column.property =='serviceAuditTime' || column.property =='seniorServiceAuditTime'
        || column.property =='backExpressCommitTime' || column.property =='receivedDate' || column.property =='backDeliveryTime'
        || column.property =='backReachTime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss");
        }
        return txt;
      },
      downLoad(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        thiz.$tupHttp(thiz,'declaration/exportDeclaration','POST',data,{Accept: '*/*'},'',true).then(res=>{
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
        this.gotoUrl('/frame/order/csOrderDetailView/'+row.id)
      },
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData();
      },
      handleSizeChange(val) {
        this.searchForm.pagingQuery.pageSize = val;
        this.loadData();
      },
      getFMonth(){
        let thiz = this;   
        let today = new Date();     
        this.$tupHttp(this,'monForFinancing/selectByMonth?date='+today.format("yyyy-MM-dd"),'GET').then(res=>{
          if(res.body.model){
            thiz.fMonth = [new Date(res.body.model.startDate).format("yyyy-MM-dd"),new Date(res.body.model.endDate).format("yyyy-MM-dd")]
            thiz.searchForm.date = thiz.fMonth
            setTimeout(function(){
              thiz.loadData(true)
            })            
          }
        })
      },
      loadData(isSearch){
        let thiz = this;
        if(new Date(thiz.searchForm.endTime).diff(new Date(thiz.searchForm.startTime)) > 92 || !thiz.searchForm.startTime){
          thiz.$notify.error({
            title: '错误提示',
            message: '申报提交时间不能超过92天或者为空'
          });
          return ;
        }
        thiz.tableLoading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        this.$tupHttp(this,'declaration/getListByPage','POST',thiz.searchForm).then(res=>{
          thiz.tableData = [];
          thiz.tableData = res.body.models
          thiz.tableLoading = false;                    
          thiz.total = res.body.pageInfo.total ? res.body.pageInfo.total : 0;          
        },res=>{
          thiz.tableLoading = false;
        })
      },
      loadDictions(){
        let thiz = this;
        let params = ["declaration_status","declaration_type"];
        this.$baseData.getDicts(this,params,function(data){
          thiz.Dictions = data;
        });
      }
    },
    mounted(){
      this.loadDictions();
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
.overflow{
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
