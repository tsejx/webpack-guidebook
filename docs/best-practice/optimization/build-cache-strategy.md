---
nav:
  title: 最佳实践
  order: 3
group:
  title: 构建优化
  order: 2
title: 构建缓存策略
order: 3
---

# 构建缓存策略

目的：提升二次构建速度

缓存思路：

- babel-loader 开启缓存
- terser-webpack-plugin 开启缓存
- 使用 cache-loader 或者 hard-source-webpack-plugin

## babel-loader 开启缓存

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

## terser-webpack-plugin

[terser-webpack-plugin](https://github.com/webpack-contrib/terser-webpack-plugin)

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

## cache-loader

在一些性能开销较大的 loader 之前添加 [cache-loader](https://github.com/webpack-contrib/cache-loader)，将结果缓存中磁盘中。默认保存在 `node_modueles/.cache/cache-loader` 目录下。

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
