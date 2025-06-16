<template>
    <tig-layout title="订单评价">
        <view class="comment-info">
            <view class="comment-item" v-for="(item, index) in formState">
                <template v-if="!item.isShowed">
                    <view class="white-card">
                        <view class="product flex">
                            <view class="product-img">
                                <tig-image :src="item.picThumb" mode="aspectFit"></tig-image>
                            </view>
                            <view class="product-info">
                                <view class="product-name">
                                    {{ item.productName }}
                                </view>
                                <view class="product-price">
                                    <format-price :showText="false" :isBottom="false" :priceData="item.price"></format-price>
                                </view>
                                <view class="sku-card" :class="{ nodata: item.skuData.length === 0 }">
                                    <template v-if="item.skuData.length > 0">
                                        <view v-for="(skuItem, skuIndex) in item.skuData" :key="skuIndex" class="sku-item line1">{{ skuItem.value }}</view>
                                    </template>
                                </view>
                            </view>
                        </view>
                        <view class="comment">
                            <view class="flex comment-cell">
                                <view class="lable-text">{{ $t("商品评分") }}：</view>
                                <view class="flex">
                                    <uni-rate
                                        :readonly="item.isCommentInfo"
                                        :value="item.commentRank"
                                        color="#bfbfbf"
                                        active-color="#ffa800"
                                        size="18"
                                        @change="onChange(index, $event)"
                                    />
                                    <text style="margin-left: 10rpx">{{ item.commentRank }}{{ $t("分") }}</text>
                                </view>
                            </view>
                            <template v-if="!item.rankVerification">
                                <view class="flex comment-cell">
                                    <view class="lable-text"></view>
                                    <view class="tips">{{ $t("请先评分商品") }}</view>
                                </view>
                            </template>
                            <view class="comment-cell">
                                <view class="label-list flex-wrap" v-if="!item.isCommentInfo">
                                    <view
                                        v-for="lb in item.allCommentTag"
                                        :class="{ active: item.commentTag.includes(lb) }"
                                        class="label-item"
                                        @click="checkTag(index, lb)"
                                    >
                                        <text>{{ lb }}</text>
                                    </view>
                                    <view class="label-edit" v-if="!item.isAdd" @click="isShowadd(index)">
                                        <view></view>
                                        <view>{{ $t("自定义") }}</view>
                                    </view>
                                    <view class="label-edit-input flex align-center justify-between" v-else>
                                        <view>
                                            <input type="text" v-model="tabInput" auto-focus :placeholder="$t('请输入自定义标签')" />
                                        </view>
                                        <tig-button class="btn" @click="tabAdd(index)">{{ $t("确定") }}</tig-button>
                                    </view>
                                </view>
                                <view class="label-list" v-else>
                                    <view v-for="lb in item.commentTag" class="label-item-txt">
                                        <text>{{ lb }}</text>
                                    </view>
                                </view>
                            </view>
                            <view class="comment-cell">
                                <view class="textarea-box">
                                    <textarea
                                        cols="50"
                                        name="content"
                                        :placeholder="$t('商品是否给力？快分享你的购买心得吧~')"
                                        rows="5"
                                        style="border: 1px solid #d9d9d9; padding: 4px"
                                        v-model="item.content"
                                        :disabled="item.isCommentInfo"
                                    ></textarea>
                                </view>
                            </view>
                            <view class="comment-cell flex align-center justify-between">
                                <view class="tips">
                                    <text v-if="!item.contentVerification">{{ $t("请填写购买心得") }}</text>
                                </view>
                                <view class="strlangth">{{ $t("10-200字") }}</view>
                            </view>
                            <view class="comment-cell">
                                <view class="lable-text">{{ $t("添加图片") }}</view>
                                <view class="pic-box flex-wrap">
                                    <view
                                        class="pic-img"
                                        v-for="(product, picIndex) in item.showPics"
                                        style="transition: opacity 0.2s linear; margin-right: 10px"
                                    >
                                        <tig-image :src="product.picThumb" @click="imagePreview(imageFormat(product.picThumb))"></tig-image>
                                        <view class="close-icon" @click="close(item, picIndex)">
                                            <uni-icons type="clear" size="25" color="#cccccc"></uni-icons>
                                        </view>
                                    </view>
                                    <tig-upload v-if="item.showPics.length < 9" :count="9" v-model="item.showPics">
                                        <view class="add-img">
                                            <uni-icons type="plusempty" size="30" color="#cccccc"></uni-icons>
                                        </view>
                                    </tig-upload>
                                </view>
                            </view>
                            <view class="comment-cell">
                                <tig-button class="tig-button" @click="onSubmit(item, index)">{{ $t("提交评论") }}</tig-button>
                            </view>
                        </view>
                    </view>
                </template>
            </view>
        </view>
    </tig-layout>
</template>

<script setup lang="ts">
import { getCommentData, updateCommentData } from "@/api/user/comment";
import { ref } from "vue";
import { onLoad, onUnload } from "@dcloudio/uni-app";
import { imageFormat } from "@/utils/format";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const close = (item: any, index: number) => {
    item.showPics.splice(index, 1);
};
const onChange = (index: any, e: any) => {
    formState.value[index].commentRank = e.value;
};
const commentId = ref<string>("");
const labelList = ref([t("送货快"), t("质量很好"), t("服务周到"), t("正品"), t("很划算"), t("包装仔细"), t("价格实惠"), t("还可以"), t("相当好")]);
const formState = ref<any[]>([]);
const fetchCommentData = async (id: string) => {
    uni.showLoading({
        title: t("加载中")
    });
    try {
        const result = await getCommentData({ id: id });
        result.items.map((data: any) => {
            data.allCommentTag = JSON.parse(JSON.stringify(labelList.value)); // 使用深拷贝来创建独立的数组
            Object.assign(
                data,
                {
                    commentRank: 0,
                    content: "",
                    showPics: [],
                    commentTag: [],
                    isAdd: false,
                    rankVerification: true,
                    contentVerification: true,
                    isCommentInfo: data.commentInfo ? true : false
                },
                data.commentInfo
            );
        });
        Object.assign(formState.value, result.items);
        const allAreTrue = formState.value.every((obj: any) => obj.isShowed === 1);
        if (allAreTrue) {
            //如果商品列表全都评价完了就跳转到评价列表
            // uni.navigateTo({
            //     url: "/pages/mall/user/comment/list?currentType=2"
            // });
            // 如果商品列表全都评价完了就跳转到评价列表
            uni.navigateBack({
                delta: 1 // 返回上一页
            });
            // 触发事件并传递数据
            uni.$emit("commentFinished", true);
        }
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
const tabInput = ref("");
const isShowadd = (index: number) => {
    formState.value[index].isAdd = !formState.value[index].isAdd;
};
const tabAdd = (index: number) => {
    if (tabInput.value !== "") {
        const newCommentTag = JSON.parse(JSON.stringify(formState.value[index].allCommentTag));
        if (newCommentTag.includes(tabInput.value)) {
            uni.showToast({
                title: t("您已添加相同标签"),
                icon: "none",
                duration: 1000
            });
            return;
        }
        newCommentTag.push(tabInput.value);
        formState.value[index].allCommentTag = newCommentTag;
        checkTag(index, tabInput.value);
    }
    tabInput.value = "";
    formState.value[index].isAdd = false;
};
const checkTag = (index: number, label: string) => {
    let arr = formState.value[index].commentTag;
    if (arr.includes(label)) {
        formState.value[index].commentTag = arr.filter((item: any) => item !== label);
    } else {
        arr.push(label);
    }
};
const imagePreview = (url: string) => {
    uni.previewImage({
        urls: [url]
    });
};
const onSubmit = async (item: any, index: number) => {
    if (item.commentRank < 1) {
        item.rankVerification = false;
        return;
    }
    if (item.content == "") {
        item.contentVerification = false;
        return;
    }
    try {
        const data = {
            productId: item.productId,
            orderId: item.orderId,
            orderItemId: item.itemId,
            shopId: item.shopId,
            commentRank: item.commentRank,
            commentTag: item.commentTag,
            content: item.content,
            showPics: item.showPics
        };
        await updateCommentData(data);
        item.rankVerification = true;
        item.contentVerification = true;
        uni.showToast({
            title: t("提交成功"),
            icon: "none",
            duration: 1000
        });
        fetchCommentData(commentId.value);
    } catch (error: any) {
        uni.showToast({
            title: error.message,
            icon: "none",
            duration: 1000
        });
    } finally {
    }
};
onLoad((option) => {
    if (option) {
        const { id } = option;
        if (id) {
            commentId.value = id;
            // 获取详情数据
            fetchCommentData(id);
        }
    }
});

// 关闭预览图片
onUnload(() => {
    // #ifdef  H5 || APP
    uni.closePreviewImage();
    // #endif
});
</script>

<style lang="scss" scoped>
.comment-info {
    padding: 20rpx;
    .comment-item {
        .white-card {
            background-color: #fff;
            padding: 20rpx;
            border-radius: 20rpx;
            margin-bottom: 20rpx;
            .product {
                margin-bottom: 25rpx;
                .product-img {
                    width: 130rpx;
                    height: 130rpx;
                    background-color: rd;
                    margin-right: 20rpx;
                    overflow: hidden;
                }
                .product-info {
                    flex: 1;
                    font-size: 24rpx;
                    line-height: 32rpx;
                    .product-price {
                        color: var(--general);
                        margin-top: 10rpx;
                    }
                }
            }
            .comment {
                .comment-cell {
                    font-size: 24rpx;
                    padding-bottom: 20rpx;
                    .lable-text {
                        width: 130rpx;
                    }
                    .tips {
                        color: $tig-color-error;
                    }
                    .label-list {
                        .label-item,
                        .label-edit,
                        .label-item-txt {
                            display: inline-block;
                            background-color: #f5f5f5;
                            padding: 8rpx 15rpx;
                            margin-right: 15rpx;
                            margin-bottom: 15rpx;
                            border-radius: 5rpx;
                        }
                        .active {
                            background-color: var(--general);
                            color: #fff;
                        }
                        .label-edit-input {
                            width: 100vw;
                            padding: 10rpx 0;
                            input {
                                width: 68vw;
                                font-size: 24rpx;
                                padding: 15rpx;
                                background-color: #f5f5f5;
                            }
                            .btn {
                                padding: 16rpx 30rpx;
                                border-radius: 5rpx;
                            }
                        }
                    }
                    .label-list-edit {
                        .label-item {
                            .iconfont {
                                margin-left: 10rpx;
                            }
                        }
                        .label-edit-input {
                            input {
                                width: 200rpx;
                            }
                        }
                    }
                    .textarea-box {
                        width: 100%;
                        padding: 20rpx;
                        border-radius: 10rpx;
                        background-color: #f5f5f5;
                        textarea {
                            width: 98%;
                            font-size: 24rpx;
                            border: none !important;
                        }
                    }

                    .strlangth {
                        text-align: end;
                        color: #999;
                        font-size: 24rpx;
                        padding: 10rpx 0;
                    }
                    .pic-box {
                        margin-top: 20rpx;
                        .pic-img {
                            width: 130rpx;
                            height: 130rpx;
                            margin-bottom: 20rpx;
                            position: relative;
                            uni-image {
                                border-radius: 10rpx;
                            }
                            .close-icon {
                                position: absolute;
                                top: -20rpx;
                                right: -20rpx;
                            }
                        }
                        .add-img {
                            width: 130rpx;
                            height: 130rpx;
                            border: 1rpx solid #c6c4c4;
                            border-radius: 10rpx;
                            text-align: center;
                            line-height: 130rpx;
                        }
                    }
                    .tig-button {
                        width: 100%;
                        padding: 20rpx 0;
                    }
                }
            }
        }
    }
}
</style>
