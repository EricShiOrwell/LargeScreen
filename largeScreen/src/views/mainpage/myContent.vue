<script setup>
import leftContent from '@/views/mainpage/leftContent.vue'
import { ref } from 'vue';
import { SwapOutlined } from '@ant-design/icons-vue';
// import centerContent from './centerContent.vue';
import rightContent from './rightContent.vue';
const props = defineProps(['configItem'])
const colControl = ref(8)

</script>

<template>
  <a-row style="height: 100%;">
    <a-col :span="colControl" style="height: 100%;">
      <a-button type="primary" style="position: absolute; right: 2px;" @click="() => {colControl = 0}" v-if="colControl === 8" title="缩进">
        <template #icon>
          <SwapOutlined />
        </template>
      </a-button>
      <leftContent :configItem="props.configItem"></leftContent>
    </a-col>
    <!-- <a-col :span="8">
      <centerContent></centerContent>
    </a-col> -->
    <a-col :span="24-colControl" style="text-align: left;padding-left: 12px;">
      <a-button type="primary" style="position: absolute; right: 2px;" @click="() => {colControl = 8}" v-if="colControl === 0" title="展开">
        <template #icon>
          <SwapOutlined />
        </template>
      </a-button>
      <rightContent :configItem="props.configItem"></rightContent>
    </a-col>
  </a-row>
</template>