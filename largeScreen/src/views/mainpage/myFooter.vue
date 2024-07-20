<script setup>

</script>

<template>
    <div class="footer-container">
        <div class="footer-left"></div>
        <div class="footer-right"></div>
    </div>
</template>
<style scoped>
.footer-container {
    width: 100%;
    height: 100%;
    display: flex;
    /* 使用flexbox布局 */
    justify-content: space-between;
    /* 水平空间分布，子元素之间的间隔相等 */
}

.footer-left {
    display: inline-block;
    width: 40%;
    height: 100%;
    background-image: url('@/assets/img/bottom.png');
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: left bottom;
}

.footer-right {
    display: inline-block;
    width: 40%;
    height: 100%;
    background-image: url('@/assets/img/bottom.png');
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: right bottom;
    transform: rotateY(180deg)
}
</style>