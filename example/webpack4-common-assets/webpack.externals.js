'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');

module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.js'
  },
  module: {
    rules: [
      {
        test: /.js$/,
        use: 'babel-loader',
      },
    ],
  },
  plugins: [
    // 通过 CDN 方式引入
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'react',
          entry: 'https://unpkg.com/react@16.13.1/umd/react.production.min.js',
          global: 'React',
        },
        {
          module: 'react-dom',
          entry: 'https://unpkg.com/react-dom@16.13.1/umd/react-dom.production.min.js',
          global: 'ReactDOM',
        },
      ],
      files: ['index.html'],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html'),
      filename: 'index.html',
      // 使用 SplitChunksPlugin 方法分离包需要打开
      // chunks: ['index', 'vendors'],
      inject: true,
    }),
  ],
  // 提取页面公共资源
  // optimization: {
  //   splitChunks: {
  //     minSize: 0,
  //     cacheGroups: {
  //       commons: {
  //         test: /(react|react-dom)/,
  //         name: 'vendors',
  //         chunks: 'all',
  //       },
  //     },
  //   },
  // },
};
