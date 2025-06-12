<template>
    <tig-layout :title="title">
        <view class="address-edit-main">
            <view class="address-edit-content">
                <uni-forms ref="formRef" :modelValue="form" label-width="165rpx">
                    <uni-forms-item :label="$t('收货人：')" name="consignee" required>
                        <uni-easyinput primaryColor="rgb(192, 196, 204)" :inputBorder="false" v-model="form.consignee" :placeholder="$t('请输入姓名')" />
                    </uni-forms-item>
                    <uni-forms-item :label="$t('所在地区：')" name="regionNames" required>
                        <uni-easyinput
                            @iconClick="handleShowSelectRegion"
                            @focus="handleShowSelectRegion"
                            style="background-color: #fff"
                            suffixIcon="right"
                            primaryColor="rgb(192, 196, 204)"
                            :inputBorder="false"
                            v-model="form.regionNames"
                            :placeholder="$t('点击选择所在地区')"
                        />
                    </uni-forms-item>
                    <uni-forms-item :label="$t('详细地址：')" name="address" required>
                        <uni-easyinput
                            primaryColor="rgb(192, 196, 204)"
                            :inputBorder="false"
                            v-model="form.address"
                            :placeholder="$t('请您填写详细收货地址')"
                        />
                    </uni-forms-item>
                    <uni-forms-item :label="$t('手机号码：')" name="mobile" required>
                        <uni-easyinput primaryColor="rgb(192, 196, 204)" :inputBorder="false" v-model="form.mobile" :placeholder="$t('请输入手机号码')" />
                    </uni-forms-item>
                    <uni-forms-item :label="$t('固定电话：')" name="telephone">
                        <uni-easyinput primaryColor="rgb(192, 196, 204)" :inputBorder="false" v-model="form.telephone" :placeholder="$t('请输入固定电话')" />
                    </uni-forms-item>
                    <uni-forms-item :label="$t('邮箱地址：')" name="email">
                        <uni-easyinput primaryColor="rgb(192, 196, 204)" :inputBorder="false" v-model="form.email" :placeholder="$t('请输入邮箱地址')" />
                    </uni-forms-item>
                    <uni-forms-item :label="$t('默认地址')" name="email">
                        <view class="switch"> <u-switch v-model="isDefault" activeColor="var(--general)"></u-switch> </view>
                    </uni-forms-item>
                </uni-forms>
            </view>
        </view>
        <tig-fixed-placeholder backgroundColor="#fff">
            <view class="btn-box">
                <tig-button @click="onSubmit" :loading="isLoading"> {{ $t("提交") }} </tig-button>
            </view>
        </tig-fixed-placeholder>
    </tig-layout>
    <selectRegion v-model:show="showSelectRegion" v-model="form.regionIds" @sendRegionNames="getRegionNames"></selectRegion>
</template>

<script lang="ts" setup>
import selectRegion from "@/components/region/selectRegion.vue";
import { nextTick, reactive, ref } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { getAddressData, updateAddressData, addAddressData } from "@/api/user/address";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const title = ref("添加地址");

const id = ref(null);
const form = reactive({
    consignee: "",
    regionIds: [] as number[],
    address: "",
    mobile: "",
    telephone: "",
    email: "",
    regionNames: "",
    isDefault: 0
});

const isDefault = ref(false);

const rules = {
    consignee: {
        rules: [{ required: true, errorMessage: t("请您填写收货人姓名") }]
    },
    regionNames: {
        rules: [
            { required: true, errorMessage: t("请选择所在地区") },
            {
                validateFunction: function (rule: any, value: any, data: any, callback: any) {
                    if (form.regionIds.length < 1) {
                        callback(t("请选择所在地区"));
                    }
                    return true;
                }
            }
        ]
    },
    address: {
        rules: [{ required: true, errorMessage: t("请您填写详细收货地址") }]
    },
    mobile: {
        rules: [
            { required: true, errorMessage: t("请您填写收货人手机号码") },
            {
                validateFunction: function (rule: any, value: any, data: any, callback: any) {
                    const regex = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
                    const status = regex.test(value);
                    if (!status) {
                        callback(t("请输入正确的手机号码"));
                    }
                    return true;
                }
            }
        ]
    }
};

onShow(() => {
    nextTick(() => {
        formRef.value.setRules(rules);
    });
});

onLoad((option: any) => {
    if (option && option.id) {
        title.value = "编辑地址";
        id.value = option.id;
        __getAddressData();
    }
});

const __getAddressData = async () => {
    try {
        const result = await getAddressData({ id: id.value });
        const { regionNames } = result;
        Object.assign(form, result);
        form.regionNames = regionNames.join(" ");
        isDefault.value = form.isDefault === 1;
    } catch (error) {
        console.error(error);
    }
};

const getRegionNames = (val: string[]) => {
    form.regionNames = val.join(" ");
};

const showSelectRegion = ref(false);
const handleShowSelectRegion = () => {
    showSelectRegion.value = true;
};

const isLoading = ref(false);
const formRef = ref();
const onSubmit = () => {
    formRef.value
        .validate()
        .then(() => {
            form.isDefault = isDefault.value ? 1 : 0;
            if (isLoading.value) return;
            isLoading.value = true;
            if (id.value) {
                edit();
            } else {
                add();
            }
        })
        .catch((err: any) => {
            console.log("表单错误信息：", err);
        })
        .finally(() => {
            isLoading.value = false;
        });
};

const add = async () => {
    try {
        await addAddressData(form);
        uni.showToast({
            title: t("添加地址成功"),
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

const edit = async () => {
    try {
        await updateAddressData({ id: id.value, ...form });
        uni.showToast({
            title: t("编辑地址成功"),
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
</script>

<style lang="scss" scoped>
:deep(.uni-forms-item) {
    margin-bottom: 30rpx;
}
:deep(.uni-forms-item__error) {
    top: 90%;
    left: 18rpx;
}
:deep(.uni-easyinput__placeholder-class) {
    font-size: 26rpx;
}
:deep(.uni-forms-item__label) {
    font-size: 26rpx;
    position: relative;

    .is-required {
        position: absolute;
        top: 15rpx;
        left: -13rpx;
    }
}
:deep(.is-disabled) {
    background-color: #fff;
}

.btn-box {
    padding: 25rpx;
}

.address-edit-main {
    padding: 30rpx;
    padding-bottom: 0rpx;

    .address-edit-content {
        background-color: #fff;
        border-radius: 15rpx;
        padding: 20rpx;
        padding-bottom: 5rpx;
    }
}

.button-position {
    position: fixed;
    bottom: 30rpx;
    left: 0;
    right: 0;
    padding: 0 30rpx;
}
.switch {
    height: 100%;
    display: flex;
    align-items: center;
}
</style>
