<template>
  <div>
    <el-form  :model="searchForm" label-width="120px" class="demo-form-inline">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="区域">            
            <tup-arae-select type="area" size="mini" v-model="searchForm.areasObject"  ></tup-arae-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="省办">
            <tup-arae-select v-model="searchForm.provinceObject"  ></tup-arae-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="员工编号">
            <el-input v-model="searchForm.pUid" clearable="" size="mini" placeholder="员工编号"></el-input>
          </el-form-item>
        </el-col>        
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="账号状态">
            <el-select v-model="searchForm.isDisable" size="mini" clearable filterable  placeholder="请选择">
              <el-option label="禁用" :value="1"></el-option>
              <el-option label="启用" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="员工姓名">
            <el-input v-model="searchForm.pName" clearable="" size="mini" placeholder="员工姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="职位">
            <el-input v-model="searchForm.position" clearable="" size="mini" placeholder="职位"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="loadData(true)">查询</el-button>
        <el-button icon="el-icon-refresh" type="primary" size="mini" @click="resetForm">重置</el-button>
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
        prop="pUid"
        label="员工编号"
        width="80">
      </el-table-column>
      <el-table-column
        prop="pName"
        label="姓名"
        sortable
        width="80">
      </el-table-column>
      <el-table-column
        prop="pMobile"
        label="手机号码"
        width="120">
      </el-table-column>
      <el-table-column
        prop="pEmail"
        label="邮箱"
        width="220">
      </el-table-column>
      <el-table-column
        prop="pRegion"
        label="区域"
        width="120">
      </el-table-column>
      <el-table-column
        prop="pProvince"
        label="省办"
        width="120">
      </el-table-column>
      <el-table-column
        prop="pCityno"
        label="城市"
        width="150">
      </el-table-column>
      <el-table-column
        prop="pFscode"
        label="DFS编号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="pPositionabbr"
        label="职位"
        width="100">
      </el-table-column>
      <el-table-column
        prop="isDisable"
        label="账号状态"
        width="100">
        <template slot-scope="scope">
          {{scope.row.isDisable == 1 ? '禁用':'启用'}}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="300">
        <template slot-scope="scope">
          <el-button v-if="scope.row.isDisable == 1" @click="unban(scope.$index,scope.row)" :loading="loading" type="text" size="small">解除锁定</el-button>
          <el-button v-else @click="ban(scope.$index,scope.row)" :loading="loading" type="text" size="small">锁定</el-button>
          <el-button @click="resetPass(scope.$index,scope.row)" :loading="loading" type="text" size="small">重置密码</el-button>
          <el-button @click="setRole(scope.$index,scope.row)" type="text" size="small">编辑角色</el-button>
          <el-button @click="setPower(scope.$index,scope.row)" type="text" size="small">编辑数据权限</el-button>
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
    <el-dialog title="编辑用户角色" width="60%" top="5%" :close-on-click-modal="false" :visible.sync="dialogVisible">
      <el-popover
        placement="bottom"
        width="260"
        v-model="visible">
          <el-form ref="comForm" :model="comForm" :rules="comRules" label-width="0px">
            <el-form-item label="" prop="platForm">          
              <el-select v-model="comForm.platForm" size="mini" clearable filterable  placeholder="请选择">
                <el-option
                  v-for="item in Dictions.platform_type"
                  :key="item.dictValue"
                  :label="item.dictName"
                  :value="item.dictValue">
                </el-option>
              </el-select>
            </el-form-item> 
            <el-form-item label="" prop="roleId">          
              <el-select v-model="comForm.roleId" size="mini" clearable filterable  placeholder="请选择">
                <el-option
                  v-for="item in roleList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="visible = false">取消</el-button>
          <el-button type="primary" size="mini" @click="commit" :loading="loading">确定</el-button>
        </div>
        <el-button slot="reference"  icon="el-icon-plus" size="mini" type="primary">增加角色</el-button>
      </el-popover>
      <el-table
        :data="roleData"
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
          prop="platform"
          label="系统"
          :formatter="formatter"
          width="100">
        </el-table-column>
        <el-table-column
          prop="code"
          label="角色代码"
          width="100">
        </el-table-column>
        <el-table-column
          prop="name"
          label="角色名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="180">
          <template slot-scope="scope">
            <el-button @click="deleteRole(scope.$index,scope.row)" :loading="loading" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="dialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑数据权限" width="95%" top="5%"  :close-on-click-modal="false" :visible.sync="powerDialogVisible">
      <el-form v-loading="loadingForm" v-if="hackReset" :model="model" ref="modelForm" :inline="true" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item style="margin-bottom:0px" label="员工编号:">          
              {{model.pUid}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="margin-bottom:0px" label="员工姓名:">          
              {{model.pName}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item style="margin-bottom:0px" label="职位:">          
              {{model.pPosition}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="margin-bottom:0px" label="部门信息:">          
              {{model.pRegion  ? (model.pRegion+'-'+model.pProvince+'-'+model.pPositionabbr) : ('总部-'+model.pPositionabbr)}}
            </el-form-item>
          </el-col>
        </el-row>
        <div class="itemsTitle">区域权限设置</div>
        <br/>
        <el-row >
          <el-col :span="12">
            <el-form-item style="margin-bottom:0px" label="权限区域:">          
              <el-select
                style="width:300px"
                size="mini"
                v-model="model.pRegionNoList"
                multiple
                placeholder="请输入关键字">
                  <el-option
                    v-for="item in areas"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="margin-bottom:0px" label="权限省办:">   
                <el-select
                  style="width:300px"
                  size="mini"
                  v-model="model.pProvinceNoList"
                  multiple
                  filterable
                  placeholder="请输入关键字">
                  <el-option-group
                    v-for="group in areas"
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
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="12">
            <el-form-item style="margin-bottom:0px" label="权限片区:">          
              <el-select
                style="width:300px"
                size="mini"
                v-model="model.pDistrictList"
                multiple
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
            </el-form-item>
          </el-col>
        </el-row>
        <div class="itemsTitle">客户权限设置</div>
        <br/>
        <el-row>
          <el-col :span="12">
            <el-button style="float:left" icon="el-icon-plus" @click="addDb" size="mini" ></el-button>
            <el-upload
              style="float:left;margin-left:5px"
              :show-file-list="false"
              :multiple="true"
              :httpRequest="upload">
              <el-button size="mini" type="primary">上传</el-button>
            </el-upload>   
            &nbsp;   
            <el-button @click="$util.winOpen('static/useJs/doc/Customer.xlsx?'+$util.getRandom())" size="mini" type="text">点击下载模板</el-button>
            <el-table
              :data="model.dbList"
              style="width: 99%;"
              height="250"
              highlight-current-row>
                <el-table-column
                  prop="pUid"
                  label="分销商编号">
                  <template slot-scope="scope">
                    <el-input-customer size="mini" v-model="scope.row" :param="scope.row" @onSelect="handleSelect" type="DB" ></el-input-customer>
                  </template>
                </el-table-column>  
                <el-table-column
                  prop="pName"
                  label="分销商名称">
                </el-table-column> 
                <el-table-column
                  label="操作">
                  <template slot-scope="scope">
                    <el-button icon="el-icon-delete"  @click="deleteDb(scope.$index, scope.row)" size="mini"></el-button>
                  </template>
                </el-table-column>
              </el-table>        
          </el-col>
          <el-col :span="12">
            <el-button style="float:left" icon="el-icon-plus" @click="addClient" size="mini" ></el-button>
            <el-upload
              style="float:left;margin-left:5px"
              :show-file-list="false"
              :multiple="true"
              :httpRequest="upload2">
              <el-button size="mini" type="primary">上传</el-button>
            </el-upload>   
            &nbsp;   
            <el-button @click="$util.winOpen('static/useJs/doc/Customer.xlsx?'+$util.getRandom())" size="mini" type="text">点击下载模板</el-button>
            <el-table
              :data="model.outLetList"
              style="width: 99%;"
              height="250"
              highlight-current-row>
                <el-table-column
                  prop="pUid"
                  label="专卖店编号">
                  <template slot-scope="scope">
                    <el-input-customer size="mini" v-model="scope.row" :param="scope.row" @onSelect="handleSelect"></el-input-customer>
                  </template>
                </el-table-column>  
                <el-table-column
                  prop="pName"
                  label="专卖店名称">
                </el-table-column> 
                <el-table-column
                  label="操作">
                  <template slot-scope="scope">
                    <el-button icon="el-icon-delete"  @click="deleteClient(scope.$index, scope.row)" size="mini"></el-button>
                  </template>
                </el-table-column>
              </el-table>   
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="powerDialogVisible = false;">关闭</el-button>
        <el-button @click="commitPower" size="mini" :loading="loading"  type="primary">保存</el-button>      
      </div>
    </el-dialog>
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
          areasObject:[],
          provinces:[],
          regions:[],
          isDisable:'',
          pUid:'',
          pPositionabbrs:[],
          position:'',
          pName:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:20
          }
        },
        model:{},
        tableData: [],
        hackReset:true,
        loadingForm:false,
        areas: [],
        provinces:[],
        tableLoading:false,
        dialogVisible:false,
        powerDialogVisible:false,
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
      "searchForm.position":function(val){
        if(val){
          this.searchForm.pPositionabbrs = [val]
        }
        else{
          this.searchForm.pPositionabbrs = []
        }
      },
      "searchForm.areasObject":function(val){
        let datas = [];
        val.map(item=>{
          if(item.code !='999')
            datas.push(item.code)
        })
        this.searchForm.regions = datas;
      },
      "searchForm.provinceObject":function(val){
        let datas = [];
        val.map(item=>{
          if(item.code !='999')
            datas.push(item.code)
        })
        this.searchForm.provinces = datas;
      },
      "model.pRegionNoList":function(val){
        if(val.length == 0){
          this.model.areaPermission.viewRegion = ''
        }
        else {
          if(val.includes('999')){
            this.model.areaPermission.viewRegion = 999
          }
          else{
            this.model.areaPermission.viewRegion = val.join(',')
          }
        }
      },
      "model.pProvinceNoList":function(val){
        if(val.length == 0){
          this.model.areaPermission.viewProvince = ''
        }
        else {          
          if(val.includes('999')){
            this.model.areaPermission.viewProvince = 999
          }
          else{
            this.model.areaPermission.viewProvince = val.join(',')
          }
        }
      },
      "model.pDistrictList":function(val){
        if(val.length == 0){
          this.model.areaPermission.viewDistrict = ''
        }
        else {
          if(val.includes('999')){
            this.model.areaPermission.viewDistrict = 999
          }
          else{
            this.model.areaPermission.viewDistrict = val.join(',')
          }
        }
      } 
    },
    methods: {
      upload(option){     
        this.$util.readExcel(option.file,this.treatDatas)
      },
      treatDatas(datas){
        let arr = [];
        for(let i =1;i<datas.sheet0.length;i++){
          let had = this.model.dbList.some(data=>{
            return data.pUid == datas.sheet0[i][0]
          })
          if(!had){
            this.model.dbList.push({
              pUid:datas.sheet0[i][0],
              pName:datas.sheet0[i][1]
            })
          }            
        }        
      },
      upload2(option){     
        this.$util.readExcel(option.file,this.treatDatas2)
      },
      treatDatas2(datas){
        let arr = [];
        for(let i =1;i<datas.sheet0.length;i++){
          let had = this.model.outLetList.some(data=>{
            return data.pUid == datas.sheet0[i][0]
          })
          if(!had){
            this.model.outLetList.push({
              pUid:datas.sheet0[i][0],
              pName:datas.sheet0[i][1]
            })
          }            
        }        
      },
      handleSelect(row,selectRow){
        row.pUid = selectRow.pUid;
        row.pName = selectRow.pName;
      },
      addDb(){
        this.model.dbList.push({
          pUid:'',
          pName:''
        });
      },
      deleteDb(ind,row){
        this.model.dbList.splice(ind,1);
      },
      addClient(){
        this.model.outLetList.push({
          pUid:'',
          pName:''
        });
      },
      deleteClient(ind,row){
        this.model.outLetList.splice(ind,1);
      },
      commitPower(){        
        let thiz = this;
        this.loading = true;
        this.$tupHttp(this,'permission/update','POST',this.model).then(res=>{
          thiz.loading = false;
          thiz.powerDialogVisible = false;
          thiz.$notify.success({
            title: '成功',
            message : '保存成功'
          });
        },res=>{
          thiz.loading = false;
          //thiz.powerDialogVisible = false;
        })
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
          provinces:[],
          areasObject:[],
          pPositionabbrs:[],
          position:'',
          regions:[],
          isDisable:'',
          pUid:'',
          pName:'',
          pagingQuery:{
            pageIndex:1,
            pageSize:20
          }
        }
      },
      formatter(row, column) {
        let txt = ''
        if(column.property =='pFirstorderDate' || column.property =='pGraduationDate'){
          if(row[column.property])
            txt = new Date(row[column.property]).format("yyyy-MM-dd");
        }
        else if(column.property =='platform'){
          this.Dictions.platform_type.map(item=>{
            if(row[column.property]==item.dictValue){
              txt = item.dictName
            }
          }) 
        }
        return txt;
      },
      deleteRole(index, row) {        
        let thiz = this;
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let pUid = this.tableData[this.itemIndex].pUid;
          this.loading = true;
          this.$tupHttp(this,'employee/userRole/deleteUserRoleById?userRoleId='+row.userRoleId,'GET').then(res=>{
            thiz.loadRole(pUid);
            thiz.loading = false;
          },res=>{
            thiz.loading = false;
          })
        }).catch(() => {
          this.loading = false;         
        });
        
      },
      setRole(ind,row){
        this.itemIndex = ind;
        this.dialogVisible = true;
        this.loadRole(row.pUid)        
      },
      setPower(ind,row){
        let thiz = this;
        this.hackReset = false;
        thiz.$nextTick(function(){
          thiz.hackReset = true;
          thiz.model = row;
          thiz.powerDialogVisible = true;
          thiz.loadPower(row.pUid);
          
        })
        setTimeout(function(){
          $('.el-upload__input').hide();
        })
      },
      loadPower(pUid){
        let thiz = this;
        thiz.loadingForm = true;
        thiz.$tupHttp(thiz,'permission/getDetail','POST',{pUid:pUid}).then(res=>{
          let data = res.body.model;
          thiz.model.dbList =[]
          thiz.model.outLetList  = []
          thiz.model.pRegionNoList  = []
          thiz.model.pProvinceNoList  = []
          thiz.model.pDistrictList  = []
          thiz.model.areaPermission = {}
          if(data){
            thiz.model.dbList = data.dbList ? data.dbList : []
            thiz.model.outLetList  = data.outLetList ? data.outLetList : []
            thiz.model.areaPermission = data.areaPermission ? data.areaPermission : {}
            if(data.areaPermission){
              thiz.model.pRegionNoList  = data.areaPermission.viewRegion ? data.areaPermission.viewRegion.split(',') : []
              thiz.model.pProvinceNoList  = data.areaPermission.viewProvince ? data.areaPermission.viewProvince.split(',') : []
              thiz.model.pDistrictList  = data.areaPermission.viewDistrict ? data.areaPermission.viewDistrict.split(',') : []
            }                       
          }
          thiz.loadingForm = false;
        },res=>{
          thiz.loadingForm = false;
        })
      },
      loadRole(pUid){
        let thiz = this;
        thiz.$tupHttp(thiz,'employee/userRole/getRoleByUserId?userId='+pUid,'GET').then(res=>{
          thiz.roleData = res.body.models;
        })
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      },  
      ban(index, row) {
        let thiz = this;
        this.$confirm('是否锁定此用户的操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          thiz.loading = true;
          thiz.$tupHttp(thiz,'employee/ban?employeeId='+row.pUid,'POST').then(res=>{
            thiz.loading = false;
            thiz.$notify.success({
              title: '成功提示',
              message: '锁定成功'
            });
            thiz.loadData()
          },res=>{
            thiz.loading = false;
          })
        }).catch(() => {    
          thiz.loading = false;  
        }); 
      }, 
      unban(index, row) {
        let thiz = this;
        this.$confirm('是否解除用户的锁定状态?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          thiz.loading = true;
          thiz.$tupHttp(thiz,'employee/unban?employeeId='+row.pUid,'POST').then(res=>{
            thiz.loading = false;
            thiz.$notify.success({
              title: '成功提示',
              message: '解除锁定成功'
            });
            thiz.loadData()
          },res=>{
            thiz.loading = false;
          })
        }).catch(() => {    
          thiz.loading = false;  
        });        
      },  
      resetPass(index, row) {
        let thiz = this;        
        this.$confirm('此操作将重置密码, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          thiz.loading = true;
          thiz.$tupHttp(thiz,'employee/resetPassword?employeeId='+row.pUid,'GET').then(res=>{
            thiz.loading = false;
            thiz.$notify.success({
              title: '成功提示',
              message: '重置密码成功'
            });
          },res=>{
            thiz.loading = false;
          })
        }).catch(() => {    
          thiz.loading = false;  
        });
      },
      detail(index, row) {
        this.gotoUrl('/frame/terminal/customerInfo/'+row.id)
      },
      loadData(isSearch){
        let thiz = this;
        thiz.tableLoading = true;
        if(isSearch)
          thiz.searchForm.pagingQuery.pageIndex = 1;//重置为第一页
        thiz.$tupHttp(thiz,'employee/listAllEmployees','POST',thiz.searchForm).then(res=>{
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
          thiz.areas = res.body.models
          if(thiz.areas){
            thiz.areas.unshift({code:'999',name:'全部',childrens:[{code:'999',name:'全部',childrens:[{code:'999',name:'全部'}]}]})
            thiz.areas.map(item=>{
              thiz.provinces = thiz.provinces.concat(item.childrens ? item.childrens:[])
            })
          }
        }) 
      }
    },
    mounted(){
      this.loadData();
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
