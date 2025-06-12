<template>
    <view class="base-image-box">
        <template v-if="!isError">
            <image class="base-image" :class="{ 'loading-end': !isLoading }" :src="srcData" :mode="mode" @error="handleError" @load="handleLoad"></image>
        </template>
        <template v-if="!isLoading && isError">
            <image class="base-image empty" :src="staticResource('common/empty-img-bg3.png')" :mode="mode"></image>
        </template>
    </view>
</template>

<script setup lang="ts">
// #ifdef MP-WEIXIN
defineOptions({
    options: { virtualHost: true }
});
// #endif
import { ref, watch } from "vue";
import { imageFormat } from "@/utils/format";
import { staticResource } from "@/utils";

const props = defineProps({
    src: {
        type: String,
        default: "",
        required: true
    },
    mode: {
        type: String,
        default: ""
    }
});

const isError = ref(false);

const isLoading = ref(true);

const emit = defineEmits(["error", "load"]);

const srcData = ref("");

watch(
    () => props.src,
    (newVal) => {
        if (!newVal) {
            isError.value = true;
            isLoading.value = false;
        } else {
            isError.value = false;
            isLoading.value = true;
            srcData.value = imageFormat(newVal);
        }
    },
    {
        immediate: true
    }
);

const handleLoad = (e: Event) => {
    isLoading.value = false;
    isError.value = false;
    emit("load", e);
};

const handleError = (e: Event) => {
    isError.value = true;
    isLoading.value = false;
    emit("error", e);
};
</script>

<style lang="scss" scoped>
.base-image-box {
    width: 100%;
    height: 100%;

    .base-image {
        width: 100%;
        height: 100%;
        display: block;
        opacity: 0;
        transition: opacity 0.4s ease-in-out;

        &.loading-end {
            opacity: 1;
        }

        &.empty {
            opacity: 1;
        }
    }
}
</style>
