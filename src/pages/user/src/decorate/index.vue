<template>
    <view>
        <template v-for="(item, index) in modules" :key="index">
            <advertising v-if="item.type === 'bannerList' && item.module.bannerList.picUrl" :data="item.module.bannerList"></advertising>
            <myService v-if="item.type === 'menus'" :menuType="item.module.menuType" :data="item.module.menuList"></myService>
        </template>
    </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import myService from "./myService/index.vue";
import advertising from "./advertising/index.vue";
import { getMemberDecorate } from "@/api/home/home";

const modules = ref<any>([]);

const __getMemberDecorate = async () => {
    try {
        const result = await getMemberDecorate();
        modules.value = result.data;
    } catch (error) {
        console.error(error);
    }
};
__getMemberDecorate();
</script>

<style lang="scss" scoped></style>
