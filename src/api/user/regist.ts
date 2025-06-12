import request from "@/utils/request";
// 获取购物车
export const userRegist = (data: {}) => {
    return request({
        url: "user/regist/registAct",
        method: "post",
        data
    });
};
