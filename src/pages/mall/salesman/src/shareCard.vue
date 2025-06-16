<template>
    <tig-popup v-model:show="showShare" :zIndex="999" :showClose="false" backgroundColor="#fff" @close="close">
        <view class="salesman-share-box">
            <view class="salesman-share-title">
                {{ Number(currentData.finalCommissionPrice) > 0 ? `${$t("分享后预计可赚")}` : `${$t("立即分享给好友")}` }}
                <format-price v-if="Number(currentData.finalCommissionPrice) > 0" :priceData="currentData.finalCommissionPrice"></format-price>
                <text class="iconfont-h5 icon-jiaochacross80" @click="$emit('update:modelValue', false)"></text>
            </view>
            <view class="salesman-share-menu">
                <block v-for="(item, index) in menuList" :key="index">
                    <view class="salesman-share-menu-item" @click="handleMenu(item.type)">
                        <view class="menu-item-text">
                            {{ $t(item.name) }}
                            <view class="menu-item-line" :class="{ show: activeType === item.type }"></view>
                        </view>
                    </view>
                </block>
            </view>

            <view class="salesman-share-content">
                <posterCard
                    :qrcodePath="qrcodePath"
                    :currentData="currentData"
                    class="none"
                    :activeType="activeType"
                    :class="{ show: activeType === 'poster' }"
                ></posterCard>
                <imageTextCard
                    @showSaveImageTextCard="$emit('showSaveImageTextCard')"
                    @showShareQrcode="$emit('showShareQrcode')"
                    @close="$emit('update:modelValue', false)"
                    :currentData="currentData"
                    class="none"
                    :class="{ show: activeType === 'imageText' }"
                    :link="link"
                ></imageTextCard>
            </view>
        </view>
    </tig-popup>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import imageTextCard from "./imageTextCard.vue";
import posterCard from "./posterCard.vue";
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    currentData: {
        type: Object,
        default: () => {}
    },
    link: {
        type: String,
        default: ""
    },
    qrcodePath: {
        type: String,
        default: ""
    }
});
const emit = defineEmits(["update:modelValue", "showSaveImageTextCard", "showShareQrcode"]);
const showShare = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:modelValue", val);
    }
});

const menuList = [
    {
        type: "imageText",
        name: "推广图文"
    },
    {
        type: "poster",
        name: "生成海报"
    }
];
const activeType = ref("imageText");
const handleMenu = (type: string) => {
    activeType.value = type;
};

const close = () => {
    activeType.value = "imageText";
};
</script>

<style lang="scss" scoped>
.icon-jiaochacross80 {
    padding: 10px;
}

.salesman-share-box {
    height: 85vh;
    padding: 32rpx 0 0;
    overflow: hidden;
    overflow-y: auto;

    .salesman-share-title {
        color: #ed6a0c;
        font-weight: bolder;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24rpx;
        position: relative;
        padding: 15rpx 0;

        .iconfont-h5 {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            font-size: 28rpx;
            color: #c8c9cc;
        }
    }
    .salesman-share-content {
        .none {
            display: none;
            &.show {
                display: block;
            }
        }
    }

    .salesman-share-menu {
        display: flex;

        .salesman-share-menu-item {
            flex: 1;
            font-size: 26rpx;
            color: #323233;

            .menu-item-text {
                position: relative;
                height: 80rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                .menu-item-line {
                    position: absolute;
                    width: 42rpx;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 1;
                    height: 6rpx;
                    background-color: #ee0a24;
                    border-radius: 6rpx;
                    display: none;
                    &.show {
                        display: block;
                    }
                }
            }
        }
    }
}
</style>
