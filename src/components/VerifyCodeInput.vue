<template>
  <div class="flex items-center border-b border-gray-300 py-2">
    <label for="verifyCode" class="flex-shrink-0 text-gray-700 font-mono font-bold mr-4 whitespace-nowrap w-16">
      验证码
      <span class="text-red-500">*</span>
    </label>
    <input
      id="verifyCode"
      type="text"
      placeholder="请输入验证码"
      v-model="internalVerifyCode"
      class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
    />
    <button
      type="button"
      :disabled="isButtonDisabled"
      :class="{
        'bg-green-100 text-green-600': !isButtonDisabled, // 激活状态
        'bg-gray-100 text-gray-400': isButtonDisabled,    // 非激活状态
        'py-2 px-3 rounded-md text-sm font-medium whitespace-nowrap flex-shrink-0 rounded-3xl': true // 基础样式
      }"
      @click="sendVerifyCode"
    >
      {{ buttonText }}
    </button>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';

const props = defineProps({
  modelValue: { // 绑定验证码输入框的值
    type: String,
    default: '',
  },
  // 模拟一个外部的手机号验证状态，当手机号有效时才能发送验证码
  isPhoneValid: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(['update:modelValue', 'sendCode']);

// 内部维护的验证码输入值
const internalVerifyCode = ref(props.modelValue);
watch(() => props.modelValue, (newVal) => {
  internalVerifyCode.value = newVal;
});
watch(internalVerifyCode, (newVal) => {
  emit('update:modelValue', newVal);
});


const countdown = ref(0); // 倒计时秒数
const isSending = ref(false); // 是否正在发送中或倒计时中

// 按钮是否应该被禁用
const isButtonDisabled = computed(() => {
  // 当手机号无效、正在发送中或处于倒计时时，禁用按钮
  return !props.isPhoneValid || isSending.value || countdown.value > 0;
});

// 按钮显示的文本
const buttonText = computed(() => {
  if (countdown.value > 0) {
    return `${countdown.value}s 重新获取`;
  }
  return '获取验证码';
});

let timer = null; // 计时器句柄

const startCountdown = () => {
  const startTime = Date.now();
  const duration = 60;
  
  // 保存倒计时状态到localStorage
  localStorage.setItem('verifyCodeCountdown', JSON.stringify({
    startTime,
    duration
  }));
  
  countdown.value = duration;
  isSending.value = true;
  
  // 清除现有计时器
  if (timer) {
    clearInterval(timer);
  }
  
  timer = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const remaining = duration - elapsed;
    
    if (remaining > 0) {
      countdown.value = remaining;
    } else {
      clearInterval(timer);
      timer = null;
      isSending.value = false;
      countdown.value = 0;
      localStorage.removeItem('verifyCodeCountdown');
    }
  }, 1000);
};

const sendVerifyCode = () => {
  if (isButtonDisabled.value) {
    return; // 如果按钮被禁用，不执行发送逻辑
  }
  
  // 在这里触发一个事件，通知父组件去发送验证码
  emit('sendCode'); 
};

// 暴露startCountdown方法给父组件
import { onUnmounted, defineExpose } from 'vue';

// 组件挂载时检查localStorage中的倒计时状态
onMounted(() => {
  const storedCountdown = localStorage.getItem('verifyCodeCountdown');
  if (storedCountdown) {
    const { startTime, duration } = JSON.parse(storedCountdown);
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const remaining = duration - elapsed;
    
    if (remaining > 0) {
      countdown.value = remaining;
      isSending.value = true;
      
      // 清除现有计时器
      if (timer) {
        clearInterval(timer);
      }
      
      // 恢复倒计时
      timer = setInterval(() => {
        const currentElapsed = Math.floor((Date.now() - startTime) / 1000);
        const currentRemaining = duration - currentElapsed;
        
        if (currentRemaining > 0) {
          countdown.value = currentRemaining;
        } else {
          clearInterval(timer);
          timer = null;
          isSending.value = false;
          countdown.value = 0;
          localStorage.removeItem('verifyCodeCountdown');
        }
      }, 1000);
    } else {
      // 倒计时已结束，清除localStorage
      localStorage.removeItem('verifyCodeCountdown');
    }
  }
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});

// 暴露方法给父组件
defineExpose({
  startCountdown
});

</script>

<style scoped>
/* 
  在这里可以放一些非 Tailwind CSS 能直接表达的复杂样式，
  但对于本例的需求，Tailwind CSS 已经足够。
  例如，如果你想自定义过渡效果，可以在这里添加。
*/
</style>