---
nav:
  title: 最佳实践
  order: 3
group:
  title: 实战应用
  order: 1
title: 加载脚本
order: 5
---

# 加载脚本

## Babel

Webpack 默认处理 ES2015 模块并将其转换为代码，但它不会转换特定语法，例如 `const`。生成的代码可能会出现问题，尤其是在旧版浏览器中。

通过 [Babel](https://babeljs.io/) 编译代码可以解决这个问题，Babel 是一个支持 ES2015 + 语法的著名 JavaScript 编译器。类似于 ESLint，它建立在预设和插件之上。预设是插件的集合，您也可以定义自己的插件。

> 鉴于扩展现有预设时的局限性，[modify-babel-preset](https://www.npmjs.com/package/modify-babel-preset) 允许您基于一个基本预设来进行灵活的扩展。

尽管 Babel 可以单独使用，但您也可以将它与 Webpack 连接起来。在开发过程中，如果您使用的浏览器支持的语言特性，则跳过处理。

如果您不依赖任何自定义语言特性并使用现代浏览器工作，则跳过处理是一个不错的选择。但是，在编译生产代码时，通过 Babel 处理几乎是必需的。

你可以通过 [babel-loader](https://www.npmjs.com/package/babel-loader) 在 Webpack 中使用 babel。它可以获取项目级别的 Babel 配置，或者您可以在 webpack loader 本身进行配置。[babel-webpack-plugin](https://www.npmjs.com/package/babel-webpack-plugin) 是另一个鲜为人知的选择。

您可以使用 babel 来编译项目的 Webpack 配置。要实现此目的，请使用 webpack.config.babel.js 来命名 Webpack 配置。[interpret](https://www.npmjs.com/package/interpret) 包使用了这种方式，它也支持其他编译器。

> 如果您使用 webpack.config.babel.js，请注意设置 `"modules": false`。如果要使用 ES2015 模块语法，您可以跳过 Babel 全局配置中的设置，然后按照下面的讨论为每个环境进行单独配置。

Babel 中的关键配置：

- `plugins`：babel 中使用的插件，这些插件可以控制如何转换代码
- `presets`：babel 可以使用哪些新的语法特性，一个 presets 对一组新语法的特性提供了支持，多个 presets 可以叠加。presets 其实是一组 plugins 的集合，每个 plugin 完成一个新语法的转换工作。presets 是按照 ECMAScript 草案来组织的，通常可以分为三大类：

**年度标准**

- ES2015 - 包含 2015 年加入的新特性
- ES2016 - 包含 2016 年加入的新特性
- ES2017 - 包含 2017 年加入的新特性
- env - 包含当前所有 ECMAScript 标准的新特性

**被社区提出未写入标准**

- stage0 一些 Babel 插件实现了对这些特性的支持，但是不确定是否会被定为标准
- stage1 值得被纳入标准的特性
- stage2 已被起草，将被纳入标准里
- stage3 已定稿，各大浏览器厂商和 NodeJS 社区开始着手实现
- stage4 在接下来一年会纳入标准

**支持特定场景的语法特征**

- babel-plugin-react 支持 React 开发里的 JSX 语法
- babel-plugin-import

下面列举几个关键的 Babel 依赖包：

- [@babel/preset-env](https://www.npmjs.com/package/@babel/preset-env)：允许您为旧版浏览器支持某些语言特性。为此，您应该启用其 `useBuiltIns` 选项（设置 `"useBuiltIns": true` 或 `"useBuiltIns": "usage"`）并安装 `@babel/polyfill`。您必须通过 import 或 entry（`app: ["@babel/polyfill", PATHS.app]`）将其包含在项目中。`@babel/preset-env` 根据您选定的浏览器重写导入，并仅加载所需要的 `polyfill`。
- [@babel/polyfill](https://www.npmjs.com/package/@babel/polyfill)：会在全局范围内提供了像 Promise、Set 这样的对象，这会污染全局作用域，对于一些库的开发者来说这可能会造成影响，这时候可以使用 `@babel/plugin-transform-runtime 。它可以作为 Babel 插件启用，避免了全局变量污染的问题。
- [babel-plugin-import](https://www.npmjs.com/package/babel-plugin-import)：重写模块导入，以便您可以使用这样的形式（`import { Button } from 'antd'`）来导入模块，而不必指出精准的路径
- [babel-plugin-import-asserts](https://www.npmjs.com/package/babel-plugin-import-asserts)：用来断言导入的定义。
- [babel-plugin-jsdoc-to-assert](https://www.npmjs.com/package/babel-plugin-jsdoc-to-assert)：将 JSDoc 注释转换为可运行的断言。
- [babel-plugin-log-deprecated](https://www.npmjs.com/package/babel-plugin-log-deprecated)：如果函数注释中包含 @deprecate，就在函数中注入 console.warn。
- [babel-plugin-annotate-console-log](https://www.npmjs.com/package/babel-plugin-annotate-console-log)：在使用 `console.log` 时，该插件会将有关调用上下文的信息一起打印，因此更容易看到打印时的位置。
- [babel-plugin-sitrep](https://www.npmjs.com/package/babel-plugin-sitrep)：记录函数中的所有赋值操作并打印它们。
- [babel-plugin-webpack-loaders](https://www.npmjs.com/package/babel-plugin-webpack-loaders)：允许您通过 Babel 使用某些 Webpack loader。
- [babel-plugin-syntax-trailing-function-commas](https://www.npmjs.com/package/babel-plugin-syntax-trailing-function-commas)：为函数参数添加尾逗号语法支持。
- [babel-plugin-transform-react-remove-prop-types](https://www.npmjs.com/package/babel-plugin-transform-react-remove-prop-types)：允许您在生产环境中将 propType 相关的代码删除。

> 某些 Webpack 功能，例如 `代码拆分`，可以在 loader 运行之后，在 Webpack 启动代码部分写入 Promise，在执行应用程代码之前运行 Polyfill 垫片程序，从而解决这个问题。示例：`entry: { app: ["core-js/es/promise", PATHS.app] }`

> 可以通过 [babel-register]() 或 [babel-cli]() 将 Babel 与 Node 连接起来。如果您想在不使用 Webpack 的情况下通过 Babel 编译代码，这些包会很方便。

## 设置 TypeScript

Microsoft 的 TypeScript 是一种需要编译的语言，遵循与 Babel 类似的设置。与 JavaScript 不同的是，它具备强类型。这样，一个好的 IDE 可以更好的提示，提高编码体验。强类型对于开发来说是很有意义的，因为它比较清晰地约束了变量的类型。

与 Facebook 的类型检查器 Flow 相比，TypeScript 是一种更安全的选择。因为，它的预定义类型比较多，总体上的维护质量也更好。

您可以使用以下 loader 将 TypeScript 与 Webpack 一起使用：

- [ts-loader](https://www.npmjs.com/package/ts-loader)
- [awesome-typescript-loader](https://www.npmjs.com/package/awesome-typescript-loader)

> ESLint 有一个 [TypeScript 解析器](https://www.npmjs.com/package/typescript-eslint-parser)。你也可以通过 tslint 来 lint ts 代码。
