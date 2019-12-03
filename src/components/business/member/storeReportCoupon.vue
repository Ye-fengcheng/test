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
            <el-input v-model="searchForm.distributor" size="mini"  placeholder="分销商编号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">    
          <el-form-item label="分销商名称">
            <el-input v-model="searchForm.distributorName" size="mini"  placeholder="分销商名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="专卖店名称">
            <el-input v-model="searchForm.storeName" size="mini"  placeholder="专卖店名称"></el-input>
          </el-form-item>
        </el-col>   
        <el-col :span="8">    
          <el-form-item label="使用时间">
            <el-date-picker
              style="width:100%"
              v-model="searchForm.date"
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
      <!-- <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="DM">
            <el-input v-model="searchForm.dm" size="mini"  placeholder="DM"></el-input>
          </el-form-item>
        </el-col>  
        <el-col :span="8">
          <el-form-item label="FS">
            <el-input v-model="searchForm.fs" size="mini" placeholder="FS"></el-input>
          </el-form-item>
        </el-col>       
      </el-row>  -->     
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
        prop="regionCode"
        label="区域编码"
        width="120">
      </el-table-column>          
      <el-table-column
        prop="regionName"
        label="区域"
        sortable
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
        sortable
        width="80">
      </el-table-column>
      <el-table-column
        prop="distributor"
        label="分销商编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="distributorName"
        label="分销商名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="jdeCode"
        label="专卖店编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="storeName"
        label="专卖店名称"
        width="120">
      </el-table-column>      
      <el-table-column
        prop="useNum"
        label="优惠券使用人次"
        width="120">
      </el-table-column>
      <el-table-column
        prop="orderMoney"
        label="使用优惠券订单金额"
        width="150">
      </el-table-column>
      <el-table-column
        prop="deductionMoney"
        label="优惠券抵用金额"
        width="120">
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
          regionCode:'',
          date:[],
          dm:'',
          fs:'',
          distributor:'',
          distributorName:'',
          endDate:'',
          startDate:'',
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
      'searchForm.date':function(val){
        if(!val){
          this.searchForm.startDate = '';
          this.searchForm.endDate = '';
        }
        else{
          this.searchForm.startDate = val[0];
          this.searchForm.endDate = val[1];
        }
      },
      "searchForm.provinceObject":function(arr){
        let val = arr[0]
        if(val){
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
        else{
          this.searchForm.regionCode = ''
          this.searchForm.provinceCode = ''
        }        
      }
    },
    methods: {
      resetForm(){
        this.searchForm = {
          provinceObject:[],
          provinceCode:'',
          regionCode:'',
          date:'',
          dm:'',
          fs:'',
          distributor:'',
          distributorName:'',
          endDate:'',
          startDate:'',
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
        this.$tupHttp(this,'benefit/coupon/storeReportCoupon','POST',thiz.searchForm).then(res=>{
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
      var newDate = new Date(Date.parse(new Date())).format('yyyy-MM-dd')
      var dateArr = newDate.split('-')
      var lastDate = ''
      console.log(dateArr)
      if (dateArr[2] === '01') {
        var dateYear = ''
        var dateMonth = ''
        if (dateArr[1] === '01') {
          dateYear = parseInt(dateArr[0]) - 1
          dateMonth = '12'
        } else {
          dateYear = parseInt(dateArr[0])
          dateMonth = (parseInt(dateArr[1]) - 1) < 10 ? '0' + (parseInt(dateArr[1]) - 1) : (parseInt(dateArr[1]) - 1)
        }
        newDate = dateYear + '-' + dateMonth + '-01'
        lastDate = new Date(Date.parse(new Date()) - 60 * 60 * 24 * 1000).format('yyyy-MM-dd')
      } else {
        newDate = dateArr[0] + '-' + dateArr[1] + '-01'
        lastDate = new Date(Date.parse(new Date()) - 60 * 60 * 24 * 1000).format('yyyy-MM-dd')
      }
      this.searchForm.date = [newDate, lastDate]
      this.loadDictions();
      //this.loadData(true)
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
