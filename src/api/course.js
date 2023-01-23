import _axios from "../utils/_axios";
const baseUrl = "/api/courses";
export function fun_getMyCourse(page) {
  return _axios.get(baseUrl, { params: { page: page } });
}
export function fun_createCourse(cname, college, start_time, end_time) {
  return _axios.post(baseUrl + "/teacher", {
    cname: cname,
    college: college,
    startTime: start_time,
    endTime: end_time,
  });
}
export function fun_delCourse(cid) {
  return _axios.delete(baseUrl + "/teacher", { cid: cid });
}
export function fun_addCourse(cid) {
  return _axios.post(baseUrl + "/student", { cid: cid });
}
export function fun_getUsers(cid) {
  return _axios.get(baseUrl + "/users", { params: { cid: cid } });
}
export function fun_getInfo(cid) {
  return _axios.get(baseUrl + "/info", { params: { cid: cid } });
}
export function fun_getWorks(cid) {
  return _axios.get(baseUrl + "/works", { params: { cid: cid } });
}
export function fun_getAnnouncement(cid) {
  return _axios.get(baseUrl + "/announcements", { params: { cid: cid } });
}
export function fun_leave(cid) {
  return _axios.delete(baseUrl + "/student", {
    params: { cid: cid },
  });
}
