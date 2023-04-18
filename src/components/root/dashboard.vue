<template>
  <div>
    <userInfo :showDialog.sync="dialog_userinfo" />
    <reset-pwd-dialog :showDialog.sync="dialog_resetpwd" />
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

            <v-btn text @click="dialog_userinfo = true">
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
          color="#b97a57"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <v-list-item exact color="red">
          <div></div>
          <v-list-item-content>
            <v-btn dark color="black" @click="logout()">
              <v-list-item-title>退出登录</v-list-item-title>
            </v-btn>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-navigation-drawer>

    <v-app-bar app flat color="white" class="px-2">
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.lgAndDown"
        @click="drawerDisplay = !drawerDisplay"
      />
      <v-btn icon @click="$router.back()">
        <v-icon> mdi-arrow-left </v-icon>
      </v-btn>
      <v-toolbar-items class="d-flex align-center ml-2">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              ref="ukf"
              hide-details
              flat
              dense
              outlined
              solo
              label="输入码"
              prepend-inner-icon="mdi-key"
              v-bind="attrs"
              v-on="on"
              v-model="key"
              @keypress.enter="useKey(key)"
            />
          </template>
          <span
            >快捷使用码(签到码、课程邀请码、导入库码等), 按下回车键使用</span
          >
        </v-tooltip>
      </v-toolbar-items>

      <v-spacer />
      <v-btn icon>
        <v-icon> mdi-bell-outline </v-icon>
      </v-btn>

      <v-btn text @click="dialog_userinfo = true">
        <div class="d-flex align-center">
          <v-avatar size="32">
            <v-img :src="user.avatar" alt="avatar" />
          </v-avatar>

          <div class="ml-1 subtitle-2">{{ user.uname }}</div>
        </div>
      </v-btn>
    </v-app-bar>

    <v-main class="bgc">
      <!-- <div style="height: 30px"></div> -->
      <router-view />
      <v-fab-transition>
        <v-btn
          x-small
          v-show="$vuetify.breakpoint.mdAndDown"
          color="#be8464"
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
import userInfo from "../comp/dialog/userInfo.vue";
import ResetPwdDialog from '../comp/dialog/resetPwdDialog.vue';

import { resetRouter, setRouter } from "@/router/setRouter.js";
import { fun_getRoutes } from "@/api/account.js";
import { fun_useKey } from "@/api/key";
import { unlimit, _alert } from "@/plugins/myfun";

export default {
  components: { userInfo, ResetPwdDialog },
  data: () => ({
    dialog_userinfo: false,
    dialog_resetpwd: false,
    temp: false,
    drawerDisplay: null,
    drawer: [],
    user: {
      uname: "",
      avatar: "",
      role: -1,
    },
    key: "",
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
          _this.$toasted.success("欢迎回来, " + this.user.uname, {
            theme: "outline",
            position: "top-center",
            duration: 2000,
          });
			this.$router.replace({ path: "/home" });
			if (Number(data.data.loginCount) <= 0) {
				_this.dialog_resetpwd = true;
			}
        } else {
        //   _this.$toasted.show(data.msg, {
        //     theme: "outline",
        //     position: "top-center",
        //     duration: 2000,
        //   });
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
    useKey() {
      fun_useKey(this.key).then((res) => {
        if (res.code > 0) {
          _alert(res.msg);
        }
      });
      this.key = "";
    },
  },
};
</script>
<style scoped>
.bgc {
  background-image: linear-gradient(135deg, #fdfcfb 0%, #e9e6e4 100%);
}
</style>