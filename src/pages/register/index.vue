<template>
    <tig-layout title="注册" >
        <view class="register-container">
            <view class="register-warp">
                <view class="h1_tit">{{ $t("会员注册") }}</view>
            </view>
            <view class="profile-edit-content">
                <uni-forms ref="formRef" :modelValue="formState" :rules="formRules" label-align="right">
                    <uni-forms-item label="" name="mobile">
                        <view class="input mobileareacode-box">
                            <template v-if="configStore.isOpenMobileAreaCode">
                                <tig-mobile-areacode
                                    :labelStyle="{ fontSize: '28rpx' }"
                                    :nameStyle="{ fontSize: '24rpx', padding: '0 2rpx 0 10rpx' }"
                                    :boxStyle="{ paddingRight: '0' }"
                                    :iconStyle="{ fontSize: '22rpx' }"
                                    v-model="mobileAreaCode"
                                ></tig-mobile-areacode>
                            </template>
                            <uni-easyinput
                                :inputBorder="false"
                                v-model="formState.mobile"
                                class="uni-input item-input"
                                placeholderStyle="font-size: 28rpx;"
                                placeholder-class="placeholder"
                                :placeholder="$t('请输入手机号')"
                                primaryColor="rgb(192, 196, 204)"
                            ></uni-easyinput>
                        </view>
                    </uni-forms-item>
                    <uni-forms-item label="" name="mobile_code">
                        <view class="item-one">
                            <uni-easyinput
                                :inputBorder="false"
                                v-model="formState.mobileCode"
                                class="uni-input item-input input"
                                focus
                                placeholderStyle="font-size: 28rpx;"
                                placeholder-class="placeholder"
                                :placeholder="$t('手机短信验证码')"
                                primaryColor="rgb(192, 196, 204)"
                                style="width: 400rpx"
                            />
                            <VerificationCode
                                style="height: 65rpx"
                                v-model:isChecked="isChecked"
                                :mobile="configStore.isOpenMobileAreaCode ? mobileAreaCode + formState.mobile : formState.mobile"
                                v-model:verify-token-data="verifyToken"
                                :requestApi="sendMobileCode"
                                @mobileErrorCallback="mobileErrorCallback"
                            ></VerificationCode>
                        </view>
                    </uni-forms-item>
                    <uni-forms-item label="" name="password">
                        <view class="input">
                            <uni-easyinput
                                :clearable="false"
                                :inputBorder="false"
                                :trim="true"
                                type="password"
                                v-model="formState.password"
                                class="uni-input item-input"
                                placeholderStyle="font-size: 28rpx;"
                                placeholder-class="placeholder"
                                :placeholder="$t('请输入密码')"
                                primaryColor="rgb(192, 196, 204)"
                            ></uni-easyinput>
                        </view>
                    </uni-forms-item>
                    <uni-forms-item label="" name="">
                        <view class="btn">
                            <view class="agreement-btn">
                                <tig-checkbox v-model:checked="isChecked"></tig-checkbox>
                                <text class="agreement-text special-color" @click.stop="handleLink('/pages/register/agreement')"
                                    >{{ $t("《注册协议》") }}
                                </text>
                            </view>
                            <view class="lf-input" @click.stop="handleLink('/pages/login/index')">
                                <view>{{ $t("已有账号？") }}</view>
                                <!-- <navigator class="special-color" open-type="redirect" url="/pages/login/index">立即登录</navigator> -->
                            </view>
                        </view>
                    </uni-forms-item>
                </uni-forms>
                <view class="form-con">
                    <tig-button :disabled="isRegisterDisabled" :loading="loginLoading" class="btn2-css3" @click="onRegister"> {{ $t("注 册") }} </tig-button>
                </view>
            </view>
        </view>
    </tig-layout>
</template>

<script lang="ts" setup>
import { computed, ref, shallowRef, nextTick } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { sendMobileCode } from "@/api/login/login";
import VerificationCode from "@/components/verificationCode/index.vue";
import { userRegist } from "@/api/user/regist";
import { useI18n } from "vue-i18n";
import { useConfigStore } from "@/store/config";
import { useResettableRef } from "@/hooks";

const configStore = useConfigStore();

const mobileAreaCode = ref("86");

const [formState, reset] = useResettableRef({
    mobile: "",
    mobileCode: "",
    password: ""
});

const { t } = useI18n();

const isChecked = ref(false);
const verifyToken = ref("");
const loginLoading = ref(false);
const isRegisterDisabled = computed(() => {
    return !formState.value.mobile || !formState.value.mobileCode || !formState.value.password || !verifyToken.value;
});

const validateMobile = (rule: any, value: any, data: any, callback: any) => {
    if (!value) {
        return callback(t("手机号不能为空"));
    } else if (/^(?=.*\D).+$/.test(value)) {
        return callback(t("格式错误，请输入正确的手机号码"));
    } else {
        callback();
    }
};
const validateCode = (rule: any, value: any, data: any, callback: any) => {
    if (!value) {
        return callback(t("验证码不能为空"));
    } else if (value.length != 6) {
        return callback(t("请输入6位验证码"));
    } else {
        callback();
    }
};

const validatePassword = (rule: any, value: any, data: any, callback: any) => {
    if (!value) {
        return callback(t("密码不能为空"));
    } else if (value.length > 20 || value.length < 6) {
        return callback(t("密码应为6-20位字符"));
    } else if (/\s/.test(value)) {
        return callback(t("密码中不允许有空格"));
    } else if (/^\d+$/.test(value)) {
        return callback(t("密码不能全为数字"));
    } else if (!/^(?=.*[\d\W]).+$/.test(value)) {
        return callback(t("密码不能全为字母"));
    } else if (!/^(?=.*[a-zA-Z0-9]).+$/.test(value)) {
        return callback(t("密码不能全为符号"));
    } else if (!/^(?!([a-zA-Z0-9])\1*$).+$/.test(value)) {
        return callback(t("密码不能全为相同字符或数字"));
    } else {
        callback();
    }
};
const formRules = {
    mobile: {
        rules: [
            { required: true, errorMessage: t("请输入手机号") },
            {
                validateFunction: validateMobile
            }
        ]
    },
    mobileCode: {
        rules: [
            { required: true, errorMessage: t("请输入验证码") },
            {
                validateFunction: validateCode
            }
        ]
    },
    password: {
        rules: [
            { required: true, errorMessage: t("请输入密码") },
            {
                validateFunction: validatePassword
            }
        ]
    }
};
const formRef = shallowRef();
const onRegister = async () => {
    formRef.value
        .validate()
        .then(async () => {
            const bindSalesmanId = uni.getStorageSync("bindSalesmanId");
            try {
                loginLoading.value = true;
                formState.value.mobile = configStore.isOpenMobileAreaCode ? mobileAreaCode.value + formState.value.mobile : formState.value.mobile;
                await userRegist({ ...formState.value, salesmanId: bindSalesmanId });
                uni.showToast({
                    title: t("注册成功"),
                    duration: 1500,
                    icon: "none"
                });
                setTimeout(() => {
                    // 一秒后执行这里的代码
                    uni.redirectTo({
                        url: "/pages/login/index"
                    });
                }, 1000);
            } catch (error: any) {
                reset();
                uni.showToast({
                    title: error.message,
                    duration: 1500,
                    icon: "none"
                });
            } finally {
                loginLoading.value = false;
            }
        })
        .catch((err: any) => {
            console.error("表单错误信息：", err);
        });
};
onShow(() => {
    if (uni.getStorageSync("token")) {
        uni.reLaunch({
            url: "/pages/index/index"
        });
    }
    nextTick(() => {
        formRef.value.setRules(formRules);
    });
});

const mobileErrorCallback = (msg: string) => {
    uni.showToast({
        title: msg,
        duration: 1500,
        icon: "none"
    });
};

const handleLink = (url: string) => {
    uni.navigateTo({
        url
    });
};
</script>
<style>
page {
    background: #fff !important;
}
</style>
<style lang="scss" scoped>
.mobileareacode-box {
    display: flex;
    align-items: center;

    .tem-input {
        flex: 1;
    }
}

.register-container {
    height: 100%;

    .register-warp {
        display: flex;
        flex-direction: column;
        padding-left: 20rpx;

        .h1_tit {
            font-size: 36rpx;
            padding: 40rpx;
            font-weight: bold;
            color: #333333;
        }
    }

    .profile-edit-content {
        margin: 0 40rpx;
        border-radius: 15rpx;
        padding: 20rpx;
        display: flex;
        flex-direction: column;
        gap: 16rpx;

        .item-one {
            display: flex;
            justify-content: space-between;
            flex-direction: row;
        }

        .input {
            padding-bottom: 10rpx;
            border-bottom: 1px solid #dfdfdf;
        }

        .btn {
            display: flex;
            justify-content: space-between;
            flex-direction: row;

            align-items: center;

            .lf-input {
                display: flex;
                gap: 20rpx;
            }
        }
    }
}

:deep(.is-input-border) {
    border: none; /* 首先清除所有边框 */
    border-radius: 0;
    border-bottom: 0.05rem solid;
}

.btn2-css3 {
    width: 100%;
    height: 90rpx;
    line-height: 90rpx;
    padding: 0;
    font-size: 36rpx;
    font-weight: normal;
}

.special-color {
    color: var(--general);
}

.placeholder {
    font-size: 28rpx;
    font-weight: normal;
}

.agreement-btn {
    display: flex;
    align-items: center;
}
</style>
