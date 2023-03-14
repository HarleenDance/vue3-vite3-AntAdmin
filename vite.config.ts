import { resolve } from 'node:path';
import { loadEnv } from 'vite';
import vueJsx from '@vitejs/plugin-vue-jsx';
import legacy from '@vitejs/plugin-legacy';
import vue from '@vitejs/plugin-vue';
import checker from 'vite-plugin-checker';
import { viteMockServe } from 'vite-plugin-mock';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import Unocss from 'unocss/vite';
import mkcert from 'vite-plugin-mkcert';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import dayjs from 'dayjs';
import DefineOptions from 'unplugin-vue-define-options/vite';
import pkg from './package.json';
import type { UserConfig, ConfigEnv } from 'vite';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import AutoImport from 'unplugin-auto-import/vite';
// import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
const CWD = process.cwd();
import OptimizationPersist from 'vite-plugin-optimize-persist';
import PkgConfig from 'vite-plugin-package-config';

// 环境变量
// const BASE_ENV_CONFIG = loadEnv('', CWD);
// const DEV_ENV_CONFIG = loadEnv('development', CWD);
// const PROD_ENV_CONFIG = loadEnv('production', CWD);

const __APP_INFO__ = {
  pkg,
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
};

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig => {
  // 环境变量
  const { VITE_BASE_URL, VITE_DROP_CONSOLE } = loadEnv(mode, CWD);

  const isBuild = command === 'build';
  return {
    base: VITE_BASE_URL,
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },

    resolve: {
      alias: [
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
        },
        {
          find: '@',
          replacement: resolve(__dirname, './src'),
        },
      ],
    },
    plugins: [
      AutoImport({
        // Auto import functions from Vue, e.g. ref, reactive, toRef...
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: ['vue'],

        // Auto import functions from Element Plus, e.g. ElMessage, ElMessageBox... (with style)
        // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
        resolvers: [
          // ElementPlusResolver(),

          // Auto import icon components
          // 自动导入图标组件
          IconsResolver({
            prefix: 'Icon',
          }),
        ],

        dts: resolve(resolve(__dirname, './src'), 'auto-imports.d.ts'),
      }),
      // https://github.com/antfu/unplugin-vue-components
      Components({
        resolvers: [
          AntDesignVueResolver({
            exclude: ['AButton'],
          }),
          // Auto register icon components
          // 自动注册图标组件
          IconsResolver({
            enabledCollections: ['ep'],
          }),
          // Auto register Element Plus components
          // 自动导入 Element Plus 组件
          // ElementPlusResolver(),
        ],

        // dts: resolve(resolve(__dirname, './src'), "components.d.ts"),
        // directoryAsNamespace: true,
      }),
      PkgConfig(),
      OptimizationPersist(),
      mkcert(),
      vue(),
      Unocss(),
      DefineOptions(), // https://github.com/sxzz/unplugin-vue-define-options
      vueJsx({
        // options are passed on to @vue/babel-plugin-jsx
      }),
      Icons({
        autoInstall: true,
      }),

      legacy({
        targets: ['defaults', 'not IE 11', 'chrome 79', 'maintained node versions'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
        // 根据你自己需要导入相应的polyfill:  https://github.com/vitejs/vite/tree/main/packages/plugin-legacy#polyfill-specifiers
        modernPolyfills: ['es.promise.finally', 'es/array', 'es/map', 'es/set'],
      }),
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [resolve(CWD, 'src/assets/icons')],
        // Specify symbolId format
        symbolId: 'svg-icon-[dir]-[name]',
      }),
      viteMockServe({
        ignore: /^_/,
        mockPath: 'mock',
        localEnabled: !isBuild,
        prodEnabled: isBuild,
        logger: true,
        injectCode: `
          import { setupProdMockServer } from '../mock/_createProductionServer';

          setupProdMockServer();
          `,
      }),

      // https://github.com/fi3ework/vite-plugin-checker
      checker({
        typescript: true,
        // vueTsc: true,
        eslint: {
          lintCommand: 'eslint "./src/**/*.{.vue,ts,tsx}"', // for example, lint .ts & .tsx
        },
      }),
    ],
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {},
          additionalData: `
            @import "ant-design-vue/lib/style/themes/default.less";
            @import "@/styles/variables.less";
          `,
        },
        // scss: {
        //   additionalData: `
        //   @use 'sass:math';
        //   @import "src/styles/global.scss";
        //   `,
        // },
      },
    },
    server: {
      host: '0.0.0.0',
      port: 8088,
      https: true,
      proxy: {
        '/api': {
          // target: 'http://175.178.67.107:7001',
          target: 'http://localhost:7001',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/ws-api': {
          // target: 'http://175.178.67.107:7002',
          target: 'http://localhost:7002',
          changeOrigin: true, //是否允许跨域
          ws: true,
        },
      },
    },
    optimizeDeps: {
      include: [
        '@vue/runtime-core',
        '@vue/shared',
        'lodash-es',
        'ant-design-vue/es/locale/zh_CN',
        'ant-design-vue/es/locale/en_US',
        'element-plus/es',
        'element-plus/es/components/config-provider/style/css',
        'element-plus/es/components/container/style/css',
        'element-plus/es/components/main/style/css',
        'element-plus/es/components/header/style/css',
        'element-plus/es/components/date-picker/style/css',
        'element-plus/es/components/drawer/style/css',
        'element-plus/es/components/image/style/css',
        'element-plus/es/components/image/style/css',
        'element-plus/es/components/table/style/css',
        'element-plus/es/components/table-column/style/css',
        'element-plus/es/components/input/style/css',
        'element-plus/es/components/dropdown/style/css',
        'element-plus/es/components/popover/style/css',
        'element-plus/es/components/dropdown-item/style/css',
        'element-plus/es/components/dropdown-menu/style/css',
        'element-plus/es/components/pagination/style/css',
        'element-plus/es/components/scrollbar/style/css',
        'element-plus/es/components/dialog/style/css',
        'element-plus/es/components/loading/style/css',
        'element-plus/es/components/tabs/style/css',
        'element-plus/es/components/tab-pane/style/css',
        'element-plus/es/components/select/style/css',
        'element-plus/es/components/option/style/css',
        'element-plus/es/components/divider/style/css',
        // `${optimizeDepsElementPlusIncludes}`
      ],
    },
    esbuild: {
      pure: VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : [],
      supported: {
        // https://github.com/vitejs/vite/pull/8665
        'top-level-await': true,
      },
    },
    build: {
      target: 'es2017',
      minify: 'esbuild',
      cssTarget: 'chrome79',
      chunkSizeWarningLimit: 2000,
    },
  };
};
