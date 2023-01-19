import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: "/dashboard/pages",
    component: () => import("../components/root/dashboard"),
    children: [	
      {
        path: "/dashboard/pages/dashboards/dashboard",
        name: "dashboard-pages-dashboards-dashboard",
        component: () =>
          import("../views/dashboard/pages/dashboards/Dashboard.vue"),
      },
      {
        path: "/dashboard/pages/examples/profile",
        name: "dashboard-pages-examples-profile",
        component: () =>
          import("../views/dashboard/pages/examples/Profile.vue"),
      },
      {
        path: "/dashboard/pages/examples/sign-in",
        name: "dashboard-pages-examples-sign-in",
        component: () =>
          import("../views/dashboard/pages/examples/Sign-in.vue"),
      },
    ],
  }
]

const router = new VueRouter({
  routes
})

export default router
