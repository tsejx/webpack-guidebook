'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HTMLInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin').default;

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /.js$/,
        loader: 'babel-loader',
      },
      {
        test: /.css$/,
        use: [
          {
            // https://github.com/webpack-contrib/style-loader
            loader: 'style-loader',
            options: {
              // 样式插入到 <head>
              insert: 'head',
              // 将所有的 style 标签合并成一个
              injectType: 'singletonStyleTag'
            }
          },
          'css-loader'
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html'),
      filename: 'index.html',
      inject: true,
    }),
    new HTMLInlineCSSWebpackPlugin(),
  ],
};
