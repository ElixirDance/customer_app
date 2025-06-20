<template>
    <tig-layout title="浏览记录">
        <up-checkbox-group v-model="checkboxValue" activeColor="var(--general)" placement="column" @change="checkboxChange">
            <template v-if="historyList.length > 0">
                <view class="history-product">
                    <template v-for="item in historyList" :key="item.productId">
                        <view class="history-product-item" @click="handleLink(item.productId)">
                            <view class="history-product-item-top">
                                <view class="img-box">
                                    <tig-image :src="item.picThumb" mode="widthFix"></tig-image>
                                </view>
                            </view>
                            <view class="history-product-item-bottom">
                                <view class="detail line2">
                                    {{ item.productName }}
                                </view>
                                <view class="price">
                                    <format-price
                                        :fontStyle="{ fontSize: '32rpx' }"
                                        :currencyStyle="{
                                            fontSize: '22rpx'
                                        }"
                                        :decimalsStyle="{
                                            fontSize: '25rpx'
                                        }"
                                        :priceData="item.productPrice"
                                    ></format-price>
                                </view>
                            </view>
                            <view class="item-btn" @click.stop="" v-show="edit">
                                <view class="btn-box">
                                    <up-checkbox :customStyle="{ border: 'none' }" size="20" shape="circle" :name="item.productId"> </up-checkbox>
                                </view>
                            </view>
                        </view>
                    </template>
                </view>
            </template>
        </up-checkbox-group>

        <template v-if="!loading && historyList.length == 0">
            <view class="empty-box">
                <view class="pictrue"><image :src="staticResource('common/data_empty.png')"></image></view>
                <view class="txt">{{ $t("暂无浏览记录！") }}</view>
            </view>
        </template>

        <tig-fixed-placeholder backgroundColor="#fff">
            <view class="footer-box">
                <template v-if="!edit">
                    <view class="footer-text">
                        <view class="footer-num"
                            >{{ $t("共") }}<text class="num">{{ historyList.length }}</text
                            >{{ $t("件商品") }}</view
                        >
                        <view class="footer-text-btn">
                            <tig-button class="btn" @click="edit = true">{{ $t("管理") }}</tig-button>
                        </view>
                    </view>
                </template>
                <template v-else>
                    <view class="footer-edit">
                        <view class="all-check">
                            <tig-checkbox v-model:checked="allChecked" @change="handleAll" :checkedText="$t('全选')"></tig-checkbox>
                        </view>
                        <view class="edit-btn">
                            <tig-button class="btn" plain @click="edit = false">{{ $t("取消") }}</tig-button>
                            <tig-button class="btn" :disabled="!checkboxValue.length" @click="handleDel">{{ $t("删除") }}</tig-button>
                        </view>
                    </view>
                </template>
            </view>
        </tig-fixed-placeholder>
    </tig-layout>
</template>

<script setup lang="ts">
import { historyProductList, delHistoryProduct } from "@/api/user/historyProduct";
import { ref } from "vue";
import type { HistoryProductList } from "@/types/user/historyProduct";
import { staticResource } from "@/utils";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const loading = ref(true);
const historyList = ref<HistoryProductList[]>([]);
const checkboxValue = ref([]);
const edit = ref(false);
const allChecked = ref(false);

const checkboxChange = (val: any) => {
    if (val.length == historyList.value.length) {
        allChecked.value = true;
    } else {
        allChecked.value = false;
    }
};
const handleAll = () => {
    if (allChecked.value) {
        checkboxValue.value = historyList.value.map((item) => item.productId);
        return;
    }
    checkboxValue.value = [];
};

const handleDel = async () => {
    try {
        await delHistoryProduct(checkboxValue.value);
        uni.showToast({
            title: t("删除成功"),
            icon: "none"
        });
        getHistoryProductList();
    } catch (error) {
        console.error(error);
    }
};
const getHistoryProductList = async () => {
    uni.showLoading({
        title: t("加载中")
    });
    try {
        const result = await historyProductList();
        historyList.value = result;
    } catch (error) {
        console.error(error);
    } finally {
        uni.hideLoading();
        loading.value = false;
    }
};
getHistoryProductList();
const handleLink = (id: number) => {
    uni.redirectTo({
        url: "/pages/product/index?id=" + id
    });
};
</script>

<style lang="scss" scoped>
.history-product {
    padding: 25rpx 25rpx;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 25rpx;

    .history-product-item {
        background-color: #fff;
        border-radius: 20rpx;
        overflow: hidden;
        padding: 20rpx;
        position: relative;

        .item-btn {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: 2;
            .btn-box {
                position: absolute;
                right: 10rpx;
                top: 10rpx;
            }
        }

        .history-product-item-top {
            .img-box {
                width: 100%;
            }
        }

        .history-product-item-bottom {
            .detail {
                font-weight: bold;
                color: #2a3145;
                font-size: 26rpx;
                line-height: 40rpx;
                height: 80rpx;
                margin: 0 16rpx 10rpx;
            }

            .price {
                color: var(--general);
            }
        }
    }
}
.footer-box {
    height: 100%;

    .footer-text {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 30rpx;

        .num {
            color: var(--general);
            padding: 0 10rpx;
        }
    }

    .footer-edit {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 30rpx;

        .all-check {
            display: flex;
            align-items: center;
        }

        .edit-btn {
            display: flex;
        }
    }

    .btn {
        height: 65rpx;
        width: 160rpx;

        &:first-child {
            margin-right: 15rpx;
        }
    }
}
</style>
