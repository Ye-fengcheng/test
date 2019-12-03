<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>设置</el-breadcrumb-item>
      <el-breadcrumb-item>费率及优惠比例设置</el-breadcrumb-item>
    </el-breadcrumb>
    <br/>
    <el-form :model="model" :rules="comRules" label-position="right" ref="comForm" label-width="250px">
      <div class="itemsTitle">费率及优惠比例</div>
      <el-form-item label="AB折扣差使用比例(%)：">    
        <el-input v-model="model.pDiscountdiffrate" style="width:220px;" placeholder=""></el-input>    
      </el-form-item>
      <el-form-item label="优惠券使用比例(%)：">   
        <el-input v-model="model.pCdiscountdiffrate" style="width:220px;" placeholder=""></el-input>         
      </el-form-item>
      <el-form-item label="增值税率(小数)：">    
        <el-input v-model="model.pBeforeValueaddedtaxrate" style="width:220px;" placeholder=""></el-input>             
      </el-form-item>
      <el-form-item label="支付宝手续费率(小数)："> 
        {{model.pAlipayrate}}                    
      </el-form-item>
      <el-form-item label="支付宝单笔转账最高收费金额(元)：">  
        {{model.pAlipaytop}}                   
      </el-form-item>
      <el-form-item label="工行B to C优惠期折扣率(小数)：">  
        {{model.pB2cpprate}}                         
      </el-form-item>
      <el-form-item label="工行B to C手续费率(小数)：">  
        <el-input v-model="model.pB2crate" style="width:220px;" placeholder=""></el-input>                          
      </el-form-item>
      <el-form-item label="工行B to C单笔转账最高收费金额(元)："> 
        <el-input v-model="model.pB2ctop" style="width:220px;" placeholder=""></el-input>                           
      </el-form-item>
      <el-form-item label="工行B to B单笔转账收费金额(元)：">   
        <el-input v-model="model.pB2bfee" style="width:220px;" placeholder=""></el-input>                         
      </el-form-item>
      <el-form-item label="招商银行手续费率(小数)：">      
        <el-input v-model="model.pCmbrate" style="width:220px;" placeholder=""></el-input>                      
      </el-form-item>
      <el-form-item label="招商银行单笔转账最高收费金额(元)：">   
        <el-input v-model="model.pCmbtop" style="width:220px;" placeholder=""></el-input>                         
      </el-form-item>
      <div class="itemsTitle">其他</div>
      <el-form-item label="DB操作功能(修改/删除):" prop="dbUpdataStatus">        
        <el-switch
          :active-value="1"
          :inactive-value="0"
          v-model="model.dbUpdataStatus">
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
        pWorkingStartAm:'',
        pWorkingEndAm:'',
        pWorkingStartPm:'',
        pWorkingEndPm:'',
        model:{
        },
        comRules:{
        },
        loading:false,
        activeName:'zero'
      }
    },
    watch:{
      pWorkingStartAm:function(val){
        this.model.pWorkingStartAm = '1970-01-01 ' + val.format("hh:mm:ss")
      },
      pWorkingEndAm:function(val){
        this.model.pWorkingEndAm = '1970-01-01 ' + val.format("hh:mm:ss")
      },
      pWorkingStartPm:function(val){
        this.model.pWorkingStartPm = '1970-01-01 ' + val.format("hh:mm:ss")
      },
      pWorkingEndPm:function(val){
        this.model.pWorkingEndPm = '1970-01-01 ' + val.format("hh:mm:ss")
      },
      shoppingCartCleanTime:function(val){
        this.model.shoppingCartCleanTime = val.format("yyyy-MM-dd hh:mm:ss")
      }
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
          thiz.pWorkingStartAm = thiz.model.pWorkingStartAm ? new Date(thiz.model.pWorkingStartAm) : new Date()
          thiz.pWorkingEndAm = thiz.model.pWorkingEndAm ? new Date(thiz.model.pWorkingEndAm) : new Date()
          thiz.pWorkingStartPm = thiz.model.pWorkingStartPm ? new Date(thiz.model.pWorkingStartPm) : new Date()
          thiz.pWorkingEndPm = thiz.model.pWorkingEndPm ? new Date(thiz.model.pWorkingEndPm) : new Date()
          thiz.shoppingCartCleanTime = thiz.model.shoppingCartCleanTime ? new Date(thiz.model.shoppingCartCleanTime) : ''
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