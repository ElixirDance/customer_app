<template>
	<up-navbar title="站内搜索" @leftClick="onBack" leftIconColor="#000000" :fixed="false" bgColor="#ffffff" titleColor="#000000">
	</up-navbar>
	<view class="search-page">
		<!-- 搜索框 -->
		<view class="search-box">
			<up-search v-model="searchKeyword"
				placeholder="请输入搜索内容" radius="20" @change="handleSearch">
			</up-search>
		</view>

		<!-- 搜索结果 -->
		<view class="search-result" v-if="searchResult.length > 0">
			<view class="result-item" v-for="(item, index) in searchResult" :key="index" @click="navigateToPage(item)">
				<text class="item-title">{{ item.title }}</text>
				<text class="item-desc">{{ item.description }}</text>
			</view>
		</view>

		<!-- 无结果提示 -->
		<view class="no-result" v-else-if="searchKeyword">
			<text>没有找到相关内容</text>
		</view>

		<!-- 初始提示 -->
		<view class="initial-tip" v-else>
			<text>请输入关键词搜索功能</text>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref, reactive, onMounted } from 'vue';
	import { debounce } from 'lodash-es';
	
	function onBack() {
		uni.navigateBack()
	}

	// 搜索关键词
	const searchKeyword = ref('');

	// 搜索结果
	const searchResult = ref([]);

	// 站内功能列表数据
	const featuresList = reactive([{
			id: 1,
			title: '儿童档案管理',
			description: '创建和编辑儿童基本信息',
			path: '/pages/childManage/index'
		},
		{
			id: 2,
			title: '成长记录',
			description: '记录孩子的成长里程碑和重要事件',
			path: '/pages/growth-record'
		},
		{
			id: 3,
			title: '疫苗接种',
			description: '管理儿童疫苗接种计划和记录',
			path: '/pages/vaccination'
		},
		{
			id: 4,
			title: '健康数据',
			description: '记录和查看儿童身高、体重等健康数据',
			path: '/pages/health-data'
		},
		{
			id: 5,
			title: '教育资源',
			description: '获取适合儿童的教育内容和活动',
			path: '/pages/education-resources'
		},
		{
			id: 6,
			title: '专家咨询',
			description: '在线咨询儿童健康和教育专家',
			path: '/pages/expert-consultation'
		},
		{
			id: 7,
			title: '社区交流',
			description: '与其他家长交流育儿经验',
			path: '/pages/community'
		},
		{
			id: 8,
			title: '设置中心',
			description: '管理个人设置和偏好',
			path: '/pages/settings'
		}
	]);

	// 搜索功能 - 使用防抖优化性能
	const performSearch = debounce((keyword) => {
		if (!keyword) {
			searchResult.value = [];
			return;
		}

		// 过滤匹配的功能项
		searchResult.value = featuresList.filter(item =>
			item.title.toLowerCase().includes(keyword.toLowerCase()) ||
			item.description.toLowerCase().includes(keyword.toLowerCase())
		);
	}, 300);

	// 处理搜索输入
	const handleSearch = () => {
		console.log(`searchKeyword.value`, searchKeyword.value);
		performSearch(searchKeyword.value);
	};

	// 跳转到对应页面
	const navigateToPage = (item) => {
		uni.navigateTo({
			url: item.path
		})
	};

	// 初始化
	onMounted(() => {
		// 页面加载时的初始化逻辑
	});
</script>

<style lang="scss" scoped>
	.search-page {
		padding: 20rpx;
		background-color: #f8f9fa;
		height: 100vh;

		.search-box {
			padding: 10rpx 0;
		}

		.search-result {
			margin-top: 20rpx;

			.result-item {
				background-color: #fff;
				border-radius: 10rpx;
				padding: 20rpx;
				margin-bottom: 15rpx;
				box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);

				.item-title {
					font-size: 32rpx;
					font-weight: 500;
					color: #333;
				}

				.item-desc {
					font-size: 26rpx;
					color: #666;
					margin-top: 8rpx;
				}
			}
		}

		.no-result,
		.initial-tip {
			margin-top: 80rpx;
			text-align: center;
			color: #999;
			font-size: 28rpx;
		}
	}
</style>