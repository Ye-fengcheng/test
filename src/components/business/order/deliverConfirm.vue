<template>
  <div>
    <el-form  :model="searchForm" label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="地区">            
            <tup-arae-select v-model="searchForm.provinceObject"></tup-arae-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="分销商编号">
            <el-input v-model="searchForm.parentClientId" size="mini"  placeholder="分销商编号"></el-input>
          </el-form-item>          
        </el-col>
        <el-col :span="8">          
          <el-form-item label="专卖店编号">
            <el-input v-model="searchForm.clientId" size="mini" placeholder="专卖店编号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="订单编号">
            <el-input v-model="searchForm.orderNo" size="mini"  placeholder="订单编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="订单类型">
            <el-select v-model="searchForm.orderTypeList" size="mini" multiple  placeholder="请选择">
              <el-option
                v-for="item in Dictions.order_type1"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>        
        <el-col :span="8">
          <el-form-item label="发货确认单编号">
            <el-input v-model="searchForm.deliverConfirmNo" size="mini" placeholder="发货确认单编号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">        
        <el-col :span="8">
          <el-form-item label="JDE单号为空">
            <el-select v-model="searchForm.jdeOrderNoIsEmpty" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>              
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
          <el-form-item label="JDE单号">
            <el-input v-model="searchForm.jdeOrderNo" size="mini" placeholder="JDE单号"></el-input>
          </el-form-item>
        </el-col> -->
        <el-col :span="8">
          <el-form-item label="操作状态">
            <el-select v-model="searchForm.isExport" size="mini" placeholder="请选择">
              <el-option
                v-for="item in Dictions.export_status"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>        
        <el-col :span="8">
          <el-form-item label="是否自付运费">
            <el-select v-model="searchForm.isSelfPayFreight" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="否" :value="0"></el-option>
              <el-option label="是" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>  
      </el-row>
      <el-row :gutter="5">           
        <el-col :span="8">
          <el-form-item label="财务审核日期">
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
          <el-form-item label="订单备注">
            <el-input v-model="searchForm.orderRemark" size="mini" placeholder="订单备注"></el-input>
          </el-form-item>   
        </el-col>
        <el-col :span="8">
          <el-form-item label="制单人编号">
            <el-input v-model="searchForm.createBy" size="mini" placeholder="制单人编号"></el-input>
          </el-form-item>   
        </el-col>
      </el-row>
      <el-row :gutter="5">   
        <el-col :span="8">
          <el-form-item label="制单人名称">
            <el-input v-model="searchForm.createByName" size="mini" placeholder="制单人名称"></el-input>
          </el-form-item>   
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="loadData(true)">查询</el-button>
        <el-button  icon="el-icon-refresh" type="primary" size="mini" @click="resetForm">重置</el-button>
        <el-button icon="el-icon-download" @click="downLoad(2)" :loading="loading" size="mini" type="primary" v-show="multipleSelection.length > 0">导出选中订单</el-button>
        <el-button icon="el-icon-download" @click="downLoad(1)" :loading="loading" size="mini" type="primary" v-show="multipleSelection.length == 0 ">导出</el-button>
        <el-button icon="el-icon-download" @click="downLoad(0)" :loading="loading" size="mini" type="success">导出不处理</el-button>
        <el-button size="mini" @click="gotoUrl('/frame/order/deliverConfirmLog')" type="text">操作日志</el-button>
        <el-button type="primary" :loading="loading"  icon="el-icon-refresh" size="mini" @click="reLoad">更新运费</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="tableLoading"
      style="width: 100%;"
      height="450"
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
        prop="parentClientId"
        label="分销商编号"
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
        width="120">
      </el-table-column>
      <el-table-column
        prop="clientName"
        label="专卖店名称"
        width="150">
      </el-table-column>
      <el-table-column
        prop="cityNo"
        label="城市"
        width="100">
      </el-table-column>
      <el-table-column
        prop="jdeOrderNo"
        label="JDE单号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="auditbyClientRemark"
        label="客服审核备注"
        width="100">
      </el-table-column>
      <el-table-column
        prop="orderRemark"
        label="订单备注"
        width="100">
      </el-table-column>
      <el-table-column
        prop="region"
        label="区域"
        width="80">
      </el-table-column>
      <el-table-column
        prop="province"
        label="省办"
        width="80">
      </el-table-column>
      <el-table-column
        prop="shipTo"
        label="送货对象编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="shipToName"
        label="送货对象名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="discountvalue"
        label="分销商折扣率"
        width="120">
        <template slot-scope="scope"> 
          {{scope.row.discountvalue ? scope.row.discountvalue+'%':''}}
        </template>
      </el-table-column>
      <el-table-column
        prop="auditbyFinanceTime"
        label="财务审核日期"
        :formatter="formatter"
        width="140">
      </el-table-column>      
      <el-table-column
        prop="orderNo"
        label="FMS订单号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="orderType"
        :formatter="formatter"
        label="订单类型"
        width="100">
      </el-table-column>
      <el-table-column
        prop="pGradeType"
        label="分销商层级"
        width="120">
      </el-table-column>
      <el-table-column
        prop="couponTotalAmount"
        label="优惠后零售金额"
        width="120">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.couponTotalAmount,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="isSelfPayFreight"
        label="是否自付运费"
        width="120">
        <template slot-scope="scope"> 
          {{scope.row.isSelfPayFreight == 1 ? '自付运费': scope.row.isSelfPayFreight == 0 ? '否' : ''}}
        </template>
      </el-table-column>
      <el-table-column
        prop="isExport"
        label="操作状态"
        :formatter="formatter"
        width="120">
      </el-table-column>
      <el-table-column
        prop="deliverConfirmNo"
        label="发货确认单编号"
        width="120">      
      </el-table-column>
      <el-table-column
        prop="exportUser"
        label="制单人"
        width="120">      
        <template slot-scope="scope"> 
          {{scope.row.createBy}} - {{scope.row.createByName}}
        </template>
      </el-table-column>
      <el-table-column
        prop="exportUser"
        label="操作人"
        width="120">      
      </el-table-column>
      <el-table-column
        prop="exportTime"
        label="导出处理时间"
        :formatter="formatter"
        width="120">      
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
    data() {
      return {
        Dictions:{
          order_type:[],
          order_type1:[],
          export_status:[]
        },//所有的字典
        multipleSelection:[],
        loading:false,
        currentPage:1,
        total:0,
        tableLoading:false,
        searchForm:{      
          createBy:'',
          createByName:'',
          orderBy:[],
          orderRemark:'',   
          provinceNoList:[],
          provinceObject:[],
          jdeOrderNoIsEmpty:'',
          clientId:'',
          createBy:'',
          date:'',
          startTime:'',
          endTime:'',
          deliverConfirmNo:'',
          isExport:'0',
          isSelfPayFreight:'',
          orderNo:'',
          jdeOrderNo:'',
          orderType:'',
          orderTypeList:[],
          parentClientId:'',
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
      "searchForm.provinceObject":function(val){
        let datas = [];
        val.map(item=>{
          if(item.code !='999')
            datas.push(item.code)
        })
        this.searchForm.provinceNoList = datas;
      }
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(val);
      },
      resetForm(){
        this.searchForm = {
          createBy:'',
          createByName:'',
          orderRemark:'',
          provinceNoList:[],
          provinceObject:[],
          clientId:'',
          createBy:'',
          date:'',
          startTime:'',
          endTime:'',
          deliverConfirmNo:'',
          isExport:'0',
          isSelfPayFreight:'',
          orderNo:'',
          jdeOrderNo:'',
          orderType:'',
          orderTypeList:[],
          parentClientId:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:this.searchForm.pagingQuery.pageSize
          }
        }
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='orderType'){
          this.Dictions.order_type.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })  
        }
        else if(column.property =='isExport'){
          this.Dictions.export_status.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })  
        }        
        else if(column.property =='createtime' || column.property =='auditbyClientTime' 
        || column.property =='auditbyFinanceTime' || column.property =='returntime' || column.property =='exportTime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss");
        }
        return txt;
      },
      downLoad(type){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        if(type == 2){
          let arr = [];
          this.multipleSelection.map(item=>{
            arr.push(item.orderNo)
          })
          data.orderNoList = arr;
          data.isHandle = 1;
        }
        else if(type==0){
          let arr = [];
          this.multipleSelection.map(item=>{
            arr.push(item.orderNo)
          })
          data.orderNoList = arr;
          data.isHandle = 0;
        }
        else{
          data.isHandle = type
        }
        thiz.$tupHttp(thiz,'order/deliverConfirm/exportDeliverConfirmList','POST',data,{Accept: '*/*'},'',true).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '文件已加入下载队列，稍后前往 "基础设置-内容管理-导出下载" 下载文件'
          });
        },res=>{
          thiz.loading = false;
        })
      },
      reLoad(){
        let thiz = this;
        thiz.$tupHttp(thiz,'order/deliverConfirm/calIsSelfPayFreight','GET').then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '更新成功'
          });
          thiz.loadData()
        },res=>{
          thiz.loading = false;
        })
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
      handleSizeChange(val) {
        this.searchForm.pagingQuery.pageSize = val;
        this.loadData();
      },
      loadData(isSearch){
        let thiz = this;
        thiz.tableLoading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        this.$tupHttp(this,'order/deliverConfirm/getDeliverConfirmList','POST',thiz.searchForm).then(res=>{
          thiz.tableData = res.body.models
          thiz.tableLoading = false;
          thiz.total = res.body.pageInfo.total ? res.body.pageInfo.total : 0;          
        },res=>{
          thiz.tableLoading = false;
        })
      },
      loadDictions(){
        let thiz = this;
        let params = ["order_type","export_status"];
        this.$baseData.getDicts(this,params,function(data){
          data.order_type1 = [];
          if(data.order_type){
            data.order_type.map(item=>{
              if(item.dictValue != 'TZ')
                data.order_type1.push(item)
            })
          }
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
</style>
