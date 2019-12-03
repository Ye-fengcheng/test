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
          <div v-loading="treeLoading" style="height:420px;overflow-y:auto;border:1px solid #ccc;border-radius: 5px">
            <el-tree
              :data="menus"
              :default-expand-all="true"
              :expand-on-click-node="false"
              show-checkbox
              :default-checked-keys="comForm.menuList"
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
        itemId:this.$route.params.itemId,
        activeName:this.$route.params.id,
        comForm:{
          name:'',
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
        this.loadMenu(val);
      }
    },
    methods: {
      commitData(){        
        let thiz = this;
        this.loading = true;
        let data = thiz.$util.deepClone(thiz.comForm);
        let arr = [];
        arr = arr.concat(this.$refs.menuTree.getCheckedKeys(true))
        /* debugger
        arr = arr.concat(this.$refs.menuTree.getHalfCheckedKeys()) */
        data.menuList = arr
        thiz.$tupHttp(thiz,'employee/userRole/updateRole','POST',data).then(res=>{
          thiz.$notify.success({
            title: '成功提示',
            message: '修改角色成功'
          });
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
          thiz.menus = [{'menuChild':res.body.models,'id':0,'code':0,'name':'所有菜单'}]
          thiz.treeLoading = false;
        },res=>{
          thiz.treeLoading = false;
        })
      },
      loadInfo(){
        let thiz = this;
        this.$tupHttp(this,'employee/role/info?roleId='+this.itemId+'&platform='+this.activeName,'GET').then(res=>{
          thiz.comForm = res.body.model;
          if(thiz.comForm.menuList){
            thiz.$refs.menuTree.setCheckedKeys(thiz.comForm.menuList)
          }
        })
      }
    },
    mounted(){
      this.loadInfo()
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
