<template>
  <div>
    <div>
      <el-button style="float:left" icon="el-icon-plus" :disabled="orders.length > 19" @click="addProduct(1)" size="mini" >添加</el-button>
      <el-button style="float:left" icon="el-icon-plus" :disabled="orders.length > 10" @click="addProduct(10)" size="mini" >添加10条</el-button>
    </div>            
    <el-table
      :data="orders"
      style="width: 99%;"
      :height="tableHeight"
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
      <!-- <el-table-column
        prop="pDeliver"
        label="发货对象"
        width="120">
      </el-table-column> -->
      <el-table-column
        prop="oldOrderNo"
        width="180"
        label="原订单号">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.oldOrderNo" placeholder="请输入内容"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="lineno"
        width="180"
        v-if="adjust == 0"
        label="产品明细行数">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.lineno" placeholder="请输入内容"></el-input>
        </template>
      </el-table-column>
      
      <!-- <el-table-column
        prop="oldOrderNo"
        width="180"
        v-if="adjust == 0"
        label="原订单号">
      </el-table-column> -->
      <el-table-column
        prop="pCode"
        width="200"
        label="产品编号">
        <template slot-scope="scope">
          <el-input-product-code 
            v-model="scope.row.pCode"
            :param="scope"
            @onSelect="handleSelect"
            size="mini"></el-input-product-code>
        </template>  
      </el-table-column> 
      <!-- <el-table-column
        prop="pCode"
        width="200"
        v-if="adjust == 0"
        label="产品编号">
        <template slot-scope="scope">
          <el-input
            placeholder="选择产品"
            size="mini"
            v-model="scope.row.pCode"
            :disabled="true">
            <el-button @click="selectProduct(scope.$index, scope.row)" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </template>
      </el-table-column>   -->      
      <el-table-column
        prop="deliverQty"
        width="110"
        label="数量">
        <template slot-scope="scope">
          <el-input-number 
            v-model="scope.row.deliverQty"
            size="mini"
            label="描述文字"></el-input-number>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="originSalePrice"
        width="200"
        label="原单零售价格">
        <template slot-scope="scope">
          {{$util.formatThousand(scope.row.originSalePrice,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="actualPayPrice"
        width="150"
        label="实际支付价格">
        <template slot-scope="scope">
          {{$util.formatThousand(scope.row.actualPayPrice,2)}}
        </template>
      </el-table-column> -->
      <el-table-column
        prop="unitPrice"
        width="110"
        label="最小产品单价">
        <template slot-scope="scope">
          <el-input 
            v-model="scope.row.unitPrice"
            size="mini"
            label="描述文字"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="adjustPayable"
        width="140"
        :label="adjust == 1 ? '优惠前零售总额':'优惠前零售总额'">
        <template slot-scope="scope">
          <el-input 
            v-model="scope.row.adjustPayable"
            size="mini"
            :label="scope.row.originSalePrice"></el-input>
        </template>
      </el-table-column>      
      <!-- <el-table-column
        prop="discountA"
        width="200"
        v-if="adjust == 0"
        label="退回折扣差A金额">
        <template slot-scope="scope">
          {{$util.formatThousand((scope.row.adjustPayable/scope.row.originSalePrice)*scope.row.discountA,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="discountB"
        width="200"
        v-if="adjust == 0"
        label="退回折扣差B金额">
        <template slot-scope="scope">
          {{$util.formatThousand((scope.row.adjustPayable/scope.row.originSalePrice)*scope.row.discountB,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="discountC"
        width="200"
        v-if="adjust == 0"
        label="退回优惠券金额">
        <template slot-scope="scope">
          {{$util.formatThousand((scope.row.adjustPayable/scope.row.originSalePrice)*scope.row.discountC,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="actual"
        width="200"
        v-if="adjust == 0"
        label="实际退回金额">
        <template slot-scope="scope">
          {{$util.formatThousand((scope.row.adjustPayable/scope.row.originSalePrice)*scope.row.actual,2)}}
        </template>
      </el-table-column> -->
      <el-table-column
        prop="orderRemark"
        width="200"
        label="订单头备注">
        <template slot-scope="scope">
          <el-input size="mini"  @change="handleChange(scope.$index, scope.row)"  :disabled="!scope.row.pCode" v-model="scope.row.orderRemark" placeholder="请输入内容"></el-input>
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
          <el-button type="primary" @click="searchClient()">查询</el-button>
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
          background
          :current-page="currentCustomerPage"
          :page-size="20"
          layout="total, prev, pager, next, jumper"
          :total="customerTotal">
        </el-pagination>
      </div>
    </el-dialog>
    <el-dialog
      title="选择产品"
      :visible.sync="visible"  
      width="60%">
      <div style="height:250px;overflow-y:auto;border:1px solid #ccc;border-radius: 5px">
        <el-tree
          @node-click='handleClick'
          :data="productData"
          :default-expand-all="true"
          ref="areaTree"
          node-key="orderNo"
          :props="defaultProps">
        </el-tree>
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
      defaultProps: {
        children: 'details',
        label: 'label'
      },
      tableHeight:parseInt(document.documentElement.clientHeight-200),
      currentRow:{},
      Dictions:{
        order_apply_type:[],
        order_project_type:[],
        outlet_status:[]
      },//所有的字典
      orders:this.value,
      fileUrl:'',
      visible:false,
      clientVisible:false,
      productData:[],
      clientData:[],
      itemIndex:-1,//当前编辑的行索引
      clientForm:{
        organName:'',
        organId:'',
        //citorganlevel:6,
        //effectiveOIO:1,
        citorganlevels:[0,1,2,3,4,6],
        pagingQuery:{
          pageIndex:1,
          pageSize:20
        }
      },
      searchParam:{
        condition:{
          pCode: "",
          pName: "",
          pStatus:1
        },
        pagingQuery:{
          pageIndex:0,
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
    handleSelect(product,scope){     
      scope.row.pName = product.pName
    },
    handleCurrentCustomerChange(val) {
      this.clientForm.pagingQuery.pageIndex = val;
      this.searchClient();
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
    addProduct(num){
      if(!num){
        num = 1;
      }
      for(let i=0;i<num;i++){
        this.orders.push({
          adjustPayable:'',
          clientId:'',
          clientName:'',
          pOutletStatus:'',
          pDeliver:'',
          oldOrderNo:'',
          orderDetailRemark:'',
          orderRemark:'',
          orderType:this.type,
          pCode:'',
          plusOrMinusAdjust:this.adjust,
          lineno:'',
          unitPrice:'',
          shopCartNum:0,
          discountA:'',
          discountB:'',
          discountC:'',
          actual:'',
          prdPrice:0,
          deliverQty:0,
          originSalePrice:null,
          actualPayPrice:null,
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
          adjustPayable:row.adjustPayable,
          applyType:row.applyType,
          clientId:row.clientId,
          pOutletStatus:row.pOutletStatus,
          pDeliver:row.pDeliver,
          groupFlag:row.groupFlag,
          oldOrderNo:row.oldOrderNo,
          orderDetailRemark:row.orderDetailRemark,
          orderRemark:row.orderRemark,
          orderType:row.orderType,
          pCode:row.pCode,
          plusOrMinusAdjust:row.plusOrMinusAdjust,
          unitPrice:row.unitPrice,
          shopCartNum:row.shopCartNum,
          discountA:row.discountA,
          lineno:row.lineno,
          discountB:row.discountB,
          discountC:row.discountC,
          actual:row.actual,
          prdPrice:row.prdPrice,
          deliverQty:row.deliverQty,
          originSalePrice:row.originSalePrice,
          actualPayPrice:row.actualPayPrice,
          deliverQty:row.deliverQty,
          shipAddress:row.shipAddress,
          shipTo:row.shipTo,
          shipToName:row.shipToName,
          areaName:row.areaName,
          provinceName:row.provinceName
        });
    },
    handleChange(ind,row){
      let isHad = this.orders.some((currentValue,index,arr)=>{
        return index != ind 
        && row.clientId == currentValue.clientId 
        && row.orderRemark == currentValue.orderRemark
        && row.oldOrderNo != currentValue.orderNo
      })
      if(isHad){
        this.$notify.error({
          title: '错误提示',
          message: '原订单号不一致，请修改订单头备注'
        });
      }
    },
    deleteConProduct(ind,row){
      this.orders.splice(ind,1);
    },
    selectProduct(ind,row){
      if(row.clientId){
        this.currentRow = row;
        this.visible = true;
        this.searchProduct();
      }
    },
    selectClient(ind,row){
      this.currentRow = row;
      this.clientVisible = true;
    },
    handleClick(node, data,hasChild){
      if(!data.isLeaf){
        return;
      }
      this.visible = false;
      this.currentRow.pName = node.pName;
      this.currentRow.pCode = node.pCode;
      this.currentRow.oldOrderNo = node.orderNo;
      /* this.currentRow.deliverQty = node.deliverQty;
      this.currentRow.prdPrice = node.prdPrice;
      this.currentRow.originSalePrice = node.beforeBenifitPrice;
      this.currentRow.actualPayPrice = node.actuallyPayment;
      
      this.currentRow.discountA = node.aDiscountDiffMoney;
      this.currentRow.discountB = node.bDiscountDiffMoney;
      this.currentRow.discountC = node.couponMoney;
      this.currentRow.actual = node.actuallyPayment; */
    },
    clientRowDblClick(row, event){
      if(row.pOutletStatus == '结业'){
        this.$notify.error({
          title: '错误提示',
          message: '已结业专卖店不能选择'
        })
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
      //清除之前的搜索选项
      this.clientForm.organId = '';
      this.clientForm.organName = '';
      this.searchClient();
    },
    searchProduct(){
      let thiz = this;
      thiz.$tupHttp(thiz,'order/getClientOrders?clientNo='+this.currentRow.clientId,'POST').then(res=>{
        thiz.productData = res.body.models;
      })
    },
    searchClient(){
      let thiz = this;
      thiz.$tupHttp(thiz,'user/list/v1','POST',thiz.clientForm).then(res=>{
        thiz.clientData = res.body.models;
        thiz.customerTotal = res.body.pageInfo.total
      })
    },
    loadDictions(){
      let thiz = this;
      let params = ["order_apply_type","order_project_type","outlet_status"];
      this.$baseData.getDicts(this,params,function(data){
        thiz.Dictions = data;
      });
    }
  },
  mounted () {
    this.loadDictions();
    this.searchClient();
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

