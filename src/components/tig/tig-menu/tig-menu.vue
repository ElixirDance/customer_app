<template>
    <tig-popup v-model:show="show" position="top" backgroundColor="#fff" :showClose="false">
        <view class="menu-box">
            <view class="menu-title">{{ $t("快捷入口") }}</view>
            <view class="menu-list">
                <block v-for="(item, index) in menuList" :key="index">
                    <view class="menu-item" @click="handelLink(item)">
                        <view class="menu-item-icon">
                            <image class="menu-item-img" :src="staticResource(item.icon)"></image>
                        </view>
                        <view class="menu-item-text">{{ $t(item.text) }}</view>
                    </view>
                </block>
            </view>
        </view>
    </tig-popup>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { redirect, staticResource } from "@/utils";
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
});
const emit = defineEmits(["update:modelValue"]);
const show = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:modelValue", val);
    }
});

const menuList = [
    {
        icon: "common/home.svg",
        text: "首页",
        link: "/pages/index/index"
    },
    {
        icon: "common/search.svg",
        text: "搜索",
        link: "/pages/search/index"
    },
    {
        icon: "common/user.svg",
        text: "个人中心",
        link: "/pages/user/index"
    },
    {
        icon: "common/collection.svg",
        text: "商品收藏",
        link: "/pages/user/collectProduct/index"
    },
    {
        icon: "common/history.svg",
        text: "查看足迹",
        link: "/pages/user/historyProduct/index"
    },

    {
        icon: "common/message.svg",
        text: "消息中心",
        link: "/pages/user/messageLog/index"
    }
];

const handelLink = (item: any) => {
    emit("update:modelValue", false);
    redirect({ url: item.link });
};
</script>

<style lang="scss" scoped>
.menu-box {
    padding-top: var(--safe-top);
    margin: 20rpx 0 30rpx;
    .menu-title {
        font-size: 36rpx;
        font-weight: 500;
        margin: 0 20rpx 30rpx;
    }

    .menu-list {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 25rpx 20rpx;

        .menu-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 24rpx;
            color: #666666;

            .menu-item-icon {
                width: 100rpx;
                height: 100rpx;
                background-color: #f7f7f7;
                border-radius: 20rpx;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;

                .menu-item-img {
                    width: 55rpx;
                    height: 55rpx;
                }
            }

            .menu-item-text {
                margin-top: 20rpx;
                color: #333;
                font-weight: 500;
                font-size: 26rpx;
                display: flex;
                justify-content: center;
            }
        }
    }
}
</style>
