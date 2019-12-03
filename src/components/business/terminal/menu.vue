<template>
<div>
  <el-table
      :data="tableData"
      v-loading="tableLoading"
      style="width: 100%;"
      height="450"
      highlight-current-row>
      <el-table-column
        type="index"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="dictName"
        label="系统名称"
        sortable
        width="250">
      </el-table-column>
      <el-table-column
        prop="dictValue"
        label="系统编码"
        sortable
        width="100">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"        
            @click="menuManage(scope.$index, scope.row)">菜单管理</el-button>
        </template>
      </el-table-column>
  </el-table>
  <el-dialog title="菜单管理" width="80%" top="5%" :visible.sync="dialogVisible">
     <el-form ref="comForm" v-if="isAdd!=null" :model="comForm" :rules="comRules" :inline="true" label-width="110px">
      <el-form-item v-if="isAdd" label="上级菜单" prop="pName">          
        <el-input v-model="comForm.pName" size="mini" disabled placeholder=""></el-input>
      </el-form-item>
      <el-form-item v-if="!isAdd" label="上级菜单ID" prop="pId">          
        <el-input v-model="comForm.pId"  size="mini" placeholder="上级菜单ID"></el-input>
      </el-form-item>
      <el-form-item label="菜单名称" prop="name">          
        <el-input v-model="comForm.name"  size="mini" placeholder="菜单名称"></el-input>
      </el-form-item> 
      <el-form-item label="菜单编码" prop="code">          
        <el-input size="mini" v-model="comForm.code"  placeholder="菜单编码"></el-input>
      </el-form-item>
      <el-form-item label-width="250px" label="子账号可见（叶子菜单节点有效）" prop="subPermission">          
        <el-switch
          :active-value="1"
          :inactive-value="0"
          v-model="comForm.subPermission">
        </el-switch>
      </el-form-item>
      <el-form-item label="" prop="">     
        <el-button type="primary" size="mini" v-if="isAdd" @click="commit" :loading="loading">新增</el-button>
        <el-button type="primary" size="mini" v-if="isAdd==false" @click="commit" :loading="loading">保存</el-button>
      </el-form-item>
    </el-form>
     <div v-loading="treeLoading" style="height:420px;overflow-y:auto;border:1px solid #ccc;border-radius: 5px">
      <el-tree
        @check-change='treeChange'
        :data="menus"
        :expand-on-click-node="false"
        ref="menuTree"
        node-key="id"
        :props="defaultProps">
        <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label +'('+ data.code +',ID:'+ data.id +')'}}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => append(data)">
            新增
          </el-button>
           <el-button
            type="text"
            size="mini"
            v-if="node.data.id !=''"
            @click="() => edit(node,data)">
            编辑
          </el-button>
          <el-button
            type="text"
            size="mini"
            v-if="node.data.id !=''"
            @click="() => remove(node, data)">
            移除
          </el-button>
        </span>
      </span>
      </el-tree>  
     </div>
  </el-dialog>
</div>
</template>

<script>
  export default {
    data() {
      return {
        defaultProps: {
          children: 'menuChild',
          label: 'name',
        },
        platform:'',
        comForm:{
          name:'',
          code:'',
          pName:'',
          subPermission:1,
          pId:'',
          platform:this.platform,
          id:''
        },
        comRules:{
          name: [
            { required: true, message: '必填', trigger: 'change' }
          ],
          code: [
            { required: true, message: '必填', trigger: 'change' }
          ]
        },
        menus:[],
        treeLoading:false,
        visible:false,
        total:0,
        id:this.$route.params.id,
        currentPage:1,
        tableLoading:false,
        loading:false,
        dialogVisible:false,
        itemIndex:-1,//当前编辑的行索引
        tableData: [
        ],
        isAdd:null,
        currentItem:{}
      }
    },
    watch:{
      currentItem:function(val){
        if(this.isAdd){
          //添加
          this.comForm = {
            name:'',
            code:'',
            subPermission:1,
            pName:val.name,
            pId:val.id,
            platform:this.platform,
            id:''
          }
        }else{
          //编辑模式
          this.comForm = this.$util.deepClone(val);
        }        
      }
    },
    methods: {
      gotoUrl(url){
        this.$router.push({ path: url });
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
      commitData(){        
        let thiz = this;
        this.loading = true;
        if(this.isAdd){
          this.$tupHttp(this,'employee/roleMenu/createMenu','POST',this.comForm).then(res=>{
            thiz.loadMenu(thiz.platform);
            thiz.loading = false;
            thiz.comForm = {
              name:'',
              code:'',
              pName:'',
              pId:'',
              subPermission:1,
              platform:this.platform,
              id:''
            }
            thiz.isAdd = null;
          },res=>{
            thiz.loading = false;
          })
        }
        else{
          //保存
          this.$tupHttp(this,'employee/roleMenu/updateMenu','POST',this.comForm).then(res=>{
            thiz.loadMenu(thiz.platform);
            thiz.loading = false;
            thiz.comForm = {
              name:'',
              code:'',
              pName:'',
              pId:'',
              platform:this.platform,
              id:''
            }
            thiz.isAdd = null;
          },res=>{
            thiz.loading = false;
          })
        }
      },
      edit(node,data) {
        this.currentItem = data;
        this.isAdd = false;        
      },
      append(data) {
        this.isAdd = true;
        this.currentItem = data;        
      },
      remove(node, data) {
        let thiz = this;
        this.loading = true;
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          thiz.$tupHttp(this,'employee/roleMenu/deleteMenu?menuId='+data.id,'GET').then(res=>{
            thiz.loadMenu(thiz.platform);
            thiz.loading = false;
            thiz.comForm = {
              name:'',
              code:'',
              pName:'',
              pId:'',
              platform:this.platform,
              id:''
            }
            thiz.isAdd = null;
          },res=>{
            thiz.loading = false;
          })
        }).catch(() => {    
          thiz.loading = false;  
        });
        
      },
      menuManage(index, row) {
        this.itemIndex = index;
        this.dialogVisible = true;
        this.platform = row.dictValue;
        this.loadMenu(row.dictValue)
      },
      loadMenu(id){
        let thiz = this;
        this.treeLoading = true;
        this.$tupHttp(this,'employee/roleMenu/menuTree?platform='+id,'GET').then(res=>{
          thiz.menus = [{'menuChild':res.body.models,'id':'','code':0,'name':'所有菜单'}]
          thiz.treeLoading = false;
        },res=>{
          thiz.treeLoading = false;
        })
      },
      loadData(){
        let thiz = this;
        thiz.tableLoading = true;
        let params = ["platform_type"];
        this.$baseData.getDicts(this,params,function(data){
          thiz.tableData = data.platform_type;
          thiz.tableLoading = false;
        });
      }
    },
    mounted(){
      this.loadData()
    }
  }
</script>
<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
