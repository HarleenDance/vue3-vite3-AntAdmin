<template>
  <iframe
    src="https://v3.cn.vuejs.org/guide/introduction.html"
    frameborder="0"
    data-v-8b9736ce=""
    style="width: 100%; height: 99%"
  ></iframe>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons-vue';
  import { useRoute, useRouter } from 'vue-router';
  import { message, Modal } from 'ant-design-vue';
  import { useUserStore } from '@/store/modules/user';
  import { getImageCaptcha } from '@/api/login';
  import { to } from '@/utils/awaitTo';

  const state = reactive({
    loading: false,
    captcha: '',
    formInline: {
      username: '',
      password: '',
      verifyCode: '',
      captchaId: '',
    },
  });
  const visible = ref(false);

  const route = useRoute();
  const router = useRouter();

  const userStore = useUserStore();
</script>

<style lang="less" scoped></style>
