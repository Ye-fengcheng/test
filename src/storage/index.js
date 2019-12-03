//localStorage操作类,只封装几个

class storage{
  userName='';   
  pUid='';
  pOrganization='';
  pPosition='';
  token=''
  constructor(){
  }
  setName(value)
  {
    this.setValue('userName',value)
  }
  getName(){
    return this.getValue('userName')
  }
  setUid(value)
  {
    this.setValue('pUid',value)
  }
  getUid(){
    return this.getValue('pUid')
  }
  setpOrganization(value)
  {
    this.setValue('pOrganization',value)
  }
  getpOrganization(){
    return this.getValue('pOrganization')
  }
  setpPosition(value)
  {
    this.setValue('pPosition',value)
  }
  getpPosition(){
    return this.getValue('pPosition')
  }
  setToken(value)
  {
    this.setValue('token',value)
  }
  getToken(){
    return this.getValue('token')
  }
  setValue(id,value){
    window.localStorage.setItem(id,value);
  }
  getValue(id){
    return window.localStorage.getItem(id);
  }
  clearAll(){
    window.localStorage.clear();
  }
}

function plugin(Vue) {
  let sto = new storage();
  if (plugin.installed) {
    return;
  }
  Object.defineProperties(Vue.prototype, {
    $storage: {
      get() {
        return sto;
      }
    }
  });
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin);
}

export default plugin;