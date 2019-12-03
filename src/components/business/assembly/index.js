// 这里的组件一般是第三方组件或者自己写的UI组件
import epmsGbomSelect from './epmsGbomSelect/index.js'
import tupProductSelect from './tupProductSelect/index.js'
import tupGiftSelect from './tupGiftSelect/index.js'
import tupAraeStoreSelect from './tupAraeStoreSelect/index.js'
import tupAraeSelect from './tupAraeSelect/index.js'
import tupAraeMeterSelect from './tupAraeMeterSelect/index.js'
import tupPictureSelect from './tupPictureSelect/index.js'
import elInputProductCode from './elInputProductCode/index.js'
import elInputMutProductCode from './elInputMutProductCode/index.js'
import elInputCustomer from './elInputCustomer/index.js'
import elInputEmployees from './elInputEmployees/index.js'
const components = [epmsGbomSelect,tupProductSelect,tupGiftSelect,tupAraeStoreSelect,tupAraeSelect,tupAraeMeterSelect,tupPictureSelect,elInputProductCode,elInputMutProductCode,elInputCustomer,elInputEmployees]

const install = function (Vue, opts = {}) {
  components.map(component => {
    Vue.component(component.name, component)
  })
}

export default {install}
