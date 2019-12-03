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
            <tup-arae-select v-model="searchForm.provinceObject"  ></tup-arae-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="分销商编号">
            <el-input v-model="searchForm.sDbStr" size="mini" placeholder="上级分销商编号"></el-input>
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
          <el-form-item label="DM工号">
            <el-input v-model="searchForm.dmNo" size="mini" placeholder="DM工号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="DM姓名">
            <el-input v-model="searchForm.dmName" size="mini" placeholder="DM姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="有效OIO">
            <el-select v-model="searchForm.availableOIO" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="门店状态">
            <el-select v-model="searchForm.clientStatus" size="mini" clearable filterable  placeholder="请选择">
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
          <el-form-item label="产品编号">
            <el-input-product-code 
              v-model="searchForm.itemId"
              size="mini">
            </el-input-product-code>
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
        prop="itemId"
        label="产品编号"
        width="120">
      </el-table-column>      
      <el-table-column
        prop="itemCnName"
        label="产品名称"
        width="150">
      </el-table-column>
      <el-table-column
        prop="itemEnName"
        label="产品英文名称"
        width="150">
      </el-table-column>
      <el-table-column
        prop="itemStatus"
        label="产品状态"
        width="100">
        <template slot-scope="scope">
          {{scope.row.itemStatus == 1 ? '上架':'下架'}}
        </template>
      </el-table-column>      
      <el-table-column
        prop="itemCategory"
        label="产品系列"
        width="120">
      </el-table-column>
      <el-table-column
        prop="quantity"
        label="产品库存"
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
        width="100">
      </el-table-column>
      <el-table-column
        prop="regionName"
        label="区域"
        width="80">
      </el-table-column>
      <el-table-column
        prop="provinceName"
        label="省办"
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
      <el-table-column
        prop="clientStatus"
        label="门店状态"
        :formatter="formatter"
        width="100">
      </el-table-column>
      <!-- <el-table-column
        fixed="right"
        label="操作"
        width="220">
        <template slot-scope="scope">
        </template>
      </el-table-column> -->
    </el-table>
    <div style="text-align: right;margin-top:15px;">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="searchForm.pagingQuery.pageIndex"
        :page-sizes="50"
        layout="prev , next"
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
        dialogVisible:false,
        approveForm:{
          newClientId:'',
          oldClientId:''
        },
        pics:[],
        loading:false,
        currentPage:1,
        total:0,
        Dictions:{
          outlet_status:[],
          outlet_property:[],
          visualize_grade:[],
          graduation_reason:[],
          oos_code:[],
          msg_source:[],
          outlet_show:[],
          outlet_property2:[],
          location:[],
          grade_type:[],
          address_source:[],
          gender:[],
          bop_explain:[]
        },//本页面使用的所有字典
        searchForm:{
          dmNo:'',
          dmName:'',
          availableOIO:1,
          cnid:'',
          sProvince:[],
          provinceObject:[],
          sRegion:[],
          areaObject:[],
          fsNo:'',
          fsName:'',
          clientId:'',
          clientStatus:'',
          itemId:'',
          sDbStr:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:50
          }
        },
        tableData: [],
        tableLoading:false,
        contractForm:{},
        fwiForm:{},
        contractDialogVisible:false,
        fwiDialogVisible:false,
        pic1:[],
        pic2:[]
      }
    },
    watch:{
      $route:function(val){
        if(val.path == '/frame/psi/clientProStock'){
          this.$util.onKeyCode(this,'loadData',[true])
        }
      },
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
          dmNo:'',
          dmName:'',
          availableOIO:1,
          cnid:'',
          sProvince:[],
          provinceObject:[],
          sRegion:[],
          areaObject:[],
          fsNo:'',
          fsName:'',
          clientId:'',
          clientStatus:'',
          itemId:'',
          sDbStr:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:this.searchForm.pagingQuery.pageSize
          }
        }
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='clientStatus'){
          this.Dictions.outlet_status.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })          
        } 
        return txt;
      },
      downLoad(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        delete data.pagingQuery;
        thiz.$tupHttp(thiz,'clientItemInventory/exportClientItemInventory','POST',data,{},'/manage-psi/',false,'').then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '文件已加入下载队列，稍后前往 "基础设置-内容管理-导出下载" 下载文件'
          });
        },res=>{
          thiz.loading = false;
        })
      },
      view(ind,row){
        this.gotoUrl('/frame/terminal/customerDetail/'+row.pUid)
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
        thiz.$tupHttp(thiz,'clientItemInventory/getClientItemInventoryPage','POST',thiz.searchForm,{},'/manage-psi/',false,'').then(res=>{
          thiz.tableData = res.body.models;
          thiz.total += res.body.models.length
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
        let params = ["outlet_status"];
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
