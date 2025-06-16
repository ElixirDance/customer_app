<template>
	<up-navbar title="儿童数据分析" @leftClick="onBack" leftIconColor="#000000" :fixed="false" bgColor="#ffffff" titleColor="#000000">
	</up-navbar>
  <view class="analytics-container">
    <!-- 发展评估雷达图部分 -->
    <view class="section development-assessment">
      <view class="section-title">综合发展评估</view>
      <view class="radar-chart-container">
        <canvas canvas-id="radarChart" class="radar-chart" width="320" height="320" style="width: 320px; height: 320px;"></canvas>
      </view>
      <view class="assessment-details">
        <view class="detail-item" v-for="(item, index) in assessmentData" :key="index">
          <text class="label">{{item.label}}</text>
          <text class="value">{{item.value}}分</text>
        </view>
      </view>
    </view>

    <!-- 情绪分析部分 -->
    <view class="section emotion-analysis">
      <view class="section-title">情绪表现分析</view>
      <view class="emotion-stats">
        <view class="emotion-item" v-for="(emotion, index) in emotionData" :key="index">
          <view class="emotion-icon" :style="{backgroundColor: emotion.color}">
            <text class="iconfont">{{emotion.icon}}</text>
          </view>
          <view class="emotion-info">
            <text class="emotion-name">{{emotion.name}}</text>
            <text class="emotion-count">{{emotion.count}}次</text>
          </view>
        </view>
      </view>
      <view class="intervention-plan">
        <view class="plan-title">个性化干预方案</view>
        <view class="plan-content">
          <text>{{interventionPlan}}</text>
        </view>
      </view>
    </view>

    <!-- 历史对话内容部分 -->
    <view class="section conversation-history">
      <view class="section-title">历史对话分析</view>
      <view class="conversation-categories">
        <view class="category-item" v-for="(category, index) in conversationCategories" :key="index">
          <view class="category-header">
            <text class="category-name">{{category.name}}</text>
            <text class="category-count">{{category.count}}条</text>
          </view>
          <view class="category-content">
            <text class="category-summary">{{category.summary}}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

function onBack() {
	uni.navigateBack();
}

// 响应式数据
const assessmentData = ref([
  { label: '语言', value: 85 },
  { label: '艺术', value: 78 },
  { label: '科学', value: 82 },
  { label: '社会', value: 75 },
  { label: '健康', value: 88 }
]);

const emotionData = ref([
  { name: '开心', count: 15, icon: '😊', color: '#FFD700' },
  { name: '平静', count: 12, icon: '😌', color: '#98FB98' },
  { name: '焦虑', count: 3, icon: '😰', color: '#FFA07A' },
  { name: '生气', count: 2, icon: '😠', color: '#FF6B6B' }
]);

const interventionPlan = ref('根据情绪分析，建议增加正面激励，在游戏互动中培养情绪管理能力。每天安排15分钟的情绪表达练习，通过角色扮演帮助孩子更好地理解和表达情绪。');

const conversationCategories = ref([
  {
    name: '语言发展',
    count: 25,
    summary: '词汇量丰富，表达清晰，建议继续鼓励阅读和对话练习。'
  },
  {
    name: '认知能力',
    count: 18,
    summary: '逻辑思维能力强，对数字和空间概念理解良好。'
  },
  {
    name: '社交互动',
    count: 20,
    summary: '乐于分享，但在团队合作中需要更多引导。'
  }
]);

// 绘制雷达图
const drawRadarChart = () => {
  const ctx = uni.createCanvasContext('radarChart');
  const width = 320;
  const height = 320;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 30;
  const gridCount = 5; // 网格层数
  const angleStep = (Math.PI * 2) / assessmentData.value.length;

  // 绘制网格线
  for (let i = 0; i < gridCount; i++) {
    const currentRadius = (radius * (i + 1)) / gridCount;
    ctx.beginPath();
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 1;

    for (let j = 0; j < assessmentData.value.length; j++) {
      const angle = j * angleStep - Math.PI / 2;
      const x = centerX + currentRadius * Math.cos(angle);
      const y = centerY + currentRadius * Math.sin(angle);

      if (j === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.stroke();
  }

  // 绘制轴线
  for (let i = 0; i < assessmentData.value.length; i++) {
    const angle = i * angleStep - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + radius * Math.cos(angle),
      centerY + radius * Math.sin(angle)
    );
    ctx.strokeStyle = '#E0E0E0';
    ctx.stroke();

    // 绘制标签
    const labelX = centerX + (radius + 10) * Math.cos(angle);
    const labelY = centerY + (radius + 10) * Math.sin(angle);
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(assessmentData.value[i].label, labelX, labelY);
  }

  // 绘制数据区域
  ctx.beginPath();
  for (let i = 0; i < assessmentData.value.length; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const value = assessmentData.value[i].value;
    const pointRadius = (radius * value) / 100;
    const x = centerX + pointRadius * Math.cos(angle);
    const y = centerY + pointRadius * Math.sin(angle);

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();

  // 设置数据区域样式
  ctx.fillStyle = 'rgba(64, 158, 255, 0.2)';
  ctx.fill();
  ctx.strokeStyle = '#409EFF';
  ctx.lineWidth = 2;
  ctx.stroke();

  // 绘制数据点
  for (let i = 0; i < assessmentData.value.length; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const value = assessmentData.value[i].value;
    const pointRadius = (radius * value) / 100;
    const x = centerX + pointRadius * Math.cos(angle);
    const y = centerY + pointRadius * Math.sin(angle);

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#409EFF';
    ctx.fill();
  }

  ctx.draw();
};

// 生命周期钩子
onMounted(() => {
  drawRadarChart();
});
</script>

<style lang="scss" scoped>
/* 样式与原组件一致，无需修改 */
.analytics-container {
  padding: 20rpx;
  background-color: #f5f6fa;
  min-height: 100vh;
}

.section {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.radar-chart-container {
  width: 320px;
  height: 320px;
  margin: 20rpx 0;
}

.assessment-details {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 20rpx;
}

.detail-item {
  width: 30%;
  text-align: center;
  margin-bottom: 20rpx;
  
  .label {
    font-size: 28rpx;
    color: #666;
  }
  
  .value {
    font-size: 32rpx;
    color: #333;
    font-weight: bold;
    margin-left: 10rpx;
  }
}

.emotion-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.emotion-item {
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  padding: 20rpx;
  border-radius: 12rpx;
  width: calc(50% - 10rpx);
}

.emotion-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.emotion-info {
  .emotion-name {
    font-size: 28rpx;
    color: #333;
  }
  
  .emotion-count {
    font-size: 24rpx;
    color: #666;
    margin-top: 8rpx;
  }
}

.intervention-plan {
  background-color: #f8f9fa;
  padding: 20rpx;
  border-radius: 12rpx;
  
  .plan-title {
    font-size: 28rpx;
    font-weight: bold;
    margin-bottom: 16rpx;
  }
  
  .plan-content {
    font-size: 26rpx;
    color: #666;
    line-height: 1.6;
  }
}

.conversation-categories {
  .category-item {
    background-color: #f8f9fa;
    padding: 20rpx;
    border-radius: 12rpx;
    margin-bottom: 20rpx;
    
    .category-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16rpx;
      
      .category-name {
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
      }
      
      .category-count {
        font-size: 24rpx;
        color: #666;
      }
    }
    
    .category-content {
      font-size: 26rpx;
      color: #666;
      line-height: 1.6;
    }
  }
}
</style>