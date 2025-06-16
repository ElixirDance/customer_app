<template>
    <view class="total-card">
        <view>
            <view class="total-card-item">
                <view class="total-card-item-left">{{ $t("商品总价") }}</view>
                <view class="total-card-item-right"><format-price :isBottom="false" :priceData="total.productAmount"></format-price></view>
            </view>
            <view class="total-card-item" v-if="total.serviceFee && total.serviceFee > 0">
                <view class="total-card-item-left">{{ $t("附加费用") }}</view>
                <view class="total-card-item-right"><format-price :isBottom="false" :priceData="total.serviceFee"></format-price></view>
            </view>
            <view class="total-card-item" v-if="total.shippingFee > 0">
                <view class="total-card-item-left">{{ $t("配送费用") }} </view>
                <view class="total-card-item-right special-text"><format-price :isBottom="false" :priceData="total.shippingFee"></format-price></view>
            </view>
            <view class="total-card-item" v-if="total.balance > 0">
                <view class="total-card-item-left">{{ $t("使用余额") }}</view>
                <view class="total-card-item-right">- <format-price :isBottom="false" :priceData="total.balance"></format-price></view>
            </view>
            <view class="total-card-item" v-if="total.pointsAmount > 0">
                <view class="total-card-item-left">{{ $t("使用积分") }}</view>
                <view class="total-card-item-right">- <format-price :isBottom="false" :priceData="total.pointsAmount"></format-price></view>
            </view>
            <view class="total-card-item" v-if="total.discounts > 0">
                <view class="total-card-item-left" @click="handleShowDiscountInfo">
                    {{ $t("共优惠") }}
                    <up-icon style="padding-left: 4rpx" size="16" color="#969799" name="info-circle"></up-icon>
                </view>
                <view class="total-card-item-right">
                    <view> - <format-price :isBottom="false" :priceData="total.discounts"></format-price> </view>
                </view>
            </view>
            <view class="total-card-tig" v-if="total.orderSendPoint && total.orderSendPoint > 0">
                * {{ $t("该订单完成后，您将预计获得") }} <text class="special-text">{{ total.orderSendPoint }}</text> {{ $t("积分") }}
            </view>
        </view>

        <discountInfo :total="total" v-model="showDiscountInfo" discountType="order"></discountInfo>
    </view>
</template>

<script setup lang="ts">
import { computed, ref, type PropType } from "vue";
import discountInfo from "@/components/product/discountInfo.vue";
import type { Total } from "@/types/order/check";
import {} from "@/utils";
const props = defineProps({
    total: {
        type: Object as PropType<Total>,
        default: () => ({})
    },
    cartList: {
        type: Array as PropType<any[]>,
        default: () => []
    }
});
const show = ref(false);
const handleDispatching = () => {
    show.value = true;
};

const showDiscountInfo = ref(false);
const handleShowDiscountInfo = () => {
    showDiscountInfo.value = !showDiscountInfo.value;
};
</script>

<style lang="scss" scoped>
.more-ico {
    width: 36rpx;
    height: 36rpx;
    padding-left: 10rpx;
}
.total-card {
    background-color: #fff;
    box-sizing: border-box;
    padding: 30rpx 32rpx;
    border-radius: 18rpx;
    margin-top: 20rpx;

    .total-card-item {
        padding-bottom: 35rpx;
        display: flex;
        justify-content: space-between;
        &:last-child {
            padding-bottom: 0;
        }

        .total-card-item-left {
            display: flex;
            align-items: center;
        }

        .red {
            color: var(--general);
        }

        .total-card-ico {
            margin-left: 10rpx;
        }
    }

    .total-card-tig {
        display: flex;
        justify-content: flex-end;
        font-size: 24rpx;
        color: #999;
        padding-bottom: 10rpx;

        .special-text {
            color: var(--general);
            padding: 0 5rpx;
        }
    }
}
</style>
