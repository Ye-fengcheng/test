<template>
  <div>
    <el-form  :model="searchForm" label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="省办">
            <tup-arae-select v-model="searchForm.provinceObject" ></tup-arae-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="编码">
            <el-input v-model="searchForm.pDistrictoffice" clearable="" size="mini" placeholder="编码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="部门名称">
            <el-input v-model="searchForm.pDistrictofficeName" clearable="" size="mini" placeholder="部门名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">        
        <el-col :span="8">
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="启用" :value="1"></el-option>
              <el-option label="禁用" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="loadData(true)">查询</el-button>
        <el-button icon="el-icon-refresh" type="primary" size="mini" @click="resetForm">重置</el-button>
        <el-button icon="el-icon-download" :loading="loading" size="mini" @click="downLoad()" type="primary">导出</el-button>
        <el-button icon="el-icon-plus" @click="gotoUrl('/frame/terminal/addOrganization')"  size="mini" type="primary">添加</el-button>
        <el-button @click="gotoUrl('/frame/terminal/organizationBP')"  size="mini" type="primary">批量处理</el-button>
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
        prop="code"
        label="编码"
        width="80">
        <template slot-scope="scope">
          <el-input v-model="scope.row.code"  placeholder="编码"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="level"
        label="部门层级"
        width="120">
        <template slot-scope="scope">
          {{scope.row.level == 1 ? '一级部门' :(scope.row.level == 2 ? '二级部门' :'三级部门')}}
        </template>
      </el-table-column>
      <el-table-column
        prop="depName1"
        label="一级部门"
        width="120">
      </el-table-column>
      <el-table-column
        prop="depName2"
        label="二级部门"
        width="120">
      </el-table-column>
      <el-table-column
        prop="name"
        label="部门名称"
        width="160">
        <template slot-scope="scope">
          <el-input v-model="scope.row.name"  placeholder="部门名称"></el-input>
        </template>
      </el-table-column>   
       <el-table-column
        prop="level"
        label="部门级别"
        width="120">
        <template slot-scope="scope">
          {{scope.row.level == 1 ? '区域' :(scope.row.level == 2 ? '省办' :'片区')}}
        </template>
      </el-table-column>   
      <el-table-column
        prop="updateUser"
        label="操作人"
        width="150">
      </el-table-column>
      <el-table-column
        prop="status"
        label="启用状态"
        width="100">
        <template slot-scope="scope">
          <el-switch
            :active-value="1"
            :inactive-value="0"
            v-model="scope.row.status">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        :formatter="formatter"
        label="操作时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button @click="save(scope.$index,scope.row)" :loading="loading" type="primary" size="small">保存</el-button>
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
        comForm:{
          platForm:'',
          roleId:''
        },
        comRules:{
          platForm: [
            { required: true, message: '必填', trigger: 'change' }
          ],
          roleId: [
            { required: true, message: '必填', trigger: 'change' }
          ]
        },
        visible:false,
        loading:false,
        currentPage:1,
        total:10,
        roleData:[],
        roleList:[],
        Dictions:{
          platform_type:[]
        },//本页面使用的所有字典
        searchForm:{
          provinceObject:[],
          pDistrictoffices:[],
          status:'',
          pDistrictoffice:'',
          pDistrictofficeName:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:20
          }
        },
        tableData: [],
        tableLoading:false,
        dialogVisible:false,
        itemIndex:'',//目前编辑的列
      }
    },
    watch:{
      "comForm.platForm":function(val){
        this.comForm.roleId = '';
        if(val){
          this.loadRoleList(val)
        }
        else{
          this.roleList = [];
        }
      },
      "searchForm.provinceObject":function(val){
        let datas = [];
        val.map(item=>{
          if(item.code !='999')
            datas.push(item.code)
        })
        this.searchForm.pDistrictoffices = datas;
      }
    },
    methods: {
      loadRoleList(platForm){
        let thiz = this;
        thiz.$tupHttp(thiz,'employee/role/roleList','POST',{
          platform:platForm,
          pagingQuery:{
            pageIndex:1,
            pageSize:2000
          }
        }).then(res=>{
          thiz.roleList = res.body.models;          
        })
      },
      commitData(){        
        let thiz = this;
        this.loading = true;
        let pUid = this.tableData[this.itemIndex].pUid;
        this.$tupHttp(this,'employee/userRole/bindUserRole?userId='+pUid+'&roleId='+this.comForm.roleId,'GET').then(res=>{
          thiz.loading = false;
          thiz.visible = false;
          thiz.comForm.roleId = '';
          thiz.loadRole(pUid);
        },res=>{
          thiz.loading = false;
          thiz.visible = false;
        })
      },
      commit(){        
        this.$refs.comForm.validate((valid) => {
          if (valid) {
            this.commitData();
          } else {
            return false;
          }
        });
      },
      resetForm(){
        this.searchForm = {
          provinceObject:[],
          pDistrictoffices:[],
          status:'',
          pDistrictoffice:'',
          pDistrictofficeName:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:20
          }
        }
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='updateTime' || column.property =='pGraduationDate'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd hh:mm:ss");
        }
        return txt;
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      },   
      save(index, row) {
        let thiz = this;
        thiz.loading = true;
        thiz.$tupHttp(thiz,'organization/update','POST',row).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功提示',
            message: '保存成功'
          });
          thiz.loadData()
        },res=>{
          thiz.loading = false;
        })
      },  
      detail(index, row) {
        this.gotoUrl('/frame/terminal/customerInfo/'+row.id)
      },
      downLoad(){        
        let thiz = this;
        thiz.loading = true;
        let data = thiz.$util.deepClone(thiz.searchForm);
        delete data.pagingQuery;
        thiz.$tupHttp(thiz,'organization/export','POST',data).then(res=>{
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
        thiz.$tupHttp(thiz,'organization/get','POST',thiz.searchForm).then(res=>{
          thiz.tableData = res.body.models;
          thiz.total = res.body.pageInfo.total
          thiz.tableLoading = false;
        },res=>{
          thiz.tableLoading = false;
        })
      },
      handleCurrentChange(val) {
        this.searchForm.pagingQuery.pageIndex = val;
        this.loadData();
      },
      loadPlatForm(){
        let thiz = this;
        let params = ["platform_type"];
        this.$baseData.getDicts(this,params,function(data){
          thiz.Dictions = data;
        });
      }
    },
    mounted(){
      this.loadData();
      this.loadPlatForm();
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
