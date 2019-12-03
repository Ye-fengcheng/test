<template>
  <div v-loading="loading">
    <el-form  :model="searchForm"  label-width="120px" class="demo-form-inline">
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
          <el-form-item label="DFS编号">
            <el-input v-model="searchForm.fsNo" size="mini" placeholder="DFS编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">          
          <el-form-item label="DFS姓名">
            <el-input v-model="searchForm.fsName" size="mini" placeholder="DFS姓名"></el-input>
          </el-form-item>
        </el-col>   
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">          
          <el-form-item label="DM编号">
            <el-input v-model="searchForm.dmNo" size="mini" placeholder="DM编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">          
          <el-form-item label="DM姓名">
            <el-input v-model="searchForm.dmName" size="mini" placeholder="DM姓名"></el-input>
          </el-form-item>
        </el-col>   
        <el-col :span="8">
          <el-form-item label="门店等级">
            <el-select v-model="searchForm.dcKpiAmt" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="新店" :value="6"></el-option>
              <el-option label="0元店" :value="0"></el-option>
              <el-option label="4万以下店" :value="1"></el-option>
              <el-option label="4-6万店" :value="2"></el-option>
              <el-option label="6-8万店" :value="3"></el-option>
              <el-option label="8-10万店" :value="4"></el-option>
              <el-option label="10万以上店" :value="5"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="年">
            <el-select v-model="searchForm.year" size="mini" clearable filterable  placeholder="请选择">
              <el-option
                v-for="item in years"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">   
          <el-form-item label="月">
            <el-select v-model="searchForm.month" size="mini" clearable filterable  placeholder="请选择">
              <el-option
                v-for="item in months"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>       
        <el-col :span="8">
          <el-form-item label="填报状态">
            <el-select v-model="searchForm.status" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="未填报" :value="0"></el-option>
              <el-option label="已填报" :value="1"></el-option>
              <el-option label="系统生成" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button  style="float:left;margin-left:10px;" type="primary" icon="el-icon-search" size="mini" @click="loadData(true)">查询</el-button>
        <el-button style="float:left;margin-left:10px;"  icon="el-icon-refresh" type="primary" size="mini" @click="resetForm">重置</el-button>
        <el-button style="float:left;margin-left:10px;" icon="el-icon-download" @click="downLoad" :loading="loading" size="mini" type="primary">导出</el-button>
        <el-button style="float:left" icon="el-icon-upload2" @click="gotoUrl('/frame/oe/oeUpload')"  size="mini" type="primary">导入</el-button>
      </el-form-item>
    </el-form>   
    <div style="line-height: 26px;">
      
    </div>
    <el-table
      :data="tableData"
      v-loading="tableLoading"
      style="width: 100%;"
      :height="tableHeight"
      highlight-current-row
      :default-sort = "{prop: 'date', order: 'descending'}">
      <el-table-column
        type="index"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="productName"
        label="产品名称"
        width="150">
      </el-table-column>
      <el-table-column
        prop="estimatedQuantity"
        label="预估定量"
        width="100">
      </el-table-column>
      <el-table-column
        prop="referenceQuantity"
        label="参考定量"
        width="100">
      </el-table-column>
      <el-table-column
        prop="price"
        label="单价"
        sortable
        width="80">
      </el-table-column>
      <el-table-column
        prop="totalPrice"
        label="预估达成金额"
        width="100">
      </el-table-column>
      <el-table-column
        prop="monthlyAverageSales"
        label="月均销售"
        width="100">
      </el-table-column>
      <el-table-column
        prop="currentInventory"
        label="目前库存"
        width="100">
      </el-table-column>
      <el-table-column
        prop="shopCount"
        label="参考库存"
        width="100">
      </el-table-column>
      <el-table-column
        prop="clientLevel"
        label="门店等级"
        width="100">
      </el-table-column>
      <el-table-column
        prop="estimatedYear"
        label="财务年"
        width="80">
      </el-table-column>
      <el-table-column
        prop="estimatedMonth"
        label="财务月"
        width="80">
      </el-table-column>
      <el-table-column
        prop="status"
        label="填报状态"
        width="80">
        <template slot-scope="scope">
          {{scope.row.status == 0 ? '未填报':(scope.row.status == 1 ? '已填报':((scope.row.status == 2 ? '系统生成':'')))}}
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        width="120"
        :formatter="formatter"
        label="填报时间">
      </el-table-column> 
      <el-table-column
        prop="createBy"
        label="填报人">
      </el-table-column>    
      <el-table-column
        prop="updateTime"
        width="120"
        :formatter="formatter"
        label="编辑时间">
      </el-table-column> 
      <el-table-column
        prop="updateBy"
        label="编辑人">
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
        prop="regionName"
        label="区域"
        width="80">
      </el-table-column>
      <el-table-column
        prop="provinceName"
        label="省办"
        sortable
        width="80">
      </el-table-column>
      <el-table-column
        prop="dbNo"
        label="分销商编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="dbName"
        label="分销商名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="fsNo"
        label="DFS工号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="fsName"
        label="DFS姓名"
        width="100">
      </el-table-column>
      <el-table-column
        prop="dmNo"
        label="DM工号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="dmName"
        label="DM姓名"
        width="100">
      </el-table-column>    
    </el-table>
    <div style="text-align: right;margin-top:15px;">
      <el-pagination
        @current-change="handleCurrentChange"
        background
        :current-page="searchForm.pagingQuery.pageIndex"
        :page-size="20"
        layout="slot,prev, pager, next, jumper"
        :total="total">
        <span class="el-pagination__total" v-if="total < $baseData.maxNumber">共&nbsp;{{total}}&nbsp;条</span>
        <span class="el-pagination__total" v-else>{{$baseData.maxTitle}}</span>
      </el-pagination>
    </div>
    <el-dialog title="导入出错数据" width="60%" top="5%" :visible.sync="dialogVisible">
      <el-table
        :data="errorTableData"
        style="width: 100%;"
        height="450"
        highlight-current-row
        :default-sort = "{prop: 'date', order: 'descending'}">
        <el-table-column
          prop="excelIndex"
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          prop="productName"
          label="产品名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="price"
          label="单价"
          sortable
          width="80">
        </el-table-column>
        <el-table-column
          prop="unit"
          label="单位"
          width="80">
        </el-table-column>
        <el-table-column
          prop="stockProduct"
          label="盘点产品名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="flagYear"
          label="填报财务年"
          width="120">
        </el-table-column>
        <el-table-column
          prop="flagMonth"
          label="填报财务月"
          width="120">
        </el-table-column>
        <el-table-column
          prop="message"
          label="错误信息"
          width="150">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="dialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        years:[],
        months:[
          {
            value: '1',
            label: '1'
          },
          {
            value: '2',
            label: '2'
          },
          {
            value: '3',
            label: '3'
          },
          {
            value: '4',
            label: '4'
          },
          {
            value: '5',
            label: '5'
          },
          {
            value: '6',
            label: '6'
          },
          {
            value: '7',
            label: '7'
          },
          {
            value: '8',
            label: '8'
          },
          {
            value: '9',
            label: '9'
          },
          {
            value: '10',
            label: '10'
          },
          {
            value: '11',
            label: '11'
          },
          {
            value: '12',
            label: '12'
          }
        ],
        areaData:{
          isarea:'1',
          data:[]
        },
        errorTableData:[],
        dialogVisible:false,
        tableHeight:parseInt(document.documentElement.clientHeight-160),
        loading:false,
        currentPage:1,
        total:0,
        searchForm:{
          sDbStr:'',
          sProvince:[],
          provinceObject:[],
          sRegion:[],
          areaObject:[],
          month:'',
          year:'',
          dcKpiAmt:'',
          dmName:'',
          dmNo:'',
          fsNo:'',
          fsName:'',
          clientId:'',
          status:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:20
          }
        },
        tableData: [
        ],
        tableLoading:false
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
      resetForm(){
        this.searchForm = {
          sDbStr:'',
          sProvince:[],
          provinceObject:[],
          sRegion:[],
          areaObject:[],
          month:'',
          year:'',
          dcKpiAmt:'',
          dmName:'',
          dmNo:'',
          fsNo:'',
          fsName:'',
          clientId:'',
          status:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:this.searchForm.pagingQuery.pageSize
          }
        }
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='updateTime' || column.property =='createTime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss");
        }
        return txt;
      },
      upload(option){     
        this.$util.readExcel(option.file,this.treatDatas)
      },
      treatDatas(datas,file){
        let arr = [];
        for(let i =1;i<datas.sheet0.length;i++){
          arr.push({
            clientId:datas.sheet0[i][0],
            productName:datas.sheet0[i][1],
            estimatedQuantity:datas.sheet0[i][2],
            monthlyAverageSales:datas.sheet0[i][3],
            currentInventory:datas.sheet0[i][4],
            year:datas.sheet0[i][5],
            month:datas.sheet0[i][6]
          })
        }
        let thiz = this;
        this.loading = true;
        thiz.$tupHttp(thiz,'orderEstimate/importOrderEstimated','POST',arr,{},'/manage-psi/',false,'').then(res=>{
          thiz.loadData()
          thiz.loading = false;
          if(res.body.valid){
            thiz.$notify.success({
              title: '提示',
              message: '批量插入成功'
            });
          }else{
            thiz.$notify.error({
              title: '错误提示',
              message: '部分数据有误'
            });
            thiz.errorTableData = res.body.models;
            thiz.dialogVisible = true;
          } 
        },res=>{
          thiz.loadData()
          thiz.loading = false;
        }) 
      },
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData();
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      },     
      downLoad(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        delete data.pagingQuery;
        thiz.$tupHttp(thiz,'orderEstimate/exportOrderEstimated','POST',data,{},'/manage-psi/',false,'').then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '文件已加入下载队列，稍后前往 "基础设置-内容管理-导出下载" 下载文件'
          });
        },res=>{
          thiz.loading = false;
        })
      },
      loadData(isSearch){
        let thiz = this;
        if(!this.searchForm.year || !this.searchForm.month){
          thiz.$notify.error({
            title: '错误提示',
            message: '年月不能为空'
          });
          return;
        }
        thiz.tableLoading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        thiz.$tupHttp(thiz,'orderEstimate/getOrderEstimatedPage','POST',thiz.searchForm,{},'/manage-psi/',false,'').then(res=>{
          thiz.tableData = res.body.models;
          thiz.total = res.body.pageInfo ? res.body.pageInfo.total:0
          thiz.tableLoading = false;
        },res=>{
          thiz.tableLoading = false;
        })
      }
    },
    mounted(){
      $('.el-upload__input').hide();
      //this.loadData();
      let currentYear = (new Date()).getFullYear()+1;
      for(let i=currentYear;i>=parseInt(currentYear-10);i--){
        this.years.push({
          value:i,
          lable:i
        })
      }
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
