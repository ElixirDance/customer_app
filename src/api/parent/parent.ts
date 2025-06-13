import request from "@/utils/request";
import type { ParentFormResult } from "@/types/parent/parent.d";

export const getParents = (params = {}) => {
	return request<ParentFormResult>({
	    url: "parent/parents",
	    method: "get",
	    params
	});
}
