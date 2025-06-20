<template>
  <tig-layout title="首页">
    <view class="home-container">
      <!-- 顶部搜索区域 -->
      <view class="search-section">
        <view class="search-box" @tap="goToSearch">
          <view class="search-input">
            <text class="search-icon">🔍</text>
            <text class="search-placeholder">搜索功能、课程、活动...</text>
          </view>
        </view>
      </view>

      <!-- 轮播图区域 -->
      <view class="banner-section">
        <swiper class="banner-swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500">
          <swiper-item v-for="(banner, index) in banners" :key="index" @tap="handleBannerClick(banner)">
            <image class="banner-image" :src="banner.image" mode="aspectFill" />
            <view class="banner-overlay">
              <text class="banner-title">{{ banner.title }}</text>
              <text class="banner-desc">{{ banner.description }}</text>
            </view>
          </swiper-item>
        </swiper>
      </view>

      <!-- 快捷功能网格 -->
      <view class="quick-access-section">
        <view class="section-title">
          <text class="title-text">快捷功能</text>
          <text class="title-desc">快速访问常用功能</text>
        </view>
        <view class="grid-container">
          <view v-for="(item, index) in quickAccessItems" :key="index" class="grid-item"
            @tap="navigateToPage(item.path)">
            <view class="item-icon">
              <text class="icon-text">{{ item.icon }}</text>
            </view>
            <text class="item-title">{{ item.title }}</text>
          </view>
        </view>
      </view>

      <!-- 推荐内容区域 -->
      <view class="recommend-section">
        <view class="section-title">
          <text class="title-text">推荐内容</text>
          <text class="title-desc">精选优质内容</text>
        </view>
        <scroll-view class="recommend-scroll" scroll-x="true">
          <view class="recommend-list">
            <view v-for="(item, index) in recommendItems" :key="index" class="recommend-item"
              @tap="handleRecommendClick(item)">
              <image class="recommend-image" :src="item.image" mode="aspectFill" />
              <view class="recommend-info">
                <text class="recommend-title">{{ item.title }}</text>
                <text class="recommend-desc">{{ item.description }}</text>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 最近使用 -->
      <view v-if="recentItems.length > 0" class="recent-section">
        <view class="section-title">
          <text class="title-text">最近使用</text>
          <text class="title-desc">快速访问最近功能</text>
        </view>
        <view class="recent-list">
          <view v-for="(item, index) in recentItems" :key="index" class="recent-item" @tap="navigateToPage(item.path)">
            <view class="recent-icon">
              <text class="icon-text">{{ item.icon }}</text>
            </view>
            <view class="recent-info">
              <text class="recent-title">{{ item.title }}</text>
              <text class="recent-time">{{ item.time }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部占位 -->
      <view class="bottom-spacer"></view>
    </view>
  </tig-layout>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

// 定义接口类型
interface BannerItem {
  id: number;
  title: string;
  description: string;
  image: string;
  path: string;
}

interface QuickAccessItem {
  title: string;
  icon: string;
  path: string;
  description: string;
}

interface RecommendItem {
  id: number;
  title: string;
  description: string;
  image: string;
  type: string;
  path: string;
}

interface RecentItem extends QuickAccessItem {
  time: string;
}

// 轮播图数据
const banners = ref<BannerItem[]>([
  {
    id: 1,
    title: '智能教案生成',
    description: 'AI助力，轻松生成专业教案',
    image: '/static/images/banner1.jpg',
    path: '/pages/lessonPlan/index'
  },
  {
    id: 2,
    title: '儿童成长分析',
    description: '科学分析，助力儿童全面发展',
    image: '/static/images/banner2.jpg',
    path: '/pages/analytics/index'
  },
  {
    id: 3,
    title: 'AI智能助手',
    description: '24小时在线，解答育儿难题',
    image: '/static/images/banner3.jpg',
    path: '/pages/chatAI/index'
  }
]);

// 快捷功能网格 (4x2)
const quickAccessItems = ref<QuickAccessItem[]>([
  {
    title: '教案生成',
    icon: '📚',
    path: '/pages/lessonPlan/index',
    description: '智能生成教案和课件'
  },
  {
    title: 'AI助手',
    icon: '🤖',
    path: '/pages/chatAI/index',
    description: '智能问答和育儿指导'
  },
  {
    title: '儿童档案',
    icon: '👶',
    path: '/pages/childManage/index',
    description: '管理儿童基本信息'
  },
  {
    title: '成长分析',
    icon: '📊',
    path: '/pages/analytics/index',
    description: '分析儿童发展数据'
  },
  {
    title: '家庭管理',
    icon: '👨‍👩‍👧‍👦',
    path: '/pages/familyManage/index',
    description: '管理家庭成员信息'
  },
  {
    title: '语音聊天',
    icon: '🎤',
    path: '/pages/chat/index',
    description: '与儿童语音互动'
  },
  {
    title: '站内搜索',
    icon: '🔍',
    path: '/pages/siteSearch/index',
    description: '快速查找功能'
  },
  {
    title: '更多功能',
    icon: '➕',
    path: '/pages/mall/index/index',
    description: '商城和其他功能'
  }
]);

// 推荐内容
const recommendItems = ref<RecommendItem[]>([
  {
    id: 1,
    title: '小班语言活动',
    description: '培养语言表达能力',
    image: '/static/images/recommend1.jpg',
    type: 'lesson',
    path: '/pages/lessonPlan/index'
  },
  {
    id: 2,
    title: '中班艺术创作',
    description: '激发艺术创造力',
    image: '/static/images/recommend2.jpg',
    type: 'lesson',
    path: '/pages/lessonPlan/index'
  },
  {
    id: 3,
    title: '大班科学探究',
    description: '培养科学思维',
    image: '/static/images/recommend3.jpg',
    type: 'lesson',
    path: '/pages/lessonPlan/index'
  },
  {
    id: 4,
    title: '健康习惯养成',
    description: '建立良好生活习惯',
    image: '/static/images/recommend4.jpg',
    type: 'lesson',
    path: '/pages/lessonPlan/index'
  }
]);

// 最近使用
const recentItems = ref<RecentItem[]>([]);

// 跳转到搜索页面
const goToSearch = () => {
  uni.navigateTo({
    url: '/pages/siteSearch/index'
  });
};

// 跳转到指定页面
const navigateToPage = (path: string) => {
  if (path === '/pages/mall/index/index') {
    // 跳转到商城首页
    uni.switchTab({
      url: '/pages/mall/index/index'
    });
  } else {
    uni.navigateTo({
      url: path
    });
  }

  // 记录最近使用
  addToRecent(path);
};

// 处理轮播图点击
const handleBannerClick = (banner: BannerItem) => {
  navigateToPage(banner.path);
};

// 处理推荐内容点击
const handleRecommendClick = (item: RecommendItem) => {
  if (item.type === 'lesson') {
    // 跳转到教案生成页面，并预设参数
    uni.navigateTo({
      url: item.path
    });
  } else {
    navigateToPage(item.path);
  }
};

// 添加到最近使用
const addToRecent = (path: string) => {
  const item = quickAccessItems.value.find(item => item.path === path);
  if (!item) return;

  const recentItem: RecentItem = {
    ...item,
    time: formatTime(new Date())
  };

  // 检查是否已存在
  const existingIndex = recentItems.value.findIndex(item => item.path === path);
  if (existingIndex > -1) {
    recentItems.value.splice(existingIndex, 1);
  }

  // 添加到开头
  recentItems.value.unshift(recentItem);

  // 限制数量
  if (recentItems.value.length > 5) {
    recentItems.value = recentItems.value.slice(0, 5);
  }

  // 保存到本地存储
  uni.setStorageSync('recentItems', recentItems.value);
};

// 格式化时间
const formatTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 60000) {
    return '刚刚';
  } else if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`;
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`;
  } else {
    return `${date.getMonth() + 1}-${date.getDate()}`;
  }
};

// 页面加载时初始化
onMounted(() => {
  // 加载最近使用记录
  const recent = uni.getStorageSync('recentItems');
  if (recent) {
    recentItems.value = recent;
  }
});
</script>

<style lang="scss" scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 120rpx;
  /* 为tabbar留出空间 */
}

.search-section {
  padding: 40rpx 24rpx 20rpx;
}

.search-box {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50rpx;
  padding: 20rpx 30rpx;
  backdrop-filter: blur(10rpx);
}

.search-input {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.search-icon {
  font-size: 32rpx;
  color: #666;
}

.search-placeholder {
  font-size: 28rpx;
  color: #999;
  flex: 1;
}

.banner-section {
  padding: 0 24rpx 30rpx;
}

.banner-swiper {
  height: 300rpx;
  border-radius: 20rpx;
  overflow: hidden;
}

.banner-image {
  width: 100%;
  height: 100%;
}

.banner-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 40rpx 30rpx 30rpx;
  color: #fff;
}

.banner-title {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
}

.banner-desc {
  display: block;
  font-size: 24rpx;
  opacity: 0.9;
}

.quick-access-section {
  padding: 0 24rpx 40rpx;
}

.section-title {
  margin-bottom: 30rpx;
}

.title-text {
  display: block;
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
  margin-bottom: 8rpx;
}

.title-desc {
  display: block;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}

.grid-item {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16rpx;
  padding: 30rpx 20rpx;
  text-align: center;
  backdrop-filter: blur(10rpx);
  transition: transform 0.3s;

  &:active {
    transform: scale(0.95);
  }
}

.item-icon {
  margin-bottom: 16rpx;
}

.icon-text {
  font-size: 48rpx;
}

.item-title {
  font-size: 24rpx;
  color: #333;
  font-weight: 500;
}

.recommend-section {
  padding: 0 24rpx 40rpx;
}

.recommend-scroll {
  white-space: nowrap;
}

.recommend-list {
  display: flex;
  gap: 20rpx;
  padding-bottom: 10rpx;
}

.recommend-item {
  width: 280rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16rpx;
  overflow: hidden;
  backdrop-filter: blur(10rpx);
  flex-shrink: 0;
}

.recommend-image {
  width: 100%;
  height: 160rpx;
}

.recommend-info {
  padding: 20rpx;
}

.recommend-title {
  display: block;
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
  white-space: normal;
}

.recommend-desc {
  display: block;
  font-size: 22rpx;
  color: #666;
  white-space: normal;
}

.recent-section {
  padding: 0 24rpx;
}

.recent-list {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16rpx;
  overflow: hidden;
  backdrop-filter: blur(10rpx);
}

.recent-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background: rgba(0, 0, 0, 0.05);
  }
}

.recent-icon {
  margin-right: 20rpx;
}

.recent-info {
  flex: 1;
}

.recent-title {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 4rpx;
}

.recent-time {
  display: block;
  font-size: 22rpx;
  color: #999;
}

.bottom-spacer {
  height: 40rpx;
}
</style>
