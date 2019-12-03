<template>
  <div>
     <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="省办批量处理" name="zero">
        <el-row :gutter="20">
          <el-col :span="4">&nbsp;</el-col>
          <el-col :span="16">
            <el-form :model="comForm" :rules="comRules" label-position="left" ref="comForm" label-width="120px">
              <el-form-item label="选择省办" prop="codes">
                <el-select
                  style="width:100%"
                  v-model="comForm.codes"
                  multiple
                  filterable
                  placeholder="请输入关键字">
                  <el-option-group
                    v-for="group in areas"
                    :key="group.code"
                    :label="group.name">
                    <el-option
                      v-for="item in group.childrens"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code">
                    </el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>
                <el-form-item label="目标区域" label-width="120px" prop="parentCode">
                  <el-select
                    style="width:100%"
                    v-model="comForm.parent"
                    placeholder="请输入关键字">
                      <el-option
                        v-for="item in areas"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code + '|' +item.name">
                      </el-option>
                  </el-select>
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
      <el-tab-pane label="片区批量处理" name="first">
        <el-row :gutter="20">
          <el-col :span="4">&nbsp;</el-col>
          <el-col :span="16">
            <el-form :model="comForm2" :rules="comRules2" label-position="left" ref="comForm2" label-width="120px">
              <el-form-item label="选择片区" prop="codes">
                <el-select
                  style="width:100%"
                  v-model="comForm2.codes"
                  multiple
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
                      :value="item.code">
                    </el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>
                <el-form-item label="目标省办" label-width="120px" prop="parentCode">
                  <el-select
                    style="width:100%"
                    v-model="comForm2.parent"
                    placeholder="请输入关键字">
                      <el-option
                        v-for="item in provinces"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code + '|' +item.name">
                      </el-option>
                  </el-select>
                </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4">&nbsp;</el-col>
        </el-row>
        <div class="dialog-footer">
          <el-button @click="$router.go(-1)">返回</el-button>
          <el-button @click="commit2" :loading="loading"  type="primary">保存</el-button>      
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
          codes:'',
          parentCode:'',
          parentName:'',
          parent:''
        },
        comRules:{
          codes: [
            { required: true, message: '必填', trigger: 'change' }
          ],
          parentCode: [
            { required: true, message: '必填', trigger: 'change' }
          ]
        },
        comForm2:{
          codes:'',
          parentCode:'',
          parentName:'',
          parent:''
        },
        comRules2:{
          codes: [
            { required: true, message: '必填', trigger: 'change' }
          ],
          parentCode: [
            { required: true, message: '必填', trigger: 'change' }
          ]
        },
        areas: [],
        provinces:[],
        loading:false,
        activeName:'zero',
        treeLoading:false
      }
    },
    watch:{
      'comForm.parent':function(val){
        if(val){
          this.comForm.parentCode = val.split('|')[0]
          this.comForm.parentName = val.split('|')[1]
        }
      },
      'comForm2.parent':function(val){
        if(val){
          this.comForm2.parentCode = val.split('|')[0]
          this.comForm2.parentName = val.split('|')[1]
        }
      }
    },
    methods: {
      editItem(index, row) {
        this.gotoUrl('/frame/promotion/promotionDetail/'+row.id)
      },
      commitData(){
        let thiz = this;
        this.loading = true;
        let data = this.$util.deepClone(thiz.comForm);
        thiz.$tupHttp(thiz,'organization/batchUpdate','POST',data).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功',
            message : '保存成功'
          });
        },res=>{
          thiz.loading = false;
        })
      }, 
      commitData2(){
        let thiz = this;
        this.loading = true;
        let data = this.$util.deepClone(thiz.comForm2);
        thiz.$tupHttp(thiz,'organization/batchUpdate','POST',data).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功',
            message : '保存成功'
          });
        },res=>{
          thiz.loading = false;
        })
      },
      commit2(){
        this.$refs.comForm2.validate((valid) => {
          if (valid) {
            this.commitData2();
          } else {
            return false;
          }
        });
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
          thiz.areas = res.body.models
          if(thiz.areas){
            thiz.areas.map(item=>{
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