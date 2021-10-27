---
nav:
  title: 架构原理
  order: 2
group:
  title: 底层原理
  order: 2
title: Tapable
order: 4
---

# Tapable

Webpack 本质上是一种事件流的机制，它的工作流程就是将各个插件串联起来，而实现这一切的核心就是 Tapable，Webpack 中最核心的负责编译的 Compiler 和负责创建 bundles 的 Compilation 都是 Tapable 的子类，并且实例内部的生命周期也是通过 Tapable 库提供的钩子类实现的。

## 基本概念

[Tapable](https://github.com/webpack/tapable) 是一个小型的库，允许你对一个 JavaScript 模块添加和应用插件。它可以被继承或混入到其他模块中。

Tapable 是类似于 Node.js 的 EventEmitter 的类，专注于自定义事件的触发和处理。除此之外，Tapable 还允许你通过回调函数的参数，访问事件的 **触发者**（emittee）或 **提供者**（producer），从而控制着 Webpack 的插件系统。

Tapable 有四组成员函数：

- `plugin(name:string, handler:function)`：允许将一个自定义插件注册到 Tapable 实例 的事件中。它的行为和 EventEmitter 的 `on()` 方法相似，用来注册一个处理函数/监听器，来在信号/事件发生时做一些事情。
- `apply(…pluginInstances: (AnyPlugin|function)[])`：`AnyPlugin` 应该是一个拥有 `apply` 方法的类（也可以是一个对象，但是不常见），或者只是一个包含注册代码的函数。这个方法只 **调用** 插件的定义，从而将真正的事件监听器可以注册到 _Tapable_ 实例的注册列表中。
- `applyPlugins*(name:string, …)`：_Tapable_ 实例可以通过使用这些函数，在指定的 `hash` 下应用所有的插件。这一组方法的行为和 `EventEmitter` 的 `emit()` 方法相似，使用多种策略细致地控制事件的触发。
- `mixin(pt: Object)`：一个简单地方法，使用混入而不是继承的方式扩展 `Tapable` 的原型。

不同的 `applyPlugins*` 方法覆盖了以下使用场景：

- 连续地执行插件。
- 并行地执行插件。
- 一个接一个地执行插件，从前面的插件（瀑布流）获取输入。
- 异步地执行插件。
- 在允许时停止执行插件：也就是说，一旦一个插件返回了一个非 `undefined` 值，跳出执行流，返回这个插件的返回值。听起来像是 `EventEmitter` 的 `once()` 方法，但是完全不同。

## 使用示例

[Compiler](https://webpack.docschina.org/api/compiler) 是 Webpack 的一个核心 Tapable 实例，负责编译 Webpack 配置对象并返回 [Compilation](https://webpack.docschina.org/api/compilation) 实例。而 Compilation 实例执行时，会创建所需的 bundles。

```js
// node_modules/webpacl/lib/Compiler.js
var Tapable = require('tapable');

function Compiler() {
  Tapable.call(this);
}

Compiler.prototype = Object.create(Tapable.prototype);
```

现在在这个 compiler 上写插件：

```js
// my-custom-plugin.js
function CustomPlugin() {}

CustomPlugin.prototype.apply = function (compiler) {
  compiler.plugin('emit', pluginFunction);
};
```

compiler 会在生命周期中适当的时机执行这个插件：

```js
// node_modules/webpacl/lib/Compiler.js

// 将获取 `emit` 名称下所有插件并运行它们
this.apply * ('emit', options);
```

## 实例钩子

Tapable 库暴露了很多 Hook（钩子）类，为插件提供挂载的钩子：

| 钩子                     | 钩入方式                        | 作用                                                                          |
| :----------------------- | :------------------------------ | :---------------------------------------------------------------------------- |
| Hook                     | `tap`、`tapAsync`、`tapPromise` | 钩子基类                                                                      |
| SyncHook                 | `tap`                           | 同步钩子                                                                      |
| SyncBailHook             | `tap`                           | 同步熔断钩子，只要执行的 handler 有返回值，剩余 handler 不执行                |
| SyncWaterfallHook        | `tap`                           | 同步流水钩子，上个 handler 的返回值作为下个 handler 的输入值                  |
| SyncLoopHook             | `tap`                           | 同步循环钩子，只要执行的 handler 有返回值，一直循环执行此 handler             |
| AsyncParallelHook        | `tap`、`tapAsync`、`tapPromise` | 异步并发钩子，handler 并行触发                                                |
| AsyncParallelBailHook    | `tap`、`tapAsync`、`tapPromise` | 异步并发熔断钩子，handler 并行触发，但是跟 handler 内部调用回调函数的逻辑有关 |
| AsyncSeriesHook          | `tap`、`tapAsync`、`tapPromise` | 异步串行钩子，handler 串行触发                                                |
| AsyncSeriesBailHook      | `tap`、`tapAsync`、`tapPromise` | 异步串行熔断钩子，handler 并行触发，但是跟 handler 内部调用回调函数的逻辑有关 |
| AsyncSeriesWaterfallHook | `tap`、`tapAsync`、`tapPromise` | 异步串行流水钩子，上个 handler 可以根据内部的回调函数传给下个 handler         |

**Hook Helper 与 Tapable 类**

| 名称            | 作用                                    |
| :-------------- | :-------------------------------------- |
| HookCodeFactory | 编译生成可执行 fn 的工厂类              |
| HookMap         | Map 结构，存储多个 Hook 实例            |
| MutiHook        | 组合多个 Hook 实例                      |
| Tapable         | 向前兼容老版本，实例必须拥有 Hooks 属性 |

## 钩子分类

Hook 的类型可以按照 **事件回调的运行逻辑** 或者 **触发事件的方式** 来分类。

**事件回调的运行逻辑**

| 类型      | 方法                                                                                                                         |
| :-------- | :--------------------------------------------------------------------------------------------------------------------------- |
| Basic     | 基础类型，单纯的调用注册的事件回调，并并不关心其内部的运行逻辑                                                               |
| Bail      | 保险类型，当一个事件回调在运行时返回的值不为 `undefined` 时，停止后面事件回调的执行                                          |
| Waterfall | 瀑布类型，如果当前执行的事件回调返回值不为 `undefined`，那么就把下一个事件回调的第一个参数替换成这个值                       |
| Loop      | 循环类型，如果当前执行的事件回调的返回值不是 `undefined`，重新从第一个注册的事件回调处执行，直到当前执行的事件回调没有返回值 |

**触发事件的方式**

| 类型          | 方法                                                                                                                                                                                                                                                                              |
| :------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sync          | 同步方法。Sync 开头的 Hook 类只能用 `tap` 方法注册事件回调，这类事件回调会同步执行；如果使用 `tapAsync` 或者 `tapPromise` 方法注册则会<strong style="color: red">报错</strong>                                                                                                    |
| AsyncSeries   | 异步串行钩子。Async 开头的 Hook 类，没法用 `call` 方法触发事件，必须用 `callAsync` 或者 Promise 方法触发；这两个方法都能触发 `tap`、`tapAsync` 和 `tapPromise` 注册的事件回调；AsyncSeries 按照顺序执行，当前事件回调如果是异步的，那么会等到异步执行完毕才会执行下一个事件回调。 |
| AsyncParallel | 异步并行执行钩子。AsyncParalle 会并行执行所有的事件回调                                                                                                                                                                                                                           |

### 使用方式

Tapable 暴露出来的都是类方法，`new` 一个类方法获得我们需要的钩子。

class 接受数组参数 `options`，非必传。类方法会根据传参，接受同样数量的参数。

🌰 **使用示例：**

```js
const hook1 = new SyncHook(['arg1', 'arg2', 'arg3']);
```

Tabpack 提供了 同步 & 异步 绑定钩子的方法，并且他们都有帮 ID 难过事件和执行事件对应的方法。

| Async\*                         | Sync\*       |
| :------------------------------ | :----------- |
| 绑定：`tapAsync/tapPromise/tap` | 绑定：`tap`  |
| 执行：`callAsync/promise`       | 执行：`call` |

<br />

```js
const hook1 = new SyncHook(['arg1', 'arg2', 'arg3']);

// 绑定事件到 Webpack 事件流
hook1.tap('hook1', (arg1, arg2, arg3) => console.log(arg1, arg2, arg3));

// 执行绑定的事件
hook1.call(1, 2, 3);
```

## 拦截器

所有钩子都提供额外的拦截器（Interception） API：

```js
// 注册拦截器
compiler.hooks.calculateRoutes.intercept({
  call: (source, target, routesList) => {
    console.log('Starting to calculate routes.');
  },
  register: (tapInfo) => {
    // tapInfo = { type: 'promise', name: 'GoogleMapsPlugin', fn: ... }
    console.log(`${tapInfo.name} is doing sth.`);
    return tapInfo;
  },
});
```

- `call: (...args) => void`：当你的钩子触发之前（也就是 `call()` 之前），就会触发这个函数，你可以访问钩子的参数，多个钩子执行一次
- `tap: (tap:Tap) => void`：每个钩子执行之前（多个钩子执行多个），就会触发这个函数
- `loop: (...args) => void`：这个会为你的每个循环钩子（LoopHook，就是类型到 Loop 的）触发，具体什么时候没说
- `register: (tap: Tap) => Tap | undefined`：每添加一个 Tap 都会触发你 interceptor 上的 register，你下个拦截器的 register 函数得到的参数，取决于你上个 register 返回的值，所以最好返回一个 `tap` 钩子

## 上下文

插件和拦截器都可以选择加入一个可选的 `context` 对象，这个可以被用于传递随意的值到队列中的插件和拦截器。

```js
compiler.hooks.accelerate.intercept({
  context: true,
  tap: (context, tapInfo) => {
    // tapInfo = { type: "sync", name: "NoisePlugin", fn: ... }
    console.log(`${tapInfo.name} is doing it's job`);

    // `context` starts as an empty object if at least one plugin uses `context: true`.
    // 如果最少有一个插件使用 `context` 那么context 一开始是一个空的对象
    // If no plugins use `context: true`, then `context` is undefined
    // 如过tap进去的插件没有使用`context` 的 那么内部的`context` 一开始就是undefined
    if (context) {
      // Arbitrary properties can be added to `context`, which plugins can then access.
      // 任意属性都可以添加到`context`, 插件可以访问到这些属性
      context.hasMuffler = true;
    }
  },
});

compiler.hooks.accelerate.tap(
  {
    name: 'NoisePlugin',
    context: true,
  },
  (context, newSpeed) => {
    if (context && context.hasMuffler) {
      console.log('Silence...');
    } else {
      console.log('Vroom!');
    }
  }
);
```

## 参考资料

- [📖 webpack/tapable](https://github.com/webpack/tapable)
- [📖 Webpack 中文文档：Tapable](https://webpack.docschina.org/api/tapable/#src/components/Sidebar/Sidebar.jsx)
- [📝 Webpack 源码解读：理解 Tapable 原理（2020-04-24）](https://zhuanlan.zhihu.com/p/135997214)
- [📝 Webpack 核心库 Tapable 的使用与原理分析（2020-01-06）](https://zhuanlan.zhihu.com/p/100974318)
- [📝Webpack 插件机制之 Tapable 源码解析（2019-11-25）](https://juejin.im/post/5dc169b0f265da4d542092c6)
- [📝 编写自定义 Webpack 插件从理解 Tapable 开始](https://juejin.im/post/5dcba29f6fb9a04abb01fd77)
- [📝 深入源码解析 Tapable 实现原理（2019-11-05）](https://juejin.im/post/5dc16519f265da4cf1583eb2)
- [📝 基于数据结构从源码解析 Webpack 核心模块 Tapable（2019-10-31）](https://zhuanlan.zhihu.com/p/89443337)
- [📝 Webpack Tapable 使用研究](https://juejin.im/post/5d36faa9e51d45109725ff55)
- [📝 干货！撸一个 Webpack 插件（内含 Tapable 详解+ Webpack 流程）（2018-11-14）](https://juejin.im/post/5beb8875e51d455e5c4dd83f)
- [📝 异步编程学习笔记之 Tapable 源码分析（2018-02-05）](https://zhuanlan.zhihu.com/p/33577267)

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
      this.taps.forEach((tap) => tap.fn(name));
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
    this.hooks.run.callAsync(this, (err) => {
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
