import _axios from "../utils/_axios";
const baseUrl = "/api/exams";

export function fun_getExamRulePre(wid) {
  return _axios.get(baseUrl + "/validate/pre", { params: { wid: wid } });
}
