import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import toasted from "./plugins/toasted";
import * as apexcharts from "./plugins/apexcharts";
import router from "./router";
import "@mdi/font/css/materialdesignicons.css";

Vue.config.productionTip = false;

new Vue({
  vuetify,
  apexcharts,
  toasted,
  router,
  render: (h) => h(App),
}).$mount("#app");
