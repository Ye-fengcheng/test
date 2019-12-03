<template>
  <div>
    <el-button icon="el-icon-close" :disabled="multipleSelection.length==0" size="mini" :loading="loading" @click="deleteData" type="danger">批量删除</el-button>
    <el-button icon="el-icon-check" :disabled="multipleSelection.length==0" size="mini" :loading="loading" @click="submitDate" type="primary">提交草稿</el-button>
    <el-button size="mini" @click="$router.go(-1)">返回</el-button>
    <el-table
      :data="tableData"
      ref="orderTable"
      v-loading="tableLoading"
      style="width: 100%;"
      height="450"
      :summary-method="getSummaries"
      show-summary
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
        prop="clientProcessResult"
        label="客户/送货对象处理结果"
        width="200">
      </el-table-column>
      <el-table-column
        prop="prdProcessResult"
        label="产品处理结果"
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
            importRecordId:this.$route.params.id
          },          
          pagingQuery:{
            pageIndex:1,
            pageSize:20
          }
        },
        tableData: [
        ],
        summaries:{}
      }
    },
    watch:{
    },
    methods: {
      getSummaries(param) {
        let thiz = this;
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '统计';
            return;
          }
          const values = column.property ? thiz.summaries[column.property] : '-';
          //console.log(column.property+':'+values)
          if (!!values || values == 0) {            
            if(values == '-')
              sums[index] = '-'
            else
              sums[index] = column.property=='deliverQty' ? values : thiz.$util.formatThousand(values,2);
          } else {
            sums[index] = '';
          }
        });
        return sums;
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
      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(val);
      },
      submitDate(){
        let thiz = this;
        thiz.loading = true;
        let data = {
          orderType:'TS',
          plusOrMinusAdjust:'',
          draftList:this.multipleSelection
        }
        thiz.$tupHttp(thiz,'order/updateDrafts','POST',data).then(res=>{
          thiz.loading = false;
          thiz.loadData();
          thiz.$notify.success({
            title: '成功提示',
            message: '已提交'+this.multipleSelection.length+'条草稿，后台正在处理当中。'
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
      edit(ind,row){
        this.gotoUrl('/frame/order/backendOrder/backOrderEdit/'+row.id+'/TS')
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
        this.$tupHttp(this,'order/getRelateDrafts','POST',thiz.searchForm).then(res=>{
          thiz.tableData = res.body.models
          thiz.tableLoading = false;
          thiz.loading = false;
          thiz.total = res.body.pageInfo.total ? res.body.pageInfo.total : 0;
          thiz.summaries = res.body.extra ? res.body.extra : {}
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
