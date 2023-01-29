import axios from "axios";
import vue from "@/main";
// const _axios = axios.create({
//   baseURL: Const.base_url_head + Const.base_url_address,
// });
const _axios = axios.create();
// 添加请求拦截器
_axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = localStorage.getItem("token");
    }
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
_axios.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    if (response.data.code < 0) {
      vue.$toasted.show(response.data.msg, {
        type: "error",
        theme: "outline",
        position: "top-center",
        duration: 2500,
      });
      if (response.data.code == -4) {
        vue.$router.replace({ path: "/login" });
      } else {
        return response.data;
      }
    } else {
      return response.data;
    }
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default _axios;
