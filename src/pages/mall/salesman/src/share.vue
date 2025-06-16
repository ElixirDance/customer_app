<template>
    <view>
        <shareCard
            :link="link"
            :qrcodePath="qrcodePath"
            v-model="showShareCard"
            :currentData="currentData"
            @showSaveImageTextCard="handleShowSaveImageTextCard"
            @showShareQrcode="handleShowShareQrcode"
        ></shareCard>
        <saveImageTextCard v-model="showSaveImageTextCard" :currentData="currentData"></saveImageTextCard>
        <shareQrcode :qrcodePath="qrcodePath" :link="link" v-model="showShareQrcode"></shareQrcode>
        <tig-qrcode
            v-if="showShareCard"
            ref="qrcodeRef"
            :immediatelyCreate="true"
            :value="link"
            :margin="10"
            :show="false"
            @success="qrcodeSuccess"
        ></tig-qrcode>
    </view>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import shareCard from "./shareCard.vue";
import saveImageTextCard from "./saveImageTextCard.vue";
import shareQrcode from "./shareQrcode.vue";
import { useConfigStore } from "@/store/config";

const configStore = useConfigStore();

const userInfo = uni.getStorageSync("userInfo");

const props = defineProps({
    showShareCard: {
        type: Boolean,
        default: false
    },
    currentData: {
        type: Object,
        default: () => {}
    }
});
const emit = defineEmits(["update:showShareCard"]);
const qrcodeRef = ref();
const showShareCard = computed({
    get() {
        if (props.showShareCard) {
            setTimeout(() => {
                qrcodeRef.value?.drawQrcode();
            }, 150);
        }
        return props.showShareCard;
    },
    set(val) {
        emit("update:showShareCard", val);
    }
});
const link = computed(() => {
    return `${configStore.baseInfo.h5Domain}/pages/mall/product/index?id=${props.currentData.productId}&salesmanId=${userInfo?.salesman?.salesmanId}`;
});
const showSaveImageTextCard = ref(false);

const handleShowSaveImageTextCard = () => {
    emit("update:showShareCard", false);
    showSaveImageTextCard.value = true;
};

const showShareQrcode = ref(false);
const handleShowShareQrcode = () => {
    emit("update:showShareCard", false);
    showShareQrcode.value = true;
};

const qrcodePath = ref("");
const qrcodeSuccess = (val: string) => {
    qrcodePath.value = val;
};
</script>

<style lang="scss" scoped></style>
