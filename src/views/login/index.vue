<template>
  <div class="login-box">
    <div class="login-logo">
      <!-- <svg-icon name="logo" :size="45" /> -->
      <img src="@/assets/images/logo.png" width="45" />
      <h1 class="mb-0 ml-2 text-3xl font-bold">欢迎来到 Harleen-admin! 👋🏻 </h1>
    </div>
    <a-form layout="horizontal" :model="state.formInline" @submit.prevent="handleSubmit">
      <a-form-item>
        <a-input v-model:value="state.formInline.username" size="large" placeholder="rootadmin">
          <template #prefix><user-outlined type="user" /></template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-model:value="state.formInline.password"
          size="large"
          type="password"
          placeholder="123456"
          autocomplete="new-password"
        >
          <template #prefix><lock-outlined type="user" /></template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-model:value="state.formInline.verifyCode"
          placeholder="验证码"
          :maxlength="4"
          size="large"
        >
          <template #prefix><SafetyOutlined /></template>
          <template #suffix>
            <img
              :src="state.captcha"
              class="absolute right-0 h-full cursor-pointer"
              @click="setCaptcha"
            />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" size="large" :loading="state.loading" block>
          登录
        </a-button>
      </a-form-item>
      <!-- <el-divider> 演示账号一键登录 </el-divider>
            <el-row class="row-bg" justify="center">
                <el-col :span="6">
                    <a-button size="small" @click="onSubmitEvent('rootadmin')"
                        >rootadmin</a-button
                    ></el-col
                >
                <el-col :span="6">
                    <a-button size="small" @click="onSubmitEvent('czmadmin')"
                        >czmadmin</a-button
                    ></el-col
                >
            </el-row> -->
    </a-form>
  </div>
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

  const setCaptcha = async () => {
    const { id, img } = await getImageCaptcha({ width: 100, height: 50 });
    state.captcha = img;
    state.formInline.captchaId = id;
  };
  setCaptcha();

  const handleSubmit = async () => {
    const { username, password, verifyCode } = state.formInline;
    if (username.trim() == '' || password.trim() == '') {
      return message.warning('用户名或密码不能为空！');
    }
    if (!verifyCode) {
      return message.warning('请输入验证码！');
    }
    message.loading('登录中...', 0);
    state.loading = true;
    console.log(state.formInline);
    // params.password = md5(password)

    const [err] = await to(userStore.login(state.formInline));
    if (err) {
      Modal.error({
        title: () => '提示',
        content: () => err.message,
      });
      setCaptcha();
    } else {
      message.success('登录成功！');
      setTimeout(() => router.replace((route.query.redirect as string) ?? '/'));
    }
    state.loading = false;
    message.destroy();
  };
  const onSubmitEvent = async (user) => {
    const formInline: Object = {
      username: user,
      password: '123456',
    };
    message.loading('登录中...', 0);
    state.loading = true;
    // params.password = md5(password)

    const [err] = await to(userStore.login(formInline));
    if (err) {
      Modal.error({
        title: () => '提示',
        content: () => err.message,
      });
      setCaptcha();
    } else {
      message.success('登录成功！');
      setTimeout(() => router.replace((route.query.redirect as string) ?? '/'));
    }
    state.loading = false;
    message.destroy();
  };
</script>

<style lang="less" scoped>
  .login-box {
    display: flex;
    width: 100vw;
    height: 100vh;
    padding-top: 240px;
    background: url('@/assets/login.svg');
    background-size: 100%;
    flex-direction: column;
    align-items: center;

    .font-bold {
      color: #fff;
    }

    .absolute {
      right: 3px;
      /* top: -10px; */
      margin-top: -8px;
      position: absolute;
    }

    .login-logo {
      display: flex;
      margin-bottom: 30px;
      align-items: center;

      .svg-icon {
        font-size: 48px;
      }
    }

    :deep(.ant-form) {
      width: 400px;

      .ant-col {
        width: 100%;
      }

      .ant-form-item-label {
        padding-right: 6px;
      }
    }
  }
</style>
