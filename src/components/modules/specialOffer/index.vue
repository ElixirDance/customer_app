<template>
    <view
        class="module-ad-con"
        :style="
            commonStyle.moduleStyle.boxPaddingBottom +
            commonStyle.moduleStyle.boxPaddingTop +
            commonStyle.moduleStyle.boxPaddingBottom +
            commonStyle.moduleStyle.boxPadding +
            commonStyle.moduleStyle.backgroundSize +
            commonStyle.moduleStyle.backgroundImage
        "
    >
        <view
            class="module-ad-content main"
            :style="
                commonStyle.moduleContentStyle.backgroundImage +
                commonStyle.moduleContentStyle.backgroundSize +
                commonStyle.moduleContentStyle.boxRadius +
                commonStyle.moduleContentStyle.boxShadow +
                commonStyle.moduleContentStyle.innerPadding +
                `border-radius: ${module.contentStyle.boxRadius}px`
            "
        >
            <view class="main">
                <view class="mk-top">
                    <view class="line1" :style="`color: ${module.moduleColor.titleColor}`">
                        <span class="mk-title" :style="`color: ${module.moduleColor.titleColor}`">{{ $t(module.moduleTitle.title) }}</span>
                        <span class="mk-small-title" :style="`color: ${module.moduleColor.subTitleColor}`">{{ $t(module.moduleTitle.subTitle) }}</span>
                    </view>
                    <view class="mk-countdown" :style="`--color: ${module.moduleColor.countdownColor}`">
                        <span class="text line1" :style="`color: ${module.moduleColor.countdownTitleColor}`">{{
                            new Date().getTime() > module.moduleTitle.dailyTime[0] ? $t(module.moduleTitle.countdownTitle) : $t("距开始")
                        }}</span>
                        <view class="countdown">
                            <commonCountdown
                                format="HH:mm:ss"
                                :countdownType="module.moduleTitle.countdownType"
                                :dailyTime="module.moduleTitle.dailyTime"
                                :specifyTime="module.moduleTitle.specifyTime"
                                :color="module.moduleColor.countdownColor"
                            ></commonCountdown>
                        </view>
                    </view>
                </view>
                <view class="lists" :style="`border-radius: ${module.contentStyle.boxRadius}px`">
                    <view class="item-box">
                        <template v-for="(item, index) in list" :key="index">
                            <view
                                @click="item.productId && redirect({ url: urlFormat({ path: 'product', data: { id: item.productId } }) })"
                                :style="`width: ${module.productWidth}%; flex-wrap: nowrap; flex-shrink: 0`"
                            >
                                <view class="item">
                                    <view
                                        class="img"
                                        :style="`width: 100%;
                                    padding-top: ${picScaleMap[module.picScale!]};
                                    background-size: ${module.picFillType};
                                    border-radius: ${module.productRadius}px;
                                    background-image: url(${imageFormat(item.picThumb)});`"
                                    ></view>
                                    <view class="goods-info">
                                        <view
                                            v-if="module.showProductName"
                                            class="tit line1"
                                            :style="`padding-bottom: 0px; font-size: ${module.productNameSize}px; font-weight: ${module.productNameWeight}; color:${module.moduleColor.productNameColor}`"
                                        >
                                            {{ $t(module.prodcutTitles[index][`title${index + 1}`]) }}
                                        </view>
                                        <view
                                            v-if="module.showProductPrice"
                                            class="price-box"
                                            :style="`color: rgb(255, 255, 255); font-weight: 700; font-family: inherit`"
                                        >
                                            <view class="price">
                                                <format-price
                                                    :fontStyle="{ fontSize: '14px', lineHeight: 1 }"
                                                    :currencyStyle="{
                                                        fontSize: '12px'
                                                    }"
                                                    :decimalsStyle="{
                                                        fontSize: '12px'
                                                    }"
                                                    :priceData="item.productPrice"
                                                ></format-price
                                            ></view>
                                        </view>
                                        <view
                                            v-if="module.showSellingPoints"
                                            class="desc line1"
                                            :style="`color: ${module.moduleColor.sellingPointsColor}`"
                                        >
                                            {{ $t(module.prodcutTitles[index][`sellingPoints${index + 1}`]) }}
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </template>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { formatCommonStyle } from "@/components/modules";
import { urlFormat, imageFormat } from "@/utils/format";
import commonCountdown from "@/components/modules/commonCountdown/index.vue";
import { redirect } from "@/utils";
import { getProductsList } from "@/api/common";
const props = defineProps({
    module: {
        type: Object,
        default: () => ({})
    }
});

const list = ref<any>([]);
const getProductsListData = async () => {
    if (props.module.productSource) {
        const params: any = {};
        if (props.module.productSource === "products") {
            params.ids = props.module.productList.map((item) => item.productId).join(",");
        } else {
            const { productGroupId, productNum, productNumType } = props.module.productGroups[0];
            params.productGroupId = productGroupId;
            params.size = productNumType === "number" ? productNum : 100;
        }
        try {
            const result = await getProductsList(params);
            list.value = result.records;
        } catch (error) {
            console.error(error);
        }
    }
};
getProductsListData();

const commonStyle = computed(() => {
    return formatCommonStyle(props.module.moduleStyle ?? {}, props.module.contentStyle ?? {}, props.module.subTitle ?? {});
});
const picScaleMap: { [key: string]: string } = {
    "3:2": "calc(100% / 3 * 2)",
    "1:1": "calc(100% / 1 * 1)",
    "3:4": "calc(100% / 3 * 4)",
    "16:9": "calc(100% / 16 * 9)"
};
</script>

<style lang="scss" scoped>
.module-ad-con {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center top;
    position: relative;
}

.main {
    position: relative;
    padding: 10px;
    overflow: hidden;
    :deep(.u-count-down__text) {
        color: v-bind(--color);
        font-size: 12px;
    }
}

.mk-top {
    margin-bottom: 2px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    .mk-title {
        margin-right: 5px;
        height: 30px;
        line-height: 30px;
        font-size: 20px;
        font-weight: 700;
        color: #333333;
    }

    .mk-small-title {
        height: 30px;
        line-height: 35px;
        font-size: 14px;
        font-weight: 400;
        color: #333333;
    }

    .mk-countdown {
        --color: #f44;
        display: flex;
        justify-content: center;
        flex-direction: row;
        align-items: center;
        overflow: hidden;
        font-size: 12px;
        height: 20px;
        border-radius: 10px;
        padding-left: 10rpx;

        .text {
            background-color: var(--color);
            color: #fff;
            padding: 0 4px 0 8px;
            height: 20px;
            line-height: 20px;
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
        }

        .countdown {
            box-sizing: border-box;
            height: 20px;
            border: solid 1px var(--color);
            font-size: 12px;
            background: transparent;
            padding: 0 10px 0 7px;
            color: var(--color);
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
            display: flex;
            align-items: center;
        }
    }
}
.item-box {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    margin: 8px 4px 5px;
    &::-webkit-scrollbar {
        display: none;
        height: 0;
    }
}
.lists {
    background: #fff;
    border-radius: 6px;
    overflow: hidden;
}
.item {
    display: block;
    margin: 0 3px;
    text-align: center;
    overflow: hidden;
    .img {
        position: relative;
        height: 0;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        overflow: hidden;
    }
    .goods-info {
        padding: 5px 2px 3px;
        padding: 0 5px;
        flex-grow: 1;
        flex-shrink: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        font-size: 12px;

        .tit {
            height: 20px;
            line-height: 20px;
            font-size: 16px;
            font-weight: 700;
            white-space: nowrap;
        }

        .price-box {
            margin: 2px auto 0;
            width: 100%;
            max-width: 80px;
            height: 22.5px;
            line-height: 22.5px;
            background: url(https://oss.tigshop.com/img/gallery/202504/1743571805Kri1ocOOKkgrcXAbKe.png) no-repeat center;
            background-size: contain;
            .price {
                height: 100%;
                padding-left: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                white-space: nowrap;
            }
        }

        .desc {
            height: 16px;
            line-height: 18px;
            margin: 3px 0 0;
            font-size: 12px;
            overflow: hidden;
            white-space: nowrap;
            color: #fb6d08;
        }
    }
}
</style>
