import _axios from "../utils/_axios";
const baseUrl = "/api/works";
export function fun_getWorkStatus(cid) {
  return _axios.get(baseUrl + "/student/status", {
    params: { cid: cid },
  });
}
export function fun_getWorkContent(wid) {
  return _axios.get(baseUrl + "/student/content", {
    params: { wid: wid },
  });
}
export function fun_getWorkTimer(wid) {
  return _axios.get(baseUrl + "/student/timer", {
    params: { wid: wid },
  });
}
export function fun_submit(wid, ans, files) {
  return _axios.post("/student", { wid: wid, ans: ans, files: files });
}
