<template>
  <div>
    <el-form  :model="searchForm" label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="地区">            
            <tup-arae-select type="area" size="mini" v-model="searchForm.regionObject"  ></tup-arae-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="省办">            
            <tup-arae-select v-model="searchForm.provinceObject" size="mini" ></tup-arae-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态">
            <el-select v-model="searchForm.isVaild" clearable filterable size="mini" placeholder="请选择">
              <el-option label="启用" :value="1"></el-option>
              <el-option label="停用" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>      

      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="专卖店编号">
            <el-input v-model="searchForm.consumerId" size="mini" placeholder="专卖店编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="searchForm.date"
              size="mini"
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
          <el-button size="mini" @click="$util.winOpen('static/useJs/doc/OrderPlan.xlsx?'+$util.getRandom())" type="text">下载模板</el-button>
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
      @selection-change="handleSelectionChange">
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
        prop="consumerId"
        label="客户"
        sortable
        width="80">
      </el-table-column>
      <el-table-column
        prop="insertTime"
        label="创建时间"
        :formatter="formatter"
        width="180">
      </el-table-column>      
      <el-table-column
        prop="draftStartTimeStr"
        label="草稿开始时间"
        sortable
        width="250">
        <template slot-scope="scope">
          <el-date-picker
            style="width:210px"
            size="mini"
            v-model="scope.row.draftStartTimeStr"
            type="datetime"
            placeholder="选择时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right"
            :picker-options="pickerOptions">
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column
        prop="draftEndTime"
        label="草稿结束时间"
        sortable
        width="250">
        <template slot-scope="scope">
          <el-date-picker
            style="width:210px"
            size="mini"
            v-model="scope.row.draftEndTimeStr"
            type="datetime"
            placeholder="选择时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right"
            :picker-options="pickerOptions">
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column
        prop="startTime"
        label="下单开始时间"
        sortable
        width="250">
        <template slot-scope="scope">
          <el-date-picker
            style="width:210px"
            size="mini"
            v-model="scope.row.startTimeStr"
            type="datetime"
            placeholder="选择时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right"
            :picker-options="pickerOptions">
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column
        prop="endTime"
        label="下单结束时间"
        sortable
        width="250">
        <template slot-scope="scope">
          <el-date-picker
            style="width:210px"
            size="mini"
            v-model="scope.row.endTimeStr"
            type="datetime"
            placeholder="选择时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right"
            :picker-options="pickerOptions">
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column
        prop="isFirstBook"
        label="首订生效"
        width="120">
        <template slot-scope="scope">
          <el-switch
            :active-value="1"
            :inactive-value="0"
            v-model="scope.row.isFirstBook">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="isCommonBook"
        label="普订生效"
        width="120">
        <template slot-scope="scope">
          <el-switch
            :active-value="1"
            :inactive-value="0"
            v-model="scope.row.isCommonBook">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="isVaild"
        label="状态"
        sortable
        width="80">
        <template slot-scope="scope">
          {{scope.row.isVaild == 1 ?'启用':'停用'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">          
          <el-button
            size="mini"          
            type="primary"
            :loading="loading"
            @click="saveItem(scope.$index, scope.row)">保存</el-button>
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
    <el-dialog title="导入出错数据" width="60%" top="5%" :visible.sync="errDialogVisible">
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
          prop="pCode"
          label="区域"
          width="80">
        </el-table-column>
        <el-table-column
          prop="category"
          label="省办"
          width="80">
        </el-table-column>
        <el-table-column
          prop="isTps"
          label="分销商"
          width="100">
        </el-table-column>
        <el-table-column
          prop="orderUnit"
          label="客户"
          width="100">
        </el-table-column>
        <el-table-column
          prop="orderUnit"
          label="是否限制首订"
          width="120">
        </el-table-column>
        <el-table-column
          prop="orderUnit"
          label="是否限制普订"
          width="120">
        </el-table-column>
        <el-table-column
          prop="orderUnit"
          label="草稿开始日期"
          width="120">
        </el-table-column>
        <el-table-column
          prop="orderUnit"
          label="草稿结束日期"
          width="120">
        </el-table-column>
        <el-table-column
          prop="orderUnit"
          label="下单开始日期"
          width="120">
        </el-table-column>
        <el-table-column
          prop="orderUnit"
          label="下单结束日期"
          width="120">
        </el-table-column>
        <el-table-column
          prop="message"
          label="错误信息">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="errDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择地区" width="30%" top="5%" :visible.sync="dialogVisible">
      <tup-arae-store-select ref="areaSelect" v-model="areaData" :needstore="false"></tup-arae-store-select>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="saveArea">确认</el-button>
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        multipleSelection:[],
        areaData:{
          isarea:'1',
          data:[]
        },
        loading:false,
        currentPage:1,
        total:10,
        searchForm:{
          date:[],
          consumerId:'',
          endTime:'',
          startTime:'',
          isVaild:1,
          regionNoList:[],
          provinceNoList:[],
          provinceObject:[],
          regionObject:[],
          pagingQuery:{
            pageIndex:1,
            pageSize:50
          }
        },
        tableData: [
        ],
        errDialogVisible:false,
        tableLoading:false,
        dialogVisible:false,
        itemIndex:-1,//当前编辑的行索引
        isFirst:true
      }
    },
    watch:{
      'searchForm.date':function(val){
        if(!val){
          this.searchForm.startTime = '';
          this.searchForm.endTime = '';
        }
        else{
          this.searchForm.startTime = val[0];
          this.searchForm.endTime = val[1];
        }
      },
      "searchForm.provinceObject":function(val){
        let datas = [];
        val.map(item=>{
          if(item.code !='999')
            datas.push(item.code)
        })
        this.searchForm.provinceNoList = datas;
      },
      "searchForm.regionObject":function(val){
        let datas = [];
        val.map(item=>{
          if(item.code !='999')
            datas.push(item.code)
        })
        this.searchForm.regionNoList = datas;
      }
    },
    methods: {
      resetForm(){
        this.searchForm = {
          date:[],
          consumerId:'',
          endTime:'',
          startTime:'',
          isVaild:'',
          regionNoList:[],
          provinceNoList:[],
          provinceObject:[],
          regionObject:[],
          pagingQuery:{
            pageIndex:1,
            pageSize:this.searchForm.pagingQuery.pageSize
          }
        }
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='isVaild'){
          if(row[column.property]==1)
            txt = '启用'
          else
            txt = '停用'
        }
        else if(column.property =='endTime' ||
        column.property =='startTime' ||
        column.property =='draftEndTime' || 
        column.property =='draftStartTime' ||
        column.property =='insertTime'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss");
        }
        return txt;
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(val);
      },
      deletes(){
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
          thiz.$tupHttp(thiz,'order/plan/delete','POST',data).then(res=>{
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
          if(!!datas.sheet0[i][0] || !!datas.sheet0[i][1] ||!!datas.sheet0[i][3]){
            arr.push({
              regionNo:datas.sheet0[i][0] ? datas.sheet0[i][0]:'',
              provinceNo:datas.sheet0[i][1] ? datas.sheet0[i][1]:'',
              distributorId :datas.sheet0[i][2] ? datas.sheet0[i][2]:'',
              consumerId:datas.sheet0[i][3] ? datas.sheet0[i][3]:'',
              isFirstBook:datas.sheet0[i][4],
              isCommonBook:datas.sheet0[i][5],
              draftStartTimeStr:datas.sheet0[i][6],
              draftEndTimeStr:datas.sheet0[i][7],
              startTimeStr:datas.sheet0[i][8],
              endTimeStr:datas.sheet0[i][9]
            })
          }          
        }
        let thiz = this;
        this.loading = true;
        thiz.$tupHttp(thiz,'order/plan/importOrderPlanExcel','POST',arr).then(res=>{
          thiz.loading = false;
          if(res.body.valid){
            thiz.$notify.success({
              title: '成功提示',
              message: '操作成功'
            });
            thiz.loadData() 
          }else{
            thiz.errorTableData = res.body.models;
            thiz.errDialogVisible = true;
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
      saveArea(){        
        let thiz = this;
        this.getArea();
        this.dialogVisible = false;
      },
      saveItem(ind,row){
        let thiz = this;
        this.loading = true;
        thiz.$tupHttp(thiz,'order/plan/udpate','POST',row).then(res=>{
          thiz.loadData()
          thiz.loading = false;
        },res=>{
          thiz.loading = false;
        }) 
      },
      setArea(val){
        let thiz = this;  
        let areas = this.isFirst ? this.tableData[val].firstBookProviceCodes : this.tableData[val].commonBookProviceCodes;
        if(areas){
          setTimeout(function(){
              thiz.areaData = {
                isarea:'1',
                data: areas.split(',')
              }
          })          
        } 
      },
      editItemFirstBook(ind,row){
        this.itemIndex = ind;
        this.isFirst = true;
        this.setArea(ind);
        this.dialogVisible = true;        
      },
      editItemCommonBook(ind,row){
        this.itemIndex = ind;
        this.isFirst = false;
        this.setArea(ind);
        this.dialogVisible = true;        
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      },     
      detail(index, row) {
        this.gotoUrl('/frame/terminal/customerInfo/'+row.id)
      },
      downLoad(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        delete data.pagingQuery;
        thiz.$tupHttp(thiz,'order/plan/exportOrderPlanList','POST',data,{},'',true).then(res=>{
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
        thiz.$tupHttp(thiz,'order/plan/list','POST',thiz.searchForm).then(res=>{
          let tableData = res.body.models;
          tableData.map(item=>{
            item.startTimeStr = new Date(item.startTime).format("yyyy-MM-dd hh:mm:ss")
            item.endTimeStr = new Date(item.endTime).format("yyyy-MM-dd hh:mm:ss")
            item.draftStartTimeStr = new Date(item.draftStartTime).format("yyyy-MM-dd hh:mm:ss")
            item.draftEndTimeStr = new Date(item.draftEndTime).format("yyyy-MM-dd hh:mm:ss")
          })
          thiz.tableData = tableData;
          thiz.total = res.body.pageInfo.total;
          thiz.tableLoading = false;
        },res=>{
          thiz.tableLoading = false;
        })
      }
    },
    mounted(){
      $('.el-upload__input').hide();
      //this.getFMonth();
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
