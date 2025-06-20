import { defineStore } from "pinia";
import { isWeixinBrowser } from "@/utils";
import { imageFormat } from "@/utils/format";
import { initConfigSettings } from "@/api/common";

interface SafeAreaInsets {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

interface MenuButtonInfo {
    top: number;
    right: number;
    bottom: number;
    left: number;
    width: number;
    height: number;
}

interface State {
    storageUrl: string; // 图片地址
    navHeight: number; // 导航高度
    previewId: number; //预览id
    XClientType: string; //运行环境
    safeAreaInsets: SafeAreaInsets; // 安全区
    menuButtonInfo: MenuButtonInfo; // 小程序胶囊信息
    openWechatOauth: number;
    showService: boolean;
    isEnterprise: string | number;
    deCopyright: string | number;
    poweredBy: string;
    poweredByStatus: null | number;
    shopCompany: string;
    categoryDecorateType: number;
    canInvoice: number; // 是否支持发票
    invoiceAdded: number; // 是否支持增值发票
    dollarSign: string;
    dollarSignCn: string;
    isOpenMobileAreaCode: number;
    showMarketprice: number;
    showSelledCount: number;
    shopRegClosed: number;
    isIdentity: number;
    closeOrder: number;
    useCoupon: number;
    usePoints: number;
    useSurplus: number;
    windowInfo: {
        pixelRatio: number;
        screenWidth: number;
        screenHeight: number;
    };
    baseInfo: {
        shopTitle: string;
        shopLogo: string;
        icoImg: string;
        pcDomain: string;
        h5Domain: string;
        adminDomain: string;
        shopDesc: string;
    };
    companyDataType: number;
    companyDataTips: string;
    openWechatRegister: number;
    wechatRegisterBindPhone: number;
    googleLoginOn: number;
    facebookLoginOn: number;
}

export const useConfigStore = defineStore("config", {
    state: (): State => ({
        storageUrl: "",
        navHeight: 0,
        previewId: 0,
        XClientType: "",
        safeAreaInsets: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
        menuButtonInfo: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            width: 0,
            height: 0
        },
        openWechatOauth: 0,
        showService: false,
        isEnterprise: "",
        deCopyright: "",
        poweredBy: "",
        poweredByStatus: null,
        shopCompany: "",
        categoryDecorateType: 1,
        canInvoice: 0,
        invoiceAdded: 0,
        dollarSign: "￥",
        dollarSignCn: "元",
        isOpenMobileAreaCode: 0,
        showMarketprice: 1,
        showSelledCount: 1,
        shopRegClosed: 0,
        closeOrder: 0,
        isIdentity: 0,
        useCoupon: 0,
        usePoints: 0,
        useSurplus: 0,
        windowInfo: {
            pixelRatio: 0,
            screenWidth: 0,
            screenHeight: 0
        },
        baseInfo: {
            shopTitle: "",
            shopLogo: "",
            icoImg: "",
            pcDomain: "",
            h5Domain: "",
            adminDomain: "",
            shopDesc: ""
        },
        companyDataType: 0,
        companyDataTips: "",
        openWechatRegister: 0,
        wechatRegisterBindPhone: 0,
        googleLoginOn: 0,
        facebookLoginOn: 0
    }),
    getters: {
        saveTop: (state: State): number => {
            return state.safeAreaInsets.top;
        },
        safeBottom: (state: State): number => {
            return state.safeAreaInsets.bottom;
        }
    },
    actions: {
        getWindowInfo() {
            const res = uni.getWindowInfo();
            Object.assign(this.windowInfo, res);
        },
        getNavHeight() {
            uni.getSystemInfo({
                success: (res: any) => {
                    this.navHeight = res.statusBarHeight * (750 / res.windowWidth) + 97;
                    this.safeAreaInsets = res.safeAreaInsets;
                    console.log("safeAreaInsets", this.safeAreaInsets);
                },
                fail(err) {}
            });
        },
        setPreviewId(val: number) {
            this.previewId = val;
        },
        setXClientType() {
            const { uniPlatform } = uni.getSystemInfoSync();
            switch (uniPlatform) {
                case "web":
                    return isWeixinBrowser() ? (this.XClientType = "wechat") : (this.XClientType = "h5");
                case "mp-weixin":
                    return (this.XClientType = "miniProgram");
            }
        },
        getMenuButtonInfo() {
            this.menuButtonInfo = uni.getMenuButtonBoundingClientRect();
        },
        async getBaseConfigData() {
            try {
                const res = await initConfigSettings();

                this.baseInfo.shopLogo = res.shopLogo;
                this.baseInfo.shopTitle = res.shopTitle;
                this.baseInfo.icoImg = res.icoImg;
                this.baseInfo.pcDomain = res.pcDomain;
                this.baseInfo.h5Domain = res.h5Domain;
                this.baseInfo.adminDomain = res.adminDomain;
                this.companyDataType = res.companyDataType;
                this.companyDataTips = res.companyDataTips;
                this.storageUrl = res.storageUrl;
                this.openWechatOauth = res.openWechatOauth;
                this.showService = res.showService;
                this.isEnterprise = res.isEnterprise;
                this.deCopyright = res.deCopyright;
                this.poweredBy = res.poweredBy;
                this.poweredByStatus = res.poweredByStatus;
                this.shopCompany = res.shopCompany;
                this.categoryDecorateType = res.categoryDecorateType ?? 1;
                this.canInvoice = res.canInvoice;
                this.invoiceAdded = res.invoiceAdded;
                this.dollarSign = res.dollarSign;
                this.dollarSignCn = res.dollarSignCn;
                this.isOpenMobileAreaCode = res.isOpenMobileAreaCode;
                this.showMarketprice = res.showMarketprice;
                this.showSelledCount = res.showSelledCount;
                this.isIdentity = res.isIdentity;
                this.shopRegClosed = res.shopRegClosed;
                this.closeOrder = res.closeOrder;
                this.useCoupon = res.useCoupon;
                this.usePoints = res.usePoints;
                this.useSurplus = res.useSurplus;
                this.openWechatRegister = res.openWechatRegister;
                this.wechatRegisterBindPhone = res.wechatRegisterBindPhone;
                this.googleLoginOn = res.googleLoginOn;
                this.facebookLoginOn = res.facebookLoginOn;

                // #ifdef  H5
                this.setH5Config();
                // #endif
            } catch (error: any) {
                uni.showToast({
                    title: error.message,
                    icon: "none"
                });
            }
        },
        setH5Config() {
            let title = this.baseInfo.shopTitle;
            if (this.deCopyright && this.poweredByStatus == 0) {
                title += this.poweredBy ?? "";
            } else {
                title += "";
            }
            this.baseInfo.shopTitle = title;
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute("content", this.baseInfo.shopDesc);
            }
            let link = document.querySelector('link[rel~="icon"]') as HTMLLinkElement | null;
            if (!link) {
                link = document.createElement("link");
                link.rel = "icon";
                document.getElementsByTagName("head")[0].appendChild(link);
            }
            link.href = imageFormat(this.baseInfo.icoImg);
        },
        setH5Title() {
            uni.setNavigationBarTitle({
                title: this.baseInfo.shopTitle
            });
        }
    }
});
