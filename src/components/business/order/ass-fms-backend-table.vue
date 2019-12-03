<template>
  <div>
    <div>
      <el-button style="float:left" icon="el-icon-plus" :disabled="orders.length > 19"  @click="addProduct(1)" size="mini" >添加</el-button>
      <el-button style="float:left" icon="el-icon-plus" :disabled="orders.length > 10"  @click="addProduct(10)" size="mini" >添加10条</el-button>
    </div>            
    <el-table
      :data="orders"
      style="width: 99%;"
      :height="tableHeight"
      @row-click="handleClick"
      highlight-current-row>
      <el-table-column
        type="index"
        label="序号"
        fixed
        width="50">
      </el-table-column>
      <el-table-column
        prop="orderType"
        label="订单类型"
        fixed
        width="150">
        <template slot-scope="scope">
          {{typeName}}
        </template>
      </el-table-column>
      <el-table-column
        prop="clientId"
        label="客户编号"
        width="200">
        <template slot-scope="scope">
          <el-input
            placeholder="选择客户"
            size="mini"
            v-model="scope.row.clientId"
            :disabled="true">
            <el-button @click="selectClient(scope.$index, scope.row)" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="pOutletStatus"
        :formatter="formatter"
        label="门店状态"
        width="120">
      </el-table-column>
      <el-table-column
        prop="shipTo"
        label="发货对象"
        width="200">
        <template slot-scope="scope">
          <el-input
            placeholder="选择送货对象"
            size="mini"
            v-model="scope.row.shipTo"
            :disabled="true">
            <el-button @click="selectParent(scope.$index, scope.row)" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="shipAddress"
        label="发货地址"
        width="250">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.shipAddress" placeholder="请输入内容"></el-input>
        </template>
      </el-table-column> -->      
      <el-table-column
        prop="pCode"
        width="200"
        label="产品编号">
        <template slot-scope="scope">
          <el-autocomplete
            placeholder="不少于4个字"
            :fetch-suggestions="queryProductAsync"
            @select="handleSelect"
            size="mini"
            v-model="scope.row.pCode">
            <el-button @click="selectProduct(scope.$index, scope.row)" slot="append" icon="el-icon-search"></el-button>
            <template slot-scope="{ item }">
              <div style="text-overflow: ellipsis;overflow: hidden;">{{ item.pCode }}</div>
              <span style="color: #b4b4b4;">{{ item.pName }}</span>
            </template>
          </el-autocomplete>
        </template>
      </el-table-column>          
      <el-table-column
        prop="deliverQty"
        width="110"
        label="数量">
        <template slot-scope="scope">
          <el-input-number 
            v-model="scope.row.deliverQty"
            :min="1" 
            size="mini"
            label="描述文字"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column
        prop="unitPrice"
        width="110"
        v-if="type !='SR'"
        label="单价(元)">
        <template slot-scope="scope">
          <el-input 
            v-model="scope.row.unitPrice"
            size="mini"
            label="描述文字"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="deliverWithOrder"
        width="110"
        v-if="type=='TS'"
        label="随单发货标识">
        <template slot-scope="scope">
          <el-select v-model="scope.row.deliverWithOrder" size="mini" clearable filterable  placeholder="请选择">
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop="projectName"
        v-if="type=='SF' || type=='SJ'"
        width="110"
        label="项目名称">
        <template slot-scope="scope">
          <el-select v-model="scope.row.projectName" size="mini" clearable filterable  placeholder="请选择">
            <el-option
              v-for="item in Dictions.order_project_type"
              :key="item.dictValue"
              :label="item.dictName"
              :value="item.dictValue">
            </el-option>
          </el-select>          
        </template>
      </el-table-column>
      <el-table-column
        prop="applyType"
        v-if="type=='SF' || type=='SJ'"
        width="110"
        label="申请类型">
        <template slot-scope="scope">
          <el-select v-model="scope.row.applyType" size="mini" clearable filterable  placeholder="请选择">
            <el-option
              v-for="item in Dictions.order_apply_type"
              :key="item.dictValue"
              :label="item.dictName"
              :value="item.dictValue">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop="declareType"
        v-if="type=='SR'"
        width="110"
        label="申报类型">
        <template slot-scope="scope">
          <el-select v-model="scope.row.declareType" size="mini" clearable filterable  placeholder="请选择">
            <el-option
              v-for="item in Dictions.bsorder_declaration_type"
              :key="item.dictValue"
              :label="item.dictName"
              :value="item.dictValue">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop="oldOrderNo"
        v-if="type=='SR'"
        width="200"
        label="原订单号">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.oldOrderNo" placeholder="请输入内容"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="groupFlag"
        width="110"
        v-if="type != 'SR'"
        label="团购标识">
        <template slot-scope="scope">
          <el-select v-model="scope.row.groupFlag" size="mini" clearable filterable  placeholder="请选择">
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderRemark"
        width="200"
        label="订单头备注">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.orderRemark" placeholder="请输入内容"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderDetailRemark"
        width="200"
        label="明细备注">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.orderDetailRemark " placeholder="请输入内容"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        width="150"
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <el-button icon="el-icon-tickets"  @click="copyProduct(scope.$index, scope.row)" size="mini"></el-button>
          <el-button icon="el-icon-delete"  @click="deleteConProduct(scope.$index, scope.row)" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="选择客户"
      :visible.sync="clientVisible"  
      width="60%">
      <el-form :inline="true" :model="clientForm" class="demo-form-inline">
        <el-form-item label="客户编号">
          <el-input clearable v-model="clientForm.organId" style="width:150px;" placeholder="客户编号"></el-input>
        </el-form-item>
        <el-form-item label="客户名称">
          <el-input clearable v-model="clientForm.organName" style="width:150px;" placeholder="客户名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchClient(true)">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="clientData"
        @row-dblclick="clientRowDblClick"
        style="width: 100%;height:300px;overflow-y:scroll">
        <el-table-column
          type="index"
          label="序号"
          width="55">
        </el-table-column>
        <el-table-column
          prop="pUid"
          label="客户编号">
        </el-table-column>  
        <el-table-column
          prop="pName"
          label="客户名称">
        </el-table-column> 
        <el-table-column
          prop="pOutletStatus"
          :formatter="formatter"
          label="门店状态">
        </el-table-column> 
        <el-table-column
          prop="pCitparent"
          label="送货对象">
          <template slot-scope="scope">
            {{scope.row.pCitparentno ? scope.row.pCitparent : scope.row.pOrganName}}
          </template>
        </el-table-column> 
      </el-table>
      <div style="text-align: right;margin-top:15px;">
        <el-pagination
          @current-change="handleCurrentCustomerChange"
          :current-page="currentCustomerPage"
          background
          :page-size="20"
          layout="total, prev, pager, next, jumper"
          :total="customerTotal">
        </el-pagination>
      </div>
    </el-dialog>
    <el-dialog
      title="选择分销商"
      :visible.sync="parentVisible"  
      width="60%">
      <el-form :inline="true" :model="parentForm" class="demo-form-inline">
        <el-form-item label="客户编号">
          <el-input clearable v-model="parentForm.organId" style="width:150px;" placeholder="客户编号"></el-input>
        </el-form-item>
        <el-form-item label="客户名称">
          <el-input clearable v-model="parentForm.organName" style="width:150px;" placeholder="客户名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchParent(true)">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="parentData"
        @row-dblclick="parentRowDblClick"
        style="width: 100%;height:300px;overflow-y:scroll">
        <el-table-column
          type="index"
          label="序号"
          width="55">
        </el-table-column>
        <el-table-column
          prop="pUid"
          label="客户编号">
        </el-table-column>  
        <el-table-column
          prop="pName"
          label="客户名称">
        </el-table-column> 
        <el-table-column
          prop="pOutletStatus"
          :formatter="formatter"
          label="门店状态">
        </el-table-column> 
        <el-table-column
          prop="pCitparent"
          label="送货对象">
          <template slot-scope="scope">
            {{scope.row.pCitparentno ? scope.row.pCitparent : scope.row.pOrganName}}
          </template>
        </el-table-column> 
      </el-table>
      <div style="text-align: right;margin-top:15px;">
        <el-pagination
          @current-change="handleCurrentCustomerChange"
          :current-page="currentCustomerPage"
          background
          :page-size="20"
          layout="total, prev, pager, next, jumper"
          :total="parentTotal">
        </el-pagination>
      </div>
    </el-dialog>
    <el-dialog
      title="选择产品"
      :visible.sync="visible"  
      width="60%">
      <el-form :inline="true" :model="searchParam" class="demo-form-inline">
        <el-form-item label="产品编号">
          <el-input size="mini" clearable v-model="searchParam.condition.pCode" style="width:150px;" placeholder="产品编号"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input size="mini" clearable v-model="searchParam.condition.pName" style="width:150px;" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchProduct(true)">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="productData"
        @row-dblclick="rowDblClick"
        style="width: 100%;height:300px;overflow-y:scroll">
        <el-table-column
          type="index"
          label="序号"
          width="55">
        </el-table-column>
        <el-table-column
          prop="pCode"
          label="产品编号">
        </el-table-column>  
        <el-table-column
          prop="pName"
          label="产品名称">
        </el-table-column> 
      </el-table>
      <div style="text-align: right;margin-top:15px;">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          background
          :page-size="20"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'fmsBackendTable',
  model: {
    prop: 'value',
    event: 'add'
  },
  props: {
    type: {
      type: String,
      default: "TS"
    },
    typeName: {
      type: String,
      default: ""
    },
    adjust: {
      type: Number,
      default: 1
    },
    value:{
      type: Array,
      default: []
    },
    first:{
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      currentCustomerPage:1,
      customerTotal:10,
      parentTotal:0,      
      currentPage:1,
      total:10,
      tableHeight:parseInt(document.documentElement.clientHeight-200),
      currentRow:{},
      Dictions:{
        order_apply_type:[],
        order_project_type:[],
        bsorder_declaration_type:[],
        outlet_status:[]
      },//所有的字典
      orders:this.value,
      fileUrl:'',
      visible:false,
      clientVisible:false,
      parentVisible:false,
      productData:[],
      clientData:[],
      parentData:[],
      itemIndex:-1,//当前编辑的行索引
      clientForm:{
        organName:'',
        organId:'',        
        //effectiveOIO:1,
        citorganlevels:[0,1,2,3,4,6],
        pagingQuery:{
          pageIndex:1,
          pageSize:20
        }
      },
      parentForm:{
        organName:'',
        organId:'',             
        pagingQuery:{
          pageIndex:1,
          pageSize:20
        }
      },
      searchParam:{
        condition:{
          pCode: "",
          pName: "",
          catalogCode:""
        },
        pagingQuery:{
          pageIndex:1,
          pageSize:20
        }
      }
    }
  },
  watch:{
    value:function(val){
      this.orders = val;
    }
  },
  methods: { 
    queryProductAsync(queryString, cb) {
      if(queryString.length < 4){
        return;
      }
      let thiz = this;
      let searchParam = {
        condition:{
          pCode: queryString,
          pName: "",
          catalogCode:""
        },
        pagingQuery:{
          pageIndex:1,
          pageSize:10
        }
      }
      thiz.$baseData.productList(thiz,searchParam).then(res=>{
        let productData = res.body.models;
        cb(productData)
      })
    },
    formatter(row, column) {
      let txt = ''
      if(column.property =='pOutletStatus'){
        this.Dictions.outlet_status.map(item=>{
          if(row[column.property]==item.dictValue){
            txt = item.dictName
          }
        })          
      }       
      return txt;
    },
    handleSelect(row) {
      this.currentRow.pName = row.pName;
      this.currentRow.pCode = row.pCode;
    },
    handleClick(row, event, column){
      this.currentRow = row;
    },
    handleCurrentCustomerChange(val) {
      this.clientForm.pagingQuery.pageIndex = val;
      this.searchClient();
    },
    handleCurrentChange(val) {
      this.searchParam.pagingQuery.pageIndex = val;
      this.searchProduct();
    },
    addProduct(num){
      if(!num){
        num = 1;
      }
      for(let i=0;i<num;i++){
        this.orders.push({
          adjustPrice:0,
          applyType:'',
          clientId:'',
          clientName:'',
          pOutletStatus:'',
          shipTo:'',
          deliverWithOrder:1,
          groupFlag:1,
          oldOrderNo:'',
          orderDetailRemark:'',
          declareType:'',
          orderRemark:'',
          orderType:this.type,
          pCode:'',
          plusOrMinusAdjust:'',
          unitPrice:'',
          projectName:'',
          deliverQty:1,
          shipAddress:'',
          shipTo:'',
          shipToName:'',
          areaName:'',
          provinceName:''
        });
      }      
      this.$emit('add',this.orders);
    },
    copyProduct(ind,row){
      this.orders.push({
          adjustPrice:row.adjustPrice,
          applyType:row.applyType,
          clientId:row.clientId,
          clientName:row.clientName,
          pOutletStatus:row.pOutletStatus,
          shipTo:row.shipTo,
          deliverWithOrder:row.deliverWithOrder,
          groupFlag:row.groupFlag,
          oldOrderNo:row.oldOrderNo,
          orderDetailRemark:row.orderDetailRemark,
          declareType:row.declareType,
          orderRemark:row.orderRemark,
          orderType:row.orderType,
          pCode:row.pCode,
          plusOrMinusAdjust:row.plusOrMinusAdjust,
          unitPrice:row.unitPrice,
          projectName:row.projectName,
          deliverQty:row.deliverQty,
          shipAddress:row.shipAddress,
          shipTo:row.shipTo,
          shipToName:row.shipToName,
          areaName:row.areaName,
          provinceName:row.provinceName,
        });
    },
    deleteConProduct(ind,row){
      this.orders.splice(ind,1);
    },
    selectProduct(ind,row){
      this.currentRow = row;
      this.visible = true;
    },
    selectClient(ind,row){
      this.currentRow = row;
      this.clientVisible = true;
    },
    selectParent(ind,row){
      this.currentRow = row;
      this.parentVisible = true;
    },
    rowDblClick(row, event){
      this.visible = false;
      this.currentRow.pName = row.pName;
      this.currentRow.pCode = row.pCode;
      //清除之前的搜索选项
      this.searchParam.condition.pName = '';
      this.searchParam.condition.pCode = '';
      this.searchProduct();
    },
    clientRowDblClick(row, event){      
      if(row.pCitorganlevel == 5){
        this.$message.error('不能选择分销商')
        return;
      }
      this.clientVisible = false;
      this.currentRow.clientId = row.pUid;
      this.currentRow.clientName = row.pName;
      this.currentRow.pOutletStatus = row.pOutletStatus;
      this.currentRow.shipAddress = row.pAddress1
      this.currentRow.areaName = row.pCitregionoffice
      this.currentRow.provinceName = row.pCitprovincialoffice
      this.currentRow.shipTo = (!!row.pCitparentno && row.pCitparentno != 'null') ? row.pCitparentno : row.pUid
      this.currentRow.shipToName = (!!row.pCitparentno && row.pCitparentno != 'null') ? row.pCitparent : row.pName
      //清除之前的搜索选项
      this.clientForm.organId = '';
      this.clientForm.organName = '';
      this.searchClient();
    },
    parentRowDblClick(row, event){
      this.parentVisible = false;
      this.currentRow.shipAddress = row.pAddress1
      this.currentRow.shipTo = row.pUid
      this.currentRow.shipToName = row.pName
      //清除之前的搜索选项
      this.parentForm.organId = '';
      this.parentForm.organName = '';
      this.searchParent();
    },
    getLevel(){
      if(this.type == 'SJ' || this.type == 'SF'){
        this.clientForm.citorganlevels = [1,2]
      }
      else {
         this.clientForm.citorganlevels = [6]
      }
    },
    searchProduct(isSearch){
      let thiz = this;
      if(isSearch)
        thiz.searchParam.pagingQuery.pageIndex = 1;//重置为第一页
      //thiz.$tupHttp(thiz,'product/product/selectProductBypCodeOrpName','POST',thiz.searchParam)
      thiz.$baseData.productList(thiz,thiz.searchParam).then(res=>{
        thiz.productData = res.body.models;
        thiz.total = res.body.pageInfo.total
      })
      /* thiz.$baseData.productList(thiz,thiz.searchParam).then(res=>{
        thiz.productData = res.body.models;
      }) */
    },
    searchClient(isSearch){
      let thiz = this;
      if(isSearch)
        thiz.clientForm.pagingQuery.pageIndex = 1;//重置为第一页
      thiz.$tupHttp(thiz,'user/list/v1','POST',thiz.clientForm).then(res=>{
        thiz.clientData = res.body.models;
        thiz.customerTotal = res.body.pageInfo.total
      })
    },
    searchParent(isSearch){
      let thiz = this;
      if(isSearch)
        thiz.parentForm.pagingQuery.pageIndex = 1;//重置为第一页
      thiz.$tupHttp(thiz,'user/list/v1','POST',thiz.parentForm).then(res=>{
        thiz.parentData = res.body.models;
        thiz.parentTotal = res.body.pageInfo.total
      })
    },
    loadDictions(){
      let thiz = this;
      let params = ["order_apply_type","order_project_type","outlet_status","bsorder_declaration_type"];
      this.$baseData.getDicts(this,params,function(data){
        thiz.Dictions = data;
      });
    }
  },
  mounted () {
    //this.getLevel();
    this.loadDictions();
    this.searchProduct();
    this.searchClient();
    this.searchParent();
  },
  computed: {
  }
}
</script>

<style scoped>
.leftTree{
    overflow-x: hidden;
    overflow-y: scroll;
    height: 400px;
}
</style>

