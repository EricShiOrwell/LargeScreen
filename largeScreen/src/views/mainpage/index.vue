<script setup>
// import myContent from './myContent.vue';
import myHeader from './myHeader.vue';
import myMenu from './menu.vue';
import { onMounted, ref } from 'vue';
import emap from '@/components/emap.vue'

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
      <my-header></my-header>
    </a-layout-header>
    <a-layout>
      <a-layout-content :style="contentStyle">
        <emap></emap>
      </a-layout-content>
      <a-layout-sider>
        <myMenu></myMenu>
      </a-layout-sider>
    </a-layout>
  </a-layout>
</template>
