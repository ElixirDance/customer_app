<template>
    <tig-popup v-model:show="show" :zIndex="10" backgroundColor="#f6f6f6">
        <view class="detail">
            <view class="title">{{ $t("商品明细") }}</view>
            <view class="content">
                <view class="product">
                    <view class="product-img">
                        <view class="img" :style="{ backgroundImage: `url(${imageFormat(detail?.picThumb)})` }"></view>
                    </view>
                    <view class="product-info">
                        <format-price
                            class="price"
                            :showText="false"
                            :currencyStyle="{ fontSize: '24rpx', fontWeight: '500' }"
                            :priceData="detail?.price"
                        ></format-price>
                        <format-price
                            :showText="false"
                            v-if="detail?.originPrice && detail?.originPrice > detail?.price"
                            class="origin_price"
                            :priceData="detail?.originPrice"
                        ></format-price>
                        <view class="product-num">{{ `已选${detail.quantity}件` }}</view>
                    </view>
                </view>
                <view class="attr">
                    <view class="attr-list">
                        <block v-for="attr in detail.extraSkuData" :key="attr">
                            <view class="attr-item">
                                <view class="sub-title">{{ attr.attrName }}</view>
                                <view class="item-content">
                                    <text class="line1 content-text">{{ attr.attrValue }}</text>
                                    <view class="right">
                                        <format-price class="price" :showText="false" :priceData="attr.attrPrice"></format-price>
                                        <view class="num">x{{ detail.quantity }}</view>
                                    </view>
                                </view>
                            </view>
                        </block>
                    </view>
                </view>
            </view>
        </view>
    </tig-popup>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { imageFormat } from "@/utils/format";

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    detail: {
        type: Object,
        default: () => ({})
    }
});

const emit = defineEmits(["update:modelValue"]);
const show = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit("update:modelValue", value);
    }
});
</script>

<style lang="scss" scoped>
.detail {
    height: 65vh;
    padding: 0 20rpx;
    .title {
        font-size: 36rpx;
        font-weight: 600;
        height: 100rpx;
        line-height: 100rpx;
        text-align: center;
    }

    .content {
        // padding-top: 20rpx;
        .product {
            display: flex;
            .product-img {
                border-radius: 15rpx;
                overflow: hidden;
                width: 180rpx;
                box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.04);

                .img {
                    padding-top: 90%;
                    background-size: cover;
                    background-position: center center;
                    background-repeat: no-repeat;
                }
            }

            .product-info {
                padding-left: 25rpx;
                display: flex;
                flex-direction: column;
                justify-content: center;

                .price {
                    color: var(--general);
                    font-weight: 600;
                    font-size: 36rpx;
                }
                .origin_price {
                    padding: 5rpx 0;
                    color: #929292;
                    font-size: 28rpx;
                }
                .product-num {
                    color: #929292;
                    font-size: 28rpx;
                }
            }
        }

        .attr {
            margin-top: 30rpx;
            background-color: #fff;
            border-radius: 20rpx;
            overflow: hidden;
            padding: 20rpx 15rpx;

            .attr-list {
                .attr-item {
                    margin-bottom: 20rpx;
                    &:last-child {
                        margin-bottom: 0;
                    }
                    .sub-title {
                        font-size: 28rpx;
                        font-weight: 600;
                        margin-bottom: 15rpx;
                    }

                    .item-content {
                        display: flex;
                        justify-content: space-between;
                        font-size: 28rpx;

                        .right {
                            .num {
                                font-size: 24rpx;
                                display: inline-block;
                                padding-left: 10rpx;
                                color: #595959;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
