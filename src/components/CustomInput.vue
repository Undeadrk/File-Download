<template>
  <div class="flex items-center border-b border-gray-300 py-2">
    <label :for="id" class="input-label flex-shrink-0 text-base font-mono font-bold mr-4 mb-2 whitespace-nowrap w-16">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :id="id"
      type="text"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: '请输入内容',
  },
  modelValue: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

// 为输入框生成一个唯一的ID，以关联label
const id = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`);
</script>

<style scoped>
/* 可以在这里添加 Less 样式，但 Tailwind CSS 已经处理了大部分视觉样式 */
.input-label {
    color: #303133;
}
</style>
