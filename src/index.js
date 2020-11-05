import component from "./index.vue"
export default {
   component,
   install(Vue) {
      Vue.component("vue-swipe-show", this.component)
   }
}