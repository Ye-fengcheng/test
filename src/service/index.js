// http访问类
let serviceIp = process.env.SERVICE_IP
let hhServiceIp = process.env.SERVICE_IP
//serviceIp = 'http://admin.tbh.mobi'
//serviceIp = 'https://admin.tupperware.net.cn'
//serviceIp = 'https://admin.tupperware.com.cn'

class baseHttp {
  constructor (serviceIp, service = '') {
    this.serviceIp = serviceIp
    this.service = service
  }
  downLoadByForm (url, data, method) {
    let body = $(document.body),
      form = $('<form target="iframe4Post" id="downFileForm"></form>'),
      input
    let type = method
    form.attr({'action': url, 'method': type}) // 设置跳转
    /* $.each(data,function(key,value){ // 封装name和value
      input = $("<input type='hidden'>");
      input.attr({"name":key});
      input.val(value);
      form.append(input);
    }); */
    input = $("<input type='hidden'>")
    input.attr({'name': 'data'})
    input.val(JSON.stringify(data))
    form.append(input)

    input = $("<input type='hidden'>")
    input.attr({'name': 'x_user_id'})
    input.val(window.localStorage.getItem('pUid'))
    form.append(input)

    input = $("<input type='hidden'>")
    input.attr({'name': 'x_auth_token'})
    input.val(window.localStorage.getItem('token'))
    form.append(input)

    input = $("<input type='hidden'>")
    input.attr({'name': 'x_request_platform'})
    input.val('WEB')
    form.append(input)
    if ($('#iframe4Post').length == 0) { // 设置隐藏域iframe
      body.append('<iframe style="display:none;" name="iframe4Post" id="iframe4Post"></iframe>')
    }
    body.append(form)
    form.submit()
    body.find('#downFileForm').remove()
  }
  replaceObj(data){
    //字符串trim掉前后空格
    let thiz = this;
    Object.keys(data).map(item=>{ 
      if(typeof(data[item]) == 'string'){
        data[item] = data[item].trim()
      }
      if(Object.prototype.toString.call(data[item]) === '[object Object]'){        
        data[item] = thiz.replaceObj(data[item])
      }
    })
    return data
  }
  getFunc () {
    let thiz = this
    let func = function (vm, url, method = 'GET', data = {}, headers = {}, moduleName = '', isDownload = false,serviceDir = '/backend/') {
      if (url.indexOf('http') < 0 || url.indexOf('=http') > 0) { // 考虑到会把链接当成参数的情况，加入第二种情况
        if(thiz.service){
          serviceDir = thiz.service
        }
        url = thiz.serviceIp + serviceDir + moduleName + url
      }
      // url = thiz.serviceIp + thiz.service + moduleName + url
      /* if(isDownload){
        //thiz.downLoadByForm(url,data,method)
        $.ajax({
          type: "POST",
          url: url,
          data: JSON.stringify(data),
          headers:{
            x_user_id:window.localStorage.getItem('pUid'),
            x_auth_token:window.localStorage.getItem('token'),
            x_request_platform:'WEB',
            'Content-Type':'application/json'
          },
          dataType: "text",
          beforeSend: function (xhr) {
          },
          complete: function (xhr, status) {
            debugger
          },
          success: function (data) {
            debugger
          }
        });
        return;
      } */
      /* if (!window.localStorage.getItem('token') && url.substring(url.length - 5) != 'login') {
        this.$router.push({
          path: '/login'
        })
        return
      } */
      let promise = new Promise((resolve, reject) => {
        let pro = null
        if (method == 'POST') {
          //data = thiz.replaceObj(data)
          pro = vm.$http.post(url, data, headers)
        } else if (method == 'GET') {
          pro = vm.$http.get(url, data, headers)
        } else if (method == 'PUT') {
          pro = vm.$http.put(url, data, headers)
        } else if (method == 'DELETE') {
          pro = vm.$http.delete(url, data, headers)
        }
        pro.then(response => {
          if (response.body.success) {
            resolve(response)
          } else {
            if (response.body.resultCode == '403') {
              vm.$router.push({ path: '/login' })
              return
            }
            vm.$notify.error({
              title: '错误提示',
              message: response.body.message
            })
            reject(response)
          }
        }, response => {
          let message = response.url + '请求出错'
          if (process.env.NODE_ENV == 'production') { message = '请求出错，请稍后再试或者联系IT管理员' }
          vm.$notify.error({
            title: '错误提示',
            message: message
          })
          reject(response)
        })
      })
      return promise
    }
    return func
  }
  getChechLogin () {
    let fun = function (vm) {
      if (this.$storage.getToken()) {
        vm.$router.push({ path: '/login' })
      }
    }
    return fun
  }
}

function plugin (Vue) {
  if (plugin.installed) {
    return
  }
  Object.defineProperties(Vue.prototype, {
    $serviceIp :{
      get (){
        return serviceIp
      }
    },
    $tupHttp: {
      get () {
        return new baseHttp(serviceIp, null).getFunc()
      }
    },
    $hsyHttp: { // hsy
      get () {
        return new baseHttp(hhServiceIp, '/').getFunc()
      }
    },
    $chechLogin: {
      get () {
        return new baseHttp('').getChechLogin()
      }
    },
    $epmsEnv: {
      get () {
        return window.epmsEnv
      }
    }
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}

export default plugin
