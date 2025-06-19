<template>
  <view class="lesson-plan-container">
    <up-navbar title="课程教案生成" @leftClick="onBack" leftIconColor="#000000" :fixed="false" bgColor="#ffffff" titleColor="#000000">
    </up-navbar>
    
    <!-- 内容区域，添加顶部内边距避免被navbar遮挡 -->
    <view class="content-wrapper">
      <!-- 参数选择区域 -->
      <view class="params-section">
        <view class="param-group">
          <text class="param-label">年级选择</text>
          <view class="param-options">
            <view 
              v-for="grade in grades" 
              :key="grade.value"
              :class="['param-option', { active: selectedGrade === grade.value }]"
              @tap="selectGrade(grade.value)"
            >
              {{ grade.label }}
            </view>
          </view>
        </view>
        
        <view class="param-group">
          <text class="param-label">领域选择</text>
          <view class="param-options">
            <view 
              v-for="domain in domains" 
              :key="domain.value"
              :class="['param-option', { active: selectedDomain === domain.value }]"
              @tap="selectDomain(domain.value)"
            >
              {{ domain.label }}
            </view>
          </view>
        </view>
        
        <view class="param-group">
          <text class="param-label">活动主题</text>
          <textarea 
            class="theme-input" 
            v-model="activityTheme" 
            placeholder="请输入活动主题，如：春天的小花、小动物的家等"
            maxlength="50"
            auto-height
          />
          <text class="char-count">{{ activityTheme.length }}/50</text>
        </view>
      </view>
      
      <!-- 教案展示区域 -->
      <view v-if="lessonPlan" class="lesson-plan-section">
        <view class="plan-header">
          <text class="plan-title">{{ lessonPlan.title }}</text>
          <view class="plan-actions">
            <button class="action-btn" @tap="downloadPlan">
              下载
            </button>
            <button class="action-btn" @tap="sharePlan">
              转发
            </button>
            <button class="action-btn" @tap="toggleFavorite">
              {{ isFavorite ? '已收藏' : '收藏' }}
            </button>
          </view>
        </view>
        
        <scroll-view class="plan-content" :scroll-y="true">
          <view class="plan-section">
            <text class="section-title">活动目标</text>
            <text class="section-content">{{ lessonPlan.objectives }}</text>
          </view>
          
          <view class="plan-section">
            <text class="section-title">活动准备</text>
            <text class="section-content">{{ lessonPlan.preparation }}</text>
          </view>
          
          <view class="plan-section">
            <text class="section-title">活动过程</text>
            <view v-for="(step, index) in lessonPlan.process" :key="index" class="process-step">
              <text class="step-title">{{ step.title }}</text>
              <text class="step-content">{{ step.content }}</text>
            </view>
          </view>
          
          <view class="plan-section">
            <text class="section-title">活动延伸</text>
            <text class="section-content">{{ lessonPlan.extension }}</text>
          </view>
          
          <view class="plan-section">
            <text class="section-title">活动评价</text>
            <text class="section-content">{{ lessonPlan.evaluation }}</text>
          </view>
        </scroll-view>
      </view>
      
      <!-- 历史记录 -->
      <view v-if="historyList.length > 0" class="history-section">
        <view class="history-header">
          <text class="history-title">历史记录</text>
          <button class="clear-btn" @tap="clearHistory">清空</button>
        </view>
        <scroll-view class="history-list" :scroll-y="true">
          <view 
            v-for="(item, index) in historyList" 
            :key="index"
            class="history-item"
            @tap="loadHistoryItem(item)"
          >
            <view class="history-info">
              <text class="history-title">{{ item.title }}</text>
              <text class="history-desc">{{ item.grade }} · {{ item.domain }} · {{ item.theme }}</text>
            </view>
            <text class="history-time">{{ formatTime(item.createTime) }}</text>
          </view>
        </scroll-view>
      </view>
      
      <!-- 底部占位，避免内容被悬浮按钮覆盖 -->
      <view class="bottom-spacer"></view>
    </view>
    
    <!-- 底部悬浮生成按钮 -->
    <view class="bottom-section">
      <button 
        class="generate-btn" 
        :class="{ disabled: !canGenerate }"
        @tap="generateLessonPlan"
        :disabled="!canGenerate || isGenerating"
      >
        {{ isGenerating ? '生成中...' : '生成教案' }}
      </button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
// 使用现有图标或移除图标依赖
// import loadingIcon from '@/static/images/loading.gif';
// import downloadIcon from '@/static/images/download.png';
// import shareIcon from '@/static/images/share.png';
// import favoriteIcon from '@/static/images/favorite.png';
// import favoriteActiveIcon from '@/static/images/favorite_active.png';

// 年级选项
const grades = [
  { label: '小班', value: 'small' },
  { label: '中班', value: 'medium' },
  { label: '大班', value: 'large' }
];

// 领域选项
const domains = [
  { label: '语言', value: 'language' },
  { label: '艺术', value: 'art' },
  { label: '健康', value: 'health' },
  { label: '科学', value: 'science' },
  { label: '社会', value: 'social' }
];

// 状态管理
const selectedGrade = ref('');
const selectedDomain = ref('');
const activityTheme = ref('');
const isGenerating = ref(false);
const lessonPlan = ref<any>(null);
const isFavorite = ref(false);
const historyList = ref<any[]>([]);

// 计算属性
const canGenerate = computed(() => {
  return selectedGrade.value && selectedDomain.value && activityTheme.value.trim();
});

// 选择年级
const selectGrade = (grade: string) => {
  selectedGrade.value = grade;
};

// 选择领域
const selectDomain = (domain: string) => {
  selectedDomain.value = domain;
};

// 返回上一页
const onBack = () => {
  uni.navigateBack();
};

// 生成教案
const generateLessonPlan = async () => {
  if (!canGenerate.value || isGenerating.value) return;
  
  isGenerating.value = true;
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 生成教案内容
    const plan = generatePlanContent();
    lessonPlan.value = plan;
    
    // 保存到历史记录
    saveToHistory(plan);
    
    uni.showToast({
      title: '教案生成成功',
      icon: 'success'
    });
    
  } catch (error) {
    console.error('生成教案失败:', error);
    uni.showToast({
      title: '生成失败，请重试',
      icon: 'none'
    });
  } finally {
    isGenerating.value = false;
  }
};

// 生成教案内容
const generatePlanContent = () => {
  const gradeLabel = grades.find(g => g.value === selectedGrade.value)?.label;
  const domainLabel = domains.find(d => d.value === selectedDomain.value)?.label;
  
  return {
    title: `${gradeLabel}${domainLabel}活动：${activityTheme.value}`,
    grade: gradeLabel,
    domain: domainLabel,
    theme: activityTheme.value,
    objectives: generateObjectives(),
    preparation: generatePreparation(),
    process: generateProcess(),
    extension: generateExtension(),
    evaluation: generateEvaluation(),
    createTime: Date.now()
  };
};

// 生成活动目标
const generateObjectives = () => {
  const objectives = {
    language: ['培养幼儿的语言表达能力', '提高幼儿的倾听能力', '激发幼儿的语言兴趣'],
    art: ['培养幼儿的艺术感知能力', '提高幼儿的动手操作能力', '激发幼儿的创造力'],
    health: ['培养幼儿的健康意识', '提高幼儿的运动能力', '养成良好的生活习惯'],
    science: ['培养幼儿的探究精神', '提高幼儿的观察能力', '激发幼儿的好奇心'],
    social: ['培养幼儿的社会交往能力', '提高幼儿的合作意识', '培养幼儿的责任感']
  };
  
  return objectives[selectedDomain.value as keyof typeof objectives].join('；');
};

// 生成活动准备
const generatePreparation = () => {
  const preparations = {
    language: '故事书、图片、录音设备、教学卡片',
    art: '绘画材料、手工材料、音乐设备、展示板',
    health: '运动器材、健康图片、洗手用品、营养食物',
    science: '实验材料、观察工具、科学图片、记录本',
    social: '角色扮演道具、合作游戏材料、社会场景图片'
  };
  
  return preparations[selectedDomain.value as keyof typeof preparations];
};

// 生成活动过程
const generateProcess = () => {
  const processes = {
    language: [
      { title: '导入环节', content: '通过图片或故事引入主题，激发幼儿兴趣' },
      { title: '展开环节', content: '引导幼儿观察、讨论，培养语言表达能力' },
      { title: '巩固环节', content: '通过游戏或活动巩固所学内容' }
    ],
    art: [
      { title: '欣赏环节', content: '引导幼儿欣赏艺术作品，培养审美能力' },
      { title: '创作环节', content: '鼓励幼儿自由创作，表达自己的想法' },
      { title: '展示环节', content: '展示幼儿作品，分享创作过程' }
    ],
    health: [
      { title: '认知环节', content: '了解健康知识，培养健康意识' },
      { title: '实践环节', content: '通过活动实践健康行为' },
      { title: '巩固环节', content: '巩固健康习惯，形成良好行为' }
    ],
    science: [
      { title: '观察环节', content: '引导幼儿仔细观察，发现科学现象' },
      { title: '探究环节', content: '鼓励幼儿动手操作，探究科学原理' },
      { title: '总结环节', content: '总结发现，培养科学思维' }
    ],
    social: [
      { title: '情境创设', content: '创设社会情境，激发幼儿参与兴趣' },
      { title: '互动交流', content: '引导幼儿交流合作，培养社交能力' },
      { title: '总结反思', content: '总结活动收获，培养社会责任感' }
    ]
  };
  
  return processes[selectedDomain.value as keyof typeof processes];
};

// 生成活动延伸
const generateExtension = () => {
  const extensions = {
    language: '可以在家庭中继续阅读相关故事，鼓励幼儿与家长交流',
    art: '可以组织艺术展览，让幼儿展示自己的作品',
    health: '可以在日常生活中继续培养健康习惯',
    science: '可以继续观察生活中的科学现象，培养探究精神',
    social: '可以在日常生活中继续培养社交能力，学会与人相处'
  };
  
  return extensions[selectedDomain.value as keyof typeof extensions];
};

// 生成活动评价
const generateEvaluation = () => {
  return '通过观察幼儿在活动中的表现，评价幼儿的学习效果和参与度，为后续教学提供参考。';
};

// 保存到历史记录
const saveToHistory = (plan: any) => {
  const historyItem = {
    ...plan,
    id: Date.now()
  };
  
  historyList.value.unshift(historyItem);
  
  // 限制历史记录数量
  if (historyList.value.length > 20) {
    historyList.value = historyList.value.slice(0, 20);
  }
  
  // 保存到本地存储
  uni.setStorageSync('lessonPlanHistory', historyList.value);
};

// 加载历史记录
const loadHistoryItem = (item: any) => {
  selectedGrade.value = grades.find(g => g.label === item.grade)?.value || '';
  selectedDomain.value = domains.find(d => d.label === item.domain)?.value || '';
  activityTheme.value = item.theme;
  lessonPlan.value = item;
};

// 清空历史记录
const clearHistory = () => {
  uni.showModal({
    title: '确认清空',
    content: '确定要清空所有历史记录吗？',
    success: (res) => {
      if (res.confirm) {
        historyList.value = [];
        uni.removeStorageSync('lessonPlanHistory');
        uni.showToast({
          title: '已清空',
          icon: 'success'
        });
      }
    }
  });
};

// 下载教案
const downloadPlan = () => {
  if (!lessonPlan.value) return;
  
  // 生成教案文本
  const content = generatePlanText(lessonPlan.value);
  
  // 复制到剪贴板
  uni.setClipboardData({
    data: content,
    success: () => {
      uni.showToast({
        title: '教案已复制到剪贴板',
        icon: 'success'
      });
    }
  });
};

// 生成教案文本
const generatePlanText = (plan: any) => {
  let text = `${plan.title}\n\n`;
  text += `年级：${plan.grade}\n`;
  text += `领域：${plan.domain}\n`;
  text += `主题：${plan.theme}\n\n`;
  text += `活动目标：\n${plan.objectives}\n\n`;
  text += `活动准备：\n${plan.preparation}\n\n`;
  text += `活动过程：\n`;
  plan.process.forEach((step: any, index: number) => {
    text += `${index + 1}. ${step.title}：${step.content}\n`;
  });
  text += `\n活动延伸：\n${plan.extension}\n\n`;
  text += `活动评价：\n${plan.evaluation}`;
  
  return text;
};

// 转发教案
const sharePlan = () => {
  if (!lessonPlan.value) return;
  
  const content = generatePlanText(lessonPlan.value);
  
  uni.share({
    provider: 'weixin',
    scene: 'WXSceneSession',
    type: 0,
    href: 'https://example.com/lesson-plan',
    title: lessonPlan.value.title,
    summary: content.substring(0, 100) + '...',
    success: () => {
      uni.showToast({
        title: '转发成功',
        icon: 'success'
      });
    },
    fail: () => {
      uni.showToast({
        title: '转发失败',
        icon: 'none'
      });
    }
  });
};

// 切换收藏状态
const toggleFavorite = () => {
  if (!lessonPlan.value) return;
  
  isFavorite.value = !isFavorite.value;
  
  // 保存收藏状态
  const favorites = uni.getStorageSync('lessonPlanFavorites') || [];
  
  if (isFavorite.value) {
    favorites.push(lessonPlan.value);
    uni.showToast({
      title: '已收藏',
      icon: 'success'
    });
  } else {
    const index = favorites.findIndex((item: any) => item.id === lessonPlan.value.id);
    if (index > -1) {
      favorites.splice(index, 1);
    }
    uni.showToast({
      title: '已取消收藏',
      icon: 'success'
    });
  }
  
  uni.setStorageSync('lessonPlanFavorites', favorites);
};

// 格式化时间
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
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

// 组件挂载时加载历史记录
onMounted(() => {
  const history = uni.getStorageSync('lessonPlanHistory');
  if (history) {
    historyList.value = history;
  }
});
</script>

<style lang="scss" scoped>
.lesson-plan-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f6fa;
  position: relative;
}

.content-wrapper {
  flex: 1;
  padding-top: 16rpx; /* 增加顶部间隙 */
  margin-bottom: 16rpx;
  padding-left: 24rpx;
  padding-right: 24rpx;
  padding-bottom: 32rpx; /* 增加底部间隙 */
  background: #f5f6fa;
  overflow-y: auto;
}

.params-section {
  padding: 24rpx;
  background: #fff;
  margin-bottom: 16rpx;
  border-radius: 12rpx;
  margin-top: 16rpx; /* 重新添加顶部间隙 */
}

.param-group {
  margin-bottom: 32rpx;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.param-label {
  display: block;
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 16rpx;
}

.param-options {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.param-option {
  padding: 16rpx 24rpx;
  background: #f8f9fa;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
  font-size: 26rpx;
  color: #666;
  transition: all 0.3s;
  
  &.active {
    background: #409eff;
    color: #fff;
    border-color: #409eff;
  }
}

.theme-input {
  width: 100%;
  min-height: 120rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
  padding: 20rpx;
  font-size: 28rpx;
  background: #f8f9fa;
  box-sizing: border-box;
  resize: none;
}

.char-count {
  display: block;
  text-align: right;
  font-size: 22rpx;
  color: #999;
  margin-top: 8rpx;
}

.lesson-plan-section {
  flex: 1;
  background: #fff;
  margin-bottom: 16rpx;
  display: flex;
  flex-direction: column;
  border-radius: 12rpx;
}

.plan-header {
  padding: 24rpx;
  border-bottom: 2rpx solid #f0f0f0;
}

.plan-title {
  display: block;
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 16rpx;
}

.plan-actions {
  display: flex;
  gap: 16rpx;
}

.action-btn {
  flex: 1;
  height: 64rpx;
  background: #f8f9fa;
  color: #666;
  font-size: 24rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
}

.plan-content {
  flex: 1;
  padding: 24rpx;
}

.plan-section {
  margin-bottom: 32rpx;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  display: block;
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 12rpx;
}

.section-content {
  display: block;
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}

.process-step {
  margin-bottom: 20rpx;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.step-title {
  display: block;
  font-size: 26rpx;
  color: #409eff;
  font-weight: bold;
  margin-bottom: 8rpx;
}

.step-content {
  display: block;
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}

.history-section {
  background: #fff;
  padding: 24rpx;
  border-radius: 12rpx;
  margin-bottom: 16rpx;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.history-title {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}

.clear-btn {
  font-size: 24rpx;
  color: #999;
  background: none;
  border: none;
}

.history-list {
  max-height: 400rpx;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 2rpx solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
}

.history-info {
  flex: 1;
}

.history-title {
  display: block;
  font-size: 26rpx;
  color: #333;
  margin-bottom: 8rpx;
}

.history-desc {
  display: block;
  font-size: 22rpx;
  color: #999;
}

.history-time {
  font-size: 22rpx;
  color: #999;
}

.bottom-spacer {
  height: 88rpx; /* 调整高度 */
}

.bottom-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24rpx;
  background: #fff;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.1);
  z-index: 100;
  border-top: 1rpx solid #f0f0f0; /* 添加顶部边框 */
}

.generate-btn {
  width: 100%;
  height: 88rpx;
  background: #409eff;
  color: #fff;
  font-size: 30rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  
  &.disabled {
    background: #ccc;
    color: #999;
  }
}
</style> 