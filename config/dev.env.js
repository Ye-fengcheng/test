var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  SERVICE_IP: '"http://admin.tbh.mobi"',
  HH_SERVICE_IP: '"https://test.tbh.cn"',
  BUILD_ENV: '""'
})
