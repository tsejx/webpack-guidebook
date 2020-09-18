const config = {
  mode: 'site',
  title: 'Webpack Guidebook',
  description: 'Webpack 完全知识体系',
  base: '/webpack-guidebook/',
  publicPath: '/webpack-guidebook/',
  favicon: './favicon.ico',
  logo: 'http://img.mrsingsing.com/webpack-guidebook-favicon.svg',
  exportStatic: {},
  dynamicImport: {},
  navs: [
    null,
    {
      title: 'Github',
      path: 'https://github.com/tsejx/webpack-guidebook',
    },
  ],
};

if (process.env.NODE_ENV !== 'development') {
  config.ssr = {};
}

export default config;
