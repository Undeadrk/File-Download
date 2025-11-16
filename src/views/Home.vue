<template>
  <div class="home-container">
    <div class="list-wrapper" v-if="fileItems.length > 0">
      <div class="item" v-for="file in fileItems" :key="file.id" @click="handleClick(file)">
        <div class="info">
          <span class="title">{{ file.name }}</span>
          <span class="size">{{ file.fileSize }}</span>
        </div>
        <img :src="getIcon(file)" :alt="file.type" class="type-icon-right">
      </div>
    </div>

    <!-- 空状态 -->
    <div class="empty-state" v-else>
      <img src="@/assets/icons/empty.svg" alt="Empty" class="empty-icon">
      <span class="empty-text">暂无文件</span>
    </div>
    <div class="download" @click="handleDownload">
      <span>下载当前</span>
    </div>
  </div>

  <UserInfoForm :node_id="route.query.id" v-if="isUserInfoFormVisible" @close="isUserInfoFormVisible = false" />

</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getIcon } from '@/utils/fileIcon';
import { fileDetaileApi, fileDownloadApi } from '@/apis/file_api';
import UserInfoForm from '@/components/UserInfoForm.vue';
import { showNotify } from 'vant';

import { USER_INFO_SUBMITTED } from '@/constants/storage_key.js';

const fileItems = ref([]);
const route = useRoute();
const router = useRouter();
const isUserInfoFormVisible = ref(false);

// 封装弹出UserInfoForm的方法
const showUserInfoForm = () => {
  showNotify({ type: 'danger', message: '请先提交领取资料' });
  isUserInfoFormVisible.value = true;
};

// 封装检查用户信息提交状态的方法
const checkUserInfoSubmitted = () => {
  const hasSubmitted = localStorage.getItem(USER_INFO_SUBMITTED);
  let isSubmittedValid = false;
  if (hasSubmitted) {
    try {
      const submitData = JSON.parse(hasSubmitted);
      const now = Date.now();
      const threeDays = 3 * 24 * 60 * 60 * 1000;
      isSubmittedValid = now - submitData.timestamp < threeDays;
    } catch (e) {
      // Invalid JSON, treat as expired
      isSubmittedValid = false;
    }
  }
  if (!isSubmittedValid) {
    // Clear invalid/expired item
    localStorage.removeItem(USER_INFO_SUBMITTED);
  }
  return isSubmittedValid;
};

onMounted(async () => {
  await loadFileItems();
});

// 监听路由变化，重新加载数据
watch(
  () => route.query.id,
  () => {
    loadFileItems();
  }
);

// 加载文件列表的函数
async function loadFileItems() {
  try {
    // 获取query中的id参数
    const id = route.query.id;
    fileItems.value = await fileDetaileApi(id);
    
  } catch (error) {
    console.error('加载文件列表失败:', error);
    showNotify({ type: 'danger', message: '加载文件列表失败，请稍后重试' });

  }
}

const fileClick = (file) => {
  // 仅当need_input为1时才需要弹出表单
  if (file.need_input === 1) {
    const isSubmittedValid = checkUserInfoSubmitted();
    if (!isSubmittedValid) {
      showUserInfoForm();
      return;
    }
  }
  fileDownloadApi(file, null);
}

const dirClick = (file) => {
  if(file.need_input == 1){
    const isSubmittedValid = checkUserInfoSubmitted();
    if (!isSubmittedValid) {
      showUserInfoForm();
      return;
    }
  }
  const id = file.id;
  router.push({
    name: 'Home',
    query: { id }
  });
};
const handleClick = (file) => {

  if (file.type === 'folder') {
    dirClick(file);
  } else {
    fileClick(file);
  }
}
const handleDownload = () => {
    // 检查localStorage中是否已经提交过信息（3天过期）
    const isSubmittedValid = checkUserInfoSubmitted();
    if (isSubmittedValid) {
      showNotify({ type: 'success', message: '您已提交过信息，可以直接下载' });
      // 可以在这里直接执行下载逻辑
      fileDownloadApi(fileItems.value, fileItems.value[0].parent_id)
    } else {
      showUserInfoForm();
    }
}

</script>

<style scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 100%; overflow-x: hidden; }
.home-container { min-height: 100vh; display: flex; flex-direction: column; background-color: #f0f2f5; align-items: flex-start; padding-bottom: 12vw; width: 100%; overflow-x: hidden; }
.list-wrapper { 
  width: 100%;
  padding: 3vw 0;
   }
.item {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 1vw;
  padding: 3.5vw 4vw;
  /* 调整这里：设置固定的左右外边距，而不是 auto */
  margin: 0 4vw 6vw 4vw; /* 上右下左外边距 */
  max-width: 300px;
  width: calc(65%); /* 100% 减去左右4vw的外边距 */
  min-height: 18vw;
  cursor: pointer;
}
.info { flex-grow: 1; display: flex; flex-direction: column; justify-content: center; margin-right: 3vw; min-width: 0; }
.title { font-size: 3.34vw; font-weight: 500; color: #333; white-space: normal; word-break: break-word; margin-bottom: 0.8vw; line-height: 1.3; }
        .size { font-size: 2.5vw; color: #888; }
        .type-icon-right { flex-shrink: 0; width: 11.48vw; height: 11.48vw; max-width: 55px; max-height: 55px; object-fit: contain; }
.download { width: 100%; height: 12vw; max-height: 55px; background-color: #07C160; color: white; font-size: min(4.17vw, 20px); font-weight: 600; display: flex; align-items: center; justify-content: center; position: fixed; bottom: 0; left: 0; right: 0; z-index: 100; box-shadow: 0 -0.5vw 1.5vw rgba(0, 0, 0, 0.1); }

/* 空状态样式 */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  width: 100%;
}

.empty-icon {
  width: 30vw;
  height: 30vw;
  max-width: 150px;
  max-height: 150px;
  margin-bottom: 15px;
  opacity: 0.6;
}

.empty-text {
  font-size: 4vw;
  color: #999;
  font-weight: 400;
}

@media (min-width: 480px) {
  .empty-text {
    font-size: 16px;
  }
}

@media (min-width: 480px) {
  .item {
    border-radius: 4px;
    padding: 16px 20px;
    margin: 0 20px 24px 20px; /* 例如，左右都是20px */
    width: 350px; /* 固定宽度，如果需要的话 */
    min-height: 80px;
  }
  .info { margin-right: 15px; }
  .title { font-size: 16px; margin-bottom: 4px; }
  .size { font-size: 12px; }
  .type-icon-right { width: 55px; height: 55px; object-fit: contain; }
}

</style>