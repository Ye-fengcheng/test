<template>
  <el-container class="all" style="background-image:url(static/useJs/login_bg.png);background-repeat:no-repeat; background-size:100% 100%;-moz-background-size:100% 100%;">
    <el-main style="margin-top:60px;">
      <el-row :gutter="40">
        <el-col :span="4">&nbsp;</el-col>
        <el-col :span="6">
          <div class="titleBlack" style="margin-top:100px;text-align: right;">
              <img src="static/useJs/logo_img.png" width="240"><br/>
          </div>
        </el-col>
        <el-col :span="10">            
          <div class="block">
            <el-row>
              <el-col :span="2">&nbsp;</el-col>
              <el-col :span="20">
                <div style="text-align:center;margin-bottom:45px;">
                  <h3>忘记密码</h3>
                </div>
                <el-form :model="form" status-icon :rules="rules2" ref="form" label-width="100px">
                  <el-form-item label="员工编号" prop="employeeId" style="margin-bottom: 22px !important;">
                    <el-input @change="employeeIdChange" v-model="form.employeeId" prefix-icon="icon font_family icon-user" placeholder="员工编号"></el-input>
                  </el-form-item>
                  <el-form-item label="手机号码" prop="phone" style="margin-bottom: 22px !important;">
                    <el-input  disabled v-model="form.phone2" prefix-icon="icon font_family icon-user" placeholder="手机号码"></el-input>
                  </el-form-item>
                  <el-form-item label="短信验证码" prop="code" style="margin-bottom: 22px !important;">
                    <el-input style="width:68%" v-model="form.code" prefix-icon="icon font_family icon-user" placeholder="短信验证码"></el-input>
                    <el-button style="width:26%" :disabled="smsIsunabled" type="text" :loading="loading" @click="sendSms">{{smsText}}</el-button>
                  </el-form-item>
                  <el-form-item label="新密码" prop="password1" style="margin-bottom: 22px !important;">
                    <el-input type="password" :disabled="!form.phone" v-model="form.password1" prefix-icon="icon font_family icon-mima" placeholder="新密码" auto-complete="off"></el-input>
                  </el-form-item> 
                  <el-form-item label="重复密码" prop="password2" style="margin-bottom: 22px !important;">
                    <el-input type="password" :disabled="!form.phone" v-model="form.password2" prefix-icon="icon font_family icon-mima" placeholder="重复密码" auto-complete="off"></el-input>
                  </el-form-item>     
                  <el-form-item style="margin-bottom: 22px !important;">
                    <el-button type="text" @click="$router.go(-1)">返回登录页面</el-button>
                    <el-button type="primary" :loading="loading" @click="submitForm('form')">确认修改</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="2">&nbsp;</el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="4">&nbsp;</el-col>
      </el-row>            
    </el-main>
  </el-container>     
</template>
<script>
export default {
  data() {
    var checkUserName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入员工编号'));
      }
      callback();
    };
    var validatePass1 = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'));
      }
      else if(value.length < 6){
        callback(new Error('密码长度不能少于6位'));
      }
      callback();
    };
    var validatePass2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'));
      }
      else if(value != this.form.password1){
        callback(new Error('两次密码不一致'));
      }
      callback();
    };
    return {
      smsText:'发送短信',
      smsIsunabled:true,
      downCount:60,
      form: {
        phone:'',
        phone2:'',
        employeeId:"",
        password1:"",
        code:'',
        password2:""
      },
      interval:'',
      loading:false,
      rules2: {
        password1: [
          { validator: validatePass1, trigger: 'blur' }
        ],
        password2: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '必填', trigger: 'change' }
        ],
        employeeId: [
          { validator: checkUserName, trigger: 'blur' }
        ]
      }
    };
  },
  watch:{
  },
  methods: {
    dCount(){
      let thiz = this;
      thiz.smsIsunabled = true;
      this.interval = setInterval(function(){
        thiz.downCount --;
        thiz.smsText = '已发送('+thiz.downCount+')'
        if(thiz.downCount == 0){
          window.clearInterval(thiz.interval)
          thiz.smsText = '发送短信'
          thiz.downCount = 60
          thiz.smsIsunabled = false
        }        
      },1000);
    },
    sendSms(){
      let thiz = this;
      thiz.loading = true;
      thiz.$tupHttp(thiz,'login/send?mobile='+this.form.phone,'GET').then(res=>{
        thiz.loading = false;
        thiz.$notify.success({
          title: '成功提示',
          message: '短信已成功发送'
        });
        thiz.dCount();
      },res=>{
        thiz.loading = false;
      })
    },
    employeeIdChange(val){
      let thiz = this;
      thiz.loading = true;
      thiz.$tupHttp(thiz,'login/getInfoById?employeeId='+this.form.employeeId,'GET').then(res=>{
        thiz.loading = false;
        thiz.form.phone = res.body.model.pMobile;
        debugger
        if(thiz.form.phone){
          thiz.form.phone2 = thiz.form.phone.replace(thiz.form.phone.substr(3, 4), '****')
        }
        if(thiz.interval){
          window.clearInterval(thiz.interval)
        }
        thiz.smsText = '发送短信'
        thiz.downCount = 60
        thiz.smsIsunabled = false
      },res=>{
        thiz.loading = false;
        thiz.form.phone = '';
        thiz.form.phone2 = '';
        thiz.smsIsunabled = true;
      })
    },
    getAuthority(){
      let thiz = this;
      this.$tupHttp(this,'employee/role/user/menus?userId='+this.form.employeeId+'&platform=1','GET').then(res=>{
        if(!res.body.valid || res.body.models.length==0){
          thiz.$router.push({ path: '/login' });
          thiz.$notify.error({
            title: '错误提示',
            message: '系统无配置角色，请联系IT部门'
          });
          return ;
        }        
        let data = res.body.models;
        let power = {}
        if(data){
          data.map(item=>{
            if(item)
              power[item.code] = true;
          })
        }
        thiz.$store.commit('common/setPower',power);
        thiz.$storage.setValue('power',JSON.stringify(power))
      })      
    },
    gotoUrl(url){
      this.$router.push({ path: url });
    },
    submitForm(formName) {
      let thiz = this;      
      this.$refs[formName].validate((valid) => {        
        if (valid) {        
          thiz.loading = true;
          thiz.$tupHttp(thiz,'login/validateCodeAndChangePsw?mobile='+this.form.phone+'&code='+this.form.code+'&newPassword='+this.form.password1,'GET').then(res=>{
            thiz.loading = false;
            thiz.$notify.success({
              title: '成功提示',
              message: '密码修改成功'
            });
            thiz.gotoUrl('login')
          },res =>{
            thiz.loading = false;
          })            
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
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
    font-size: 22px;
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
