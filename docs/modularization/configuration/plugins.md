---
title: plugins 插件
order: 6
group:
  title: 配置
  order: 2
nav:
  title: 配置
  order: 2
---

# plugins 插件

[中文文档](https://webpack.docschina.org/configuration/plugins/)

用于扩展 Webpack 功能。

使用 Plugin 的难点在于掌握 Plugin 本身提供的配置项，而不是如何在 Webpack 中接入 Plugin。

## MiniCssExtractPlugin

**用于提取 CSS**

* `extract-text-webpack-plugin` 根据创建实例或配置多个入口 chunk

比如一个入口文件 => 所有 CSS 提取在一个样式文件里

* `min-css-extract-plugin` 默认对样式进行模块拆分。

```js
// extract-text-webpack-plugin
config.module.rules.push({
    test: /\.(scs|sas|cs)s$/,
    use: ExtractTextPlugin.extrac({
        use: [
            "css-loader",
            {
                loader: "postcss-loader",
                options: {
                    plugins: [
                        require('autoprefixer')({ // 添加前缀
                            browsers: CSS_BROWSERS
                        })
                    ],
                    minimize: true
                }
            },
            "sass-loader"
        ]
    })
})
config.plugins.push(new ExtractTextPlugin({
    filename: 'css/[name].css',
    disable: false,
    allChunks: true
}))
```

`postcss-loader` 用于与已有工具集成一起使用，很少有单独使用。

通常会配合 `autoprefixer` 来添加个浏览器的前缀，以达到更好的兼容。

在深入就是 `cssnext` 允许开发者自定义属性和变量。

```js
// mini-css-extract-plugin
config.module.rules.push({
    test: /\.(scs|cs)s$/,
    use: [
        {
            loader: MiniExtractPlugin.loader
        },
        "css-loader",
        {
            loader: 'postcss-loader',
            options: {
                plugins: [
                    require('autofixer')({
                        browsers: CSS_BROWSERS
                    })
                ]
            }
        }，
        "sass-loader"
    ]
})
```

## OptimizeCssAssetsWebpackPlugin

**用于压缩 CSS 文件。**

```js
new OptimizeCssAssetsPlugin({
    assetNameRegExp: /\.optimize\.css$/g,
    cssProcessor: require('cssnano'),
    cssProcessorpluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
        // autoprefixer: { browsers: CSS_BROWSERS } 也可指定前缀
    }
})
```

## SplitChunksPlugin / RuntimeChunkPlugin

`CommonsChunkPlugin` 替代品，用于提取公共模块。

* `chunks`：表示显示块的范围，三个可选值 `all`（全部块） `async`（按需加载块） `initial`（初始块）
* `minSize`：表示在压缩前的最小模块大小（默认为 0）
* `maxSize`：表示在压缩前的最大模块大小
* `minChunks` ：表示被引用次数（默认为 1）
* `maxAsyncRequests`：表示最大的按需（异步）加载次数（默认为 1）
* `maxInitialRequests`：最大的初始化加载次数（默认为 1）
* `name`：拆分出来块的名字（Chunk Names）默认由块名和 hash 值自动生成
* `cacheGroups`：缓存组

如果不在缓存组中重新赋值，缓存组默认继承上述选项，但还有一些参数必须在缓存组进行配置。

* `priority`：表示缓存的优先级
* `test`：缓存组的规则，表示符合条件的放入当前缓存组，值可是 `function` `boolean` `string` `RegExp` 默认为空
* `reuseExistingChunk`：表示可以使用已经存在的块，即如果满足条件的块已经存在就使用已有的，不再创建一个新的块

## HotModuleReplacementPlugin

**热更新替换。**

## HtmlWebpackPlugin

**插入引用，根据模版生成 HTML。**

* `filename`：表示输出的文件名
* `template`：模版文件
* `removeComments`：移除 HTML 中的注释
* `collapseWhitespace`：删除空白符与换行符
* `inlineSource`：插入到 HTML 的 CSS、JS 文件要内联，即不是以 link、script 形式引入
* `inject`：是否能注入内容到输出的页面
* `chunks`：指定插入某些模块
* `hash`：每次会在插入的文件后面加上 hash，用于处理缓存
* 其他：`favicon`、`meta`、`title`

```js
new HtmlWebPackPlugin({
  filename: path.resolve(__dirname, '../assets/index.html'),
  template: path.resolve(__dirname,"../views/temp.html"),
  minify:{ // 压缩HTML文件　
     removeComments:true,
     collapseWhitespace:true
  },
  inlineSource:  '.(js|css)',
  inject: false,
  chunks: ['vendors', 'index'],
  hash:true,
  // favicon、meta、title等都可以配置，页面内使用「<%= htmlWebpackPlugin.options.title %>」即可
})
```

## UglifyjsWebpackPlugin

**用于代码压缩。** 默认使用 `optimization.minimizer`

* `cache`：Boolean / String 字符即缓存文件存放的路径
* `test`：匹配某些文件
* `parallel`：启用多线程并行提高编译速度
* `output.comments`：删除所有注释
* `compress.warnings`：插件删除无用代码不报错
* `compress.drop_console`：过滤 `console` 代码
* 其他：定义压缩程度、提出多次出现但没有变量的值的配置

## PreloadWebpackPlugin

**用于预加载资源。** 匹配其他页面可能用到的资源进行预先加载，从而达到无 loading，用户无感知的跳转。

```js
// 1. 配置置于 HtmlWebpackPlugin 之后
// 2. Webpack4之后，请使用最新版 npm install --save-dev preload-webpack-plugin@next
new PreloadWebpackPlugin({
    rel: 'prefetch',
    as: 'script',
    // as(entry){
	//   if(/\.css$/.test(entry)) return 'style';
    //   return 'script'
	// }
    include: 'asyncChunks',
    // fileBlacklist: ["index.css"]
    fileBlackList: [/\index.css|index.js|vendors.js]/,/\.whatever/]
})
```

## WebpackBundleAnalyzer

**构建结果分析。** 有利于我们快速查找包过大、内容是否重复、问题定位优化等。

* `analyzerHost` `analyzerPort`：自定义配置打开的地址、端口，默认使用 127.0.0.1:8888
* `reportFilename`：报告生成的路径，默认以项目的 `output.path` 输出
* `openAnalyzer`：是否要自动打开分析窗口

## CopyWebpackPlugin

**文件拷贝**



