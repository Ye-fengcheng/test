<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>设置允许修改预估填报时间</el-breadcrumb-item>
    </el-breadcrumb>
    <br/>
    <el-form :model="model" :rules="comRules" label-position="right" ref="comForm" label-width="250px">
      <el-form-item label="财务年">
        <el-select v-model="model.estimatedOrderDateYear" size="mini" filterable  placeholder="请选择">
          <el-option
            v-for="item in years"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="财务月">
        <el-select v-model="model.estimatedOrderDateMonth" size="mini" filterable  placeholder="请选择">
          <el-option
            v-for="item in months"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="允许修改:" prop="estimatedOrderSwitch">        
        <el-switch
          :active-value="1"
          :inactive-value="2"
          v-model="model.estimatedOrderSwitch">
        </el-switch>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="commit" :loading="loading"  type="primary">保存</el-button>      
    </div>  
    <!-- <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="系统参数设置" name="zero">
        <el-row :gutter="20">
          <el-col :span="2">&nbsp;</el-col>
          <el-col :span="20">
            
          </el-col>
          <el-col :span="2">&nbsp;</el-col>
        </el-row>        
        
      </el-tab-pane>
    </el-tabs> -->
  </div>
</template>

<script>
  export default {
    data() {
      return {
        years:[],
        months:[
          {
            value: '1',
            label: '1'
          },
          {
            value: '2',
            label: '2'
          },
          {
            value: '3',
            label: '3'
          },
          {
            value: '4',
            label: '4'
          },
          {
            value: '5',
            label: '5'
          },
          {
            value: '6',
            label: '6'
          },
          {
            value: '7',
            label: '7'
          },
          {
            value: '8',
            label: '8'
          },
          {
            value: '9',
            label: '9'
          },
          {
            value: '10',
            label: '10'
          },
          {
            value: '11',
            label: '11'
          },
          {
            value: '12',
            label: '12'
          }
        ],
        model:{
        },
        comRules:{
        },
        loading:false,
        activeName:'zero'
      }
    },
    watch:{
    },
    methods: {
      commitData(){
        let thiz = this;
        this.loading = true;
        let data = this.$util.deepClone(thiz.model);
        thiz.$tupHttp(thiz,'orderEstimate/updateOrderEstimateSwitch','POST',data,{},'/manage-psi/',false,'').then(res=>{
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
      commit(){
        this.$refs.comForm.validate((valid) => {
          if (valid) {
            this.commitData();
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
      }
    },
    mounted(){
      let currentYear = (new Date()).getFullYear()+1;
      for(let i=currentYear;i>=parseInt(currentYear-10);i--){
        this.years.push({
          value:i,
          lable:i
        })
      }
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