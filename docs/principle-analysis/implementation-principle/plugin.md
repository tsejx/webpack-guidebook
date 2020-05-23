---
nav:
  title: 原理分析
  order: 2
group:
  title: 底层原理
  order: 2
title: Plugin 机制
order: 12
---

# Plugin 机制

通过插件我们可以扩展 webpack，在合适的时机通过 Webpack 提供的 API 改变输出结果，使 Webpack 可以执行更广泛的任务，拥有更强的构建能力。

本文将尝试探索 Webpack 插件的工作流程，进而去揭秘它的工作原理。同时需要你对 Webpack 底层和构建流程的一些东西有一定的了解。

想要了解 webpack 的插件的机制，需要弄明白以下几个知识点：

1. 一个简单的插件的构成
2. Webpack 构建流程
3. Tapable 是如何把各个插件串联到一起的
4. `compiler` 以及 `compilation` 对象的使用以及它们对应的事件钩子。

## 插件的基本结构

`plugins` 是可以用自身原型方法 `apply` 来实例化的对象。`apply` 只在安装插件被 Webpack 的 `compiler` 执行一次。`apply` 方法传入一个 webpck `compiler` 的引用，来访问编译器回调。

```js
class HelloPlugin {
  // 在构造函数中获取用户给该插件传入的配置
  constructor(options) {
    // ...
  }

  // Webpack 会调用 HelloPlugin 实例的 apply 方法给插件实例传入 compiler 对象
  apply(compiler) {
    // 在 emit 阶段插入钩子函数，用于特定时机处理额外的逻辑
    compiler.hooks.emit.tap('HelloPlugin', compilation => {
      // 在功能流程完成后可以调用 Webpack 提供的回调函数
    });

    // 如果事件是异步的，会带两个参数，第二个参数为回调函数，在插件处理完成任务时需要调用回调函数通知 Webpack，才会进入下一个处理流程
    compiler.plugin('emit', function(compilation, callback) {
      // 支持处理逻辑
      // 处理完毕后执行 callback 以通知 Webpack
      // 如果不执行 callback，运行流程将会一致卡在这不往下执行
      callback();
    });
  }
}

module.exports = HelloPlugin;
```

使用插件时，只需要将它的实例放到 Webpack 的 Plugins 数组配置中：

```js
const HelloPlugin = require('./hello-plugin.js');

module.exports = {
  plugins: [new HelloPlugin({ options: true })],
};
```

先来分析以下 Webpack Plugin 的工作原理：

1. 读取配置的过程中会先执行 `new HelloPlugin(options)` 初始化一个 `HelloPlugin` 获得其实例
2. 初始化 `compiler` 对象后调用 `HelloPlugin.apply(compiler)` 给插件实例传入 `compiler` 对象
3. 插件实例在获取到 `compiler` 对象后，就可以通过 `compiler.plugin(事件名称, 回调函数)` 监听到 Webpack 广播出来的事件，并且可以通过 `compiler` 对象去操作 Webpack

## 构建流程

在编写插件之前，还需要了解以下 Webpack 的构建流程，以便在合适的时机插入合适的插件逻辑。

Webpack 的基本构建流程如下：

1. 校验配置文件：读取命令行传入或者 `webpack.config.js` 文件，初始化本次构建的配置参数
2. 生成 `Compiler` 对象：执行配置文件中的插件实例化语句 `new MyWebpackPlugin()`，为 Webpack 事件流挂上自定以 Hooks
3. 进入 `entryOption` 阶段：Webpack 开始读取配置的 Entries，递归遍历所有的入口文件
4. `run/watch`：如果运行在 `watch` 模式则执行 `watch` 方法，否则执行 `run` 方法
5. `compilation`：创建 `Compilation` 对象回调 `compilation` 相关钩子，依次进入每个入口文件（`entry`），使用 loader 对文件进行编译。通过 `compilation` 可以读取到 `module` 的 `resource`（资源路径）、`loaders`（使用到的 loader）等信息。再将编译好的文件内容使用 `acorn` 解析生成 AST 静态语法树。然后递归、重复的执行这个过程，所有模块和依赖分析完成后，执行 `compilation` 的 `seal` 方法对每个 Chunk 进行整理、优化、封装 `__webpack_require__` 来模拟模块化操作
6. `emit`：所有文件的编译及转化都已经完成，包含了最终输出的资源，我们可以在传入事件回调的 `compilation.assets` 上拿到所需数据，其中包括即将输出的资源、代码块 Chunk 等信息

```js
// 修改或添加资源
compilation.assets['net-file.js'] = {
  source() {
    return 'var a=1';
  },
  size() {
    return this.source().length;
  },
};
```

7. `afterEmit`：文件已经写入磁盘完成
8. `done`：完成编译

```jsx | inline
import React from 'react';
import img from '../../assets/principle-analysis/webpack-compile-workflow.jpeg';

export default () => <img alt="Webpack执行流程" src={img} width={640} />;
```

[Webpack 编译流程图](https://blog.didiyun.com/index.php/2019/03/01/webpack/)

## 理解事件流机制 Tapable

Webpack 本质上是一种事件流的机制，它的工作流程就是将各个插件串联起来，而实现这一切的核心就是 Tapable。

Webpack 的 Tapable 事件流机制保证了插件的有序性，将各个插件串联起来，Webpack 在运行过程中会广播事件，插件只需要监听它所关心的事件，就能假如到这条 Webpack 机制中，去改变 Webpack 的运作，使得整个系统扩展性良好。

`Tapable` 也是一个小型的 library，是 Webpack 的核心工具。类似于 Node 中的 `events` 库，核心原理就是一个订阅发布模式。作用是提供类似的插件接口。

Webpack 中最核心的 **负责编译的 Compiler** 和 **负责 bundles 的 Compilation** 都是 `Tapable` 的实例，可以直接在 Compiler 和 Compilation 对象上广播和监听事件，方法如下：

```js
/**
 * 广播事件
 * event-name 为事件名称，注意不要和现有的事件重名
 */
compiler.apply('event-name', params);
compilation.apply('event-name', params);

/**
 * 监听事件
 */
compiler.plugin('event-name', function(params) {});
compilation.plugin('event-name', function(params) {});
```

`Tapable` 类暴露了 `tap`、`tapAsync` 和 `tapPromise` 方法，可以根据钩子的同步/异步方式来选择一个函数注入逻辑。

🌰 **`tap` 同步钩子**

```js
compiler.hooks.compile.tap('MyPlugin', params => {
  console.log('以同步方式触及 compile 钩子。');
});
```

🌰 **`tapAsync` 异步钩子**

通过 `callback` 回调告诉 Webpack 异步执行完毕 `tapPromise` 异步钩子，返回一个 Promise 告诉 Webpack 异步执行完毕。

```js
compiler.hooks.run.tapAsync('MyPlugin', (compiler, callback) => {
  console.log('以异步方式触及 run 钩子。');
  callback();
});

compiler.hooks.run.tapPromise('MyPlugin', compiler => {
  return new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
    console.log('以具有延迟的异步方式触及 run 钩子');
  });
});
```

### Tapable 用法

```js
const {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SynLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  ASyncSeriesBailHook,
  AsyncSeriesWaterfallHook,
} = require('tapable');
```

- `Sync*` 同步
  - `SyncHook` 同步钩子
  - `SyncBailHook` 同步保险钩子
  - `SyncLoopHook` 同步循环钩子
  - `SyncWaterfallHook` 同步瀑布钩子
- `Async*` 异步
  - `AsyncParallel*` 异步并行
    - `AsyncParallelHook` 异步
    - `AsyncParallelBailHook` 异步并行保险钩子
  - `AsyncSeries*` 异步串行
    - `AsyncSeriesHook` 异步串行钩子
    - `AsyncSeriesBailHook` 异步串行保险钩子
    - `AsyncSeriesWaterfallHook` 异步串行瀑布钩子

### 实现简易同步钩子

```js
class Hook {
  constructor(args) {
    this.taps = [];
    this.interceptors = []; // 这个放在后面用
    this._args = args;
  }
  tap(name, fn) {
    this.taps.push({ name, fn });
  }
}

class SyncHook extends Hook {
  call(name, fn) {
    try {
      this.taps.forEach(tap => tap.fn(name));
      fn(null, name);
    } catch (error) {
      fn(error);
    }
  }
}
```

### Tapable 如何与插件关联

**Compile.js**

```js
const { AsyncSeriesHook, SyncHook } = require('tapable');

// 创建类
class Compiler {
  constructor() {
    this.hooks = {
      // 异步钩子
      run: new AsyncSeriesHook(['compiler']),
      // 同步钩子
      compile: new SyncHook(['params']),
    };
  }

  run() {
    // 执行异步钩子
    this.hooks.run.callAsync(this, err => {
      this.compile(onCompiled);
    });
  }

  compile() {
    // 执行同步钩子 并传参
    this.hooks.compile.call(params);
  }
}

module.exports = Compile;
```

**MyPlugin.js**

```js
const Compiler = require('./compiler');

class MyPlugin {
  // 接受 compiler 参数
  apply(compiler) {
    compiler.hooks.run.tap('MyPlugin', () => console.log('开始编译...'));
    compiler.hooks.compiler.tapAsync('MyPlugin', (name, age) => {
      setTimeout(() => {
        console.log('编译中');
      }, 1000);
    });
  }
}

// 这里类似于 webpack.config.js 的 Plugins 配置
// 向 Plugins 属性传入 new 实例

const myPlugin = new MyPlugin();

const options = {
  plugins: [myPlugin],
};

let compiler = new Compiler(options);
compiler.run();
```

## 理解 Compiler 负责编译

开发插件首先要知道 `compiler` 和 `compilation` 对象是做什么的。

`Compiler` 对象包含了当前运行 Webpack 的配置，包括 `entry`、`output`、`loader` 等配置，这个对象在启动 Webpack 时被实例化，而且是全局唯一的。`Plugin` 可以通过该对象获取到 Webpack 的配置信息进行处理。

如果看完这段话，你还是没理解 `compiler` 是做啥的，不要怕。运行 `npm run build`，把 `compiler` 的全部信息输出到控制台上 `console.log(compiler)`。

```jsx | inline
import React from 'react';
import img from '../../assets/principle-analysis/console-compiler.png';

export default () => <img alt="Compiler对象实例" src={img} width={720} />;
```

```js
Compiler {
  _pluginCompat: SyncBailHook {},
  hooks: {
    shouldEmit: SyncBailHook {
      // ...
    },
    done: AsyncSeriesHook {
      // ...
    },
    additionalPass: AsyncSerirsHook {
      // ...
    },
    beforeRun: AsyncSeriesHook {
      // ...
    },
    run: AsyncSeriesHook {
      // ...
    },
    emit: AsyncSeriesHook {
      // ...
    },
    assetEmitted: AsyncSeriesHook {
      // ...
    },
    afterEmit: AsyncSeriesHook {
      // ...
    },
    thisCompilation: SyncHook {
      // ...
    },
    compilation: SyncHook {
      // ...
    },
    normalModuleFactory: SyncHook {
      // ...
    },
    contextModuleFacotry: SyncHook {
      // ...
    },
    beforeCompile: AsyncSeriesHook {
      // ...
    },
    compile: SyncHook {
      // ...
    },
    make: AsyncParallelHook {
      // ...
    },
    afterCompile: AsyncSeriesHook {
      // ...
    },
    watchRun: AsyncSeriesHook {
      // ...
    },
    failed: SyncHook {
      // ...
    },
    invalid: SyncHook {
      // ...
    },
    watchClose: SyncHook {
      // ...
    },
    infrastructureLog: SyncBailHook {
      // ...
    },
    environment: SyncHook {
      // ...
    },
    afterEnvironment: SyncHook {
      // ...
    },
    afterPlugins: SyncHook {
      // ...
    },
    afterResolvers: SyncHook {
      // ...
    },
    entryOption: SyncBailHook {
      // ...
    },
    infrastructurelog: SyncBailHook {
      // ...
    }
  },
  outputPath: '', // 输出目录
  outputFileSystem: NodeOutputFileSystem {
    // ...
  },
  inputFileSystem: CachedInputFileSystem {
    // ...
  },
  options: {
    // Compiler 对象包含了 Webpack 的所有配置信息，entry、module、output、resolve 等信息
    entry: [
      'babel-polyfill',
      '/Users/mrsingsing/Webpack-Guidebook/example/demo/src/index.js'
    ],
    devServer: {
      port: 3000
    },
    output: {
      // ...
    },
    module: {
      // ...
    },
    plugins: [ MyWebpackPlugin {} ],
    mode: 'production',
    context: '/Users/mrsingsing/Webpack-Guidebook/example/demo/src/webpack-plugin',
    devtool: false,
    performance: {
      maxAssetSize: 250000,
      maxEntrypointSize: 250000,
      hints: 'warning',
    },
    optimization: {
      // ...
    },
    resolve: {
      // ...
    },
    resolveLoader: {
      // ...
    },
    infrastructureLogging: {
      level: 'info',
      debug: false,
    }
  },
  context: '/Users/mrsingsing/Webpack-Guidebook/example/demo/src/webpack-plugin', // 上下文，文件目录
  requestShortener: RequestShortener {
    // ...
  },
  watchFileSystem: NodeWatchFileSystem {
    // 监听文件变化列表信息
  }
}
```

Compiler 源码精简版代码解析

[源码地址](https://github.com/webpack/webpack/blob/master/lib/Compiler.js)

```js
const { SyncHook, SyncBailHook, AsyncSeriesHook } = require('tapable');

class Compiler {
  constructor() {
    // 1. 定义生命周期钩子
    this.hooks = Object.freeze({
      // ...只列举几个常用的常见钩子，更多 Hook 就不列举了，有兴趣看源码
      done: new AsyncSeriesHook(['stats']), // 一次编译完成后执行，回调参数：stats
      beforeRun: new AsyncSeriesHook(['compiler']),
      run: new AsyncSeriesHook(['compiler']), // 在编译器开始读取记录前执行
      emit: new AsyncSeriesHook(['compilation']), // 在生成文件到 output 目录之前执行，回调参数：compilation
      afterEmit: new AsyncSeriesHook(['compilation']), // 在生成文件到 output 目录之后执行
      compilation: new SyncHook(['compilation', 'params']), // 在一次 compilation 创建后执行执行插件
      beforeCompile: new AsyncSeriesHook(['params']),
      compile: new SyncHook(['params']), // 在一个新的 compilation 创建之前执行
      make: new AsyncParallelHook(['compilation']), // 完成一次编译之前执行
      afterCompile: new AsyncSeriesHook(['compilation']),
      watchRun: new AsyncSeriesHook(['compiler']),
      failed: new SyncHook(['error']),
      watchClose: new SyncHook([]),
      afterPlugins: new SyncHook(['compiler']),
      entryOption: new SyncBailHook(['context', 'entry']),
    });
  }
  newCompilation() {
    // 创建 Compilation 对象回调 compilation 相关钩子
    const compilation = new Compilation(this);

    // 省略

    this.hooks.compilation.call(compilation, params); // compilation 对象创建完成
    return compilation;
  }
  watch() {
    // 如果运行在 watch 模式则执行 watch 方法，否则执行 run 方法
    if (this.running) {
      return handler(new ConcurrentCompilationError());
    }
    this.running = true;
    this.watchMode = true;
    return new Watching(this, watchOptions, handler);
  }
  run(callback) {
    if (this.running) {
      return callback(new ConcurrentCompilationError());
    }
    this.running = true;
    process.nextTick(() => {
      this.emitAssets(compilation, err => {
        if (err) {
          // 在编译和输出的流程中遇到异常时，会触发 failed 事件
          this.hooks.failed.call(err);
        }
        if (compilation.hooks.needAdditionalPass.call()) {
          // ...
          // done 完成编译
          this.hooks.done.callAsync(stats, err => {
            // 创建 compilation 对象之前
            this.compile(onCompiled);
          });
        }
        this.emitRecords(err => {
          this.hooks.done.callAsync(stats, err => {
            // ...
          });
        });
      });
    });

    this.hooks.beforeRun.callAsync(this, err => {
      this.hooks.run.callAsync(this, err => {
        this.readRecords(err => {
          this.compile(onCompiled);
        });
      });
    });
  }
  compile(callback) {
    const params = this.newCompilationParams();
    this.hooks.beforeCompile.callAsync(params, err => {
      this.hooks.beforeCompile.call(params);
      const compilation = this.newCompilation(params);
      // 触发 make 事件并调用 addEntry，找到入口 JS，进行下一步
      this.hooks.make.callAsync(compilation, err => {
        process.nextTick(() => {
          compilation.finish(err => {
            // 封装构建结果（seal），逐次对每个 module 和 chunk 进行整理，每个 chunk 对应一个入口文件
            compilation.seal(err => {
              this.hooks.afterCompile.callAsync(compilation, err => {
                // 异步的事件需要在插件处理完成任务时调用回调函数通知 Webpack 进入下一个流程
                // 不然运行流程将会一直佧在这不往下执行
                return callback(null, compilation);
              });
            });
          });
        });
      });
    });
  }
  emitAssets(compilation, callback) {
    const emitFiles = err => {
      // ...省略
      // afterEmit：文件已经写入磁盘完成
      this.hooks.afterEmit.callAsync(compilation, err => {
        if (err) return callback(err);
        return callback();
      });
    };

    // emit 事件发生时，可以读取到最终输出的资源、代码块、模块及其依赖，并进行修改（这是最后一次修改最终文件的机会）
    this.hooks.emit.callAsync(compilation, err => {
      if (err) return callback(err);
      outputPath = compilation.getPath(this.outputPath, {});
      mkdirp(this.outputFileSystem, outputPath, emitFiles);
    });
  }
}
```

`apply` 方法中插入钩子的一般形式如下：

```js
// compiler 提供了 compiler.hooks，可以根据这些不同的时刻去让插件做不同的事情
compiler.hooks.阶段.tap函数('插件名称', 阶段回调参数 => {
  // do something
});

compiler.run(callback);
```

## 理解 Compilation 负责创建 bundle

Compilation 对象代表了一次资源版本构建。当运行 Webpack 开发环境中间件时，每当检测到一个文件变化，就会创建新的 `compilation`，从而生成一组新的编译资源。一个 `Compilation` 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息，简单来讲就是把本次打包编译的内容存到内存里。Compilation 对象也提供了插件需要自定义功能的回调，以供插件做自定义处理时选择使用拓展。

简单来说，Compilation 的职责就是构建模块和 Chunk，并利用插件优化构建过程。

和 Compiler 用法相同，钩子类型不同，也可以在某些钩子上访问 `tapAsync` 和 `tapPromise`。

控制台输出 `console.log(compilation)`：

```jsx | inline
import React from 'react';
import img from '../../assets/principle-analysis/console-compilation.png';

export default () => <img alt="Compilation" src={img} width={720} />;
```

通过 Compilation 也能读取到 Compiler 对象。

常用 Compilation Hooks：

| 钩子                 | 类型            | 调用时机                                                                                 |
| -------------------- | --------------- | ---------------------------------------------------------------------------------------- |
| buildModule          | SyncHook        | 在模块开始编译之前触发，可以用于修改模块                                                 |
| succeedModule        | SyncHook        | 当一个模块被成功编译，会执行这个钩子                                                     |
| finishModules        | AsyncSeriesHook | 当所有模块都编译成功后被调用                                                             |
| seal                 | SyncHook        | 当一次 `compilation` 停止接收新模块时触发                                                |
| optimizeDependencies | SyncBailHook    | 在依赖优化的开始执行                                                                     |
| optimize             | SyncHook        | 在优化阶段的开始执行                                                                     |
| optimizeModules      | SyncBailHook    | 在模块优化阶段开始时执行，插件可以在这个钩子里执行对模块的优化，回调参数：`modules`      |
| optimizeChunks       | SyncBailHook    | 在代码块优化阶段开始时执行，插件可以在这个钩子里执行对代码块的优化，回调参数：`chunks`   |
| optimizeChunkAssets  | AsyncSeriesHook | 优化任何代码块资源，这些资源存放在 `compilation.assets` 上。一个 Chunk 有一个 files 属性 |
| optimizeAssets       | AsyncSeriesHook | 优化所有存放在 `compilation.assets` 的所有资源。回调参数：`assets`                       |

## Compiler 和 Compilation 的区别

Compiler 代表了整个 Webpack 从启动到关闭的生命周期，而 Compilation 只是代表了一次新的编译，只要文件有改动，`compilation` 就会被重新创建。

## 常用 API

插件可以用来修改输出文件、增加输出文件、甚至可以提升 Webpack 性能等等，总之插件通过调用 Webpack 提供的 API 能完成很多事情。由于 Webpack 提供的 API 非常多，有很多 API 很少用得上，又加上篇幅有限，下面介绍常用的 API。

### 读取输出资源、代码块、模块及其依赖

有些插件可能需要读取 Webpack 的处理结果，例如输出资源、代码块、模块及其依赖，以便做下一步处理。在 emit 事件发生时，代表源文件的转换和组装已经完成，在这里可以读取到最终将输出的资源、代码块、模块及其依赖，并且可以修改输出资源的内容。插件代码如下：

```js
class Plugin {
  apply(compiler) {
    comiler.plugin('emit', function(compilation, callback) {
      // compilation.chunks 存放所有代码块，是一个数组
      compilation.chunks.forEach(function (chunk) {
        // chunk 代表一个代码块
        // 代码块由多个模块组成，通过 chunk.forEachModule 能读取组成代码块的每个模块
        chunk.forEachModule(function(module) {
          // module 代表一个模块
          // module.fileDependencies 存放当前模块的所有依赖的文件路径，是一个数组
          module.fileDependencies.forEach(function(filepath) {
            // ...
          })
        })

        // Webpack 会根据 Chunk 去生成输出的文件资源，每个 Chunk 都对应一个及其以上的输出文件
        // 例如在 Chunk 中包含了 CSS 模块并且使用了 ExtractTextPlugin 时
        // 该 Chunk 就会生成 .js 和 .css 两个文件
        chunk.files.forEach(function(filename) {
          // compilation.assets 存放当前所有即将输出的资源
          // 调用一个输出资源的 source() 方法能获取到输出资源的内容
          let source = compilation.assets.[filename].source()
        });
      });

      // 这是一个异步事件，要记得调用 callback 通知 Webpack 本次事件监听处理结束
      // 如果忘记了调用 callback，Webpack 将一直卡在这里而不会往后执行
      callback();
    })
  }
}
```

### 监听文件变化

Webpack 会从配置的入口模块触发，依次找出所有的依赖模块，当入口模块或者其依赖的模块发生变化时，就会触发依次新的 Compilation。

在开发插件时经常需要知道是哪个文件发生变化导致了新的 Compilation，为此可以使用如下代码：

```js
// 当依赖的文件发生变化时会触发 watch-run 事件
compiler.hooks.watchRun.tap('MyPlugin', (watching, callback) => {
  // 获取发生变化的文件列表
  const changedFiles = watching.compiler.watchFileSystem.watcher.mtimes;
  // changedFiles 格式为键值对，键为发生变化的文件路径
  if (changedFiles[filePath] !== undefined) {
    // filePath 对应的文件发生了变化
  }
  callback();
});
```

默认情况下 Webpack 只会监视入口和其他依赖的模块是否发生变化，在有些情况下项目可能需要引入新的文件，例如引入一个 HTML 文件。由于 JavaScript 文件不会去导入 HTML 文件，Webpack 就不会监听 HTML 文件的变化，编辑 HTML 文件时就不会重新触发新的 Compilation。为了监听 HTML 文件的变化，我们需要把 HTML 文件加入到依赖列表中，为此可以使用如下代码：

```js
compiler.hooks.afterCompile.tap('MyPlugin', (compilation, callback) => {
  // 把 HTML 文件添加到文件依赖列表，好让 Webpack 去监听 HTML 模块文件，在 HTML 模版文件发生变化时重新启动依次编译
  compilation.fileDependencies.push(filePath);
  callback();
});
```

### 修改输出资源

有些场景下插件需要修改、增加、删除输出的资源，要做到这点需要监听 `emit` 事件，因为发生 `emit` 事件时所有模块的转换和代码块对应的文件已经生成好，需要输出的资源即将输出，因此 `emit` 事件是修改 Webpack 输出资源的最后时机。

所有需要输出的资源会存放在 `compilation.assets` 中，`compilation.assets` 是一个键值对，键为需要输出的文件名称，值为文件对应的内容。

设置 `compilation.assets` 的代码如下：

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

### 判断 Webpack 使用了哪些插件

```js
// 判断当前配置使用了 ExtractTextPlugin
// compiler 参数即为 Webpack 在 apply(compiler) 中传入的参数
function hasExtractTextPlugin(compiler) {
  // 当前配置所有使用的插件列表
  const plugins = compiler.options.plugins;
  // 去 plugins 中寻找有没有 ExtractTextPlugin 的实例
  return plugins.find(plugin => plugin.__proto__.constructor === ExtractTextPlugin) != null;
}
```

### 文件写入

Compilation 上的 assets 可以用于文件写入

- 可将 zip 资源包设置为 `compilation.assets` 对象上

文件写入需要使用 [webpack-sources](https://www.npmjs.com/package/webpack-sources)

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

### 插件扩展：编写插件的插件

插件自身也可以通过暴露 hooks 的方式进行自身扩展，以 `html-webpack-plugin` 为例：

- `html-webpack-plugin-alter-chunks`（Sync）
- `html-webpack-plugin-before-html-generation`（Async）
- `html-webpack-plugin-alter-asset-tags`（Async）
- `html-webpack-plugin-after-html-processing`（Async）
- `html-webpack-plugin-after-emit`（Async）

## 开发调试

1. 在当前 Webpack 项目工程文件夹下面，执行命令行：

```bash
node --inspect-brk ./node_modules/webpack/bin/webpack.js --inline --progress
```

其中参数 `--inspect-brk` 就是以调试模式启动 Node：

终端会输出：

```bash
Debugger listening on ws://127.0.0.1:9229/1018c03f-7473-4d60-b62c-949a6404c81d
For help, see: https://nodejs.org/en/docs/inspector
```

2. Chrome 输入 `chrome://inspect/#devices`

```jsx | inline
import React from 'react';
import img from '../../assets/principle-analysis/chrome-devices-inspect.jpeg';

export default () => <img alt="浏览器调试模式" src={img} width={640} />;
```

3. 然后点击 Chrome 调试器中的 `继续执行`，断电就提留在我们设置在插件中的 bugger 断点了

```jsx | inline
import React from 'react';
import img from '../../assets/principle-analysis/chrome-debugger.jpeg';

export default () => <img alt="代码断点" src={img} width={640} />;
```

---

**参考资料：**

- [📝 揭秘 Webpack 插件工作流程和原理（2020-05-18）](https://juejin.im/post/5ec169786fb9a043721b46ad)
- [📝 实现自定义 Webpack 插件详解（2020-05-19）](https://juejin.im/post/5ec16a2e5188256d841a53d0)
- [📝 Webpack 学习 — Plugin（2019-03-15）](http://wushaobin.top/2019/03/15/webpackPlugin/)
- [📝 浅析 Webpack 插件化设计（2017-05-18）](https://zhuanlan.zhihu.com/p/26955349)
