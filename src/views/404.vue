<template>
  <div>
    <img class="background" src="404.png" />
    <h1>
      啊哦, 这个页面走失了！🥴
      <br />
      <v-btn @click="back" class="text-h6"> 点我返回首页 </v-btn>
    </h1>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    hasRoute(name, routeList) {
      !routeList &&
        ((routeList = this.$router.options.routes), console.log("执行"));
      for (let i = 0; i < routeList.length; i++) {
        console.log(routeList[i]);
        if (routeList[i].name === name) {
          return true;
        }
        if (routeList[i].children) {
          let flag = this.hasRoute(name, routeList[i].children);
          if (flag) {
            return flag;
          }
        }
      }
      return false;
    },
    back() {
      if (this.hasRoute("home")) {
        this.$router.replace({ path: "/home" });
      } else {
        this.$router.replace({ path: "/login" });
      }
    },
  },
};
</script>

<style scoped>
img.background {
  position: absolute;
  width: 100%;
  height: 100%;
}
h1 {
  position: absolute;
  top: 80%;
  left: 50%;
}
.err404 {
  width: 100%;
  height: 100vh;
  padding: 180px 0 0 420px;
  background-size: 100% 100%;
  background: url(../../public/404.png) no-repeat;
}
</style>