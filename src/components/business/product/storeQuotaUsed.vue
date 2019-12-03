<template>
  <div>
    <el-form  :model="searchForm" label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">                 
        <el-col :span="8">
          <el-form-item label="地区">            
            <tup-arae-select v-model="searchForm.provinceObject" size="mini" ></tup-arae-select>
          </el-form-item>
        </el-col>
        <el-col :span="8"> 
          <el-form-item label="产品编号">
            <el-input-product-code v-model="searchForm.pCode" size="mini" placeholder="产品编号"></el-input-product-code>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="专卖店编号">
            <el-input v-model="searchForm.clientId" size="mini"  placeholder="专卖店编号"></el-input>
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
          <el-form-item label="订单创建时间">
           <el-date-picker
              size="mini"
              v-model="searchForm.date"
              style="width:100%"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              :default-time="['00:00:00', '23:59:59']"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <div style="line-height: 26px;">
          <el-button style="float:left" icon="el-icon-search" type="primary" size="mini" @click="loadData(true)">查询</el-button>
          <el-button style="float:left" icon="el-icon-refresh" type="primary" size="mini" @click="resetForm">重置</el-button>
          <el-button style="float:left" icon="el-icon-download" :loading="loading" size="mini" @click="downLoad()" type="primary">导出</el-button>
        </div>
        </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="tableLoading"
      style="width: 100%;"
      height="450"
      highlight-current-row
      @selection-change="handleSelectionChange"
      :default-sort = "{prop: 'date', order: 'descending'}">
      <el-table-column
        type="index"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="pCode"
        label="产品编号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="pName"
        label="产品名称"
        sortable
        width="250">
      </el-table-column>
      <el-table-column
        prop="clientId"
        label="专卖店编号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="clientName"
        label="专卖店名称"
        width="100">
      </el-table-column>
      <el-table-column
        prop="areaName"
        label="区域"
        width="100">
      </el-table-column>
      <el-table-column
        prop="provinceName"
        label="省办"
        width="100">
      </el-table-column>
      
      <el-table-column
        prop="quotaQty"
        label="配额数量"
        width="150">
      </el-table-column>
      <el-table-column
        prop="remainQty"
        label="剩余配额"
        width="100">
        <template slot-scope="scope">          
          {{scope.row.remainQty}}
        </template>
      </el-table-column>      
      <el-table-column
        prop="mqq"
        label="最低订量"
        width="150">
      </el-table-column>
      <el-table-column
        prop="mustQty"
        label="必定量"
        width="150">
      </el-table-column>
      <el-table-column
        prop="jdeCommit"
        label="JDE占用数"
        sortable
        width="150">
      </el-table-column>
      <el-table-column
        prop="fmsCommit"
        label="FMS承诺数"
        sortable
        width="150">
      </el-table-column>
      <el-table-column
        prop="orderId"
        label="订单编号"
        width="150">
      </el-table-column>
      <el-table-column
        prop="orderStatus"
        label="订单状态"
        :formatter="formatter"
        width="150">
      </el-table-column>
      <el-table-column
        prop="orderCreateTime"
        :formatter="formatter"
        label="订单创建时间"
        width="150">
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top:15px;">
      <el-pagination
        @current-change="handleCurrentChange"
        background
        :current-page="searchForm.pagingQuery.pageIndex"
        :page-size="50"
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
          order_status:[]
        },//所有的字典
        multipleSelection:[],
        loading:false,
        total:0,
        searchForm:{
          pCode:'',
          provinceCodeList:[],
          provinceObject:[],
          orderNo:'',
          date:[],
          endTime:'',
          beginTime:'',
          clientId:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:50
          }
        },
        tableData: [
        ],
        tableLoading:false,
        errorTableData: [
        ],
        dialogVisible:false,
        quotaDialogVisible:false
      }
    },
    watch:{
      "searchForm.provinceObject":function(val){
        let datas = [];
        val.map(item=>{
          if(item.code !='999')
            datas.push(item.code)
        })
        this.searchForm.provinceCodeList = datas;
      },
      'searchForm.date':function(val){
        if(!val){
          this.searchForm.beginTime = '';
          this.searchForm.endTime = '';
        }
        else{
          this.searchForm.beginTime = val[0];
          this.searchForm.endTime = val[1];
        }
      }
    },
    methods: {
      resetForm(){
        this.searchForm = {
          pCode:'',
          provinceCodeList:[],
          provinceObject:[],
          date:[],
          endTime:'',
          beginTime:'',
          orderNo:'',
          clientId:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:50
          }
        }
      },
      saveItem(ind,row){
        let thiz = this;
        this.loading = true;
        thiz.$tupHttp(thiz,'inventory/updateQuotaRuleData','POST',row).then(res=>{
          thiz.loadData()
          thiz.loading = false;
        },res=>{
          thiz.loading = false;
        }) 
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='isSw' || column.property == 'isS2'){
          if(row[column.property]==1)
            txt = '是'
          else
            txt = '否'
        }
        else if(column.property =='orderStatus'){
          this.Dictions.order_status.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })  
        }
        else if(column.property =='orderCreateTime' || column.property == 'endTime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd");
        }
        return txt;
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(val);
      },
      approve(){
        let thiz = this;
        thiz.loading = true;
        let data = [];
        this.multipleSelection.map(item=>{
          data.push(item.id)
        })
        this.$confirm('是否批量审核通过?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          thiz.$tupHttp(thiz,'inventory/updateStatus','POST',{ids:data,status:1}).then(res=>{
            thiz.loading = false;
            thiz.loadData();
          },res=>{
            thiz.loading = false;
          }) 
        }).catch(() => {    
          thiz.loading = false;  
        });
        
      },
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData(val == 1);
      },
      downLoad(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        delete data.pagingQuery;
        thiz.$tupHttp(thiz,'inventory/exportFmsSingleQuotaDetails','POST',data,{},'',true).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '文件已加入下载队列，稍后前往 "基础设置-内容管理-导出下载" 下载文件'
          });
        },res=>{
          thiz.loading = false;
        })
      },
      loadDictions(){
        let thiz = this;
        let params = ["order_status"];
        this.$baseData.getDicts(this,params,function(data){
          thiz.Dictions = data;
        });
      },
      loadData(isSearch){
        let thiz = this;
        if(new Date(thiz.searchForm.endTime).diff(new Date(thiz.searchForm.beginTime)) > 92 || !thiz.searchForm.beginTime){
          thiz.$notify.error({
            title: '错误提示',
            message: '订单创建时间不能超过92天或者为空'
          });
          return ;
        }
        thiz.tableLoading = true;
        if(isSearch){
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
          thiz.total = 0;
        }
        thiz.$tupHttp(thiz,'inventory/selectFmsSingleQuotaDetailByPage','POST',thiz.searchForm).then(res=>{
          thiz.tableData = res.body.models;
          thiz.total = res.body.pageInfo ? res.body.pageInfo.total:0;
          thiz.tableLoading = false;
        },res=>{
          thiz.tableLoading = false;
        })
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
      $('.el-upload__input').hide();
      this.loadDictions()
      this.getFMonth();
      this.$util.onKeyCode(this,'loadData',[true])
    }
  }
</script>
<style scoped>
.itemsTitle{
  font-size: 14px;
  border-bottom: 1px solid #ccc;
}
.demo-form-inline{
  margin-bottom: 10px;
  padding: 25px  25px 0px;
  border-radius: 4px;
  border: 1px solid #eee;
}
.el-input-number--mini {
  width: 110px !important;
}
</style>
