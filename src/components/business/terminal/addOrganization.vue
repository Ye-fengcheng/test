<template>
  <div>
     <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="新增组织结构信息" name="zero">
        <el-row :gutter="20">
          <el-col :span="4">&nbsp;</el-col>
          <el-col :span="16">
            <el-form :model="comForm" :rules="comRules" label-position="left" ref="comForm" label-width="120px">
              <el-form-item label="部门级别" prop="level">
                <el-select v-model="comForm.level" size="mini" clearable filterable  placeholder="请选择">
                  <el-option label="区域" :value="1"></el-option>
                  <el-option label="省办" :value="2"></el-option>
                  <el-option label="片区" :value="3"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="上级省办" prop="parentCode" v-show="comForm.level==3">
                <el-select
                  style="width:100%"
                  v-model="comForm.parent"
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
              <el-form-item label="上级区域" label-width="120px" v-show="comForm.level==2" prop="parentCode">
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
              <el-form-item label="编码" prop="code">
                <el-input v-model="comForm.code" clearable="" size="mini" placeholder="编码"></el-input>
              </el-form-item>
              <el-form-item label="名称" prop="name">
                <el-input v-model="comForm.name" clearable="" size="mini" placeholder="名称"></el-input>
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
          code:'',
          name:'',
          level:'',
          parentCode:'',
          parentName:'',
          parent:''
        },
        comRules:{
          level: [
            { required: true, message: '必填', trigger: 'change' }
          ],
          code: [
            { required: true, message: '必填', trigger: 'change' }
          ],
          name: [
            { required: true, message: '必填', trigger: 'change' }
          ]
        },
        areas: [],
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
        else
        {
          this.comForm.parentCode = ''
          this.comForm.parentName = ''
        }
      },
      'comForm.level':function(val){
        this.comForm.parent = ''
      }
    },
    methods: {
      commitData(){
        let thiz = this;
        this.loading = true;
        let data = this.$util.deepClone(thiz.comForm);
        thiz.$tupHttp(thiz,'organization/insert','POST',data).then(res=>{
          thiz.loading = false;
          thiz.$notify.success({
            title: '成功',
            message : '添加成功'
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
          thiz.areas = res.body.models
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