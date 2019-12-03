<template>
  <div>
    <el-form  :model="searchForm" label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="优惠券规则代码">
            <el-input v-model="searchForm.couponId" size="mini" placeholder="优惠券规则代码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="优惠券名称">
            <el-input v-model="searchForm.couponName" size="mini"  placeholder="优惠券名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="类型">
            <el-select v-model="searchForm.type" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="mss" :value="0"></el-option>
              <el-option label="etup" :value="1"></el-option>
            </el-select>
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
        prop="couponId"
        label="优惠券规则代码"
        width="120">
      </el-table-column>
      <el-table-column
        prop="couponName"
        label="优惠券名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="startTime"
        label="优惠券开始时间"
        :formatter="formatter"
        width="120">
      </el-table-column>
      <el-table-column
        prop="endTime"
        label="优惠券结束时间"
        :formatter="formatter"
        width="120">
      </el-table-column>
      <el-table-column
        prop="status"
        label="优惠券状态"
        width="120">
        <template slot-scope="scope"> 
          {{scope.row.status == 0 ? '已过期':'未过期 '}}
        </template>
      </el-table-column>
      <el-table-column
        prop="maxCouponNumber"
        label="总发行"
        width="80">
        <template slot-scope="scope"> 
          {{$util.formatThousand((scope.row.maxCouponNumber),0) == 0 ? '无限制' : $util.formatThousand((scope.row.maxCouponNumber),0)}}
        </template>
      </el-table-column>      
      <el-table-column
        prop="obtainNumber"
        label="已领取"
        width="80">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.obtainNumber,0)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="usedNumber"
        label="已使用"
        width="80">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.usedNumber,0)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        width="80">
        <template slot-scope="scope"> 
          {{scope.row.type == 0 ? 'mss':'etup'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="couponValue"
        label="优惠总额">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.couponValue,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="totalSale"
        label="产生销售">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.totalSale,2)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="driveSale"
        label="带动销售">
        <template slot-scope="scope"> 
          {{$util.formatThousand(scope.row.driveSale,2)}}
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
          couponName:'',
          couponId:'',
          type:'',         
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
      "searchForm.provinceObject":function(val){
        let datas = [];
        val.map(item=>{
          if(item.code !='999')
            datas.push(item.code)
        })
        this.searchForm.provinceCodes = datas;
      }
    },
    methods: {
      resetForm(){
        this.searchForm = {
          provinceCodes:[],
          date:'',
          provinceObject:[],
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
        else if(column.property =='createTime' || column.property =='startTime'
        || column.property =='endTime'){
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
        this.$tupHttp(this,'benefit/coupon/report','POST',thiz.searchForm).then(res=>{
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
