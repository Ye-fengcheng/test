<template>
  <div>
    <div>
      <el-button style="float:left" icon="el-icon-plus" :disabled="orders.length > 99"  @click="addProduct(1)" size="mini" >添加</el-button>
      <el-button style="float:left" icon="el-icon-plus" :disabled="orders.length > 90" @click="addProduct(10)" size="mini" >添加10条</el-button>
    </div>            
    <el-table
      :data="orders"
      ref="csOrder"
      style="width: 99%;"
      @row-click="handleClick"
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
        label="门店状态"
        :formatter="formatter"
        width="120">
      </el-table-column>
      <el-table-column
        prop="pDeliver"
        label="发货对象"
        width="120">
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
        prop="shopCartNum"
        width="110"
        label="数量">
        <template slot-scope="scope">
          <el-input-number 
            v-model="scope.row.shopCartNum"
            :min="1" 
            size="mini"
            label="描述文字"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderUnit"
        width="110"
        label="订货单位">
      </el-table-column>
      <el-table-column
        prop="price"
        width="110"
        label="单价(元)">
      </el-table-column>
      <el-table-column
        prop="type"
        width="150"
        label="申报类型">
        <template slot-scope="scope">
          <el-select v-model="scope.row.type" size="mini" clearable filterable  placeholder="请选择">
            <el-option label="WD-错发" :value="2"></el-option>
            <el-option label="MD-漏发" :value="3"></el-option>
            <el-option label="IP-到货残次" :value="4"></el-option>
            <el-option label="LC-物流赔付" :value="5"></el-option>
            <el-option label="QP-质量评估" :value="6"></el-option>            
          </el-select>
        </template>
      </el-table-column>      
      <el-table-column
        prop="orderNo"
        width="250"
        label="订单编号">
        <template slot-scope="scope">
          <el-select size="mini" v-model="scope.row.orderNo" @change="handleChange" placeholder="请选择">
            <el-option
              v-for="item in scope.row.orderData"
              :key="item.orderNo"
              :label="item.orderNo"
              :value="item.orderNo">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderHeadRemark"
        width="200"
        label="订单头备注">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.orderHeadRemark" placeholder="请输入内容"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="detailRemark"
        width="200"
        label="明细备注">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.detailRemark " placeholder="请输入内容"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        width="150"
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <!-- <el-button icon="el-icon-tickets"  @click="copyProduct(scope.$index, scope.row)" size="mini"></el-button> -->
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
          prop="pOrganName"
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
    </el-dialog>
    <el-dialog
      title="选择产品"
      :visible.sync="visible"  
      width="60%">
      <el-form :inline="true" :model="searchParam" class="demo-form-inline">
        <el-form-item label="关键字">
          <el-input clearable v-model="searchParam.search" style="width:150px;" placeholder="产品编号/产品名称"></el-input>
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
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'fmsCsTable',
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
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tableHeight:parseInt(document.documentElement.clientHeight-200),
      currentRow:{},
      Dictions:{
        order_apply_type:[],
        outlet_status:[],
        order_project_type:[]
      },//所有的字典
      orders:this.value,
      fileUrl:'',
      visible:false,
      clientVisible:false,
      orderVisible:false,
      productData:[],
      orderData:[],
      clientData:[],
      itemIndex:-1,//当前编辑的行索引
      clientForm:{
        organName:'',
        organId:'',
        pagingQuery:{
          pageIndex:1,
          pageSize:20
        }
      },
      searchParam:{
        search:'',
        type:2,
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
    handleSelect(row) {
      this.currentRow.pName = row.pName;
      this.currentRow.pCode = row.pCode;
    },
    handleClick(row, event, column){
      this.currentRow = row;
    },
    addProduct(num){
      if(!num){
        num = 1;
      }
      for(let i=0;i<num;i++){
        this.orders.push({
          applyType:'',
          clientId:'',
          pOutletStatus:'',
          pDeliver:'',
          detailRemark:'',
          orderHeadRemark:'',
          orderType:this.type,
          pCode:'',
          pName:'',
          orderUnit:'',
          price:0,
          shopCartNum:1
        });
      }      
      this.$emit('add',this.orders);
    },
    copyProduct(ind,row){
      this.orders.push({
        applyType:row.applyType,
        clientId:row.clientId,
        pOutletStatus:row.pOutletStatus,
        pDeliver:row.pDeliver,
        detailRemark:row.detailRemark,
        orderHeadRemark:row.orderHeadRemark,
        orderType:row.orderType,
        orderData:row.orderData,
        pCode:row.pCode,
        pName:row.pName,
        orderUnit:row.orderUnit,
        price:row.price,
        shopCartNum:row.shopCartNum
      })
    },
    deleteConProduct(ind,row){
      this.orders.splice(ind,1);
    },
    handleChange(val){
      this.addProduct(1)
      this.deleteConProduct(this.orders.length -1 ,null)
    },
    searchOrder(){
      let thiz = this;
      thiz.$tupHttp(thiz,'order/getClientOrderStatus?clientNo='+this.currentRow.clientId,'GET').then(res=>{
        thiz.currentRow.orderData = res.body.models;
      })
    },
    selectProduct(ind,row){
      this.currentRow = row;
      this.visible = true;
    },
    selectClient(ind,row){
      this.currentRow = row;
      this.clientVisible = true;
    },
    rowDblClick(row, event){
      this.visible = false;
      this.currentRow.pName = row.pName;
      this.currentRow.pCode = row.pCode;
      this.currentRow.price = row.price;
      this.currentRow.orderUnit = row.orderUnit;
      //清除之前的搜索选项
      this.searchParam.search = '';
      this.searchProduct();
    },
    clientRowDblClick(row, event){
      this.clientVisible = false;
      this.currentRow.clientId = row.pUid;
      this.currentRow.pOutletStatus = row.pOutletStatus;
      this.currentRow.orderNo = '';
      this.currentRow.pDeliver = row.pCitparentno ? row.pCitparentno : row.pUid
      //清除之前的搜索选项
      this.clientForm.organId = '';
      this.clientForm.organName = '';
      this.searchClient();
      this.searchOrder();
    },
    searchProduct(){
      let thiz = this;
      thiz.$tupHttp(thiz,'product/product/selectProductBypCodeOrpName','POST',thiz.searchParam).then(res=>{
        thiz.productData = res.body.models;
      })
      /* thiz.$baseData.productList(thiz,thiz.searchParam).then(res=>{
        thiz.productData = res.body.models;
      }) */
    },
    searchClient(){
      let thiz = this;
      thiz.$tupHttp(thiz,'account/list/v1','POST',thiz.clientForm).then(res=>{
        thiz.clientData = res.body.models;
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
    this.searchProduct();
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

