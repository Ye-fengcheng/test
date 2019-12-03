<template>
  <div>
    <div>
      <el-button style="float:left" icon="el-icon-plus" :disabled="orders.length > 99"  @click="addProduct(1)" size="mini" >添加</el-button>
      <el-button style="float:left" icon="el-icon-plus" :disabled="orders.length > 90"  @click="addProduct(10)" size="mini" >添加10条</el-button>
    </div>            
    <el-table
      :data="orders"
      style="width: 99%;"
      :height="tableHeight"
      @row-click="handleClick"
      :summary-method="getSummaries"
      show-summary
      highlight-current-row>
      <el-table-column
        type="index"
        label="序号"
        fixed
        width="50">
      </el-table-column>      
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
        prop="pName"
        width="200"
        label="产品名称">
      </el-table-column>
      <el-table-column
        prop="isDiscount"
        width="100"
        label="打折属性">
        <template slot-scope="scope">
          {{scope.row.isDiscount == 1 ? '是':'否'}}
        </template>
      </el-table-column>        
      <el-table-column
        prop="deliverQty"
        width="110"
        align="center"
        label="发货数量">
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
        v-if="type =='TS' || type =='SS' || type =='SB'"
        label="单价(元)">
        <template slot-scope="scope">
          <el-input 
            v-model="scope.row.unitPrice"
            size="mini"
            label="描述文字"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="prdPrice"
        width="110"
        v-if="type =='TS' || type =='SS' || type =='SB'"
        label="总价(元)">
        <template slot-scope="scope">
          {{ $util.formatThousand(scope.row.prdPrice = scope.row.unitPrice*scope.row.deliverQty,2) }}
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="oldOrderNo"
        v-if="type=='SR'"
        width="200"
        label="原订单号">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.oldOrderNo" placeholder="请输入内容"></el-input>
        </template>
      </el-table-column> -->
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
          <el-button type="primary" @click="searchProduct()">查询</el-button>
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
          :current-page="searchParam.pagingQuery.pageIndex"
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
    getSummaries(param) {
      let thiz = this;
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (column.property == 'prdPrice' || column.property == 'deliverQty') {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] = column.property=='deliverQty' ? sums[index] : thiz.$util.formatThousand(sums[index],2);;
        } else {
          sums[index] = '';
        }
      });

      return sums;
    },
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
      this.currentRow.isDiscount = row.isDiscount;
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
          deliverWithOrder:'',
          orderDetailRemark:'',
          pCode:'',
          pName:'',
          plusOrMinusAdjust:'',
          unitPrice:0,
          isDiscount:0,
          prdPrice:'',
          deliverQty:1
        });
      }      
      this.$emit('add',this.orders);
    },
    copyProduct(ind,row){
      this.orders.push({
        adjustPrice:row.adjustPrice,
        deliverWithOrder:row.deliverWithOrder,
        orderDetailRemark:row.orderDetailRemark,
        pCode:row.pCode,
        pName:row.pName,
        plusOrMinusAdjust:row.plusOrMinusAdjust,
        unitPrice:row.unitPrice,
        isDiscount:row.isDiscount,
        prdPrice:row.prdPrice,
        deliverQty:row.deliverQty
      });
    },
    deleteConProduct(ind,row){
      let thiz = this;
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        thiz.orders.splice(ind,1);
        thiz.$emit('delete',row);
      });
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
      this.currentRow.isDiscount = row.isDiscount;
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
    },
    searchProduct(){
      let thiz = this;
      //thiz.$tupHttp(thiz,'product/product/selectProductBypCodeOrpName','POST',thiz.searchParam)
      thiz.$baseData.productList(thiz,thiz.searchParam).then(res=>{
        thiz.productData = res.body.models;
        thiz.total = res.body.pageInfo.total
      })
      /* thiz.$baseData.productList(thiz,thiz.searchParam).then(res=>{
        thiz.productData = res.body.models;
      }) */
    },
    searchClient(){
      let thiz = this;
      thiz.$tupHttp(thiz,'user/list/v1','POST',thiz.clientForm).then(res=>{
        thiz.clientData = res.body.models;
        thiz.customerTotal = res.body.pageInfo.total
      })
    },
    searchParent(){
      let thiz = this;
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

