<template>
    <view class="poster-card">
        <view class="poster-card-title">
            <image class="poster-card-title-img" :src="staticResource('salesman/salesmanzhiwen.png')"></image>
            <text>{{ $t("长按保存到相册") }}</text>
        </view>
        <view class="poster-card-content">
            <swiper
                :indicator-dots="false"
                @change="swiperChange"
                previous-margin="100rpx"
                next-margin="100rpx"
                :circular="true"
                interval="3000"
                duration="500"
                :style="{ height: getMaxHeight + 'px' }"
            >
                <block v-for="(item, index) in currentData.pics" :key="index">
                    <swiper-item>
                        <view class="poster-card-item" :class="{ active: currentPicIndex === index }">
                            <poster
                                :currentData="currentData"
                                :currentPic="item.picUrl"
                                :imgHeight="picsHeight[index]"
                                :id="'myCanvas' + index"
                                :activeType="activeType"
                                :qrcodePath="qrcodePath"
                            ></poster>
                        </view>
                    </swiper-item>
                </block>
            </swiper>
        </view>
    </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { imageFormat } from "@/utils/format";
import { staticResource } from "@/utils";
import poster from "./poster.vue";
const props = defineProps({
    currentData: {
        type: Object,
        default: () => {}
    },
    activeType: {
        type: String,
        default: () => ""
    },
    qrcodePath: {
        type: String,
        default: () => ""
    }
});

const currentPicIndex = ref(0);
const swiperChange = (e: any) => {
    currentPicIndex.value = e.detail.current;
};

const picsHeight = ref([] as number[]);
const getPicHeight = (src: string): Promise<number> => {
    return new Promise((resolve) => {
        uni.getImageInfo({
            src,
            success: function (res) {
                resolve(Number(res.height));
            },
            fail: (err) => {
                console.error(err);
                resolve(0);
            }
        });
    });
};
const getMaxHeight = computed(() => {
    return Math.max(...picsHeight.value) + 180;
});
watch(
    () => props.currentData.pics,
    (newVal) => {
        if (newVal && newVal.length) {
            newVal.forEach(async (item: any, index: number) => {
                picsHeight.value[index] = await getPicHeight(imageFormat(item.picUrl));
            });
        }
    },
    { immediate: true }
);
</script>

<style lang="scss" scoped>
.poster-card-title {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24rpx;
    color: #969799;
    margin: 30rpx 0;
    .poster-card-title-img {
        margin-right: 12rpx;
        width: 26rpx;
        height: 26rpx;
    }
}

.poster-card-item {
    width: 100%;
    height: 100%;

    transform: scale(0.88);
    transition: all 0.3s ease-out;
    &.active {
        transform: scale(1);
    }
}
</style>
