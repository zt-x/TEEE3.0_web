import _axios from "../utils/_axios";

export function fun_getMyCourse(page) {
  return _axios.get("/api/courses", { params: { page: page } });
}
export function fun_createCourse(cname, college, start_time, end_time) {
  return _axios.post("/api/courses/teacher", {
    cname: cname,
    college: college,
    startTime: start_time,
    endTime: end_time,
  });
}
export function fun_addCourse(cid) {
  return _axios.post("/api/courses/student", { cid: cid });
}
