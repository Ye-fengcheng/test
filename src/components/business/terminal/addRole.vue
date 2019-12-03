<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item >终端管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/frame/terminal/role/'+$route.params.id}">角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加角色</el-breadcrumb-item>
    </el-breadcrumb>
    <br/>
    <div class="itemsTitle"></div>
    <br/>
    <br/>
    <div style="width:100%">
      <el-form :model="comForm" :rules="comRules" ref="comForm" label-width="160px">
        <el-form-item label="角色代码" prop="code">          
          <el-input v-model="comForm.code"  placeholder=""></el-input>
        </el-form-item> 
        <el-form-item label="角色名称" prop="name">          
          <el-input v-model="comForm.name"  placeholder=""></el-input>
        </el-form-item> 
        <el-form-item label="备注" prop="remark">          
          <el-input v-model="comForm.remark" type="textarea" :rows="2" placeholder=""></el-input>
        </el-form-item>
        
        <el-form-item label="菜单权限" prop="promotionDisplay">
          <el-tabs v-model="activeName" type="card">
            <el-tab-pane v-for="item in platFormData" :key="item.dictValue" :label="item.dictName" :name="item.dictValue">
            </el-tab-pane>
          </el-tabs>
          <div v-loading="treeLoading" style="height:420px;overflow-y:auto;border:1px solid #ccc;border-radius: 5px">
            <el-tree
              :data="menus"
              :default-expand-all="true"
              :expand-on-click-node="false"
              show-checkbox
              ref="menuTree"
              node-key="id"
              :props="defaultProps">
            </el-tree>  
          </div>
        </el-form-item>
      </el-form>
    </div>
    
    <div class="dialog-footer">
      <el-button @click="$router.go(-1)">返回</el-button>
      <el-button @click="commit" :loading="loading" type="primary">确认</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        platFormData:[],
        activeName:this.$route.params.id,
        comForm:{
          name:'',
          platform:this.$route.params.id,
          menuList:[],
          code:'',
          remark:''
        },
        comRules:{
          name: [
            { required: true, message: '必填', trigger: 'change' }
          ],
          code:[
            { required: true, message: '必填', trigger: 'change' }
          ]
        },
        loading:false,
        menus:[],
        treeLoading:false,
        defaultProps: {
          children: 'menuChild',
          label: 'name',
        },
      }
    },
    watch:{
      activeName:function(val){
        this.comForm.platform = val;
        this.loadMenu(val);
      }
    },
    methods: {
      commitData(){        
        let thiz = this;
        this.loading = true;
        let data = thiz.$util.deepClone(thiz.comForm);
        data.menuList = this.$refs.menuTree.getCheckedKeys(true);
        thiz.$tupHttp(thiz,'employee/userRole/createRole','POST',data).then(res=>{
          thiz.$notify.success({
            title: '成功提示',
            message: '角色创建成功'
          });
          thiz.comForm = {
            name:'',
            platform:thiz.activeName,
            menuList:[],
            code:'',
            remark:''
          }
          thiz.$refs.menuTree.setCheckedKeys([])
          thiz.loading = false;
        },res=>{
          thiz.loading = false;
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
      loadPlatForm(){
        let thiz = this;
        let params = ["platform_type"];
        this.$baseData.getDicts(this,params,function(data){
          thiz.platFormData = data.platform_type;
        });
      }
    },
    mounted(){
      this.loadPlatForm();
      this.loadMenu(this.activeName);
    }
  }
</script>
<style scoped>
.itemsTitle{
  font-size: 20px;
  border-bottom: 1px solid #ccc;
}
.dialog-footer{
  width: 100%;
  margin-top: 10px;
  text-align: right;
}
.grid-content{
  border: 0px solid #eee;
  padding: 5px;
  border-radius: 5px;
}
.transition-box {
  margin-bottom: 10px;
  width: 80px;
  height: 80px;
  border-radius: 4px;
  background-color: #ff7700;
  text-align: center;
  color: #fff;
  padding: 30px 20px;
  box-sizing: border-box;
  margin-right: 20px;
}
</style>
