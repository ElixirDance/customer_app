<template>
    <view class="product-comment-card">
        <view class="comment-title flex justify-between align-center">
            <view class="txt">
                {{ $t("评价") }}<text>({{ comment.total ?? 0 }})</text>
            </view>
            <view class="more" @click="toPage(`/pages/product/comment?id=${productId}`)">
                {{ $t("好评") }}<text>{{ comment.goodPercent ?? 0 }}%</text>
                <uni-icons type="right" size="16" color="#bfbfbf"></uni-icons>
            </view>
        </view>
        <block v-if="commentList.length > 0">
            <view class="comment-item" v-for="(item, index) in commentList.slice(0, 2)" :key="index">
                <view class="user-info flex justify-between align-center">
                    <view class="user-name flex align-center">
                        <view class="head_logo">
                            <image :src="imageFormat(item?.avatar || '')" />
                        </view>
                        <view>
                            <text>{{ item.username }}</text>
                            <uni-rate :readonly="true" :value="item.commentRank" size="14" color="#bfbfbf" active-color="#ffa800"></uni-rate>
                        </view>
                    </view>
                    <view class="time">{{ item.addTime }}</view>
                </view>
                <view class="user-content">
                    {{ item.content }}
                </view>
                <view class="user-imgs flex-wrap align-center">
                    <image
                        v-for="(pic, index) in item.showPics"
                        :key="index"
                        :src="imageFormat(pic.picThumb)"
                        @click="imagePreview(imageFormat(pic?.picUrl || ''))"
                    />
                </view>
            </view>
        </block>
        <block v-else>
            <view class="no-data"> {{ $t("暂无评价") }}~ </view>
        </block>

        <view class="comment-btn-box flex align-center justify-around">
            <view class="btn flex align-center" @click="toPage(`/pages/product/comment?id=${productId}`)">
                <uni-icons type="chat" size="20" color="#333"></uni-icons>
                <text>{{ $t("全部评价") }}({{ comment.total ?? 0 }})</text>
            </view>
            <view class="btn flex align-center" @click="toPage(`/pages/product/consult?id=${productId}`)">
                <uni-icons type="chatboxes" size="20" color="#333"></uni-icons>
                <text>{{ $t("购买咨询") }}({{ consultationTotal ?? 0 }})</text>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { imageFormat } from "@/utils/format";
import { onLoad, onReachBottom } from "@dcloudio/uni-app";
import { getComment, getCommentList, getProductConsultationList } from "@/api/product/product";
import type { CommentDetail, CommentItem, ProductConsultationItem } from "@/types/product/product";
const emit = defineEmits(["change"]);
interface Props {
    productId: number;
}
const props = defineProps<Props>();
const loading = ref(false);
const comment = ref<CommentDetail>({});
const commentList = ref<CommentItem[]>([]);
const page = ref<number>(1);
const size = ref(10);
const toPage = (url: string) => {
    uni.navigateTo({
        url: url
    });
};
const imagePreview = (url: string) => {
    uni.previewImage({
        urls: [url]
    });
};
const _getComment = async (id: any) => {
    loading.value = true;
    try {
        const result = await getComment(id);
        comment.value = result;
    } catch (error) {
    } finally {
        loading.value = false;
    }
};
const _getCommentList = async (id: any) => {
    loading.value = true;
    try {
        const result = await getCommentList(id, {
            type: 1,
            page: page.value
        });
        commentList.value = result.records;
    } catch (error: any) {
        uni.showToast({
            title: error.message,
            icon: "none"
        });
    } finally {
        loading.value = false;
    }
};
const consultationList = ref<ProductConsultationItem[]>([]);
const consultationTotal = ref(0);
const fetchConsultation = async (id: any) => {
    try {
        const result = await getProductConsultationList({ productId: id, page: page.value, size: size.value });
        consultationList.value = result.records;
        consultationTotal.value = result.total;
    } catch (error: any) {
    } finally {
        loading.value = false;
    }
};
onLoad((option) => {
    if (option) {
        const { id } = option;
        if (id) {
            _getComment(id);
            _getCommentList(id);
            fetchConsultation(id);
        }
    }
});
</script>

<style lang="scss" scoped>
.product-comment-card {
    background-color: #fff;
    padding: 20rpx;
    border-radius: 20rpx;
    margin: 20rpx 0;
    .comment-title {
        padding-bottom: 20rpx;
        border-bottom: 1rpx solid #eee;
        .txt {
            font-size: 26rpx;
            font-weight: bold;
            text {
                margin-left: 5rpx;
                font-size: 22rpx;
                color: $tig-color-grey;
            }
        }
        .more {
            font-size: 26rpx;
            text {
                color: var(--general);
            }
        }
    }
    .comment-item {
        margin: 20rpx 0;
        border-bottom: 1rpx solid #eee;
        padding-bottom: 20rpx;
        .user-info {
            .user-name {
                font-size: 24rpx;
                .head_logo {
                    margin-right: 20rpx;
                    image {
                        width: 60rpx;
                        height: 60rpx;
                        border-radius: 100rpx;
                    }
                }
            }
            .time {
                font-size: 24rpx;
                color: $tig-color-grey;
            }
        }
        .user-content {
            margin: 20rpx 0;
            font-size: 26rpx;
        }
        .user-imgs {
            image {
                width: 90rpx;
                height: 90rpx;
                margin-right: 10rpx;
                margin-bottom: 10rpx;
                border: 1px solid #eee;
                border-radius: 5rpx;
            }
        }
    }
    .comment-btn-box {
        padding: 10rpx;
        .btn {
            color: #333;
            font-size: 24rpx;
            padding: 8rpx 30rpx;
            border: 1px solid $tig-color-grey;
            border-radius: 36px;
        }
    }
    .no-data {
        font-size: 26rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40rpx 0;
    }
}
</style>
