<template>
  <div>
    <el-form  :model="searchForm" label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="客户编号">     
            <el-input v-model="searchForm.clientId" clearable="" size="mini" placeholder="客户编号"></el-input>       
          </el-form-item>
        </el-col>
      </el-row>            
      <el-form-item>
        <div style="line-height: 26px;">
          <el-button style="float:left" icon="el-icon-search" type="primary" size="mini" @click="loadData(true)">查询</el-button>
          <el-button style="float:left" icon="el-icon-refresh" type="primary" size="mini" @click="resetForm">重置</el-button>
          <el-upload
            style="float:left;margin-left:10px;"
            :show-file-list="false"
            :multiple="true"
            :httpRequest="upload">
            <el-button :loading="loading" icon="el-icon-upload2" size="mini" type="primary">上传</el-button>
          </el-upload>  
          &nbsp;&nbsp;
          <el-button size="mini" @click="$util.winOpen('static/useJs/doc/CustomerRole.xlsx?'+$util.getRandom())" type="text">下载模板</el-button>
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
        prop="clientId"
        label="客户编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="roleCode"
        label="角色编码">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称">
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
        errorTableData:[],
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
            pageSize:20
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
            pageSize:20
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
          thiz.$tupHttp(thiz,'client/deleteRole','POST',{idList:data}).then(res=>{
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
          arr.push({
            clientId:datas.sheet0[i][0],
            roleCode:datas.sheet0[i][1]
          })      
        }
        let thiz = this;
        this.loading = true;
        thiz.$tupHttp(thiz,'client/addRole','POST',{list:arr}).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '操作成功'
          });
          thiz.loadData() 
        },res=>{
          thiz.loading = false;
        }) 
      },
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData();
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
        thiz.$tupHttp(thiz,'client/listRole','POST',thiz.searchForm).then(res=>{
          let tableData = res.body.models;
          thiz.tableData = tableData;
          thiz.total = res.body.pageInfo ? res.body.pageInfo.total : 0;
          thiz.tableLoading = false;
        },res=>{
          thiz.tableLoading = false;
        })
      }
    },
    mounted(){
      $('.el-upload__input').hide();
      this.loadData();
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
