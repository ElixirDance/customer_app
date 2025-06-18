<template>
    <view class="tabbar-box">
        <view class="tabbar-container">
            <view class="tabbar">
                <view class="tabbar-item" v-for="(item, index) in tabbarStore.tabbarList" :key="index" @click="handleTabbar(item, index)" v-show="item.isMall === tabbarStore.isMallPage">
                    <view class="tabbar-icon">
                        <image
                            class="tabbar-icon-img"
                            :src="tabbarStore.currentActiveValue === index ? imageFormat(item.activeImage) : imageFormat(item.image)"
                        />
                    </view>
                    <view class="tabbar-text" :class="{ active: tabbarStore.currentActiveValue === index }">{{ $t(item.text) }}</view>
                </view>
            </view>
        </view>
        <view class="placeholder"></view>
    </view>
</template>

<script setup lang="ts">
import { useTabbarStore } from "@/store/tabbar";
import { redirect } from "@/utils";
import { urlFormat } from "@/utils/format";
import { imageFormat } from "@/utils/format";
import { onShow } from "@dcloudio/uni-app";

const tabbarStore = useTabbarStore();

const props = defineProps({
    backgroundColor: {
        type: String,
        default: "#fff"
    },
    color: {
        type: String,
        default: "#000"
    },
    activeColor: {
        type: String,
        default: "#ea3c2d"
    }
});
const handleTabbar = (item: any, index: number) => {
    if (tabbarStore.currentActiveValue === index) return;
    item.link && redirect({ url: urlFormat(item.link) });
};
</script>

<style lang="scss" scoped>
.placeholder {
    width: 100%;
    height: 0;
    padding-bottom: var(--tabbar-height);
}
.tabbar-container {
    background-color: v-bind("props.backgroundColor");
    z-index: 98;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    box-sizing: border-box;
    height: var(--tabbar-height);
    padding-bottom: var(--safe-bottom);
    .tabbar {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        height: 100%;
        .tabbar-item {
            color: v-bind("props.color");
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: inherit;
            padding: 20rpx 0;
            .tabbar-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                .tabbar-icon-img {
                    height: 42rpx;
                    width: 42rpx;
                }
            }
            .tabbar-text {
                padding-top: 5rpx;
                font-size: 24rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                &.active {
                    color: v-bind("props.activeColor");
                }
            }
        }
    }
}
</style>
