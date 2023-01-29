import _axios from "../utils/_axios";
const baseUrl = "/api/submits";

export function fun_getSubmitByWorkId(wid) {
  return _axios.get(baseUrl + "/byWid", {
    params: { wid: wid },
  });
}
export function fun_getSubmitBySId(sid) {
  return _axios.get(baseUrl + "/bySid", {
    params: { sid: sid },
  });
}
export function fun_getAllSubmitsByWid(wid) {
  return _axios.get(baseUrl, {
    params: { wid: wid },
  });
}
export function fun_getSubmitSummary(wid) {
  return _axios.get(baseUrl + "/summary", {
    params: { wid: wid },
  });
}
