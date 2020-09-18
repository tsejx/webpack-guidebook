const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.vue',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      // 创建一个在内存汇总生成html页面的插件
      template: path.resolve('./src/index.html'), //指定模板页面,
      filename: 'index.html', //指定生成页面的名称
    }),
    new VueLoaderPlugin(),
  ],
};
