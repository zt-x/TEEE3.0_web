// Result register(JSONObject jo);
// Result login(JSONObject jo);
// Result updateUserInfo(JSONObject jo);
// Result getUserInfo(Long uid);
// Result delUser(Long uid);

import _axios from "../utils/interceptors";

export function fun_login(uid, pwd) {
  return _axios.post("/api/accounts/login", { uid: uid, pwd: pwd });
}
export function fun_register(uid, pwd, uname, role) {
  return _axios.post("/api/accounts/login", {
    uid: uid,
    pwd: pwd,
    uname: uname,
    role: role,
  });
}
export function fun_updateUserInfo(uid, pwd) {
  return _axios.post("/api/accounts/login", { uid: uid, pwd: pwd });
}
export function fun_getUserInfo(uid, pwd) {
  return _axios.post("/api/accounts/login", { uid: uid, pwd: pwd });
}
export function fun_delUser(uid, pwd) {
  return _axios.post("/api/accounts/login", { uid: uid, pwd: pwd });
}
