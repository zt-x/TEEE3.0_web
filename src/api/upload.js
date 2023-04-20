import axios from "axios";
const baseUrl = "/api";

export async function fun_upload(url, file) {
  var that = this;
  // 获取到this 赋值个that

  if (!file) {
    return;
  } // 如果没有文件就返回
  // 拿到上传的文件
  let param = new FormData();
  let _this = this;
  param.append("file", file);
  let config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: localStorage.getItem("token"),
    },
  };
  let ret = "";
  // 尝试上传Files
  await axios
    .post(baseUrl + url, param, config)
    .then((res) => {
      if (res.data.code < 0) {
        // 上传失败
        ret = eval('["[失败]' + res.data.msg + '"]');
      } else {
        ret = res.data.msg;
      }
    })
    .catch((err) => {
      _this._alert("上传失败" + err);
    });

  return ret;
}
