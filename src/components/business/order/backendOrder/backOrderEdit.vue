<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>后台订单管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: backPath }" >{{backName}}</el-breadcrumb-item>
      <el-breadcrumb-item>后台订单详情</el-breadcrumb-item>
    </el-breadcrumb>
    <br/>      
    <div class="itemsTitle"></div>
    <el-row>
      <el-col :span="6">
        <B>草稿编号：{{model.id}}</B>        
      </el-col>
      <el-col :span="6">
        <B>订单类型：{{backName}}</B>             
      </el-col>
      <el-col :span="12" style="text-align:right">
        <el-button size="mini" @click="$router.go(-1)">返回</el-button>
        <el-button size="mini" @click="commit(false)" :loading="loading" type="primary">保存</el-button>
        <el-button size="mini" @click="commit(true)" :loading="loading" type="primary">保存 & 提交</el-button>
      </el-col>
    </el-row>
    <br/>
    <div>
      <el-form :model="model" :rules="modelRules" ref="modelForm" label-width="220px">
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="区域">
              {{model.areaName}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="省办">
              {{model.provinceName}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="客户编号">
              <el-input
                placeholder="选择客户"
                size="mini"
                v-model="model.clientId"
                :disabled="true">
                <el-button @click="clientVisible = true" slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称">
              {{model.clientName}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="门店状态">
              {{formatter({pOutletStatus:model.pOutletStatus},{property:'pOutletStatus'})}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="分销商编号">
              {{model.parentClientId}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分销商名称">
              {{model.parentClientName}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="发货对象">
              <el-input
                placeholder="选择送货对象"
                size="mini"
                v-model="model.shipTo"
                :disabled="true">
                <el-button @click="parentVisible = true" slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="送货对象名称">
              {{model.shipToName}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="24">
            <el-form-item label="发货地址">
              <el-input size="mini" disabled v-model="model.shipAddress" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="itemsTitle">编辑后台订单信息</div>
        <el-row :gutter="5" v-if="type =='TS'" >
          <el-col :span="12">
            <el-form-item label="随单发货标识" >
              <el-select v-model="model.deliverWithOrder" size="mini" clearable filterable  placeholder="请选择">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>           
        </el-row>
        <el-row :gutter="5" v-if="type=='SF' || type=='SJ'">
          <el-col :span="12">
            <el-form-item label="项目名称">
              <el-select v-model="model.projectName" size="mini" clearable filterable  placeholder="请选择">
                <el-option
                  v-for="item in Dictions.order_project_type"
                  :key="item.dictValue"
                  :label="item.dictName"
                  :value="item.dictValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>        
        </el-row>
        <el-row :gutter="5" v-if="type=='SF' || type=='SJ'">
          <el-col :span="12">
            <el-form-item label="申请类型">
              <el-select v-model="model.applyType" size="mini" clearable filterable  placeholder="请选择">
                <el-option
                  v-for="item in Dictions.order_apply_type"
                  :key="item.dictValue"
                  :label="item.dictName"
                  :value="item.dictValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>          
        </el-row>
        <el-row :gutter="5" v-if="type=='SR'">
          <el-col :span="12">
            <el-form-item label="申报类型" >
              <el-select  v-model="model.declareType" size="mini" clearable filterable  placeholder="请选择">
                <el-option
                  v-for="item in Dictions.bsorder_declaration_type"
                  :key="item.dictValue"
                  :label="item.dictName"
                  :value="item.dictValue">
                </el-option> 
              </el-select>
            </el-form-item>
          </el-col>               
        </el-row>
        <el-row :gutter="5" v-if="type=='SR'">
          <el-col :span="12">
            <el-form-item label="原订单号">
              <el-input size="mini" v-model="model.oldOrderNo" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>                
        </el-row>
        <el-row :gutter="5" v-if="type == 'SS' || type == 'TS' || type == 'SB'">
          <el-col :span="12">
            <el-form-item label="团购标识" >
              <el-select  v-model="model.groupFlag" size="mini" clearable filterable  placeholder="请选择">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>         
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="订单头备注">
              <el-input size="mini" v-model="model.orderRemark" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>          
        </el-row>
        <div class="itemsTitle">编辑产品信息</div>
        <fms-backend-table @delete="handleDelete" v-model="model.details" :type="type" type-name="后台订单"></fms-backend-table>
      </el-form>
    </div>
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
          :current-page="currentCustomerPage"
          background
          :page-size="20"
          layout="total, prev, pager, next, jumper"
          :total="customerTotal">
        </el-pagination>
      </div>
    </el-dialog>
    <el-dialog
      title="选择发货对象"
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
          <el-button type="primary" @click="searchParent()">查询</el-button>
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
  </div>
</template>

<script>
  import fmsBackendTable from '@/components/business/order/ass-fms-backend-edit-table'
  export default {
    data() {
      return {
        id:this.$route.params.id,
        type:this.$route.params.type,
        visible:false,
        clientVisible:false,
        parentVisible:false,
        productData:[],
        clientData:[],
        parentData:[],
        customerTotal:10,
        parentTotal:0,      
        currentPage:1,
        total:10,
        loading:false,
        backName:'S2特殊单',
        backPath:'/frame/order/backendOrder/specialOrderList',
        Dictions:{
          bsorder_declaration_type:[],
          outlet_status:[],
          order_project_type:[],
          order_apply_type:[]
        },//本页面使用的所有字典
        model:{
          productAttr:{},
          deleteDetails:[]
        },
        modelRules:{},
        clientVisible:false,
        clientForm:{
          organName:'',
          organId:'',        
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
    components: {
      fmsBackendTable
    },
    watch:{
    },
    methods: {
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
      handleDelete(row){
        if(row.id){
          this.model.deleteDetails.push(row)
        }
      },
      handleSelect(row) {
        this.model.pName = row.pName;
        this.model.pCode = row.pCode;
      },
      clientRowDblClick(row, event){
        this.clientVisible = false;
        this.model.clientId = row.pUid;
        this.model.clientName = row.pName;
        this.model.pOutletStatus = row.pOutletStatus;
        this.model.areaCode = '';//
        this.model.provinceCode = '';//
        //this.model.shipAddress = row.pAddress1
        this.model.discountValue = row.pDiscountvalue;
        this.model.areaName = row.pCitregionoffice
        this.model.provinceName = row.pCitprovincialoffice
        this.model.shipTo = (!!row.pCitparentno && row.pCitparentno != 'null') ? row.pCitparentno : row.pUid
        this.model.shipToName = (!!row.pCitparentno && row.pCitparentno != 'null') ? row.pCitparent : row.pName
        this.model.parentClientId = (!!row.pCitparentno && row.pCitparentno != 'null') ? row.pCitparentno : row.pUid
        this.model.parentClientName = (!!row.pCitparentno && row.pCitparentno != 'null') ? row.pCitparent : row.pName
        //清除之前的搜索选项
        this.clientForm.organId = '';
        this.clientForm.organName = '';
        this.searchClient();
      },
      parentRowDblClick(row, event){
        this.parentVisible = false;
        this.model.shipAddress = row.pAddress1
        this.model.shipTo = row.pUid
        this.model.shipToName = row.pName
        //清除之前的搜索选项
        this.parentForm.organId = '';
        this.parentForm.organName = '';
        this.searchParent();
      },
      rowDblClick(row, event){
        this.visible = false;
        this.model.pName = row.pName;
        this.model.pCode = row.pCode;
        //清除之前的搜索选项
        this.searchParam.condition.pName = '';
        this.searchParam.condition.pCode = '';
        this.searchProduct();
      },
      getBackName(){
        switch(this.$route.params.type){
          case 'S2':
            this.backName = 'S2特殊单'
            this.backPath = '/frame/order/backendOrder/specialOrderList'
          break;
          case 'SF':
            this.backName = 'SF产品申请表'
            this.backPath = '/frame/order/backendOrder/sfProductOrderList'
          break;
          case 'SJ':
            this.backName = 'SJ内部申请表'
            this.backPath = '/frame/order/backendOrder/sjProductOrderList'
          break;
          case 'SB':
            this.backName = 'SB B2B订单'
            this.backPath = '/frame/order/backendOrder/sbProductOrderList'
          break;
          case 'SS':
            this.backName = 'SS员工自购单'
            this.backPath = '/frame/order/backendOrder/ssProductOrderList'
          break;
          case 'SR':
            this.backName = 'SR售后订单'
            this.backPath = '/frame/order/backendOrder/srProductOrderList'
          break;
        }
      },
      submitDraft(){
        let thiz = this;
        this.loading = true;
        let data = this.$util.deepClone(this.model)
        thiz.$tupHttp(thiz,'order/submitDraft','POST',data).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功',
            message : '保存&提交成功'
          });
          thiz.$router.go(-1);
        },res=>{
          thiz.loading = false;
        })
      },
      commitData(){
        let thiz = this;
        this.loading = true;
        let data = this.$util.deepClone(this.model)
        thiz.$tupHttp(thiz,'order/updateDraft','POST',data).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功',
            message : '保存成功'
          });
          thiz.loadData();
        },res=>{
          thiz.loading = false;
        })
      }, 
      commit(isCommit){
        this.$refs.modelForm.validate((valid) => {
          if (valid) {
            debugger
            if(isCommit){
              this.submitDraft()
            }
            else{
              this.commitData();
            }            
          } else {
            return false;
          }
        });
      },
      loadData(){
        let thiz = this;
        thiz.$tupHttp(thiz,'order/getDraftDetail?id='+this.id,'GET').then(res=>{
          let model = res.body.model;
          model.deleteDetails = [];
          thiz.model = model;          
        }) 
      },
      loadDictions(){
        let thiz = this;
        let params = ["outlet_status","order_project_type","order_apply_type","bsorder_declaration_type"];
        this.$baseData.getDicts(this,params,function(data){
          thiz.Dictions = data;
        });
      }
    },
    mounted(){
      this.getBackName()
      //this.searchProduct();
      //this.searchClient();
      //this.searchParent();
      this.loadData();
      this.loadDictions();
    }
  }
</script>
<style scoped>
.itemsTitle{
  font-size: 16px;
  color: rgb(223, 8, 8);
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
}
.dialog-footer{
  margin-top: 10px;
  text-align: right;
}
.grid-content{
  border: 0px solid #eee;
  padding: 5px;
  border-radius: 5px;
}
.transition-box {
  margin-bottom: 10px;
  width: 80px;
  height: 80px;
  border-radius: 4px;
  background-color: #409EFF;
  text-align: center;
  color: #fff;
  padding: 30px 20px;
  box-sizing: border-box;
  margin-right: 20px;
}
</style>


