<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="4">&nbsp;</el-col>
      <el-col :span="16">
        <el-form :model="comForm" :rules="comRules" label-position="left" ref="comForm" label-width="120px">
          <el-form-item label="促销主题" prop="title">
            <el-input v-model="comForm.title"  placeholder="促销主题"></el-input>
          </el-form-item>
            <!-- <h5>请选择参与促销范围：</h5>
            <el-form-item label="" prop="isarea">
              <el-radio v-model="comForm.isarea" label="1">按区域参加</el-radio>
            </el-form-item>
            <el-form-item label="" >
              <div v-loading="treeLoading" style="height:250px;overflow-y:auto;border:1px solid #ccc;border-radius: 5px">
                <el-tree                      
                  :data="areas"
                  @check-change='treeChange'
                  ref="areaTree"
                  :default-checked-keys="targetAreas"
                  show-checkbox
                  node-key="code"
                  :props="defaultProps">
                </el-tree>
              </div>
            </el-form-item>
            <el-form-item label="" prop="isarea">
              <el-radio v-model="comForm.isarea" label="2">按门店范围参加</el-radio>
            </el-form-item>
            <el-form-item label="" >
              <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                :file-list="[]">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传excel文件，且不超过500kb.&nbsp;<el-button size="mini" type="success">点击下载模板</el-button></div>
              </el-upload>
              
            </el-form-item> -->
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
              <el-radio v-model="comForm.promotionThemeType" :disabled="true" :label="1">普通订单促销</el-radio>
              <el-radio v-model="comForm.promotionThemeType" :disabled="true" :label="0">首次订单促销</el-radio>
            </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4">&nbsp;</el-col>
    </el-row>
    
    <div class="dialog-footer">
      <el-button @click="gotoUrl('/frame/promotion/index')">返回</el-button>
      <el-button @click="commit" :loading="loading"  type="primary">保存</el-button>      
    </div>  
  </div>
</template>

<script>
  export default {
    data() {
      return {
        promotionId:this.$route.params.promotionId,
        promotionThemeType:this.$route.params.promotionThemeType,
        comForm:{
          title:'',
          description:'',
          isarea:'',
          areas:[],
          time:'',
          status:0,
          promotionThemeType:0
        },
        comRules:{
          title: [
            { required: true, message: '必填', trigger: 'change' }
          ],
          time: [
            { required: true, message: '必填', trigger: 'change' }
          ]
        },
        areas: [],
        defaultProps: {
          children: 'childrens',
          label: 'name'
        },
        loading:false,
        activeName:'zero',
        treeLoading:false
      }
    },
    watch:{
      'activeName':function(val){
        if(val=='first'){
          this.gotoUrl('/frame/promotion/promotionGuide/'+this.promotionId+'/'+this.promotionThemeType)
        }
      },
      $route:function(val){
        if(val.path.indexOf("/frame/promotion/promotionDetail") != -1){
          if(this.promotionId == val.params.promotionId){
            return;
          }
          this.promotionId = val.params.promotionId
          this.promotionThemeType = val.params.promotionThemeType
          this.getInfo();
        }
      },
      'comForm.time':function(val){
        this.comForm.startDate = val[0];
        this.comForm.endDate = val[1];
      }
    },
    methods: {
      editItem(index, row) {
        this.gotoUrl('/frame/promotion/promotionDetail/'+row.id)
      },
      treeChange(node,isSelect,hasChild){
        let keys = this.$refs.areaTree.getCheckedKeys();
        this.comForm.targetAreas=keys.indexOf('0')==-1 ? this.$refs.areaTree.getCheckedKeys() : [0];
      },
      commitData(){
        let thiz = this;
        this.loading = true;
        let data = this.$util.deepClone(thiz.comForm);
        thiz.$tupHttp(thiz,'promotion/update','POST',data).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功',
            message : '保存成功'
          });
          thiz.promotionThemeType = thiz.comForm.promotionThemeType;
          thiz.$store.commit('common/setPormotion',res.body.model);
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
      showAddDialog(){
        this.addDialogVisible = true;
      },
      gotoUrl(url){
        this.$router.push({ path: url });
      },      
      handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      },
      formatter(row, column) {
      return row.publicTime;
      },
      editItem(index, row) {
        this.gotoUrl('/frame/order/areaConfig')
      },
      getInfo(){
        let thiz = this;
        thiz.$tupHttp(thiz,'promotion/info?id='+this.promotionId,'GET').then(res=>{
          let model = res.body.model;  
          model.time=[];
          model.time.push(model.startDate);    
          model.time.push(model.endDate);    
          thiz.comForm = model; 
          thiz.$store.commit('common/setPormotion',model);
        }) 
      }
    },
    mounted(){
      $('.el-upload__input').hide();
      this.getInfo();      
    }
  }
</script>

<style scoped>
.itemsTitle{
  font-size: 20px;
  border-bottom: 1px solid #ccc;
}
.dialog-footer{
  margin-top: 30px;
  text-align: center;
}
</style>