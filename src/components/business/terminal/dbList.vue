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
            <tup-arae-select v-model="searchForm.provinceObject" ></tup-arae-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="分销商编号">
            <el-input v-model="searchForm.sDbStr" clearable="" size="mini" placeholder="分销商编号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">  
        
        <el-col :span="8">
          <el-form-item label="分销商姓名">
            <el-input v-model="searchForm.dbName" clearable="" size="mini" placeholder="分销商姓名"></el-input>
          </el-form-item>
        </el-col> 
        <el-col :span="8">
          <el-form-item label="DFS编号">
            <el-input v-model="searchForm.fsNo" clearable="" size="mini" placeholder="FS编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="DM编号">
            <el-input v-model="searchForm.dmNo" clearable="" size="mini" placeholder="DM编号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button style="float:left;" type="primary" icon="el-icon-search" size="mini" @click="loadData(true)">查询</el-button>
        <el-button style="float:left;" icon="el-icon-refresh" type="primary" size="mini" @click="resetForm">重置</el-button>
        <el-button style="float:left;" icon="el-icon-download" :loading="loading" size="mini" @click="downLoad()" type="primary">导出</el-button>
        <el-button style="float:left;" icon="el-icon-plus" @click="gotoUrl('/frame/terminal/addDb')"  size="mini" type="primary">添加</el-button>
        <el-button style="float:left;" icon="el-icon-delete" :disabled="multipleSelection.length==0" size="mini" :loading="loading" @click="deleteDB" type="danger">删除</el-button>
        <el-button style="float:left" icon="el-icon-upload2" @click="gotoUrl('/frame/terminal/dbUpload')"  size="mini" type="primary">上传DB关系</el-button>
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
        prop="regionName"
        label="区域"
        width="100">
      </el-table-column>
      <el-table-column
        prop="provinceName"
        label="省办"
        width="100">
      </el-table-column>
      <!-- <el-table-column
        prop="districtofficeName"
        label="片区"
        width="180">
        <template slot-scope="scope">
          <el-select
            style="width:100%"
            clearable
            size="mini"
            v-model="scope.row.districtofficeCode"
            filterable
            placeholder="请输入关键字">
            <el-option-group
              v-for="group in provinces"
              :key="group.code"
              :label="group.name">
              <el-option
                v-for="item in group.childrens"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-option-group>
          </el-select>
        </template>
      </el-table-column>
    -->
      <el-table-column
        prop="fsNo"
        label="DFS编号"
        width="180">
        <template slot-scope="scope">
          <el-input-employees size="mini" v-model="scope.row.fsNo"></el-input-employees>
        </template>
      </el-table-column>
      <el-table-column
        prop="fsName"
        label="DFS姓名"
        width="100">
      </el-table-column>
      <el-table-column
        prop="dmNo"
        label="DM编号"
        width="180">
        <template slot-scope="scope">
          <el-input-employees size="mini" v-model="scope.row.dmNo"></el-input-employees>
        </template>
      </el-table-column>  
      <el-table-column
        prop="dmName"
        label="DM姓名"
        width="150">
      </el-table-column>
      <el-table-column
        prop="updateUser"
        label="操作人"
        width="150">
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
          prop="dbNo"
          label="DB编号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="districtofficeCode"
          label="所属片区编码"
          width="100">
        </el-table-column>
        <el-table-column
          prop="fsNo"
          label="所属FS编号"
          width="150">
        </el-table-column>
        <el-table-column
          prop="dmNo"
          label="所属DM编号"
          width="150">
        </el-table-column>        
        <el-table-column
          prop="message"
          label="错误信息">
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
        multipleSelection:[],
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
          sProvince:[],
          provinceObject:[],
          sRegion:[],
          areaObject:[],
          isSpecified:'',
          dbName:'',
          sDbStr:'',
          fsNo:'',
          dmNo:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:20
          }
        },
        provinces:[],
        tableData: [],
        tableLoading:false,
        dialogVisible:false,
        errorTableData:[]
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
      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(val);
      },
      deleteDB(){
        let thiz = this;
        thiz.loading = true;
        let data = [];
        this.multipleSelection.map(item=>{
          data.push(item)
        })
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          thiz.$tupHttp(thiz,'db/delete','POST',data).then(res=>{
            thiz.loading = false;
            thiz.loadData();
          },res=>{
            thiz.loading = false;
          }) 
        }).catch(() => {    
          thiz.loading = false;  
        });
        
      },
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
      upload(option){     
        this.$util.readExcel(option.file,this.treatDatas)
      },
      treatDatas(datas){
        let arr = [];
        for(let i =1;i<datas.sheet0.length;i++){
          arr.push({
            dbNo:datas.sheet0[i][1].toString().trim(),
            //districtofficeCode:datas.sheet0[i][2],
            fsNo:datas.sheet0[i][2].toString().trim(),
            dmNo:datas.sheet0[i][3].toString().trim()
          })
        }
        let thiz = this;
        this.loading = true;
        thiz.$tupHttp(thiz,'db/batchInsert','POST',arr).then(res=>{
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
          sProvince:[],
          provinceObject:[],
          sRegion:[],
          areaObject:[],
          isSpecified:'',
          dbName:'',
          sDbStr:'',
          fsNo:'',
          dmNo:'',
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
        thiz.$tupHttp(thiz,'db/update','POST',row).then(res=>{
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
        thiz.$tupHttp(thiz,'db/export','POST',data).then(res=>{
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
        thiz.$tupHttp(thiz,'db/get','POST',thiz.searchForm).then(res=>{
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
      },
      loadArea(){
        let thiz = this;
        thiz.$baseData.areaAllTree(thiz).then(res=>{
          if(res.body.models){
            res.body.models.map(item=>{
              thiz.provinces = thiz.provinces.concat(item.childrens ? item.childrens:[])
            })
          }
        }) 
      }
    },
    mounted(){
      $('.el-upload__input').hide();
      //this.loadData();
      this.loadPlatForm();
      this.loadArea();
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
