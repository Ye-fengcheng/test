<template>
  <div>
    <el-form  :model="searchForm" label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="区域">            
            <tup-arae-select type="area" size="mini" v-model="searchForm.areaObject"  ></tup-arae-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="省办">            
            <tup-arae-select v-model="searchForm.provinceObject"></tup-arae-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="上级分销商编号">
            <el-input v-model="searchForm.sDbStr" size="mini" placeholder="分销商编号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="分销商/专卖店编号">
            <el-input v-model="searchForm.organId" size="mini" placeholder="专卖店编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">          
          <el-form-item label="分销商/专卖店名称">
            <el-input v-model="searchForm.organName" size="mini" placeholder="客户名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="专卖店状态">
            <el-select v-model="searchForm.outletStatus" size="mini" clearable filterable  placeholder="请选择">
              <el-option
                v-for="item in Dictions.outlet_status"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="分销商状态">
            <el-select v-model="searchForm.outletStatus2" size="mini" clearable filterable  placeholder="请选择">
              <el-option
                v-for="item in Dictions.distributor_status"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col> 
      </el-row>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="loadData(true)">查询</el-button>
        <el-button icon="el-icon-refresh" type="primary" size="mini" @click="resetForm">重置</el-button>
        <el-button icon="el-icon-download" @click="downLoad" :loading="loading" size="mini" type="primary">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="tableLoading"
      style="width: 100%;"
      height="450"
      highlight-current-row
      :default-sort = "{prop: 'date', order: 'descending'}">
      <el-table-column
        type="index"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="pCitregionoffice"
        label="区域"
        width="80">
      </el-table-column>
      <el-table-column
        prop="pCitprovincialoffice"
        label="省办"
        sortable
        width="80">
      </el-table-column>
      <el-table-column
        prop="pCitparentno"
        label="上级分销商编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="pCitparent"
        label="上级分销商名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="pUid"
        label="分销商/专卖店编号"
        width="150">
      </el-table-column>
      <el-table-column
        prop="pOrganName2"
        label="分销商/专卖店名称"
        width="150">
      </el-table-column>
      <el-table-column
        prop="pDiscountvalue"
        label="折扣率"
        width="100">
        <template slot-scope="scope"> 
          {{scope.row.pDiscountvalue}}%
        </template>
      </el-table-column>
      
      <el-table-column
        prop="pOutletStatus"
        label="状态"
        width="100">
      </el-table-column>
      <el-table-column
        prop=""
        label="账户额度"
        width="100">
        <template slot-scope="scope"> 
          {{scope.row.userAccount ? $util.formatThousand((scope.row.userAccount.balanceReserved + scope.row.userAccount.balanceAvailable)/100,2) : ''}}
        </template>
      </el-table-column>
      <el-table-column
        prop="userAccount.balanceReserved"
        label="账户冻结余额"
        width="100">
        <template slot-scope="scope"> 
          {{scope.row.userAccount ? $util.formatThousand(scope.row.userAccount.balanceReserved/100,2) : ''}}
        </template>
      </el-table-column>
      <el-table-column
        prop="userAccount.balanceAvailable"
        label="账户可用余额"
        width="100">
        <template slot-scope="scope"> 
          {{scope.row.userAccount ? $util.formatThousand(scope.row.userAccount.balanceAvailable/100,2) : ''}}
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="折扣差A额度"
        width="100">
        <template slot-scope="scope"> 
          {{scope.row.userAccount ? $util.formatThousand((scope.row.userAccount.disReserved + scope.row.userAccount.disAvailable)/100,2) : ''}}
        </template>
      </el-table-column>
      <el-table-column
        prop="userAccount.disReserved"
        label="折扣差A冻结余额"
        width="100">
        <template slot-scope="scope"> 
          {{scope.row.userAccount ? $util.formatThousand(scope.row.userAccount.disReserved/100,2) : ''}}
        </template>
      </el-table-column>
      <el-table-column
        prop="userAccount.disAvailable"
        label="折扣差A可用余额"
        width="100">
        <template slot-scope="scope"> 
          {{scope.row.userAccount ? $util.formatThousand(scope.row.userAccount.disAvailable/100,2) : ''}}
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="折扣差B额度"
        width="100">
        <template slot-scope="scope"> 
          {{scope.row.userAccount ? $util.formatThousand((scope.row.userAccount.disbReserved + scope.row.userAccount.disbAvaiable)/100,2) : ''}}
        </template>
      </el-table-column>
      <el-table-column
        prop="userAccount.disbReserved"
        label="折扣差B冻结余额"
        width="100">
        <template slot-scope="scope"> 
          {{scope.row.userAccount ? $util.formatThousand(scope.row.userAccount.disbReserved/100,2) : ''}}
        </template>
      </el-table-column>
      <el-table-column
        prop="userAccount.disbAvaiable"
        label="折扣差B可用余额"
        width="100">
        <template slot-scope="scope"> 
          {{scope.row.userAccount ? $util.formatThousand(scope.row.userAccount.disbAvaiable/100,2) : ''}}
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="折扣差C额度"
        width="100">
        <template slot-scope="scope"> 
          {{scope.row.userAccount ? $util.formatThousand((scope.row.userAccount.discReserved + scope.row.userAccount.discAvaiable)/100,2) : ''}}
        </template>
      </el-table-column>
      <el-table-column
        prop="userAccount.discReserved"
        label="折扣差C冻结余额"
        width="100">
        <template slot-scope="scope"> 
          {{scope.row.userAccount ? $util.formatThousand(scope.row.userAccount.discReserved/100,2) : ''}}
        </template>
      </el-table-column> 
      <el-table-column
        prop="userAccount.discAvaiable"
        label="折扣差C可用余额"
        width="100">
        <template slot-scope="scope"> 
          {{scope.row.userAccount ? $util.formatThousand(scope.row.userAccount.discAvaiable/100,2) : ''}}
        </template>
      </el-table-column> 
      <el-table-column
        prop=""
        label="活动类优惠券额度"
        width="100">
        <template slot-scope="scope"> 
          {{scope.row.userAccount ? $util.formatThousand((scope.row.userAccount.disdReserved + scope.row.userAccount.disdAvailable)/100,2) : ''}}
        </template>
      </el-table-column>
      <el-table-column
        prop="userAccount.discReserved"
        label="活动类优惠券冻结余额"
        width="100">
        <template slot-scope="scope"> 
          {{scope.row.userAccount ? $util.formatThousand(scope.row.userAccount.disdReserved/100,2) : ''}}
        </template>
      </el-table-column> 
      <el-table-column
        prop="userAccount.discAvaiable"
        label="活动类优惠券可用余额"
        width="100">
        <template slot-scope="scope"> 
          {{scope.row.userAccount ? $util.formatThousand(scope.row.userAccount.disdAvailable/100,2) : ''}}
        </template>
      </el-table-column>     
      <el-table-column
        prop="userAccount.deposit"
        label="保证金"
        width="100">
        <template slot-scope="scope"> 
          {{scope.row.userAccount ? $util.formatThousand(scope.row.userAccount.deposit/100,2) : ''}}
        </template>
      </el-table-column>      
      <el-table-column
        prop="userAccount.balamt"
        label="责任金"
        width="100">
        <template slot-scope="scope"> 
          {{scope.row.userAccount ? $util.formatThousand(scope.row.userAccount.balamt/100,2) : ''}}
        </template>
      </el-table-column>
      <el-table-column
        prop="userAccount.creditAvailable"
        label="信用可用额度"
        width="100">
        <template slot-scope="scope"> 
          {{scope.row.userAccount ? $util.formatThousand(scope.row.userAccount.creditAvailable/100,2) : ''}}
        </template>
      </el-table-column>
      <el-table-column
        prop="userAccount.creditReserved"
        label="信用占用额度"
        width="100">
        <template slot-scope="scope"> 
          {{scope.row.userAccount ? $util.formatThousand(scope.row.userAccount.creditReserved/100,2) : ''}}
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
  </div>
</template>

<script>
  export default {
    data() {
      return {
        loading:false,
        currentPage:1,
        tableLoading:false,
        total:0,
        Dictions:{
          outlet_status:[],
          distributor_status:[]
        },//本页面使用的所有字典
        searchForm:{
          outletStatus2:'',
          provinceObject:[],
          areaObject:[],
          sRegion:[],
          sProvince:[],
          organName:'',
          organId:'',
          outletStatus:'',
          sDbStr:'',
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
      "searchForm.areaObject":function(val){
        let datas = [];
        val.map(item=>{
          if(item.code !='999')
            datas.push(item.code)
        })
        this.searchForm.sRegion = datas;
      },
      "searchForm.provinceObject":function(val){
        let datas = [];
        val.map(item=>{
          if(item.code !='999')
            datas.push(item.code)
        })
        this.searchForm.sProvince = datas;
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
      format(num,len){
        num = !num ? 0 : num.toFixed(len?len:0);  
        var reg=/\d{1,3}(?=(\d{3})+$)/g;   
        return (num + '').replace(reg, '$&,');  
      }, 
      resetForm(){
        this.searchForm = {
          outletStatus2:'',
          provinceObject:[],
          areaObject:[],
          sRegion:[],
          sProvince:[],
          organName:'',
          organId:'',
          outletStatus:'',
          sDbStr:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:this.searchForm.pagingQuery.pageSize
          }
        }
      },
      downLoad(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        delete data.pagingQuery;
        thiz.$tupHttp(thiz,'account/export/v1','POST',data).then(res=>{
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
        this.gotoUrl('/frame/terminal/customerInfo/'+row.id)
      },
      loadData(isSearch){
        let thiz = this;
        thiz.tableLoading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        thiz.$tupHttp(thiz,'account/list/v1','POST',thiz.searchForm).then(res=>{
          thiz.tableData = res.body.models;
          thiz.total = res.body.pageInfo ? res.body.pageInfo.total:0
          thiz.tableLoading = false;
        },res=>{
          thiz.tableLoading = false;
        })
      },
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData();
      },
      handleSizeChange(val) {
        this.searchForm.pagingQuery.pageSize = val;
        this.loadData();
      },
      loadDictions(){
        let thiz = this;
        let params = ["outlet_property","outlet_status","distributor_status"];
        this.$baseData.getDicts(this,params,function(data){
          thiz.Dictions = data;
        });
      }
    },
    mounted(){
      //this.loadData();
      this.loadDictions();
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
