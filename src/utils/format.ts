import { useConfigStore } from "@/store/config";

// 格式化图片地址
export function imageFormat(path: string) {
    const configStore = useConfigStore();
    if (!path) {
        return "";
    }
    return path.includes("http") !== false ? path : configStore.storageUrl + path;
}

// 基础页面列表
const baseList = [
    // {
    //     name: "首页",
    //     link: "/",
    //     url: "/pages/index/index"
    // },
    {
        name: "商城首页",
        link: "/",
        url: "/pages/mall/index/index"
    },
    {
        name: "分类页面（仅分类）",
        link: "list",
        url: "/pages/mall/productCate/index"
    },
    {
        name: "限时秒杀",
        link: "seckill/list",
        url: "/pages/mall/seckill/list"
    },
    {
        name: "购物车",
        link: "cart",
        url: "/pages/mall/cart/index"
    },
    {
        name: "搜索页面",
        link: "search",
        url: "/pages/mall/search/index"
    },
    {
        name: "会员首页",
        link: "member",
        url: "/pages/mall/user/index"
    },
    {
        name: "我的优惠券",
        link: "member/coupon/list",
        url: "/pages/mall/user/coupon?type=2"
    },
    {
        name: "我的订单",
        link: "member/order/list",
        url: "/pages/mall/user/order/list"
    },
    {
        name: "待评价订单",
        link: "member/comment/list",
        url: "/pages/mall/user/order/list?type=await_comment"
    },
    {
        name: "收货地址",
        link: "member/address/list",
        url: "/pages/mall/address/list"
    },
    {
        name: "退换货",
        link: "member/return/list",
        url: "/pages/mall/user/afterSale/list"
    },
    {
        name: "账户余额",
        link: "member/account/detail",
        url: "/pages/mall/user/account/index"
    },
    {
        name: "我的积分",
        link: "member/point/list",
        url: "/pages/mall/user/point/detail"
    },
    {
        name: "收藏商品",
        link: "member/collectProduct/list",
        url: "/pages/mall/user/collectProduct/index"
    },
    {
        name: "站内消息",
        link: "member/userMessage/list",
        url: "/pages/mall/user/messageLog/index"
    },
    {
        name: "发票管理",
        link: "member/orderInvoice/list",
        url: "/pages/mall/user/invoiceManagement/index"
    },
    {
        name: "账号信息",
        link: "member/profile/info",
        url: "/pages/mall/user/profile/index"
    },
    {
        name: "账号信息",
        link: "exchange/list",
        url: "/pages/mall/exchange/list"
    },
    {
        name: "店铺列表",
        link: "shop/list",
        url: "/pages/mall/shop/list"
    }
];

// 链接格式化
export function urlFormat(params: string | { path: string; [key: string]: any }): string {
    if (!params) return "";
    if (typeof params === "string") {
        return params;
    } else if (typeof params === "object" && Object.values(params).length) {
        // 地址栏参数
        let urlParameter;
        Object.keys(params).length && (urlParameter = uni.$u.queryParams(params.data));
        switch (params.path) {
            case "product":
                // 商品
                return `/pages/mall/product/index${urlParameter}`;
            case "list":
                // 分类
                return `/pages/mall/search/result?categoryId=${params.data.id}`;
            case "article":
                // 文章
                return `/pages/mall/article/news/detail?id=${params.data.id}`;
            case "shop":
                // 文章
                return `/pages/mall/shop/index?shopId=${params.data.id}`;
            case "brand":
                // 品牌
                if (params.data.id) {
                    const data = { ...params.data, brand_id: params.data.id };
                    delete data.id;
                    urlParameter = uni.$u.queryParams(data);
                }
                return `/pages/mall/search/result${urlParameter}`;
            case "coupon":
                // 优惠券
                return `/pages/mall/coupon/detail${urlParameter}`;
            case "base":
                // 基础页面
                const { url = "/pages/mall/index/index" } = baseList.find((item) => item.link === params.link)!;
                return url;
            case "custom":
                // 自定义链接
                return params.appLink;
            case "decorate":
                // 自定义装修页面
                return `/pages/mall/customPage/index?id=${params.data.id}`;
            case "default":
                return params.link;
            default:
                return params.path;
        }
    }
}

export function formatDate(date: Date, format = "yyyy-MM-dd"): string {
    const map = {
        yyyy: date.getFullYear().toString(),
        MM: ("0" + (date.getMonth() + 1)).slice(-2),
        dd: ("0" + date.getDate()).slice(-2),
        HH: ("0" + date.getHours()).slice(-2),
        mm: ("0" + date.getMinutes()).slice(-2),
        ss: ("0" + date.getSeconds()).slice(-2)
    };
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, (matched) => map[matched]);
}
