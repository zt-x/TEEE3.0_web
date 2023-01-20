import _axios from "../utils/_axios";

export function fun_getMyCourse() {
  return _axios.get("/api/courses");
}
