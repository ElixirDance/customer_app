<template>
    <tig-layout title="提交订单">
        <template v-if="Object.keys(addressList).length > 0">
            <addressInfo :data="getAddressInfo"></addressInfo>

            <template v-if="paymentTypeList.length > 0">
                <paymentMode v-model:payTypeId="formState.payTypeId" :availablePaymentType="paymentTypeList" @change="updateOrderCheck"></paymentMode>
            </template>

            <stroeCard
                v-model:shippingType="formState.shippingType"
                :cartList="cartListData"
                :shippingTypeList="shippingTypeData"
                @change="updateOrderCheck"
                @changeProductExtra="changeProductExtra"
            ></stroeCard>

            <remark v-model="formState.buyerNote"></remark>

            <template v-if="configStore.useCoupon == 1 || configStore.usePoints == 1 || configStore.useSurplus == 1">
                <couponInfo
                    ref="couponInfoRef"
                    :balance="userStore.userInfo.balance ?? 0"
                    :points="userStore.userInfo.points"
                    :availablePoints="userStore.userInfo.points"
                    :pointsAmount="Number(totalData?.pointsAmount) ?? 0"
                    :couponAmount="Number(totalData?.discountCouponAmount) ?? 0"
                    :couponList="couponListData"
                    v-model:useCouponIds="formState.useCouponIds"
                    v-model:selectUserCouponIds="formState.selectUserCouponIds"
                    v-model:use-point="formState.usePoint"
                    :flowType="flowType"
                    @sendBalanceStatus="getBalanceStatus"
                    @change="updateCoupon"
                ></couponInfo>
            </template>

            <template v-if="configStore.canInvoice === 1 && !isOverseas()">
                <invoiceInfo v-model:invoiceInfo="formState.invoiceData" :getAddressInfo="getAddressInfo"></invoiceInfo>
            </template>

            <totalCard :total="totalData" :cartList="cartListData"></totalCard>

            <tig-fixed-placeholder backgroundColor="#fff">
                <view class="submit-btn-box">
                    <view class="submit-btn-price">
                        <view class="price-text">{{ $t("应付") }}:</view>
                        <format-price
                            :fontStyle="{ fontWeight: 'bold', fontSize: '34rpx' }"
                            :decimalsStyle="{
                                fontSize: '24rpx',
                                fontWeight: 'bold'
                            }"
                            :currencyStyle="{
                                fontSize: '23rpx',
                                fontWeight: 'bold'
                            }"
                            :priceData="totalData?.unpaidAmount"
                        ></format-price>
                    </view>
                    <view>
                        <tig-button class="btn" @click="submit"> {{ $t("提交订单") }} </tig-button>
                    </view>
                </view>
            </tig-fixed-placeholder>
        </template>
    </tig-layout>
</template>

<script lang="ts" setup>
import addressInfo from "./src/addressInfo.vue";
import paymentMode from "./src/paymentMode.vue";
import stroeCard from "./src/storeCard.vue";
import couponInfo from "./src/couponInfo.vue";
import invoiceInfo from "./src/invoiceInfo.vue";
import remark from "./src/remark.vue";
import totalCard from "./src/totalCard.vue";
import { computed, reactive, ref } from "vue";
import { getOrderCheckData, updateOrderCheckData, orderSubmit, updateCouponData, getPaymentType, getShippingType } from "@/api/order/check";
import type { CartList, Total, PaymentTypeItem, ShippingTypeItem } from "@/types/order/check";
import type { AddressFilterResult } from "@/types/user/address";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { getAddressList } from "@/api/user/address";
import { useConfigStore } from "@/store/config";
import { useUserStore } from "@/store/user";
import { useI18n } from "vue-i18n";
import { isOverseas, redirect } from "@/utils";

const { t } = useI18n();

const configStore = useConfigStore();

const userStore = useUserStore();

// 当前结算表单数据
interface IformState {
    addressId: number;
    shippingType: {
        [key: string]: {
            typeId: number;
            shopId: number;
            typeName: string;
        };
    };
    productExtra: any;
    payTypeId: number;
    usePoint: number;
    useBalance: number;
    useCouponIds: number[];
    selectUserCouponIds: number[];
    buyerNote: string;
    invoiceData: any;
    useDefaultCouponIds?: number;
}

// 当前结算表单数据
const formState = reactive<IformState>({
    addressId: 0,
    shippingType: {},
    payTypeId: 0,
    usePoint: 0,
    useBalance: 0,
    useCouponIds: [],
    selectUserCouponIds: [],
    buyerNote: "",
    invoiceData: {},
    productExtra: {}
});

const addressList = ref<AddressFilterResult[]>([]);
const getAddressInfo = ref<AddressFilterResult>({} as AddressFilterResult);
const getAddressListData = async () => {
    try {
        const result = await getAddressList({ page: 1, size: 99 });
        if (result.records.length === 0) {
            return uni.navigateTo({
                url: "/pages/mall/address/list"
            });
        }
        getAddressInfo.value = result.records[0];
        formState.addressId = result.records[0].addressId;
        addressList.value = result.records;
    } catch (error) {
        console.error(error);
    }
};

const paymentTypeList = ref<PaymentTypeItem[]>([]);
const getPaymentTypeData = async () => {
    try {
        const result = await getPaymentType();
        formState.payTypeId = result[0].typeId;
        paymentTypeList.value = result;
        // console.log(paymentTypeList.value);
    } catch (e) {
        console.log(e);
    }
};

const shippingTypeData = ref<{ [key: string]: ShippingTypeItem[] }>({});
const getShippingTypeData = async () => {
    try {
        const result = await getShippingType({ flowType: flowType.value });
        shippingTypeData.value = result;
        for (const key in result) {
            if (result[key] && result[key].length > 0) {
                formState.shippingType[key] = {
                    typeId: result[key][0].shippingTypeId,
                    shopId: result[key][0].shopId,
                    typeName: result[key][0].shippingTypeName
                };
            }
        }
    } catch (e) {
        console.log(e);
    }
};

const cartListData = ref<CartList[]>([]);
const totalData = ref<Total>();
const couponListData = ref<any>([]);
const tmplIdsData = ref<any>([]);
const flowType = ref<number>(1);

const getOrderInfo = async () => {
    try {
        const result = await getOrderCheckData({ flowType: flowType.value, ...formState });
        const { cartList, total, couponList, tmplIds, item } = result;
        Object.assign(formState, item);
        cartListData.value = cartList;
        totalData.value = total;
        couponListData.value = couponList;
        tmplIdsData.value = tmplIds;
    } catch (error: any) {
        console.error(error);
    } finally {
    }
};

const changeProductExtra = async (data: any) => {
    formState.productExtra = data;
    const result = await updateOrderCheck();
    if (result) {
        cartListData.value = result.item.cartList;
    }
};

const updateOrderCheck = async () => {
    uni.showLoading({
        title: t("加载中")
    });
    try {
        const result = await updateOrderCheckData({ flowType: flowType.value, ...formState });
        Object.assign(formState, result.item);
        totalData.value = result.total;
        return result;
    } catch (error: any) {
        uni.showToast({
            title: error.message,
            duration: 1500
        });
    } finally {
        uni.hideLoading();
    }
};

const updateCoupon = async () => {
    uni.showLoading({
        title: t("加载中")
    });
    try {
        const result = await updateCouponData(formState);
        couponListData.value = result.couponList;
        totalData.value = result.total;
        cartListData.value = result.cartList;
        return result;
    } catch (error) {
    } finally {
        uni.hideLoading();
    }
};

const getBalanceStatus = (status: boolean) => {
    if (status) {
        formState.useBalance = userStore.userInfo.balance;
    } else {
        formState.useBalance = 0;
    }
    updateOrderCheck();
};

const shippingTypeStaus = computed(() => {
    if (!formState.shippingType) {
        return true;
    }

    for (const item of cartListData.value) {
        if (item.noShipping === 0 && !formState.shippingType[item.shopId]) {
            return true;
        }
    }

    return false;
});
const submitLoading = ref(false);
const submit = async () => {
    if (submitLoading.value) return;
    if (formState.payTypeId === 0) {
        return uni.showToast({
            title: t("请选择付款方式"),
            icon: "none"
        });
    }
    if (shippingTypeStaus.value) {
        return uni.showToast({
            title: t("请选择配送方式"),
            icon: "none"
        });
    }

    if (submitLoading.value) return;

    submitLoading.value = true;
    // #ifdef MP-WEIXIN
    //小程序调用订阅消息需要授权模板
    wx.requestSubscribeMessage({
        tmplIds: tmplIdsData.value,
        complete: () => {
            submitOrder();
        }
    });
    // #endif

    // #ifdef APP-PLUS || H5 || MP-QQ || MP-TOUTIAO || MP-BAIDU || MP-ALIPAY
    submitOrder();
    // #endif
};
/**
 * 提交订单
 */
const submitOrder = async () => {
    try {
        const result = await orderSubmit(formState);
        if (result.returnType === 2) {
            redirect({
                url: `/pages/user/order/list`,
                mode: "redirectTo"
            });
        } else {
            redirect({
                url: `/pages/order/pay?orderId=${result.orderId}`,
                mode: "redirectTo"
            });
        }
    } catch (error: any) {
        console.error(error);
        uni.showToast({
            title: error.message,
            icon: "none"
        });
        setTimeout(() => {
            redirect({
                url: `/pages/cart/index`,
                mode: "redirectTo"
            });
        }, 1500);
    } finally {
        submitLoading.value = false;
    }
};

const couponInfoRef = ref();

onShow(async () => {
    initPageData();
    if (couponInfoRef?.value) {
        couponInfoRef.value.isBalance = false;
        formState.useBalance = 0;
    }
});

const initPageData = async () => {
    try {
        uni.showLoading({
            title: t("加载中")
        });
        await Promise.all([getAddressListData(), getPaymentTypeData(), getShippingTypeData(), userStore.getUserInfo()]);
        await getOrderInfo();
    } catch (error: any) {
        console.error(error);
        uni.showToast({
            title: error.message,
            icon: "none"
        });
        setTimeout(() => {
            redirect({
                url: `/pages/cart/index`,
                mode: "redirectTo"
            });
        }, 1500);
    } finally {
        uni.hideLoading();
    }
};

onLoad((options) => {
    if (options) {
        if (options.flowType) {
            flowType.value = options.flowType;
        }
    }
});
</script>

<style lang="scss" scoped>
.submit-btn-box {
    background-color: #fff;
    width: 100%;
    height: 100%;
    bottom: 0;
    padding: 0 30rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .submit-btn-price {
        color: var(--general);
        font-size: 32rpx;
        font-weight: bold;
        display: flex;
        align-items: center;
        .price-text {
            font-weight: normal;
            color: #323233;
            padding-right: 10rpx;
        }
    }

    .btn {
        width: 200rpx;
    }
}
</style>
