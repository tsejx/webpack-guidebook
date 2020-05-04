---
nav:
  title: 最佳实践
  order: 3
group:
  title: 构建优化
  order: 2
title: 多进程/多实例构建
order: 2
---

# 多进程与多实例

影响前端发布速度的有两个方面，一个是构建，一个就是压缩，把这两个东西优化起来，可以减少很多发布的时间。

## 多进程/多实例构建

多进程/多实例构建的方案比较知名的有以下三种：

- thread-loader
- parallel-webpack
- HappyPack

### thread-loader

`thread-loader` 会将你的 loader 放置在一个 Worker 池里面运行，以达到多线程构建。

把这个 loader 放置在其他 loader 之前，放置在这个 loader 之后的 loader 就会在一个单独的 worker 池中运行。

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: 3,
            },
          },
          'babel-loader',
        ],
      },
    ],
  },
};
```

每个 worker 都是一个单独的有 600ms 限制的 Node.js 进程。同时跨进程的数据交换也会被限制。请在高开销的 loader 中使用，否则效果不佳。

更多配置请参阅：[thread-loader](https://github.com/webpack-contrib/thread-loader)

### happypack

由于运行在 Node.js 之上的 Webpack 是单线程模型的，所以通过 Webpack 处理的事情需要逐件去做，不能同时处理多个任务。

我们需要 Webpack 能同时处理多个任务，发挥多核 CPU 电脑的威力，[HappyPack](https://github.com/amireh/happypack)  就能让 Webpack 做到这点，它把任务分解给 **多个子进程** 去并发的执行，子进程处理完后再把结果发送给主进程。

> 提示：由于 HappyPack 对 file-loader、url-loader 支持的不友好，所以不建议对该 loader 使用。

🌰 **加载配置：**

```js
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpu().length });

// 省略其余配置
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/,
        // 把对 .less 的文件处理交给 id 为 less 的 HappyPack 的实例执行
        loader: ExtractTextPlugin.extract(
          'style',
          path.resolve(__dirname, './node_modules', 'happypack/loader' + '?id=less'),
        // 排除 node_modules 目录下的文件
        exclude: /node_modules/
        ),
      },
    ]
  },
  plugins: [
    new HappyPack({
      // 用 ID 来标识 happupack 处理相关 loader
      id: 'less',
      // 如何处理  用法和 loader 的配置一样
      loaders: ['css!less'],
      // 共享进程池
      threadPool: happyThreadPool,
      cache: true,
      // 允许 HappyPack 输出日志
      verbose: true
    })
  ],
};
```

- 在 **Loader** 配置中，所有文件的处理都交给了 `happypack/loader` 去处理，使用紧跟其后的 querystring `?id=babel` 去告诉 `happypack/loader` 去选择哪个 HappyPack 实例去处理文件。
- 在 **Plugin** 配置中，新增了两个 HappyPack 实例分别用于告诉 `happypack/loader` 去如何处理 `.js` 和 `.css` 文件。选项中的 `id` 属性的值和上面 querystring 中的 `?id=babel` 相对应，选项中的 `loaders` 属性和 `Loader` 配置中一样。

```jsx | inline
import React from 'react';
import img from '../../assets/performance/happypack.png';

export default () => <img alt="HappyPack编译运行流程图" src={img} width={880} />;
```

更详细的运行原理请参阅 [淘宝前端团队：HappyPack 原理解析](https://fed.taobao.org/blog/taofed/do71ct/happypack-source-code-analysis/)

## 多进程/多实例并行压缩代码

并行压缩主流有以下三种方案：

- `parallel-uglify-plugin` 插件
- `uglifyjs-webpack-plugin` 开启 `parallel` 参数
- `terser-webpack-plugin` 开启 `parallel` 参数 （推荐使用这个，支持 ES6 语法压缩）

### ParallelUglifyPlugin

```js
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

module.exports = {
  plugins: [
    new ParallelUglifyPlugin({
      uglifyJS: {
        output: {
          beautify: false,
          comments: false,
        },
      },
      compress: {
        warnings: false,
        drop_console: true,
        collapse_vars: true,
        reduce_vars: true,
      },
    }),
  ],
};
```

### UglifyJSWebpackPlugin

[uglifyjs-webpack-plugin](https://github.com/webpack-contrib/uglifyjs-webpack-plugin) 开启 `parallel` 参数

```js
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  plugins: [
    new UglifyJsPlugin({
      uglifyOptions: {
        warnings: false,
        parse: {},
        compress: {},
        mangle: true,
        output: null,
        toplevel: false,
        nameCache: null,
        ie8: false,
        keep_fnames: false,
      },
      parallel: true,
    }),
  ],
};
```

### TerserWebpackPlugin

支持压缩 ES6 语法

`terser-webpack-plugin` 是一个使用 `terser` 压缩 JS 的 Webpack 插件。

压缩是发布前处理最耗时间的一个步骤，如果是你是在 Webpack 4 中，只要几行代码，即可加速你的构建发布速度。

```js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        // 多线程
        parallel: 4,
      }),
    ],
  },
};
```

---

**参考资料：**

- [📝 淘宝前端团队：HappyPack 原理解析](https://fed.taobao.org/blog/taofed/do71ct/happypack-source-code-analysis/)
