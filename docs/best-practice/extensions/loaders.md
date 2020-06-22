---
nav:
  title: 最佳实践
  order: 3
group:
  title: 扩展资料
  order: 3
title: 加载器合集
order: 2
---

# 加载器合集

Webpack 可以使用 loader 来预处理文件。这允许你打包除 JavaScript 之外的任何静态资源。你可以使用 Node.js 来很简单地编写自己的 loader。

loader 通过在 `require()` 语句中使用 `loadername!` 前缀来激活，或者通过 Webpack 配置中的正则表达式来自动应用。

## 文件

- [raw-loader](https://www.webpackjs.com/loaders/raw-loader/)：加载文件原始内容（utf-8）
- [val-loader](https://www.webpackjs.com/loaders/val-loader/)：将代码作为模块执行，并将 exports 转为 JS 代码
- [url-loader](https://www.webpackjs.com/loaders/url-loader/)：像 file loader 一样工作，但如果文件小于限制，可以返回 data URL
- [file-loader](https://www.webpackjs.com/loaders/file-loader/)：将文件发送到输出文件夹，并返回（相对）URL

## JSON

- [json-loader](https://www.webpackjs.com/loaders/json-loader/)：加载 JSON 文件（默认包含）
- [json5-loader](https://www.webpackjs.com/loaders/json5-loader/)：加载和转译 JSON 5 文件
- [cson-loader](https://www.webpackjs.com/loaders/cson-loader/)：加载和转译 CSON 文件

## 转换编译 Transpiling

- [script-loader](https://www.webpackjs.com/loaders/script-loader/)：在全局上下文中执行一次 JavaScript 文件（如在 script 标签），不需要解析
- [babel-loader](https://www.webpackjs.com/loaders/babel-loader/)：加载 ES2015+ 代码，然后使用 Babel 转译为 ES5
- [buble-loader](https://www.webpackjs.com/loaders/buble-loader/)：使用 Bublé 加载 ES2015+ 代码，并且将代码转译为 ES5
- [traceur-loader](https://www.webpackjs.com/loaders/traceur-loader/)：加载 ES2015+ 代码，然后使用 Traceur 转译为 ES5
- [ts-loader](https://www.webpackjs.com/loaders/ts-loader/) 或 [awesome-typescript-loader](https://www.webpackjs.com/loaders/awesome-typescript-loader/)：像 JavaScript 一样加载 TypeScript 2.0+
- [coffee-loader](https://www.webpackjs.com/loaders/coffee-loader/)：像 JavaScript 一样加载 CoffeeScript

## 模板 Templating

- [html-loader](https://www.webpackjs.com/loaders/html-loader/)：导出 HTML 为字符串，需要引用静态资源
- [pug-loader](https://www.webpackjs.com/loaders/pug-loader/)：加载 Pug 模板并返回一个函数
- [jade-loader](https://www.webpackjs.com/loaders/jade-loader/)：加载 Jade 模板并返回一个函数
- [markdown-loader](https://www.webpackjs.com/loaders/markdown-loader/)：将 Markdown 转译为 HTML
- [react-markdown-loader](https://www.webpackjs.com/loaders/react-markdown-loader/)：使用 markdown-parse parser(解析器) 将 Markdown 编译为 React 组件
- [posthtml-loader](https://www.webpackjs.com/loaders/posthtml-loader/)：使用 PostHTML 加载并转换 HTML 文件
- [handlebars-loader](https://www.webpackjs.com/loaders/handlebars-loader/)：将 Handlebars 转移为 HTML
- [markup-inline-loader](https://www.webpackjs.com/loaders/markup-inline-loader/)：将内联的 SVG/MathML 文件转换为 HTML。在应用于图标字体，或将 CSS 动画应用于 SVG 时非常有用。

## 样式

- [style-loader](https://www.webpackjs.com/loaders/style-loader/)：将模块的导出作为样式添加到 DOM 中
- [css-loader](https://www.webpackjs.com/loaders/css-loader/)：解析 CSS 文件后，使用 import 加载，并且返回 CSS 代码
- [less-loader](https://www.webpackjs.com/loaders/less-loader/)：加载和转译 LESS 文件
- [sass-loader](https://www.webpackjs.com/loaders/sass-loader/)：加载和转译 SASS/SCSS 文件
- [postcss-loader](https://www.webpackjs.com/loaders/postcss-loader/)：使用 PostCSS 加载和转译 CSS/SSS 文件
- [stylus-loader](https://www.webpackjs.com/loaders/stylus-loader/)：加载和转译 Stylus 文件

## 清理和测试 Linting && Testing

- [mocha-loader](https://www.webpackjs.com/loaders/mocha-loader/)：使用 mocha 测试（浏览器/NodeJS）
- [eslint-loader](https://www.webpackjs.com/loaders/eslint-loader/)：PreLoader，使用 ESLint 清理代码
- [jshint-loader](https://www.webpackjs.com/loaders/jshint-loader/)：PreLoader，使用 JSHint 清理代码
- [jscs-loader](https://www.webpackjs.com/loaders/jscs-loader/)：PreLoader，使用 JSCS 检查代码样式
- [coverjs-loader](https://www.webpackjs.com/loaders/coverjs-loader/)：PreLoader，使用 CoverJS 确定测试覆盖率

## 框架 Frameworks

- [vue-loader](https://www.webpackjs.com/loaders/vue-loader/)：加载和转译 Vue 组件
- [polymer-loader](https://www.webpackjs.com/loaders/polymer-loader/)：使用选择预处理器(preprocessor)处理，并且 require() 类似一等模块(first-class)的 Web 组件
- [angular2-template-loader](https://www.webpackjs.com/loaders/angular2-template-loader/)：加载和转译 Angular 组件
