<template>
  <view class="chat-container">
    <up-navbar title="语音聊天" @leftClick="onBack" leftIconColor="#000000" :fixed="false" bgColor="#ffffff" titleColor="#000000">
    </up-navbar>
    <!-- 聊天记录区 -->
    <scroll-view class="chat-list" :scroll-y="true" :scroll-top="scrollTop" scroll-with-animation @scroll="onScrollChange">
      <view v-if="isLoading" class="loading-more">加载中...</view>
      <view v-for="(msg, idx) in chatList" :key="msg.id || idx" :class="['chat-item', msg.role]">
        <view class="bubble-wrap">
          <view class="msg-time">{{formatTime(msg.time)}}</view>
          <view class="voice-row">
            <view class="avatar">
              <image v-if="msg.role==='parent'" :src="parentAvatar" class="avatar-img" />
              <image v-else :src="childAvatar" class="avatar-img" />
            </view>
            <view class="voice-bubble" @tap="() => playVoice(msg)" :class="{playing: msg.playing}">
              <image class="voice-icon" :src="msg.playing ? playingVoiceIcon : normalVoiceIcon" />
              <text class="voice-duration">{{msg.duration}}''</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    <!-- 录音动画/提示 -->
    <view v-if="recordAnim || recordCancel || recordTooShort" class="record-modal">
      <view class="record-content" :class="{cancel: recordCancel, short: recordTooShort}">
        <view v-if="recordTooShort">说话时间太短</view>
        <view v-else-if="recordCancel">松开手指，取消发送</view>
        <view class="recording-status" style="display: flex;align-items: center;" v-else>
          <image :src="recordingGif" class="recording-icon" style="width:50rpx;height:50rpx;margin-right: 10rpx;" />
          <view class="recording-text">正在录音...</view>
        </view>
      </view>
    </view>
    <!-- 语音输入区 -->
    <view class="voice-bar">
      <button class="voice-btn" :class="{active: recordBtnActive}" @touchstart="startRecord" @touchend="stopRecord" @touchcancel="cancelRecord" @touchmove="moveRecord">{{recordBtnText}}</button>
    </view>
    <!-- 权限提示弹窗 -->
    <view v-if="showAuthModal" class="auth-modal">
      <view class="auth-content">
        <text>需要录音权限才能发送语音消息，请在设置中开启麦克风权限。</text>
        <button @tap="closeAuthModal">知道了</button>
      </view>
    </view>
  </view>
</template>

<script lang='ts' setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import parentAvatar from '@/static/images/father.png';
import childAvatar from '@/static/images/child.png';
import normalVoiceIcon from '@/static/images/voice.png';
import playingVoiceIcon from '@/static/images/voice_playing.gif';
import recordingGif from '@/static/images/recording.gif';
import { getChatMessage } from '@/api/chat/chat';

// 图片资源引用

// 状态管理
const chatList = ref<any[]>([]);
const scrollTop = ref(0);
const showAuthModal = ref(false);
const recorderManager = ref(null);
const innerAudioContext = ref(null);
const recording = ref(false);
const recordStartTime = ref(0);
const recordCancel = ref(false);
const recordTooShort = ref(false);
const recordAnim = ref(false);
const recordBtnText = ref('按住说话');
const recordBtnActive = ref(false);
const uploading = ref(false);

// 分页相关
const pageSize = 20;
const firstId = ref(-1);
const isLoading = ref(false);
const hasMore = ref(true);
const lastScrollTop = ref(0);
const isFirstLoad = ref(true);

function onBack() {
	uni.navigateBack()
}

// 检查录音权限
const checkRecordAuth = async () => {
  // #ifdef APP-PLUS
  return new Promise((resolve) => {
    const permission = 'RECORD';
    plus.android.requestPermissions(
      [permission],
      function(resultObj) {
        if (resultObj.granted.length === 1) {
          resolve(true);
        } else {
          showAuthModal.value = true;
          resolve(false);
        }
      },
      function(error) {
        showAuthModal.value = true;
        resolve(false);
      }
    );
  });
  // #endif

  // #ifdef MP-WEIXIN
  return new Promise(resolve => {
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success: () => resolve(true),
            fail: () => {
              showAuthModal.value = true;
              resolve(false);
            }
          });
        } else {
          resolve(true);
        }
      },
      fail: () => {
        showAuthModal.value = true;
        resolve(false);
      }
    });
  });
  // #endif

  // #ifdef H5
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    return true;
  } catch (e) {
    showAuthModal.value = true;
    return false;
  }
  // #endif

  return true;
};

// 上传语音文件到服务端
const uploadVoiceFile = async (tempFilePath: string, duration: number) => {
  try {
    uploading.value = true;
    uni.showLoading({
      title: '发送中...',
      mask: true
    });

    // 上传文件
    const uploadRes = await uni.uploadFile({
      url: ' http://192.168.3.11:3000/api/chat/add', // 替换为您的实际上传接口
      filePath: tempFilePath,
      name: 'file',
      formData: {
        duration: duration,
        type: 'voice',
        to: 2,
        role: "parent",
        time: Date.now(),
      }
    });

    if (uploadRes.statusCode === 200) {
      const result = JSON.parse(uploadRes.data);
      if (result.code === 0) {
        // 上传成功，添加消息
        addVoiceMsg('parent', duration, result.data);
      } else {
        throw new Error(result.message || '上传失败');
      }
    } else {
      throw new Error('上传失败');
    }
  } catch (error) {
    console.error('上传语音失败：', error);
    uni.showToast({
      title: '发送失败，请重试',
      icon: 'none'
    });
  } finally {
    uploading.value = false;
    uni.hideLoading();
  }
};

// 初始化录音管理器
const initRecorder = () => {
  recorderManager.value = uni.getRecorderManager();
  innerAudioContext.value = uni.createInnerAudioContext();
  innerAudioContext.value.autoplay = false;

  // 监听录音结束事件
  recorderManager.value.onStop((res) => {
    const duration = Math.round((Date.now() - recordStartTime.value) / 1000);
    if (!recordCancel.value && duration >= 1) {
      // 上传语音文件
      uploadVoiceFile(res.tempFilePath, duration);
    }
  });

  // 监听录音错误事件
  recorderManager.value.onError((res) => {
    uni.showToast({
      title: '录音失败',
      icon: 'none'
    });
    console.error('录音错误：', res);
  });
};

// 开始录音
const startRecord = async () => {
  if (recording.value || uploading.value) return;
  
  recording.value = true;
  recordCancel.value = false;
  recordTooShort.value = false;
  recordAnim.value = true;
  recordBtnText.value = '松开结束';
  recordBtnActive.value = true;
  recordStartTime.value = Date.now();

  // 开始录音
  recorderManager.value.start({
    duration: 60000,
    sampleRate: 44100,
    numberOfChannels: 1,
    encodeBitRate: 192000,
    format: 'mp3'
  });
};

// 录音时手指上滑取消
const moveRecord = (e) => {
  // 判断是否上滑（以y轴为例，实际可根据页面高度动态调整）
  if (e.touches && e.touches[0].clientY < uni.getSystemInfoSync().windowHeight - uni.upx2px(300)) {
    recordCancel.value = true;
    recordBtnText.value = '松开手指，取消发送';
  } else {
    recordCancel.value = false;
    recordBtnText.value = '松开结束';
  }
};

// 停止录音并发送
const stopRecord = () => {
  if (!recording.value || uploading.value) return;
  recording.value = false;
  recordAnim.value = false;
  recordBtnActive.value = false;
  recordBtnText.value = '按住说话';
  const duration = Math.round((Date.now() - recordStartTime.value) / 1000);

  if (recordCancel.value) {
    uni.showToast({ title: '已取消', icon: 'none' });
    return;
  }

  if (duration < 1) {
    recordTooShort.value = true;
    setTimeout(() => { recordTooShort.value = false; }, 1200);
    uni.showToast({ title: '说话时间太短', icon: 'none' });
    return;
  }

  recorderManager.value.stop();
};

// 取消录音
const cancelRecord = () => {
  if (uploading.value) return;
  recording.value = false;
  recordAnim.value = false;
  recordBtnActive.value = false;
  recordBtnText.value = '按住说话';
  recorderManager.value.stop();
};

// 添加语音消息
const addVoiceMsg = (role: string, duration: number, url: string) => {
  const now = new Date();
  const time = now.getFullYear() + '-' +
    String(now.getMonth() + 1).padStart(2, '0') + '-' +
    String(now.getDate()).padStart(2, '0') + ' ' +
    String(now.getHours()).padStart(2, '0') + ':' +
    String(now.getMinutes()).padStart(2, '0');
  chatList.value.push({ role, duration, url, playing: false, time });
  nextTick(scrollToBottom);
};

// 播放语音
const playVoice = (msg) => {
  if (!msg.url) {
    uni.showToast({
      title: '语音文件不存在',
      icon: 'none'
    });
    return;
  }

  chatList.value.forEach(m => m.playing = false);
  msg.playing = true;

  if (innerAudioContext.value) {
    innerAudioContext.value.stop();
  }
  
  innerAudioContext.value.src = msg.url;
  innerAudioContext.value.play();
  
  innerAudioContext.value.onEnded(() => {
    msg.playing = false;
  });
  
  innerAudioContext.value.onError((res) => {
    console.error('播放错误：', res);
    msg.playing = false;
    uni.showToast({
      title: '播放失败',
      icon: 'none'
    });
  });
};

// 滚动到底部
const scrollToBottom = () => {
  scrollTop.value = 99999
};

// 关闭权限提示
const closeAuthModal = () => {
  showAuthModal.value = false
};

// 格式化时间
const formatTime = (time) => {
  // 只显示时:分
  if (!time) return '';
  if (time.length > 5) return time.slice(-5);
  return time;
};

// 获取聊天记录
const getChatHistory = async () => {
  if (isLoading.value || !hasMore.value) return;
  
  try {
    isLoading.value = true;
    const result = await getChatMessage({
      firstId: firstId.value,
      sortOrder: 'desc',
      pageSize
    });
    
    if (result.data && result.data.length > 0) {
      // 将消息转换为聊天列表格式
      const newMessages = result.data.map(msg => ({
        role: msg.senderType === 1 ? 'parent' : 'child',
        duration: msg.content?.duration || 0,
        url: msg.content?.url || '',
        playing: false,
        time: msg.createTime,
        id: msg.id
      }));
      
      // 更新firstId为最早消息的id
      firstId.value = newMessages[newMessages.length - 1].id;
      
      // 如果是首次加载，直接赋值；否则将新消息添加到列表前面
      if (isFirstLoad.value) {
        chatList.value = newMessages;
        isFirstLoad.value = false;
        nextTick(scrollToBottom);
      } else {
        chatList.value = [...newMessages, ...chatList.value];
        // 恢复滚动位置
        nextTick(() => {
          if (lastScrollTop.value) {
            scrollTop.value = lastScrollTop.value;
          }
        });
      }
      
      // 判断是否还有更多数据
      hasMore.value = result.data.length === pageSize;
    } else {
      hasMore.value = false;
    }
  } catch (error) {
    console.error('获取聊天记录失败：', error);
    uni.showToast({
      title: '获取聊天记录失败',
      icon: 'none'
    });
  } finally {
    isLoading.value = false;
  }
};

// 监听滚动事件
const onScrollChange = (e: any) => {
  if (e.detail.scrollTop === 0 && hasMore.value) {
    lastScrollTop.value = e.detail.scrollHeight;
    getChatHistory();
  }
};

// 生命周期钩子
onMounted(() => {
  initRecorder();
  getChatHistory(); // 获取聊天记录
});

onUnmounted(() => {
  if (recorderManager.value) {
    recorderManager.value.stop();
  }
  if (innerAudioContext.value) {
    innerAudioContext.value.destroy();
  }
});
</script>

<style lang="scss" scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f6fa;
}

.loading-more {
  text-align: center;
  padding: 20rpx 0;
  color: #999;
  font-size: 24rpx;
}

.chat-list {
  flex: 1;
  overflow: hidden;
  padding: 20rpx 0 20rpx 0;
}
.chat-item {
  display: flex;
  align-items: flex-end;
  margin: 24rpx 24rpx 0 24rpx;
  min-height: 100rpx;
  &.parent {
    flex-direction: row-reverse;
    .bubble-wrap {
      align-items: flex-end;
    }
  }
  &.child {
    flex-direction: row;
    .bubble-wrap {
      align-items: flex-start;
    }
  }
}
.avatar {
  width: 80rpx;
  height: 80rpx;
  margin: 0 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #eee;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.08);
}
.bubble-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.msg-time {
  font-size: 22rpx;
  color: #bbb;
  margin-bottom: 8rpx;
  text-align: center;
  width: 100%;
}
.voice-row {
  display: flex;
  align-items: flex-end;
}
.voice-bubble {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 24rpx;
  padding: 22rpx 32rpx;
  min-width: 120rpx;
  max-width: 60vw;
  box-shadow: 0 4rpx 16rpx rgba(64,158,255,0.08);
  border: 1rpx solid #e0e0e0;
  cursor: pointer;
  transition: box-shadow 0.2s;
  .voice-icon {
    width: 40rpx;
    height: 40rpx;
    margin-right: 16rpx;
  }
  .voice-duration {
    font-size: 32rpx;
    color: #409eff;
    font-weight: bold;
  }
  &.playing {
    box-shadow: 0 0 0 4rpx #aee2ff;
    border-color: #409eff;
    background: #eaf6ff;
  }
}
.voice-bar {
  padding: 32rpx 0 32rpx 0;
  background: #fff;
  box-shadow: 0 -2rpx 12rpx rgba(0,0,0,0.04);
  display: flex;
  justify-content: center;
}
.voice-btn {
  background: #409eff;
  color: #fff;
  font-size: 32rpx;
  border-radius: 40rpx;
  padding: 0 80rpx;
  height: 90rpx;
  line-height: 90rpx;
  box-shadow: 0 4rpx 16rpx rgba(64,158,255,0.12);
  font-weight: bold;
  letter-spacing: 2rpx;
  transition: background 0.2s;
}
.voice-btn.active {
  background: #2b7fd7;
}
.auth-modal {
  position: fixed;
  left: 0; right: 0; top: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
}
.auth-content {
  background: #fff;
  border-radius: 16rpx;
  padding: 48rpx 40rpx;
  text-align: center;
  font-size: 28rpx;
  color: #333;
}
.auth-content button {
  margin-top: 32rpx;
  background: #409eff;
  color: #fff;
  border-radius: 12rpx;
  font-size: 28rpx;
  padding: 0 40rpx;
  height: 72rpx;
  line-height: 72rpx;
}
.record-modal {
  position: fixed;
  left: 0; right: 0; top: 0; bottom: 0;
  background: rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.record-content {
  background: #fff;
  border-radius: 20rpx;
  padding: 48rpx 60rpx;
  font-size: 30rpx;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4rpx 24rpx rgba(64,158,255,0.12);
  
  .recording-status {
    display: flex;
    align-items: center;
  }
  .recording-icon {
    width: 50rpx;
    height: 50rpx;
    margin-right: 10rpx;
  }
  .recording-text {
    font-size: 30rpx;
    color: #333;
  }
}
.record-content.cancel {
  color: #fff;
  background: #ff4d4f;
}
.record-content.short {
  color: #fff;
  background: #ffb300;
}
</style>