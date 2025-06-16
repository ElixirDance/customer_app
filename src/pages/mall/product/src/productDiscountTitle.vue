<template>
    <view class="product-seckill-title flex justify-between align-center">
        <view class="seckill-price-box">
            <view class="title-top-price">
                <view class="price-box">
                    <view class="price">
                        <format-price
                            :fontStyle="{ fontWeight: 'bold' }"
                            :decimalsStyle="{
                                fontSize: '24rpx',
                                fontWeight: 'bold'
                            }"
                            :currencyStyle="{
                                fontSize: '23rpx',
                                fontWeight: 'bold'
                            }"
                            :priceData="productPrice"
                        ></format-price>
                    </view>
                    <view class="tag-text-box">
                        <view class="tag-text"
                            >{{ $t("直降") }}
                            <format-price :isBottom="false" :fontStyle="{ fontWeight: 'bold' }" :priceData="discountValue.discountPrice"></format-price>
                        </view>
                    </view>
                </view>

                <view class="title-top-market_price flex align-center">
                    <view class="originalprice-box" v-if="productOriginPrice && Number(productOriginPrice) > Number(productPrice)">
                        {{ $t("价格") }}
                        <view>
                            <format-price :isBottom="false" :priceData="productOriginPrice" :fontStyle="{ 'text-decoration': 'line-through' }"></format-price>
                        </view>
                    </view>
                    <view class="discountStock">
                        <view> {{ $t("剩余") }} {{ productStock }}</view>
                    </view>
                </view>
            </view>
        </view>
        <view class="seckill-time-box">
            <view class="type-box">
                <view class="type-text">{{ $t("限时折扣") }}</view>
            </view>
            <view class="countdown-box flex align-center">
                <view class="title-top-time">{{ $t("距结束还剩") }}</view>
                <tig-countdown backgroundColor="rgba(0, 0, 0, .06)" :endTime="discountValue.discountEndTime" :fontSize="11" color="#fff"></tig-countdown>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import type { ProductItem } from "@/types/product/product";
interface Props {
    productInfo: ProductItem;
    productPrice: string | number;
    productOriginPrice: string;
    discountValue: AnyObject;
    productStock: number;
}
const props = defineProps<Props>();
</script>

<style lang="scss" scoped>
.product-seckill-title {
    margin-bottom: 20rpx;
    background: linear-gradient(45deg, var(--ump-start-bg, #323233), var(--ump-end-bg, #323233));
    padding: 20rpx 20rpx 15rpx 25rpx;
    .title-top-price {
        .price-box {
            display: flex;

            .tag-text-box {
                display: inline-flex;
                align-items: flex-end;
                padding-left: 15rpx;
                position: relative;
                top: -8rpx;

                .tag-text {
                    background-color: #fff;
                    font-size: 20rpx;
                    color: var(--main-bg);
                    padding: 2rpx 6rpx;
                    border-radius: 25rpx;
                }
            }
        }

        .price {
            color: #fff;
            font-size: 36rpx;
            display: flex;
            align-items: center;
        }
        .title-top-market_price {
            .label {
                font-size: 20rpx;
                margin-right: 10rpx;
                .icon {
                    background-color: #fff;
                    border-bottom: 1rpx solid #fff;
                    border-radius: 5rpx 0 0 5rpx;
                }
                .txt {
                    border: 1rpx solid #fff;
                    padding-left: 5rpx;
                    padding-right: 5rpx;
                    color: #fff;
                    border-radius: 0 5rpx 5rpx 0;
                }
            }
            .originalprice-box {
                display: flex;
                font-size: 18rpx;
                color: #fff;
                opacity: 0.7;
            }
            .discountStock {
                color: #fff;
                position: relative;
                font-size: 10px;
                padding: 0 6px;
                margin-left: 6px;
                &::before {
                    position: absolute;
                    content: "";
                    left: 0;
                    top: 4px;
                    width: 0.5px;
                    height: 8px;
                    opacity: 0.5;
                    background-color: #fff;
                }
            }
        }
    }
    .seckill-time-box {
        .title-top-time {
            font-size: 11px;
            color: #fff;
            padding-right: 8rpx;
        }
        .type-box {
            display: flex;
            justify-content: end;
            font-size: 24rpx;
            color: #fff;
            padding-bottom: 8rpx;
            position: relative;
            top: -5rpx;

            .type-text {
                font-style: italic;
                font-weight: bold;
            }
        }
    }
}
</style>
