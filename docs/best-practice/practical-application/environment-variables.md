---
nav:
  title: 最佳实践
  order: 3
group:
  title: 实战应用
  order: 1
title: 环境变量
order: 6
---

# 环境变量

有时，部分代码应仅在开发期间执行，或者有一些实验性质的代码不适宜放在生产环境中。控制 **环境变量** 变得很有价值，因为您可以使用它们切换功能。

由于 JavaScript 压缩会删除一些不需要的代码，因此您可以按照这样的形式来编写自己的代码。Webpack DefinePlugin 可以自由替换环境变量，以便您可以根据环境变量将 `if (process.env.NODE_ENV === "development")` 类型的代码转换为 `if (true)` 或 `if (false)`。

您可以找到依赖此行为的包。React 可能是早期采用该技术的最著名的例子。因此，使用 DefinePlugin 可以在某种程度上降低 React 生产构建的大小，并且您可以看到其他软件包也具备类似的效果。

Webpack 4 基于给定模式设置 `process.env.NODE_ENV`。不过，了解它并知道其工作方式还是非常必要的。

## DefinePlugin 的基本思想

要更好地理解 DefinePlugin 的基本思想，请考虑以下示例：

```js
var foo;

// 依赖于上面 foo 变量，不能够随意替换
if (foo === 'bar') {
  console.log('bar');
}

// 可以自由替换，因为上文不存在 bar 变量
if (bar === 'bar') {
  console.log('bar');
}
```

如果你用类似 `"foobar"` 的字符串替换 `bar`，那么你最终会得到如下代码：

```js
var foo;

// 依赖于上面 foo 变量，不能够随意替换
if (foo === 'bar') {
  console.log('bar');
}

// 可以自由替换，因为上文不存在 bar 变量
if ('foobar' === 'bar') {
  console.log('bar');
}
```

进一步的分析显示，`"foobar" === "bar"` 等于 `false` 压缩器会得到以下内容：

```js
var foo;

// 依赖于上面 foo 变量，不能够随意替换
if (foo === 'bar') {
  console.log('bar');
}

// 可以自由替换，因为上文不存在 bar 变量
if (false) {
  console.log('bar');
}
```

接着，压缩器消除了 `if` 语句，因为它们永远都不会被执行：

```js
var foo;

// 依赖于上面 foo 变量，不能够随意替换
if (foo === 'bar') {
  console.log('bar');
}

// if (false) 意味整个块都会被移除
```

消除是 DefinePlugin 的核心思想，它允许不同的切换。压缩器执行分析并切换代码的 ​​ 整个部分。

## process.env.NODE_ENV

和以前一样，将这个想法封装成一个函数。由于 Webpack 替换自由变量的方式，你应该用 `JSON.stringify` 对变量进行转化，最终得到一个像 `'"demo"'` 一样的字符串，然后 Webpack 将其插入到对应的字段中：

```js
// webpack.parts.js
const webpack = require('webpack');

exports.setFreeVariable = (key, value) => {
  const env = {};
  env[key] = JSON.stringify(value);

  return {
    plugins: [new webpack.DefinePlugin(env)],
  };
};
```

将其合并到主配置上：

```js
// webpack.config.js
const commonConfig = merge([parts.setFreeVariable('Hello', 'hello from config')]);
```

> [webpack-conditional-loader](https://www.npmjs.com/package/webpack-conditional-loader) 基于代码注释执行类似的操作，它可以用来消除整个代码块。

> `webpack.EnvironmentPlugin(["NODE_ENV"])` 是一种允许您引用环境变量的快捷方式。它在底层使用了 `DefinePlugin`，你可以通过传递 `process.env.NODE_ENV` 达到相同的效果。

## 通过 Babel 替换自由变量

[babel-plugin-transform-inline-environment-variables](https://www.npmjs.com/package/babel-plugin-transform-inline-environment-variables) 可以实现这样的效果。[babel-plugin-transform-define](https://www.npmjs.com/package/babel-plugin-transform-define) 和 [babel-plugin-minify-replace](https://www.npmjs.com/package/babel-plugin-minify-replace) 是 Babel 中的替代方案。

## 选择要使用的模块

本章中讨论的技术可用于根据环境变量选择整个模块。如上所示，DefinePlugin 基于拆分分支允许您选择要使用的代码以及要丢弃的代码。这个想法可用于在模块级别实现分支。考虑下面的文件结构：

```bash
.
└── store
    ├── index.js
    ├── store.dev.js
    └── store.prod.js
```

我们的想法是根据环境变量来选择 `dev` 或 `prod` 版本。我们在 index.js 中来处理这部分工作：

```js
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./store.prod');
} else {
  module.exports = require('./store.dev');
}
```

Webpack 可以根据 DefinePlugin 的声明来选择正确的代码。此处您必须使用 CommonJS 模块规范，因为 ES2015 `import` 不允许动态导入行为。

---

**参考资料：**

- [实用 Webpack 插件之 DefinePlugin](https://segmentfault.com/a/1190000017217915)
