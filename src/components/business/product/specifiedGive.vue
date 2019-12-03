<template>
  <div>
    <el-form  :model="searchForm" label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="产品编号">
            <el-input-product-code v-model="searchForm.condition.pCode" size="mini" placeholder="产品编号"></el-input-product-code>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="产品名称">
            <el-input v-model="searchForm.condition.pName" size="mini" placeholder="产品名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="区域/省办">            
            <tup-arae-select v-model="searchForm.condition.provinceObject" size="mini" ></tup-arae-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="专卖店编号">
            <el-input v-model="searchForm.condition.clientId" size="mini" placeholder="专卖店编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="订单编号">
            <el-input v-model="searchForm.condition.orderNo" size="mini" placeholder="订单编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="生效时间段">
            <el-date-picker
              v-model="searchForm.condition.date"
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
          <el-form-item label="状态">
            <el-select v-model="searchForm.condition.auditStatusList" size="mini" multiple clearable filterable  placeholder="请选择">
              <el-option
                v-for="item in Dictions.audit_status"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>   
        <el-col :span="8">
          <el-form-item label="财务年月">
            <el-date-picker
              v-model="searchForm.condition.ym"
              size="mini"
              type="month"
              placeholder="财务年月">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <div style="line-height: 26px;">
          <el-button style="float:left" icon="el-icon-search" type="primary" size="mini" @click="loadData(true)">查询</el-button>
          <el-button style="float:left" icon="el-icon-refresh" type="primary" size="mini" @click="resetForm">重置</el-button>
          <el-button style="float:left" icon="el-icon-upload2" @click="gotoUrl('/frame/product/specifiedGiveImport')"  size="mini" type="primary">上传数据</el-button>
          <el-button style="float:left" icon="el-icon-download" :loading="loading" size="mini" @click="downLoad()" type="primary">导出</el-button>
          <el-button icon="el-icon-delete" :disabled="total==0" size="mini" :loading="loading" @click="deletes" type="danger">批量删除</el-button>
          <el-button icon="el-icon-check" :disabled="total==0" size="mini" :loading="loading" @click="approve" type="success">批量审核</el-button>
          <el-button icon="el-icon-close" :disabled="total==0" size="mini" :loading="loading" @click="disable" type="danger">批量失效</el-button>
          <el-button icon="el-icon-edit" :disabled="total==0" size="mini"  @click="changeym" type="primary">批量变更财务生效年月</el-button>
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
          prop="clientId"
          label="门店"
          width="100">
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
        width="200">
      </el-table-column>
      <el-table-column
        prop="quantity"
        label="配额数量"
        width="100">
      </el-table-column>
      <el-table-column
        prop="auditStatus"
        label="状态"
        :formatter="formatter"
        width="120">
      </el-table-column>
      <el-table-column
        prop="isModify"
        label="是否变更"
        width="120">
        <template slot-scope="scope">          
          {{scope.row.isModify==0 ? '否':'是'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="finYear"
        label="生效财务年"
        width="100">
      </el-table-column>
      <el-table-column
        prop="finMonth"
        label="生效财务月"
        width="100">
      </el-table-column>
      <el-table-column
        prop="finMonth"
        label="生效时间段"
        width="200">
        <template slot-scope="scope">   
          {{new Date(scope.row.effectiveStartDate).format("yyyy-MM-dd")}} -- {{new Date(scope.row.effectiveEndDate).format("yyyy-MM-dd")}}
        </template>
      </el-table-column>
      <el-table-column
        prop="auditRemark"
        label="备注"
        width="120">
      </el-table-column>      
      <el-table-column
        prop="orderNo"
        label="订单编号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="orderStatus"
        label="订单状态"
        :formatter="formatter"
        width="100">
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.orderNo"
            size="mini"          
            type="text"
            @click="openDetail(scope.$index, scope.row)">查看订单详情</el-button>
        </template>
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
    <el-dialog title="变更财务月和时间段" width="40%" top="10%" :visible.sync="dialogVisible">
      <el-form  :model="ymForm" label-width="120px" class="demo-form-inline">
        <el-row :gutter="5">                    
          <el-col :span="24">
            <el-form-item label="财务年月">
              <el-date-picker
                v-model="ymForm.ym"
                type="month"
                style="width:100%"
                size="mini"
                placeholder="财务年月">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">  
            <el-form-item label="生效时间段">
              <el-date-picker
                v-model="ymForm.date"
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" size="mini" :disabled="!ymForm.ym || !ymForm.date" :loading="loading" @click="saveItems">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        Dictions:{
          audit_status:[
            {
              dictName:'未审核未使用',
              dictValue:0
            },
            {
              dictName:'已审核未使用',
              dictValue:1
            },
            {
              dictName:'已使用',
              dictValue:2
            },
            {
              dictName:'已失效',
              dictValue:3
            }
          ],
          order_status:[]
        },
        ymForm:{
          ym:'',
          date:''
        },
        multipleSelection:[],
        loading:false,
        total:0,
        searchForm:{
          condition:{
            ym:'',
            finYear:'',
            finMonth:'',
            date:[],
            auditStatusList:[],
            clientId:'',
            auditStatus:'',
            pCode:'',
            pName:'',
            provinceCodes:[],
            provinceObject:[],
            effectiveStartDate:'',
            effectiveEndDate:'',
            orderNo:''
          },
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
        detail:[],
      }
    },
    watch:{
      'searchForm.condition.ym':function(val){
        if(!val){
          this.searchForm.condition.finYear = '';
          this.searchForm.condition.finMonth = '';
        }
        else{
          this.searchForm.condition.finYear = val.getFullYear();
          this.searchForm.condition.finMonth = val.getMonth()+1;
        }
      },
      'searchForm.condition.date':function(val){
        if(!val){
          this.searchForm.condition.effectiveStartDate = '';
          this.searchForm.condition.effectiveEndDate = '';
        }
        else{
          this.searchForm.condition.effectiveStartDate = val[0];
          this.searchForm.condition.effectiveEndDate = val[1];
        }
      },
      "searchForm.condition.provinceObject":function(val){
        let datas = [];
        val.map(item=>{
          if(item.code !='999')
            datas.push(item.code)
        })
        this.searchForm.condition.provinceCodes = datas;
      }
    },
    methods: {
      resetForm(){
        this.searchForm = {
          condition:{
            ym:'',
            finYear:'',
            finMonth:'',
            clientId:'',
            pCode:'',
            pName:'',
            auditStatus:'',
            provinceCodes:[],
            auditStatusList:[],
            provinceObject:[],
            effectiveStartDate:'',
            effectiveEndDate:'',
            orderNo:''
          },
          pagingQuery:{
            pageIndex:1,
            pageSize:this.searchForm.pagingQuery.pageSize
          }
        }
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='isFirstorder' || column.property == 'isNonfirstorder'){
          if(row[column.property]==1)
            txt = '是'
          else
            txt = '否'
        }
        else if(column.property =='auditStatus'){
          this.Dictions.audit_status.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })  
        }
        else if(column.property =='orderStatus'){
          this.Dictions.order_status.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          })  
        }
        else if(column.property =='beginTime' || column.property == 'endTime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd");
        }
        return txt;
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(val);
      },
      changeym(){
        this.dialogVisible = true;
      },
      saveItems(){
        let thiz = this;
        let data = {
        };
        let vo = thiz.$util.deepClone(thiz.searchForm);
        delete vo.pagingQuery;
        data.vo = vo.condition
        data.effectiveStartDate = thiz.ymForm.date[0]
        data.effectiveEndDate = thiz.ymForm.date[1]
        data.finYear = thiz.ymForm.ym ? thiz.ymForm.ym.getFullYear():''
        data.finMonth = thiz.ymForm.ym ? thiz.ymForm.ym.getMonth()+1:''
        thiz.loading = true;
        thiz.$tupHttp(thiz,'product/batchUpdateGiftProductsFinMonth','POST',data).then(res=>{
          thiz.loading = false;
          thiz.ymForm = {
            ym:'',
            date:[]
          }
          thiz.dialogVisible = false;
          thiz.loadData();
        },res=>{
          thiz.loading = false;
        }) 
      },
      approve(){
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        delete data.pagingQuery;
        this.$confirm('是否批量审核通过?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          thiz.$tupHttp(thiz,'product/batchAuditGiftProducts','POST',data).then(res=>{
            thiz.loading = false;
            thiz.loadData();
          },res=>{
            thiz.loading = false;
          }) 
        }).catch(() => {    
          thiz.loading = false;  
        });        
      },
      disable(){
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        delete data.pagingQuery;
        this.$confirm('是否批量失效?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          thiz.$tupHttp(thiz,'product/batchAbandonGiftProducts','POST',data).then(res=>{
            thiz.loading = false;
            thiz.loadData();
          },res=>{
            thiz.loading = false;
          }) 
        }).catch(() => {    
          thiz.loading = false;  
        });        
      },
      deletes(){
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        delete data.pagingQuery;
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          thiz.$tupHttp(thiz,'product/batchRemoveGiftProducts','POST',data).then(res=>{
            thiz.loading = false;
            thiz.loadData();
          },res=>{
            thiz.loading = false;
          }) 
        }).catch(() => {    
          thiz.loading = false;  
        });
        
      },
      upload(option){     
        this.$util.readExcel(option.file,this.treatDatas)
      },
      treatDatas(datas){
        let arr = [];
        for(let i =1;i<datas.sheet0.length;i++){
          if(!!datas.sheet0[i][0]){
            if(!!datas.sheet0[i][1] && !!datas.sheet0[i][2]){
              arr.push({
                clientId:datas.sheet0[i][0],
                pCode:datas.sheet0[i][1],
                quantity:datas.sheet0[i][2],
                auditRemark:datas.sheet0[i][3],
                finYear:datas.sheet0[i][16],
                finMonth:datas.sheet0[i][17]
              })
            }
            if(!!datas.sheet0[i][4] && !!datas.sheet0[i][5]){
              arr.push({
                clientId:datas.sheet0[i][0],
                pCode:datas.sheet0[i][4],
                quantity:datas.sheet0[i][5],
                auditRemark:datas.sheet0[i][6],
                finYear:datas.sheet0[i][16],
                finMonth:datas.sheet0[i][17]
              })
            } 
            if(!!datas.sheet0[i][7] && !!datas.sheet0[i][8]){
              arr.push({
                clientId:datas.sheet0[i][0],
                pCode:datas.sheet0[i][7],
                quantity:datas.sheet0[i][8],
                auditRemark:datas.sheet0[i][9],
                finYear:datas.sheet0[i][16],
                finMonth:datas.sheet0[i][17]
              })
            } 
            if(!!datas.sheet0[i][10] && !!datas.sheet0[i][11]){
              arr.push({
                clientId:datas.sheet0[i][0],
                pCode:datas.sheet0[i][10],
                quantity:datas.sheet0[i][11],
                auditRemark:datas.sheet0[i][12],
                finYear:datas.sheet0[i][16],
                finMonth:datas.sheet0[i][17]
              })
            }  
            if(!!datas.sheet0[i][13] && !!datas.sheet0[i][14]){
              arr.push({
                clientId:datas.sheet0[i][0],
                pCode:datas.sheet0[i][13],
                quantity:datas.sheet0[i][14],
                auditRemark:datas.sheet0[i][15],
                finYear:datas.sheet0[i][16],
                finMonth:datas.sheet0[i][17]
              })
            }           
          }          
        }
        let thiz = this;
        this.loading = true;
        thiz.$tupHttp(thiz,'product/importGiftProducts','POST',{list:arr}).then(res=>{
          thiz.loading = false;
          if(res.body.valid){
            thiz.loadData() 
          }else{
            thiz.$notify.errpr({
              title: '错误提示',
              message: ''
            });
          }          
        },res=>{
          thiz.loading = false;
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
      gotoUrl(url){
        this.$router.push({ path: url });
      },   
      openDetail(index, row) {
        this.gotoUrl('/frame/order/orderDetailView/'+row.orderNo)
      },
      getDetail(id){
        let thiz = this;
        this.dialogVisible = true;
        thiz.$tupHttp(thiz,'product/getGiftProductDetail/'+id,'GET').then(res=>{
          this.detail = res.body.models;
        })
      },
      downLoad(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        delete data.pagingQuery;
        thiz.$tupHttp(thiz,'public-service/product/exportGiftProduct','POST',data,{},'/public-service/',false,'').then(res=>{
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
          thiz.Dictions.audit_status = [
            {
              dictName:'未审核未使用',
              dictValue:0
            },
            {
              dictName:'已审核未使用',
              dictValue:1
            },
            {
              dictName:'已使用',
              dictValue:2
            },
            {
              dictName:'已失效',
              dictValue:3
            }
          ]
        });
      },
      loadData(isSearch){
        let thiz = this;
        thiz.tableLoading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        thiz.$tupHttp(thiz,'product/listAllGiftProducts','POST',thiz.searchForm).then(res=>{
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
            thiz.searchForm.condition.date = thiz.fMonth
            setTimeout(function(){
              thiz.loadData();
            })            
          }
        })
      }
    },
    mounted(){
      $('.el-upload__input').hide();
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
