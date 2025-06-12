<template>
    <view>
        <template v-for="(module, index) in modules" :key="index">
            <template v-if="module.type == 'notice'">
                <notice :module="module.module"></notice>
            </template>

            <template v-if="module.type == 'titleAd'">
                <titleAd :module="module.module"></titleAd>
            </template>

            <template v-if="module.type == 'imageAd'">
                <imageAd :module="module.module"></imageAd>
            </template>

            <template v-if="module.type == 'imageNav'">
                <imageNav :module="module.module"></imageNav>
            </template>

            <template v-if="module.type == 'coupon'">
                <coupon :module="module.module" :shopId="props.shopInfo.shopId"></coupon>
            </template>
            <template v-if="module.type == 'whiteBlank'">
                <whiteBlank :module="module.module"></whiteBlank>
            </template>

            <template v-if="module.type == 'whiteLine'">
                <whiteLine :module="module.module"></whiteLine>
            </template>

            <template v-if="module.type == 'imageSquareAd'">
                <imageSquareAd :module="module.module"></imageSquareAd>
            </template>

            <template v-if="module.type == 'imageHotarea'">
                <imageHotarea :module="module.module"></imageHotarea>
            </template>

            <template v-if="module.type == 'shopInfo'">
                <shopInfo :module="module.module" :shopInfo="props.shopInfo" @refreshShopDetail="emit('refreshShopDetail')"></shopInfo>
            </template>

            <template v-if="module.type == 'product'">
                <product :shopId="props.shopInfo.shopId" :module="module.module" :moduleIndex="module.moduleIndex"></product>
            </template>

            <template v-if="module.type == 'categoryNav'">
                <categoryNav :module="module.module" :moduleIndex="module.moduleIndex"></categoryNav>
            </template>
            <template v-if="module.type == 'categoryNavA2'">
                <categoryNavA2 :module="module.module" :moduleIndex="module.moduleIndex"></categoryNavA2>
            </template>
            <template v-if="module.type == 'banner'">
                <banner :module="module.module" :moduleIndex="module.moduleIndex" :index="index"></banner>
            </template>
            <template v-if="module.type == 'slidingImage'">
                <SlidingImage :module="module.module" :moduleIndex="module.moduleIndex" :index="index"></SlidingImage>
            </template>
            <template v-if="module.type == 'slideLargeImage'">
                <slideLargeImage :module="module.module" :moduleIndex="module.moduleIndex" :index="index"></slideLargeImage>
            </template>
            <template v-if="module.type == 'comboSuggestions'">
                <comboSuggestions :module="module.module" :moduleIndex="module.moduleIndex" :index="index"></comboSuggestions>
            </template>
            <template v-if="module.type == 'noticeA2'">
                <noticeA2 :module="module.module" :moduleIndex="module.moduleIndex" :index="index"></noticeA2>
            </template>
            <template v-if="module.type == 'specialOffer'">
                <specialOffer :module="module.module" :moduleIndex="module.moduleIndex" :index="index"></specialOffer>
            </template>
            <template v-if="module.type == 'mixedProductDisplay'">
                <mixedProductDisplay :module="module.module" :moduleIndex="module.moduleIndex" :index="index"></mixedProductDisplay>
            </template>
            <template v-if="module.type == 'categoryRec'">
                <categoryRec :module="module.module" :moduleIndex="module.moduleIndex" :index="index"></categoryRec>
            </template>
            <template v-if="module.type == 'countdown'">
                <countdown :module="module.module" :moduleIndex="module.moduleIndex" :index="index"></countdown>
            </template>
            <template v-if="module.type == 'groupSliding'">
                <groupSliding :module="module.module" :moduleIndex="module.moduleIndex" :index="index"></groupSliding>
            </template>
            <template v-if="module.type == 'productGrouping'">
                <productGrouping :module="module.module" :moduleIndex="module.moduleIndex" :index="index"></productGrouping>
            </template>
            <template v-if="module.type == 'imageTextComponent'">
                <imageTextComponent :module="module.module" :moduleIndex="module.moduleIndex" :index="index"></imageTextComponent>
            </template>
            <template v-if="module.type == 'categoryNavA1'">
                <categoryNavA1 :module="module.module" :moduleIndex="module.moduleIndex" :index="index"></categoryNavA1>
            </template>
        </template>
    </view>
</template>

<script lang="ts" setup>
import notice from "@/components/modules/notice/index.vue";
import titleAd from "@/components/modules/titleAd/index.vue";
import imageAd from "@/components/modules/imageAd/index.vue";
import whiteBlank from "@/components/modules/whiteBlank/index.vue";
import whiteLine from "@/components/modules/whiteLine/index.vue";
import imageSquareAd from "@/components/modules/imageSquareAd/index.vue";
import imageNav from "@/components/modules/imageNav/index.vue";
import coupon from "@/components/modules/coupon/index.vue";
import imageHotarea from "@/components/modules/imageHotarea/index.vue";
import product from "@/components/modules/product/index.vue";
import shopInfo from "@/components/modules/shopInfo/index.vue";
import categoryNav from "@/components/modules/categoryNav/index.vue";
import categoryNavA2 from "@/components/modules/categoryNavA2/index.vue";
import SlidingImage from "@/components/modules/slidingImage/index.vue";
import banner from "@/components/modules/banner/index.vue";
import slideLargeImage from "@/components/modules/slideLargeImage/index.vue";
import comboSuggestions from "@/components/modules/comboSuggestions/index.vue";
import noticeA2 from "@/components/modules/noticeA2/index.vue";
import specialOffer from "@/components/modules/specialOffer/index.vue";
import mixedProductDisplay from "@/components/modules/mixedProductDisplay/index.vue";
import categoryRec from "@/components/modules/categoryRec/index.vue";
import countdown from "@/components/modules/countdown/index.vue";
import groupSliding from "@/components/modules/groupSliding/index.vue";
import productGrouping from "@/components/modules/productGrouping/index.vue";
import imageTextComponent from "@/components/modules/imageTextComponent/index.vue";
import categoryNavA1 from "@/components/modules/categoryNavA1/index.vue";
import type { ShopDetailItem } from "@/types/shop/shop";

interface Props {
    modules: any[];
    shopInfo: ShopDetailItem;
}
const props = defineProps<Props>();
const emit = defineEmits(["refreshShopDetail"]);
</script>
<style>
@import "../../static/css/modules.css";
</style>
