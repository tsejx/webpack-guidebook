---
nav:
  title: 架构原理
  order: 2
group:
  title: 底层原理
  order: 2
title: Plugin 机制
order: 12
---

# Plugin 机制

通过插件我们可以扩展 webpack，在合适的时机通过 Webpack 提供的 API 改变输出结果，使 Webpack 可以执行更广泛的任务，拥有更强的构建能力。

## 基本结构

代码示例：

```js
class BasicPlugin {
  // 在构造函数中获取用户给该插件传入的配置
  constructor(options) {
    // do something
  }

  // Webpack 会调用 BasicPlugin 实例的 apply 方法给插件实例传入 compiler 对象
  apply(compiler) {
    // 在 emit 阶段插入钩子函数，用于特定时机处理额外的逻辑
    compiler.hooks.emit.tap('BasicPlugin', (compilation) => {
      // 在功能流程完成后可以调用 Webpack 提供的回调函数
    });

    // 如果事件是异步的，会带两个参数：
    // 1. 第一个参数为 compilation
    // 2. 第二个参数为回调函数，在插件处理完成任务时需要调用回调函数通知 Webpack，才会进入下一个处理流程
    compiler.plugin('emit', function (compilation, callback) {
      // 支持处理逻辑
      // 处理完毕后执行 callback 以通知 Webpack
      // 如果不执行 callback，运行流程将会一致卡在这不往下执行
      callback();
    });
  }
}

module.exports = BasicPlugin;
```

使用插件时，只需要将它的实例放到 Webpack 的 Plugins 数组配置中：

```js
const BasicPlugin = require('./hello-plugin.js');

module.exports = {
  plugins: [new BasicPlugin({ options: true })],
};
```

说明：

1. Webpack 启动后，在读取配置的过程中会先执行插件的实例化 `new BasicPlugin(options)`
2. 在初始化 `compiler` 对象后，再调用 `BasicPlugin.apply(compiler)` 给插件实例传入 `compiler` 对象
3. 插件实例在获取到 `compiler` 对象后，就可以通过 `compiler.plugin(事件名称, 回调函数)` 监听到 Webpack 广播出来的事件，并且可以通过 `compiler` 对象去操作 Webpack

## Compiler 和 Compilation

在开发 Plugin 时最常用的两个对象就是 Compiler 和 Compilation，它们是 Plugin 和 Webpack 之间的桥梁。 Compiler 和 Compilation 的含义如下：

- **Compiler**：该对象包含了 Webpack 环境所有的的配置信息，包含 `options`、`loaders` 和 `plugins` 这些信息，这个对象在 Webpack 启动时候被实例化，它是全局唯一的，可以简单地把它理解为 Webpack 实例；
- **Compilation**：该对象包含了当前的模块资源、编译生成资源、变化的文件等。当 Webpack 以开发模式运行时，每当检测到一个文件变化，一次新的 Compilation 将被创建。Compilation 对象也提供了很多事件回调供插件做扩展。通过 Compilation 也能读取到 Compiler 对象。

Compiler 和 Compilation 的区别在于：Compiler 代表了整个 Webpack 从启动到关闭的生命周期，而 Compilation 只是代表了一次新的编译。

## 构建流程

在编写插件之前，还需要了解以下 Webpack 的构建流程，以便在合适的时机插入合适的插件逻辑。

Webpack 的基本构建流程如下：

1. 校验配置文件：读取命令行传入或者 `webpack.config.js` 文件，初始化本次构建的配置参数
2. 生成 `Compiler` 对象：执行配置文件中的插件实例化语句 `new MyWebpackPlugin()`，为 Webpack 事件流挂上自定以 Hooks
3. 进入 `entryOption` 阶段：Webpack 开始读取配置的 `entry`，递归遍历所有的入口文件
4. `run/watch`：如果运行在 `watch` 模式则执行 `watch` 方法，否则执行 `run` 方法
5. `compilation`：创建 `Compilation` 对象回调 `compilation` 相关钩子，依次进入每个入口文件（`entry`），使用 `loader` 对文件进行编译。通过 `compilation` 可以读取到 `module` 的 `resource`（资源路径）、`loaders`（使用到的 `loader`）等信息。再将编译好的文件内容使用 `acorn` 解析生成 AST 静态语法树。然后递归、重复的执行这个过程，所有模块和依赖分析完成后，执行 `compilation` 的 `seal` 方法对每个 Chunk 进行整理、优化、封装 `__webpack_require__` 来模拟模块化操作
6. `emit`：所有文件的编译及转化都已经完成，包含了最终输出的资源，我们可以在传入事件回调的 `compilation.assets` 上拿到所需数据，其中包括即将输出的资源、代码块 Chunk 等信息

```js
// 修改或添加资源
compilation.assets['net-file.js'] = {
  source() {
    return 'var a = 1';
  },
  size() {
    return this.source().length;
  },
};
```

7. `afterEmit`：文件已经写入磁盘完成
8. `done`：完成编译

<br />

```jsx | inline
import React from 'react';
import img from '../../assets/principle-analysis/webpack-compile-workflow.jpeg';

export default () => <img alt="Webpack执行流程" src={img} width={640} />;
```

[Webpack 编译流程图](https://blog.didiyun.com/index.php/2019/03/01/webpack/)

## 事件流机制

Webpack 本质上是一种事件流的机制（核心原理就是一个订阅发布模式），它的工作流程就是将各个插件串联起来，而实现这一切的核心就是 [Tapable](./tapable)。

Webpack 的 Tapable 事件流机制保证了插件的有序性，将各个插件串联起来，Webpack 在运行过程中会广播事件，插件只需要监听它所关心的事件，就能假如到这条 Webpack 机制中，去改变 Webpack 的运作，使得整个系统扩展性良好。

Webpack 中最核心的负责编译的 <strong style="color:red">Compiler</strong> 和负责 bundles 的 <strong style="color:red">Compilation</strong> 都是 Tapable 的实例，可以直接在 Compiler 和 Compilation 对象上广播和监听事件。

代码示例：

```js
/**
 * 广播事件
 * event-name 为事件名称，注意不要和现有的事件重名
 * params 为附带的参数
 */
compiler.apply('event-name', params);
compilation.apply('event-name', params);

/**
 * 监听名称为 event-name 的事件，当 event-name 事件发生时，函数就会被执行。
 * 同时函数中的 params 参数为广播事件时附带的参数。
 */
compiler.plugin('event-name', function (params) {});
compilation.plugin('event-name', function (params) {});
```

注意：

- 只要能拿到 Compiler 或 Compilation 对象，就能广播出新的事件，所以在新开发的插件中也能广播出事件，给其他插件监听使用
- 传给每个插件的 Compiler 和 Compilation 对象都是同一个引用，也就是说在一个插件中修改了 Compiler 或 Compilation 对象上的属性，会影响到后面的插件
- 有些事件是异步的，这些异步的事件会附带两个参数，第二个参数为回调函数，在插件处理完任务时需要调用回调函数通知 Webpack，才会进入下个流程

## 最佳实践

插件可以用来修改输出文件、增加输出文件、甚至可以提升 Webpack 性能等等，总之插件通过调用 Webpack 提供的 API 能完成很多事情。由于 Webpack 提供的 API 非常多，有很多 API 很少用得上，又加上篇幅有限，下面介绍常用的 API。

### 读取输出资源、代码块、模块及其依赖

有些插件可能需要读取 Webpack 的处理结果，例如输出资源、代码块、模块及其依赖，以便做下一步处理。在 `emit` 事件发生时，代表源文件的转换和组装已经完成，在这里可以读取到最终将输出的资源、代码块、模块及其依赖，并且可以修改输出资源的内容。

代码示例：

```js
class Plugin {
  apply(compiler) {
    comiler.plugin('emit', function (compilation, callback) {
      // compilation.chunks 存放所有代码块，是一个数组
      compilation.chunks.forEach(function (chunk) {
        // chunk 代表一个代码块
        // 代码块由多个模块组成，通过 chunk.forEachModule 能读取组成代码块的每个模块
        chunk.forEachModule(function (module) {
          // module 代表一个模块
          // module.fileDependencies 存放当前模块的所有依赖的文件路径，是一个数组
          module.fileDependencies.forEach(function (filepath) {
            // ...
          });
        });

        // Webpack 会根据 Chunk 去生成输出的文件资源，每个 Chunk 都对应一个及其以上的输出文件
        // 例如在 Chunk 中包含了 CSS 模块并且使用了 ExtractTextPlugin 时
        // 该 Chunk 就会生成 .js 和 .css 两个文件
        chunk.files.forEach(function (filename) {
          // compilation.assets 存放当前所有即将输出的资源
          // 调用一个输出资源的 source() 方法能获取到输出资源的内容
          let source = compilation.assets[filename].source();
        });
      });

      // 这是一个异步事件，要记得调用 callback 通知 Webpack 本次事件监听处理结束
      // 如果忘记了调用 callback，Webpack 将一直卡在这里而不会往后执行
      callback();
    });
  }
}
```

### 监听文件变化

Webpack 会从配置的入口模块触发，依次找出所有的依赖模块，当入口模块或者其依赖的模块发生变化时，就会触发依次新的 Compilation。

在开发插件时经常需要知道是哪个文件发生变化导致了新的 Compilation。

代码示例：

```js
// 当依赖的文件发生变化时会触发 watch-run 事件
compiler.hooks.watchRun.tap('WatchRunPlugin', (watching, callback) => {
  // 获取发生变化的文件列表
  const changedFiles = watching.compiler.watchFileSystem.watcher.mtimes;
  // changedFiles 格式为键值对，键为发生变化的文件路径
  if (changedFiles[filePath] !== undefined) {
    // filePath 对应的文件发生了变化
  }
  callback();
});
```

默认情况下 Webpack 只会监视入口和其他依赖的模块是否发生变化，在有些情况下项目可能需要引入新的文件，例如引入一个 HTML 文件。由于 JavaScript 文件不会去导入 HTML 文件，Webpack 就不会监听 HTML 文件的变化，编辑 HTML 文件时就不会重新触发新的 Compilation。为了监听 HTML 文件的变化，我们需要把 HTML 文件加入到依赖列表中。

代码示例：

```js
compiler.hooks.afterCompile.tap('WatchRunPlugin', (compilation, callback) => {
  // 把 HTML 文件添加到文件依赖列表，好让 Webpack 去监听 HTML 模块文件，在 HTML 模版文件发生变化时重新启动依次编译
  compilation.fileDependencies.push(filePath);
  callback();
});
```

### 修改输出资源

有些场景下插件需要修改、增加、删除输出的资源，要做到这点需要监听 `emit` 事件，因为发生 `emit` 事件时所有模块的转换和代码块对应的文件已经生成好，需要输出的资源即将输出，因此 `emit` 事件是修改 Webpack 输出资源的最后时机。

所有需要输出的资源会存放在 `compilation.assets` 中，`compilation.assets` 是一个键值对，键为需要输出的文件名称，值为文件对应的内容。

代码示例：

```js
// 设置名称为 fileName 的输出资源
compilation.assets[fileName] = {
  // 返回文件内容
  source: () => {
    // fileContent 既可以是代表文本文件的字符串，也可以是代表二进制文件的 Buffer
    return fileContent;
  },
  // 返回文件大小
  size: () => {
    return Buffer.byteLength(fileContent, 'utf8');
  },
};
```

### 获取插件注册列表

代码示例：

```js
// 判断当前配置使用了 ExtractTextPlugin
// compiler 参数即为 Webpack 在 apply(compiler) 中传入的参数
function hasExtractTextPlugin(compiler) {
  // 当前配置所有使用的插件列表
  const plugins = compiler.options.plugins;
  // 去 plugins 中寻找有没有 ExtractTextPlugin 的实例
  return plugins.find((plugin) => plugin.__proto__.constructor === ExtractTextPlugin) != null;
}
```

### 文件写入

Compilation 上的 `assets` 可以用于文件写入。

文件写入需要使用 [webpack-sources](https://www.npmjs.com/package/webpack-sources)

代码示例：

```js
const { RawSource } = require('webpack-sources');

module.exports = class DemoPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const { name } = this.options;
    compilation.plugin('emit', (compilation, cb) => {
      compilation.assets[name] = new RawSource('demo');
      cb();
    });
  }
};
```

### 异常或警告处理

做一个实验，如果你在 `apply` 函数内插入 `throw new Error("message")`，终端会打印出 `Unhandled rejection Error: Message`。然后 Webpack 中断执行。为了不影响 Webpack 的执行，要在编译期间向用户发出警告或错误消息，则应使用 `compilation.warnings` 和 `compilation.errors`。

```js
compilation.warnings.push('warning');

compilation.errors.push('error');
```

### 插件扩展

插件自身也可以通过暴露 `hooks` 的方式进行自身扩展，以 `html-webpack-plugin` 为例：

- `html-webpack-plugin-alter-chunks`（Sync）
- `html-webpack-plugin-before-html-generation`（Async）
- `html-webpack-plugin-alter-asset-tags`（Async）
- `html-webpack-plugin-after-html-processing`（Async）
- `html-webpack-plugin-after-emit`（Async）

## 参考资料

- [📝 揭秘 Webpack 插件工作流程和原理（2020-05-18）](https://juejin.im/post/5ec169786fb9a043721b46ad)
- [📝 实现自定义 Webpack 插件详解（2020-05-19）](https://juejin.im/post/5ec16a2e5188256d841a53d0)
- [📝 Webpack 学习 — Plugin（2019-03-15）](http://wushaobin.top/2019/03/15/webpackPlugin/)
- [📝 浅析 Webpack 插件化设计（2017-05-18）](https://zhuanlan.zhihu.com/p/26955349)
