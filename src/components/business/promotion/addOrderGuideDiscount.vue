<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/frame/promotion/index' }">促销</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/frame/promotion/promotionGuide/'+$route.params.promotionId  + '/' + +$route.params.promotionThemeType}">促销规则</el-breadcrumb-item>
      <el-breadcrumb-item>添加优惠</el-breadcrumb-item>
    </el-breadcrumb>
    <br/>
    <div style="width:100%">
      <div style="float:left;width:100px">
        <div class="transition-box">优惠</div>
      </div>
      <div style="margin-left:100px">
        <el-form :model="comForm" :rules="comRules" ref="comForm" label-width="160px">
          <div class="itemsTitle">促销设置</div>
          <br/>
          <el-form-item label="名称" prop="title">          
            <el-input v-model="comForm.title"  placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">          
            <el-input v-model="comForm.description"  placeholder="" type="textarea" :rows="2"></el-input>
          </el-form-item> 
          <el-form-item label="是否显示" prop="promotionDisplay">
            <el-switch v-model="comForm.promotionDisplay"></el-switch>
          </el-form-item> 
          <div class="itemsTitle">规则有效时间设置</div>
          <br/>
          <el-form-item label="生效时间" prop="date">
            <el-date-picker
              v-model="comForm.date"
              :picker-options="pickerOptions1"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['09:00:00', '18:00:00']"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>      
          <el-form-item v-if="promotionThemeType == 1" label="规则适用范围" prop="orderType">
            <el-radio v-model="comForm.orderType" :label="2">仅限普订</el-radio>
            <el-radio v-model="comForm.orderType" :label="3">首普订</el-radio>            
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-radio v-model="comForm.remark" label="0">空</el-radio>
            <el-radio v-model="comForm.remark" label="1">临时促销</el-radio>
            <el-radio v-model="comForm.remark" label="2">区域促销</el-radio>
          </el-form-item>
          <div class="itemsTitle">范围设置</div>
          <tup-arae-store-select v-model="areaData" :outlet-disabled="true"></tup-arae-store-select>
          <div class="itemsTitle">优惠产品</div>
          <el-form-item label="是否大礼包" prop="isGiftPack">
            <el-switch :active-value="1" :inactive-value="0" v-model="comForm.promotionRule.isGiftPack"></el-switch>
          </el-form-item>
          <div class="grid-content bg-purple">
            <tupProductSelect v-model="comForm.promotionRule.products" :giftpack="comForm.promotionRule.isGiftPack" type="discount"></tupProductSelect>
          </div>
        </el-form>
      </div>
    </div>
    <div class="dialog-footer">
      <el-button @click="$router.go(-1)">返回</el-button>
      <el-button @click="commit" :loading="loading" type="primary">确认</el-button>
    </div>
  </div>
</template>

<script>
  var promotion = {};
  export default {
    data() {
      return {
        promotionThemeType:this.$route.params.promotionThemeType,
        pickerOptions1:{
          disabledDate(time) {
            return time.getTime() < (new Date(promotion.startDate)).getTime() || 
            time.getTime() > (new Date(promotion.endDate)).getTime();
          }
        },
        comForm:{
          type:0,
          orderType:this.$route.params.promotionThemeType == 1 ? 2 : 1,
          date:'',
          remark:'0',
          promotionDisplay:true,
          startDate:'',
          endDate:'',
          promotionRule:{
            isGiftPack:0,
            products:[
            ]
          },
          promotionId: this.$route.params.promotionId,
          description:'',
          title:''
        },
        areaData:{
          isarea:'0',
          data:[]
        },
        comRules:{
          title: [
            { required: true, message: '必填', trigger: 'change' }
          ],
          promotionId:[
            { required: true, message: '必填', trigger: 'change' }
          ],
          date:[
            { required: true, message: '必填', trigger: 'blur' }
          ],
        },
        loading:false,
      }
    },
    watch:{
      areaData:function(val){
        this.getArea(val)
      },
      'comForm.date':function(val){
        if(!val){
          this.comForm.startDate = '';
          this.comForm.endDate = '';
        }
        else{
          this.comForm.startDate = val[0];
          this.comForm.endDate = val[1];
        }
      }
    },
    methods: {
      getArea(val){
        if(!val){
          val = this.areaData;
        }
        if(val.isarea==='1'){
          let codeArray = [];
          let nameArray = [];
          val.data.map(item=>{
            codeArray.push(item.code);
            nameArray.push(item.name);
          })
          this.comForm.targetAreas = codeArray.join(',');
          this.comForm.targetAreaNames = nameArray.join(',');
        }
        else if(val.isarea=='0'){
          this.comForm.targetAreas = '';
          this.comForm.targetAreaNames = '';
          this.comForm.targetClients = '';
          this.comForm.targetClientNames = '';
        }
        else{
          let codeArray = [];
          let nameArray = [];
          val.data.map(item=>{
            codeArray.push(item.code);
            nameArray.push(item.name);
          })
          this.comForm.targetClients = codeArray.join(',');
          this.comForm.targetClientNames = nameArray.join(',');
        }
      },
      commitData(){        
        let thiz = this;
        this.loading = true;
        let data = thiz.$util.deepClone(thiz.comForm);
        data.promotionRule = JSON.stringify(data.promotionRule);
        thiz.$tupHttp(thiz,'promotion/addItem','POST',data).then(res=>{
          thiz.$router.push({ path: '/frame/promotion/promotionGuide/'+thiz.comForm.promotionId+'/'+thiz.$route.params.promotionThemeType});
        },res=>{
          thiz.loading = false;
        })  
      },
      checkRules(){
        let isError = false;
        let data = this.$util.deepClone(this.comForm);
        if(data.promotionRule.products.length == 0){
          this.$notify.error({
            title: '错误提示',
            message: '主产品不能为空'
          })
          isError = true;
          return isError;
        }
        return isError;
      },
      commit(){        
        this.$refs.comForm.validate((valid) => {
          if (valid) {
            if(!this.checkRules()){
              this.commitData();
            }              
          } else {
            return false;
          }
        });
      }
    },
    mounted(){  
      promotion = this.$store.state.common.promotion;
    }
  }
</script>
<style scoped>
.itemsTitle{
  font-size: 20px;
  border-bottom: 1px solid #ccc;
}
.dialog-footer{
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
