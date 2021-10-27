---
nav:
  title: 架构原理
  order: 2
group:
  title: 工作原理
  order: 1
title: 作用域提升
order: 14
---

# 作用域提升

可以简单地把 Scope Hoisting 理解为把每个模块被 Webpack 处理成模块初始化函数整理到一个统一的包裹函数里，也就是把多个作用域用一个作用域取代，以减少内存消耗并减少包裹块代码，从每个模块有一个包裹函数变成只有一个包裹函数包裹所有的模块。但是有一个前提就是，当模块的引用次数大于 1 时，比如被引用了两次或以上，那么这个效果会无效，这是因为被引用多次即这个模块代码会被内联多次，从而增加了打包出来的 JS Bundle 体积。也就是被引用多次的模块在被 Webpack 处理后，会被独立的包裹函数所包裹。

为什么要作用域提升？

- 大量函数闭包包裹代码，导致体积增大（模块越多越明显）
- 运行代码时创建的函数作用域变多，内存开销变大

## 模块构建

### 模块转换分析

Webpack 在对我们的代码进行打包构建时，会把我们的代码打包成什么样子呢？

以下面代码为例，`helloworld.js` 输出一个返回 `helloworld` 字符串的 `helloworld` 函数，在入口文件执行并使用 `document.write` 方法写入 HTML 文档。

```js
// index.js
import { helloworld } from './helloworld';
import '../../common';

document.write(helloworld());
```

上述代码经过 Webpack 打包构建后会将模块转换为 **模块初始化函数**：

```js
(function (module, __webpack_exports__, __webpack_require__) {
  /* 执行代码 */
});
```

在模块初始化函数内主要做了以下两件事情：

- 被 Webpack 转换后的模块会带上一层包裹
- `import` 会被转换成 `__webpack_require__`

### 进一步分析 Webpack 的模块机制

各个模块被独立打包后，汇集成 `modules` 作为参数传入一个匿名函数：

```js
(function (modules) {
  // 模块缓存
  var installedModules = {};

  // 引入函数
  function __webpack_require__(moduleId) {
    // 检查模块是否缓存
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }

    // 创建新模块（并放入缓存中）
    var module = (installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {},
    });

    // 执行模块函数
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

    // 模块加载标识
    module.l = true;

    // 返回导出的模块
    return module.exports;
  }

  // 其他模块方法，后面省略...

  // 启动程序
  __webpack_require__(0);
})([
  /* 0 module */
  function (module, __webpack_exports__, __webpack_require__) {
    //...
  },
  /* 1 module */
  function (module, __webpack_exports__, __webpack_require__) {
    //...
  },
]);
```

分析：

- 打包出来的是一个 IIFE（匿名闭包）
- `modules` 是一个数组，每项是一个模块初始化函数
- `__webpack_require__` 用来加载模块，返回 `module.exports`
- 通过 `WEBPACK_REQUIRE_METHOD(0)` 启动程序

更深入的分析可以看这篇文章：[从 Bundle 文件看 Webpack 模块机制](https://zhuanlan.zhihu.com/p/25954788)

简单来说，Webpack 将所有模块都用函数包裹起来，然后实现了一套模块加载、执行与缓存的功能，使用这样的结构是为了更容易实现 [Code Splitting](https://webpack.js.org/guides/code-splitting/)（包括[按需加载](https://webpack.js.org/guides/code-splitting/#dynamic-imports)）、[模块热更新](https://webpack.js.org/concepts/hot-module-replacement/)等功能。

但如果你在 Webpack 3 中添加了 ModuleConcatenationPlugin 插件，这个结构会发生一些变化。

## 实现原理

同样的源文件在使用了 ModuleConcatenationPlugin 之后，打包出来的文件会变成下面这样：

```js
({
  './src/index.js': function (module, __webpack_exports__, __webpack_require__) {
    'use strict';
    eval(/* 模块代码 */);
  },
  './src/helloworld.js': function (module, __webpack_exports__, __webpack_require__) {
    'use strict';
    eval(/* 模块代码 */);
  },
  /* 其他模块 */
});
```

显而易见，这次 Webpack 将所有模块都放在了一个函数里，直观感受就是——函数声明少了很多，因此而带来的好处有：

1. 文件体积比之前更小。
2. 运行代码时创建的函数作用域也比之前少了，开销也随之变小。

项目中的模块越多，上述的两点提升就会越明显。

📌 实现原理：将所有模块的代码按照引用顺序放在一个函数的作用域里，然后适当地重命名一些变量以防止变量名冲突。

对比：通过 Scope Hoisting 可以减少函数声明代码和内存开销

暂不支持 CommonJS 模块语法的原因是，这种模块语法中的模块是可以动态加载的，例如下面这段代码：

```js
var directory = './modules/';
if (Math.random() > 0.5) {
  module.exports = require(directory + 'foo.js');
} else {
  module.exports = require(directory + 'bar.js');
}
```

这种情况很难分析出模块之间的依赖关系及输出的变量。

而 ES2015 的模块语法规定 `import` 和 `export` 关键字必须在顶层、模块路径只能用字符串字面量，这种 **强制静态化** 的做法使代码在编译时就能确定模块的依赖关系，以及输入和输出的变量，所以这种功能实现起来会更加简便。

不过，未来 Webpack 可能也会支持 CommonJS 的模块语法。

## 使用方法

在 Webpack 3 需要手动添加代码：

```js
modules.exports = {
  plugins: [new webpack.optimize.ModuleConcatenationPlugin()],
};
```

在 Webpack4 只需要将 `mode` 设置为 `production` 将会自动使用 Scope Hoisting，其次必须使用 ES6 语法，CJS 不支持这种特性。

但也有可能项目中添加上了 ModuleConcatenationPlugin 之后，打包出来的代码完全没有发生变化。

这种情况发生的原因：

- 大部分 NPM 包仍然是 CommoJS 语法（例如 [lodash](https://lodash.com/)）
- 使用了 [ProvidePlugin](https://webpack.js.org/plugins/provide-plugin/)
- 使用了 `eval()` 函数
- 你的项目有多个 `entry`

运行 Webpack 时加上 `--display-optimization-bailout` 参数可以得知为什么你的项目无法使用 Scope Hoisting：

```bash
webpack --display-optimization-bailout
```

另外，当你使用这个插件的时候，模块热更新将不起作用，所以最好只在代码优化的时候才使用这个插件。

## 参考资料

- [📝 Webpack 3 的新功能：Scope Hoisting（2017-07-20）](https://zhuanlan.zhihu.com/p/27980441)
