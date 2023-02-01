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
export function fun_getQueContent(wid, qid) {
  return _axios.get(baseUrl + "/student/qContent", {
    params: { wid: wid, qid: qid },
  });
}
export function fun_getWorkTimer(wid) {
  return _axios.get(baseUrl + "/student/timer", {
    params: { wid: wid },
  });
}
export function fun_submit(wid, ans, files) {
  return _axios.post(baseUrl + "/student", {
    wid: wid,
    ans: ans,
    files: files,
  });
}

// Teacher
export function fun_releaseWork(aWork) {
  return _axios.post(baseUrl + "/teacher", aWork);
}
export function fun_setRule(wr) {
  return _axios.post(baseUrl + "/teacher/setRules", wr);
}
export function fun_delWork(wid) {
  return _axios.delete(baseUrl + "/teacher", { data: { wid: wid } });
}
export function fun_getSummary(cid) {
  return _axios.get(baseUrl + "/teacher/summary", { params: { cid: cid } });
}
