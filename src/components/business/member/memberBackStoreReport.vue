<template>
  <div>
    <el-form  :model="searchForm" label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="地区">            
            <tup-arae-meter-select v-model="searchForm.provinceObject"></tup-arae-meter-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="专卖店编号">
            <el-input v-model="searchForm.jdeCode" size="mini" placeholder="专卖店编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="分销商编号">
            <el-input v-model="searchForm.distributor" size="mini" placeholder="分销商编号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">    
          <el-form-item label="分销商名称">
            <el-input v-model="searchForm.distributorName" size="mini" placeholder="分销商名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="专卖店名称">
            <el-input v-model="searchForm.storeName" size="mini" placeholder="专卖店名称"></el-input>
          </el-form-item>
        </el-col>   
        <el-col :span="8">
          <el-form-item label="财务月">
            <el-date-picker
              style="width:100%"
              v-model="searchForm.reportMonth"
              value-format="yyyyMM"
              size="mini"
              type="month"
              placeholder="选择月">
            </el-date-picker>
          </el-form-item>
        </el-col>     
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="FS">
            <el-input v-model="searchForm.fs" size="mini" placeholder="FS"></el-input>
          </el-form-item>
        </el-col>       
      </el-row>      
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" :loading="loading" size="mini" @click="loadData(true)">查询</el-button>
        <el-button  icon="el-icon-refresh" type="primary" size="mini" @click="resetForm">重置</el-button>
        <el-button icon="el-icon-download" @click="downLoad11" :loading="loading" size="mini" type="primary">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      ref="orderTable"
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
        prop="reportMonth"
        label="财务月"
        width="100">
      </el-table-column>    
      <el-table-column
        prop="regionCode"
        label="区域编码"
        width="120">
      </el-table-column>          
      <el-table-column
        prop="regionName"
        label="区域"
        width="80">
      </el-table-column>
      <el-table-column
        prop="provinceCode"
        label="省办编码"
        width="120">
      </el-table-column>
      <el-table-column
        prop="provinceName"
        label="省办"
        width="80">
      </el-table-column>
      <el-table-column
        prop="fsCode"
        label="FS编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="fsName"
        label="FS姓名"
        width="120">
      </el-table-column>
      <el-table-column
        prop="distributorCode"
        label="分销商编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="distributorName"
        label="分销商名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="storeCode"
        label="专卖店编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="storeName"
        label="专卖店名称"
        width="120">
      </el-table-column>      
      <el-table-column
        prop="comConsumeTotalMonth"
        label="回店消费普会数（当月）"
        width="150">
      </el-table-column>
      <el-table-column
        prop="comTotalOneMonth"
        label="活跃普通会员总数（注册1个月内）"
        width="150">
      </el-table-column>
      <el-table-column
        prop="comTotalThreeMonth"
        label="活跃普通会员总数（注册3个月内）"
        width="150">
      </el-table-column>
      <el-table-column
        prop="consumeMonthPro"
        label="当月回店消费比例（1年内）"
        width="150">
      </el-table-column>
      <el-table-column
        prop="vipActiveTotalSixMonth"
        label="活跃VIP总数（注册6个月）"
        width="150">
      </el-table-column>
      <el-table-column
        prop="vipActiveTotalThreeMonth"
        label="活跃VIP总数（注册3个月）"
        width="150">
      </el-table-column>
      <el-table-column
        prop="vipConsumeTotalMonth"
        label="回店消费总数（当月）"
        width="150">
      </el-table-column>
      <el-table-column
        prop="vipConsumeTotalYear"
        label="回店消费总数（1年内）"
        width="150">
      </el-table-column>
      <el-table-column
        prop="vipMonthAlonePro"
        label="VIP回店月单产数"
        width="150">
      </el-table-column>
      <el-table-column
        prop="vipPurchaseAmount"
        label="VIP回店购买金额"
        width="150">
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
          provinceObject:[],
          provinceCode:'',
          reportMonth:'',
          regionCode:'',
          dm:'',
          fs:'',
          distributor:'',
          distributorName:'',
          jdeCode:'',
          storeName:'',         
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
      "searchForm.provinceObject":function(arr){
        let val = arr[0]
        if(val.code == '00'){
          this.searchForm.regionCode = ''
          this.searchForm.provinceCode = ''
        }
        else {
          if(val.pCitprovincialoffice){
            this.searchForm.provinceCode = val.pCitprovincialoffice
            this.searchForm.regionCode = ''
          }
          else{
            this.searchForm.regionCode = val.pCitregionoffice
            this.searchForm.provinceCode = ''
          }
        }
      }
    },
    methods: {
      resetForm(){
        this.searchForm = {
          provinceObject:[],
          provinceCode:'',
          reportMonth:'',
          regionCode:'',
          dm:'',
          fs:'',
          distributor:'',
          distributorName:'',
          jdeCode:'',
          storeName:'',         
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
        this.gotoUrl('/frame/order/backendOrder/backOrderEdit/'+row.id+'/TS')
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
          orderType:'TS',
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
        this.$tupHttp(this,'benefit/coupon/returnStoreAnalysis/getDetailList','POST',thiz.searchForm).then(res=>{
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
        let params = ["bsorder_draft_status","declaration_type","order_project_type","order_apply_type"];
        this.$baseData.getDicts(this,params,function(data){
          thiz.Dictions = data;
        });
      }
    },
    mounted(){
      this.loadDictions();
      // this.loadData(true)
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
