import request from "@/utils/request";
import type { ChildFilterParams, ChildFormResult } from "@/types/child/child.d";

//获取宝贝信息
export const getChild = async (params: ChildFilterParams, url?: string) => {
	// if (import.meta.env.MOCK_API) {
		// 模拟服务端返回数据
	const mockData = {
		id: params.id,
		name: '小明',
		birthDate: new Date('2018-05-12').getTime(),
		gender: 'male',
		region: '上海市浦东新区',
		hobbies: ['reading', 'sports'],
		remark: '对花粉过敏，喜欢踢足球'
	};
	return mockData
	// }
	
    // return request<ChildFormResult>({
    //     url: "child/child/" + url,
    //     method: "get",
    //     params
    // });
};
