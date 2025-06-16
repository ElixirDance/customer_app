<template>
    <tig-layout title="名片海报">
        <view class="portalPoster-box">
            <canvas class="canvas-content" id="myCanvas" canvas-id="myCanvas" @longpress.stop="handleSave"></canvas>
            <view class="canvas-tip">{{ $t("长按保存图片") }}</view>
        </view>
    </tig-layout>
    <tig-qrcode ref="qrcodeRef" :immediatelyCreate="true" :value="link" :margin="10" :show="false" @success="qrcodeSuccess"></tig-qrcode>
</template>

<script setup lang="ts">
import { getCurrentInstance, ref, computed } from "vue";
import { onReady } from "@dcloudio/uni-app";
import { useConfigStore } from "@/store/config";
import { staticResource, getImageInfo, saveImageToAlbum } from "@/utils";
import { imageFormat } from "@/utils/format";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const configStore = useConfigStore();

const userInfo = ref(uni.getStorageSync("userInfo"));
const instance = getCurrentInstance();
let context = uni.createCanvasContext("myCanvas", instance);
const qrcodeImg = ref("");
const qrcodeRef = ref();
const link = computed(() => {
    return `${configStore.baseInfo.h5Domain}/pages/mall/salesmanCard/index?&salesmanId=${userInfo.value?.salesman?.salesmanId}`;
});
const height = 525;

// 生成海报
const createPoster = () => {
    uni.showLoading({
        title: t("生成中"),
        mask: true
    });
    const avatarSrc = userInfo.value.avatar ? imageFormat(userInfo.value.avatar) : staticResource("user/defaultAvatar.jpg");
    const nickname = userInfo.value.nickname ?? t("普通会员");
    context.draw(); //清空原来的画图内容
    context.setFillStyle("#ffffff");
    context.fillRect(0, 0, 345, 600);
    try {
        context.draw(true, async () => {
            const avatarRes = await getImageInfo(avatarSrc);
            context.drawImage(avatarRes.path, 0, 0, 345, 345);
            context.draw(true, async () => {
                const qrcodeRes = await getImageInfo(qrcodeImg.value);
                // 绘制二维码
                context.drawImage(qrcodeRes.path, 345 - 160 - 10, 345 + 15, 150, 150);
                // 绘制文字
                context.setFontSize(13);
                context.setFillStyle("#969799");
                context.fillText(nickname, 20, height - 50);
                context.setFillStyle("#000");
                context.setFontSize(22);
                context.fillText(userInfo.value.mobile, 20, 345 + 80);
                setTimeout(() => {
                    context.draw(true);
                }, 50);
            });
        });
    } catch (error) {
        console.error(error);
    } finally {
        uni.hideLoading();
    }
};
const handleSave = () => {
    uni.showModal({
        title: t("提示"),
        content: t("确定要保存图片吗？"),
        success: function (res) {
            if (res.confirm) {
                // canvas生成图片
                uni.canvasToTempFilePath(
                    {
                        // 这里修改保存的图片格式
                        fileType: "jpg",
                        canvasId: "myCanvas",
                        quality: 1,
                        success: function (res) {
                            // 保存本地
                            // #ifdef H5
                            uni.previewImage({
                                urls: [res.tempFilePath]
                            });
                            // #endif

                            // #ifdef APP-PLUS||MP-WEIXIN
                            saveImageToAlbum(res.tempFilePath)
                                .then((res) => {
                                    uni.showToast({
                                        title: t("保存成功"),
                                        icon: "none"
                                    });
                                })
                                .catch((err) => {
                                    uni.showToast({
                                        title: t("保存失败"),
                                        icon: "none"
                                    });
                                    console.error(err);
                                });
                            // #endif
                        },
                        fail: (err) => {
                            console.log(err);
                        }
                    },
                    instance
                );
            }
        }
    });
};
const qrcodeSuccess = (e: string) => {
    qrcodeImg.value = e;
    createPoster();
};
onReady(() => {
    qrcodeRef.value?.drawQrcode();
});
</script>

<style lang="scss" scoped>
.portalPoster-box {
    margin-top: 80rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    .canvas-tip {
        color: #969799;
        font-size: 26rpx;
        margin-top: 35rpx;
        text-align: center;
    }

    .canvas-content {
        width: 345px;
        height: v-bind("height + 'px'");
        background-color: #ffffff;
        border-radius: 20rpx;
        overflow: hidden;
    }
}
</style>
