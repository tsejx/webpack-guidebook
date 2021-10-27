---
nav:
  title: 架构原理
  order: 2
group:
  title: 底层原理
  order: 2
title: Loader 机制
order: 11
---

# Loader 机制

Loader 是 Webpack 的核心概念之一，它的基本工作流是将一个文件以字符串的形式读入，对其进行语法分析及转换，然后交由下一环节进行处理，所有载入的模块最终都会经过 `moduleFactory` 处理，转成 JavaScript 可以识别和运行的代码，从而完成模块的集成。

## 使用方式

本质上 `loader` 只是一个导出为函数的 JavaScript 模块

```js
// 导出一个函数，source 为 webpack 传递给 loader 的文件源内容
module.exports = function (source) {
  const content = doSomeThing2JsString(source);

  // 如果 loader 配置了 options 对象，那么this.query将指向 options
  const options = this.query;

  // 可以用作解析其他模块路径的上下文
  console.log('this.context');

  /*
   * this.callback 参数：
   * error：Error | null，当 loader 出错时向外抛出一个 error
   * content：String | Buffer，经过 loader 编译后需要导出的内容
   * sourceMap：为方便调试生成的编译后内容的 source map
   * ast：本次编译生成的 AST 静态语法树，之后执行的 loader 可以直接使用这个 AST，进而省去重复生成 AST 的过程
   */
  this.callback(null, content); // 异步
  return content; // 同步
};
```

多 Loader 时的执行顺序

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
};
```

函数组合的两种情况：

- Unix 的 pipline
- Compose（Webpack 采用）

```js
compose = (f, g) => (...args) => f(g(...args));
```

## 模块处理

### 原始数据

由于 Webpack 是运行在 Node.js 之上的，一个 Loader 其实就是一个 Node.js 模块，这个模块需要导出一个函数。这个导出的函数的工作就是获得处理前的元内容，对元内容的执行处理后，返回处理后的内容。

```js
module.exports = function (source) {
  // source 为 compiler 传递给 Loader 的一个文件的原内容
  // 该函数需要返回处理后的内容给你，这里简单起见，直接把原内容返回了，相当于该 Loader 没有做任何转换
  return source;
};
```

由于 Loader 运行在 Node.js 中，可以调用任何 Node.js 中自带的 API，或者安装第三方模块进行调用：

```js
const sass = require('node-sass');

module.exports = function (source) {
  return sass(source);
};
```

### 加载运行器

定义：`loader-runner` 允许你不安装 Webpack 的情况下运行 loaders

作用：

- 作为 Webpack 的依赖，Webpack 中使用它执行 loader
- 进行 loader 的开发和测试

### 获取模块配置项

在 Loader 中获取用户传入的 `options`，通过 `loader-utils` 的 `getOptions` 方法获取：

```js
const loaderUtils = require('loader-utils');

module.exports = function (source) {
  // 获取到用户句给当前 Loader 传入的 options
  const options = loaderUtils.getOptions(this);
  return source;
};
```

### 返回其他结果

上面的 Loader 都只是返回了原内容转换后的内容，但有些场景下还需要返回除了内容之外的东西。

例如以用 babel-loader 转换 ES6 代码为例，它还需要输出转换后的 ES5 代码对应的 Source Map，以方便调试源码。

为了把 Source Map 也一起随着 ES5 代码返回给 Webpack，可以这样写：

```js
module.exports = function (source) {
  // 通过 this.callback 告诉 Webpack 返回的结果
  this.callback(null, source, sourceMaps);
  // 当你使用 this.callback 返回内容时，该 Loader 必须返回 undefined
  // 以让 Webpack 知道该 Loader 返回的结果在 this.callback 中，而不是 return 中
  return;
};
```

其中 `this.callback` 是 Webpack 给 Loader 注入的 API，以方便 Loader 和 Webpack 之间通信。`this.callback` 的详细使用方法如下：

```js
this.callback(
  // 当无法转换原内容时，给 Webpack 返回一个 Error
  err: Error | null,
  // 原内容转换后的内容
  content: string | Buffer,
  // 用于把转换后的内容得出原内容的 SourceMap，方便调试
  sourceMap?: SourceMap,
  // 如果本次转换为原内容生成了 AST 语法树，可以把这个 AST 返回
  // 以方便之后需要 AST 的 Loader 复用该 AST，以避免重复生成 AST，提升性能
  abstractSyntaxTree?: AST
)
```

> Source Map 的生成很耗时，通常在开发环境下才会生成 Source Map，其他环境下不用生成，以加速构建。为此 Webpack 为 Loader 提供了 `this.sourceMap` API 去告诉 Loader 当前构建环境下用户是否需要 Source Map。如果你编写的 Loader 会生成 Source Map，请考虑到这点。

### 同步与异步

Loader 有同步和异步之分，上面的 Loader 都是同步的 Loader，因为它们的转换流程都是同步的，转换完成后再返回结果。但有些场景下转换的步骤只能是异步完成的，例如你需要通过网络请求才能得出结果，如果采用同步的方式 `网络请求` 就会阻塞整个构建，导致构建非常缓慢。

```js
module.exports = function (source) {
  // 告诉 Webpack 本次转换是异步的，Loader 会在 callback 中回调结果
  var callback = this.async();

  someAsyncOperation(source, function (err, result, sourceMaps, ast) {
    // 通过 callback 返回异步执行后的结果
    callback(err, result, sourceMaps, ast);
  });
};
```

### 处理二进制数据

在默认的情况下，Webpack 传给 Loader 的原内容都是 UTF-8 格式编码的字符串。但有些场景下 Loader 不是处理文本文件，而是处理二进制文件，例如 `file-loader`，就需要 Webpack 给 Loader 传入二进制格式的数据。为此，你需要这样编写 Loader：

```js
module.exports = function (source) {
  // 在 exports.raw = true 时，Webpack 传给 Loader 的 source 是 Buffer 类型的
  source instanceof Buffer === true;
  // Loader 返回的类型也可以是 Buffer 类型的
  // 在 exports.raw !== true 时，Loader 也可以返回 Buffer 类型的结果
  return source;
};

// 通过 exports.raw 属性告诉 Webpack 该 Loader 是否需要二进制数据
module.exports.raw = true;
```

以上代码中最关键的是最后一行 `module.exports.raw = true`，没有改行 Loader 只能拿到字符串。

### 文件输出

通过 `this.emitFile` 进行文件写入

```js
const loaderUtil = require('loader-utils');
module.exports = function (content) {
  const url = loaderUtil.interpolateName(this, '[hash].[ext]', {
    content,
  });

  this.emitFile(url, content);

  const path = `__webpack_public_path__+${JSON.stringify(url)}`;

  return `export default ${path}`;
};
```

### 缓存加速

在有些情况下，有些转换操作需要大量计算非常耗时，如果每次构建都重新执行重复的转换操作，构建将会变得非常缓慢。为此，Webpack 会默认缓存所有 Loader 的处理结果，也就是说在需要被处理的文件或者其他依赖的文件没有发生变化时，是不会重新调用对应的 Loader 去执行转换操作的。

如果你想让 Webpack 不缓存该 Loader 的处理结果，可以这样：

```js
module.exports = function (source) {
  // 关闭该 Loader 的缓存功能
  this.cacheable(false);
  return source;
};
```

## 总体流程

Webpack 编译流程非常复杂，但其中设计 Loader 的部分主要包括：

- Loader（Webpack）的默认配置
- 使用 LoaderResolver 解析 Loader 模块路径
- 根据 `rule.modules` 创建 RulesSet 规则集
- 使用 `loader-runner` 运行 Loader

## 区别

> loader 和 plugin 有什么不同

- Loader
  - 作用：让 Webpack 拥有加载和解析非 JavaScript 文件的能力，有独立的运行环境。
  - 用法：`module.rules` 配置，作为模块的解析规则而存在。
- Plugin
  - 作用：能扩展 Webpack 的功能。在 Webpack 运行的生命周期中广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。
  - 用法：每项为实例，参数通过构造函数传入。
