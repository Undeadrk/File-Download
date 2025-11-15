<template>
  <div class="grade-selector-input">
    <!-- 输入框 -->
    <van-field
      v-model="fieldValue"
      is-link
      readonly
      :label="label"
      :placeholder="placeholder"
      @click="showPicker = true"
      class="custom-field"
    />
    <div v-if="required" class="text-red-500 ml-1 inline">*</div>
    <!-- 错误信息 -->
    <div v-if="errorMessage" class="text-red-500 text-xs italic mt-1 ml-4">
      {{ errorMessage }}
    </div>

    <!-- 级联选择弹窗 -->
    <van-popup v-model:show="showPicker" round position="bottom">
      <van-cascader
        v-model="cascaderValue"
        :title="label"
        :options="gradeOptions"
        @close="showPicker = false"
        @finish="onFinish"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { Cascader, Field, Popup } from 'vant';
import { GRADE_OPTIONS } from '../constants/grade';

// 定义组件的 props
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '请选择',
  },
  placeholder: {
    type: String,
    default: '请选择年级',
  },
  required: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: '',
  },
});

// 定义组件的 emits 事件
const emit = defineEmits(['update:modelValue', 'change']);

// 控制弹出框的显示与隐藏
const showPicker = ref(false);

// Cascader 选中值 (数组形式)
const cascaderValue = ref<string[]>([]);

// 输入框显示值
const fieldValue = ref('');

// 格式化年级选项数据 (为 Cascader 组件提供正确结构)
const gradeOptions = computed(() => {
  // 单层级选择，不需要 children 属性
  return GRADE_OPTIONS;
});

// 监听 modelValue 变化，同步到 Cascader
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      cascaderValue.value = [newValue]; // 单层级选择，值为数组第一个元素
    } else {
      cascaderValue.value = [];
    }
  },
  { immediate: true }
);

// 监听 Cascader 选中值变化，更新输入框显示
watch(
  cascaderValue,
  (newValue) => {
    if (newValue.length) {
      const selectedOption = GRADE_OPTIONS.find(option => option.value === newValue[0]);
      fieldValue.value = selectedOption ? selectedOption.text : '';
    } else {
      fieldValue.value = '';
    }
  },
  { immediate: true }
);

// 处理 Cascader 选择完成事件
const onFinish = ({ selectedOptions }) => {
  const selectedValue = selectedOptions[0].value;
  emit('update:modelValue', selectedValue);
  emit('change', selectedValue);
  showPicker.value = false;
};
</script>

<style scoped>
/* 保持原有输入框样式 */
.grade-selector-input {
  margin-bottom: 1rem;
}

/* 自定义 Field 样式 */
.custom-field {
  margin-bottom: 0;
}
</style>