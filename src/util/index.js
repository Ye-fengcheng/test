import { debug } from "util";

//util工具类

class util{   
    constructor(){
    }
    deepCopyObject(source){ 
      let result={};
      for (let key in source) {
          result[key] = typeof source[key]==='object'? deepCoyp(source[key]): source[key];
      } 
      return result; 
    }
    formatThousandNotFixed(num){
      //千位分隔符+直接截取小数后两位
      let DIGIT_PATTERN = /(^|\s)\d+(?=\.?\d*($|\s))/g
      let MILI_PATTERN = /(?=(?!\b)(\d{3})+\.?\b)/g
      if(num){
        let txt = (Math.round(num*100)/100).toFixed(4).toString()
        return txt.substring(0,txt.indexOf(".") + 3).replace(DIGIT_PATTERN, (m) => m.replace(MILI_PATTERN, ',')) 
      }
      else{
        if(num == 0 || num =='0'){
          return '0.00'
        }else{
          return ''
        }          
      }
    }
    formatThousand(num,len){
      let DIGIT_PATTERN = /(^|\s)\d+(?=\.?\d*($|\s))/g
      let MILI_PATTERN = /(?=(?!\b)(\d{3})+\.?\b)/g
      if(num){
        return num.toFixed(len?len:0).toString().replace(DIGIT_PATTERN, (m) => m.replace(MILI_PATTERN, ',')) 
      }
      else{
        if(num == 0){
          return (0).toFixed(len?len:0)
        }else{
          return ''
        }          
      }
    }
    deepClone(obj){
      let result,oClass=this._isClass(obj);
      //确定result的类型
      if(oClass==="Object"){
        result={};
      }else if(oClass==="Array"){
        result=[];
      }else{
        return obj;
      }
      for(let key in obj){
        let copy=obj[key];
        if(this._isClass(copy)=="Object"){
          result[key]=this.deepClone(copy);//递归调用
        }else if(this._isClass(copy)=="Array"){
          result[key]=this.deepClone(copy);
        }else{
          result[key]=obj[key];
        }
      }
      return result;
    }  
    _isClass(o){
        if(o===null) return "Null";
        if(o===undefined) return "Undefined";
        return Object.prototype.toString.call(o).slice(8,-1);
    }
    isPC(){
      var userAgentInfo = navigator.userAgent.toLowerCase();
      var Agents = new Array("android", "iphone", "symbianOS", "windows phone", "ipad", "ipod");
      var flag = true;
      for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
      }
      return flag;
    }
    onKeyCode(vm,fun,param){
      document.onkeydown = null;
      document.onkeydown = function(){
        var oEvent = window.event;
        if (oEvent.keyCode ==13) {          
          vm[fun](...param)
        }
      }
    }
    readExcel(file,callback){
			let thiz = this;
			let rABS = typeof FileReader !== "undefined" && (FileReader.prototype||{}).readAsBinaryString;
			let reader = new FileReader();
			reader.readAsBinaryString(file);
			reader.onload = function(e) {
				if(typeof console !== 'undefined') console.log("onload", new Date());
				let data = e.target.result;
				if(!rABS) data = new Uint8Array(data);
				let wb;
				if(rABS) 
					wb = window.xlsx.read(data, {type: rABS ? 'binary' : 'array'})
				else {
					wb = window.xlsx.read(data, {type: rABS ? 'binary' : 'array'})
				}
				callback(thiz._tojson(wb),file)
			};
    }
    getRandom() {
      return Math.random()
    }
		_tojson(workbook) {
			var result = {};
			workbook.SheetNames.forEach(function(sheetName,index) {        
				var roa = window.xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {header:1});
				if(roa.length) result['sheet'+index] = roa;
			});
			return result;
    }
    winOpen(url){
      window.open(url)
    }
}



function plugin(Vue) {
  let ut = new util();
  if (plugin.installed) {
      return;
  }
  Object.defineProperties(Vue.prototype, {
    $util: {
      get() {
        return ut;
      }
    }
  });
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin);
}

if (!String.prototype.trim){ 
  /*---------------------------------------
   * 清除字符串两端空格，包含换行符、制表符
   * .replace(/(^[\s\n\t]+|[\s\n\t]+$)/g, "")
   *---------------------------------------*/
  String.prototype.trim = function () { 
   return this.replace(/^\s+|\s+$/gm,'');
  }
   
 }
Date.prototype.diff = function(date){
  return (this.getTime() - date.getTime())/(24 * 60 * 60 * 1000);
}
Date.prototype.format = function(fmt) { 
  var o = { 
    "M+" : this.getMonth()+1,                 //月份 
    "d+" : this.getDate(),                    //日 
    "h+" : this.getHours(),                   //小时 
    "m+" : this.getMinutes(),                 //分 
    "s+" : this.getSeconds(),                 //秒 
    "q+" : Math.floor((this.getMonth()+3)/3), //季度 
    "S"  : this.getMilliseconds()             //毫秒 
  }; 
  if(/(y+)/.test(fmt)) {
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
  }
  for(var k in o) {
    if(new RegExp("("+ k +")").test(fmt)){
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    }
  }
  return fmt; 
}

export default plugin;