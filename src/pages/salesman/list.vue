<template>
    <view>
        <tig-layout>
            <view class="sticky">
                <view class="salesman-menu">
                    <view class="search-box">
                        <view class="status-bar"></view>
                        <view class="search-input-box">
                            <view class="input">
                                <searchInput
                                    style="width: 100%"
                                    v-model="filterParams.productName"
                                    @confirm="handleSearch"
                                    @clear="handleSearchClear"
                                ></searchInput>
                            </view>
                        </view>
                    </view>
                    <view class="salesman-content">
                        <view
                            @click="onChangeTab(item)"
                            class="salesman-item"
                            :class="{ active: tabIndex === item.value }"
                            v-for="(item, index) in tabList"
                            :key="index"
                        >
                            <text>{{ $t(item.label) }}</text>
                            <view class="price-ico-box flex flex-column" v-show="item.value === 'productPrice'">
                                <text
                                    class="iconfont-h5 icon-shangjiantou price-icon"
                                    :class="{ order: tabIndex === 'productPrice' && item.sortOrder === 'asc' }"
                                ></text>
                                <text
                                    class="iconfont-h5 icon-xiajiantou price-icon"
                                    :class="{ order: tabIndex === 'productPrice' && item.sortOrder === 'desc' }"
                                ></text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="salesman-list">
                <block v-for="item in list" :key="item.productId">
                    <view class="salesman-list-item">
                        <view class="salesman-item-content" @click="handleLink(`/pages/salesman/detail?id=${item.productId}`)">
                            <view class="salesman-item-img">
                                <tig-image :src="item.picThumb"></tig-image>
                            </view>
                            <view class="salesman-item-text">
                                <view class="line2 name">{{ item.productName }}</view>
                                <view class="price"
                                    ><format-price :currencyStyle="{ 'font-size': '21rpx' }" :priceData="item.productPrice"></format-price
                                ></view>
                            </view>
                        </view>
                        <view class="salesman-item-btn">
                            <view class="salesman-item-btn-content" @click="handleShowShare(item)">
                                <image class="salesman-item-btn-icon" :src="staticResource('salesman/shareIcon.png')"></image>
                                <view class="salesman-item-btn-text"
                                    >{{ $t(Number(item.finalCommissionPrice) > 0 ? `预计可赚` : "立即分享") }}
                                    <format-price v-if="Number(item.finalCommissionPrice) > 0" :priceData="item.finalCommissionPrice"></format-price
                                ></view>
                            </view>
                        </view>
                    </view>
                </block>
            </view>
            <empty v-if="!loading && total === 0" :styles="{ width: '320rpx', height: '320rpx' }"></empty>
            <share v-model:showShareCard="showShare" :currentData="currentData"></share>
        </tig-layout>
    </view>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import searchInput from "./src/searchInput.vue";
import empty from "@/pages/salesman/src/empty.vue";
import share from "./src/share.vue";
import { salesmanProductList } from "@/api/salesman/salesman";
import type { SalesmanProductListFilterResult } from "@/types/salesman/salesman";
import { onLoad, onReachBottom } from "@dcloudio/uni-app";
import { staticResource, isB2B } from "@/utils";
import { useSaveTopBoxHeight } from "@/hooks";
import { useConfigStore } from "@/store/config";
import { useUserStore } from "@/store/user";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const configStore = useConfigStore();
const userStore = useUserStore();
const { height, contentHeight, contentWidth, statusBarHeight } = useSaveTopBoxHeight(60);
const filterParams = reactive({
    productName: "",
    sortField: "addTime",
    sortOrder: "desc",
    page: 1,
    pageSize: 15
});
const total = ref(0);
const tabIndex = ref("addTime");
const tabList = ref([
    // {
    //     label: "佣金",
    //     value: "finalCommissionPrice"
    // },
    {
        label: "最新",
        value: "addTime"
    },
    {
        label: "销量",
        value: "virtualSales"
    },
    {
        label: "价格",
        value: "productPrice",
        sortOrder: "desc"
    }
]);
const resetList = () => {
    filterParams.page = 1;
    filterParams.sortOrder = "desc";
    list.value = [];
};
const onChangeTab = (item: any) => {
    resetList();
    if (item.value == "productPrice") {
        item.sortOrder = item.sortOrder === "desc" ? "asc" : "desc";
        filterParams.sortOrder = item.sortOrder;
    } else if (item.value === filterParams.sortField) {
        return;
    }
    tabIndex.value = item.value;
    filterParams.sortField = item.value;
    getSalesmanProductList();
};

const handleSearchClear = () => {
    filterParams.productName = "";
    resetList();
    getSalesmanProductList();
};
const handleSearch = (value: string) => {
    resetList();
    getSalesmanProductList();
};

const loading = ref(false);
const list = ref<SalesmanProductListFilterResult[]>([]);

const getSalesmanProductList = async () => {
    loading.value = true;
    try {
        const result = await salesmanProductList(filterParams);
        list.value = [...list.value, ...result.records];
        total.value = result.total;
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};

const currentData = ref<SalesmanProductListFilterResult>({} as SalesmanProductListFilterResult);
const showShare = ref(false);
const handleShowShare = (data: SalesmanProductListFilterResult) => {
    if (isB2B() && configStore.isIdentity === 1) {
        let str = "登录后查看";
        if (Object.keys(userStore.userInfo).length > 0) {
            str = "实名后查看";
        }
        uni.showToast({
            title: t(str),
            icon: "none"
        });
        return;
    }

    showShare.value = true;
    currentData.value = data;
};

const handleLink = (url: string) => {
    uni.navigateTo({
        url: url
    });
};

onLoad(() => {
    getSalesmanProductList();
});
onReachBottom(() => {
    if (filterParams.page < Math.ceil(total.value / filterParams.pageSize)) {
        filterParams.page++;
        getSalesmanProductList();
    }
});
</script>

<style lang="scss" scoped>
.sticky {
    position: sticky;
    z-index: 50;
    top: 0;
}

.search-box {
    background-color: #fff;
    height: v-bind("height + 'px'");
    .status-bar {
        height: v-bind("statusBarHeight + 'px'");
    }
    .search-input-box {
        height: v-bind("contentHeight + 'px'");
        width: v-bind("contentWidth");
        display: flex;
        padding: 0 25rpx;
        .input {
            display: flex;
            align-items: center;
            width: 100%;
        }
    }
}

.salesman-menu {
    background-color: #fff;

    z-index: 88;
    position: relative;
    box-shadow: 0 0 10px rgba(125, 126, 128, 0.16);

    .salesman-content {
        padding: 20rpx;
        display: flex;

        .salesman-item {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 26rpx;
            color: #646566;

            &.active {
                color: rgb(255, 114, 13);
            }

            .price-icon {
                font-size: 10rpx;
                color: #969799;
                padding-left: 5rpx;

                &.order {
                    color: rgb(255, 114, 13);
                }

                &:first-child {
                    padding-bottom: 5rpx;
                }
            }
        }
    }
}
.salesman-list {
    padding: 20rpx;

    .salesman-list-item {
        background-color: #fff;
        border-radius: 10rpx;
        padding: 20rpx;
        margin-bottom: 20rpx;

        &:last-child {
            margin-bottom: 0;
        }

        .salesman-item-content {
            display: flex;

            .salesman-item-img {
                width: 150rpx;
                height: 150rpx;
                border-radius: 10rpx;
                overflow: hidden;
                margin-right: 20rpx;
            }

            .salesman-item-text {
                width: calc(100% - 170rpx);
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .name {
                    font-size: 26rpx;
                }
                .price {
                    font-size: 28rpx;
                }
            }
        }

        .salesman-item-btn {
            display: flex;
            justify-content: flex-end;
            .salesman-item-btn-content {
                height: 50rpx;
                padding: 0 15rpx;
                border-radius: 30rpx;
                background: linear-gradient(135deg, #ffaa1e, #ff720d);
                display: flex;
                align-items: center;
                justify-content: center;
                color: #fff;
                font-size: 24rpx;
                .salesman-item-btn-icon {
                    width: 25rpx;
                    height: 25rpx;
                }
                .salesman-item-btn-text {
                    padding-left: 10rpx;
                }
            }
        }
    }
}
</style>
