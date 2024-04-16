if (window.location.origin.indexOf("http://localhost") === -1) {
  const accessToken = VueCookies.get("access_token");
  if (!accessToken) {
    window.location.href = window.location.origin;
  }
}

import '@mdi/font/css/materialdesignicons.css'
import "@babel/polyfill";
import Vue from "vue";
import App from "./App.vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import { store } from "./store";
import router from "./router";
import VueCookies from "vue-cookies";
import { Datetime } from "vue-datetime";
import "leaflet/dist/leaflet.css";
import "vue-datetime/dist/vue-datetime.css";
import "chartjs-plugin-annotation";

Vue.config.productionTip = true;
Vue.config.devtools = false;
Vue.use(Vuetify);
Vue.use(VueCookies);
Vue.use(Datetime);

export default new Vuetify({
  icons: {
    iconfont: 'mdi', // default - only for display purposes
  },
})
new Vue({
  render: h => h(App),
  store,
  router: router,
  vuetify: new Vuetify({
    icons: {
      iconfont: "mdiSvg" // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4'
    }
  })
}).$mount("#app");
