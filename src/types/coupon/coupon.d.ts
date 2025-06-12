export interface CouponFilterParams {
    page: number;
    size: number;
    shopId?: number;
}
export interface CouponResponse {
    data: CouponData;
    code: number;
    message: string;
}

export interface CouponData {
    records: CouponFilterResult[];
    filter: CouponFilterParams;
    total: number;
}

export interface CouponFilterResult {
    isReceive: number;
    couponId: number;
    couponName: string;
    couponMoney: string;
    couponDiscount: number;
    couponDesc: string;
    couponType: number;
    sendRange: number;
    sendRangeData: number[];
    minOrderAmount: string;
    sendStartDate: string;
    sendEndDate: string;
    sendType: number;
    useDay: number;
    useStartDate: string;
    useEndDate: string;
    endDate?: string;
    isShow: number;
    isGlobal: number;
    isNewUser: number;
    enabledClickGet: number;
    limitUserRank: number[] | null;
    shopId: number;
    status?: number;
    statusName?: string;
    delayDay: number;
    limitNum: number;
    receiveNum: number;
}

export interface CouponDetailResponse {
    data: Item;
    code: number;
    message: string;
}

interface CouponInfoParams {
    id: number;
}

export interface CouponDetailItem {
    couponId: Number;
    couponName: String;
    couponMoney: String;
    couponDiscount: Number;
    couponDesc: String;
    couponType: Number;
    sendRange: Number;
    sendRangeData: Any[];
    minOrderAmount: String;
    sendStartDate: String;
    sendEndDate: String;
    sendType: Number;
    useDay: Number;
    useStartDate: String;
    useEndDate: String;
    isShow: Number;
    isGlobal: Number;
    isNewUser: Number;
    isReceive: Number;
    enabledClickGet: Number;
    limitUserRank: Null;
    shopId: Number;
    delayDay: Number;
    limitNum: Number;
    receiveNum: Number;
}

export interface DiscountAmountResponse {
    data: DiscountAmountData;
    code: number;
    message: string;
}

export interface DiscountAmountData {
    minOrderAmount: string;
    couponMoney: string;
    productPrice: string;
    discountMoney: string;
    couponUnit: number;
    quantityCount: number;
}
