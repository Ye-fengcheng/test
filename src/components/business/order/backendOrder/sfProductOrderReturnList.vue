<template>
  <div>
    <el-form  :model="searchForm" label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="地区">            
            <tup-arae-select v-model="searchForm.condition.provinceObject"></tup-arae-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="专卖店编号">
            <el-input v-model="searchForm.condition.clientId" size="mini" placeholder="专卖店编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="分销商编号">
            <el-input v-model="searchForm.condition.parentClientId" size="mini"  placeholder="分销商编号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="16">    
          <el-form-item label="产品编号">      
            <el-input-mut-product-code 
              v-model="searchForm.condition.pCodeList"
              size="mini"></el-input-mut-product-code>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="送货对象">
            <el-input v-model="searchForm.condition.shipToName" size="mini"  placeholder="送货对象"></el-input>
          </el-form-item>
        </el-col>    
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="草稿编号">
            <el-input v-model="searchForm.condition.draftNo" size="mini"  placeholder="草稿编号"></el-input>
          </el-form-item>
        </el-col>  
        <el-col :span="8">
          <el-form-item label="制单人">
            <el-input v-model="searchForm.condition.createBy" size="mini" placeholder="制单人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">    
          <el-form-item label="创建日期">
            <el-date-picker
              style="width:100%"
              v-model="searchForm.condition.date"
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
          <el-form-item label="备注">
            <el-input v-model="searchForm.condition.remark" size="mini" placeholder="备注"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" :loading="loading" size="mini" @click="loadData(true)">查询</el-button>
        <el-button  icon="el-icon-refresh" type="primary" size="mini" @click="resetForm">重置</el-button>
        <el-button icon="el-icon-close" :disabled="multipleSelection.length==0" size="mini" :loading="loading" @click="deleteData" type="danger">批量删除</el-button>
        <el-button type="text" @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      ref="orderTable"
      v-loading="tableLoading"
      style="width: 100%;"
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
        prop="id"
        label="草稿编号"
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
        label="客户编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="clientName"
        label="客户名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="parentClientId"
        label="分销商编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="shipTo"
        label="送货对象"
        width="120">
      </el-table-column>
      <el-table-column
        prop="pCode"
        label="产品编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="pName"
        label="产品名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="deliverQty"
        label="发货数量"
        width="120">
      </el-table-column>
      <el-table-column
        prop="unitPrice"
        label="单价（元）"
        width="120">
      </el-table-column>
      <el-table-column
        prop="prdPrice"
        label="总价（元）"
        width="120">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.prdPrice,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="isDiscount"
        label="打折属性"
        width="120">
        <template slot-scope="scope">
          {{scope.row.isDiscount == 1 ? '是':'否'}}
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="优惠前金额(-)"
        width="120">
      </el-table-column>
      <el-table-column
        prop=""
        label="优惠后金额(-)"
        width="120">
      </el-table-column>
      <el-table-column
        prop="discountValue"
        label="门店折扣率"
        width="120">
      </el-table-column>
      <el-table-column
        prop=""
        label="实际支付金额(-)"
        width="120">
      </el-table-column>
      <el-table-column
        prop=""
        label="销售净额(-)"
        width="120">
      </el-table-column>
      <el-table-column
        prop=""
        label="付款状态(-)"
        width="120">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建日期"
        :formatter="formatter"
        width="120">
      </el-table-column>
      <el-table-column
        prop=""
        label="订单状态(-)"
        width="120">
      </el-table-column>
      <el-table-column
        prop="orderRemark"
        label="订单头备注"
        width="120">
      </el-table-column>
      <el-table-column
        prop="orderDetailRemark"
        label="明细备注"
        width="150">
      </el-table-column>
      <el-table-column
        prop="createBy"
        label="制单人"
        width="100">
      </el-table-column>
      <el-table-column
        prop="declareType"
        label="申报类型"
        :formatter="formatter"
        width="100">
      </el-table-column>
      <el-table-column
        prop="applyType"
        label="申请类型"
        :formatter="formatter"
        width="100">
      </el-table-column>      
      <el-table-column
        prop="status"
        label="状态"
        :formatter="formatter"
        width="100">
      </el-table-column>
      <el-table-column
        prop="projectName"
        label="项目名称"
        :formatter="formatter"
        width="100">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-button @click="edit(scope.$index,scope.row)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top:15px;">
      <el-pagination
        @current-change="handleCurrentChange"
        background
        :current-page="searchForm.pagingQuery.pageIndex"
        :page-size="20"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        multipleSelection:[],
        Dictions:{
          declaration_type:[],
          order_project_type:[],
          bsorder_draft_status:[],
          order_apply_type:[]
        },//所有的字典
        loading:false,
        currentPage:1,
        total:0,
        tableLoading:false,
        searchForm:{
          condition:{
            parentClientId:'',
            provinceNoList:[],
            provinceObject:[],
            clientId:'',
            date:'',
            endTime:'',
            startTime:'',
            pCodeList:[],
            shipToName:'',
            draftNo:'',
            remark:'',
            createBy:'',
            status:4,//（0:待保存，1:已创建，2:处理中，3:已提交，4:已驳回）
            orderType:'SF'
          },          
          pagingQuery:{
            pageIndex:1,
            pageSize:20
          }
        },
        tableData: [
        ]
      }
    },
    watch:{
      'searchForm.condition.date':function(val){
        if(!val){
          this.searchForm.condition.startTime = '';
          this.searchForm.condition.endTime = '';
        }
        else{
          this.searchForm.condition.startTime = val[0];
          this.searchForm.condition.endTime = val[1];
        }
      },
      "searchForm.condition.provinceObject":function(val){
        let datas = [];
        val.map(item=>{
          if(item.code !='999')
            datas.push(item.code)
        })
        this.searchForm.condition.provinceNoList = datas;
      }
    },
    methods: {
      resetForm(){
        this.searchForm = {
          condition:{
            parentClientId:'',
            provinceNoList:[],
            provinceObject:[],
            clientId:'',
            date:'',
            endTime:'',
            startTime:'',
            pCodeList:[],
            shipToName:'',
            draftNo:'',
            remark:'',
            createBy:'',
            status:4,//（0:待保存，1:已创建，2:处理中，3:已提交，4:已驳回）
            orderType:'SF'
          },          
          pagingQuery:{
            pageIndex:1,
            pageSize:20
          }
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(val);
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='projectName'){
          this.Dictions.order_project_type.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }       
        else if(column.property =='declareType'){
          this.Dictions.declaration_type.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })  
        }
        else if(column.property =='applyType'){
          this.Dictions.order_apply_type.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })  
        }
        else if(column.property =='status'){
          this.Dictions.bsorder_draft_status.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })  
        }
        else if(column.property =='createTime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss");
        }
        return txt;
      },
      edit(ind,row){
        this.gotoUrl('/frame/order/backendOrder/backOrderEdit/'+row.id+'/SF')
      },
      downLoad(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        delete data.pagingQuery;
        thiz.$tupHttp(thiz,'order/exportDrafts','POST',data,{Accept: '*/*'},'',true).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '文件已加入下载队列，稍后前往 "基础设置-内容管理-导出下载" 下载文件'
          });
        },res=>{
          thiz.loading = false;
        })
      },
      submitDraft(){
        let thiz = this;
        thiz.loading = true;
        let data = {
          orderType:'SF',
          plusOrMinusAdjust:''
        }
        thiz.$tupHttp(thiz,'order/submitDrafts','POST',data).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '已提交'+res.body.extra+'条草稿，后台正在处理当中。'
          });
        },res=>{
          thiz.loading = false;
        })
      },
      deleteData(){
        let thiz = this;
        thiz.loading = true;
        let data = [];
        this.multipleSelection.map(item=>{
          data.push(item.id)
        })
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          thiz.$tupHttp(thiz,'order/deleteDrafts','POST',data).then(res=>{
            thiz.loading = false;
            thiz.loadData();
          },res=>{
            thiz.loading = false;
          }) 
        }).catch(() => {    
          thiz.loading = false;  
        });
        
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
      loadData(isSearch){
        let thiz = this;
        thiz.tableLoading = true;
        thiz.loading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        this.$tupHttp(this,'order/queryDrafts','POST',thiz.searchForm).then(res=>{
          thiz.tableData = res.body.models
          thiz.tableLoading = false;
          thiz.loading = false;
          thiz.total = res.body.pageInfo.total ? res.body.pageInfo.total : 0;
        },res=>{
          thiz.tableLoading = false;
          thiz.loading = false;
        })
      },
      loadDictions(){
        let thiz = this;
        let params = ["bsorder_draft_status","declaration_type","order_apply_type","order_project_type"];
        this.$baseData.getDicts(this,params,function(data){
          thiz.Dictions = data;
        });
      }
    },
    mounted(){
      this.loadDictions();
      this.loadData(true)
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
