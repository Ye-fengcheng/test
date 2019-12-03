<template>
  <div>
    <el-steps :active="active" align-center>
      <el-step title="促销主题设置" description=""></el-step>
      <el-step title="设置促销规则" description=""></el-step>
    </el-steps>
    <el-row style="margin-top:50px" :gutter="20">
      <el-col :span="4">&nbsp;</el-col>
      <el-col :span="16">
        <el-form :model="comForm" :rules="comRules" label-position="left" ref="comForm" label-width="120px">
          
          <div v-show="active==1">
            <el-form-item label="促销主题" prop="title">
              <el-input v-model="comForm.title"  placeholder="促销主题"></el-input>
            </el-form-item>
            <el-form-item label="促销期" label-width="120px" prop="time">
              <el-date-picker
                v-model="comForm.time"
                type="datetimerange"
                range-separator="-"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="类型" label-width="120px" prop="promotionThemeType">
              <el-radio v-model="comForm.promotionThemeType" :label="1">普通订单促销</el-radio>
              <el-radio v-model="comForm.promotionThemeType" :label="0">首订订单促销</el-radio>              
            </el-form-item>
          </div>
        </el-form>
      </el-col>
      <el-col :span="4">&nbsp;</el-col>
    </el-row>
    
    <div class="dialog-footer">
      <el-button @click="gotoUrl('/frame/promotion/index')">返回</el-button>
      <el-button @click="prev" v-show="active > 1" type="primary">上一步</el-button>      
      <el-button @click="next" :loading="loading"  v-show="active < 3" type="primary">下一步</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        active:1,
        comForm:{
          title:'',
          isarea:'1',
          targetAreas:[],
          targetClients:[],
          startDate:'',
          endDate:'',
          time:'',
          status:0,
          promotionThemeType:1
        },
        comRules:{
          title: [
            { required: true, message: '必填', trigger: 'change' }
          ],
          time: [
            { required: true, message: '必填', trigger: 'change' }
          ]
        },
        areas: [
          
        ],
        defaultProps: {
          children: 'childrens',
          label: 'name'
        },
        loading:false,
        treeLoading:false
      }
    },
    watch:{
      'comForm.time':function(val){
        this.comForm.startDate = val[0];
        this.comForm.endDate = val[1];
      }
    },
    methods: {
      treeChange(node,isSelect,hasChild){
        let keys = this.$refs.areaTree.getCheckedKeys();
        this.comForm.targetAreas=keys.indexOf('0')==-1 ? this.$refs.areaTree.getCheckedKeys() : [0];
      },
      commitData(){
        let thiz = this;
        this.loading = true;
        thiz.$tupHttp(thiz,'promotion/create','POST',thiz.comForm).then(res=>{
          debugger
          if(res.body.success){
            thiz.$router.push({ path: '/frame/promotion/promotionGuide/'+res.body.model+'/'+thiz.comForm.promotionThemeType});
          }
        },res=>{
          thiz.loading = false;
        })
      },  
      next(){
        this.$refs.comForm.validate((valid) => {
          if (valid) {
            if(this.active==1){
              this.commitData()
            }
            else
              this.active+=1
          } else {
            return false;
          }
        });
      },
      prev(){
        this.active-=1
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      },
      loadArea(){
        let thiz = this;
        thiz.treeLoading = true;
        thiz.$baseData.areaTree(thiz).then(res=>{
          thiz.areas = [
            {
              code:'0',
              name:'全国',
              childrens : res.body.models
            }
          ]
          thiz.treeLoading = false;
        },res=>{
          thiz.treeLoading = false;
        }) 
      }
    },
    mounted(){
      $('.el-upload__input').hide();
      this.loadArea();
    }
  }
</script>
<style scoped>
.itemsTitle{
  font-size: 20px;
  border-bottom: 1px solid #ccc;
}
.dialog-footer{
  margin-top: 70px;
  text-align: center;
}
</style>
