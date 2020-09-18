---
nav:
  title: 原理分析
  order: 2
title: Tree Shaking
order: 13
---

# Tree Shaking

**TreeShaking** 是 DCE（Dead Code Elimination）的实现，该功能让代码文件中没有使用过的代码片段能在构建过程中删除，从而达到构建产物的优化。

引用 TreeShaking 提出者也是 Rollup 作者的比喻：

> 如果把代码打包比作制作蛋糕。传统的方式是把鸡蛋（带壳）全部丢进去搅拌，然后放入烤箱，最后把（没有用的）蛋壳全部挑选并剔除出去。而 TreeShaking 则是一开始就把有用的蛋白蛋黄放入搅拌，最后直接作出蛋糕。

基于 ES6 的静态引用，TreeShaking 通过扫描所有 ES6 的 `export`，找出被 `import` 的内容并添加到最终代码中。

Webpack 的实现是把所有 `import` 标记为 **有使用** / **无使用** 两种，在后续压缩时进行区别处理。因为就如比喻所说，在放入烤箱（压缩混淆）前先剔除蛋壳（无使用的 `import`），只放入有用的蛋白蛋黄（有使用的 `import`）。

## 使用方法

首先源码必须遵循 ES6 的模块规范（`import` & `export`），如果是 CommonJS 规范（`require`）则无法使用。

根据 Webpack 官网的提示，Webpack2 支持 TreeShaking，需要修改配置文件，指定 Babel 处理 JavaScript 文件时不要将 ES6 模块转成 CommonJS 模块，具体做法就是：

在 `.babelrc` 设置 `babel-preset-es2015` 的 `modules` 为 `fasle`，**表示不对 ES6 模块进行处理**。

```json
// .babelrc
{
  "presets": [["es2015", { "modules": false }]]
}
```

或者在 Webpack 的 babel-loader 中设置

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [']
          }
        }
      }
    ]
  }
}
```

经过测试，Webpack 3 和 4 不增加这个 `.babelrc` 文件也可以正常 TreeShaking。

## 实现原理

### DCE

TreeShaking 的本质是消除无用的 JS 代码。无用代码消除在广泛存在于传统的编程语言编译器中，编译器可以判断出某些代码根本不影响输出，然后消除这些代码，这个称之为 **DCE**（dead code elimination）。

TreeShaking 是 DCE 的一种新的实现，JavaScript 同传统的编程语言不同的是，JavaScript 绝大多数情况需要通过网络进行加载，然后执行，加载的文件大小越小，整体执行时间更短，所以去除无用代码以减少文件体积，对 JavaScript 来说更有意义。

TreeShaking 和传统的 DCE 的方法又不太一样，传统的 DCE **消灭不可能执行的代码**，而 TreeShaking 更关注于 **消除没有用到的代码**。

### 无用模块消除

前面提到了 TreeShaking 更关注于无用模块的消除，消除那些引用了但并没有被使用的模块。

> 为什么只用 ES6 Module 才能使用 TreeShaking？

我们先来谈谈 ES6 Module 的特点：

- 只能作为模块顶层的语句出现
- `import` 的模块名只能是字符串常量
- import binding 是 immutable 的

ES6 模块依赖关系是确定的，和运行时的状态无关，可以进行可靠的静态分析，故而可以在编译时正确判断到底加载了什么代码，分析程序流，判断哪些变量未被使用、引用，进而删除无用代码，这就是 TreeShaking 的基础。

所谓 **静态分析** 就是不执行代码，从字面量上对代码进行分析，ES6 之前的模块化，比如我们可以动态 `require` 一个模块，只有执行后才知道引用的什么模块，这个就不能通过静态分析去做优化。

这是 ES6 Modules 在设计时的一个重要考量，也是为什么没有直接采用 CommonJS，正是基于这个基础上，才使得 TreeShaking 成为可能，这也是为什么 Rollup 和 Webpack2 都要用 ES6 Module Syntax 才能 TreeShaking。

### 实现细节

Webpack 负责对代码进行标记，把 `import` & `export` 标记为三类：

1. 所有 `import` 标记为 `/* harmony import */`
2. 被使用过的 `export` 标记为 `/* harmony export ([type]) */`，其中 `[type]` 和 Webpack 内部有关，可能是 `binding`、`immutable` 等等。
3. 没被使用过的 `export` 标记为 `/* unused harmony export [FuncName] */`，其中 `[FuncName]` 为 `export` 的方法名称

之后在 Uglifyjs (或者其他类似的工具) 步骤进行代码精简，把没用的都删除。

## 实例分析

### 函数处理

```js
// index.js
import { foo, bar } from './utils';

const result = foo();

console.log(result);
```

```js
// utils.js
export function foo() {
  return 'foo';
}

export function bar() {
  return 'bar';
}
```

对于没有被使用的 `bar` 方法，Webpack 标记其为 `unused harmony export bar`，但是代码依旧保留。而 `foo` 就是正常的 `harmony export (immutable)`。

之后使用 `UglifyJSPlugin` 就可以进行第二步，把 `bar` 彻底清除。

### 类的处理

```js
// index.js
import Utils from './utils';

const utils = new Utils();
const result = util.foo();

console.log(result);
```

```js
// utils.js
export default class Util {
  foo() {
    return 'foo';
  }
  bar() {
    return 'bar';
  }
}
```

注意到 Webpack 是对 Util 类整体进行标记的（标记为被使用），而不是分别针对两个方法。也因此，最终打包的代码依然会包含 `bar` 方法。这表明 Webpack TreeShaking 只处理顶层内容，例如类和对象内部都不会再被分别处理。

这主要也是由于 JS 的动态语言特性所致。如果把 `bar` 删除，考虑如下代码：

```js
// index.js
import Utils from './utils';

const utils = new Utils();
const result = util[Math.random() > 0.5 ? 'foo' : 'bar']();

console.log(result);
```

编译器并不能识别一个方法名字究竟是以直接调用的形式出现（`utils.foo()`）还是以字符串的形式（`utils['foo']`）或者其他更加离奇的方式。因此误删方法只会导致运行出错，得不偿失。

## 副作用

副作用的意思某个方法或者文件执行了之后，还会对全局其他内容产生影响的代码。例如 polyfill 在各类 `prototype` 加入方法，就是副作用的典型。

副作用总共有两种形态，是精简代码不得不考虑的问题。我们平时在重构代码时，也应当以相类似的思维去进行，否则总有踩坑的一天。

### 模块引入带来的副作用

```js
// index.js
import Utils from './utils';

console.log('Util is unused.');
```

```js
// utils.js
console.log('This is utils.js');

export default class Utils {
  foo() {
    return 'foo';
  }
  bar() {
    return 'bar';
  }
}

Array.prototype.foo = () => 'foo';
```

虽然 Util 类被引入之后没有进行任何使用，但是不能当做没引用过而直接删除。在混合后的代码中，可以看到 Utils 类的本体 (`export` 的内容) 已经没有了，但是前后的 `console.log` 和对 `Array.prototype` 的扩展依然保留。这就是编译器为了确保代码执行效果不变而做的妥协，因为它不知道这两句代码到底是干嘛的，所以他默认认定所有代码 均有 副作用。

### 方法调用带来的副作用

```js
// index.js
import { foo, bar } from './utils';

const result1 = foo();
const result2 = bar();

console.log(result1);
```

```js
// utils.js
export function foo() {
  return 'foo';
}

export function bar() {
  return 'bar';
}
```

我们引入并调用了 `bar()`，但是却没有使用它的返回值 `result2`，这种代码可以删吗？

Webpack 并没有删除这行代码，至少没有删除全部。它确实删除了 `result2`，但保留了 `bar()` 的调用（压缩的代码表现为 `Object(r.a)()`）以及 `bar()` 的定义。

这同样是因为编译器不清楚 `bar()` 里面究竟做了什么。如果它包含了如 `Array.prototye` 的扩展，那删掉就又出问题了。

### 如何解决副作用

我们很感谢 Webpack 如此严谨，但如果某个方法就是没有副作用的，我们该怎么告诉 Webpack 让他放心大胆的删除呢？

#### pure_funcs

```js
// index.js
import { foo, bar } from './utils';

const result1 = foo();

let a = 1;
let b = 2;
let result2 = Math.floor(a / b);

console.log(result1);
```

`utils.js` 和之前相同，不再重复。有差别的是 `webpack.config.js`，需要增加参数 `pure_funcs`，告诉 Webpack `Math.floor` 是没有副作用的，你可以放心删除：

```js
plugins: [
  new UglifyJSPlugin({
    uglifyOptions: {
      compress: {
          pure_funcs: ['Math.floor']
      }
    }
  })
],
```

在添加了 `pure_funcs` 配置后，原来保留的 `Math.floor(.5)` 被删除了，达到了我们的预期效果。

但这个方法有一个很大的局限性，在于如果我们把 Webpack 和 Uglify 合并使用，经过 Webpack 的代码的方法名已经被重命名了，那么在这里配置原始的方法名也就失去了意义。而例如 `Math.floor` 这类全局方法不会重命名，才会生效。因此适用性不算太强。

#### package.json 的 sideEffects

Webpack 4 在 `package.json` 新增了一个配置项叫做 `sideEffects`， 值为 `false` 表示整个包都没有副作用；或者是一个数组列出有副作用的模块。详细的例子可以查看 Webpack 官方提供的 [示例](https://github.com/webpack/webpack/blob/0d4607c68e/examples/side-effects/README.md)。

从结果来看，如果 `sideEffects` 值为 `false`，当前包 `export` 了 5 个方法，而我们使用了 2 个，剩下 3 个也不会被打包，是符合预期的。但这要求包作者的自觉添加，因此在当前 Webpack 4 推出不久的情况下，局限性也不算小。

生产环境打包的时候，会默认开启 TreeShaking，如果不设置 `sideEffects`，某些通过 `import` 方式引入的 CSS 文件可能不会被打包，因为 TreeShaking 会甩掉引入后未使用的代码。通常，CSS 文件一般都是引入就好，很少使用里面的方法或变量，所以很容易被 Webpack 认为是没有用的代码，从而不会被打包。所以，不希望被 TreeShaking 的文件，请在 `sideEffects` 中配置与之匹配的正则表达式。

```json
{
  "sideEffects": ["*.css", "*.less"]
}
```

#### concatenateModule

Webpack3 开始加入了`webpack.optimize.ModuleConcatenateModulePlugin()`，到了 Webpack4 直接作为 `mode = 'production'` 的默认配置。这是对 Webpack Bundle 的一个优化，把本来 **每个模块包裹在一个闭包里的情况**，优化成 **所有模块都包裹在同一个闭包里** 的情况。本身对于代码缩小体积有很大的提升，这里也能侧面解决副作用的问题。

```js
// index.js
import { foo, bar } from './utils';

const result1 = foo();
const result2 = bar();

console.log(result1);
```

```js
// utils.js
export function foo() {
  return 'foo';
}

export function bar() {
  return 'bar';
}
```

在开启了 concatenateModule 功能后，`bar` 方法的调用和本体都被消除了，`foo` 方法的调用和定义被合到一起，变成直接 `console.log('bar')`。除此之外，这个功能的原有目的：代码量减少了。

这个功能的本意是把所有模块最终输出到同一个方法内部，从而把调用和定义合并到一起。这样像 `bar()` 这样没有副作用的方法就可以在合并之后被轻易识别出来，并加以删除。有关这个功能更加详细的介绍可以看这篇文章

## 最佳实践

### 合理模块设计

合理模块设计才是减少代码体积的关键

TreeShaking 其实只是一个打包器的特性，良好的模块拆分才是减少代码体积的关键。

对于 ES6 模块来说，会有 `_default export_` 和 `_named export_` 的区别。有些开发者喜欢把所有东西都弄成一个对象塞到 default 里面。`_default export_` 在概念上来说并不仅仅一个名字叫做 default 的 export，虽然它会被这样转译。把一切东西都塞到 default 里面是一个错误的选择，会让 TreeShaking 无效。从语意上上来说，`_default export_` 用来说明这个模块是什么，`_named export_` 用来说明这个模块有什么。合理的模块拆分是一定可以让编译器只打包到所需的代码的。

- **使用 ES6 Module**：不仅是项目本身，引入的库最好也是 ES 版本，比如用 `lodash-es` 代替 `lodash`。另外注意 TypeScript 和 Babel 的配置是否会把代码编译成非 ES Module 版本。
- **最纯函数调用使用 PURE 注释**：由于无法判断副作用，所以对于导出的函数调用最好使用 PURE 注释，不过一般来说有个相关的 babel 插件自动添加。

### 实用建议

1. 尽量不屑带有副作用的代码。诸如编写了立即执行函数，在函数里又使用了外部变量等。
2. 如果对 ES6 语义特性要求不是特别严格，可以开启 Babel 的 `loose` 模式，这个要根据自身项目判断，如：是否真的要不可枚举 class 的属性。
3. 如果是开发 JavaScript 库，请使用 rollup。并且提供 ES6 Module 的版本，入口文件地址设置到 `package.json` 的 `module` 字段
4. 如果 JavaScript 库开发中，难以避免地产生各种副作用代码，可以将功能函数或者组件，打包成单独的文件或目录，以便于用户可以通过目录去加载。如有条件，也可为自己的库开发单独的 `webpack-loader`，便于用户按需加载。
5. 如果是工程项目开发，对于依赖的组件，只能看组件提供者是否有对应上述 3、4 点的优化。对于自身的代码，除 1、2 两点外，对于项目有极致要求的话，可以先进行打包，最终再进行编译。
6. 如果对项目非常有把握，可以通过 uglify 的一些编译配置，如：pure_getters: true，删除一些强制认为不会产生副作用的代码。

---

**参考资料：**

- [📖 Tree Shaking](https://webpack.js.org/guides/tree-shaking/)
- [📝 Tree Shaking versus dead code elimination](https://medium.com/@Rich_Harris/tree-shaking-versus-dead-code-elimination-d3765df85c80)
- [📝 Tree-Shaking 性能优化实践：原理篇（2018 年 01 月 04 日）](https://juejin.im/post/5a4dc842518825698e7279a9)
- [📝 TTree-Shaking 性能优化实践：实践篇（2018 年 01 月 04 日）](https://juejin.im/post/5a4dca1d518825128654fa78)
- [📝 T 你的 TreeShaking 并没什么卵用（2018 年 01 月 11 日）](https://zhuanlan.zhihu.com/p/32831172)
- [📝 体积减少 80%!释放 webpack tree-shaking 的真正潜力](https://juejin.im/post/5b8ce49df265da438151b468)
- [📝 浅谈 ES 模块和 Webpack Tree-shaking（2018 年 09 月 09 日）](https://zhuanlan.zhihu.com/p/43844419)
- [🛠 webpack-css-treeshaking-plugin](https://github.com/lin-xi/webpack-css-treeshaking-plugin)
- [🛠 webpack-deep-scope-analysis-plugin：](https://github.com/vincentdchan/webpack-deep-scope-analysis-plugin)
