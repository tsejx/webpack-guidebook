---
nav:
  title: 基本综述
  order: 1
group:
  title: 核心概念
  order: 2
title: plugins 插件
order: 8
---

# plugins 插件

[Plugins](https://webpack.js.org/configuration/plugins/)

用于扩展 Webpack 功能。

使用 Plugin 的难点在于掌握 Plugin 本身提供的配置项，而不是如何在 Webpack 中接入 Plugin。

## 内置插件

| 插件                            | 说明                                                                                              | 版本 |
| :------------------------------ | :------------------------------------------------------------------------------------------------ | :--- |
| `AutomaticPrefetchPlugin`       | 观察之前编译的 **所有模块** 的变化，以改进增量构建的时间                                          |      |
| `BannerPlugin`                  | 为每个 `chunk` 文件头部添加 `banner`                                                              |      |
| `CommonsChunkPlugin`            | 用于创建一个独立文件，这个文件包括多个入口 `chunk` 的公共模块                                     |      |
| `ContextExclusionPlugin`        | 用于排除与其正则匹配的所有上下文                                                                  | v5+  |
| `ContextReplacementPlugin`      | 用于覆盖推断的目录和正则表达式                                                                    |      |
| `DefinePlugin`                  | 用于在编译时用其他值或表达式替换代码中的变量                                                      |      |
| `DllPlugin`                     | 用于拆分 `bundles`，可以极大地提高构建时的性能                                                    |      |
| `EnvironmentPlugin`             | 用于在 `process.env` 键上使用 DefinePlugin 的简写                                                 |      |
| `EvalSourceMapDevToolPlugin`    | 支持对 SourceMap 生成更细粒度的控制（可通过 `devtool` 配置选项自动启用）                          |      |
| `HashedModuleIdsPlugin`         | 用于支持 `hash` 基于模块的相对路径，生成一个四个字符的字符串作为模块 `id`                         |      |
| `HotModuleReplacementPlugin`    | 启用热模块更换                                                                                    |      |
| `IgnorePlugin`                  | 用于忽略与正则表达式或筛选函数匹配的 `import` 或 `require` 调用模块                               |      |
| `LimitChunkCountPlugin`         | 用于编译后期合并体积过小的块，以减少 HTTP 开销                                                    |      |
| `MinChunkSizePlugin`            | 用于合并低于指定大小的块                                                                          |      |
| `ModuleConcatenationPlugin`     | 用于在 Webpack 中启用提升或将所有模块的作用域连接到一个闭包中                                     |      |
| `ModuleFederationPlugin`        | 允许在运行时提供或使用其他独立构件的模块                                                          |      |
| `NoEmitOnErrorsPlugin`          | 允许在出现任何异常时避免释放资产                                                                  |      |
| `NormalModuleReplacementPlugin` | 用于指定路径的资源替换正则匹配的资源                                                              |      |
| `PrefetchPlugin`                | 预加载模块，在首次 `import` 或 `require` 之前解析和构建（应先尝试分析构建以确认明确的预加载节点） |      |
| `ProfilingPlugin`               | 用于生成包含插件执行时间的 Chrome 配置文件                                                        |      |
| `ProgressPlugin`                | 提供一种自定义在编译期间如何报告进度的方式                                                        |      |
| `ProvidePlugin`                 | 自动加载模块，无需到处 `import` 或 `require`                                                      |      |
| `SourceMapDevToolPlugin`        | 用于更精细地控制 SourceMap 的生成                                                                 |      |
| `SplitChunksPlugin`             | 用于避免依赖图中父子重复依赖关系                                                                  | v4-  |
| `WatchIgnorePlugin`             | 在监视模式下，忽略指定的文件，即与提供的路径活正则表达式匹配的文件                                |      |
| 内部插件                        |                                                                                                   |      |

## 常用插件

### SplitChunksPlugin

最初，块（Chunks）及其内部导入模块是通过 Webpack 内部的依赖关系图的父子关系连接起来的，用于提取公共模块。从 Webpack v4+ 开始，[CommonsChunkPlugin](#commonschunkplugin) 已被删除，转而使用 `optimization.splitChunks`。

默认情况下 Webpack 会按照下列条件自动分割 Chunks：

- 可以共享新的 Chunk，或者模块来自 `node_modules` 文件夹
- 新的 Chunk 将大于 30kb（在 mini + gzip 之前）
- 当需要加载 Chunk 时，并行请求的最大数量将小雨或等于 30 个
- 初始页面加载时的最大并行请求数将低于或等于 30 次

配置示例：

```js
module.exports = {
  optimization: {
    splitChunks: {
      // 拆分出来块的名字（Chunk Names）默认由块名和 hash 值自动生成
      // name: <chunk name>,
      // 表示显示块的范围，三个可选值 all（全部块）、async（按需加载块）和initial（初始块）
      chunks: 'async',
      // 表示在压缩前的最小模块大小（默认为 0）
      minSize: 20000,
      minRemainingSize: 0,
      // 表示被引用次数（默认为 1）
      minChunks: 1,
      // 按需加载时的最大并行请求数（默认为 1）
      maxAsyncRequest: 30,
      // 最大的初始化加载次数（默认为 1）
      maxInitialRequests: 30,
      enforceSizwThreshold: 50000,
      // 缓存组
      cacheGroups: {
        defaultVendors: {
          // 缓存组的规则，表示符合条件的放入当前缓存组，值可是字符串、布尔值、函数或正则表达式（默认为空）
          test: /[\\/]node_modules[\\/]/,
          // 表示缓存的优先级
          priority: -10,
          // 表示可以使用已经存在的块，即如果满足条件的块已经存在就使用已有的，不再创建一个新的块
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};
```

注意：

- 当 Webpack 处理文件路径时，它们在 Unix 系统上始终包含 `/`，在 Windows 上始终包含 `\`。因此，必须在 `cacheGroup.test` 字段中使用 `[\\/]` 来表示路径分隔符。在跨平台使用时，`cacheGroups.test` 中的 `/` 或 `\` 将导致问题
- Webpack5 开始，不再允许将条目名称传递给 `cacheGroup.test` 并使用现有 Chunk 的名称作为 `cacheGroup.name`

### DefinePlugin

DefinePlugin 在 **编译** 时用其他值或表达式替换代码中的变量。这对于允许开发构建和生产构建之间的不同行为非常有用。如果在开发构建中执行日志记录，而不是在生产构建中执行日志记录，则可以使用全局常量来确定是否进行日志记录。这就是 DefinePlugin 的特性，为开发和生产构建设设置不同的规则。

传递到 DefinePlugin 中的每个键都是一个标识或多个相连的标识符。

- 如果值时一个字符串，它将被用作一个代码片段
- 如果值不是字符串，它将被字符串化（`JSON.stringify`）包括函数
- 如果值是一个对象，所有键的定义方式都是一样的
- 如果将 `typeof` 前缀作为键，则仅为 `typeof` 调用定义

配置示例：

```js
new webpack.DefinePlugin({
  PRODUCTION: JSON.stringify(true),
  VERSION: JSON.stringify('5fa3b9'),
  BROWSER_SUPPORTS_HTML5: true,
  TWO: '1+1',
  'typeof window': JSON.stringify('object'),
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  // 在生产/开发构建中使用不同的服务 URL
  SERVICE_URL: JSON.stringify('https://dev.example.com'),
});
```

代码示例：

```js
console.log('Running App version ' + VERSION);

if (!BROWSER_SUPPORTS_HTML5) require('html5shiv');
```

注意事项：

- 在为 `process` 定义值时，最好使用 `process.env.NODE_ENV: JSON.stringify('production')` 而非 `process: { env: { NODE_ENV: JSON.stringify('production') } }`，使用后者将覆盖 `process` 对象，这可能会破坏构建过程对象上定义其他值的某些模块的兼容性
- 请注意，由于该插件会直接替换文本，因此为其提供的值必须在字符串本身内部包含实际引号。通常，这可以通过使用引号（例如 `'"production"'` ）或使用 `JSON.stringify('production')` 来完成。

#### 运行时值

通过 `runtimeValue` 生成运行时值，可以定义一些依赖于文件的变量，当文件系统中的文件发生变化时，这些变量将被重新评估。这意味着当这些被监视的文件发生变化时，Webpack 将重建。

```js
const fileDep = path.resolve(__dirname, 'sample.txt');

new webpack.DefinePlugin({
  BUILT_AT: webpack.DefinePlugin.runtimeValue(Date.now, {
    fileDependencies: [fileDep],
  }),
});
```

`BUILT_AT` 的值将是文件系统中 `sample.txt` 最后更新时间，例如 `1597953013291`。

### DllPlugin

> DLL（Dynamic Link Library）全称是动态链接库，在 Windows 中，许多应用程序并不是一个完整的可执行文件，它们被分割成一些相对独立的动态链接库，即 DLL 文件，放置于系统中。当我们执行某一个程序时，相应的 DLL 文件就会被调用。

DllPlugin 和 DllReferencePlugin 主要功能是可以将可共享且不经常改变的代码，抽取成一个共享的库，避免进行二次构建，同时也对构建时间进行优化。

通常来说，我们的代码都可以至少简单区分成业务代码和第三方库。如果不做处理，每次构建时都需要把所有的代码重新构建一次，耗费大量的时间。然后大部分情况下，很多第三方库的代码并不会发生变更（除非是版本升级），这时就可以用到 dll：把复用性较高的第三方模块打包到动态链接库中，在不升级这些库的情况下，动态库不需要重新打包，每次构建只重新打包业务代码。

#### 使用 DllPlugin 打包需要分离到动态库的模块

配置示例：

```js
// webpack.dll.config.js
module.exports = {
  entry {
    // 第三方库
    react: ['react', 'react-dom', 'react-redux']
  },
  output: {
    // 输出的动态链接库的文件名称，[name] 代表当前动态链接库的名称
    filename: '[name].dll.js',
    path: resolve('dist/dll'),
    // library 必须和后面 DllPlugin 的 name 一致
    library: '[name]_dll_[hash]'
  },
  plugins: [
    // 接入 DllPlugin
    new webpack.DllPlugin({
      // 动态链接库的全局变量名称，需要和 output.library 中保持一致
      // 该字段的值也就是输出的 manifest.json 文件中 name 字段的值
      name: '[name]_dll_[hash]',
      // 描述动态链接库的 manifest.json 文件输出时的文件名称
      path: path.join(__dirname, 'dist/dll', '[name].manifest.json')
    })
  ]
};
```

#### 在主构建配置文件中使用动态库文件

在 `webpack.config.js` 中使用 dll 要用到 DllReferencePlugin，这个插件通过引用 dll 的 manifest 文件来把依赖的名称映射到模块的 `id` 上，之后再在需要的时候通过内置的 `webpack_require` 函数来 `require` 他们。

```js
new webpack.DllReferenncePlugin({
  context: __dirname,
  manifest: require('./dist/dll/react.manifest.json'),
});
```

第一步产出的 `manifest` 文件就用在这里，给主构建流程作为查找 dll 的依据：DllReferencePlugin 去 `manifest.json` 文件读取 `name` 字段的值，把值的内容作为在全局变量中获取动态链接库中内容时的全局变量名，因此：在 `webpack_dll.config.js` 文件中，DllPlugin 中的 `name` 参数必须和 `output.library` 中保持一致。

#### 在入口文件引入 dll 文件

生成的 dll 暴露出的是全局函数，因此还需要在入口文件中引入对应的 dll 文件。（也可以使用 AddAssetHtmlPlugin，将打包好的 DLL 库引入到 HTML 模版中）

```html
<body>
  <div id="app"></div>
  <script src="../../dist/dll/react.dll.js"></script>
</body>
```

作用：

- **分离代码**：业务代码和第三方模块可以被单独打包到不同的文件中
  - 避免打包出单个文件的大小太大，不利于调试
  - 将单个大文件拆分成多个小文件之后，一定情况下有利于加载（不超过浏览器一次性请求的文件数的情况下，并行下载肯定比串行快）
- **提升构建速度**：第三方库代码没有变更时，由于我们只构建业务相关代码，相比全部重新构建自然要快得多

参考资料：

- [Webpack 使用 - 详解 DllPlugin](https://segmentfault.com/a/1190000016567986)

### IgnorePlugin

IgnorePlugin 用于在 Webpack 构建过程中忽略第三方模块的指定目录，避免将指定目录被打包。

语法：

```js
new webpack.IgnorePlugin(requestRegExp, [contextRegExp]);
```

参数说明：

- `requestRegExp`：匹配（test）资源请求路径的正则表达式
- `contextRegExp`：（可选）匹配（test）资源上下文（目录）的正则表达式

配置示例：

```js
module.exports = {
  plugins: [new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)],
};
```

### HotModuleReplacementPlugin

HotModuleReplacementPlugin 用于热更新替换。

### WebpackBundleAnalyzer

WebpackBundleAnalyzer 用于构建结果分析。有利于我们快速查找包过大、内容是否重复、问题定位优化等。

- `analyzerHost` `analyzerPort`：自定义配置打开的地址、端口，默认使用 `127.0.0.1:8888`
- `reportFilename`：报告生成的路径，默认以项目的 `output.path` 输出
- `openAnalyzer`：是否要自动打开分析窗口

### 内部插件

> 只有在你基于 Webpack 构建自己的编译器时，你才应该关心它们

## 社区生态

- HtmlWebpackPlugin
- CompressionWebpackPlugin
- CopyWebpackPlugin
- CssMinimizerWebpackPlugin
- EslintWebpackPlugin
- HtmlMinimizerWebpckPlugin
- ImageMinimizerWebpackPlugin
- InstallWebpackPlugin
- JsonMinimizerWebpackPlugin
- MiniCssExtractPlugin
- StylelintWebpackPlugin
- TerserWebpackPlugin

### HtmlWebpackPlugin

[HtmlWebpackPlugin](https://github.com/jantimon/html-webpack-plugin) 用于插入引用，根据模版生成 HTML。

配置示例：

```js
new HtmlWebPackPlugin({
  // 表示输出的文件名
  filename: path.resolve(__dirname, '../assets/index.html'),
  // 模版文件
  template: path.resolve(__dirname, '../views/temp.html'),
  // 压缩 HTML 文件
  minify: {
    // 移除 HTML 中的注释
    removeComments: true,
    // 删除空白符与换行符
    collapseWhitespace: true,
  },
  // 插入到 HTML 的 CSS 和 JS 文件要内联，即不是以 <link>、<script> 形式引入
  inlineSource: '.(js|css)',
  // 是否能注入内容到输出的页面
  inject: false,
  // 指定插入某些模块
  chunks: ['vendors', 'index'],
  // 每次会在插入的文件后面加上 hash 值，用于处理缓存
  hash: true,
  // favicon、meta、title等都可以配置，页面内使用「<%= htmlWebpackPlugin.options.title %>」即可
});
```

### PreloadWebpackPlugin

[PreloadWebpackPlugin](https://github.com/vuejs/preload-webpack-plugin) 用于预加载资源。匹配其他页面可能用到的资源进行预先加载。该插件要求必须使用 Webpack 2.2+ 且必须使用 [HtmlWebpackPlugin](https://github.com/jantimon/html-webpack-plugin)。

```js
const HtmlWebpackPlugin = require('html-webpack-lugin');
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');

module.exports = {
  plugins: [
    // 必须在 PreloadWebpackPlugin 前实例化 HtmlWebpackPlugin
    new HtmlWebpackPlugin(),
    new PreloadWebpackPlugin({
      rel: 'preload',
      as(entry) {
        if (/\.css$/.test(entry)) return 'style';
        if (/\.woff$/.test(entry)) return 'font';
        if (/\.png$/.test(entry)) return 'image';
        return 'script';
      },
    }),
  ],
};
```

<br />

```js
module.exports = {
  plugins: [
    new HtmlWebpackPlugin(),
    new PreloadWebpackPlugin({
      rel: 'prefetch',
      as: 'script',
      include: 'asyncChunks',
      fileBlackList: [/\index.css|index.js|vendors.js]/, /\.whatever/],
    });
  ]
}
```

### HtmlMinimizerWebpackPlugin

[HtmlMinimizerWebpackPlugin](https://webpack.js.org/plugins/html-minimizer-webpack-plugin/) 用于 `optimization.minimizer` 优化压缩 HTML 文件。

配置示例：

```js
const HtmlMinimizerPlugin = require('html-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.html$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          context: path.resolve(__dirname, 'dist'),
          from: './src/*.html',
        },
      ],
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      // `...`
      new HtmlMinimizerPlugin(),
    ],
  },
};
```

说明：

- 允许自定义压缩代码
- 允许开启多线程提升构建速度（`parallel = true` 默认开启）
- 压缩选项参考 [html-minifier-terser](https://github.com/terser/html-minifier-terser) 提供的选项
- 压缩选项包含去除注释、空标签属性、指定标签元等等

### CssMinimizerWebpackPlugin

CssMinimizerWebpackPlugin 使用 [cssnano](https://cssnano.co/) 优化和压缩 CSS 文件。就像 [optimize-css-assets-webpack-plugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin) 一样，但能够使用查询字符串更准确地索引地图和资产，允许缓存和并行模式工作。

配置示例：

```js
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } },
        ],
      },
    ],
  },
  optimization: {
    minimizer: [new CssMinimizerPlugin()],
  },
  plugins: [new MiniCssExtractPlugin()],
};
```

### MiniCssExtractPlugin

**用于提取 CSS**

- `extract-text-webpack-plugin` 根据创建实例或配置多个入口 chunk

比如一个入口文件 => 所有 CSS 提取在一个样式文件里

- `min-css-extract-plugin` 默认对样式进行模块拆分。

```js
// extract-text-webpack-plugin
config.module.rules.push({
  test: /\.(scs|sas|cs)s$/,
  use: ExtractTextPlugin.extrac({
    use: [
      'css-loader',
      {
        loader: 'postcss-loader',
        options: {
          plugins: [
            require('autoprefixer')({
              // 添加前缀
              browsers: CSS_BROWSERS,
            }),
          ],
          minimize: true,
        },
      },
      'sass-loader',
    ],
  }),
});
config.plugins.push(
  new ExtractTextPlugin({
    filename: 'css/[name].css',
    disable: false,
    allChunks: true,
  })
);
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

### ImageMinimizerWebpackPlugin

[ImageMinimizerWebpackPlugin](https://webpack.js.org/plugins/image-minimizer-webpack-plugin/)

该插件提供两种工具压缩图片：

- [imagemin](https://github.com/imagemin/imagemin)：默认的优化图片方式，因为它是稳定的，适用于所有类型的图像
- [squoosh](https://github.com/GoogleChromeLabs/squoosh/tree/dev/libsquoosh)：在实验模式下使用 `.jpg`、`.jpeg`、`.png`、`.webp` 和 `.avif` 文件类型时

该插件提供两种运行模式：

- [Lossless](https://en.wikipedia.org/wiki/Lossless_compression)：无损画像质量
- [Lossy](https://en.wikipedia.org/wiki/Lossy_compression)：画像质量下降

#### 使用 imagemin 优化

需要先安装模式所对应的模块：

```bash
# lossless
npm install imagemin-gifsicle imagemin-jpegtran imagemin-optipg imagemin-svgo --save-dev

# lossy
npm install imagemin-gifsicle imagemin-mozjpeg imagemin-pngquant imagemin-svgo --save-dev
```

配置示例：

```js
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const { extendDefaultPlugins } = require('svgo');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: 'asset',
      },
    ],
  },
  plugins: [
    new ImageMinimizerPlugin({
      minimizerOptions: {
        // Lossless optimization with custom option
        // Feel free to experiment with options for better result for you
        plugins: [
          ['gifsicle', { interlaced: true }],
          ['jpegtran', { progressive: true }],
          ['optipng', { optimizationLevel: 5 }],
          // Svgo configuration here https://github.com/svg/svgo#configuration
          [
            'svgo',
            {
              plugins: extendDefaultPlugins([
                {
                  name: 'removeViewBox',
                  active: false,
                },
                {
                  name: 'addAttributesToSVGElement',
                  params: {
                    attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
                  },
                },
              ]),
            },
          ],
        ],
      },
    }),
  ],
};
```

#### 使用 squoosh 优化

同样需要先安装扩展模块：

```bash
npm install @squoosh/lib --save-dev
```

配置示例：

```js
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(jpe?g|png)$/i,
        type: 'asset',
      },
    ],
  },
  plugins: [
    new ImageMinimizerPlugin({
      minify: ImageMinimizerPlugin.squooshMinify,
      minimizerOptions: {
        encodeOptions: {
          mozjpeg: {
            // That setting might be close to lossless, but it’s not guaranteed
            // https://github.com/GoogleChromeLabs/squoosh/issues/85
            quality: 100,
          },
          webp: {
            lossless: 1,
          },
          avif: {
            // https://github.com/GoogleChromeLabs/squoosh/blob/dev/codecs/avif/enc/README.md
            cqLevel: 0,
          },
        },
      },
    }),
  ],
};
```

### TerserWebpackPlugin

[TerserWebpackPlugin](https://webpack.js.org/plugins/terser-webpack-plugin/) 用于优化和压缩 JavaScript 文件。默认使用 [terser](https://github.com/terser/terser) 模块包进行压缩。

配置示例：

```js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        // 并行
        parallel: true,
        terserOptions: {
          compress: {
            ecma: undefined,
            parse: {},
            compress: {},
            mangle: true,
            module: false,
            // 丢掉 console，减少内存泄漏
            drop_console: false,
          },
        },
        // 压缩注释（或使用正则匹配或函数判断）
        extractComments: 'all',
      }),
    ],
  },
};
```

<br />

```js
// 保留注释
module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: /@license/i,
          },
        },
        extractComments: true,
      }),
    ],
  },
};
```

<br />

```js
// 移除注释
module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
};
```

<br />

```js
// 混淆压缩
module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        minify: TerserPlugin.uglifyJsMinify,
        // `terserOptions` options will be passed to `uglify-js`
        // Link to options - https://github.com/mishoo/UglifyJS#minify-options
        terserOptions: {},
      }),
    ],
  },
};
```

<br />

```js
// esbuild
module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        minify: TerserPlugin.esbuildMinify,
        // `terserOptions` options will be passed to `esbuild`
        // Link to options - https://esbuild.github.io/api/#minify
        // Note: the `minify` options is true by default (and override other `minify*` options), so if you want to disable the `minifyIdentifiers` option (or other `minify*` options) please use:
        // terserOptions: {
        //   minify: false,
        //   minifyWhitespace: true,
        //   minifyIdentifiers: false,
        //   minifySyntax: true,
        // },
        terserOptions: {},
      }),
    ],
  },
};
```

### CompressionWebpackPlugin

[CompressionWebpackPlugin](https://webpack.js.org/plugins/compression-webpack-plugin/) 用于通过命令行 `gz` 压缩静态资源包大小，提升前端加载性能与速度。该插件需要在服务端代理服务器（如 Nginx）支持 `gzip` 压缩配置。

配置示例：

```js
const zlib = require('zlib');

module.exports = {
  plugins: [
    new CompressionPlugin({
      // 生成文件名
      filename: '[path][base].gz',
      // 压缩算法
      algorithm: 'gzip',
      // 需要压缩的文件（正则匹配）
      test: /\.js$|\.css$|\.html$/,
      // 需要压缩资源的最低大小（单位：字节）
      threshold: 10240,
      // 仅处理压缩效果优于此比率的资产
      minRatio: 0.8,
    }),
    new CompressionPlugin({
      filename: '[path][base].br',
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg)$/,
      compressionOptions: {
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
        },
      },
      threshold: 10240,
      minRatio: 0.8,
    }),
  ],
};
```

注意：

- 某些资源构建后由于体积过小，不会进行压缩操作，可以通过调整 `threashold` 控制

### CopyWebpackPlugin

CopyWebpackPlugin 用于拷贝文件。

配置示例：

```js
module.exports = {
  plugins: [
    new CopyPlugin({
      patterns: [
        'relative/path/to/file.ext',
        'relative/path/to/dir',
        path.resolve(__dirname, 'src', 'file.ext'),
        path.resolve(__dirname, 'src', 'dir'),
        '**/*',
        {
          from: '**/*',
        },
        // If absolute path is a `glob` we replace backslashes with forward slashes, because only forward slashes can be used in the `glob`
        path.posix.join(path.resolve(__dirname, 'src').replace(/\\/g, '/'), '*.txt'),
      ],
    }),
  ],
};
```

## 废弃插件

### CommonsChunkPlugin

[CommonsChunkPlugin](https://v4.webpack.js.org/plugins/commons-chunk-plugin/) 用于创建一个单独的文件中（被称为块 Chunk），由多个入口点之间共享的公共模块。Webpack 5+ 后由 [TerserWebpackPlugin](#terserwebpackplugin) 实现该部分功能。

通过将通用模块与捆绑包分离，所产生的分块文件可以在最初加载一次，并存储在缓存中供以后使用。这就导致了页面速度的优化，因为浏览器可以快速地从缓存中提供共享代码，而不是每当访问一个新页面时就被迫加载一个更大的捆绑包。

### UglifyjsWebpackPlugin

[UglifyjsWebpackPlugin](https://v4.webpack.js.org/plugins/uglifyjs-webpack-plugin/) 用于代码混淆和压缩。 在 Webpack v4.26.0+ 后，`uglify-es` 已不再维护，由 [TerserWebpackPlugin](#terserwebpackplugin) fork 并维护。

配置示例：

```js
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [new UglifyJsPlugin()],
  },
};
```
