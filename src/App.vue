<template>
    <router-view></router-view>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { onMounted, onUnmounted } from 'vue';

const router = useRouter();

// 设备检测与跳转逻辑
const checkDeviceAndRedirect = () => {
  // 结合设备类型和屏幕宽度判断是否为移动端
  const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isMobileScreen = window.innerWidth < 768;
  const isMobile = isMobileDevice || isMobileScreen;
  
  // 获取当前路由信息
  const currentRoute = router.currentRoute.value;
  const currentRouteName = currentRoute.name;
  
  // 跳转逻辑：移动端→Mobile路由，PC端→PC路由，均保留当前查询参数
  if (isMobile && currentRouteName !== 'Mobile') {
    router.replace({ name: 'Mobile', query: currentRoute.query });
  } else if (!isMobile && currentRouteName === 'Mobile') {
    router.replace({ name: 'PC', query: currentRoute.query });
  }
};

onMounted(() => {
  // 初始加载时检测
  /* 
  checkDeviceAndRedirect();
  // 监听窗口大小变化
  window.addEventListener('resize', checkDeviceAndRedirect); 
  */
});

onUnmounted(() => {
  // 移除事件监听，避免内存泄漏
  /* window.removeEventListener('resize', checkDeviceAndRedirect); */
});

</script>

<style scoped>
:global(html, body, #app) {
  background-color: #f5f5f5;
}

</style>