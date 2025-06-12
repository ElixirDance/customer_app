<template>
    <view>
        <tig-layout>
            <template v-if="configStore.categoryDecorateType === 1">
                <styleOneCate v-model:catId="catId"></styleOneCate>
            </template>
            <template v-if="configStore.categoryDecorateType === 2">
                <styleTwoCate :height="height"></styleTwoCate>
            </template>
            <template v-if="configStore.categoryDecorateType === 3">
                <styleThreeCate :height="height"></styleThreeCate>
            </template>
        </tig-layout>
    </view>
</template>

<script lang="ts" setup>
import { onLoad, onBackPress } from "@dcloudio/uni-app";
import { ref, computed } from "vue";
import styleOneCate from "./styleOneCate.vue";
import styleTwoCate from "./styleTwoCate.vue";
import styleThreeCate from "./styleThreeCate.vue";
import { useConfigStore } from "@/store/config";
import { useTabbarStore } from "@/store/tabbar";

const configStore = useConfigStore();

const tabbarStore = useTabbarStore();

const catId = ref(0);

onLoad((options) => {
    if (options && options.categoryId) {
        catId.value = options.categoryId;
    }
});

const height = computed(() => {
    return `calc(${configStore.windowInfo.screenHeight}px - var(${tabbarStore.currentActiveValue > -1 ? "--tabbar-height" : "--safe-bottom"}) - var(--nav-height))`;
});

onBackPress((options) => {
    // options.from: backbutton(物理返回键) | navigateBack(调用API返回) | gesture(手势返回)
    console.log('监听到返回事件，来源:', options.from);
    
    // 返回 true 表示阻止默认返回行为，返回 false 或不返回任何值表示同意默认返回行为
    if (options.from === 'navigateBack') {
      console.log('用户执行了滑动返回操作');
      // 在这里处理滑动返回的逻辑
      // 例如显示确认对话框、保存数据等
      
      // 如果需要阻止滑动返回，返回 true
      // return true;
    }
    
    // 默认不阻止返回
    return false;
})
</script>
<style>
/* 兼容小程序 */
page {
    background-color: #fff !important;
}
</style>
