<template>
  <el-container class="all" style="background-image:url(../../../static/useJs/bg.png);">
      <el-header></el-header>
      <el-main>
        <el-row>
          <el-col :span="8">&nbsp;</el-col>
          <el-col :span="8">
            <div style="text-align:center">
              <h1>年会产品抢购平台</h1>
            </div>
            <div class="block">
              <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px">
                <el-form-item label="工号" prop="userName">
                  <el-input v-model="ruleForm2.userName"></el-input>
                </el-form-item>
                <el-form-item label="随机密码" prop="userPasswd">
                  <el-input type="password" v-model="ruleForm2.userPasswd" auto-complete="off"></el-input>
                </el-form-item>                    
                <el-form-item>
                  <el-button :loading="loading" type="primary" @click="submitForm('ruleForm2')">登录</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
          <el-col :span="8">&nbsp;</el-col>
        </el-row>            
      </el-main>
      <el-footer></el-footer>
  </el-container>   
</template>
<script>
export default {
  data() {
    var checkCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('不能为空'));
      }
      callback();
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入随机密码'));
      }
      callback();
    };
    return {
      loading:false,
      ruleForm2: {
        userPasswd: '',
        userName: ''
      },
      rules2: {
        userPasswd: [
          { validator: validatePass, trigger: 'blur' }
        ],
        userName: [
          { validator: checkCode, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      let thiz = this;
      this.loading = true;
      this.$refs[formName].validate((valid) => {
        if (valid) {          
          debugger
          thiz.$tupHttp(thiz,'user/login','POST',thiz.ruleForm2).then(res=>{
            thiz.loading = false;
            debugger
            if(res.body.code!=0){
              thiz.$notify.error({
                title: '错误提示',
                message: '该工号已经下了订单了！'
              });
              return ;
            }
            let data = res.body.user;
            thiz.$storage.setName(data.name);
            thiz.$storage.setArea(data.area);
            thiz.$storage.setPhone(data.phone);
            thiz.$storage.setProvince(data.province);
            thiz.$storage.setDept(data.dept);
            thiz.$storage.setCode(data.code);
            thiz.$storage.setToken(res.body.token);
            thiz.$store.commit('common/setAnnualUser',data);
            thiz.$router.push({ path: '/annualMeeting/order' });
          },res=>{
            thiz.loading = false;
          })          
        } else {
          this.loading = false;
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  mounted(){
    
  }
}
</script>
<style scoped>
  .block {
      border: 1px solid #ebebeb;
      padding: 20px;
      border-radius: 3px;
      transition: .2s;
      margin:0 auto;
  }
  .all{
    position:absolute;
    left:0;
    top:0;
    width:100%;
    height:100%
  }
</style>
