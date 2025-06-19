<template>
  <view class="chat-ai-container">
    <up-navbar title="AI聊天" @leftClick="onBack" leftIconColor="#000000" :fixed="false" bgColor="#ffffff" titleColor="#000000">
    </up-navbar>
    <!-- 顶部提示 -->
    <view class="ai-tip" :class="{ 'ai-tip-hide': !showAiTip }">
      请输入您的育儿问题，机器人将结合儿童行为数据为您提供科学个性化建议（不支持医学类问题咨询）。
    </view>
    <!-- 对话区 -->
    <scroll-view class="chat-list" :scroll-y="true" :scroll-top="scrollTop" scroll-with-animation @scroll="onScroll" :scroll-into-view="scrollIntoView">
      <view v-for="(msg, idx) in chatList" :key="idx" :class="['chat-item', msg.role]">
        <view class="avatar">
          <image v-if="msg.role === 'user'" :src="userAvatar" class="avatar-img" />
          <image v-else :src="aiAvatar" class="avatar-img" />
        </view>
        <view class="msg-content">{{ msg.content }}</view>
      </view>
      <!-- 底部占位元素，确保有足够的内容高度 -->
      <view class="bottom-spacer" :id="'msg-' + (chatList.length - 1)"></view>
    </scroll-view>
    <!-- 输入区 -->
    <view class="input-bar">
      <input class="input" :class="{ 'input-disabled': isAiResponding }" v-model="inputValue" placeholder="请输入您的育儿问题..." @confirm="sendMsg" :disabled="isAiResponding" />
      <button class="send-btn" :class="{ 'send-btn-disabled': isAiResponding }" @tap="sendMsg" :disabled="!inputValue.trim() || isAiResponding">
        {{ isAiResponding ? 'AI回复中...' : '发送' }}
      </button>
    </view>
    <view class="input-bar-box">
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick, onUnmounted } from 'vue';
// 图片资源引用
import userAvatar from '@/static/images/user.png';
import aiAvatar from '@/static/images/robot.png';

// 状态管理
const inputValue = ref('');
const chatList = ref<any[]>([
  { role: 'ai', content: '您好，我是智能育儿助手，请问有什么育儿问题需要咨询？' }
]);
const scrollTop = ref(0);
const scrollIntoView = ref(''); // 新增：用于scroll-into-view
const showAiTip = ref(true); // 控制AI提示的显示状态
let ws: UniApp.SocketTask | null = null;
const WS_URL = 'ws://192.168.3.11:3000';
let currentAiMessageIndex = -1;
let typingTimer: number | null = null;
let firstTextTimeout: number | null = null;
const isAiResponding = ref(false); // 新增：跟踪AI是否正在回复中
const userScrolling = ref(false); // 新增：跟踪用户是否正在滚动

// 打字机效果相关
const typingSpeed = 50; // 打字速度（毫秒/字符）
let currentTypingText = '';
let pendingText = '';
// 新增：用于缓存首包内容
let firstTextBuffer: string[] = [];

// 打字机效果函数
const typeText = () => {
  if (pendingText.length === 0) {
    if (typingTimer) {
      clearInterval(typingTimer);
      typingTimer = null;
    }
    // 打字结束时检查是否完全回复完成
    if (!isAiResponding.value) {
      // AI完全回复完成，解除禁用状态
    }
    // 打字结束时滚动到底部
    nextTick(() => {
      scrollToBottom();
    });
    return;
  }

  currentTypingText += pendingText[0];
  pendingText = pendingText.slice(1);
  
  if (currentAiMessageIndex >= 0) {
    chatList.value[currentAiMessageIndex].content = currentTypingText;
    // 打字过程中，如果用户没有主动滚动，则自动滚动到底部
    if (!userScrolling.value) {
      nextTick(() => {
        scrollToBottom();
      });
    }
  }
};

function onBack() {
  if (ws) {
    ws.close({ code: 1000, reason: '用户主动关闭' });
    ws = null;
  }
  uni.navigateBack();
}

// 建立WebSocket连接
const connectWebSocket = () => {
  return new Promise<void>((resolve, reject) => {
    if (ws) {
      ws.close({ code: 1000, reason: '重新连接' });
    }
    ws = uni.connectSocket({
      url: WS_URL,
      success: () => {
        console.log('WebSocket连接成功');
      },
      fail: (err) => {
        console.error('WebSocket连接失败:', err);
        reject(err);
      }
    });
    if (!ws) {
      reject(new Error('WebSocket连接创建失败'));
      return;
    }
    ws.onOpen((res: UniApp.OnSocketOpenCallbackResult) => {
      console.log('WebSocket连接已打开', res);
      resolve();
    });
    ws.onError((err: UniApp.GeneralCallbackResult) => {
      console.error('WebSocket错误:', err);
      reject(err);
    });
    ws.onClose((res: UniApp.GeneralCallbackResult) => {
      console.log('WebSocket连接已关闭', res);
      ws = null;
    });
    ws.onMessage((res: UniApp.OnSocketMessageCallbackResult) => {
      try {
        const data = JSON.parse(res.data);
        if (data.type === 'text' && currentAiMessageIndex >= 0) {
          // 设置AI正在回复状态
          isAiResponding.value = true;
          
          if (chatList.value[currentAiMessageIndex].content === 'AI 正在输入...') {
            // 首次收到，启动 1 秒 loading，缓存内容
            firstTextBuffer.push(data.content);
            if (!firstTextTimeout) {
              firstTextTimeout = setTimeout(() => {
                chatList.value[currentAiMessageIndex].content = '';
                currentTypingText = '';
                pendingText = firstTextBuffer.join('');
                typingTimer = setInterval(typeText, typingSpeed);
                firstTextBuffer = [];
                firstTextTimeout = null;
              }, 1000);
            }
          } else if (firstTextTimeout) {
            // 1 秒内的后续内容也缓存
            firstTextBuffer.push(data.content);
          } else {
            // 1 秒后正常追加
            pendingText += data.content;
            if (!typingTimer) {
              currentTypingText = chatList.value[currentAiMessageIndex].content;
              typingTimer = setInterval(typeText, typingSpeed);
            }
          }
        }
        if (data.done) {
          // 服务端回复完成，但可能还在打字
          if (typingTimer) {
            clearInterval(typingTimer);
            typingTimer = null;
          }
          if (pendingText.length > 0) {
            currentTypingText += pendingText;
            pendingText = '';
            if (currentAiMessageIndex >= 0) {
              chatList.value[currentAiMessageIndex].content = currentTypingText;
            }
          }
          // 清理 firstTextBuffer 和定时器
          if (firstTextTimeout) {
            clearTimeout(firstTextTimeout);
            firstTextTimeout = null;
            firstTextBuffer = [];
          }
          
          // 服务端回复完成且打字结束，解除禁用状态
          isAiResponding.value = false;
          
          // AI回复完成后，如果用户没有主动滚动，则滚动到底部
          if (!userScrolling.value) {
            nextTick(() => {
              scrollToBottom();
            });
          }
        }
      } catch (error) {
        console.error('解析消息失败:', error);
      }
    });
  });
};

// 发送消息
const sendMsg = async () => {
  const question = inputValue.value.trim();
  if (!question) return;
  
  // 检查AI是否正在回复，如果是则阻止发送
  if (isAiResponding.value || typingTimer || firstTextTimeout) {
    uni.showToast({
      title: 'AI正在回复中，请稍候...',
      icon: 'none',
      duration: 2000
    });
    return;
  }
  
  // 医学类问题拦截
  if (/医|药|疾病|处方|诊断|治疗|发烧|咳嗽|感冒|新冠|疫苗|用药|挂号|医院|医生/.test(question)) {
    chatList.value.push({ role: 'ai', content: '很抱歉，医学类问题请咨询专业医生或医疗机构。' });
    inputValue.value = '';
    nextTick(() => {
      scrollToBottom();
    });
    return;
  }
  
  chatList.value.push({ role: 'user', content: question });
  inputValue.value = '';
  // 发送消息时重置用户滚动状态
  userScrolling.value = false;
  nextTick(() => {
    scrollToBottom();
  });

  try {
    // 确保WebSocket连接
    if (!ws) {
      await connectWebSocket();
    }

    if (!ws) {
      throw new Error('WebSocket连接失败');
    }

    // 设置AI正在回复状态
    isAiResponding.value = true;

    // 添加AI回复loading占位
    currentAiMessageIndex = chatList.value.length;
    chatList.value.push({ role: 'ai', content: 'AI 正在输入...' });

    // 发送消息
    ws.send({
      data: JSON.stringify({
        message: question,
        type: 'chat'
      }),
      success: () => {
        console.log('消息发送成功');
      },
      fail: (err) => {
        console.error('消息发送失败:', err);
        chatList.value[currentAiMessageIndex].content = '抱歉，消息发送失败，请稍后重试。';
        isAiResponding.value = false; // 发送失败时解除状态
        nextTick(() => {
          scrollToBottom();
        });
      }
    });

  } catch (error) {
    console.error('WebSocket操作失败:', error);
    chatList.value.push({ 
      role: 'ai', 
      content: '抱歉，服务暂时不可用，请稍后再试。' 
    });
    isAiResponding.value = false; // 出错时解除状态
    nextTick(() => {
      scrollToBottom();
    });
  }
};

// 组件卸载时清理WebSocket连接
onUnmounted(() => {
  if (ws) {
    ws.close({ code: 1000, reason: '组件卸载' });
    ws = null;
  }
  if (typingTimer) {
    clearInterval(typingTimer);
    typingTimer = null;
  }
  if (firstTextTimeout) {
    clearTimeout(firstTextTimeout);
    firstTextTimeout = null;
  }
  isAiResponding.value = false;
});

// 滚动到底部
const scrollToBottom = () => {
  // 使用 nextTick 确保 DOM 更新完成后再滚动
  nextTick(() => {
    setTimeout(() => {
      // 使用scroll-into-view滚动到最后一个消息
      scrollIntoView.value = `msg-${chatList.value.length - 1}`;
      console.log('滚动到底部，目标元素:', scrollIntoView.value);
    }, 50);
  });
};

// 简单的滚动到底部方法（备用）
const simpleScrollToBottom = () => {
  nextTick(() => {
    setTimeout(() => {
      scrollTop.value = 999999;
      console.log('使用简单滚动方法');
    }, 30);
  });
};

// 生命周期钩子
onMounted(() => {
  // 组件挂载时执行的操作
  setTimeout(() => {
    showAiTip.value = false;
  }, 3000);
});

// 滚动事件监听
const onScroll = (event: any) => {
  // 检测用户是否主动滚动
  const { scrollTop: currentScrollTop } = event.detail;
  
  // 如果用户向上滚动（scrollTop减小），说明用户在查看历史消息
  if (currentScrollTop < scrollTop.value) {
    userScrolling.value = true;
  }
  
  // 如果滚动位置很大（接近底部），重置用户滚动状态
  if (currentScrollTop > 999000) {
    userScrolling.value = false;
  }
  
  scrollTop.value = currentScrollTop;
};
</script>

<style lang="scss" scoped>
/* 样式部分与原代码保持一致，无需修改 */
.chat-ai-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f6fa;
}
.ai-tip {
  padding: 24rpx 32rpx 0 32rpx;
  color: #888;
  font-size: 26rpx;
  line-height: 1.6;
  max-height: 200rpx; /* 设置最大高度 */
  opacity: 1;
  overflow: hidden;
  transition: all 0.5s ease-in-out; /* 添加过渡动画 */
  
  &.ai-tip-hide {
    max-height: 0;
    opacity: 0;
    padding-top: 0;
    padding-bottom: 0;
  }
}
.chat-list {
  flex: 1;
  overflow: auto;
  padding: 16rpx 0;
}
.chat-item {
  display: flex;
  align-items: flex-start;
  margin: 0 32rpx 16rpx;
  &.user {
    flex-direction: row-reverse;
    .msg-content {
      background: #409eff;
      color: #fff;
    }
  }
  &.ai {
    .msg-content {
      background: #fff;
      color: #333;
      border: 1rpx solid #e0e0e0;
    }
  }
}
.avatar {
  width: 64rpx;
  height: 64rpx;
  margin: 0 16rpx;
}
.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #eee;
}
.msg-content {
  max-width: 70vw;
  padding: 18rpx 24rpx;
  border-radius: 16rpx;
  font-size: 28rpx;
  word-break: break-all;
  &.loading {
    color: #aaa;
    font-style: italic;
    background: #f0f0f0;
    border: none;
  }
}
.input-bar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx 24rpx 24rpx;
  background: #fff;
  box-shadow: 0 -2rpx 12rpx rgba(0,0,0,0.04);
  z-index: 10; /* 确保输入栏在最上层 */
}
.input-bar-box {
  height: 112rpx;
}
.input {
  flex: 1;
  height: 72rpx;
  border: 1rpx solid #e0e0e0;
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  background: #f8f9fa;
  
  &.input-disabled {
    background: #f5f5f5;
    color: #999;
    cursor: not-allowed;
  }
}
.send-btn {
  margin-left: 18rpx;
  background: #409eff;
  color: #fff;
  font-size: 28rpx;
  border-radius: 12rpx;
  padding: 0 32rpx;
  height: 72rpx;
  line-height: 72rpx;
  box-shadow: none;
  
  &.send-btn-disabled {
    background: #ccc;
    color: #999;
    cursor: not-allowed;
  }
}

.bottom-spacer {
  height: 120rpx; /* 底部占位高度，确保有足够空间 */
  width: 100%;
}
</style>