import request from "@/utils/request";
import type { ParentFormResult, ParentFilterParams } from "@/types/parent/parent.d";

export const getParents = (params = {}) => {
	return request<ParentFormResult>({
	    url: "parent/parents",
	    method: "get",
	    params
	});
}

export const deleteParent = (params: ParentFilterParams) => {
	return request<ParentFormResult>({
	    url: "parent/delete",
	    method: "post",
	    params
	});
}
