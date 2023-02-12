import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

export const routes = [
  {
    path: "/",
    name: "dashboard",
    component: () => import("@/components/root/dashboard.vue"),
  },
  {
    path: "/login",
    component: () => import("@/views/login.vue"),
  },
  {
    path: "/doWork",
    name: "doWork",
    component: () => import("@/views/doWork.vue"),
	},
	// {
	// 	path: '*',
	// 	redirect: 'home'
	//   }
];

const router = new VueRouter({
  routes,
});
function setRouter(routers) {
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
const serverRoutes = sessionStorage.getItem("serverRoutes");
if (serverRoutes) {
  const arr = JSON.parse(serverRoutes);
  setRouter(arr);
}

export default router;
