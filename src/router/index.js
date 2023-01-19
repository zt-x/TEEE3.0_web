import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    component: () => import("../views/login.vue"),
  },
  {
    path: "/main",
    component: () => import("../components/root/dashboard"),
    children: [
      {
        path: "/dashboards/home",
        name: "dashboards-home",
        component: () => import("../views/dashboards/home.vue"),
      },
      {
        path: "/examples/profile",
        name: "examples-profile",
        component: () => import("../views/examples/Profile.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
