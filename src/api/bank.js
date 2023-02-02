import _axios from "../utils/_axios";
const baseUrl = "/api/banks";

// 作业库
export function fun_addWorkBank(workContent) {
  return _axios.post(baseUrl + "/work", workContent);
}
export function fun_updateWorkBank(workContent) {
  return _axios.put(baseUrl + "/work", workContent);
}

export function fun_getWorkBank() {
  return _axios.get(baseUrl + "/work");
}
export function fun_getWorkBankContent(bwid) {
  return _axios.get(baseUrl + "/work/content", { params: { bwid: bwid } });
}
export function fun_getWorkBankQuestions(bwid) {
  return _axios.get(baseUrl + "/work/questions", { params: { bwid: bwid } });
}
// 题库
export function fun_addQuestionBank(workContent) {
  return _axios.post(baseUrl + "/question", workContent);
}
