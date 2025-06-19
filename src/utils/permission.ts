import { useUserStore } from "@/store/user";
import { useConfigStore } from "@/store/config";
const userStore = useUserStore();
const configStore = useConfigStore();
const whiteList = [
    "/pages/login/index",
    "/pages/login/mallAgreement",
    "/pages/register/index",
    "/pages/register/agreement",
    "/pages/index/index",
    "/pages/mall/index/index",
    "/pages/mall/search/index",
    "/pages/mall/search/result",
    "/pages/mall/productCate/index",
    "/pages/mall/cart/index",
    "/pages/mall/user/index",
    "/pages/mall/product/index",
    "/pages/mall/shop/index",
    "/pages/mall/category/index",
    "/pages/mall/im/index",
    "/pages/mall/user/bindMobilePhone/index",
    "/pages/mall/salesman/salesmanCard",
    "/pages/reset/index",
	// 新的路由
	"/pages/demo/index",
	"/pages/childManage/index",
	"/pages/siteSearch/index",
	"/pages/familyManage/index",
	"/pages/parentManage/index",
	"/pages/analytics/index",
	"/pages/chatAI/index",
	"/pages/chat/index",
	"/pages/lessonPlan/index",
];

function hasPermission(url: string): boolean {
    let currentUrl = url;
    if (url.includes("?")) {
        currentUrl = url.split("?")[0];
    }
    // 在白名单中或有token，直接跳转
    if (whiteList.indexOf(currentUrl) !== -1 || uni.getStorageSync("token") || userStore.token) {
        return true;
    }
    return false;
}

const jumpInterceptorList = ["navigateTo", "redirectTo", "reLaunch", "switchTab"];

//应用权限校验至拦截器
jumpInterceptorList.forEach((item) => {
    uni.addInterceptor(item, {
        //拦截前触发
        invoke(args) {
            if (!hasPermission(args.url)) {
                if (
                    configStore.openWechatOauth === 1 &&
                    configStore.openWechatRegister === 1 &&
                    (configStore.XClientType === "miniProgram" || configStore.XClientType === "wechat")
                ) {
                    userStore.setAuthType("wechatLogin");
                } else {
                    uni.setStorageSync("URL", args.url);
                    uni.navigateTo({
                        url: "/pages/login/index"
                    });
                }
                return false;
            }
            return true;
        },
        fail(e) {
            console.error(`为 ${item} 拦截器添加权限校验失败：`, e);
        }
    });
});
