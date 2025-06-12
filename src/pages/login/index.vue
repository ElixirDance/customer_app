<template>
    <view>
        <template v-if="isOverseas()">
            <overseasLogin v-model:loginType="loginType" :oauthCallbackData="oauthCallbackData"></overseasLogin>
        </template>
        <template v-else>
            <baseLogin v-model:loginType="loginType" ></baseLogin>
        </template>
    </view>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { isOverseas } from "@/utils";
import baseLogin from "./src/baseLogin.vue";
import overseasLogin from "./src/overseasLogin.vue";
import { useUserStore } from "@/store/user";

const userStore = useUserStore();

const loginType = ref("password");

const oauthCallbackData = ref({});

onLoad((options) => {
    if (options) {
        if (options.loginType) {
            loginType.value = options.loginType;
        }
        if (options.url) {
            uni.setStorageSync("URL", options.url);
        }
        if (options.code) {
            oauthCallbackData.value = options;
        }
    }
});

onShow(() => {
    if (uni.getStorageSync("token") || userStore.token) {
        uni.reLaunch({
            url: "/pages/index/index"
        });
    }
});
</script>

<style>
page {
    background: #fff !important;
}
</style>
