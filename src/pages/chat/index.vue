<template>
  <view class="chat-container">
    <!-- 聊天记录区 -->
    <scroll-view class="chat-list" :scroll-y="true" :scroll-top="scrollTop" scroll-with-animation>
      <view v-for="(msg, idx) in chatList" :key="idx" :class="['chat-item', msg.role]">
        <view class="bubble-wrap">
          <view class="msg-time">{{formatTime(msg.time)}}</view>
          <view class="voice-row">
            <view class="avatar">
              <image v-if="msg.role==='parent'" src="/static/parent.png" class="avatar-img" />
              <image v-else src="/static/child.png" class="avatar-img" />
            </view>
            <view class="voice-bubble" @tap="playVoice(msg)" :class="{playing: msg.playing}">
              <image class="voice-icon" :src="msg.playing ? '/static/voice_playing.gif' : '/static/voice.png'" />
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
        <view v-else>
          <image src="/static/recording.gif" style="width:60rpx;height:60rpx;" />
          正在录音...
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

<script>
export default {
  data() {
    return {
      chatList: [
        { role: 'parent', duration: 6, url: '', playing: false, time: '2024-06-01 14:23' },
        { role: 'child', duration: 4, url: '', playing: false, time: '2024-06-01 14:24' }
      ],
      scrollTop: 0,
      showAuthModal: false,
      recorder: null,
      recording: false,
      recordStartTime: 0,
      recordCancel: false,
      recordTooShort: false,
      recordAnim: false,
      recordBtnText: '按住说话',
      recordBtnActive: false
    }
  },
  methods: {
    // 检查录音权限
    async checkRecordAuth() {
      const sys = uni.getSystemInfoSync();
      if (sys.platform === 'devtools' || sys.platform === 'android' || sys.platform === 'ios') {
        // 微信小程序/APP
        if (typeof wx !== 'undefined' && wx.getSetting) {
          return new Promise(resolve => {
            wx.getSetting({
              success: (res) => {
                if (!res.authSetting['scope.record']) {
                  this.showAuthModal = true;
                  resolve(false);
                } else {
                  resolve(true);
                }
              },
              fail: () => {
                this.showAuthModal = true;
                resolve(false);
              }
            });
          });
        }
      } else if (sys.platform === 'h5' || typeof window !== 'undefined') {
        // H5
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (e) {
          this.showAuthModal = true;
          return false;
        }
      }
      return true;
    },
    // 开始录音
    async startRecord(e) {
      if (this.recording) return;
      const hasAuth = await this.checkRecordAuth();
      if (!hasAuth) return;
      this.recording = true;
      this.recordCancel = false;
      this.recordTooShort = false;
      this.recordAnim = true;
      this.recordBtnText = '松开结束';
      this.recordBtnActive = true;
      this.recordStartTime = Date.now();
      // #ifdef MP-WEIXIN
      this.recorder = wx.getRecorderManager();
      this.recorder.start({ format: 'mp3' });
      // #endif
      // #ifdef H5
      // 这里只做UI演示，实际需集成Recorder.js等库
      // #endif
    },
    // 录音时手指上滑取消
    moveRecord(e) {
      // 判断是否上滑（以y轴为例，实际可根据页面高度动态调整）
      if (e.touches && e.touches[0].clientY < uni.upx2px(900)) {
        this.recordCancel = true;
        this.recordBtnText = '松开手指，取消发送';
      } else {
        this.recordCancel = false;
        this.recordBtnText = '松开结束';
      }
    },
    // 停止录音并发送
    stopRecord() {
      if (!this.recording) return;
      this.recording = false;
      this.recordAnim = false;
      this.recordBtnActive = false;
      this.recordBtnText = '按住说话';
      const duration = Math.round((Date.now() - this.recordStartTime) / 1000);
      if (this.recordCancel) {
        // 取消发送
        uni.showToast({ title: '已取消', icon: 'none' });
        return;
      }
      if (duration < 1) {
        this.recordTooShort = true;
        setTimeout(() => { this.recordTooShort = false; }, 1200);
        uni.showToast({ title: '说话时间太短', icon: 'none' });
        return;
      }
      // #ifdef MP-WEIXIN
      this.recorder.stop();
      this.recorder.onStop = (res) => {
        this.addVoiceMsg('parent', duration, res.tempFilePath);
      };
      // #endif
      // #ifdef H5
      // 这里只做UI演示，实际需集成录音库
      this.addVoiceMsg('parent', duration, '');
      // #endif
    },
    // 取消录音
    cancelRecord() {
      this.recording = false;
      this.recordAnim = false;
      this.recordBtnActive = false;
      this.recordBtnText = '按住说话';
      // #ifdef MP-WEIXIN
      if (this.recorder) this.recorder.stop();
      // #endif
    },
    // 添加语音消息
    addVoiceMsg(role, duration, url) {
      const now = new Date();
      const time = now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + ' ' +
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0');
      this.chatList.push({ role, duration, url, playing: false, time });
      this.$nextTick(this.scrollToBottom);
    },
    // 播放语音
    playVoice(msg) {
      this.chatList.forEach(m => m.playing = false)
      msg.playing = true
      // #ifdef MP-WEIXIN
      const innerAudioContext = wx.createInnerAudioContext()
      innerAudioContext.src = msg.url
      innerAudioContext.play()
      innerAudioContext.onEnded = () => { msg.playing = false }
      // #endif
      // #ifdef H5
      // 这里只做UI演示
      setTimeout(() => { msg.playing = false }, msg.duration * 1000)
      // #endif
    },
    scrollToBottom() {
      this.scrollTop = 99999
    },
    closeAuthModal() {
      this.showAuthModal = false
    },
    formatTime(time) {
      // 只显示时:分
      if (!time) return '';
      if (time.length > 5) return time.slice(-5);
      return time;
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f6fa;
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
