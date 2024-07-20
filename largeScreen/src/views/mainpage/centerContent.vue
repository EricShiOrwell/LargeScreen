<script setup>
import { ref } from 'vue';
const props = defineProps(['configItem'])
const value = ref('')
</script>

<template>
    <div style="width: 100%;height: 60%;">
        <!-- <emap></emap> -->
    </div>
    <div class="log-box">
        <img src="@/assets/img/box.png" />
        <a-textarea v-model:value="value" placeholder="等待日志输出" :disabled="true" />
    </div>
</template>
<style>
.log-box {
    margin-top: 24px;
    padding: 24px;
    width: 100%;
    height: calc(40% - 24px);
    position: relative;
    /* background-image: url('@/assets/img/box.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center top; */
}

.log-box img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: fill;
}

.log-box textarea {
    border: none;
    height: 100%;
    color: #fff !important;
}

.log-box textarea::placeholder {
    color: #909090;
    /* 灰色的placeholder文本 */
}
</style>