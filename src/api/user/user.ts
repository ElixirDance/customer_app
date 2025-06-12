import request from "@/utils/request";
import type { UserDataResponse } from "@/types/user/user";

export const getUser = () => {
    return request<UserDataResponse>({
        url: "user/user/detail",
        method: "get"
    });
};
