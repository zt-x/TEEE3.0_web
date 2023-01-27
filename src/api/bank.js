import _axios from "../utils/_axios";
const baseUrl = "/api/banks";

// 作业库
export function fun_addWorkBank(workContent) {
  return _axios.post(baseUrl + "/work", workContent);
}

// 题库
export function fun_addQuestionBank(workContent) {
  return _axios.post(baseUrl + "/question", workContent);
}
