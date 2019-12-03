<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>设置</el-breadcrumb-item>
      <el-breadcrumb-item>时间和订单参数设置</el-breadcrumb-item>
    </el-breadcrumb>
    <br/>
    <el-form :model="model" :rules="comRules" label-position="right" ref="comForm" label-width="250px">
      <div class="itemsTitle">工作时间</div>
      <el-form-item label="上午上班开始时间：">        
        <el-time-picker
          v-model="pWorkingStartAm"
          :picker-options="{
            selectableRange: '07:00:00 - 22:00:00'
          }"
          placeholder="选择时间">
        </el-time-picker>
      </el-form-item>
      <el-form-item label="上午上班结束时间：">   
        <el-time-picker
          v-model="pWorkingEndAm"
          :picker-options="{
            selectableRange: '07:00:00 - 22:00:00'
          }"
          placeholder="选择时间">
        </el-time-picker>     
      </el-form-item>
      <el-form-item label="下午上班开始时间：">  
        <el-time-picker
          v-model="pWorkingStartPm"
          :picker-options="{
            selectableRange: '07:00:00 - 22:00:00'
          }"
          placeholder="选择时间">
        </el-time-picker>      
      </el-form-item>
      <el-form-item label="下午上班结束时间：">  
        <el-time-picker
          v-model="pWorkingEndPm"
          :picker-options="{
            selectableRange: '07:00:00 - 22:00:00'
          }"
          placeholder="选择时间">
        </el-time-picker>      
      </el-form-item>
      <div class="itemsTitle">订单配置</div>
      <el-form-item label="金额阈值(元)：">    
        <el-input v-model="model.pAmountThreshold" style="width:220px;" placeholder=""></el-input>    
      </el-form-item>
      <el-form-item label="数量阈值(单个非0元产品)：">     
        <el-input v-model="model.pQtyThreshold" style="width:220px;" placeholder=""></el-input>      
      </el-form-item>
      <el-form-item label="普通店订单有效期(工作小时)：">    
        <el-input v-model="model.pOrdValidTime" style="width:220px;" placeholder=""></el-input>       
      </el-form-item>
      <el-form-item label="代表店订单有效期(工作小时)：">     
        <el-input v-model="model.pOrdValidTimeRepresent" style="width:220px;" placeholder=""></el-input> 
      </el-form-item>
      <el-form-item label="普通订单最小下单金额(元)：">        
        <el-input v-model="model.pMinorderamount" style="width:220px;" placeholder=""></el-input>    (注：优惠前零售额)
      </el-form-item>
      <el-form-item label="首订订单最小下单金额(元)：">        
        <el-input v-model="model.firstOrderMinimum" style="width:220px;" placeholder=""></el-input>     (注：优惠前零售额)
      </el-form-item>
      <el-form-item label="购物车清理时间：">  
        <el-date-picker
          v-model="shoppingCartCleanTime"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>      
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
        shoppingCartCleanTime:'',
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