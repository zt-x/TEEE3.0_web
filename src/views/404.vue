<template>
  <!-- <div class="err404">
    <h1>啊呜, 您访问的页面不见了！</h1>
    <h5>
      <router-link to="home" class="go-home">去首页</router-link>
    </h5>
  </div> -->
  <div>
    <img class="background" src="404.png" />
    <h1>
      啊哦, 这个页面走失了！🥴
      <br />
      <v-btn to="home" class="text-h6"> 点我返回首页 </v-btn>
    </h1>
  </div>
</template>

<script>
export default {
  data() {
    return {};
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