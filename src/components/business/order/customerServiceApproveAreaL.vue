<template>
  <div>
    <el-form  :model="searchForm" label-width="140px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="区域">            
            <tup-arae-select type="area" size="mini" v-model="searchForm.areasObject"  ></tup-arae-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="省办">            
            <tup-arae-select v-model="searchForm.provinceObject"></tup-arae-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="分销商编号">
            <el-input v-model="searchForm.sDbStr" size="mini"  placeholder="分销商编号"></el-input>
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
          <el-form-item label="原订单编号">
            <el-input v-model="searchForm.orderNo" size="mini"  placeholder="原订单编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申报类型">
            <el-select v-model="searchForm.typeList" multiple size="mini" clearable filterable  placeholder="请选择">
              <el-option label="到货残次" value="4"></el-option>
              <el-option label="质量评估" value="6"></el-option>
            </el-select>
          </el-form-item>
        </el-col>   
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">          
          <el-form-item label="申报产品编号">
            <el-input v-model="searchForm.productNo" size="mini" placeholder="申报产品编号"></el-input>
          </el-form-item>
        </el-col>
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
        <el-button icon="el-icon-check" @click="dialogVisible = true" :disabled="multipleSelection.length == 0" :loading="loading" size="mini" type="success">批量审核</el-button>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="loadData(true)">查询</el-button>
        <el-button  icon="el-icon-refresh" type="primary" size="mini" @click="resetForm">重置</el-button>
        <el-button icon="el-icon-download" @click="downLoad" :loading="loading" size="mini" type="primary">{{multipleSelection.length == 0 ? '导出':'导出勾选订单'}}</el-button>
        <el-button icon="el-icon-video-pause" @click="pause" :disabled="multipleSelection.length == 0" :loading="loading" size="mini" type="success">批量暂停</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="tableLoading"
      style="width: 100%;"
      height="450"
      highlight-current-row
      @sort-change="sortChange"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        fixed="left"
        width="55">
      </el-table-column>
      <el-table-column
        type="index"
        label="序号"
        width="50">
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
        prop="clientName"
        label="客户名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="pOrganName2"
        label="专卖店名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="type"
        label="申报类型"
        :formatter="formatter"
        width="100">
      </el-table-column>
      <el-table-column
        prop="newOrderNo"
        label="售后订单编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="declarationProductNo"
        label="申报产品编号(客户)"
        sortable
        width="160">
      </el-table-column>
      <el-table-column
        prop="declarationProductName"
        label="申报产品名称(客户)"
        width="150">
      </el-table-column>
      <el-table-column
        prop="declarationQuantity"
        label="申报数量(客户)"
        width="120">
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
        label="申报产品编号(物流)"
        sortable
        width="160">
      </el-table-column>
      <el-table-column
        prop="expressDeclarationProductName"
        label="申报产品名称(物流)"
        width="150">
      </el-table-column>
      <el-table-column
        prop="expressDeclarationQuantity"
        label="申报数量(物流)"
        width="120">
      </el-table-column>
      <el-table-column
        prop="serviceDeclarationProductNo"
        label="申报产品编号(客服)"
        width="150">
      </el-table-column>
      <el-table-column
        prop="serviceDeclarationProductName"
        label="申报产品名称(客服)"
        width="150">
      </el-table-column>
      <el-table-column
        prop="serviceDeclarationQuantity"
        label="申报数量(客服)"
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
        prop="isEqualExchange"
        label="是否等价交换"
        width="120">        
        <template slot-scope="scope">
          {{scope.row.isEqualExchange == 1 ? '是':'否'}}
        </template>
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
        prop=""
        label="客户退回时间"
        width="150">
      </el-table-column>      
      <el-table-column
        prop="status"
        label="审批状态"
        :formatter="formatter"
        width="120">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        width="120">
      </el-table-column>   
      <el-table-column
        prop="remark"
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="detail(scope.$index,scope.row)" type="text" size="small">审核</el-button>
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
    <el-dialog title="审核"  width="25%" top="15%" :visible.sync="dialogVisible">
      <el-form :model="comForm" ref="comForm" label-width="60px">
        <el-form-item label="通过" prop="status">
            <el-switch v-model="comForm.status" :active-value="3" :inactive-value="4"></el-switch>
          </el-form-item> 
        <el-form-item label="理由" v-if="comForm.status==4" prop="reason">
          <el-select v-model="comForm.reason" size="mini" clearable filterable  placeholder="请选择">
            <el-option
              v-for="item in Dictions.declaration_reject_reason"
              :key="item.dictValue"
              :label="item.dictName"
              :value="item.dictValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="comForm.remark"  placeholder="备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" :loading="loading" @click="saveData">确认</el-button>
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name:'keepAlive-order-customerServiceApproveL',
    data() {
      return {
        Dictions:{
          declaration_status:[],
          declaration_type:[],
          declaration_reject_reason:[]
        },//所有的字典
        multipleSelection:[],
        loading:false,
        dialogVisible:false,
        currentPage:1,
        total:0,
        tableLoading:false,
        comForm:{
          status:3,
          remark:'',
          reason:''
        },
        searchForm:{   
          areasObject:[],
          sRegion:[],
          provinceObject:[],
          sProvince:[],
          isSuspend:'',
          productNo:'',
          productName:'',
          sDbStr:'',       
          date:'',
          startTime:'',
          endTime:'',
          clientId:'',
          equalExchangeProduct:'',
          isFactoryExpress:0,
          orderNo:'',
          isNeedPrivilegeController:1,
          sbno:'',
          type:'',
          status:'',
          typeList:[],
          statusList:[1],
          declarationIds:[],//勾选的数据
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
        if(val.path == '/frame/order/customerServiceApproveAreaL'){
          if(this.total > 0){
            //有请求过数据需要重新加载列表
            this.loadData()
          }
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
      "searchForm.areasObject":function(val){
        let datas = [];
        val.map(item=>{
          if(item.code !='999')
            datas.push(item.code)
        })
        this.searchForm.sRegion = datas;
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
        this.loadData()
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
          areasObject:[],
          sRegion:[],
          provinceObject:[],
          sProvince:[],
          isSuspend:'',
          productNo:'',
          productName:'',
          sDbStr:'',
          date:'',
          startTime:'',
          endTime:'',
          clientId:'',
          equalExchangeProduct:'',
          isFactoryExpress:0,
          orderNo:'',
          sbno:'',
          type:'',
          status:'',
          typeList:[],
          statusList:[1],
          isNeedPrivilegeController:1,
          declarationIds:this.searchForm.declarationIds,
          pagingQuery:{
            pageIndex:1,
            pageSize:this.searchForm.pagingQuery.pageSize
          }
        }
      },
      pause(){
        let thiz = this;
        thiz.loading = true;
        let data = [];
        this.multipleSelection.map(item=>{
          data.push(item.id)
        })
        thiz.$tupHttp(thiz,'declaration/suspendDeclaration','POST',data).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '操作成功'
          });
          thiz.dialogVisible = false;
          thiz.loadData();
        },res=>{
          thiz.loading = false;
        })
      },
      saveData(){
        let thiz = this;
        if(this.comForm.reason == 7 && !this.comForm.remark){
          thiz.$notify.error({
            title: '错误提示',
            message: '备注需要填写'
          });
          return;
        }
        thiz.loading = true;
        let data = [];
        this.multipleSelection.map(item=>{
          data.push({
            id:item.id,
            reason:this.comForm.reason,
            remark:this.comForm.remark,
            status:this.comForm.status,
            expressDeclarationProductNo:item.declarationProductNo,
            expressDeclarationProductName:item.declarationProductName,
            expressDeclarationQuantity:item.declarationQuantity,
            expressDeclarationUnit:item.declarationUnit,
            expressDeclarationReason:item.description
          })
        })
        thiz.$tupHttp(thiz,'declaration/updateDeclaration','POST',data).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '操作成功'
          });
          thiz.comForm = {
            status:3,
            remark:'',
            reason:''
          }
          thiz.dialogVisible = false;
          thiz.loadData();
        },res=>{
          thiz.loading = false;
        })
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
        else if(column.property =='logisticsAuditTime' || column.property =='serviceAuditTime' || column.property =='seniorServiceAuditTime'){
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
        this.gotoUrl('/frame/order/csOrderDetailLogistics/'+row.id+'/area')
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
        this.$tupHttp(this,'declaration/getListByPage','POST',thiz.searchForm).then(res=>{
          thiz.tableData = res.body.models
          thiz.tableLoading = false;
          thiz.total = res.body.pageInfo.total ? res.body.pageInfo.total : 0;          
        },res=>{
          thiz.tableLoading = false;
        })
      },
      loadDictions(){
        let thiz = this;
        let params = ["declaration_status","declaration_type","declaration_reject_reason"];
        this.$baseData.getDicts(this,params,function(data){
          thiz.Dictions = data;
        });
      }
    },
    mounted(){
      this.loadDictions();
      this.loadData()
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
