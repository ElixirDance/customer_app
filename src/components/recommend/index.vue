<template>
    <view class="recommend_wrapper" v-if="guessLike.length">
        <view class="title">
            <view class="text">
                <view class="name">{{ $t("猜你喜欢") }}</view>
                <view class="desc">{{ $t("您还可以逛一逛") }}</view>
            </view>
        </view>
        <view>
            <masonry :commodityList="guessLike" :promotionList="promotionList" @callback="$emit('callback')"></masonry>
        </view>
    </view>
</template>

<script setup lang="ts">
import masonry from "@/components/masonry/masonry.vue";
import { useList } from "@/hooks";
import { getGuessLike } from "@/api/common";

const emit = defineEmits(["callback"]);

const { data: guessLike, promotionList } = useList(getGuessLike, {
    path: {
        dataKey: ""
    },
    immediate: true,
    needPromotionList: true,
    needReachBottom: false
});
</script>

<style lang="scss" scoped>
.recommend_wrapper {
    padding: 0 20rpx;
    margin-top: 20rpx;
}
.recommend_wrapper .title {
    padding: 20rpx 0;
}
.recommend_wrapper .title .text {
    font-size: 24rpx;
    color: #999;
}
.recommend_wrapper .title .text .name {
    color: #282828;
    font-size: 30rpx;
    font-weight: bold;
    margin-bottom: 5rpx;
    display: inline-block;
}
.recommend_wrapper .title .text .desc {
    display: inline-block;
    padding-left: 20rpx;
}
</style>
