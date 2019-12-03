<template>
  <div>
    <el-form  :model="searchForm" label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="专卖店编号">
            <el-input v-model="searchForm.clientId" size="mini"  placeholder="专卖店编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="产品编号">
            <el-input-product-code v-model="searchForm.pCode" size="mini" placeholder="产品编号"></el-input-product-code>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="有效期">
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
        <el-col :span="8">
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="审核通过" :value="1"></el-option>
              <el-option label="待审核" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>      
      <el-form-item>
        <div style="line-height: 26px;">
          <el-button style="float:left" icon="el-icon-search" type="primary" size="mini" @click="loadData(true)">查询</el-button>
          <el-button style="float:left" icon="el-icon-refresh" type="primary" size="mini" @click="resetForm">重置</el-button>
          <el-button style="float:left" icon="el-icon-download" :loading="loading" size="mini" @click="downLoad()" type="primary">导出</el-button>
          <el-upload
            style="float:left;margin-left:10px;"
            :show-file-list="false"
            :multiple="true"
            :httpRequest="upload">
            <el-button :loading="loading" icon="el-icon-upload2" size="mini" type="primary">上传</el-button>
          </el-upload>  
          &nbsp;&nbsp;
          <el-button size="mini" @click="$util.winOpen('static/useJs/doc/StoreQuota.xlsx?'+$util.getRandom())" type="text">下载模板</el-button>
          <el-button icon="el-icon-check" :disabled="multipleSelection.length==0" size="mini" :loading="loading" @click="approve" type="success">批量审核</el-button>
          <el-button icon="el-icon-minus" :disabled="multipleSelection.length==0" size="mini" :loading="loading" @click="enable(0)" type="danger">停用</el-button>
          <el-button icon="el-icon-check" :disabled="multipleSelection.length==0" size="mini" :loading="loading" @click="enable(1)" type="success">启用</el-button> 
          <el-button style="float:left;margin-left:10px;" icon="el-icon-plus" size="mini" @click="gotoUrl('/frame/product/addStoreQuota')" type="primary">批量创建</el-button>
          <el-button icon="el-icon-delete" :disabled="multipleSelection.length==0" size="mini" :loading="loading" @click="deletes" type="danger">删除</el-button>         
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
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        type="index"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="100">
        <template slot-scope="scope">          
          {{scope.row.status==1 ? '审核通过':'待审核'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="isAccumulate"
        label="是否累计"
        width="100">
        <template slot-scope="scope">          
          {{scope.row.isAccumulate == 1 ? '是':'否'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="clientId"
        label="专卖店编号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="singleName"
        label="专卖店名称"
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
        width="250">
      </el-table-column>
      <el-table-column
        prop="isDisable"
        label="是否启用"
        :formatter="formatter"
        width="100">
      </el-table-column>
      <el-table-column
        prop="quotaQty"
        label="配额数量"
        width="100">
        <template slot-scope="scope">
          <el-input 
            v-model="scope.row.quotaQty"
            size="mini"
            label=""></el-input>
        </template>
      </el-table-column>      
      <el-table-column
        prop="mqq"
        label="最低订量"
        width="120">
        <template slot-scope="scope">
          <el-input 
            v-model="scope.row.mqq"
            size="mini"
            label=""></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="mustQty"
        label="必定量"
        width="120">
        <template slot-scope="scope">
          <el-input 
            v-model="scope.row.mustQty"
            size="mini"
            label=""></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="beginTime"
        label="有效期起"
        width="180">
        <template slot-scope="scope">
          <el-date-picker
            style="width:140px"
            size="mini"
            v-model="scope.row.beginTime"
            type="date"
            placeholder="选择时间"
            value-format="yyyy-MM-dd"
            align="right">
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column
        prop="endTime"
        label="有效期止"
        width="180"
        :formatter="formatter">
        <template slot-scope="scope">
          <el-date-picker
            style="width:140px"
            size="mini"
            v-model="scope.row.endTime"
            type="date"
            placeholder="选择时间"
            value-format="yyyy-MM-dd"
            align="right">
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column
        prop="isExpire"
        label="是否有效"
        width="150">
        <template slot-scope="scope">          
          {{scope.row.isExpire ==0 ? '有效':'已过期'}}
        </template>
      </el-table-column>
      
      <el-table-column label="操作" fixed="right" width="150">
        <template slot-scope="scope">          
          <el-button
            size="mini"          
            type="primary"
            @click="saveItem(scope.$index, scope.row)">保存</el-button>
          <el-button
            size="mini"          
            type="primary"
            v-if="scope.row.status !== 1"
            :loading="loading"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <el-button
              size="mini"          
              type="primary"
              v-if="scope.row.status == 1 && scope.row.isDisable == 1 && scope.row.isExpire == 0"
              :loading="loading"
              @click="handleSS(scope.$index, scope.row)">停用</el-button>
            <el-button
              size="mini"          
              type="primary"
              v-if="scope.row.status == 1 && scope.row.isDisable == 0 && scope.row.isExpire == 0"
              :loading="loading"
              @click="handleSS(scope.$index, scope.row)">启用</el-button>
        </template>
      </el-table-column>  
    </el-table>
    <el-dialog title="选择地区" width="30%" top="5%" :visible.sync="dialogAreaVisible">
      <tup-arae-store-select ref="areaSelect" v-model="areaData" :needstore="false"></tup-arae-store-select>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="saveArea">确认</el-button>
        <el-button size="mini" @click="dialogAreaVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <div style="text-align: right;margin-top:15px;">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.pagingQuery.pageIndex"
        :page-sizes="[50, 100,200]"
        layout="slot,sizes, prev, pager, next, jumper"
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
          prop="clientId"
          label="门店编号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="pCode"
          label="产品编号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="quotaQty"
          label="配额"
          width="150">
        </el-table-column>
        <el-table-column
          prop="mustQty"
          label="必定量"
          width="150">
        </el-table-column>
        <el-table-column
          prop="mqq"
          label="最低订量"
          width="150">
        </el-table-column>
        <el-table-column
          prop="beginTime"
          label="开始时间"
          :formatter="formatter"
          width="150">
        </el-table-column>
        <el-table-column
          prop="endTime"
          label="结束时间"
          :formatter="formatter"
          width="150">
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
        itemIndex:0,
        areaData:{
          isarea:'1',
          data:[]
        },
        currentPage:1,
        multipleSelection:[],
        loading:false,
        total:0,
        searchForm:{
          clientId:'',
          status:'',
          pCode:'',
          date:[],
          endTime:'',
          beginTime:'',
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
        dialogAreaVisible:false
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
         clientId:'',
          status:'',
          pCode:'',
          date:[],
          endTime:'',
          beginTime:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:this.searchForm.pagingQuery.pageSize
          }
        }
      },
      saveItem(ind,row){
        let thiz = this; 
        if(!row.quotaQty && !row.mustQty && !row.mqq){
          thiz.$notify.info({
            title: '提示',
            message: '不能同时为空和0'
          });
          return;
        }    
        if(row.quotaQty === 0 || row.quotaQty === '0'){
          thiz.$notify.info({
            title: '提示',
            message: '配额数量必须大于0'
          });
          return;
        }
        if(row.mustQty > 0 && row.mqq > 0){
          thiz.$notify.info({
            title: '提示',
            message: '最低订量 必订量互斥'
          });
          return;
        }
        if(row.quotaQty > 0 && row.quotaQty < row.mustQty){
          thiz.$notify.info({
            title: '提示',
            message: '必订量不能超过配额数量'
          });
          return;
        }
        if(row.quotaQty > 0 && row.quotaQty < row.mqq){
          thiz.$notify.info({
            title: '提示',
            message: '最低订量不能超过配额数量'
          });
          return;
        }
        this.loading = true;
        thiz.$tupHttp(thiz,'inventory/updateQuotaRuleData','POST',row).then(res=>{
          thiz.loadData()
          thiz.loading = false;
        },res=>{
          thiz.loading = false;
        }) 
      },
      deletes () {        
        let thiz = this;
        let data = [];
        this.multipleSelection.map(item=>{
          data.push(item.id)
        })
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          this.$tupHttp(this,'inventory/batchDeleteQuotaRecord','POST',data).then(res=>{
            thiz.loadData();
            thiz.loading = false;
          },res=>{
            thiz.loading = false;
          })
        }).catch(() => {
          this.loading = false;         
        });        
      },
      handleDelete(index, row) {        
        let thiz = this;
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          this.$tupHttp(this,'inventory/deleteQuotaRecord?quotaId='+row.id,'GET').then(res=>{
            thiz.loadData();
            thiz.loading = false;
          },res=>{
            thiz.loading = false;
          })
        }).catch(() => {
          this.loading = false;         
        });        
      }, 
      formatter(row, column) {
        let txt = ''
        if(column.property =='isFirstorder' || column.property == 'isNonfirstorder' || column.property == 'isDisable'){
          if(row[column.property]==1)
            txt = '是'
          else
            txt = '否'
        }
        else if(column.property =='beginTime' || column.property == 'endTime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd");
        }
        return txt;
      },
      setArea(val){
        let thiz = this;  
        let ProviceCodes = this.tableData[val].provinceCode ? this.tableData[val].provinceCode:"999";
        let ProviceNames = this.tableData[val].provinceName ? this.tableData[val].provinceName:"全国";        
        let areas = ProviceCodes.split(',');
        let names =ProviceNames.split(',');
        if(areas){
          let datas = [];
          for(let i=0;i<areas.length;i++){
            datas.push({
              code:areas[i],
              name:names[i]
            })
          }
          setTimeout(function(){
            thiz.areaData = {
              isarea:'1',
              data: datas
            }
          })          
        }
        else{
          setTimeout(function(){
            thiz.areaData = {
              isarea:'1',
              data: []
            }
          }) 
        } 
      },
      enable(isDisable){
        let thiz = this;
        thiz.loading = true;
        let datas = [];
        this.multipleSelection.map(item=>{
          let data = thiz.$util.deepClone(item);
          data.isDisable = isDisable;
          datas.push(data)
        })
        thiz.$tupHttp(thiz,'inventory/batchStopOrStartQuotaRecord','POST',datas).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '提示',
            message: '操作成功'
          });
          thiz.loadData();
        },res=>{
          thiz.loading = false;
        })
      },
      editItemArea(ind,row){
        this.itemIndex = ind;
        this.setArea(ind);
        this.dialogAreaVisible = true;        
      },
      getArea(){
        let val = this.$refs.areaSelect.getValues();
        if(!val){
          val = this.areaData;
        }
        if(val.isarea==='1'){
          let codeArray = [];
          let nameArray = [];
          val.targetAreas.map(item=>{
            codeArray.push(item.code);
            nameArray.push(item.name);
          })
          this.tableData[this.itemIndex].provinceCode = codeArray.join(',');
          this.tableData[this.itemIndex].provinceName = nameArray.join(','); 
        }
      },
      saveArea(){     
        let thiz = this;
        this.getArea();
        this.dialogAreaVisible = false;
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
            thiz.$confirm('是否启用选中有效期内已审核的配额?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              thiz.enable(1); 
            }).catch(() => {
              thiz.loadData()       
            });           
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
          arr.push({
            clientId:datas.sheet0[i][0],
            pCode:datas.sheet0[i][1],
            quotaQty:datas.sheet0[i][2],
            mustQty:datas.sheet0[i][3],
            mqq:datas.sheet0[i][4],            
            isAccumulate:datas.sheet0[i][5]?datas.sheet0[i][5]:1,
            beginTime:datas.sheet0[i][6],
            endTime:datas.sheet0[i][7]
          })
        }
        let thiz = this;
        this.loading = true;
        thiz.$tupHttp(thiz,'inventory/uploadSingleProductQuotaExcel','POST',arr).then(res=>{
          thiz.loading = false;
          if(res.body.valid){
            thiz.loadData() 
          }else{
            thiz.$notify.error({
              title: '错误提示',
              message: res.body.message
            });
            thiz.errorTableData = res.body.models;
            if(thiz.errorTableData.length > 0){
              thiz.dialogVisible = true;
            }      
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
      detail(index, row) {
        this.gotoUrl('/frame/terminal/customerInfo/'+row.id)
      },
      handleSS(index, row) {        
        let thiz = this;
        this.$confirm('此操作将影响已配置配额数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          let isDisable = row.isDisable ==0 ? 1:0;
          this.$tupHttp(this,'inventory/stopOrStartQuotaRecord?quotaId='+row.id+'&isDisable='+isDisable,'GET').then(res=>{
            thiz.loadData();
            thiz.loading = false;
          },res=>{
            thiz.loading = false;
          })
        }).catch(() => {
          this.loading = false;         
        });        
      },
      downLoad(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        delete data.pagingQuery;
        thiz.$tupHttp(thiz,'inventory/exportSingleQuotas','POST',data,{},'',true).then(res=>{
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
        thiz.tableLoading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        thiz.$tupHttp(thiz,'inventory/getFmsSingleQuotaRulesByPage','POST',thiz.searchForm).then(res=>{
          let data =res.body.models;
          thiz.tableLoading = false;
          thiz.tableData = data
          thiz.total = res.body.pageInfo ? res.body.pageInfo.total:0;
          
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
.el-input-number--mini {
  width: 110px !important;
}
</style>
