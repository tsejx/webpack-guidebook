---
nav:
  title: 最佳实践
  order: 3
group:
  title: 构建优化
  order: 2
title: 缩小构建目标
order: 2
---

# 缩小构建目标

Webpack 启动后会从配置的 `entry` 出发，解析出文件中的导入语句，再递归的解析。 在遇到导入语句时 Webpack 会做两件事情：

1. 根据导入语句去寻找对应的要导入的文件。例如 `require('react')` 导入语句对应的文件是 `./node_modules/react/react.js`；`require('./util')` 对应的文件是 `./util.js`。
2. 根据找到的要导入文件的后缀，使用配置中的 `loader` 去处理文件。例如使用 ES6 开发的 JavaScript 文件需要使用 `babel-loader` 去处理。

以上两件事情虽然对于处理一个文件非常快，但是当项目大了以后文件量会变的非常多，这时候构建速度慢的问题就会暴露出来。 虽然以上两件事情无法避免，但需要尽量减少以上两件事情的发生，以提高速度。

## 减少文件搜索范围

- 优化 `resolve.modules` 配置：通过指定解析模块所在的目录，以减少模块搜索层级
- 优化 `resolve.extensions` 配置：自动解析确认的后缀扩展
- 合理使用 `alias`：当我们代码出现 `import` 时，Webpack 会采用向上递归搜索的方式去 `node_modules` 目录下找。为了减少搜索范围我们可以直接告诉 Webpack 去哪个路径下查找。
- `noParse`：当我们的代码使用到 `import jQuery from 'jquery'` 是，Webpack 会解析 React 这个库是否有依赖其他包。但是我们对类似 jQuery 这类依赖库，一般会认为不会引用其他的包。该属性告诉 Webpack 不用解析某些包。

```js
module.exports = {
  module: {
    noParse: /jQuery/,
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        include: [path.resolve(__dirname, 'src')],
        exclude: /node_modules/,
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: {
          loader: 'url-loader',
          include: [path.resolve(__dirname, 'src/assets/icons')],
          exclude: /node_modules/,
        },
      },
    ],
  },
  resolve: {
    // 创建 import 或 require 的别名，来确保模块引入变得更简单
    alias: {
      react: path.resolve(__dirname, './node_modules/react/dist/react.min.js'),
    },
    // 告诉 Webpack 解析模块时应该搜索的目录
    modules: [path.resolve(__dirname, 'node_modules')],
    // 自动解析确定的扩展
    extensions: ['.js'],
    // 当从 npm 包导入模块时，此选项将决定在 `package.json` 中使用哪个字段导入模块
    // 默认值为 browser -> module -> main
    mainFields: ['main'],
  },
};
```

## IgnorePlugin

Webpack 的内置插件，作用是忽略第三方包指定目录。

例如: `moment.js` (2.24.0 版本) 会将所有本地化内容和核心功能一起打包，我们就可以使用 `IgnorePlugin` 在打包时忽略本地化内容。

```js
//webpack.config.js
module.exports = {
  //...
  plugins: [
    //忽略 moment 下的 ./locale 目录
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
};
```

在使用的时候，如果我们需要指定语言，那么需要我们手动的去引入语言包，例如，引入中文语言包:

```js
import moment from 'moment';
// 手动引入
import 'moment/locale/zh-cn';
```

`index.js` 中只引入 `moment.js`，打包出来的 `bundle.js` 大小为 263KB，如果配置了 `IgnorePlugin`，单独引入 `moment/locale/zh-cn`，构建出来的包大小为 55KB。
