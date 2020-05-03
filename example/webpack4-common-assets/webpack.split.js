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
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html'),
      filename: 'index.html',
      // 使用 SplitChunksPlugin 方法分离包需要打开
      chunks: ['index', 'vendors'],
      inject: true,
    }),
  ],
  // 提取页面公共资源
  optimization: {
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        commons: {
          test: /(react|react-dom)/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },

  // optimization: {
  //   splitChunks: {
  //     // async：异步引入的库进行分离（默认）
  //     // initial：同步引入的库进行分离

  //     // all：所有引入的库进行分离（推荐）
  //     chunks: 'async',
  //     // 抽离的公共包最小的大小，单位字节
  //     minSize: 30000
  //     // 最大的大小
  //     maxSize: 0,
  //     // 资源使用非次数（在多个页面使用到），大于 1，最小使用次数
  //     minChunks: 1,
  //     // 并发请求的数量
  //     maxAsyncRequests: 5,
  //     // 入口文件做代码分割最多能分成 3 个 jS 文件
  //     maxInitialRequests: 3,
  //     // 文件生成时的连接符
  //     automaticNameDelimiter: '~',
  //     // 自动命名的最大长度
  //     automaticNameMaxLength: 30,
  //     // 让 cacheGroups 里的设置的名字有效
  //     name: true,
  //     // 当打包同步代码时，上面的参数生效
  //     cacheGroups: {
  //       commons: {
  //         test: /(react|react-dom)/,
  //         name: 'vendors',
  //         chunks: 'all',
  //       },
  //       default: {
  //         minChunks: 2,
  //         priority: -20,
  //         // 如果一个模块已经打包过了，那么再打包时就忽略这个模块
  //         reuseExistingChunk: true
  //       }
  //     },
  //   },
  // },
};
