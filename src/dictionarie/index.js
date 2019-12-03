//数据字典
var dictionarie = {
  //促销规则类型
  promotionGuideType : ['优惠','买赠','满赠/KIT—单品','满单']
};


function plugin(Vue) {
  if (plugin.installed) {
    return;
  }
  Object.defineProperties(Vue.prototype, {
    $dictionarie: {
      get() {
        return dictionarie;
      }
    }
  });
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin);
}

export default plugin;