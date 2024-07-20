<script setup>
defineProps({
    title: {
        type: String,
        required: true
    }
})
</script>

<template>
    <div class="sub-title">
        <h1>{{ title }}</h1>
    </div>
</template>

<style scoped>
.sub-title {
    width: 100%;
    line-height: 32px;
    background-image: url('@/assets/img/subtitle.png');
    background-size: contain;
    background-repeat: no-repeat;
    text-align: left;
    padding-left: 16px;
}

.sub-title h1 {
    font-size: 18px;
}
</style>
