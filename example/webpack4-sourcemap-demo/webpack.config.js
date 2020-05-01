'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html'),
      filename: 'index.html',
      inject: true,
    }),
  ],

  // 1.放到 JS 打包的输出文件，末尾添加注释指向文件
  // devtool: 'eval',

  // 2.输出 SourceMap 文件，与 JS 文件分离，末尾会告诉 JS 使用 SourceMap 文件
  // devtool: 'sourcemap',

  // 3.把 SourceMap 放在 JS 打包的输出文件中
  // devtool: 'inline-source-map',

  // 4.
  // devServer: {
  //   contentBase: './dist',
  //   hot: true
  // },
  // devtool: 'source-map',

  // 5.
  devServer: {
    contentBase: './dist',
    hot: true
  },devtool: 'cheap-source-map'

};
