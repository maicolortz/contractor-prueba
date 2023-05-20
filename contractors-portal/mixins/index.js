import DrawerMixin from '~/mixins/menu'
import ExcelMixin from '~/mixins/excel'

export default {
  install(Vue) {
    Vue.use(DrawerMixin)
    Vue.use(ExcelMixin)
  },
}
