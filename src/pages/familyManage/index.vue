<template>
  <view class="family-management">
    <!-- 标题栏 -->
   <!-- <view class="header">
      <text class="back-btn" @click="onBack">←</text>
      <text class="title">家庭管理</text>
    </view -->
	
	<up-navbar title="家庭管理" @leftClick="onBack" leftIconColor="#000000" :fixed="false" :border="false" bgColor="#ffffff" titleColor="#000000">
	</up-navbar>

    <!-- 家庭信息区域 -->
    <view class="family-info">
      <text class="family-phone">185****9053的家庭(本人)</text>
    </view>

    <!-- 孩子区域 -->
    <view class="child-section">
      <text class="section-title">孩子</text>
      <view class="child-list">
		<view class="child-item" v-for="(child, index) in childList" :key="index" @click="onUpdateChild">
		  <view class="avatar-container">
		    <image :src="child.avatar" class="child-avatar" />
		    <text class="current-tag" v-if="child.isCurrent">当前</text>
		  </view>
		  <text class="child-name">{{ child.name }}</text>
		</view>
		
		<view class="add-child" @click="onAddChild">
		  <view class="add-circle">
		    <text class="add-icon">+</text>
		  </view>
		  <text class="add-text">添加宝贝</text>
		</view>
      </view>
    </view>

    <!-- 家长区域 -->
	<view class="parent-section" @click="onShowParents">
	  <text class="section-title">家长</text>
	  <view class="parent-info">
	    <text class="parent-count">共{{ parentCount }}人</text>
	    <up-icon name="arrow-right" size="24rpx" color="#999" class="arrow-icon" />
	  </view>
	</view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 模拟孩子数据，实际可从接口获取
const childList = ref([
  {
    avatar: 'https://picsum.photos/200?random=child' + Date.now() % 10, // 实际替换为真实头像地址
    isCurrent: true,
    name: '朗哥'
  }
]);
// 模拟家长人数，实际可从接口获取
const parentCount = ref(2);

// 返回上一页
const onBack = () => {
  uni.navigateBack();
};

const onUpdateChild = () => {}

// 添加孩子逻辑，可扩展调接口等
const onAddChild = () => {
  uni.navigateTo({
  	url: "/pages/childArchive/index"
  })
};

// 查看家长列表逻辑，可扩展跳转新页面等
const onShowParents = () => {
  uni.showToast({
    title: '点击查看家长列表，可扩展实现跳转逻辑',
    icon: 'none'
  });
};
</script>

<style lang="scss" scoped>
.family-management {
  background-color: #f5f5f5;
  min-height: 100vh;

  .header {
    display: flex;
    align-items: center;
    padding: 20rpx 30rpx;
    background-color: #fff;

    .back-btn {
      font-size: 36rpx;
      color: #333;
      margin-right: 20rpx;
    }

    .title {
      font-size: 32rpx;
      color: #333;
      font-weight: bold;
    }
  }

  .family-info {
    background-color: #fff;
    margin: 20rpx 30rpx;
    padding: 20rpx;
    border-radius: 10rpx;

    .family-phone {
      font-size: 28rpx;
      color: #666;
    }
  }

  .child-section,
  .parent-section {
    background-color: #fff;
    margin: 20rpx 30rpx;
    padding: 20rpx;
    border-radius: 10rpx;

    .section-title {
      font-size: 30rpx;
      color: #333;
      font-weight: bold;
      margin: 10rpx 0;
    }
  }

  .child-list {
    display: flex;
    flex-wrap: wrap;
	margin-top: 40rpx;
 
	.child-item {
	  width: 160rpx;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  margin-right: 40rpx;
	  
	  .avatar-container {
	    position: relative;
	    margin-bottom: 10rpx;
	  }
	
	  .child-avatar {
	    width: 120rpx;
	    height: 120rpx;
	    border-radius: 50%;
	  }
	
	  .current-tag {
	    font-size: 24rpx;
	    color: #ff5722;
	    background-color: #fff8f5;
	    padding: 4rpx 10rpx;
	    border-radius: 6rpx;
	    position: absolute; // 改为绝对定位
	    bottom: 10rpx; // 距离底部10rpx
	    right: -20rpx; // 距离右侧10rpx
	    z-index: 1; // 提升层级确保浮动
	    box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1); // 添加阴影增强浮动效果
	  }
	
	  .child-name {
	    font-size: 26rpx;
	    color: #333;
	  }
	}
	
	.add-child {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  
	  .add-icon {
	    font-size: 40rpx;
	    color: #ccc;
	    transition: color 0.3s;
	  }
	  
	  .add-text {
	    font-size: 26rpx;
	    color: #999;
	  }
	}
	
	.add-circle {
	  width: 120rpx;
	  height: 120rpx;
	  border: 2rpx dashed #ccc;
	  border-radius: 50%;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  margin-bottom: 10rpx;
	  transition: all 0.3s; /* 点击动效过渡 */
	}
	
	.add-circle:active {
	  transform: scale(0.95);
	  border-color: #409EFF;
	}
	
	.add-circle:active .add-icon {
	  color: #409EFF;
	}
  }

  .parent-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .section-title {
      font-size: 30rpx;
      color: #333;
      font-weight: bold;
    }
    
    .parent-info {
      display: flex;
      align-items: center;
    }
    
    .parent-count {
      font-size: 28rpx;
      color: #999;
      margin-right: 10rpx;
    }
    
    .arrow-icon {
      margin-left: 6rpx;
    }
  }
}
</style>