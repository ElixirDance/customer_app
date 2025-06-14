<template>
  <view class="child-archive-page">
    <up-navbar title="儿童专属档案" @leftClick="onBack" leftIconColor="#000000" :fixed="false" bgColor="#ffffff" titleColor="#000000">
	</up-navbar>

    <view class="form-container">
      <!-- 表单标题 -->
     <view class="form-title">
        <text class="title-text">{{isEditMode ? '编辑档案' : '创建档案'}}</text>
        <!-- <text class="subtitle-text" v-if="!isEditMode">完善档案有助于更好地了解和照顾孩子</text> -->
      </view>

      <!-- 表单内容 -->
      <up-form :model="formData" ref="formRef" :rules="rules" label-position="left" label-width="130rpx">
        <!-- 姓名 -->
        <up-form-item label="姓名" prop="name">
          <up-input v-model="formData.name" placeholder="请输入孩子姓名" border="bottom" :disabled="isSubmitted"></up-input>
        </up-form-item>

        <!-- 出生日期 -->
        <up-form-item label="出生日期" prop="birthDate">
          <up-input @click="birthDayDialogShow = true" v-model="computedBirthDay" placeholder="请选择出生日期" border="bottom" :disabled="isSubmitted"></up-input>
          <up-datetime-picker v-model:show="birthDayDialogShow" v-model="formData.birthDate" mode="date" closeOnClickOverlay :disabled="isSubmitted" @confirm="handleDateConfirm" @close="handleDateClose" @cancel="handleDateClose"></up-datetime-picker>
        </up-form-item>

        <!-- 性别 -->
        <up-form-item label="性别" prop="gender">
          <up-radio-group v-model="formData.gender" :disabled="isSubmitted">
            <up-radio label="男" name="male"></up-radio>
            <up-radio label="女" name="female"></up-radio>
          </up-radio-group>
        </up-form-item>

        <!-- 地区 - 修改为普通输入框 -->
        <up-form-item label="所在地区" prop="region">
          <up-input v-model="formData.region" placeholder="请输入所在地区（如：北京市朝阳区）" border="bottom" :disabled="isSubmitted"></up-input>
        </up-form-item>

        <!-- 兴趣偏好 -->
        <up-form-item label="兴趣偏好" prop="hobbies">
          <up-checkbox-group v-model="formData.hobbies" :disabled="isSubmitted" placement="row">
            <up-checkbox style="margin-right: 16rpx;" v-for="item of hobbyOptions" :key="item.value" :label="item.text" :name="item.value"></up-checkbox>
          </up-checkbox-group>
        </up-form-item>

        <!-- 备注信息 -->
        <up-form-item label="备注信息">
          <up-textarea v-model="formData.remark" placeholder="可以填写孩子的特殊需求、过敏信息等" :disabled="isSubmitted" maxlength="200" show-word-limit></up-textarea>
        </up-form-item>
      </up-form>

      <!-- 提交按钮 -->
      <view class="form-footer">
        <up-button :disabled="isSubmitted" type="primary" @click="submitForm" :loading="submitting">
          {{isSubmitted ? '操作成功' : (isEditMode ? '更新档案' : '创建档案')}}
        </up-button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, toRaw } from 'vue';
import { onLoad } from "@dcloudio/uni-app";
import { formatDate } from '@/utils/format';
import { addChild, updateChild, getChild } from '@/api/child/child';
import type { Child } from '@/types/child/child';

// 表单引用
const formRef = ref(null);

// 表单数据
const formData = reactive<Child>({
  id: '',         // 档案ID，创建模式下为空，更新模式下有值
  name: '',
  birthDate: Date.now(),
  gender: 'male' as 'male' | 'female', // 默认男
  region: '',     // 地区
  hobbies: [] as string[],    // 兴趣爱好
  remark: ''      // 备注信息
});

// 表单验证规则
const rules = reactive({
  name: {
    type: 'string',
    required: true,
    message: '请输入孩子姓名',
    trigger: 'blur'
  },
  birthDate: {
    type: 'number',
    required: true,
    message: '请选择出生日期',
    trigger: 'change'
  },
  region: {
    type: 'string',
    required: true,
    message: '请输入所在地区',
    trigger: 'blur'
  }
});

// 兴趣爱好选项
const hobbyOptions = ref([
  { text: '绘画', value: 'painting' },
  { text: '音乐', value: 'music' },
  { text: '阅读', value: 'reading' },
  { text: '运动', value: 'sports' },
  { text: '手工', value: 'handicraft' },
  { text: '科技', value: 'technology' },
  { text: '舞蹈', value: 'dance' },
  { text: '其他', value: 'other' }
]);

// 表单状态
const isSubmitted = ref(false);
const submitting = ref(false);

// 判断是否为编辑模式
const isEditMode = computed(() => !!formData.id /*|| !!route.query.id*/);

// 出生日期弹窗
const birthDayDialogShow = ref(false);

// 日期选择确认
function handleDateConfirm({ value }) {
  formData.birthDate = value;
  handleDateClose();
}

// 关闭日期选择器
function handleDateClose() {
  birthDayDialogShow.value = false;
}

// 出生日期的展示值
const computedBirthDay = computed(() => {
  return formatDate(new Date(formData.birthDate));
});

const onBack = () => {
	uni.navigateBack();
}

// 提交表单
async function submitForm() {
  try {
    await formRef.value.validate();

    submitting.value = true;
	
	const { id } = toRaw(formData);
	
	const response =  id ? await updateChild(toRaw(formData)) : await addChild(toRaw(formData));
	
	if (response) {
		uni.showToast({
		  title: isEditMode ? '档案更新成功' : '档案创建成功',
		  icon: 'success'
		});
	}

    isSubmitted.value = true;
    submitting.value = false;

    // 提交成功后返回上一页
    setTimeout(() => {
	  uni.navigateBack()
    }, 1500);

    // 这里可以添加实际的提交逻辑
    console.log(isEditMode ? '更新的表单数据:' : '创建的表单数据:', toRaw(formData));
  } catch (error) {
    console.log('表单验证失败:', error);
  }
}

// 从URL获取id并加载数据
async function loadDataById(id: string) {
  if (!id) return;

  try {
    // 显示加载状态
    submitting.value = true;

    // 模拟从服务端获取数据
    // 实际项目中应替换为真实的API请求
    const response = await getChild({id})

    // 填充表单数据
    formData.id = response.id + '';
    formData.name = response.name;
    formData.birthDate = response.birthDate;
    formData.gender = response.gender;
    formData.region = response.region;
    formData.hobbies = response.hobbies;
    formData.remark = response.remark;

    console.log('从服务端获取的数据:', response);
  } catch (error) {
    console.log('获取数据失败:', error);
    uni.showToast({
      title: '获取数据失败',
      icon: 'none'
    });
  } finally {
    submitting.value = false;
  }
}

onLoad(options => {
	if(options.id) {
		formData.id = options.id;
	}
})

// 生命周期钩子
onMounted(() => {
  // 从URL参数获取id
  const id = formData.id;
  if (id) {
    loadDataById(id);
  }
});
</script>

<style lang="scss" scoped>
.child-archive-page {
  background-color: #f8f9fa;
  height: 100vh;
  display: flex;
  flex-direction: column;

  .form-container {
    padding: 30rpx;
    flex: 1;
    display: flex;
    flex-direction: column;

    .form-title {
      padding: 40rpx 0;
      text-align: center;

      .title-text {
        font-size: 36rpx;
        font-weight: bold;
        color: #333;
      }

      .subtitle-text {
        font-size: 28rpx;
        color: #666;
        margin-top: 10rpx;
      }
    }

    .form-footer {
      padding: 30rpx;
      margin-top: 20rpx;

      up-button {
        width: 100%;
        height: 88rpx;
        line-height: 88rpx;
        font-size: 32rpx;
      }
    }
  }
}
</style>