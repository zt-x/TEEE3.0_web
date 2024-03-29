import _axios from "../utils/_axios";
const baseUrl = "/api/courses";

export function fun_getMyCourse(page) {
  return _axios.get(baseUrl, { params: { page: page } });
}
export function fun_getMyCourseWithCriteria(page, criteria) {
  return _axios.get(baseUrl, { params: { page: page, criteria: criteria } });
}
export function fun_createCourse(cname, classname, start_time, end_time) {
  return _axios.post(baseUrl + "/teacher", {
    cname: cname,
    classname: classname,
    startTime: start_time,
    endTime: end_time,
  });
}
export function fun_delCourse(cid) {
  return _axios.delete(baseUrl + "/teacher", { data: { cid: cid } });
}
export function fun_addUsersToCourses(users, cid) {
  return _axios.post(baseUrl + "/teacher/addUsers", { users: users, cid: cid });
}
export function fun_addCourse(cid) {
  return _axios.post(baseUrl + "/student", { cid: cid });
}
export function fun_getUsers(cid) {
  return _axios.get(baseUrl + "/users", { params: { cid: cid } });
}
export function fun_removeUsers(cid, uid) {
  console.log(cid);
  console.log(uid);

  return _axios.delete(baseUrl + "/teacher/delUser", {
    data: { cid: cid, uid: uid },
  });
}
export function fun_getInfo(cid) {
  return _axios.get(baseUrl + "/info", { params: { cid: cid } });
}
export function fun_getWorks(cid, page) {
  return _axios.get(baseUrl + "/works", { params: { cid: cid, page: page } });
}
export function fun_getExams(cid, page) {
  return _axios.get(baseUrl + "/exams", { params: { cid: cid, page: page } });
}
export function fun_getAnnouncement(cid) {
  return _axios.get(baseUrl + "/announcements", { params: { cid: cid } });
}
export function fun_leave(cid) {
  return _axios.delete(baseUrl + "/student", { data: { cid: cid } });
}
export function fun_getLastExamStatistics(cid) {
  return _axios.get(baseUrl + "/teacher/LEStatistic", { params: { cid: cid } });
}
export function fun_getFiveWorksAvg(cid) {
  return _axios.get(baseUrl + "/getFiveWorksAvg", { params: { cid: cid } });
}
export function fun_downloadExportUser(cid) {
  let url = baseUrl + "/teacher/downloadExportUser";
  let params = { cid: cid };
  if (params) {
    let paramsArray = [];
    //拼接参数
    Object.keys(params).forEach((key) =>
      paramsArray.push(key + "=" + params[key])
    );
    if (url.search(/\?/) === -1) {
      url += "?" + paramsArray.join("&");
    } else {
      url += "&" + paramsArray.join("&");
    }
  }
  return fetch(url, {
    method: "GET",
    cache: "no-cache",
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
}
