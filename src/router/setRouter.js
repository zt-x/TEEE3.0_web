import router from "./index";
import { routes } from "./index";
import VueRouter from "vue-router";
router.beforeEach((to, from, next) => {
  //验证token存在，则进入该页面
  if (to.path == "/login") {
    localStorage.setItem("token", "");
    sessionStorage.setItem("serverRoutes", "");
  }
  if (localStorage.getItem("token")) {
    next();
  } else {
    if (to.path === "/login") {
      next();
    } else {
      next("/login");
    }
  }
});

export function resetRouter() {
  router.matcher = new VueRouter({ routes }).matcher;
}
export function setRouter(routers) {
  for (const { name, path, component, icon } of routers) {
    if (path != null) {
      router.addRoute("dashboard", {
        path: path,
        name: name,
        component: () => import(`@/views/dashboards/${component}`),
      });
    }
  }
}
