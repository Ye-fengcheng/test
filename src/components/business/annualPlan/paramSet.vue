<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>利润测算与目标预估填报设置</el-breadcrumb-item>
    </el-breadcrumb>
    <br/>
    <el-form :model="model" :rules="comRules" label-position="right" ref="comForm" label-width="250px">
      <el-form-item label="允许修改:" prop="profitCalculationSwitch">        
        <el-switch
          :active-value="1"
          :inactive-value="2"
          v-model="model.profitCalculationSwitch">
        </el-switch>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="commit" :loading="loading"  type="primary">保存</el-button>      
    </div> 
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>DB目标分解填报设置</el-breadcrumb-item>
    </el-breadcrumb>
    <br/>
    <el-form :model="dbModel" :rules="dbRules" label-position="right" ref="dbForm" label-width="250px">
      <el-form-item label="允许修改:" prop="profitCalculationSwitch">        
        <el-switch
          :active-value="1"
          :inactive-value="2"
          v-model="dbModel.status">
        </el-switch>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="commitDb" :loading="dbloading"  type="primary">保存</el-button>      
    </div>  
  </div>
</template>

<script>
  export default {
    data() {
      return {
        model:{
        },
        comRules:{
        },
        dbModel:{
        },
        dbRules:{
        },
        loading:false,
        dbloading:false
      }
    },
    watch:{
    },
    methods: {
      commitData(){
        let thiz = this;
        this.loading = true;
        let data = this.$util.deepClone(thiz.model);
        thiz.$tupHttp(thiz,'systemParameters/update','POST',data,{},'/system-parameters/',false,'').then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功',
            message : '保存成功'
          });
          thiz.getData()
        },res=>{
          thiz.loading = false;
        })
      }, 
      commitDbData(){
        let thiz = this;
        this.dbloading = true;
        let data = this.$util.deepClone(thiz.dbModel);
        thiz.$tupHttp(thiz,'dbTargetEstimate/updateSwitch?id='+data.id+'&status='+data.status+'&switchName='+data.switchName,'POST',{},{},'/manage-psi/',false,'').then(res=>{
          thiz.dbloading = false;
          thiz.$notify.success({
            title: '成功',
            message : '保存成功'
          });
          thiz.getData()
        },res=>{
          thiz.dbloading = false;
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
      commitDb(){
        this.$refs.dbForm.validate((valid) => {
          if (valid) {
            this.commitDbData();
          } else {
            return false;
          }
        });
      },
      getData(){
        let thiz = this;
        thiz.$tupHttp(thiz,'systemParameters/get','POST',null,{},'/system-parameters/',false,'').then(res=>{
          thiz.model = res.body.model; 
        }) 
        thiz.$tupHttp(thiz,'dbTargetEstimate/getSwitch','POST',null,{},'/manage-psi/',false,'').then(res=>{
          thiz.dbModel = res.body.models[0]; 
        }) 
      }
    },
    mounted(){
      this.getData();      
    }
  }
</script>

<style scoped>
.itemsTitle{
  font-size: 16px;
  border-bottom: 1px solid #ccc;
}
.dialog-footer{
  margin-top: 30px;
  text-align: center;
}
</style>