---
nav:
  title: 架构原理
  order: 2
group:
  title: 工作原理
  order: 1
title: 文件监听
order: 5
---

# 文件监听

Webpack 会轮询判断文件的最后编辑时间是否变化，当某个文件发生了变化，并不会立刻告诉监听者，而是先缓存起来，等 `aggregateTimeout`。

```js
module.export = {
  // 默认 false，也就是不开启
  watch: true,
  // 只有开启监听模式时，watchOptions 才有意义
  watchOptions: {
    // 默认为空，不监听的文件或者文件夹，支持正则匹配
    ignored: /node_modules/,
    // 监听到变化后会等 300ms 再去执行，默认 300ms
    aggregateTimeout: 300,
    // 判断文件是否发生变化是通过不停询问系统指定文件有没有变化实现的，默认每秒（1000ms）询问 1 次
    poll: 1000,
  },
};
```

每次都要刷新，有没有方法监听变化后，`自动更新 -> 热更新`。

Webpack 轮询会调用 Node.js 里面的文件读取 API `fs` 这个模块来判断文件内容是否变化。
