<template>
    <tig-layout title="会员等级">
        <div class="member-level">
            <div class="content">
                <div class="content__header">
                    <img class="member-level-head-background" src="http://localhost/lyecs7/public/static/mobile/images/ranks/bg.png" alt="" />
                    <div class="content__header__portrait">
                        <img :src="userInfo.userPhoto" />
                        <span>{{ userInfo.userName }}</span>
                    </div>
                </div>
                <div class="ranks-swiper">
                    <swiper :indicator-dots="false" :circular="false" interval="3000" duration="500" @change="swiperCardChange">
                        <block v-for="(cardItem, index) in cardList" :key="index">
                            <swiper-item>
                                <div class="swiper__slider__cardbox">
                                    <img src="http://localhost/lyecs7/public/static/mobile/images/ranks/rank-bg.png" class="swiper__slider__bg" />
                                    <block v-if="userInfo.userRank === cardItem.rankId">
                                        <div class="swiper__slider__current">当前等级</div>
                                    </block>
                                    <div class="swiper__slider__logo">Tigshop</div>
                                    <div class="swiper__slider__item item-color-1">
                                        <div class="swiper__slider__item__name">{{ cardItem.rankName }}</div>
                                        <div class="swiper__slider__item__score">
                                            <div class="text flex-row">
                                                <span>{{ cardItem.rankDesc }}</span>
                                            </div>
                                        </div>
                                        <div class="swiper__slider__item__experience">
                                            <span>{{ userInfo.rankPoints }}</span>
                                        </div>
                                        <div class="progress-container swiper__slider__item__progress">
                                            <div class="line" :style="{ width: cardItem.rate + '%' }"></div>
                                        </div>
                                        <div class="long-with">
                                            <span>成长值</span>
                                        </div>
                                    </div>
                                </div>
                            </swiper-item>
                        </block>
                    </swiper>
                </div>
                <block v-if="userRights">
                    <div class="rights">
                        <div class="rights__title">
                            <h3>我的特权</h3>
                        </div>
                        <div class="rights__content">
                            <div
                                class="rights__content__item"
                                :class="{
                                    'no-rank-select':
                                        (userRankInfo.specialRank === 1 || userRankInfo.specialRank === 0) && !userRightIds.includes(item.userRightId)
                                }"
                                v-for="(item, index) in userRights"
                                :key="item.userRightId"
                            >
                                <div class="item-img-wrap">
                                    <div class="suoding-icon" :class="{ 'no-rank-select-icon': userRightIds.includes(item.userRightId) }"></div>
                                    <img :src="item.userRightLogo" class="rights__content__item__img" :alt="item.userRightName" />
                                </div>
                                <div class="rights__content__item__txt">{{ item.userRightName }}</div>
                            </div>
                        </div>
                    </div>
                </block>
                <rec-product url="user/sign/index"></rec-product>
            </div>
            <div style="height: 10px"></div>
        </div>
    </tig-layout>
</template>

<script lang="ts" setup>
import recProduct from "@/components/rec-product/index.vue";
import { ref, reactive } from "vue";

const userInfo = ref({
    userName: "",
    userPhoto: "",
    userRank: 1,
    rankPoints: 10000
});

const userRankInfo = ref({
    specialRank: 0
});

const cardList = ref([
    {
        rankId: 1,
        rankName: "白银会员",
        rankDesc: "还需0成长值可升级至白银会员",
        rate: 100,
        userRightIds: "1,2"
    },
    {
        rankId: 2,
        rankName: "黄金会员",
        rankDesc: "还需0成长值可升级至黄金会员",
        rate: 80,
        userRightIds: "1,2,3"
    },
    {
        rankId: 3,
        rankName: "铂金会员",
        rankDesc: "还需0成长值可升级至黄金会员",
        rate: 60,
        userRightIds: "1,2,3,4"
    },
    {
        rankId: 4,
        rankName: "钻石会员",
        rankDesc: "还需0成长值可升级至黄金会员",
        rate: 30,
        userRightIds: "1,2,3,4,5,6"
    }
]);

const userRights = reactive([
    {
        userRightId: "1",
        userRightLogo: "http://localhost/lyecs7/public/static/mobile/images/ranks/qiandao.png",
        userRightName: "签到返利"
    },
    {
        userRightId: "2",
        userRightLogo: "http://localhost/lyecs7/public/static/mobile/images/ranks/jifenduihuan.png",
        userRightName: "积分兑换"
    },
    {
        userRightId: "3",
        userRightLogo: "http://oss.lyecs.com/img/gallery/demo/1680252172GwIt9xVFCcRuPHcaXK!!pic.png",
        userRightName: "线下折扣"
    },
    {
        userRightId: "4",
        userRightLogo: "http://oss.lyecs.com/img/gallery/demo/1680252172j4ltKe4JWA75EofqYb!!pic.png",
        userRightName: "运费折扣"
    },
    {
        userRightId: "5",
        userRightLogo: "http://oss.lyecs.com/img/gallery/demo/1680252172nLzWUg7tsAc0NEPshf!!pic.png",
        userRightName: "会员特价"
    },
    {
        userRightId: "6",
        userRightLogo: "http://oss.lyecs.com/img/gallery/demo/16802521724D4cIMO08jbaZLuIHq!!pic.png",
        userRightName: "消费返利"
    }
]);

const userRightIds = ref(["1", "2"]);
const activeIndex = ref(0);
const swiperCardChange = (e: any) => {
    activeIndex.value = e.detail.current;
    let newArr = cardList.value[activeIndex.value].userRightIds.split(",");
    userRightIds.value = [...newArr];
};
</script>

<style>
page {
    background-color: #fff;
}
</style>
<style lang="scss" scoped>
.member-level {
    position: relative;
    .content {
        position: relative;
        background-color: #fff;
        margin: auto;
        .content__header {
            width: 100%;
            height: 280rpx;
            position: relative;
            overflow: hidden;
            margin: 0 auto;
            background: #333;
            .member-level-head-background {
                position: absolute;
                top: -80rpx;
                width: 100%;
                height: 520rpx;
            }
            .content__header__portrait {
                text-align: center;
                padding: 32rpx;
                position: relative;
                display: flex;
                align-items: center;
                color: #fff;
                img {
                    width: 96rpx;
                    height: 96rpx;
                    border-radius: 50%;
                }
                span {
                    font-size: 32rpx;
                    margin-left: 30rpx;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
        }
    }
    .ranks-swiper {
        height: auto;
        margin-top: -120rpx;
        swiper {
            height: 360rpx;
        }
        .swiper__slider__cardbox {
            position: relative;
            width: calc(100% - 48rpx);
            max-width: 750rpx;
            height: 360rpx;
            margin: 0 auto;
            .swiper__slider__bg {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
            }
            .swiper__slider__current {
                position: absolute;
                top: 48rpx;
                right: 0;
                height: 32rpx;
                line-height: 32rpx;
                width: 120rpx;
                border-radius: 24rpx 0 0 24rpx;
                color: #fff;
                font-size: 20rpx;
                text-align: center;
                background-image: linear-gradient(to right, rgb(128, 128, 129), rgb(165, 166, 170));
            }
            .swiper__slider__logo {
                position: absolute;
                bottom: 32rpx;
                right: 32rpx;
                color: #fff;
                font-size: 36rpx;
                font-weight: 700;
                letter-spacing: 4rpx;
            }
            .swiper__slider__item {
                position: relative;
                box-sizing: border-box;
                height: 100%;
                padding: 32rpx 32rpx 0;
                z-index: 5;
                .swiper__slider__item__name {
                    font-size: 56rpx;
                    color: #626264;
                    text-align: left;
                }
                .swiper__slider__item__score {
                    color: #626264;
                    margin-top: 12rpx;
                    font-size: 24rpx;
                    .flex-row {
                        display: flex;
                        flex-flow: row wrap;
                        justify-content: space-between;
                        align-items: baseline;
                    }
                }
                .swiper__slider__item__experience {
                    margin-top: 24rpx;
                    font-size: 28rpx;
                    color: #626264;
                }
                .progress-container {
                    position: relative;
                    background: rgba(43, 50, 59, 0.1);
                    height: 8rpx;
                    border-radius: 8rpx;
                    width: 296rpx;
                    overflow: hidden;
                    margin-top: 8rpx;
                    .line {
                        position: absolute;
                        top: 0;
                        left: 0;
                        border-radius: 8rpx;
                        height: 8rpx;
                        color: #6c6d6d;
                        background-color: #6a6c6c;
                    }
                }
                .long-with {
                    color: #6c6d6d;
                    font-size: 24rpx;
                    margin-top: 8rpx;
                }
            }
        }
    }
    .rights {
        margin-top: 48rpx;
        padding: 0 32rpx;
        .rights__title {
            padding-top: 16rpx;
            padding-bottom: 16rpx;
            h3 {
                font-size: 36rpx;
                font-weight: 700;
            }
        }
        .rights__content {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            row-gap: 48rpx;
            padding-top: 24rpx;
            padding-bottom: 56rpx;
            .rights__content__item {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
                position: relative;
                &.no-rank-select {
                    .rights__content__item__img {
                        filter: grayscale(100%);
                        opacity: 50%;
                    }
                }
                .item-img-wrap {
                    position: relative;
                    height: 88rpx;
                    .suoding-icon {
                        position: absolute;
                        bottom: 8rpx;
                        right: 8rpx;
                        z-index: 1;
                        width: 32rpx;
                        height: 32rpx;
                        &::before {
                            display: inline-block;
                            width: 32rpx;
                            height: 32rpx;
                            margin: 0 auto;
                            background-size: cover;
                            content: " ";
                            background-color: #d1ba72;
                            border-radius: 50%;
                            border: 2rpx solid #fff;
                            background-image: url("data:image/png;base64,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");
                            box-sizing: border-box;
                        }
                        &.no-rank-select-icon {
                            display: none;
                        }
                    }
                    .rights__content__item__img {
                        width: 88rpx;
                        height: 88rpx;
                    }
                }
                .rights__content__item__txt {
                    font-size: 24rpx;
                    color: #333;
                    margin-top: 8rpx;
                    letter-spacing: 0;
                    text-align: center;
                    word-break: break-all;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    line-clamp: 2;
                    box-orient: vertical;
                }
            }
        }
    }
}
</style>
