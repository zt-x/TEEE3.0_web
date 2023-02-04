import _axios from "../utils/_axios";
const baseUrl = "/api/keys";

// key:{action:int, param: int, restTime: int}
export function fun_createKey(action, param, restTime) {
  return _axios.post(baseUrl, {
    action: action,
    param: param,
    restTime: restTime,
  });
}

export function fun_useKey(key) {
  return _axios.post(baseUrl + "/use", { key: key });
}
