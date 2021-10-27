---
nav:
  title: 架构原理
  order: 2
group:
  title: 底层原理
  order: 2
title: Compiler
order: 5
---

# Compiler

Webpack 的 Compiler 模块是 <strong style="color:red">主引擎</strong>，它通过配置参数传递的所有选项，创建出一个 [compilation](./compilation) 实例。

Webpack 使用它来实例化 `compiler`，然后调用 `run` 方法。下面是一个可以使用 Compiler 简单示例。

代码示例：

```js
// 可以从 webpack package 中 import 导入
import { Compiler } from 'webpack';

// 创建一个新的 compiler 实例
const compiler = new Compiler();

// 填充所有必备的 options 选项
compiler.options = {
  // ...
};

// 创建一个插件
class LogPlugin {
  apply(compiler) {
    compiler.plugin('should-emit', (compilation) => {
      console.log('should I emit?');
      return true;
    });
  }
}

// 将 compiler 应用到插件中
new LogPlugin().apply(compiler);

/* 添加其他支持插件 */

// 运行结束后执行回调
const callback = (err, stats) => {
  console.log('Compiler 已经完成执行');
  // 显示 stats
};

// compiler 的 run 调用，并传入 callback
compiler.run(callback);
```

Compiler 也是我们所说的 Tapable 实例。通过这种实现机制，我们可以理解为，它混合（mix）了 `Tapable` 类，来使实例也具备 <strong style="color:red">注册</strong> 和 <strong style="color:red">调用插件</strong> 功能。大多数面向用户的插件，要首先在 Compiler 上注册。

Compiler 运行机制可以被提取为以下要点：

- 通常有一个 Compiler 的主实例。可以创建子 `compilers` 来委托特定任务
- 创建 `compiler` 的多数复杂度，在于为它填充所有相关的 `options` 选项
- Webpack 通过 `WebpackOptionsDefaulter` 和 `WebpackOptionsApply`，来专门为 `Compiler` 提供所需的所有 **初始数据**
- Compiler 是一个执行最简功能，来保证生命周期运行的函数。它把所有的 **加载（loading）** / **打包（bundling）** / **写入（writing）** 工作委托给各种插件
- `new LogPlugin(args).apply(compiler)` 将插件注册到 Compiler 生命周期中的任何特定钩子事件
- Compiler 暴露 `run` 方法，它启动了 Webpack 所有编译工作。在执行完成后，会调用传递给它的 `callback` 函数。记录 `stats` 和 `errors` 的所有末端工作，都在此回调函数中完成

## 多编译配置

MultiCompiler 模块允许 Webpack 在单个 compiler 中运行多个配置。如果 Webpack 的 Node.js API 中的 `options` 参数，是一个由 `options` 构成的数组，则 Webpack 会对其应用单个 `compiler`，并在所有 `compiler` 执行结束时，调用 `callback` 方法。

代码示例：

```js
const Webpack = require('webpack');

const config1 = {
  entry: './index1.js',
  output: {
    filename: 'bundle1.js',
  },
};

const config2 = {
  entry: './index2.js',
  output: {
    filename: 'bundle2.js',
  },
};

webpack([config1, config2], (err, stats) => {
  process.stdout.write(stats.toString() + '\n');
});
```

## 插件开发

开发插件首先要知道 `compiler` 和 `compilation` 对象是做什么的。

`Compiler` 对象包含了当前运行 Webpack 的配置，包括 `entry`、`output`、`loader` 等配置，这个对象在启动 Webpack 时被实例化，而且是全局唯一的。`Plugin` 可以通过该对象获取到 Webpack 的配置信息进行处理。

如果看完这段话，你还是没理解 `compiler` 是做啥的，不要怕。运行 `npm run build`，把 `compiler` 的全部信息输出到控制台上 `console.log(compiler)`。

```jsx | inline
import React from 'react';
import img from '../../assets/principle-analysis/console-compiler.png';

export default () => <img alt="Compiler对象实例" src={img} width={720} />;
```

[Compiler 源码精简版代码解析](https://github.com/webpack/webpack/blob/master/lib/Compiler.js)

## 生命周期钩子

列出 Compiler 暴露的所有事件钩子。

| 事件名称                 | 内容说明                               | 参数                     | 类型          |
| :----------------------- | :------------------------------------- | :----------------------- | :------------ |
| `entry-option`           | -                                      | -                        | basicResult   |
| `after-plugins`          | 设置完一组初始化插件之后               | `compiler`               | sync 同步     |
| `after-resolvers`        | 设置完 resolvers 之后                  | `compiler`               | sync 同步     |
| `environment`            | -                                      | -                        | sync 同步     |
| `after-environment`      | 环境设置完成                           | -                        | sync 同步     |
| `before-run`             | `compiler.run()` 开始                  | `compiler`               | async 异步    |
| `run`                    | 在读取记录之前                         | `compiler`               | async 异步    |
| `watch-run`              | 在开始编译之前，watch 之后             | `compiler`               | async 异步    |
| `normal-module-factory`  | 创建出一个 `NormalModuleFactory` 之后  | `normalModuleFactory`    | sync 同步     |
| `context-module-factory` | 创建出一个 `ContextModuleFactory` 之后 | `contextModuleFactory`   | sync 同步     |
| `before-compile`         | compilation 的参数已创建               | `compilationParams`      | async 异步    |
| `compile`                | 在创建新 compilation 之前              | `compilationParams`      | sync 同步     |
| `this-compilation`       | 在触发 `compilation` 事件之前          | `compilation`            | sync 同步     |
| `compilation`            | compilation 创建完成                   | `compilation`            | sync 同步     |
| `make`                   | -                                      | `compilation`            | parallel 平行 |
| `after-compile`          | -                                      | `compilation`            | async 异步    |
| `should-emit`            | 此时可以返回 true/false                | `compilation`            | bailResult    |
| `need-additional-pass`   | -                                      | -                        | bailResult    |
| `emit`                   | 在生成资源并输出到目录之前             | `compilation`            | async 异步    |
| `after-emit`             | 在生成资源并输出到目录之后             | `compilation`            | async 异步    |
| `done`                   | 完成编译                               | `stats`                  | sync 同步     |
| `failed`                 | 编译失败                               | `error`                  | sync 同步     |
| `invalid`                | 在无效的 watch 编译之后                | `fileName`、`changeTime` | sync 同步     |
| `watch-close`            | 在停止 watch 编译之后                  | -                        | sync 同步     |

代码示例：

```js
compiler.plugin('emit', function (compilation, callback) {
  // 执行一些异步...
  // 异步的 `emit` 事件处理函数的
  setTimeout(function () {
    console.log('异步运行完成...');
    callback();
  }, 1000);
});
```

## 参考资料

- [📖 Webpack 中文官网：Compiler](https://webpack.docschina.org/api/compiler)
- [📖 Compiler 模块钩子](https://www.webpackjs.com/api/compiler-hooks/)
- [📝 Webpack 源码阅读之 Compiler（2019-10-12）](https://imweb.io/topic/5da1397aaf03a41f046a8df1)
