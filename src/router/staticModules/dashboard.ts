import type { RouteRecordRaw } from 'vue-router';
import RouterView from '@/layout/routerView/index.vue';
import { t } from '@/hooks/useI18n';

const moduleName = 'dashboard';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/dashboard',
    name: moduleName,
    redirect: '/dashboard/welcome',
    component: RouterView,
    meta: {
      title: t('routes.dashboard.dashboard'),
      icon: 'icon-yibiaopan',
    },
    children: [
      {
        path: 'welcome',
        name: `${moduleName}-welcome`,
        meta: {
          title: t('routes.dashboard.workbench'),
          icon: 'icon-shouye',
        },
        component: () =>
          import(/* webpackChunkName: "dashboard-welcome" */ '@/views/dashboard/welcome/index.vue'),
      },
      {
        path: 'analysis',
        name: 'Analysis',
        component: () => import('@/views/dashboard/welcome/Analysis.vue'),
        meta: { icon: 'icon-shijuexianshi', title: '分析页', permission: ['dashboard'] },
      },
      {
        path: 'monitor',
        name: 'Monitor',
        component: () => import('@/views/dashboard/welcome/Monitor.vue'),
        meta: { icon: 'icon-neironganquan', title: '监控页（外部）', permission: ['dashboard'] },
      },
    ],
  },
];

export default routes;
