# webpack4-common-assets

基于 React、ReactDOM

## 基础库分离

思路：将 React、ReactDOM 基础包通过 CDN 引入，不打入 bundle 中

方法：使用 html-webpack-externals-plugin

安装依赖：

```bash
npm install html-webpack-externals-plugin -D
```

可以通过注释 optimization 和 plugins 中的 HtmlWebpackExternalsPlugin 实例，对比有和没的打包体积大小。

-

## 利用 SplitChunksPlugin 进行公共脚本分离

Webpack4 内置，替代 CommonChunkPlugin 插件

chunks 参数说明：

- async 异步引入的库进行分离（默认）
- initial 同步引入的库进行分离
- all 所有引入的库进行分离（推荐）
