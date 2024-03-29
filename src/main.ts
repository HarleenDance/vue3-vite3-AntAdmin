/*
 * @Descripttion:
 * @version: 18.1.2
 * @Author: Harleens
 * @Date: 2022-10-15 11:25:33
 * @LastEditors: Harleens
 * @LastEditTime: 2022-10-16 20:38:11
 */
import { createApp } from 'vue';
import App from './App.vue';
import { setupRouter } from './router';
import { setupStore } from '@/store';
import { setupI18n } from '@/locales';
import {
  setupAntd,
  setupAssets,
  setupDirectives,
  setupGlobalMethods,
  setupCustomComponents,
} from '@/plugins';
const app = createApp(App);

function setupPlugins() {
  // 注册全局常用的ant-design-vue组件
  setupAntd(app);
  // 引入静态资源
  setupAssets();
  // 注册全局自定义组件,如：<svg-icon />
  setupCustomComponents(app);
  // 注册全局自定义指令，如：v-permission权限指令
  setupDirectives(app);
  // 注册全局方法，如：app.config.globalProperties.$message = message
  setupGlobalMethods(app);
}

async function setupApp() {
  // 挂载vuex状态管理
  setupStore(app);
  // Multilingual configuration
  // Asynchronous case: language files may be obtained from the server side
  await setupI18n(app);
  // 挂载路由
  await setupRouter(app);

  app.mount('#app');
}

setupPlugins();

setupApp();
