<template>
  <view class="chat-ai-container">
    <!-- 顶部提示 -->
    <view class="ai-tip">
      请输入您的育儿问题，机器人将结合儿童行为数据为您提供科学个性化建议（不支持医学类问题咨询）。
    </view>
    <!-- 对话区 -->
    <scroll-view class="chat-list" :scroll-y="true" :scroll-top="scrollTop" scroll-with-animation>
      <view v-for="(msg, idx) in chatList" :key="idx" :class="['chat-item', msg.role]">
        <view class="avatar">
          <image v-if="msg.role==='user'" src="/static/user.png" class="avatar-img" />
          <image v-else src="/static/ai.png" class="avatar-img" />
        </view>
        <view class="msg-content">
          <text>{{ msg.content }}</text>
        </view>
      </view>
      <view v-if="loading" class="chat-item ai">
        <view class="avatar">
          <image src="/static/ai.png" class="avatar-img" />
        </view>
        <view class="msg-content loading">
          <text>正在生成回复...</text>
        </view>
      </view>
    </scroll-view>
    <!-- 输入区 -->
    <view class="input-bar">
      <input class="input" v-model="inputValue" placeholder="请输入您的育儿问题..." @confirm="sendMsg" :disabled="loading" />
      <button class="send-btn" @tap="sendMsg" :disabled="!inputValue.trim() || loading">发送</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      inputValue: '',
      chatList: [
        { role: 'ai', content: '您好，我是智能育儿助手，请问有什么育儿问题需要咨询？' }
      ],
      loading: false,
      scrollTop: 0
    }
  },
  methods: {
    async sendMsg() {
      const question = this.inputValue.trim()
      if (!question || this.loading) return
      // 医学类问题拦截
      if (/医|药|疾病|处方|诊断|治疗|发烧|咳嗽|感冒|新冠|疫苗|用药|挂号|医院|医生/.test(question)) {
        this.chatList.push({ role: 'ai', content: '很抱歉，医学类问题请咨询专业医生或医疗机构。' })
        this.inputValue = ''
        this.$nextTick(this.scrollToBottom)
        return
      }
      this.chatList.push({ role: 'user', content: question })
      this.inputValue = ''
      this.loading = true
      this.$nextTick(this.scrollToBottom)
      // 模拟AI接口调用
      try {
        // 这里请替换为实际后端AI接口调用
        const aiReply = await this.mockAIReply(question)
        this.chatList.push({ role: 'ai', content: aiReply })
      } catch (e) {
        this.chatList.push({ role: 'ai', content: '抱歉，服务暂时不可用，请稍后再试。' })
      }
      this.loading = false
      this.$nextTick(this.scrollToBottom)
    },
    // 模拟AI回复
    mockAIReply(q) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve('这是AI根据您的问题和儿童行为数据生成的个性化建议示例。')
        }, 1200)
      })
    },
    scrollToBottom() {
      this.scrollTop = 99999
    }
  }
}
</script>

<style lang="scss" scoped>
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
}
.chat-list {
  flex: 1;
  overflow: hidden;
  padding: 20rpx 0 20rpx 0;
}
.chat-item {
  display: flex;
  align-items: flex-start;
  margin: 16rpx 32rpx;
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
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx 24rpx 24rpx;
  background: #fff;
  box-shadow: 0 -2rpx 12rpx rgba(0,0,0,0.04);
}
.input {
  flex: 1;
  height: 72rpx;
  border: 1rpx solid #e0e0e0;
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  background: #f8f9fa;
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
}
</style>
