<template>
  <nav class="navbar navbar-dark navbar-fixed-top">
      <div class="container-fluid">
        <!-- <div :class="logoName">
          <span style="margin-top:15px"><B>Tupperware</B></span>
        </div> -->
        <div class="logoImg">
          <img src="../../../assets/logo.png" width="130"/>
        </div>
        <div>
        </div>
        <div class="logoBack">
          <span style="margin-right:10px;color:#bbbbbb"> | </span>
          <span ><B>{{title}}</B></span>
        </div>
        <div class="navbar-header" style="padding-top:2px;text-align:right;width:280px">       
          <h5><slot name="project-left"></slot></h5>          
          <el-radio-group v-model="platform" size="small" @change="hanldeChange">
            <el-radio-button label="1">会员</el-radio-button>
            <el-radio-button label="2">客户</el-radio-button>
            <el-radio-button label="3">员工</el-radio-button>
            <el-radio-button label="4">设置</el-radio-button>
          </el-radio-group>
          
        </div>
        <div class="navbar-collapse collapse navbar-right">
          <div style="float:left;margin-right:20px;margin-top:13px">      
            <el-button type="text" style="font-size:14px;color:#fff" size="mini" @click="openNewWindow">新窗口</el-button>
            <el-button type="text" style="font-size:14px;color:#fff" size="mini" @click="openOldFms">旧FMS入口</el-button>      
          </div>
          <div style="float:right;padding-top:18px;">
            <el-dropdown trigger="click" @command="handleCommand">
              <span class="el-dropdown-link white">
                欢迎您，{{userName}}<i class="el-icon-caret-bottom el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="password">修改密码</el-dropdown-item>
                <!-- <el-dropdown-item command="myProject">我的项目</el-dropdown-item>
                <el-dropdown-item command="menuSetting">菜单设置</el-dropdown-item>
                <el-dropdown-item command="langSwitch">语言切换</el-dropdown-item>
                <el-dropdown-item command="toSay">我要吐槽</el-dropdown-item>     -->          
                <el-dropdown-item command="out" divided>退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
    </nav>
</template>

<script>
  export default {
    name: 'frameNav',
    data() {
      return {
        title:'特百惠.慧管理(测试环境)',
        platform:this.$storage.getValue('platform'),
        logoName:'logo',
        isCollapse: true,
        iconName:'el-icon-arrow-left',
        menuTootip:this.$t('business.common.menuTootip')
      }
    },
    props: {
      language: {
        type: Boolean,
        default: true
      },
      loginBtn: {
        type: Boolean,
        default: false
      },
      userName: {
        type: String,
        default: ''
      }
    },
    methods: {
      hanldeChange(val){
        this.$storage.setValue('platform',val);
        this.$store.commit('common/setPlatform',val);
      },
      openNewWindow(){
        window.open('/#'+this.$route.fullPath)
      },
      openOldFms(){
        window.open('https://empfms.tupperware.com.cn/hmc/hybris')
      },
      handleCommand(command) {
        switch(command){
          case "password":
            this.$router.push({ path: '/frame/password' });
          break;
          case "myProject":
            this.$router.push({ path: '/epmsFrame/epmsPersonInfo/second' });
          break;
          case "menuSetting":
            this.$router.push({ path: '/epmsFrame/epmsPersonInfo/third' });
          break;
          case "langSwitch":
            this.$router.push({ path: '/epmsFrame/epmsPersonInfo/fourth' });
          break;
          case "toSay":
            this.$router.push({ path: '/epmsFrame/epmsPersonInfo/fivth' });
          break;
          case "out":
            this.$storage.setToken('')
            this.$router.push({ path: '/login' });
            this.$storage.clearAll()
          break;
        }
      },
      handleSelect(key, keyPath) {
        this.toggleLeft();
      },
      siwtchLan () {
        this.$i18n.locale = this.$i18n.locale === 'en' ? 'zh' : 'en'
      },
      toggleLeft () {
        this.$store.state.common.isCollapse = this.$store.state.common.isCollapse === true ? false : true
        this.iconName = this.$store.state.common.isCollapse === true ?'el-icon-arrow-right':'el-icon-arrow-left'
        this.menuTootip = this.$store.state.common.isCollapse === true ? this.$t('business.common.menuTootipOpen'):this.$t('business.common.menuTootip')
      }
    },
    mounted() {
      if (process.env.NODE_ENV == 'production') { 
        this.title = '特百惠.慧管理(试运营版)'
      }
      this.$store.commit('common/setPlatform',this.$storage.getValue('platform'));
    },
    watch: {
      '$store.state.common.isCollapse' : function (val){
        if(val)
          this.logoName = 'logo64';
        else
          this.logoName = 'logo';
      }
    }
  }
</script>

<style scoped>
.el-button--inherit {
  color: #fff;
  background-color: inherit;
  border-color: #2c3e50;
  height: 56px;
}
.el-button--inherit:hover {
  color: #000;
  background-color: #fcfcfc;
}
.logoBack{
  padding-top: 15px;
  float:left;
  width:240px; 
  height:57px;
  font-size: 16px;
  text-align:left;
}
.white{
  color: #fff;
}
.is-active{
  color: #fff
}
.fms{
  position:absolute;
  left: 122px;
  margin-top: -10px;
}
.logo64{
  padding-top: 18px;
  float:left;
  width:64px; 
  margin-left:-15px;
  font-size: 12px;
  background-color:#ff7000;
  height:57px;
  text-align:center
}
.logo{
  padding-top: 15px;
  float:left;
  width:180px; 
  margin-left:-15px;
  background-color:#ff7000;
  height:57px;
  text-align:center;
}
.logoImg{
  padding-top: 15px;
  float:left;
  width:170px; 
  margin-left:-15px;
  height:57px;
  text-align:center;
}
.logoImg span{
  font-size: 20px
}
.logo span{
  font-size: 20px
}
a{
  color: #fff;
}
a:hover
{ 
  background: #000
}
.navbar-dark{
  background-color: #4d4d4d;;
  border-color: #4d4d4d;;
  color: #fff
}

</style>
