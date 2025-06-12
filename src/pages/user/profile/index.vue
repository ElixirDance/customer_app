<template>
    <tig-layout title="个人资料">
        <view class="profile-edit-main">
            <uni-forms ref="formRef" :modelValue="form" label-width="300rpx">
                <view class="profile-edit-content">
                    <uni-forms-item :label="$t('用户ID')" name="username">
                        <uni-easyinput v-model="form.dimUsername" :inputBorder="false" disabled primaryColor="rgb(192, 196, 204)" />
                    </uni-forms-item>
                    <uni-forms-item :label="$t('昵称')" name="nickname">
                        <uni-easyinput
                            v-model="form.nickname"
                            :inputBorder="false"
                            :placeholder="$t('请输入昵称')"
                            primaryColor="rgb(192, 196, 204)"
                            type="nickname"
                        />
                    </uni-forms-item>
                    <uni-forms-item :label="$t('出生日期')" name="birthday">
                        <view class="el-input-id" @click="handleShowDatetime">
                            {{ form.birthday === "0000-00-00" ? $t("请选择出生日期") : form.birthday }}
                            <view class="iconfont icon-xiangyou"></view>
                        </view>

                        <!-- <block v-else>
                                <uni-datetime-picker
                                    v-model="form.birthday"
                                    :border="false"
                                    :clear-icon="false"
                                    type="date"
                                    @change="handleDateChange"
                                />
                            </block> -->
                    </uni-forms-item>
                </view>
                <view class="profile-edit-content">
                    <uni-forms-item :label="$t('登录密码')" @tap="goPages('/pages/user/security/password' + '?mobile=' + form.mobile, 'password')">
                        <view class="el-input-id">
                            {{ $t("修改") }}
                            <view class="iconfont icon-xiangyou"></view>
                        </view>
                    </uni-forms-item>
                    <uni-forms-item :label="$t('手机号码')" @tap="goPages('/pages/user/security/phone' + '?mobile=' + form.mobile)">
                        <view class="el-input-id">
                            {{ form.showMobile }}
                            <view class="iconfont icon-xiangyou"></view>
                        </view>
                    </uni-forms-item>
                    <!-- #ifdef H5 -->
                    <uni-forms-item :label="$t('公众号绑定')" v-if="configStore.XClientType == 'wechat'">
                        <view class="el-input-id" @click.stop="unbindWechatAct" v-if="form.isBindWechat">
                            {{ $t("解绑") }}
                            <view class="iconfont icon-xiangyou"></view>
                        </view>
                        <view class="el-input-id" @click.stop="wechatLogin" v-else>
                            {{ $t("绑定") }}
                            <view class="iconfont icon-xiangyou"></view>
                        </view>
                    </uni-forms-item>
                    <!-- #endif -->
                </view>
            </uni-forms>
        </view>
        <tig-fixed-placeholder backgroundColor="#fff">
            <view class="btn-box">
                <tig-button class="btn" plain @click="onLogout"> {{ $t("退出登录") }} </tig-button>
                <tig-button class="btn" @click="onSubmit"> {{ $t("保存修改") }} </tig-button>
            </view>
        </tig-fixed-placeholder>
        <up-datetime-picker
            :cancelText="$t('取消')"
            :confirmText="$t('确定')"
            ref="datetimePickerRef"
            :show="showDatetime"
            :modelValue="Date.now()"
            mode="date"
            :formatter="formatter"
            @cancel="showDatetime = false"
            @confirm="getBirthday"
            format="YYYY-MM-DD"
            confirmColor="var(--general)"
            :minDate="1"
        ></up-datetime-picker>
    </tig-layout>
</template>

<script lang="ts" setup>
import { nextTick, reactive, ref } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { getProfile, updateProfile } from "@/api/user/profile";
import { useUserStore } from "@/store/user";
import { getOauthUrl, bindWechat, unbindWechat } from "@/api/login/login";
import { useConfigStore } from "@/store/config";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const userStore = useUserStore();

const configStore = useConfigStore();

const form = reactive<any>({
    nickname: "",
    birthday: "",
    mobile: ""
});

const handleDateChange = (date: string) => {
    form.birthday = date;
};
const selectedGender = ref(0);
const genderList = ref(["保密", "男", "女"]);
const onPickerChange = (e: any) => {
    selectedGender.value = e.detail.value;
};
const goPages = (url: string, type?: string) => {
    if (type == "password" && form.mobile == "") {
        uni.showToast({
            title: t("未绑定手机号，请先绑定手机号再修改密码"),
            icon: "none"
        });
        return;
    }
    uni.navigateTo({
        url
    });
};

const rules = {
    nickname: {
        rules: [{ required: true, errorMessage: t("请您填写用户昵称") }]
    }
};

const formRef = ref();
const onSubmit = (values: any) => {
    formRef.value
        .validate()
        .then(() => {
            edit();
        })
        .catch((err: any) => {
            console.log("表单错误信息：", err);
        });
};
const onLogout = () => {
    userStore.logout();
};

const edit = async () => {
    try {
        await updateProfile({ ...form });

        uni.showToast({
            title: t("修改成功"),
            icon: "none",
            duration: 1000
        });

        setTimeout(() => {
            uni.navigateBack({
                success: function (res) {
                    uni.$emit("refreshData"); // 发送刷新信号
                }
            });
        }, 1000);
    } catch (error: any) {
        console.error(error);
        uni.showToast({
            title: error.message,
            icon: "none",
            duration: 1000
        });
    }
};

onShow(() => {
    nextTick(() => {
        formRef.value.setRules(rules);
        // 微信小程序需要用此写法
        datetimePickerRef.value.setFormatter(formatter);
    });
    if (configStore.XClientType === "wechat" && uni.getStorageSync("token")) {
        const params = getUlParams(location.href);
        if (params.code && params.code.length > 12) {
            //授权
            bindWechatAct(params.code);
        }
    }
});

//绑定微信
const bindWechatAct = async (code: string) => {
    uni.showLoading({
        title: t("授权中") + "..."
    });
    try {
        const result = await bindWechat({ code: code });
        uni.showToast({
            title: result.message,
            icon: "none",
            duration: 1000
        });
        setTimeout(() => {
            uni.redirectTo({ url: "/pages/user/profile/index" });
        }, 500);
    } catch (error: any) {
        uni.showToast({
            title: error.message,
            icon: "none",
            duration: 1000
        });
    } finally {
        uni.hideLoading();
    }
};
//解绑
const unbindWechatAct = async () => {
    uni.showModal({
        title: t("提示"),
        content: t("确定取消绑定吗？"),
        success: async (res) => {
            if (res.confirm) {
                uni.showLoading({
                    title: t("正在解绑...")
                });
                try {
                    const result = await unbindWechat();
                    uni.hideLoading();
                    uni.showToast({
                        title: result.message,
                        icon: "none",
                        duration: 1000
                    });
                    setTimeout(() => {
                        __getProfile();
                    }, 500);
                } catch (error: any) {
                    console.error(error);
                    uni.showToast({
                        title: error.message,
                        icon: "none",
                        duration: 1000
                    });
                } finally {
                    uni.hideLoading();
                }
            }
        }
    });
};

const getUlParams = (url: string) => {
    const params: AnyObject = {};
    const urlParams = url.split("?")[1];
    if (urlParams) {
        urlParams.split("&").forEach((item: string) => {
            const [key, value] = item.split("=");
            params[key] = value;
        });
    }
    return params;
};

onLoad(() => {
    __getProfile();
});

const __getProfile = async () => {
    uni.showLoading({
        title: t("加载中")
    });
    try {
        const result = await getProfile();
        let temp: any = result.mobile;
        result.showMobile = temp.replace(/(\d{2})\d*(\d{4})$/, "$1*****$2");
        Object.assign(form, result);
    } catch (error) {
        console.error(error);
    } finally {
        uni.hideLoading();
    }
};

const formatter = (type: string, value: string) => {
    if (type === "year") {
        return `${value}${t("年")}`;
    }
    if (type === "month") {
        return `${value}${t("月")}`;
    }
    if (type === "day") {
        return `${value}${t("日")}`;
    }
    return value;
};

const datetimePickerRef = ref();
const showDatetime = ref(false);
const handleShowDatetime = () => {
    showDatetime.value = true;
};
const getBirthday = (val: any) => {
    form.birthday = uni.$u.timeFormat(val.value, "yyyy-mm-dd");
    showDatetime.value = false;
};

//微信授权登录
const wechatLogin = async () => {
    const result = await getOauthUrl({ url: location.origin + location.pathname });
    window.location.href = result.url;
};
</script>

<style lang="scss" scoped>
:deep(.uni-forms-item) {
    margin-bottom: 30rpx;
}

:deep(.uni-forms-item:last-child) {
    margin-bottom: 0;
}

:deep(.uni-forms-item__label) {
    font-size: 26rpx;
}

:deep(.uni-forms-item__error) {
    top: 90%;
    left: 18rpx;
}

:deep(.uni-input-input) {
    text-align: right;
}

:deep(.uni-easyinput__placeholder-class) {
    font-size: 26rpx;
    text-align: right;
}

:deep(.is-disabled) {
    background-color: #fff !important;
}

:deep(.icon-calendar) {
    display: none;
}

:deep(.uni-date__x-input) {
    text-align: right;
    color: #333;
}

.profile-edit-main {
    padding: 20rpx;

    .profile-edit-content {
        background-color: #fff;
        border-radius: 15rpx;
        padding: 20rpx;
        margin-bottom: 20rpx;

        .el-input-id {
            height: 100%;
            color: #999999;
            font-size: 24rpx;
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }
    }

    :deep(.uni-calendar-item__weeks-box .uni-calendar-item--checked) {
        background-color: var(--general);
    }
    :deep(.uni-datetime-picker--btn) {
        background-color: var(--general);
    }
}
.birthday-input {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: end;
    height: 100%;
    font-size: 23rpx;
    color: #999;
}

.btn-box {
    padding: 25rpx 15rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;

    .btn {
        width: 48%;
        font-size: 28rpx;
        height: 100%;
    }
}
</style>
