<template>
  <div>
    <el-form  :model="searchForm" label-width="120px" class="demo-form-inline">   

      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="产品名称">
            <el-input v-model="searchForm.pName" size="mini" placeholder="产品名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="产品编号">
              <el-input-product-code 
                v-model="searchForm.pCode"
                size="mini">
              </el-input-product-code>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="操作时间">
            <el-date-picker
              v-model="searchForm.date"
              size="mini"
              style="width:100%"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder="开始日期"
              :default-time="['00:00:00', '23:59:59']"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>  
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="操作类型">
            <el-select v-model="searchForm.changeType" size="mini" clearable  placeholder="请选择">
              <el-option
                v-for="item in Dictions.quota_change_type"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <div style="line-height: 26px;">
          <el-button style="float:left" icon="el-icon-search" type="primary" size="mini" @click="loadData(true)">查询</el-button>
          <el-button style="float:left" icon="el-icon-refresh" type="primary" size="mini" @click="resetForm">重置</el-button>
      </div>
        </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="tableLoading"
      style="width: 100%;"
      height="480"
      highlight-current-row>
      <el-table-column
        type="index"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="pCode"
        label="产品编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="pName"
        label="产品名称"
        sortable
        width="150">
      </el-table-column>
      <el-table-column
        prop="quotaType"
        label="配额类型"
        :formatter="formatter"
        width="120">
      </el-table-column>
      <el-table-column
        prop="effectArea"
        label="影响地区"
        width="150">
      </el-table-column>
      <el-table-column
        prop="changeType"
        label="调整类型"
        :formatter="formatter"
        width="120">
      </el-table-column>
      <el-table-column
        prop="beforeQuotaQty"
        label="调整前配额数量"
        width="150">
      </el-table-column>
      <el-table-column
        prop="changeQuotaQty"
        label="配额调整值"
        width="150">
      </el-table-column>
      <el-table-column
        prop="afterQuotaQty"
        label="调整后配额数量"
        width="150">
      </el-table-column>
      <el-table-column
        prop="operateId"
        label="操作人员/专卖店编号"
        width="150">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        :formatter="formatter"
        width="150"
        label="变更时间">
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top:15px;">
      <el-pagination
        background
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
          quota_change_type:[
            {
              dictName:'导入',
              dictValue:1
            },
            {
              dictName:'系统增加',
              dictValue:2
            },
            {
              dictName:'系统减少',
              dictValue:3
            },
            {
              dictName:'订单减少',
              dictValue:4
            },
            {
              dictName:'订单退回',
              dictValue:5
            },
            {
              dictName:'已删除',
              dictValue:6
            }
          ]
        },
        loading:false,
        currentPage:1,
        total:0,
        searchForm:{
          date:[],
          beginTime:'',
          pCode:'',
          endTime:'',
          pName:'',
          changeType:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:50
          }
        },
        tableData: [
        ],
        tableLoading:false,
        dialogVisible:false,
        itemIndex:-1,//当前编辑的行索引
        isFirst:true
      }
    },
    watch:{
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
          date:[],
          beginTime:'',
          pCode:'',
          endTime:'',
          pName:'',
          changeType:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:this.searchForm.pagingQuery.pageSize
          }
        }
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='quotaType'){
          if(row[column.property]==0){
            txt = '单店'
          }
          else if(row[column.property]==1){
            txt = '产品'
          }            
          else if(row[column.property]==2){
            txt = '区域省办'
          }            
        }
        else if(column.property =='updateTime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss");
        }
        else if(column.property =='changeType'){
          this.Dictions.quota_change_type.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        }
        return txt;
      },
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData();
      },
      handleSizeChange(val) {
        this.searchForm.pagingQuery.pageSize = val;
        this.loadData();
      },
      getArea(){
        let val = this.$refs.areaSelect.getValues();
        if(!val){
          val = this.areaData;
        }
        if(val.isarea==='1'){
          let codeArray = [];
          val.targetAreas.map(item=>{
            codeArray.push(item.code);
          })
          if(this.isFirst)
            this.tableData[this.itemIndex].firstBookProviceCodes = codeArray.join(',');
          else
            this.tableData[this.itemIndex].commonBookProviceCodes = codeArray.join(',');
        }
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      },     
      detail(index, row) {
        this.gotoUrl('/frame/terminal/customerInfo/'+row.id)
      },
      loadDictions(){
        let thiz = this;
        let params = ["quota_change_type"];
        this.$baseData.getDicts(this,params,function(data){
          if(data)
            thiz.Dictions = data;
        });
      },
      loadData(isSearch){
        let thiz = this;
        thiz.tableLoading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        thiz.$tupHttp(thiz,'inventory/selectListsByPage','POST',thiz.searchForm).then(res=>{
          let tableData = res.body.models;
          thiz.tableData = tableData;
          thiz.total = res.body.pageInfo.total;
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
      this.loadDictions();
      this.getFMonth();
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
