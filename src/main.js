import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import toasted from "./plugins/toasted";
import * as apexcharts from "./plugins/apexcharts";
import router from "./router";
import "@mdi/font/css/materialdesignicons.css";
import "./plugins/fontawesome";
import VueTypedJs from 'vue-typed-js'
import Dialog from "vue-dialog-loading";
Vue.config.productionTip = false;
Vue.use(VueTypedJs);
Vue.use(Dialog, {
  dialogBtnColor: "#0f0",
  background: "rgba(0, 0, 0, 0.5)",
});
export default new Vue({
  vuetify,
  apexcharts,
  toasted,
  router,
  render: (h) => h(App),
}).$mount("#app");
