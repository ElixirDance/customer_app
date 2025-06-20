<template>
    <tig-layout :title="navbarTitle">
        <view class="article-center" v-if="!loading">
            <view class="news-list">
                <block v-if="articleList.length">
                    <view class="news-item" v-for="article in articleList" :key="article.articleId">
                        <view class="pic-desc" @click="goPages(`/pages/article/news/detail?id=${article.articleId}`)">
                            <view class="news-left" :class="{ 'w-100': !article.articleThumb }">
                                <view class="pd-title" :title="article.articleTitle">
                                    <text class="yin_agn" v-if="article.articleTag">{{ $t("新闻资讯") }}</text>
                                    <text>{{ article.articleTitle }}</text>
                                </view>
                                <view class="pd-det" v-if="article.description">{{ article.description }}</view>
                            </view>
                            <view class="news-right" v-if="article.articleThumb">
                                <tig-image :src="article.articleThumb" :alt="article.articleTitle"></tig-image>
                            </view>
                        </view>
                        <view class="info-btn">
                            <view class="evaluate" v-if="article.addTime">
                                <text class="time">{{ article.addTime }}</text>
                            </view>
                            <navigator
                                v-if="article.link"
                                class="red-btn"
                                target="_blank"
                                :url="article.link"
                                hover-class="navigator-hover"
                                open-type="navigate"
                            >
                                <text>{{ $t("相关链接") }}</text>
                            </navigator>
                        </view>
                    </view>
                </block>
                <block v-else>
                    <empty-box mode="news" text="暂无文章"></empty-box>
                </block>
                <loading-box v-model="loaded" :page="filterParams.page" :length="articleList.length"></loading-box>
            </view>
        </view>
    </tig-layout>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { getArticleList } from "@/api/article/article";
import type { ArticleFilterState, ArticleFilterParams } from "@/types/article/article";
import { onLoad, onReachBottom } from "@dcloudio/uni-app";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const navbarTitle = ref("文章中心");

const props = defineProps({
    id: {
        type: String || Number,
        default: ""
    }
});

const id = ref("bzgg");
const loading = ref(false);
const loaded = ref(false);
const total = ref(0);
const filterParams = reactive<ArticleFilterParams>({
    page: 1,
    categorySn: props.id,
    size: 10
});
const articleList = ref(<ArticleFilterState[]>[]);

const loadFilter = async () => {
    if (filterParams.page > 1) {
        loaded.value = true;
    } else {
        uni.showLoading({
            title: t("加载中")
        });
        loading.value = true;
    }
    try {
        const result = await getArticleList({ ...filterParams });
        total.value = result.total;
        articleList.value = [...articleList.value, ...result.records];
    } catch (error: any) {
        console.error(error.message);
    } finally {
        loading.value = false;
        loaded.value = false;
        uni.hideLoading();
    }
};

const goPages = (url: string) => {
    uni.navigateTo({
        url
    });
};

onLoad((option: any) => {
    if (option && option.id) {
        id.value = option.id;
        navbarTitle.value = option.id === "zxzx" ? "最新资讯" : option.id === "bzgg" ? "最新公告" : option.id === "kfzx" ? "客服中心" : "";
        loadFilter();
    }
});

onReachBottom(() => {
    if (filterParams.page < Math.ceil(total.value / Number(filterParams.size))) {
        filterParams.page++;
        loadFilter();
    }
});
</script>

<style lang="scss" scoped>
.article-center {
    padding: 24rpx;
    .news-list {
        width: 100%;
        .news-item {
            background-color: #fff;
            padding: 24rpx;
            overflow: hidden;
            border-radius: 8rpx;
            margin-bottom: 20rpx;
            display: flex;
            flex-direction: column;
            row-gap: 8rpx;
            .pic-desc {
                overflow: hidden;
                width: 100%;
                display: flex;
                column-gap: 20rpx;
                .news-left {
                    width: 60%;
                    &.w-100 {
                        width: 100%;
                    }
                    .pd-title {
                        font-size: 1rem;
                        line-height: 1.25rem;
                        color: #2e2e2e;
                        font-weight: 500;
                        margin-bottom: 0.45rem;
                        height: 2.7rem;
                        overflow: hidden;
                    }
                    .pd-det {
                        display: block;
                        font-size: 0.7rem;
                        line-height: 1em;
                        color: #646464;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
                .news-right {
                    width: 40%;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
            }
            .info-btn {
                width: 100%;
                line-height: 60rpx;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .evaluate {
                    border: 1rpx solid #e3e3e3;
                    border-radius: 10rpx;
                    height: 46rpx;
                    line-height: 46rpx;
                    margin-right: 16rpx;
                    .time {
                        padding-left: 20rpx;
                        color: #9b9b9b;
                        padding-right: 20rpx;
                    }
                }
                .red-btn {
                    border-radius: 10rpx;
                    display: inline-block;
                    width: 20%;
                    height: 46rpx;
                    background: #e03737;
                    line-height: 46rpx;
                    text-align: center;
                    color: #fff;
                }
            }
        }
    }
}
.yin_agn {
    background: #ffecec none repeat scroll 0 0;
    color: #c00;
    font-size: 24rpx;
    font-weight: 400;
    height: 40rpx;
    line-height: 40rpx;
    margin: 0rpx 20rpx 0 0;
    max-width: none;
    display: inline-block;
    padding: 0 16rpx;
}
.empty {
    color: #999;
    padding: 48rpx 0;
    text-align: center;
    font-size: 28rpx;
}
</style>
