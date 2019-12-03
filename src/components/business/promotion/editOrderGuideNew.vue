<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/frame/promotion/index' }">促销</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/frame/promotion/promotionGuide/'+$route.params.promotionId }">促销规则</el-breadcrumb-item>
      <el-breadcrumb-item>修改新品促销</el-breadcrumb-item>
    </el-breadcrumb>
    <br/>
    <el-form :model="comForm" :rules="comRules" ref="comForm" label-width="160px">
      <div class="itemsTitle">促销设置</div>
      <br/>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="名称" prop="title">          
             <el-input v-model="comForm.title"  placeholder=""></el-input>
          </el-form-item>
        </el-col>
      </el-row>  
      <el-form-item label="描述" prop="description">          
        <el-input v-model="comForm.description"  placeholder="" type="textarea" :rows="2"></el-input>
      </el-form-item> 
      <br/>
      <div class="itemsTitle">设置</div>
      <el-form-item label="是否在促销产品中显示" prop="promotionDisplay">
        <el-switch v-model="comForm.promotionDisplay"></el-switch>
      </el-form-item> 
      <div class="itemsTitle">促销条件</div>
      <div class="grid-content bg-purple">
        <h4>产品：</h4>
         <tupProductSelect v-model="comForm.promotionRule.products" ></tupProductSelect>
      </div>
    </el-form>
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
        comForm:{
          type:2,
          promotionDisplay:true,
          promotionRule:{
            isLoop:true,
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
        loading:false
      }
    },
    watch:{
    },
    methods: {
      commitData(){        
        let thiz = this;
        this.loading = true;
        let data = thiz.$util.deepClone(thiz.comForm);
        data.promotionRule = JSON.stringify(data.promotionRule);
        thiz.$tupHttp(thiz,'promotion/item/update','POST',data).then(res=>{
          thiz.$router.push({ path: '/frame/promotion/promotionGuide/'+thiz.comForm.promotionId});
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
</style>
