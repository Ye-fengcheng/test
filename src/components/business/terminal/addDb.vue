<template>
  <div>
     <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="新增DB信息" name="zero">
        <el-row :gutter="20">
          <el-col :span="4">&nbsp;</el-col>
          <el-col :span="16">
            <el-form :model="comForm" :rules="comRules" label-position="left" ref="comForm" label-width="120px">
              <el-form-item label="分销商编号" prop="dbNo">
                <el-input-customer v-model="comForm.dbObject" type="DB" ></el-input-customer>
              </el-form-item>
              <!-- <el-form-item label="所属片区" prop="districtoffice">
                <el-select
                  style="width:100%"
                  clearable
                  v-model="comForm.districtoffice"
                  filterable
                  placeholder="请输入关键字">
                  <el-option-group
                    v-for="group in provinces"
                    :key="group.code"
                    :label="group.name">
                    <el-option
                      v-for="item in group.childrens"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code + '|' + item.name">
                    </el-option>
                  </el-option-group>
                </el-select>
              </el-form-item> -->
              <el-form-item label="FS编号" prop="fsNo">
                <el-input-employees v-model="comForm.fsNo"></el-input-employees>
              </el-form-item>
              <el-form-item label="DM编号" prop="dmNo">
                <el-input-employees v-model="comForm.dmNo"></el-input-employees>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4">&nbsp;</el-col>
        </el-row>
        <div class="dialog-footer">
          <el-button @click="$router.go(-1)">返回</el-button>
          <el-button @click="commit" :loading="loading"  type="primary">保存</el-button>      
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        comForm:{
          dbObject:{},
          dbName:'',
          dbNo:'',
          districtoffice:'',
          districtofficeCode:'',
          districtofficeName:'',
          fsNo:'',
          dmNo:''
        },
        comRules:{
          dbNo: [
            { required: true, message: '必填', trigger: 'change' }
          ]
        },
        provinces:[],
        loading:false,
        activeName:'zero',
        treeLoading:false
      }
    },
    watch:{
      'comForm.dbObject':function(val){
        this.comForm.dbName = val.pName;
        this.comForm.dbNo = val.pUid;
      },
      'comForm.districtoffice':function(val){
        if(val){
          this.comForm.districtofficeCode = val.split('|')[0]
          this.comForm.districtofficeName = val.split('|')[1]
        }
        else {
          this.comForm.districtofficeCode = ''
          this.comForm.districtofficeName = ''
        }
      }
    },
    methods: {
      commitData(){
        let thiz = this;
        this.loading = true;
        let data = this.$util.deepClone(thiz.comForm);
        thiz.$tupHttp(thiz,'db/insert','POST',data).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功',
            message : '保存成功'
          });
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
      gotoUrl(url){
        this.$router.push({ path: url });
      },      
      formatter(row, column) {
        return row.publicTime;
      },
      loadArea(){
        let thiz = this;
        thiz.$baseData.areaAllTree(thiz).then(res=>{
          if(res.body.models){
            res.body.models.map(item=>{
              thiz.provinces = thiz.provinces.concat(item.childrens ? item.childrens:[])
            })
          }
        }) 
      }
    },
    mounted(){    
      this.loadArea()
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