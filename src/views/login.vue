<template>
  <div>
    <v-img
      class="fill-height"
      src="../assets/img/pure_brown.png"
      :aspect-ratio="16 / 9"
      height="100vh"
      width="100vw"
    >
      <v-container fill-height fluid>
        <v-row justify="center" align="center" class="fill-height">
          <v-col cols="12" md="8" lg="6" xl="4">
            <v-card elevation="12" class="py-8">
              <v-card-text class="text-center">
                <h2 class="text-h4 font-weight-bold" style="color: #a36645">Sign In</h2>

                <div class="mt-8">
                  <v-row justify="center">
                    <v-col cols="12" md="10">
                      <v-text-field
                        label="请输入学号/教师号"
                        color="#b97a57"
                        solo
                        flat
                        outlined
                        prepend-inner-icon="mdi-account-outline"
                        hide-details
                        v-model="uid"
                        @keypress.enter="login()"
                      ></v-text-field>

                      <v-text-field
                        label="请输入密码"
                        color="#b97a57"
                        solo
                        flat
                        outlined
                        prepend-inner-icon="mdi-lock-open"
                        hide-details
                        class="mt-6"
                        type="password"
                        v-model="pwd"
                        @keypress.enter="login()"
                      ></v-text-field>

                      <div class="d-flex align-center justify-space-between mt-4">
                        <!-- <v-checkbox label="Remember me"></v-checkbox>

                      <div class="primary--text text-subtitle-1">
                        Lost password?
                      </div> -->
                        <div></div>
                        <div class="text-subtitle-1" style="color: #a36645"></div>
                      </div>

                      <div class="mt-6">
                        <v-btn
                          block
                          class="text-capitalize"
                          large
                          color="#a36645"
                          @click="login()"
                          dark
                          :loading="loading_btn"
                        >
                          <span class="text-subtitle-1"> 登录 </span>
                        </v-btn>
                      </div>

                      <div class="mt-6">
                        <span class="text-subtitle-1"> --- 其他登录方式 --- </span>

                        <div class="mt-2">
                          <v-btn color="light-green" icon large>
                            <v-icon large> mdi-wechat </v-icon>
                          </v-btn>

                          <v-btn color="indigo" icon large>
                            <v-icon large> mdi-qqchat </v-icon>
                          </v-btn>

                          <!-- <v-btn color="red" icon large>
                          <v-icon large> mdi-google </v-icon>
                        </v-btn> -->
                        </div>

                        <div class="mt-6">注册通道暂未对外开放，请联系管理员注册。</div>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-img>
  </div>
</template>

<script>
import { fun_login } from "../api/account";

export default {
  data() {
    return {
      uid: "",
      pwd: "",
      loading_btn: false,
    };
  },
  methods: {
    login() {
      this.loading_btn = true;
      fun_login(this.uid, this.pwd)
        .then((data) => {
          if (data.code > 0) {
            let ret = JSON.parse(data.data);
            window.localStorage.setItem("token", ret.token);
            window.localStorage.setItem("role", ret.role);
            this.$router.replace({ path: "/" });
          }
          this.loading_btn = false;
        })
        .catch((err) => {
          this.loading_btn = false;
        });
    },
  },
};
</script>
