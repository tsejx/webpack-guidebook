---
nav:
  title: 基本综述
  order: 1
group:
  title: 基本概念
  order: 1
title: Webpack
order: 7
---

# Webpack

Webpack 是一个模块打包器。Webpack 单独与一些的 Task Runner 配合工作。然而，由于社区开发的 Webpack 插件，Bundler 和 Task Runner 之间的界限变得模糊。有时，这些插件用于执行通常在 Webpack 之外完成的任务，例如清理构建目录或部署构建代码。

## 依赖于模块

在一个项目中，Webpack 包含 `输入` 和 `输出` 两个部分。打包过程从用户定义的 `模块` 开始，在模块中又可以通过 `导入` 指向其他模块。

当您使用 Webpack 打包项目时，它会遍历导入，构建项目的 `依赖关系图`，然后根据配置生成 `输出`。此外，还可以定义 `拆分点`，以在项目代码本身内创建单独的包。

Webpack 支持开箱即用的 ES2015，CommonJS 和 AMD 模块格式。loader 机制也适用于 CSS，通过 css-loader，我们可以使用 `@import` 和 `url()` 来导入 CSS 文件。您还可以找到特定任务的插件，例如压缩，国际化，HMR 等。

> `依赖图` 是描述节点如何相互关联的有向图。我们通过依赖图描述了文件之间的引用（`require`，`import`）关系。Webpack 在不执行源代码的情况下静态遍历这些源代码，以生成创建 bundle 所需的 `依赖图`。

## 执行流程

```jsx | inline
import React from 'react';
import img from '../../assets/basic/webpack-workflow.png';

export default () => <img alt="Webpack执行流程" src={img} width={800} />;
```

Webpack 通常从 JavaScript 模块开始遍历。在此过程中，Webpack 会根据 Loaders 配置评估模块是否匹配，并且会按照配置来转换匹配的模块。

### 解析过程

Entry 本身就是一个模块。当 Webpack 遇到一个 Entry 时，Webpack 会尝试使用 Entry 的 resolve 配置将 Entry 与文件系统中的文件匹配。除了 node_modules 之外，您还可以告诉 Webpack 对特定目录执行查找。也可以调整 Webpack 匹配文件扩展名的方式，并且可以为目录定义特定的别名。

如果解析通过失败，Webpack 会引发运行时错误。如果 Webpack 正确解析文件，Webpack 将根据 Loader 的定义对匹配的文件执行处理。每个 Loader 对模块内容应用特定的转换。

Loader 与待解析文件之间的匹配规则可以通过多种途径配置，包括按文件类型和按文件系统中的位置。Webpack 的灵活性甚至允许您根据文件导入项目的位置将特定转换应用于文件。

Loader 的执行也具有相同的解析过程，Webpack 允许您在确定应使用哪个 Loader 时应用类似的逻辑。由于这个原因，Webpack 必须预先解析 Loader 的配置。如果 Webpack 无法查找到 Loader 程序，则会引发运行时错误。

> 通过 [enhanced-resolve](https://www.npmjs.com/package/enhanced-resolve) 包，Webpack 可以异步加载 Loader。

### 处理各种文件类型

Webpack 在构造依赖图时解析它遇到的每个模块。如果 Entry 包含依赖项，则将针对每个依赖项递归执行该过程，直到遍历完成为止。Webpack 可以针对任何文件类型执行此过程，这与 Babel 或 Sass 编译器等专用工具不同。

Webpack 使您可以控制如何处理遇到的不同类型的资源。例如，您可以决定将资源 `内联` 到 JavaScript 代码中以避免被处理。Webpack 还允许您使用 CSS 模块等技术将样式与组件结合，并避免一些 CSS 兼容性问题。这种灵活性使 Webpack 非常有价值。

虽然 Webpack 主要用于打包 JavaScript，但它可以捕获图像或字体等资源，并为它们发出单独的文件。Entry 只是打包过程的起点。Webpack 打包出的内容完全取决于您配置它的方式。

### 转换过程

假设所有的 Loader 都被找到，Webpack 将从下到上和从右到左（`styleLoader(cssLoader('./main.css'))`）的对 Loader 进行匹配，同时依次通过每个匹配 Loader 来运行模块。因此，您将获得 Webpack 在打包结果中注入的输出。

如果所有加载器执行都在没有运行时错误的情况下完成，则 Webpack 将源代码包含在最后一个包中。插件允许您在打包过程的不同阶段拦截 `运行时事件`。

虽然 Loader 可以做很多事情，但它们不能为高级任务提供足够的动力。插件可以拦截 Webpack 提供的 `运行时事件`。一个很好的例子是包内容的提取，当 `MiniCssExtractPlugin` 与 Loader 一起使用时，从包中抽出 CSS 并将其提取到单独的文件中。如果没有这一步，CSS 将在生成的 JavaScript 中内联，因为 Webpack 默认将所有代码视为 JavaScript。

### 输出文件

转换完每个模块后，Webpack 会写入 `Output`。Output 包括一个启动脚本，其中包含一个描述如何在浏览器中开始执行结果的 manifest。如本书后面所述，可以将 manifest 提取到自己的文件中。Output 根据您使用的构建目标而有所不同（Web 不是唯一选项）。

这并不是打包过程的全部内容。例如，您可以定义特定的拆分点，其中 Webpack 生成基于应用程序逻辑加载的单独的包。Code Splitting 章节阐述了更多细节。

## 配置驱动

Webpack 的核心依赖于配置，以下是根据官方 Webpack 教程改编的示例配置：

```js
const webpack = require('webpack');

module.exports = {
  // 这里是打包入口
  entry: {
    app: './src/index.js',
  },

  // 这里是打包出口
  output: {
    // 输出到同样的文件夹
    path: __dirname,

    // 通过某种模式使用入口文件的名字定义打包文件名称
    filename: '[name].js',
  },

    // 对于每一个文件导入提供一些解析规则
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },

  // 定义一些插件，来处理转换过程外额外要做的事情
  plugins: [new webpack.DefinePlugin({ ... })],

  // 调整模块解析的算法
  resolve: {
    alias: { ... }
  }
};
```

Webpack 的配置模型有时会感觉有点不透明，因为配置文件可能看起来是单一庞杂的。除非你知道背后的想法，否则很难理解 Webpack 在做什么。提供条理清晰的配置方法是本书存在的主要目的之一。

##
