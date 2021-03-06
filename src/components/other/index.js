// 这里的组件一般是第三方组件或者自己写的UI组件
import epmsProgressBar from './epmsProgressBar/index.js'

const components = [epmsProgressBar]

const install = function (Vue, opts = {}) {
  components.map(component => {
    Vue.component(component.name, component)
  })
}

export default {install}
