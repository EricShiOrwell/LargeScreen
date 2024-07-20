<script setup>
import leftContent from '@/views/mainpage/leftContent.vue'
// import centerContent from './centerContent.vue';
import rightContent from './rightContent.vue';
const props = defineProps(['configItem'])
</script>

<template>
  <a-row style="height: 100%;">
    <a-col :span="8" style="height: 100%;">
      <leftContent :configItem="props.configItem"></leftContent>
    </a-col>
    <!-- <a-col :span="8">
      <centerContent></centerContent>
    </a-col> -->
    <a-col :span="16" style="text-align: left;padding-left: 12px;">
      <rightContent :configItem="props.configItem"></rightContent>
    </a-col>
  </a-row>
</template>