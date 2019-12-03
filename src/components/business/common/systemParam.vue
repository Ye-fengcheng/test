<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>设置</el-breadcrumb-item>
      <el-breadcrumb-item>基础参数配置信息</el-breadcrumb-item>
    </el-breadcrumb>
    <br/>
    <el-form :model="model" :rules="comRules" label-position="right" ref="comForm" label-width="250px">
      <div class="itemsTitle">工作时间</div>
      <el-form-item label="上午上班开始时间：">        
        {{model.pWorkingStartAm.split(' ')[1]}}
      </el-form-item>
      <el-form-item label="上午上班结束时间：">        
        {{model.pWorkingEndAm.split(' ')[1]}}
      </el-form-item>
      <el-form-item label="下午上班开始时间：">        
        {{model.pWorkingStartPm.split(' ')[1]}}
      </el-form-item>
      <el-form-item label="下午上班结束时间：">        
        {{model.pWorkingEndPm.split(' ')[1]}}
      </el-form-item>
      <el-form-item label="节假日及财务月：">   
        <el-button
          size="mini" 
          type="primary"       
          @click="dialogVisible = true">查看</el-button>     
        <el-dialog title="节假日及财务月" width="60%" top="5%" :visible.sync="dialogVisible">
          <tup-calendar></tup-calendar>
        </el-dialog>        
      </el-form-item>
      <div class="itemsTitle">订单配置</div>
      <el-form-item label="金额阈值(元)：">        
        {{$util.formatThousand(model.pAmountThreshold,0)}}
      </el-form-item>
      <el-form-item label="数量阈值(单个非0元产品)：">        
        {{model.pQtyThreshold}}
      </el-form-item>
      <el-form-item label="普通店订单有效期(工作小时)：">        
        {{model.pOrdValidTime}}
      </el-form-item>
      <el-form-item label="代表店订单有效期(工作小时)：">        
        {{model.pOrdValidTimeRepresent}}
      </el-form-item>
      <el-form-item label="普通订单最小下单金额(元)：">        
        {{$util.formatThousand(model.pMinorderamount,0)}}    (注：优惠前零售额)
      </el-form-item>
      <el-form-item label="首订订单最小下单金额(元)：">        
        {{$util.formatThousand(model.firstOrderMinimum,0)}}     (注：优惠前零售额)
      </el-form-item>
      <el-form-item label="购物车清理时间：">        
        {{model.shoppingCartCleanTime}}
      </el-form-item>
      <div class="itemsTitle">费率及优惠比例</div>
      <el-form-item label="AB折扣差使用比例(%)：">        
        {{model.pDiscountdiffrate}}
      </el-form-item>
      <el-form-item label="优惠券使用比例(%)：">        
        {{model.pCdiscountdiffrate}}
      </el-form-item>
      <el-form-item label="增值税率(小数)：">        
        {{model.pBeforeValueaddedtaxrate}}
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
        {{model.pB2crate}}
      </el-form-item>
      <el-form-item label="工行B to C单笔转账最高收费金额(元)：">        
        {{model.pB2ctop}}
      </el-form-item>
      <el-form-item label="工行B to B单笔转账收费金额(元)：">        
        {{model.pB2bfee}}
      </el-form-item>
      <el-form-item label="招商银行手续费率(小数)：">        
        {{model.pCmbrate}}
      </el-form-item>
      <el-form-item label="招商银行单笔转账最高收费金额(元)：">        
        {{model.pCmbtop}}
      </el-form-item>
      <div class="itemsTitle">其他</div>
      <el-form-item label="DB操作功能(修改/删除):" prop="dbUpdataStatus">        
        <el-switch
          :active-value="1"
          :inactive-value="0"
          disabled
          v-model="model.dbUpdataStatus">
        </el-switch>
      </el-form-item>
    </el-form>
    <!-- <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="系统参数设置" name="zero">
        <el-row :gutter="20">
          <el-col :span="2">&nbsp;</el-col>
          <el-col :span="20">
            
          </el-col>
          <el-col :span="2">&nbsp;</el-col>
        </el-row>        
        <div class="dialog-footer">
          <el-button @click="commit" :loading="loading"  type="primary">保存</el-button>      
        </div>  
      </el-tab-pane>
    </el-tabs> -->
  </div>
</template>

<script>
  import tupCalendar from '@/components/business/assembly/tupCalendar/tupCalendar'
  export default {
    data() {
      return {
        dialogVisible:false,
        model:{
        },
        comRules:{
        },
        loading:false,
        activeName:'zero'
      }
    },
    components: {
      tupCalendar
    },
    watch:{
    },
    methods: {
      commitData(){
        let thiz = this;
        this.loading = true;
        let data = this.$util.deepClone(thiz.model);
        thiz.$tupHttp(thiz,'systemParameters/update','POST',data).then(res=>{
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
        thiz.$tupHttp(thiz,'systemParameters/get','POST').then(res=>{
          thiz.model = res.body.model;  
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