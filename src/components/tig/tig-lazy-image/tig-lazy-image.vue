<template>
    <view class="tig-lazy-image">
        <view :class="'base-image-box base-image-box' + elUid">
            <template v-if="!isError && show">
                <image class="base-image" :class="{ 'loading-end': !isLoading }" :src="srcData" :mode="mode" @error="handleError" @load="handleLoad"></image>
            </template>
            <template v-if="!isLoading && isError">
                <image class="base-image empty" :src="staticResource('common/empty-img-bg3.png')" :mode="mode"></image>
            </template>
            <template v-if="!isLoadingEnd && !isError">
                <view class="base-skeleton shan">
                    <view class="block"></view>
                </view>
            </template>
        </view>
    </view>
</template>

<script setup lang="ts">
// #ifdef MP-WEIXIN
defineOptions({
    options: { virtualHost: true }
});
// #endif
import { ref, watch, getCurrentInstance, onMounted, onUnmounted } from "vue";
import { imageFormat } from "@/utils/format";
import { staticResource, guid } from "@/utils";

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

const elUid = guid();

const isError = ref(false);

const isLoading = ref(true);

const isLoadingEnd = ref(false);

const emit = defineEmits(["error", "load"]);

const srcData = ref("");

watch(
    () => props.src,
    (newVal) => {
        if (!newVal) {
            isError.value = true;
            isLoading.value = false;
            isLoadingEnd.value = true;
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
    isLoadingEnd.value = true;
    isError.value = false;
    emit("load", e);
};

const handleError = (e: Event) => {
    isError.value = true;
    isLoading.value = false;
    isLoadingEnd.value = true;
    emit("error", e);
};

const instance = getCurrentInstance();
const show = ref(false);
let observer: any;

const disposeObserver = () => {
    if (observer) {
        observer.disconnect();
        observer = null;
    }
};

onMounted(() => {
    observer = uni.createIntersectionObserver(instance);
    observer.relativeToViewport({ top: 0, bottom: 10 }).observe(`.base-image-box${elUid}`, (res: any) => {
        show.value = res.intersectionRatio > 0 ? true : false;
        if (res.intersectionRatio > 0) disposeObserver();
    });
});
onUnmounted(() => {
    disposeObserver();
});
</script>

<style lang="scss" scoped>
.tig-lazy-image {
    width: 100%;
    height: 100%;
}

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

.base-skeleton {
    width: 100%;
    padding-top: 100%;
    position: relative;

    .block {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: #efefef;
        left: 0;
        top: 0;
    }

    &.shan {
        &::after {
            content: "";
            position: absolute;
            animation: shan 1s ease 0s infinite;
            top: 0;
            width: 50%;
            height: 100%;
            background: linear-gradient(to left, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 100%);
            transform: skewX(-45deg);
        }
    }
}

@keyframes shan {
    0% {
        left: -100%;
    }

    100% {
        left: 120%;
    }
}
</style>
