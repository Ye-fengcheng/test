<template>
  <div>
    <el-row>
      <el-col :span="8">&nbsp;</el-col>
      <el-col :span="8">
        <el-form :model="form" status-icon :rules="rules2" ref="form" label-width="0px">
          <el-form-item label="" prop="password1">
            <el-input type="password" v-model="form.password1" placeholder="新密码"></el-input>
          </el-form-item>
          <el-form-item label="" ></el-form-item> 
          <el-form-item label="" prop="password2">
            <el-input type="password" v-model="form.password2" placeholder="重复密码" auto-complete="off"></el-input>
          </el-form-item>    
          <el-form-item label="" ></el-form-item>                
          <el-form-item>
            <el-button style="width:100%" type="primary" @click="submitForm('form')">修改</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="8">&nbsp;</el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    var checkUserName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入密码'));
      }
      callback();
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      }
      callback();
    };
    return {
      form: {
        password1:"",
        password2:""
      },
      rules2: {
        password1: [
          { validator: validatePass, trigger: 'blur' }
        ],
        password2: [
          { validator: checkUserName, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      let thiz = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {   
          if(thiz.form.password1 != thiz.form.password2){
            thiz.$notify.error({
              title: '错误提示',
              message: '密码不一致'
            });
            return ;
          }       
          else{
            thiz.$tupHttp(thiz,'employee/updatePassword?employeeId='+thiz.$storage.getUid()+'&password='+window.btoa(thiz.form.password1),'GET').then(res=>{
              if(res.body.success){
                thiz.$notify({
                  title: '提示',
                  message: '密码修改成功'
                });
              }
            })
          }          
        } else {
          return false;
        }
      });
    }
  }
}
</script>
<style scoped>
  .title{
    text-align:center;
    color:#ff7000;
    font-weight: 900;
    font-size: 30px;
  }
  .titleBlack{
    margin-bottom: 40px;
    text-align:center;
    color:#5c6266;
    font-size: 28px;
  }
  .block {
    border: 1px solid #ebebeb;
    padding: 20px;
    border-radius: 3px;
    transition: .2s;
    margin:0 auto;
    background-color: #fff;
  }
  .all{
    position:absolute;
    left:0;
    top:0;
    width:100%;
    height:100%
  }
</style>
