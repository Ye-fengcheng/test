class BaseData{
  maxNumber = 2147483647;
  maxTitle = '受系统压力影响，翻页统计功能已关闭'
  constructor(){
  }
  /**
   * @param {*} vm vue实例
   * @param {*} data 
   * {
        "condition": {
          "catalogCode": "string",
          "isNewProduct": 0,
          "orderBy": [
            {
              "field": "string",
              "order": 0
            }
          ],
          "orderByStr": "string",
          "pCode": "string",
          "pName": "string",
          "pStatus": 0
        },
        "pagingQuery": {
          "pageIndex": 0,
          "pageSize": 0,
          "totalRows": 0
        }
      }
      //http://192.168.10.183:8080/swagger-ui.html#/backend-product-controller
   */
  productList(vm,data){
    return vm.$tupHttp(vm,'product/listAllProducts','POST',data);  
  }
  areaTree(vm){
    return vm.$tupHttp(vm,'area/area/tree/toProvince','GET');  
  }
  areaAllTree(vm){
    return vm.$tupHttp(vm,'area/tree','GET');  
  }
  area(vm){
    return vm.$tupHttp(vm,'area/regions','GET');  
  }
  listAllAreas(vm){
    return vm.$tupHttp(vm,'area/listAllAreas','GET');  
  }
  productCatalog(vm){
    return vm.$tupHttp(vm,'product/getProductCatalog?type=1','GET');  
  }
  getDicts(vm,data,callback){
    vm.$tupHttp(vm,'dict/getDicts','POST',data).then(res=>{
      callback(res.body.model)
    },res=>{
      let param = {}
      data.map(item=>{
        param[item] = [];
      })
      callback(param)
    })
  }      
}

function plugin(Vue) {
  if (plugin.installed) {
    return;
  }
  var baseData = new BaseData();
  Object.defineProperties(Vue.prototype, {
    $baseData: {
      get() {
        return baseData;
      }
    }
  });
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin);
}

export default plugin;