<script setup>
import { LogoutOutlined } from '@ant-design/icons-vue';
import { onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router'

const props = defineProps(['configItem'])

const router = useRouter()
function gotoDataExcel() {
  router.push('/dataExcel')
}
function logout() {
  sessionStorage.removeItem('token')
  router.push('/login')
}
const showTimeString = ref('2024年1月1日 00:00:00')
function updateTime() {
  let now = new Date();
  let hours = now.getHours().toString().padStart(2, '0');
  let minutes = now.getMinutes().toString().padStart(2, '0');
  let seconds = now.getSeconds().toString().padStart(2, '0');
  showTimeString.value = now.getFullYear() + '年' + (now.getMonth() + 1) + '月' + now.getDate() + '日' + '  ' + hours + ':' + minutes + ':' + seconds;
  // document.getElementById('time').textContent = hours + ':' + minutes + ':' + seconds;
}

const timer = setInterval(updateTime, 1000);
onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <div class="header-container">
    <div class="header-bg">
      <div :style="{...props.configItem.module_title}">{{ props.configItem.module_title.text }}</div>
    </div>
    <div class="time-container">{{ showTimeString }}</div>
    <div class="dataexcel-link"><a-button type="link" @click="gotoDataExcel">数据库管理</a-button>

      <a-tooltip placement="bottom">
        <template #title>
          <span>登出</span>
        </template>
        <a-button type="link" @click="logout"> <template #icon>
            <LogoutOutlined />
          </template></a-button>
      </a-tooltip>
    </div>
  </div>
</template>
<style scoped>
.header-container {
  width: 100%;
  height: 100%;
  /* background-image: url('@/assets/img/title.png'); */
  background-image: url('@/assets/img/title.webp');
  background-size: 80%;
  background-repeat: no-repeat;
  background-position: center top;
  position: relative;
}

.header-bg {
  width: 100%;
  height: 100%;
  /* background-image: url('@/assets/img/title.webp'); */
  background-image: url('@/assets/img/title.png');
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center top;
}

.header-bg div {
  font-size: 2.5vw;
}

.time-container {
  position: absolute;
  top: 0.8vw;
  left: 0.8vw;
}

.dataexcel-link {
  position: absolute;
  top: 0.8vw;
  right: 0.8vw;
}
</style>