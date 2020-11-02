---
nav:
  title: 最佳实践
  order: 3
group:
  title: 实战应用
  order: 1
title: 组合配置
order: 1
---

# 组合配置

## 管理配置的方法

您可以通过以下方式管理 Webpack 配置：

- 对于每一个环境都使用多个环境来组合配置，通过模块导入共享相同的配置，并通过 `--config` 参数将 Webpack 指向特定的环境
- 将配置打包成库，然后使用该库。例如：[hjs-webpack](https://www.npmjs.com/package/hjs-webpack)、[Neutrino](https://neutrino.js.org/)、[webpack-blocks](https://www.npmjs.com/package/webpack-blocks)
- 将配置转换成工具。例如：[create-react-app](https://www.npmjs.com/package/create-react-app)、[kyt](https://www.npmjs.com/package/kyt)、[nwb](https://www.npmjs.com/package/nwb)
- 在单个文件中的维护所有的配置，并在其内部进行分支，使用传入 `--env` 参数来确定分支走向

可以组合这些方法以创建更高级别的配置，然后由更小的部分组成。然后可以将这些部分添加到库中，然后通过 npm 使用它，从而可以在多个项目中使用相同的配置。

## 合并组合配置

如果配置文件被分成不同的部分，则必须以某种方式再次组合它们。通常这意味着合并对象和数组。为了解决 Object.assign 和 Array.concat 存在的问题，我们可以使用 [webpack-merge](https://www.npmjs.org/package/webpack-merge)。

`webpack-merge` 做了两件事：拼接数组并合并对象，而不是简单的覆盖它们。以下示例详细显示了这种特性：

```js
const merge = require('webpack-merge');

const result = merge({ a: [1], b: 5, c: 20 }, { a: [2], b: 10, c: 421 });

console.log(result);
// { a: [1, 2], b: 10, c: 20, d: 421 }
```

`webpack-merge` 提供了许多可控的策略，使您能够控制每个字段的行为。它们允许您对于特定的字段进行追加，添加或替换内容。

> 在组合修改 Webpack 配置的时候，[webpack-chain](https://www.npmjs.com/package/webpack-chain) 提供了一个清晰的 API 简化这一过程。

## 组合配置的好处

配置拆分提供了更好的扩展性和复用性。你可以把通用型配置和特殊型配置提取成配置单元，把这些配置单元作为包在不同的项目之间复用。

您还可以将配置作为依赖项进行管理，而不是在多个项目中复制类似的配置。当您的配置升级或者问题修复时，您的所有项目都会同时受益。

每种方法都有其优点和缺点。基于组合的方法是一个很好的起点。就组合而言，每部分的代码量是有限的，很容易阅读。你还可以看看别人是怎么做的，从而找到一些更好的做法。

也许最大的问题在于，你需要知道自己在做什么，而且第一次配置可能会缺乏经验。但这就是一个软件工程问题，它不是 Webpack 所独有的。

您可以随时迭代优化配置单元或者找到更好的配置单元。通过传入配置对象而不是多个参数，您可以在不影响其 API 的情况下更改配置单元的行为，从而根据需要有效地公开配置单元的 API。

## 配置布局

我们把 Webpack 配置分为两个文件：`webpack.config.js` 和 `webpack.parts.js`。前者包含通用型的配置，后者包含一些特殊配置，这样我们可以更方便的管理我们的配置文件。

### 按环境拆分配置

如果您按环境拆分配置，最终可能会得到如下文件结构：

```bash
.
└── config
    ├── webpack.common.js
    ├── webpack.development.js
    ├── webpack.parts.js
    └── webpack.production.js
```

在这种情况下，您将通过 Webpack `--config` 参数和 `module.exports = merge(common, config);` 来获得最终的配置环境。

### 按类别拆分配置

我们可以将特殊配置放到一个文件夹中，按照类别把 `webpack.parts.js` 拆分成一个个小的配置文件：

```bash
.
└── config
    ├── parts
    │   ├── devserver.js
    ...
    │   ├── index.js
    │   └── javascript.js
    └── ...
```

这种安排可以更快地找到与特定类别相关的配置。
