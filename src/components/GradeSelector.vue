<template>
  <div class="grade-selector-input">
    <!-- 模拟输入框 -->
    <div
      class="flex items-center border-b border-gray-300 py-2 cursor-pointer"
      @click="showPicker = true"
    >
      <label :for="id" class="input-label flex-shrink-0 text-base font-mono font-bold mr-4 mb-2 whitespace-nowrap w-16">
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </label>
      <div
        :id="id"
        class="flex-1 text-gray-700 mr-3 py-1 px-2 leading-tight"
        :class="{ 'text-gray-400': !displayValue }"
      >
        {{ displayValue || placeholder }}
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 text-gray-400 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </div>
    <!-- 错误信息 -->
    <div v-if="errorMessage" class="text-red-500 text-xs italic mt-1 ml-4">
      {{ errorMessage }}
    </div>

    <!-- 自定义弹出选择框 -->
     <div v-show="showPicker" class="custom-picker-popup fixed inset-0 bg-black/50 z-50 flex items-end" @click="showPicker = false">
      <div class="w-full bg-white rounded-t-xl overflow-hidden" @click.stop>
        <!-- 标题栏 -->
        <div class="flex items-center justify-between px-4 py-3">
          <h3 class="text-lg font-bold">{{ label }}</h3>
          <button @click="showPicker = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <!-- 请选择提示文本 -->
        <div class="px-4 py-3 text-gray-500">请选择</div>
        <!-- 可滚动选项区域 -->
        <div class="max-h-[300px] overflow-y-auto py-2">
           <!-- 年级选项 -->
          <div 
            v-for="(item, index) in gradeColumns" 
            :key="index" 
            class="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b"
            @click="handleSelect(item.value, item.text)"
          >
            {{ item.text }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { getGradeOptions } from '../apis/grade_api.js';

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
  id: {
    type: String,
    default: '',
  }
});

// 定义组件的 emits 事件
const emit = defineEmits(['update:modelValue', 'change']);

// 控制弹出框的显示与隐藏
const showPicker = ref(false);

// 年级列数据
const gradeColumns = ref([]);

// 获取年级选项
const fetchGrades = async () => {
  if (!props.id) return;
  try {
    const grades = await getGradeOptions(props.id);
    gradeColumns.value = grades;
  } catch (error) {
    console.error('获取年级选项失败:', error);
  }
};

// 初始化时获取年级选项
onMounted(() => {
  fetchGrades();
});

// 监听id变化，重新获取年级选项
watch(() => props.id, () => {
  fetchGrades();
});

// 计算显示在输入框中的值
const displayValue = computed(() => {
  if (props.modelValue) {
    const selectedOption = gradeColumns.value.find(option => option.value === props.modelValue);
    return selectedOption ? selectedOption.text : '';
  }
  return '';
});

// 为模拟输入框生成唯一ID
const id = computed(() => `grade-selector-${Math.random().toString(36).substr(2, 9)}`);

// 处理选项选择
const handleSelect = (value: string, text: string) => {
  emit('update:modelValue', value);
  emit('change', value);
  showPicker.value = false;
};
</script>

<style scoped>
.custom-picker-popup {
  transition: all 0.3s ease;
}
.custom-picker-popup .max-h-\[300px\] {
  scrollbar-width: thin;
}
.custom-picker-popup .max-h-\[300px\]::-webkit-scrollbar {
  width: 4px;
}
.custom-picker-popup .max-h-\[300px\]::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 2px;
}
.grade-selector-input .text-gray-400 {
  color: #a0aec0;
}
</style>