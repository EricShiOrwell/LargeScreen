<script setup>
import { DatabaseFilled, LogoutOutlined, HomeOutlined } from '@ant-design/icons-vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'
import excel from '@/components/excel.vue'
// import { request } from '@/assets/myfetch.js'

// import Handsontable from "handsontable";
// import 'handsontable/dist/handsontable.full.css';

const router = useRouter()
const headerStyle = {
  textAlign: 'left',
  color: '#fff',
  height: '60',
};
const contentStyle = {
};
function logout() {
  sessionStorage.removeItem('token')
  router.push('/login')
}

function gotohome() {
  router.push('/')
}

// request({
//   url: '/api/getCsv'
// })
</script>

<template>
  <a-layout :style="{ height: '100%' }" class="large-Screen-manage">
    <a-layout-header :style="headerStyle">
      <a-flex justify="space-between" align="center">
        <h1>
          <DatabaseFilled style="margin-right: 16px;" />数据管理
        </h1>
        <h1>
          <a-tooltip placement="bottom">
            <template #title>
              <span>主页</span>
            </template>
            <a-button type="link" @click="gotohome"> <template #icon>
                <HomeOutlined />
              </template></a-button>
          </a-tooltip>
          <a-tooltip placement="bottom">
            <template #title>
              <span>登出</span>
            </template>
            <a-button type="link" @click="logout"> <template #icon>
                <LogoutOutlined />
              </template></a-button>
          </a-tooltip>
        </h1>
      </a-flex>
    </a-layout-header>
    <a-layout-content :style="contentStyle">
      <div class="excel-page">
        <excel></excel>
        <!-- <a-row>
          <a-col :span="12">
            <excel></excel>
          </a-col>
          <a-col :span="12">
            <excel></excel>
          </a-col>
        </a-row> -->
      </div>
    </a-layout-content>
  </a-layout>
</template>
<style scoped>
.excel-page {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 12px;
  /* min-width: 1000px; */
}

.excel-page .ant-row {
  height: 100%;
}
</style>
