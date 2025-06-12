<template>
    <view class="item">
        <view class="text mobileareacode-box">
            <template v-if="configStore.isOpenMobileAreaCode">
                <tig-mobile-areacode v-model="mobileAreaCode"></tig-mobile-areacode>
            </template>
            <input type="text" @input="mobileInput" :value="mobile" :placeholder="$t('请输入手机号')" placeholder-class="placeholder" class="mobile-text" />
        </view>
    </view>
    <view class="item mobile_code_text">
        <view style="flex: 1; margin-right: 10rpx">
            <input
                @input="mobileCodeInput"
                type="text"
                :placeholder="$t('手机短信验证码')"
                placeholder-class="placeholder"
                :value="mobileCode"
                name="mobile_code"
                class="text"
            />
        </view>
        <verificationCode
            style="height: 65rpx"
            :mobile="configStore.isOpenMobileAreaCode ? mobileAreaCode + mobile : mobile"
            v-model:isChecked="isChecked"
            v-model:verify-token-data="verifyToken"
            event="forget_password"
            :requestApi="sendMobileCode"
            @mobileErrorCallback="mobileErrorCallback"
        ></verificationCode>
    </view>
    <view class="btn2-css3">
        <tig-button :loadingText="$t('下 一 步')" :loading="isLoading" @click="handleNext" :disabled="isDisabled">
            {{ $t("下 一 步") }}
        </tig-button>
    </view>
    <view class="login-text" @click="handleToLogin">{{ $t("立即登录") }}</view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useConfigStore } from "@/store/config";
import { sendMobileCode, checkMobile } from "@/api/login/login";
import VerificationCode from "@/components/verificationCode/index.vue";

const mobileKey = defineModel("mobileKey");
const step = defineModel("step");
const configStore = useConfigStore();
const { t } = useI18n();

const mobileAreaCode = ref("86");
const isChecked = ref(true);
const verifyToken = ref("");

const mobile = ref("");
const mobileInput = (e: any) => {
    mobile.value = e.detail.value;
};
const mobileCode = ref("");
const mobileCodeInput = (e: any) => {
    mobileCode.value = e.detail.value;
};
const mobileErrorCallback = (msg: string) => {
    uni.showToast({
        title: msg,
        duration: 1500,
        icon: "none"
    });
};

const isLoading = ref(false);
const isDisabled = computed(() => {
    return !mobile.value || !mobileCode.value || isLoading.value;
});

const handleNext = async () => {
    if (!mobile.value) {
        return uni.showToast({
            title: t("请输入手机号"),
            duration: 1500,
            icon: "none"
        });
    }
    if (!mobileCode.value) {
        return uni.showToast({
            title: t("请输入手机验证码"),
            duration: 1500,
            icon: "none"
        });
    }
    isLoading.value = true;
    try {
        const result = await checkMobile({
            mobile: configStore.isOpenMobileAreaCode ? mobileAreaCode.value + mobile.value : mobile.value,
            code: mobileCode.value
        });
        mobileKey.value = result.item;
        step.value = 2;
    } catch (error: any) {
        console.error(error);
        uni.showToast({
            title: error.message,
            duration: 1500,
            icon: "none"
        });
    } finally {
        isLoading.value = false;
    }
};

const handleToLogin = () => {
    uni.navigateTo({
        url: "/pages/login/index"
    });
};
</script>

<style lang="scss" scoped>
.login-text {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100rpx;
    color: #999;
}
.mobileareacode-box {
    display: flex;
    align-items: center;
    .mobile-text {
        flex: 1;
    }
}
.item {
    margin-bottom: 70rpx;
    position: relative;
    .text {
        border: 0;
        border-radius: 0;
        background-color: transparent;
        padding-left: 0rpx;
        height: 88rpx;
        line-height: normal;
        font-size: 28rpx;
        color: #252525;
        padding: 0;
        font-weight: normal;
        border-bottom: 1rpx solid #eee;
    }
    .get-mobile {
        background-color: transparent;
        padding-left: 0rpx;
        height: 88rpx;
        line-height: normal;
        font-size: 28rpx;
        color: #252525;
        padding: 0;
        font-weight: normal;
        position: absolute;
        top: 0;
        width: 100%;
        z-index: 88;
    }
    .parent {
        position: relative;
    }

    &.mobile_code_text {
        width: 100%;
        /* padding-right: 200rpx; */
        align-items: center;
        display: flex;
    }
}
</style>
