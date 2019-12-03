//cookie操作类

class cookie{   
  constructor(){
  }
  //写cookies,默认30天有效
  setCookie(name,value)
  {
    let Days = 30;
    let exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ window.escape (value) + ";expires=" + exp.toGMTString();
  }
  //读取cookie
  getCookie(name)
  {
    var arr,reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
      return window.unescape(arr[2]);
    return null;
  }
  delCookie(name)
  {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = this.getCookie(name);
    if(cval!=null)
      document.cookie= name + "="+cval+";expires="+exp.toGMTString();
  }
}

function plugin(Vue) {
  let co = new cookie();
  if (plugin.installed) {
    return;
  }
  Object.defineProperties(Vue.prototype, {
    $cookie: {
      get() {
        return co;
      }
    }
  });
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin);
}

export default plugin;