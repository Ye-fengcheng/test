<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/frame/promotion/index' }">促销</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/frame/promotion/promotionGuide/'+$route.params.promotionId + '/' + +$route.params.promotionThemeType}">促销规则</el-breadcrumb-item>
      <el-breadcrumb-item>修改满赠/KIT-单品</el-breadcrumb-item>
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
          <div class="itemsTitle">范围设置</div>
          <tup-arae-store-select v-model="areaData"></tup-arae-store-select>
          <div class="itemsTitle">购买设置</div>
          <el-form-item label="翻倍次数" prop="loop">
            <el-input-number 
              v-model="comForm.promotionRule.loop"
              :min="1" 
              size="mini"
              label="描述文字"></el-input-number>
          </el-form-item>
          <div class="grid-content bg-purple">
            <h5>条件产品：</h5>
            <tupProductSelect v-model="comForm.promotionRule.products" type="kit" :first="promotionThemeType==0"></tupProductSelect>
          </div>      
          <div class="itemsTitle">换赠设置</div>
          <br/>
          <tup-gift-select v-model="comForm.promotionRule.gifts" ></tup-gift-select>
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
  export default {
    data() {
      return {
        itemId:this.$route.params.itemId,
        promotionThemeType:this.$route.params.promotionThemeType,
        comForm:{
          type:2,
          promotionDisplay:true,
          promotionRule:{
            loop:1,
            products:[],
            gifts:[]
          },
          promotionId: 0,
          description:'',
          id:0,
          title:''
        },
        comRules:{
          title: [
            { required: true, message: '必填', trigger: 'change' }
          ],
          promotionId:[
            { required: true, message: '必填', trigger: 'change' }
          ],
        },
        areaData:{
          isarea:'1',
          data:[]
        },
        loading:false,
      }
    },
    watch:{
      areaData:function(val){
        this.getArea(val)
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
        thiz.$tupHttp(thiz,'promotion/item/update','POST',data).then(res=>{
          thiz.$router.push({ path: '/frame/promotion/promotionGuide/'+thiz.comForm.promotionId+'/'+thiz.promotionThemeType});
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
      loadData(){
        let thiz = this;
        thiz.$tupHttp(thiz,'promotion/item/'+this.itemId,'GET').then(res=>{
          let model = res.body.model;
          model.promotionRule = JSON.parse(model.promotionRule);
          thiz.comForm = model;
          if(model.targetAreas){
            thiz.areaData = {
              isarea:'1',
              data: model.targetAreas.split(',')
            }
          }
          if(model.targetClients){
            let data =[];
            let clients = model.targetClients.split(',');
            let names = model.targetClientNames.split(',');
            for(let i=0;i<clients.length;i++){
              data.push({code:clients[i],name:names[i]})
            }
            thiz.areaData = {
              isarea:'2',
              data:data
            }
          }
        }) 
      }
    },
    mounted(){
      this.loadData();
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
