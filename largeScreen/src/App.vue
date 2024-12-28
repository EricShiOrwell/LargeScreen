<script setup>
import { RouterView } from 'vue-router'
import { theme } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
const locale = zhCN
</script>

<template>
  <a-config-provider
  :locale="locale"
  :theme="{
    algorithm: theme.darkAlgorithm,
  }"
>
  <RouterView />
  </a-config-provider>
</template>
