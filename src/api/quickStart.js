import _axios from "../utils/_axios";
const baseUrl = "/api/qstarts";

export function fun_getTodoList() {
	return _axios.get(baseUrl+"/todo");
}
export function fun_getBankSummary() {
	return _axios.get(baseUrl+"/bank");
}