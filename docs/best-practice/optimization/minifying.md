---
nav:
  title: 最佳实践
  order: 3
group:
  title: 构建优化
  order: 2
title: 压缩代码
order: 13
---

# 压缩代码

从 Webpack 4 开始，默认情况下使用 [terser](https://www.npmjs.com/package/terser) 压缩生产环境下的输出结果。Terser 是一款兼容 ES2015 + 的 JavaScript 压缩器。与 UglifyJS（许多项目的早期标准）相比，它是面向未来的选择。有一个 UglifyJS 的分支—— uglify-es，但由于它不再维护，于是就从这个分支诞生出了一个独立分支，它就是 terser。

尽管 webpack 4 默认情况下会压缩输出，但如果您想进一步调整压缩行为或更换压缩器，那么，最好了解如何自定义压缩。

## 脚本压缩

所谓 <strong style="color: red">压缩</strong> 就是将代码变的更小，安全 <strong style="color: red">转换</strong> 是指通过重写代码而不改变代码逻辑。这方面的好例子包括 **重命名变量**，甚至是**删除整个的访问不到的代码块**（`if (false)`）。

不安全的转换可能会破坏代码，因为它们可能会丢失底层代码所依赖的隐含内容。例如，Angular 1 在使用模块时需要特定的函数参数命名。除非在这种情况下采取预防措施，否则重写参数会破坏代码。

### 压缩处理器

在 Webpack 4 中，通过两个配置字段控制压缩过程：`optimization.minimize` 字段切换压缩处理器，而 `optimization.minimizer` 数组用来配置压缩处理器。

为了调整默认值，我们使用 `terser-webpack-plugin` 插件进行压缩

```js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  plugins: [new TerserPlugin()],
};
```

**其他压缩 JavaScript 的方法**

虽然默认值和 `terser-webpack-plugin` 适用于此用例，但您可以考虑更多选项：

- [babel-minify-webpack-plugin](https://www.npmjs.com/package/babel-minify-webpack-plugin)：依赖于 [babel-preset-minify](https://www.npmjs.com/package/babel-preset-minify)，它由 Babel 团队开发。
- [webpack-closure-compiler](https://www.npmjs.com/package/webpack-closure-compiler)：可以并行执行，有时比 babel-minify-webpack-plugin 的结果更小。[closure-webpack-plugin](https://www.npmjs.com/package/closure-webpack-plugin) 是另一种选择。
- [butternut-webpack-plugin](https://www.npmjs.com/package/butternut-webpack-plugin)：在底层使用了 Rich Harris 的实验性 butternut 压缩器。

## 文档压缩

如果您使用 [html-loader](https://www.npmjs.com/package/html-loader) 处理 HTML 模板，则可以使用 [posthtml](https://www.npmjs.com/package/posthtml) 对模板进行预处理。您还可以使用 [posthtml-minifier](https://www.npmjs.com/package/posthtml-minifier) 压缩 HTML。

## 样式文件压缩

Webpack 4.0 以后，官方推荐使用 `mini-css-extract-plugin` 插件来打包 CSS 文件。

```js
// webpack.base.js 模式 devlopment 和 production 通用
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(le|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // 这里可以指定一个 publicPath
              // 默认使用 webpackOptions.output 的 publicPath
              // publicPath 的设置，和 plugins 设置的 filename 和 chunkFilename 的名字有关
              // 如果打包后，background 等属性中的图片显示不出来，请检查 publicPath 的配置是否有误
              publicPath: './',
            },
          },
          'css-loader',
          'less-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      // 这里的配置和 webpackOptions.output 中的配置相似
      // 即可以通过在名字前加路径，来决定打包后的文件存在的路径
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css',
    }),
  ],
};
```

生产环境可以将 CSS 代码块提取到单独的文件中：

```js
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [new OptimizeCssAssetsPlugin({})],
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
};
```

除此之外，可以考虑：

- [clean-css-loader](https://www.npmjs.com/package/clean-css-loader)：使您可以使用流行的 CSS 压缩器 [clean-css](https://www.npmjs.com/package/clean-css)
- [optimize-css-assets-webpack-plugin](https://www.npmjs.com/package/optimize-css-assets-webpack-plugin)：基于选项的插件，可以在 CSS 资源上应用选定的压缩器。使用 `MiniCssExtractPlugin` 可能导致重复的 CSS，因为它只合并文本块。`OptimizeCssAssetsPlugin` 通过对生成的结果进行操作来避免这个问题，从而可以产生更好的结果。

## 图片压缩

基于 Node 库 imagemin 或者 tinypng API

- img-loader
- imagemin-webpack
- imagemin-webpack-loader
- imagemin-webpack-plugin

```js
return {
  test: /\.(png|svg|jpg|gif|blob)$/,
  use: [
    {
      mozjpeg: {
        progressive: true,
        quality: 65,
      },
      optipng: {
        enabled: false,
      },
      pngquant: {
        quality: '65-90',
        speed: 4,
      },
      gifsicle: {
        interlaced: false,
      },
      webp: {
        quality: 75,
      },
    },
  ],
};
```

Imagemin 的优点分析：

- 有很多定制选项
- 可以引入更多第三方优化插件，例如 `pngquant`
- 可以处理多种图片格式

### 图片压缩原理

- pngquant：是一款 PNG 压缩器，通过将图像转换为具有 alpha 通道（通常比 24/32 位 PNG 文件小 60-80%）的更高效的 8 位 PNG 格式，可显著减小文件大小。
- pngcrush：其主要目的是通过尝试不同的压缩级别和 PNG 过滤方法来降低 PNG IDAT 数据流的大小。
- optipng：其设计灵感来自于 pngcrush。optpng 可将图像文件重新压缩位最小尺寸，而不会丢失任何信息。
- tinypng：也是将 24 位 png 文件转化位更小有索引的 8 位图片，同时所有非必要的 metadata 也会被剥离掉。
