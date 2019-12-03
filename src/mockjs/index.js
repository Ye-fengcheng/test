import Mock from 'mockjs'

if(process.env.NODE_ENV == 'development1'){
  //开发环境才进行配置
  Mock.mock(process.env.SERVICE_IP+'/user/login', {
    code:0,
    msg:'',
    user:{
      'code'     : 'A2452',
      'name'     : '@name',
      'phone|11' : '1',
      'province' : '电脑部',
      'area'    : '华南',
      'email'    : '@email',
      "isOrdered|1": true
    }
  });
}

export default {};