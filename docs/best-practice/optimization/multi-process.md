---
nav:
  title: 最佳实践
  order: 3
group:
  title: 构建优化
  order: 2
title: 多进程/多线程优化
order: 5
---

# 多进程/多线程优化

影响前端发布速度的有两个方面，一个是构建，一个就是压缩，把这两个东西优化起来，可以减少很多发布的时间。

## 多进程/多实例构建

运行在 Node.js 之上的 webpack 是单线程模式的，也就是说，webpack 打包只能逐个文件处理，当 webpack 需要打包大量文件时，打包时间就会比较漫长。

多进程/多实例构建的方案比较知名的有以下三种：

- thread-loader
- parallel-webpack
- HappyPack

### thread-loader

`thread-loader` 会将你的 `loader` 放置在一个 `worker` 池里面运行，每个 `worker` 都是一个单独的有 `600ms` 限制的 Node.js 进程。同时跨进程的数据交换也会被限制。

请在高开销的 `loader` 中使用，否则效果不佳。

实现原理：

- 每次 Webpack 解析一个模块，`thread-loader` 会将它及它的依赖分配给 worker 线程中
- 把这个 `loader` 放置在其他 loader 之前，放置在这个 `loader` 之后的 `loader` 就会在一个单独的 worker 池（worker pool）中运行

在 worker 池（worker pool）中运行的 `loader` 是收到限制的。例如：

- 这些 `loader` 不能产生新的文件
- 这些 `loader` 不能使用定制的 `loader` API（也就是通过插件）
- 这些 `loader` 无法获取 Webpack 的选项设置

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        // 创建一个 js worker 池
        use: ['thread-loader', 'babel-loader'],
      },
      {
        test: /\.s?css$/,
        exclude: /node_modules/,
        // 创建一个 css worker 池
        use: [
          'style-loader',
          'thread-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]--[hash:base64:5]',
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
      },
      // ...
    ],
    // ...
  },
  // ...
};
```

更多配置请参阅：[thread-loader](https://github.com/webpack-contrib/thread-loader)

> 官方上说每个 worker 大概都要花费 600ms ，所以官方为了防止启动 worker 时的高延迟，提供了对 worker 池的优化：**预热**

### happypack

由于有大量文件需要解析和处理，构建是文件读写和计算密集型的操作，特别是当文件数量变多后，Webpack 构建慢的问题会显得严重。文件读写和计算操作是无法避免的，那能不能让 Webpack 同一时刻处理多个任务，发挥多核 CPU 电脑的威力，以提升构建速度呢？

[HappyPack](https://github.com/amireh/happypack)  就是利用多线程对文件进行打包，其处理思路是将原有的 Webpack 对 `loader` 的执行过程从单一进程的形式扩展多进程模式，原本的流程保持不变，多个子进程并发的执行，子进程处理完后再把结果发送给主进程。

```jsx | inline
import React from 'react';
import img from '../../assets/performance/haapypack-workflow.png';

export default () => <img alt="HappyPack运行架构图" src={img} width={640} />;
```

注意：

- 由于 HappyPack 对 `file-loader`、`url-loader` 支持的不友好，所以不建议对这些 `loader` 使用
- 使用 HappyPack 只兼容部分主流的 `loader`，具体可以查看官方给出的 [兼容性列表](https://github.com/amireh/happypack/wiki/Loader-Compatibility-List)

配置示例：

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

<br />

说明：

- 在 `loader` 配置中：所有文件的处理都交给了 `happypack/loader` 去处理，使用紧跟其后的 `querystring?id=babel` 去告诉 `happypack/loader` 去选择哪个 HappyPack 实例去处理文件。
- 在 `plugin` 配置中：新增了两个 HappyPack 实例分别用于告诉 `happypack/loader` 去如何处理 `.js` 和 `.css` 文件。选项中的 `id` 属性的值和上面 `querystring` 中的 `?id=babel` 相对应，选项中的 `loaders` 属性和 `Loader` 配置中一样。

<br />

```jsx | inline
import React from 'react';
import img from '../../assets/performance/happypack.png';

export default () => <img alt="HappyPack编译运行流程图" src={img} width={800} />;
```

更详细的运行原理请参阅 [淘宝前端团队：HappyPack 原理解析](https://fed.taobao.org/blog/taofed/do71ct/happypack-source-code-analysis/)

另外，当你的项目不是很复杂时，不需要配置 happypack，因为进程的分配和管理也需要时间，并不能有效提升构建速度，甚至会变慢。

## 多进程/多实例并行压缩代码

并行压缩主流有以下三种方案：

- `terser-webpack-plugin` 开启 `parallel` 参数 （推荐使用这个，支持 ES6 语法压缩）
- `parallel-uglify-plugin` 插件
- `uglifyjs-webpack-plugin` 开启 `parallel` 参数

### TerserWebpackPlugin

压缩是发布前处理最耗时间的一个步骤，如果是你是在 Webpack 4 中，只要几行代码，即可加速你的构建发布速度。

`terser-webpack-plugin` 是一个使用 `terser` 压缩 JS 的 Webpack 插件。开启 `parallel` 参数，使用多进程并行运行来提高构建速度。

默认并发运行数：`os.cpus().length - 1`

> 并行化可以显著提高构建速度，因此强烈建议使用。

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

### ParallelUglifyPlugin

实现原理：这个插件可以帮助具有许多入口点的项目加速构建。随 Webpack 提供的 `uglify.js` 插件在每个输出文件上按顺序运行。这个插件与每个可用 CPU 的一个线程并行运行 `uglify`。这可能会导致显著减少构建时间，因为最小化是 CPU 密集型的。

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

> ⚠️ 注意：插件官方已推荐使用 [TerserWebpackPlugin](#TerserWebpackPlugin) 代替。

[uglifyjs-webpack-plugin](https://github.com/webpack-contrib/uglifyjs-webpack-plugin) 开启 `parallel` 参数。

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

## 参考资料

- [📝 Webpack 系列二：优化 90% 的构建速度](https://github.com/sisterAn/blog/issues/63)
- [📝 淘宝前端团队：HappyPack 原理解析](https://fed.taobao.org/blog/taofed/do71ct/happypack-source-code-analysis/)
- [📝 HappyPack 原理解析](https://segmentfault.com/a/1190000021037299)
