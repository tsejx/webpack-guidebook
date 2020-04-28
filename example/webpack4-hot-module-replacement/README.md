# webpack4-hot-module-replacement

安装依赖：

```bash
npm install webpack-dev-server
```

HotModuleReplacementPlugin 是 webpack 的內置插件，所以不用额外安裝依赖

```js
const webpack = require('webpack');

module.exports = {
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    contentBase: '/dist',
    hot: true,
  },
};
```

npm scripts 添加命令

```json
"scripts": {
    "dev": "webpack-dev-server --open"
}
```

## webpack-dev-middleware

WDM 将 webpack 输出的文件传输给服务器

适用于灵活的定制场景
