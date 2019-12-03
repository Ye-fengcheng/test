<template>
  <el-container class="all" style="background-image:url(static/useJs/login_bg.png);background-repeat:no-repeat; background-size:100% 100%;-moz-background-size:100% 100%;">
      <el-header style="padding-left:60px;">
        <br/><br/>
        <img src="static/useJs/logo.png" width="200">
      </el-header>
      <el-main style="margin-top:60px;">
        <el-row :gutter="40">
          <el-col :span="4">
            &nbsp;
          </el-col>
          <el-col :span="8">
            &nbsp;
          </el-col>
          <el-col :span="8">            
            <div class="block">
              <el-row>
                <el-col :span="4">&nbsp;</el-col>
                <el-col :span="16">
                  <div style="text-align:center;margin-bottom:15px;">
                    <img src="static/useJs/welcome_img.png" width="90"><br/>
                  </div>
                  <el-form :model="form" status-icon :rules="rules2" ref="form" label-width="0px">
                    <el-form-item label="" prop="employeeId" style="margin-bottom: 22px !important;">
                      <el-input v-model="form.employeeId" prefix-icon="icon font_family icon-user" placeholder="员工编号"></el-input>
                    </el-form-item>
                    <el-form-item label="" style="margin-bottom: 22px !important;"></el-form-item> 
                    <el-form-item label="" prop="password" style="margin-bottom: 22px !important;">
                      <el-input type="password" v-model="form.password" prefix-icon="icon font_family icon-mima" placeholder="密码" auto-complete="off"></el-input>
                       <el-button style="float:right" type="text" @click="gotoUrl('changePwdByPhone')">忘记密码</el-button>
                    </el-form-item>    
                    <el-form-item style="margin-bottom: 22px !important;">
                      <el-button style="width:100%" type="primary" @click="submitForm('form')">登录</el-button>
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col :span="4">&nbsp;</el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="4">&nbsp;</el-col>
        </el-row>            
      </el-main>
      <el-footer></el-footer>
  </el-container>     
</template>
<script>
export default {
  data() {
    var checkUserName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('不能为空'));
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
        employeeId:"",
        password:"",
        platform:"WEB",
        application:'慧管理'
      },
      rules2: {
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        employeeId: [
          { validator: checkUserName, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
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
      thiz.form.password = window.btoa(thiz.form.password);  
      this.$refs[formName].validate((valid) => {
        if (valid) {          
          thiz.$tupHttp(thiz,'login','POST',thiz.form).then(res=>{
            if(res.body.success){ 
              setTimeout(function(){
                thiz.getAuthority()        
              })     
              if(!res.body.model.pProvinceNo && !res.body.model.pRegionNo){
                //代表是总部员工
                thiz.$storage.setValue('isGroup',1);
                thiz.$storage.setValue('type',res.body.model.pRole);
                //thiz.$storage.setValue('type',res.body.model.pRole);
                //总部员工类型,1是财务，2是市场，3是人事，4是客服，5是其他
              }
              else{
                //分公司员工
                thiz.$storage.setValue('isGroup',0);
                thiz.$storage.setValue('type','');
              }
              thiz.$storage.setValue('provinceNo',res.body.model.pProvinceNo?res.body.model.pProvinceNo:'');
              thiz.$storage.setValue('regionNo',res.body.model.pRegionNo?res.body.model.pRegionNo:'');
              thiz.$storage.setValue('province',res.body.model.pProvince?res.body.model.pProvince:'');
              thiz.$storage.setValue('pPositionabbr',res.body.model.pPositionabbr?res.body.model.pPositionabbr:'');
              thiz.$storage.setValue('region',res.body.model.pRegion?res.body.model.pRegion:'');
              thiz.$storage.setValue('pDmCode',res.body.model.pDmCode !== null ? res.body.model.pDmCode : '');
              thiz.$storage.setValue('pFscode',res.body.model.pFscode !== null ? res.body.model.pFscode : '');
              thiz.$storage.setValue('platform','');
              thiz.$storage.setName(res.body.model.pName);
              thiz.$storage.setUid(res.body.model.pUid);
              thiz.$storage.setpOrganization(res.body.model.pOrganization);
              thiz.$storage.setpPosition(res.body.model.pPosition);
              thiz.$storage.setToken(res.body.extra.token);
              thiz.$router.push({ path: '/frame/welcome' });
            }
            else {              
              thiz.form.password = '';
            }
          },res =>{
            thiz.form.password = '';
          })            
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  mounted(){
    this.$util.onKeyCode(this,'submitForm',['form'])
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
