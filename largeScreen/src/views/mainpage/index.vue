<script setup>
import myContent from './myContent.vue';
import myHeader from './myHeader.vue';
import myFooter from './myFooter.vue';
import { onMounted, ref } from 'vue';
const configItem = ref(window.configItem)
// onMounted(() => {
//   fetch('/config.json').then(response => {
//     return response.json()
//   }).then(data => {
//     debugger
//     if (data.configItem) {
//       configItem.value = data.configItem
//     } else {
//       alert('配置文件缺失')
//     }
//   }).catch((err) => {
//     alert('配置文件缺失')
//   })
// })
const headerStyle = {
  textAlign: 'center',
  color: '#fff',
  height: '5vw',
  paddingInline: 0,
  lineHeight: '5vw',
};
const contentStyle = {
  textAlign: 'center',
  minHeight: 120,
  color: '#fff',
  backgroundColor: 'var(--bg-color-black)',
  // overflowY: 'auto',
  paddingTop: '14px'
};
const footerStyle = {
  color: '#fff',
  height: '48px',
  padding: 0,
  backgroundColor: 'var(--bg-color-black)'
};
</script>

<template>
  <a-layout :style="{ height: '100%' }" class="large-Screen">
    <a-layout-header :style="headerStyle">
      <my-header :configItem="configItem"></my-header>
    </a-layout-header>
    <a-layout-content :style="contentStyle">
      <my-content :configItem="configItem"></my-content>
    </a-layout-content>
    <a-layout-footer :style="footerStyle">
      <my-footer></my-footer>
    </a-layout-footer>
  </a-layout>
</template>
