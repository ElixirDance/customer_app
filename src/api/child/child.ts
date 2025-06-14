import request from "@/utils/request";
import type { AddOrUpdateChildParams, ChildFilterParams, ChildFormResult, ChildsFormResult } from "@/types/child/child.d";

export const getChilds = (params = {}) => {
	return request<ChildsFormResult>({
	    url: "child/childs",
	    method: "get",
	    params
	});
}

//获取宝贝信息
export const getChild = (params: ChildFilterParams) => {	
    return request<ChildFormResult>({
        url: "child/child",
        method: "get",
        params
    });
};


//添加/更新宝贝信息
export const addChild = (params: AddOrUpdateChildParams) => {
    return request<ChildFormResult>({
        url: "child/add",
        method: "post",
        params
    });
};

export const updateChild = (params: AddOrUpdateChildParams) => {
    return request<ChildFormResult>({
        url: "child/update",
        method: "post",
        params
    });
};
