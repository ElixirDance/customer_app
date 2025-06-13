<template>
  <view class="parent-management">
    <!-- 导航栏：支持返回、编辑/完成切换 -->
    <up-navbar 
      title="家长管理" 
      @leftClick="onBack" 
      leftIconColor="#000000" 
      :fixed="false" 
      :border="false" 
      bgColor="#ffffff" 
      titleColor="#000000"
    >
      <!-- 右侧：编辑/完成按钮 -->
      <template #right>
        <text 
          class="edit-btn" 
          @click="toggleEditMode"
        >
          {{ isEditMode ? '完成' : '编辑' }}
        </text>
      </template>
    </up-navbar>

    <!-- 家长列表 -->
    <view class="parent-list">
      <view 
        class="parent-item" 
        v-for="(parent, index) in parentList" 
        :key="parent.id"
      >
        <!-- 头像 -->
        <image 
          :src="parent.avatar" 
          class="parent-avatar" 
        />

        <!-- 信息区域 -->
        <view class="parent-info">
          <view class="name-role">
            <!-- 姓名 + 本人/管理员标签 -->
            <text class="parent-name">
              {{ parent.phone }}
            </text>
            <text 
              class="role-tag" 
              v-if="parent.isAdmin"
            >
              (本人) 家庭管理员
            </text>
          </view>
          <!-- 手机号 -->
          <text class="parent-subphone">
            {{ parent.phone }}
          </text>
        </view>

        <!-- 编辑模式：删除按钮 -->
		<up-icon v-if="isEditMode && !parent.isAdmin" @click="confirmDelete(parent, index)" name="minus-circle-fill" size="48rpx" color="#ff4d4f" />
      </view>
    </view>

    <!-- 邀请更多家长 -->
    <view class="invite-more" @click="onWechatInvite">
	  <up-icon name="plus-circle" size="28rpx" />
      <text class="invite-text">微信邀请更多家长</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { deleteParent, getParents } from '@/api/parent/parent';
import type { Parent } from '@/types/parent/parent';

const parentList = ref<Parent[]>([]);

// 编辑模式
const isEditMode = ref(false);

// 返回上一页
const onBack = () => {
  uni.navigateBack();
};

// 切换编辑模式
const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value;
};

// 微信邀请更多家长（模拟）
const onWechatInvite = () => {
  // uni.showToast({
  //   title: '点击微信邀请更多家长，可扩展实现邀请逻辑',
  //   icon: 'none',
  // });
  
  uni.share({
  	provider: "weixin",
  	scene: "WXSceneSession",
  	type: 1,
  	summary: "我正在使用HBuilderX开发uni-app，赶紧跟我一起来体验！",
  	success: function (res) {
  		console.log("success:" + JSON.stringify(res));
  	},
  	fail: function (err) {
  		console.log("fail:" + JSON.stringify(err));
  	}
  });

};

// 删除家长（确认弹窗）
const confirmDelete = (parent: Parent, index: number) => {
  uni.showModal({
    title: '确认删除',
    content: `是否删除家长 ${parent.phone}？`,
    success: async (res) => {
      if (res.confirm) {
        // 移除家长
		const response = await deleteParent({id: parent.id});
		if(response) {
			parentList.value.splice(index, 1);
			uni.showToast({
			  title: '删除成功',
			  icon: 'success',
			});
		}
      }
    },
  });
};

const loadDataOfParent = async () => {
	const response = await getParents();
	parentList.value = response;
}

onMounted(() => {
	loadDataOfParent()
})
</script>

<style lang="scss" scoped>
.parent-management {
  background-color: #f5f5f5;
  min-height: 100vh;
  // padding-top: calc(constant(safe-area-inset-top) + 88rpx);
  // padding-top: calc(env(safe-area-inset-top) + 88rpx);

  // 家长列表
  .parent-list {
    padding: 0 30rpx;
	margin-top: 20rpx;

    .parent-item {
      display: flex;
      align-items: center;
      background-color: #fff;
      border-radius: 10rpx;
      padding: 20rpx;
      margin-bottom: 20rpx;
	  justify-content: flex-start;

      // 头像
      .parent-avatar {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        margin-right: 20rpx;
      }

      // 信息区域
      .parent-info {
        display: flex;
        flex-direction: column;
		flex: 1;

        .name-role {
          display: flex;
          align-items: center;
          margin-bottom: 6rpx;

          .parent-name {
            font-size: 28rpx;
            color: #333;
            font-weight: bold;
          }

          .role-tag {
            font-size: 24rpx;
            color: #ffb700;
            margin-left: 10rpx;
          }
        }

        .parent-subphone {
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }

  // 邀请更多家长
  .invite-more {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    margin: 0 30rpx 20rpx 30rpx;
    padding: 20rpx;
    border-radius: 10rpx;

    .invite-icon {
      font-size: 32rpx;
      color: #999;
      margin-right: 10rpx;
    }

    .invite-text {
      font-size: 28rpx;
      color: #333;
	  margin-left: 10rpx;
    }
  }

  // 编辑按钮样式
  .edit-btn {
    font-size: 28rpx;
    color: #333;
    margin-right: 20rpx;
  }
}
</style>