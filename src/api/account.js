import _axios from "../utils/_axios";

export function fun_login(uid, pwd) {
  return _axios.post("/api/accounts/login", {
    uid: uid.trim(),
    pwd: pwd.trim(),
  });
}
export function fun_register(uid, pwd, uname, role) {
  return _axios.post("/api/accounts/register", {
    uid: uid.trim(),
    pwd: pwd.trim(),
    uname: uname.trim(),
    role: role,
  });
}
export function fun_updateUserInfo(uid, pwd) {
  return _axios.post("/api/accounts/login", {
    uid: uid.trim(),
    pwd: pwd.trim(),
  });
}
export function fun_getUserInfo(uid) {
  return _axios.get("/api/accounts", { params: { uid: uid } });
}
export function fun_delUser(uid) {
  return _axios.delete("/api/accounts", { data: { uid: uid } });
}
export function fun_resetPwd(pwd) {
	return _axios.post("/api/accounts/resetPassword", {
		pwd: pwd.trim(),
	  });
	
}
export function fun_getRoutes() {
  return _axios.get("/api/accounts/routes");
}
