import Vue from "vue";
import mainPlan from "./mainPlan.vue";
import mainPlan_router from "../../router/mainPlan_router";
import store from "../../store";
import "../../registerServiceWorker";
import axios from "axios";
import ElementUI from "element-ui";
import "../../assets/css/element-variables.scss"; //Element自定义主题
import vuescroll from "vuescroll";
import "vuescroll/dist/vuescroll.css";

Vue.use(ElementUI);
Vue.use(vuescroll);

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
//滚动条
Vue.prototype.$vuescrollConfig = {
  bar: {
    showDelay: 4000,
    background: "rgba(255,119,62,1)"
  }
};
new Vue({
  mainPlan_router,
  store,
  render: h => h(mainPlan)
}).$mount("#mainPlan");
