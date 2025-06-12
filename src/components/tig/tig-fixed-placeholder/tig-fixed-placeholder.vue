<template>
    <view class="fixed-placeholder">
        <view class="content" :class="{ border: border }">
            <slot></slot>
        </view>
        <view class="placeholder" :style="{ paddingTop }"></view>
    </view>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { addUnit } from "@/utils";

const props = defineProps({
    height: {
        type: [Number, String],
        default: 120
    },
    backgroundColor: {
        type: String,
        default: "transparent"
    },
    border: {
        type: Boolean,
        default: true
    }
});
const height = computed(() => {
    return addUnit(props.height, "rpx");
});

const paddingTop = computed(() => {
    return `calc(${height.value} + var(--safe-bottom))`;
});
</script>

<style lang="scss" scoped>
.placeholder {
    width: 100%;
    height: 0;
}
.content {
    width: 100%;
    height: v-bind(height);
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: v-bind("props.backgroundColor");
    box-sizing: content-box;
    z-index: 10;
    box-shadow: 0 0 10px rgba(125, 126, 128, 0.16);
    padding-bottom: var(--safe-bottom);
}
.border {
    border-top: 1px solid #eee;
}
</style>
