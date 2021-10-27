---
nav:
  title: 最佳实践
  order: 3
group:
  title: 构建优化
  order: 2
title: 构建缓存策略
order: 4
---

# 构建缓存策略

在 Webpack 中基于万物皆模块的思想，所谓的 `loader` 其实就是把一个模块转换成另一种形式的模块，甚至可以简单的理解 Webpack 中的 `loader` 其实就是对文本字符串的处理，给指定的 `loader` 一个 `input`，`loader` 还你一个 `output`，有点函数式编程的内味了。因此所谓的 `babel-loader` 其实就是把一段 JavaScript 字符串转换成另一端 JavaScript 字符串。基于以上的前提，因此只要在转换的时候，<strong>记录下转换前的文件和转换后的文件，然后对比文件是否有改动，如果文件没有改动那就继续拿上次转换之后的文件</strong>，所以就跳过这一次转换的过程，大大提高了速度。

## babel-loader

[babel-loader](https://github.com/babel/babel-loader) 提供 `cacheDirectory` 字段启用转换结果缓存的功能，开启时缓存会存放在 `node_modules/.cache/babel-loader` 目录下。

配置示例：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader?cacheDirectory=true',
      },
    ],
  },
};
```

## cache-loader

在一些性能开销较大的 loader 之前添加 [cache-loader](https://github.com/webpack-contrib/cache-loader)，将结果缓存中磁盘中。默认保存在 `node_modueles/.cache/cache-loader` 目录下。

配置示例：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.ext$/,
        use: ['cache-loader', ...loaders],
        include: path.resolve('src'),
      },
    ],
  },
};
```

## terser-webpack-plugin

[terser-webpack-plugin](https://github.com/webpack-contrib/terser-webpack-plugin)

配置示例：

```js
const TerserWebpackPlugin = require('terser-webpack-plugin');

module.exports = {
  plugins: [
    new TerserWebpackPlugin({
      parallel: true,
      cache: true,
    }),
  ],
};
```

除了 TerserWebpackPlugin，Webpack 5+ 官方维护的 HtmlMinimizerWebpackPlugin、CssMinimizerWebpackPlugin 和 ImageMinimizerWebpackPlugin 等插件均提供可缓存的配置项。
