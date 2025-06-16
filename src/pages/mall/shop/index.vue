<template>
    <tig-layout :title="navbarTitle" :shopId="shopId">
        <view class="decorate-page-window">
            <modules :modules="modulesList" @refreshShopDetail="getShopInfo" v-if="Object.keys(shopInfo).length > 0" :shopInfo="shopInfo"></modules>
        </view>
    </tig-layout>
</template>

<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";
import { getShopDecorate, getShopDetail } from "@/api/shop/shop";
import modules from "@/components/modules/shopModules.vue";
import type { ShopDetailItem } from "@/types/shop/shop";

const shopId = ref(0);

onLoad((options) => {
    if (options && options.shopId) {
        shopId.value = options.shopId;
        getShopInfo();
        __getShopDecorate();
    }
});

const navbarTitle = ref("店铺详情");

const modulesList = ref<any[]>([]);

const __getShopDecorate = async () => {
    try {
        const result = await getShopDecorate(shopId.value);
        modulesList.value = result.moduleList;
    } catch (error) {
        console.error(error);
    }
};

const shopInfo = ref<ShopDetailItem>({} as ShopDetailItem);
const getShopInfo = async () => {
    try {
        const result = await getShopDetail(shopId.value);
        shopInfo.value = result;
        navbarTitle.value = result.shopTitle;
    } catch (error: any) {
        console.error(error);
    }
};
</script>

<style lang="scss" scoped></style>
