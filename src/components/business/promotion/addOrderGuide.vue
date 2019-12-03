<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/frame/promotion/index' }">促销</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/frame/promotion/promotionGuide/'+$route.params.promotionId  + '/' + +$route.params.promotionThemeType}">促销规则</el-breadcrumb-item>
      <el-breadcrumb-item>添加满单</el-breadcrumb-item>
    </el-breadcrumb>
    <br/>
    <div style="width:100%">
      <div style="float:left;width:100px">
        <div class="transition-box">满单</div>
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
          <div class="itemsTitle">购买设置</div>
          <el-form-item label="赠送条件关系" prop="orderType">
            <el-radio v-model="comForm.promotionRule.relation" :label="0">并列</el-radio>
            <el-radio v-model="comForm.promotionRule.relation" :label="1">互斥</el-radio>
          </el-form-item>
          <el-button style="margin-bottom:10px" icon="el-icon-plus" type="primary"  @click="addPromotionRule" size="mini" >增加换赠产品</el-button>
          <div class="loopDiv" v-for="(item, index) in comForm.promotionRule.rules" :key="index">
            <div class="num">{{index+1}}</div>
            <el-button style="float:right" type="primary" icon="el-icon-close" @click="deletePromotionRule(index)" size="mini" ></el-button> 
            <el-form-item label="购买满(金额)" prop="sum" style="width: 80%;">
              <el-input-number required size="mini" :min="1"  style="width:120px !important" v-model="item.sum"  placeholder="多少元"></el-input-number>
            </el-form-item>
            <el-form-item label="翻倍次数" label-width="195px" style="width:80%" prop="loop">
              <el-input-number 
                v-model="item.loop"
                :disabled="item.infinite"
                :min="1" 
                size="mini"
                label="描述文字"></el-input-number>
              <el-checkbox v-model="item.infinite">次数不限</el-checkbox>
            </el-form-item>
            <tup-gift-select v-model="item.gifts" ></tup-gift-select>
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
      let validateSum = (rule, value, callback) => {
        value = parseInt(value)
        if (!value) {
          callback(new Error('不能为空或者小于等于0'));
        } else {
          callback();
        }
      };
      return {
        promotionThemeType:this.$route.params.promotionThemeType,
        pickerOptions1:{
          disabledDate(time) {
            return time.getTime() < (new Date(promotion.startDate)).getTime() || 
            time.getTime() > (new Date(promotion.endDate)).getTime();
          }
        },
        comForm:{
          type:3,
          orderType:this.$route.params.promotionThemeType == 1 ? 2 : 1,
          date:'',
          remark:'0',
          promotionDisplay:true,
          startDate:'',
          endDate:'',
          targetAreas:'',
          targetClients:'',
          targetAreaNames:'',
          targetClientNames:'',
          promotionRule:{
            relation:0,//0是并列，1是互斥
            rules:[
              {
                loop:1,
                infinite:false,//不限翻倍数量
                sum:'',
                gifts:[
                ]
              }
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
          ]
        },
        loading:false
      }
    },
    watch:{
      areaData:function(val){
        this.getArea(val);
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
      addPromotionRule(){
        this.comForm.promotionRule.rules.push({
          loop:1,
          infinite:false,
          sum:'',
          gifts:[
          ]
        })
      },
      deletePromotionRule(ind){
        this.comForm.promotionRule.rules.splice(ind,1);
      },
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
          this.comForm.targetClients = '';
          this.comForm.targetClientNames = '';
        }
        else if(val.isarea=='0'){
          this.comForm.targetAreas = '';
          this.comForm.targetAreaNames = '';
          this.comForm.targetClients = '';
          this.comForm.targetClientNames = '';
        }
        else{
          debugger
          let codeArray = [];
          let nameArray = [];
          val.data.map(item=>{
            codeArray.push(item.code);
            nameArray.push(item.name);
          })
          this.comForm.targetClients = codeArray.join(',');
          this.comForm.targetClientNames = nameArray.join(',');
          this.comForm.targetAreas = '';
          this.comForm.targetAreaNames = '';
        }
      },
      commitData(){        
        let thiz = this;
        this.loading = true;
        this.getArea()
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
        isError = data.promotionRule.rules.some(item=>{
          return item.gifts.length == 0 || !item.sum
        })
        if(isError){
          this.$notify.error({
            title: '错误提示',
            message: '规则的赠品不能为空且购买满(金额)不能为空或者0'
          })
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
  width: 100%;
  margin-top: 10px;
  text-align: right;
}
.loopDiv{
  border: 1px solid #eee;
  padding: 5px;
  border-radius: 5px;
  margin-bottom: 5px;
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
.num{
  width: 40px;
  line-height: 30px;
  float: left;
  color: #fff;
  background-color: #ff7000;
  border-color: #ff7000;
  margin-top: -5px;
  margin-left: -5px;
  border-bottom-right-radius: 5px;
  text-align: center;
}
</style>
