import Vue from "vue"
import App from "./App.vue"
import vueswipeshow from "./index.js"

Vue.use(vueswipeshow)
new Vue({
   el: "#app",
   components: { App },
   template: "<App/>"
})