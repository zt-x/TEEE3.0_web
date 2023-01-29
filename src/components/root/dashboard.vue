<template>
  <div>
    <v-navigation-drawer
      app
      :mini-variant="!mini"
      :expand-on-hover="!mini"
      v-model="drawerDisplay"
      :temporary="temp"
    >
      <!-- 个人信息 -->
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title class="text-h5 font-weight-black">
            <v-icon v-show="!mini">mdi-account</v-icon>
            <v-btn icon></v-btn>

            <v-btn text @click="logout()">
              <div class="d-flex align-center">
                <v-avatar size="32">
                  <v-img :src="user.avatar" alt="avatar" />
                </v-avatar>
                <div class="ml-2 subtitle-2">{{ user.uname }}</div>
              </div>
            </v-btn>

            <v-btn icon></v-btn>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <!-- 导航菜单 -->
      <v-list nav>
        <v-list-item
          v-for="item in drawer"
          :key="item.title"
          :to="item.to"
          :href="item.href"
          :target="item.target"
          exact
          color="primary"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- <v-app-bar app flat color="white">
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.lgAndDown"
        @click="drawerDisplay = !drawerDisplay"
      />

      <v-toolbar-items class="d-flex align-center">
        <v-text-field
          hide-details
          flat
          dense
          outlined
          solo
          label="Search"
          prepend-inner-icon="mdi-magnify"
        />
      </v-toolbar-items>

      <v-spacer />

      <v-btn icon>
        <v-icon>
          mdi-bell-outline
        </v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>
          mdi-apps-box
        </v-icon>
      </v-btn>

      <v-btn text>
        <div class="d-flex align-center">
          <v-avatar size="32">
            <img
              src="https://cdn.pixabay.com/photo/2020/11/08/10/25/dog-5723334_1280.jpg"
              alt="avatar"
            />
          </v-avatar>

          <div class="ml-1 subtitle-2">
            Admin
          </div>
        </div>
      </v-btn>
    </v-app-bar> -->

    <v-main>
      <div style="height: 30px"></div>
      <router-view />
      <v-fab-transition>
        <v-btn
          x-small
          v-show="$vuetify.breakpoint.mdAndDown"
          color="brown"
          dark
          fixed
          top
          left
          fab
          @click.stop="drawerDisplay = !drawerDisplay"
        >
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </v-fab-transition>
    </v-main>
  </div>
</template>

<script>
import { resetRouter, setRouter } from "@/router/setRouter.js";
import { fun_getRoutes } from "@/api/account.js";
import { unlimit } from "@/plugins/myfun";

export default {
  data: () => ({
    temp: false,
    drawerDisplay: null,
    drawer: [
      { title: "Back to front", icon: "mdi-arrow-left", to: "/" },
      {
        title: "Free Download",
        icon: "mdi-download",
        href: "https://github.com/AGDholo/shock",
        target: "_black",
      },
      {
        title: "Dashboard",
        icon: "mdi-home",
        to: "/dashboard/pages/dashboards/dashboard",
      },
      {
        title: "Profile",
        icon: "mdi-face-profile",
        to: "/dashboard/pages/examples/profile",
      },
      {
        title: "Sign-in",
        icon: "mdi-login",
        to: "/dashboard/pages/examples/sign-in",
      },
    ],
    user: {
      uname: "",
      avatar: "",
      role: -1,
    },
  }),
  computed: {
    mini() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  created() {
    let _this = this;
    // 加载路由
    //配置路由
    resetRouter();

    // 初始化用户信息
    fun_getRoutes()
      .then((data) => {
        if (data.code > 0) {
          let routers = eval("(" + data.data.routers + ")");
          sessionStorage.setItem("serverRoutes", JSON.stringify(routers));
          setRouter(routers);
          _this.drawer.length = 0;
          routers.forEach((element) => {
            if (element.show == 1) {
              _this.drawer.push({
                title: element.name,
                icon: element.icon,
                to: element.path,
              });
            }
          });
          _this.user.uname = data.data.uname;
          _this.user.role = data.data.role;
          _this.user.avatar = data.data.avatar;
          this.$router.replace({ path: "/home" });
        } else {
          _this.$toasted.show(data.msg, {
            theme: "outline",
            position: "top-center",
            duration: 2000,
          });
          this.$router.replace({ path: "/login" });
        }
      })
      .catch((err) => {
        console.log(err);
        this.$toasted.show(err, {
          theme: "outline",
          position: "top-center",
          duration: 2000,
        });
      });
  },
  mounted() {
    this.drawerDisplay = this.$vuetify.breakpoint.smAndDown ? false : true;
    unlimit(window, document);
  },
  methods: {
    logout() {
      // TODO
      window.localStorage.setItem("token", "");
      window.localStorage.setItem("role", "");
      this.$router.replace({ path: "/login" });
    },
  },
};
</script>
