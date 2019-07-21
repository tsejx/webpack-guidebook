const generateSidebar = require('./generateSidebar');
const name = 'webpack-guidebook';

const setPrefix = (base, route) => `${base}/${route}`;

module.exports = {
  base: `/${name}/`,
  head: [['link', { rel: 'icon', href: 'favicon.ico' }]],
  title: 'webpack-guidebook',
  port: 8030,
  themeConfig: {
    repo: 'tsejx/webpack-guidebook',
    logo: '/favicon.png',
    search: true,
    searchMaxSuggestions: 15,
    serviceWorker: {
      updatePopup: {
        message: '新内容已准备就绪',
        buttonText: '刷新',
      },
    },
    sidebar: [
      {
        title: '模块化',
        collapsable: false,
        children: ['build-tool', 'modularization', 'idealized-configuration'].map(r =>
          setPrefix('modularization', r)
        ),
      },
      {
        title: '配置',
        collapsable: false,
        children: [
          'mode',
          'entry',
          'dev-server',
          'output',
          'resolve',
          'module',
          'plugins',
          'other-options',
        ].map(r => setPrefix('configuration', r)),
      },
      {
        title: '运行原理',
        collapsable: false,
        children: [
          'workflow',
          // 'tree-shaking',
          // 'long-tern-cache',
          // 'mini-css-extract-plugin',
          'commons-chunk-plugin',
          'hot-module-replacement',
          'extensions',
        ].map(r => setPrefix('mechanism', r)),
      },
      {
        title: '实践',
        collapsable: false,
        children: ['ESLint', 'Babel', 'Framework'].map(r => setPrefix('practice', r)),
      },
    ],
    sidebarDepth: 2,
    lastUpdated: '最近更新时间',
  },

  vueThemes: {
    links: {
      github: 'https://github.com/tsejx/webpack-guidebook',
    },
  },
};
