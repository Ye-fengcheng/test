import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App'
import router from './router'
import './assets/css/bootstrap.css'
import { store } from './store'
import { i18n } from './lang'
import bootstrap from './components/bootstrap'
import otherComponets from './components/other'
import businessComponets from './components/business/assembly'
import ElementUI from 'element-ui'
import './elementVariables.scss'
//import 'element-ui/lib/theme-chalk/index.css'
//import './assets/css/ele/index.css'
import tupHttp from './service'
import util from './util'
import baseData from './baseData'
import dictionarie from './dictionarie'
import cookie from './cookie'
import storage from './storage'
import mockjs from './mockjs'
import xlsx from 'xlsx'

Vue.prototype.$ELEMENT = { size: 'mini'};
window.xlsx = xlsx;

Vue.use(ElementUI)
Vue.use(tupHttp)
Vue.use(util)
Vue.use(baseData)
Vue.use(dictionarie)
Vue.use(cookie)
Vue.use(storage)
Vue.use(VueResource)
Vue.use(bootstrap)
Vue.use(otherComponets)
Vue.use(businessComponets)

Vue.config.productionTip = false

//请求发起时做拦截
Vue.http.interceptors.push(function(request, next) {
    // ...
    // 是否需要先往MSB查询实际接口地址
    // request.header增加token,从localstorage取
    // data移除epmsMsbCode
    // 发起连接了token过期直接跳往登录界面
    //request.headers.set('Authorization', 'auto')
    /* if(!!request.body){
      if(request.body.epmsMsbCode)
        delete request.body.epmsMsbCode;
    }
    request.headers.set('X-Emp-No', uac.cookie.getCookie("PORTALSSOUser"))//存放员工短工号
    request.headers.set('X-Lang-Id', uac.cookie.getCookie("PORTALSSOLanguage"))//存放多语言ID的HTTP头
    request.headers.set('Internal', uac.cookie.getCookie("Internal"))//1:内部;0:外部
    request.headers.set('X-Auth-Val', uac.cookie.getCookie("PORTALSSOCookie"))//是否令牌验证的HTTP头  
    request.headers.set('X-Org-Id', '')//存放租户ID的HTTP头
    request.headers.set('X-Tenant-Id', '') //存放令牌数据验证的HTTP头    
    request.headers.set('X-Origin-ServiceName', '') //存放调用方的服务名
    debugger
    let language = i18n.locale == 'zh' ?'zh_CN' : 'en_US';
    request.headers.set('language', language) //中英文
    request.headers.set('deliveryConfigId', store.state.deliverConfigBo.deliveryConfigId) //交付配置ID
    request.headers.set('projId', store.state.deliverConfigBo.projId) //交付配置ID */
    request.headers.set('x_user_id',window.localStorage.getItem('pUid'))//存放token
    request.headers.set('x_auth_token',window.localStorage.getItem('token'))//存放token
    request.headers.set('x_request_platform','WEB')//存放token
    request.headers.set('x_request_application','dmz_web')//存放应用名
    
    //request.headers.set('x-token-skip','true')    
    if(process.env.NODE_ENV === 'development'){
      //开发环境直接跳过，
      next(function(response) {
        // ...
        // 请求发送后的处理逻辑
        // ...
        // 根据请求的状态，response参数会返回给successCallback或errorCallback
        return response
      })
    }
    else{
      console.log('拦截'+process.env.NODE_ENV);
      next(function(response) {
        // ...
        // 请求发送后的处理逻辑
        // ...
        // 根据请求的状态，response参数会返回给successCallback或errorCallback
        return response
      })
    }
    
}) 
//用户的信息，登录后重写
window.epmsUser = {
  userEmail:'',
  userId:'',
  userName:'',
  userPassword:''
};
/* eslint-disable no-new */

window.CryptoJS = require("crypto-js");
var epmsVue = Vue.extend({
})

window.IC = new epmsVue({
  el: '#app',
  router,
  store,
  tupHttp,
  util,
  cookie,
  storage,
  i18n,
  template: '<App/>',
  components: { App },
  beforeCreate(){
    if(this.$storage.getValue('power')){
      let power = JSON.parse(this.$storage.getValue('power'))
      this.$store.commit('common/setPower',power)
    }
  }
})

