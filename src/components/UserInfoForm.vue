<template>
  <div class="fixed inset-0 bg-black bg-opacity-85 flex items-center justify-center">
    <div class="form-panel bg-white p-4 rounded-2xl flex flex-col overflow-hidden min-w-80 max-w-md">
      <!-- 可以在这里添加内容 -->
       <!-- 表单标题 -->
        <div class="text-xl mb-4"> 领取资料 </div>
        <div class="form-container flex-1 overflow-y-auto p-4">
          <CustomInput v-model="userInfo.name" label="姓名" placeholder="请输入宝宝姓名" required />
          <CustomInput v-model="userInfo.phone" label="手机号" placeholder="请输入手机号" required />
          <!-- 使用VerifyCodeInput组件 -->
          <VerifyCodeInput
            ref="verifyCodeInputRef"
            v-model="userInfo.verifyCode"
            :is-phone-valid="isPhoneValid"
            @send-code="handleSendCode"
          />
          <!-- 使用 GradeSelector 组件 -->
          <GradeSelector
            v-model="userInfo.grade"
            label="年级"
            placeholder="请选择年级"
            required
            :errorMessage="gradeErrorMessage"
          />
          <!-- <p class="mt-4 font-bold text-lg">下划屏幕继续登记信息!</p>  -->
        </div>
        <div class="submit-panel h-1/4 w-full flex flex-col justify-between items-center">
          <div class="submit-btn rounded-b-sm mt-5" @click="handleSubmit">提交</div>
          <div class="acceptance-container flex items-center m-3">
            <input type="checkbox" v-model="userInfo.acceptance" class="checkmark" />
            <div class="acceptance-text text-sm">
              <span class="text-gray-400">我已阅读并接受</span>
              <a href="#" class="terms-link">《用户服务条款》</a>
              和
              <a href="#" class="terms-link">《隐私政策》</a>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed, watch, defineProps, defineEmits, defineExpose } from 'vue'
import CustomInput from '@/components/CustomInput.vue'
import GradeSelector from '@/components/GradeSelector.vue'
import VerifyCodeInput from '@/components/VerifyCodeInput.vue'
import { UserInfo } from '@/types/userInfo';
import { sendVerifyCode, verifyCode, saveUserInfo } from '@/apis/auth_api.js';
import { showNotify } from 'vant';
import { USER_INFO_SUBMITTED } from '@/constants/storage_key.js';

// 需要获取到上层传过来的node_id
const props = defineProps({
  node_id: {
    type: String,
    default: '',
  },
});

// 定义事件
const emit = defineEmits(['close']);

let userInfo = reactive(new UserInfo());
userInfo.node_id = props.node_id;
console.log(userInfo);
/* 
// 防抖函数实现
const debounce = (func, delay) => {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

// userInfo 属性变化监听（带防抖）
watch(userInfo, debounce((newValue) => {
  console.log('UserInfo changed:', newValue);
}, 300), { deep: true });

 */
// 错误信息列表
const errorMessages = ref([]);

// 年级选择器错误信息
const gradeErrorMessage = computed(() => {
  return errorMessages.value.find(msg => msg.includes('年级')) || '';
});


// 获取VerifyCodeInput组件实例
const verifyCodeInputRef = ref(null);

// 计算手机号是否有效
const isPhoneValid = computed(() => {
  if (!userInfo.phone || userInfo.phone.trim() === '') return false;
  // 简单的手机号正则验证
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(userInfo.phone.trim());
});

// 发送验证码的处理函数
const handleSendCode = async () => {
  try {
    // 调用发送验证码API
    await sendVerifyCode(userInfo.phone);
    console.log('验证码发送成功');
    
    // 仅在API调用成功时才开始冷却期
    verifyCodeInputRef.value?.startCountdown();
  } catch (error) {
    // 捕获API调用异常并处理
    showNotify({ type: 'danger', message: '验证码发送失败，请稍后重试或通知管理员处理' });
    // 可以在这里添加用户友好的错误提示
  }
};
const handleSubmit = async () => {
  // 首先必须确保同意用户服务条款和隐私政策,未同意则提示用户
  if(!userInfo.acceptance){
    showNotify({ type: 'danger', message: '请先同意用户服务条款和隐私政策' });
    return
  }

  // 检测是表单中的东西是不是都完事了
  let validResult = userInfo.check()
  if(!validResult.isValid){
    showNotify({ type: 'danger', message: validResult.message });
    return
  }
  // 格式无误，验证手机号和验证码是否正确
  try {
    const isVerifySuccess = await verifyCode(userInfo.phone, userInfo.verifyCode);
    if (isVerifySuccess) {
      // 验证码验证成功，保存用户信息
      await saveUserInfo(userInfo);
      // 在localStorage中添加标识符（3天过期）
      localStorage.setItem(USER_INFO_SUBMITTED, JSON.stringify({ value: true, timestamp: Date.now() }));
      showNotify({ type: 'success', message: '资料领取成功，现在可以随意下载啦' });
      // 关闭表单
      emit('close');
    } else {
      showNotify({ type: 'danger', message: '验证码错误' });
    }
  } catch (error) {
    showNotify({ type: 'danger', message: '提交失败，请稍后重试' });
    console.error('提交失败:', error);
  }
}



</script>
<style scoped>
.form-panel {
  width: 95vw;
  height: 55vh;
}
.submit-btn {
  width: 100%;
  background: linear-gradient(180deg, #1BDB9B 0%, #05BC79 100%);
  color: white;
  padding: 12px 0;
  border-radius: 9999px;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  box-shadow: 0 0 20px rgba(27, 219, 155, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  box-shadow: 0 0 30px rgba(27, 219, 155, 0.7);
  transform: translateY(-2px);
}

.submit-btn:active {
  transform: translateY(0);
}
/* 自定义复选框样式 */
.acceptance-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  user-select: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  background-color: #fff;
  border: 1px solid #D9D9D9;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  margin-right: 8px;
  outline: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.checkmark:checked {
  background: linear-gradient(180deg, #1BDB9B 0%, #05BC79 100%);
}

.checkmark:checked::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 5px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: translate(-50%, -50%) rotate(45deg);
  transform-origin: center;
}

/* 条款链接样式 */
.terms-link {
  color: #1BDB9B;
  text-decoration: none;
  transition: color 0.3s ease;
}

.terms-link:hover {
  text-decoration: underline;
}
</style>