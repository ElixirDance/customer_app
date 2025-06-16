<template>
    <view class="input-box">
        <up-input
            :customStyle="customStyle"
            :clearable="clearable"
            :fontSize="fontSize"
            :border="border"
            v-model="keyword"
            :prefixIcon="prefixIcon"
            :prefixIconStyle="prefixIconStyle"
            :placeholder="placeholder"
            @confirm="confirm"
            @clear="clear"
        >
        </up-input>
    </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const props = defineProps({
    modelValue: { type: String, default: "" },
    customStyle: {
        type: Object,
        default: () => ({ "background-color": "#f7f8fa", "border-radius": "36rpx", padding: "10rpx 15rpx", height: "inherit" })
    },
    prefixIcon: {
        type: String,
        default: "search"
    },
    prefixIconStyle: {
        type: [Object, String],
        default: "font-size: 20px;"
    },
    clearable: {
        type: Boolean,
        default: true
    },
    fontSize: {
        type: String,
        default: "14px"
    },
    border: {
        type: String,
        default: "none"
    },
    placeholder: {
        type: String,
        default: "商品搜索：请输入关键字"
    }
});
const placeholder = ref(t(props.placeholder));
const emit = defineEmits(["update:modelValue", "confirm", "clear"]);
const keyword = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit("update:modelValue", value);
    }
});
const confirm = (val: any) => {
    emit("confirm", val);
};
const clear = () => {
    emit("update:modelValue", "");
    emit("clear");
};
</script>

<style lang="scss" scoped>
.input-box {
    width: 100%;
}
</style>
