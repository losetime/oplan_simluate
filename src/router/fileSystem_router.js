import Vue from "vue";
import Router from "vue-router";
import trash from "../components/fileSystem/trash.vue";
import windPower from "../components/fileSystem/windPower.vue";
import chartMap from "../components/fileSystem/chartMap.vue";
import networkBrowse from "../components/fileSystem/networkBrowse.vue";
import networkEdit from "../components/fileSystem/networkEdit.vue";
Vue.use(Router);
export default new Router({
  routes: [
    {
      path: "/trash",
      name: "trash",
      component: trash,
      meta: {
        breadcrumbName: "垃圾桶"
      }
    },
    {
      path: "/windPower",
      name: "windPower",
      component: windPower,
      meta: {
        breadcrumbName: "风力"
      }
    },
    {
      path: "/chartMap",
      name: "chartMap",
      component: chartMap,
      children: [
        {
          path: "networkBrowse",
          name: "networkBrowse",
          component: networkBrowse
        },
        {
          path: "networkEdit",
          name: "networkEdit",
          component: networkEdit
        }
      ]
    }
  ]
});
