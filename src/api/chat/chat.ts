import request from "@/utils/request";
//获取宝贝信息
// 获取会话消息
export const getChatMessage = (params: {}) => {
    return request<any>({
        url: "chat/message/list",
        method: "get",
        params
    });
};