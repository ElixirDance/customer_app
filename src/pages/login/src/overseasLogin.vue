<template>
    <tig-layout>
        <tig-navbar> </tig-navbar>
        <view class="login-page">
            <view class="tab-row">
                <template v-for="item in loginTypeTabs" :key="item.value">
                    <view class="item" :class="{ active: loginType === item.value }" @click="loginTypeChange(item.value)">
                        {{ item.name }}
                    </view>
                </template>
            </view>
            <view class="form-box">
                <template v-if="loginType === 'mobile'">
                    <view class="item">
                        <template v-if="configStore.isOpenMobileAreaCode">
                            <tig-mobile-areacode v-model="mobileAreaCode" style="width: 90rpx"></tig-mobile-areacode>
                        </template>
                        <input
                            @input="mobileInput"
                            :value="mobile"
                            type="text"
                            :placeholder="$t('请输入手机号')"
                            placeholder-class="placeholder"
                            class="mobile-text"
                        />
                    </view>
                    <view class="item">
                        <view style="flex: 1; margin-right: 10rpx">
                            <input
                                @input="mobileCodeInput"
                                type="text"
                                :placeholder="$t('手机短信验证码')"
                                placeholder-class="placeholder"
                                name="mobile_code"
                                class="text"
                                :value="mobileCode"
                            />
                        </view>
                        <verificationCode
                            :mobile="configStore.isOpenMobileAreaCode ? mobileAreaCode + mobile : mobile"
                            btnType="text"
                            v-model:isChecked="isChecked"
                            v-model:verify-token-data="verifyToken"
                            :requestApi="sendMobileCode"
                            @mobileErrorCallback="mobileErrorCallback"
                        >
                        </verificationCode>
                    </view>
                </template>
                <template v-if="loginType === 'password'">
                    <view class="item">
                        <input
                            @input="usernameInput"
                            :value="username"
                            type="text"
                            :placeholder="$t('请输入手机号')"
                            placeholder-class="placeholder"
                            class="text"
                        />
                    </view>
                    <view class="item">
                        <input
                            @input="passwordInput"
                            :value="password"
                            type="password"
                            :placeholder="$t('请输入密码')"
                            placeholder-class="placeholder"
                            class="text"
                        />
                    </view>
                </template>
            </view>
            <view class="btn2-css3">
                <tig-button
                    :loadingText="$t('登录中')"
                    :loading="loginLoading"
                    @click="mobileLogin"
                    :disabled="isloginDisabled"
                    size="normal"
                    :type="isloginDisabled ? 'info' : 'primary'"
                >
                    {{ $t("登录") }}
                </tig-button>
            </view>
            <template v-if="loginType === 'password'">
                <view class="other-row">
                    <view class="item" @click="handleReset">{{ $t("忘记密码") }}</view>
                    <view class="item flex" v-if="configStore.shopRegClosed === 0"
                        >{{ $t("新用户")
                        }}<text class="special-color" @click="redirect({ url: '/pages/register/index' })">
                            {{ $t("注册") }}
                        </text></view
                    >
                </view>
            </template>
            <template v-if="loginType === 'mobile'">
                <view class="other-row">
                    <view class="tips">{{ $t("未注册过的账号将自动注册账号") }}</view>
                </view>
            </template>

            <view class="footer-row">
                <!-- #ifdef WEB -->
                <template v-if="configStore.googleLoginOn || configStore.facebookLoginOn">
                    <up-divider :text="t('其他登录方式')"></up-divider>
                    <view class="login-other">
                        <template v-if="configStore.googleLoginOn">
                            <view class="item" @click="handleOtherLogin('google')">
                                <image :src="staticResource('login/google.png')" class="icon" mode="widthFix"></image>
                                <view>{{ $t("Google登录") }}</view>
                            </view>
                        </template>
                        <template v-if="configStore.facebookLoginOn">
                            <view class="item" @click="handleOtherLogin('facebook')">
                                <image :src="staticResource('login/facebook.png')" class="icon" mode="widthFix"></image>
                                <view>{{ $t("Facebook登录") }}</view>
                            </view>
                        </template>
                    </view>
                </template>
                <!-- #endif -->
                <view class="desc-box">
                    <view class="rule-text flex" @click="isChecked = !isChecked">
                        <tig-checkbox v-model:checked="isChecked" activeColor="#333333"></tig-checkbox>
                        <view class="rule-xieyi">
                            <text>{{ $t("登录即为同意") }}</text>
                            <text class="special-color" @click.stop="showAgreement">
                                {{ $t("《商城用户服务协议》") }}
                            </text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <Verify ref="verifyRef" mode="pop" captchaType="blockPuzzle" :imgSize="{ width: '310px', height: '155px' }" @okCallback="okCallback"></Verify>
    </tig-layout>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { sendMobileCode, setMiniProgramOpenid, userSignin, getOauth, getOauthCallback } from "@/api/login/login";
import { useUserStore } from "@/store/user";
import { redirect, staticResource } from "@/utils";
import { useI18n } from "vue-i18n";
import { useConfigStore } from "@/store/config";
import verificationCode from "@/components/verificationCode/index.vue";
import Verify from "@/components/verifition/Verify.vue";

const props = defineProps({
    oauthCallbackData: {
        type: Object
    }
});

const { t } = useI18n();

const configStore = useConfigStore();

const userStore = useUserStore();

const loginType = defineModel("loginType");

const mobileAreaCode = ref("86");
const mobile = ref("");
const mobileCode = ref("");
const username = ref("");
const password = ref("");
const isChecked = ref(false);
const verifyToken = ref("");
const loginLoading = ref(false);
const verifyRef = ref();
const loginTypeTabs = [
    {
        name: t("账号登录"),
        value: "password"
    },
    {
        name: t("验证码登录"),
        value: "mobile"
    }
];
const isloginDisabled = computed(() => {
    if (loginType.value === "password") {
        return !username.value || !password.value;
    } else {
        return !mobile.value || !mobileCode.value || !verifyToken.value;
    }
});
const loginTypeChange = (value: string) => {
    loginType.value = value;
};
const usernameInput = (e: any) => {
    username.value = e.detail.value;
};
const passwordInput = (e: any) => {
    password.value = e.detail.value;
};
const mobileInput = (e: any) => {
    mobile.value = e.detail.value;
};
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
const mobileLogin = () => {
    if (!isChecked.value) {
        return uni.showToast({
            title: t("请先同意用户协议"),
            duration: 1500,
            icon: "none"
        });
    }

    signin();
};

const showAgreement = () => {
    uni.navigateTo({
        url: "/pages/login/mallAgreement"
    });
};

const handleRedirect = () => {
    const backUrl = uni.getStorageSync("URL");
    setTimeout(() => {
        redirect({
            url: backUrl || "/pages/index/index",
            mode: "redirectTo",
            success: () => {
                uni.removeStorageSync("URL");
            }
        });
    }, 800);
};

const signin = async () => {
    try {
        loginLoading.value = true;
        const data = {
            loginType: loginType.value,
            username: username.value,
            password: password.value,
            mobile: "",
            mobileCode: "",
            verifyToken: verifyToken.value
        };
        if (loginType.value === "mobile") {
            data.mobile = configStore.isOpenMobileAreaCode ? mobileAreaCode.value + mobile.value : mobile.value;
            data.mobileCode = mobileCode.value;
        }
        const result = await userSignin(data);
        userStore.setToken(result.token);
        userStore.getUserInfo();
        uni.showToast({
            title: t("登录成功"),
            duration: 1000
        });
        handleRedirect();
        // #ifdef MP-WEIXIN
        updateUserOpenId();
        // #endif
    } catch (error: any) {
        if (error.code == 1002 && verifyRef.value) {
            verifyRef.value.show();
        } else if (error.code > 0) {
            uni.showToast({
                title: error.message,
                duration: 1500,
                icon: "none"
            });
            mobileCode.value = "";
        }
    } finally {
        loginLoading.value = false;
    }
};

const okCallback = (e: any) => {
    verifyToken.value = e.verifyToken;
    signin();
};

const updateUserOpenId = async () => {
    wx.login({
        success: async (res: any) => {
            await setMiniProgramOpenid({
                code: res.code
            });
        },
        fail: (err: any) => {
            console.log(err);
        }
    });
};

const handleReset = () => {
    uni.navigateTo({
        url: "/pages/reset/index"
    });
};

const handleOtherLogin = async (path: string) => {
    uni.setStorageSync("oauthPath", path);
    try {
        const result = await getOauth(path, window.location.href);
        window.open(result);
    } catch (error) {
        console.error(error);
    }
};

const __getOauthCallback = async () => {
    try {
        const result = await getOauthCallback(uni.getStorageSync("oauthPath") as string, window.location.href, props.oauthCallbackData!);
        userStore.setToken(result.token);
        userStore.getUserInfo();
        uni.showToast({
            title: t("授权成功"),
            duration: 1000
        });
        handleRedirect();
    } catch (error) {
        console.error(error);
        uni.showToast({
            title: t("授权失败"),
            duration: 1500,
            icon: "none"
        });
    }
};
if (props.oauthCallbackData && props.oauthCallbackData.code) {
    __getOauthCallback();
}
</script>
<style scoped lang="scss">
.login-page {
    padding: 0 60rpx;

    .tab-row {
        display: flex;
        align-items: end;
        gap: 80rpx;
        color: #999999;
        font-size: 34rpx;
        margin-bottom: 40rpx;
    }

    .active {
        color: #333333;
        font-size: 44rpx;
        font-weight: bold;
    }

    .form-box {
        padding: 40rpx 0;
        margin-bottom: 40rpx;

        .item {
            display: flex;
            align-items: center;
            padding-top: 50rpx;
            border-bottom: 1rpx solid #e9e9e9;
            height: 88rpx;
            box-sizing: content-box;
            width: 100%;

            .text {
                width: 100%;
            }

            &:first-child {
                padding-top: 0;
            }

            input {
                font-size: 28rpx;
                color: #333;
            }

            .placeholder {
                color: #dadada;
            }
        }
    }

    .other-row {
        display: flex;
        justify-content: space-between;
        color: #333;
        font-size: 28rpx;
        padding: 30rpx 0;

        text {
            color: var(--general);
        }

        .tips {
            color: #999;
            font-size: 24rpx;
        }
    }

    .footer-row {
        position: fixed;
        width: 100%;
        bottom: 0;
        left: 0;

        .login-other {
            margin-top: 20rpx;
            padding: 0 70rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 180rpx;
            column-gap: 80rpx;

            .item {
                text-align: center;
                color: #999999;
                font-size: 20rpx;

                image {
                    width: 90rpx;
                }
            }
        }

        .desc-box {
            font-size: 20rpx;
            color: #999999;
            padding-bottom: 50rpx;

            .rule-text {
                align-items: center;
                justify-content: center;

                .special-color {
                    color: var(--general);
                }
            }
        }
    }
}
</style>
