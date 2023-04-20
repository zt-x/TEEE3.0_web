module.exports = {
  // 开发阶段 true, 上线false
  productionSourceMap: false,
  publicPath: "./",
  transpileDependencies: ["vuetify"],
  devServer: {
    port: 443,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/",
        },
      },
      "/resources": {
        target: "http://localhost:8080",
        changeOrigin: true,
        pathRewrite: {
          "^/resources": "/",
        },
      },
    },
  },
};
