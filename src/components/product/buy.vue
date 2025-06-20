<template>
    <view class="buy" @click.stop="handleBuy">
        <slot></slot>
    </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { addToCart } from "@/api/product/product";
import { addExchangeToCart } from "@/api/exchange/exchange";
import { useI18n } from "vue-i18n";
import { isB2B } from "@/utils";
import { useConfigStore } from "@/store/config";

const { t } = useI18n();
const configStore = useConfigStore();
const props = defineProps({
    id: Number,
    number: {
        type: Number
    },
    skuId: {
        type: Number
    },
    extraAttrIds: {
        type: String,
        default: ""
    },
    disabled: {
        type: Boolean,
        default: false
    },
    isQuick: {
        type: Boolean,
        default: false
    },
    type: {
        type: String
    },
    skuItem: {
        type: Array
    }
});
const emit = defineEmits(["callback"]);
const loading = ref(false);
const handleBuy = async () => {
    if (props.disabled) return;

    try {
        if (loading.value) return;
        loading.value = true;
        const salesmanId = getSalemanId(props.id!);
        let result: AnyObject = {};
        const filterParams: AnyObject = {
            id: props.id ?? 0,
            number: props.number,
            skuId: props.skuId,
            isQuick: props.isQuick ? 1 : 0
        };
        if (props.extraAttrIds) {
            filterParams.extraAttrIds = props.extraAttrIds;
        }
        if (isB2B()) {
            filterParams.skuItem = props.skuItem;
        }
        switch (props.type) {
            case "exchange":
                result = await addExchangeToCart(filterParams);
                break;
            default:
                filterParams.salesmanId = salesmanId > 0 ? salesmanId : undefined;
                result = await addToCart(filterParams);
        }
        emit("callback");
        if (props.isQuick == true) {
            if (configStore.closeOrder === 1) return uni.$u.toast(t("商城已关闭下单"));
            uni.navigateTo({ url: `/pages/order/check?flowType=${result.flowType}` });
        } else {
            uni.showToast({ title: t("加入购物车成功"), duration: 1500 });
        }
    } catch (error: any) {
        uni.showToast({ title: error.message, icon: "none", duration: 1500 });
    } finally {
        loading.value = false;
    }
};

const getSalemanId = (id: number) => {
    const salesmanProducts = uni.getStorageSync("salesmanProducts") || [];
    if (!salesmanProducts.length) return 0;
    const salesman = salesmanProducts.find((item: any) => item.productId == id);
    return Number(salesman?.salesmanId) || 0;
};
</script>

<style lang="scss" scoped></style>
