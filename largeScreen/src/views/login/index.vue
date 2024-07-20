<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router'
import { Modal } from 'ant-design-vue';
import { request } from '@/assets/myfetch'
const router = useRouter()
const formState = reactive({
  username: '',
  password: '',
});
const onFinish = values => {
  request({
    url: '/api/login',
    data: values,
    method: 'POST'
  }).then(res => {
    sessionStorage.token = res.token
    router.push('/')
  }).catch(() => {
    Modal.error({
      title: '用户名密码错误',
    });
  })
};
const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};
</script>

<template>
  <div class="login-container">
    <div class="card">
      <h2>登录</h2>
      <a-form :model="formState" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off"
        @finish="onFinish" @finishFailed="onFinishFailed">
        <a-form-item label="用户名" name="username" :rules="[{ required: true, message: '请输入您的用户名!' }]">
          <a-input v-model:value="formState.username" />
        </a-form-item>

        <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入您的密码!' }]">
          <a-input-password v-model:value="formState.password" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 24 }" style="margin-top: 40px;">
          <a-button type="primary" html-type="submit" :block="true">登录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<style>
.login-container {
  display: flex;
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  height: 100vh;
  /* 或者其他高度值，确保父元素有高度 */
  background-image: url('/loginbg.jpg');
  background-size: cover;
  background-position: center;
}

.card {
  background-color: #000;
  color: #fff;
  padding: 40px;
  border-radius: 10px;
  position: relative;
  z-index: 1;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.login-container .ant-form-item .ant-form-item-label>label {
  color: #fff;
}

/* .card-glow {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0 0 10px 10px;
  z-index: -1;
} */

/* 标题和内容样式可以根据需要自定义 */
.card h2 {
  margin: 0 0 40px 0;
  text-align: center;
}
</style>