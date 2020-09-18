---
nav:
  title: 最佳实践
  order: 3
group:
  title: 实战应用
  order: 1
title: 加载样式
order: 2
---

# 加载样式

## 加载样式

要加载 CSS 您需要使用 [css-loader](https://www.npmjs.com/package/css-loader) 和 [style-loader](https://www.npmjs.com/package/style-loader)。 css-loader 遍历匹配文件中的 `@import` 和 `url()`，并将它们视为常规 ES2015 import。如果 `@import` 指向外部资源，则 css-loader 会跳过它，因为 Webpack 只处理内部资源。

其他 CSS 预处理器需要使用到的资源加载器：

- Less：[less-loader](https://www.npmjs.com/package/less-loader)
- Sass：[sass-loader](https://www.npmjs.com/package/sass-loader)、[node-sass](https://www.npmjs.com/package/node-sass)（需要更高性能可以看看 [fast-sass-loader](https://www.npmjs.com/package/fast-sass-loader)）

### PostCSS

PostCSS 允许您通过 JavaScript 插件对 CSS 执行转换，您甚至可以找到类似 Sass 功能的插件。PostCSS 相当于 CSS 的 Babel。[postcss-loader](https://www.npmjs.com/package/postcss-loader) 可以将它与 Webpack 搭配使用。

下面的例子说明了如何使用 PostCSS 自动设置浏览器厂商前缀。另外，这个配置还添加了 press——一个 PostCSS 插件——允许您在 CSS 中使用类似 Sass 的标签。您可以将此技术与其他 loader 混合使用，以启动自动添加前缀。

```js
module.exports = {
  module: {
    rules: [
      {
        "style-loader",
        "css-loader",
        {
          loader: "postcss-loader",
          options: {
            plugins: () => ([
              require("autoprefixer"),
              require("precss")
            ])
          }
        }
      }
    ],
  },
};
```

记住安装导入 [autoprefixer](https://www.npmjs.com/package/autoprefixer) 和 [precss](https://www.npmjs.com/package/precss)，这样它们才能正常工作。

> PostCSS 支持基于 `postcss.config.js` 的配置。它的内部基于 `cosmiconfig`，因此它也支持其他格式的配置。

### cssnext

[cssnext](http://cssnext.io/) 是一个 PostCSS 插件，用于体验一些未来的 CSS 特性。您可以通过 [postcss-cssnext]() 使用它。

请参考以下配置：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: {
          loader: 'postcss-loader',
          options: {
            plugins: () => [require('postcss-cssnext')()],
          },
        },
      },
    ],
  },
};
```

有关可用选项，请参阅 [官方使用说明](http://cssnext.io/usage/)

## 理解文件查找

为了充分使用 `css-loader`，您应该理解它如何执行查找。`css-loader` 默认处理 **相对导入**，它不会触及绝对导入（例如：`url("/static/img/demo.png")`）。如果您依赖此类导入，则必须将文件复制到项目中。

[copy-webpack-plugin]() 可以将文件复制到 Webpack 中，但您也可以将文件复制到 Webpack 之外。前一种方法的好处是 webpack-dev-server 可以访问到它。

> 如果你使用 Sass 或 Less，[resolve-url-loader](https://www.npmjs.com/package/resolve-url-loader) 会派上用场，它支持了 CSS 内部资源的相对导入，避免资源定位失败的问题。

### 处理 css-loader 导入

如果要以特定方式处理 css-loader 导入，则应将 `importLoaders` 选项设置为一个数字，该数字告诉加载程序在对所找到的导入文件执行 css-loader 之前需要执行多少个 loader 。如果您通过 `@import` 语句从 CSS 导入其他 CSS 文件，并希望通过特定的 loader 处理导入，则此技术至关重要。

请考虑从 CSS 文件导入以下内容：

```css
@import './variables.sass';
```

要处理 Sass 文件，您必须编写配置：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
};
```

如果您向链中添加了更多 loader（例如 [postcss-loader]()），则必须相应地调整 `importLoaders` 选项。

### 从 node_modules 目录加载文件

您可以直接从 `node_modules` 目录加载文件。考虑 Bootstrap 及其用法，例如：

```css
@import '~bootstrap/less/bootstrap';
```

波形符 `~` 告诉 Webpack 它不是默认的相对导入。如果包含波浪号，则它会在 `node_module` 中执行查找（默认设置，可以通过 `resolve.modules` 字段进行配置）。

> 如果您正在使用 postcss-loader，则可以跳过 `~`，就像 [postcss-loader issue tracker](https://github.com/postcss/postcss-loader/issues/166) 讨论的内容一样。`postcss-loader` 可以在没有波形符号的情况下解析导入。

## 分离样式

现在我们有一个很好的打包了，但所有的 CSS 都去了哪里？根据配置，它已被内联到 JavaScript！虽然这在开发过程中很方便，但听起来并不理想。

当前的解决方案 CSS 是无法缓存的，并且还有一个未样式化元素闪动（FOUC）问题。发生 FOUC 是因为浏览器需要一段时间才能加载 JavaScript，并且到那时才会应用样式。将 CSS 分离到自己的文件可以让浏览器单独管理它，从而避免了这个问题。

Webpack 提供了一种使用 mini-css-extract-plugin（MCEP）生成单独的 CSS 包的方法。它可以将多个 CSS 文件聚合为一个。出于这个原因，它配备了一个 loader 来专门处理这个过程。然后，插件会获取 loader 抽取的结果并发出单独的文件。

由于这个过程会产生比较大的开销，所以，MiniCssExtractPlugin 只会作用于编译阶段，它不适用于热模块更换（HMR）。鉴于这个插件只是在生产环境中使用，所以也不是什么大的问题。

> 在生产环境中，使用内联样式可能有潜在危险，因为它向外提供了一个攻击途径。`关键路径渲染` 借鉴了这个思路，它将关键 CSS 内联到初始 HTML 中，从而提高了站点的感知性能。在有限的上下文中，内联少量的 CSS 可能是加速初始加载（更少的请求）的可行选择。

```js
// webpack.parts.js 这里是抽离单独的文件，最后通过 webpack-merge 合并
const MIniCssExtractPlugin = require('mini-css-extract-plugin');

exports.extractCSS = ({ include, exclude, use = [] }) => {
  // 将 CSS 抽出
  const plugin = new MiniCssExtractPlugin({
    filename: '[name].css',
  });

  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          include,
          exclude,
          use: [MiniCssExtractPlugin.loader].concat(use),
        },
      ],
    },
    plugins: [plugin],
  };
};
```

### 管理 JavaScript 之外的样式

尽管通过 JavaScript 引入样式，然后再打包是推荐的做法，但我们也可以在入口通过 `glob` 找到 CSS 文件来达到同样的目的：

```js
const globa = require('glob');

const commonConfig = merge([
  {
    entry: {
      style: glob.sync('./src/**/*/.css'),
    },
  },
]);
```

在进行此类更改后，您不必从应用程序代码中引用样式。这也意味着 CSS Modules 不再起作用，你也必须小心 CSS 规则的排序。

> [css-entry-webpack-plugin]() 可以帮助你实现严格控制外链 CSS 排序，这需要你单独设置 CSS 入口，然后使用 `@import` 语句将其余部分的样式导入到项目中。另一种做法就是设置 JavaScript 入口并通过 `import` 语句获得相同的效果。

## 去除未使用样式

[PurifyCSS](https://www.npmjs.com/package/purifycss) 可以通过分析文件达到去除未使用的样式的目的。它遍历您的代码并确定正在使用的 CSS 类，通常这就可以收集到足够的信息来从项目中删除未使用的 CSS。它也适用于单页应用程序。

[uncss](https://www.npmjs.com/package/uncss) 是 PurifyCSS 的一个很好的替代品。它通过 PhantomJS 运行，并以不同的方式执行其工作。

> 如果使用 CSS Modules，则需要小心。您必须按照 [purifycss-webpack README]() 文件中所讨论的那样将相关类 `列入白名单`。

### 关键渲染路径

关键路径渲染的概念从不同角度看待 CSS 性能。它不是优化大小，而是优化渲染顺序，并强调 `首屏` CSS。实现思路是通过渲染页面来确定展示结果时所需要的 CSS 规则。

[webpack-critical](https://www.npmjs.com/package/webpack-critical) 和 [html-critical-webpack-plugin](https://www.npmjs.com/package/html-critical-webpack-plugin) 将该技术作为 `HtmlWebpackPlugin` 插件的形式实现了出来。[isomorphic-style-loader](https://www.npmjs.com/package/isomorphic-style-loader) 使用 Webpack 和 React 实现了相同的功能。

Addy Osmani 的 [critical-path-css-tools](https://github.com/addyosmani/critical-path-css-tools) 列出了其他相关工具。

## 自动添加前缀

记住哪些浏览器厂商前缀必须用于特定的 CSS 规则以支持各种各样的用户，是很有挑战性的。自动添加前缀解决了这个问题。它可以通过 PostCSS 和 [autoprefixer](https://www.npmjs.com/package/autoprefixer) 插件启用。autoprefixer 使用 [Can I Use](https://caniuse.com/) 服务来确定哪些规则应该加前缀，并且可以进一步调整其行为。

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                // https://github.com/browserslist/browserslist#readme
                require('autoprefixer')({
                  browsers: ['last 2 version', '>1%', 'iOS 7'],
                }),
              ],
            },
          },
        ],
      },
    ],
  },
};
```
