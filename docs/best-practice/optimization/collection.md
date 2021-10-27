---
nav:
  title: 最佳实践
  order: 3
group:
  title: 构建优化
  order: 2
title: 构建优化总结
order: 100
---

# 构建优化总结

**打包速度优化**

- 文件多？业务复杂 语法分析多
- 依赖多？提取公共代码
- 页面多？操作耗时的编译方式

## 优化构建速度

Webpack 在启动后会根据 `entry` 配置的入口出发，递归地解析所依赖的文件。这个过程分为 <strong style="color:red">搜索文件</strong> 和 <strong style="color:red">把匹配的文件进行分析、转化</strong> 的两个过程，因此可以从这两个角度来进行优化配置。

### 缩小文件的搜索范围

Webpack 在启动后从配置 `entry` 出发，解析文中导入语句，再递归解析，在遇到导入语句时：

- 根据导入语句去寻找对应的要导入的文件
- 根据找到的要导入的文件的后缀，使用配置中的 Loader 去处理文件。例如使用 ES6 开发的 JavaScript 文件需要使用 babel-loader 处理 。

#### resolve

##### resolve.modules

设置 `resolve.modules` 指定第三方模块存放的绝对路径，避免层层查找，减少搜索步骤。

该配置默认值为 `['node_modules']`，会依次查找 `./node_modules`、`../node_modules`、`../../node_modules`。

```js
module.exports = {
  //...
  resolve: {
    modules: [path.resolve(__dirname, 'node_modules')],
  },
};
```

##### resolve.mainFields

设置 `resolve.mainFileds: ['main']` 设置尽量少的值可以减少入口文件的搜索步骤。

例如：isomorphic-fetch

由于不同运行环境 fetch API 实现机制不一致。

```json
{
  "browser": "fetch-npm-browserify.js",
  "main": "fetch-npm-node.js"
}
```

`mainFields` 决定导入第三方模块在 `package.json` 中是用哪个字段导入模块。根据 Webpack 配置中指定的 `target` 运行环境的不同，默认值也会有所不同。

因此，可以设置单独 `main` 值能更准确命中包入口字段。

- target 为 web 或 webworker 时，值是 `['browser', 'module', 'main']`
- target 为 其他情况时，值是 `['module', 'main']`

##### resolve.alias

设置 `resolve.alias` 能让 Webpack 直接使用第三方模块的压缩版本，不再对库进行解析，还可以使用别名方便引用文件。

```js
module.exports = {
  //...
  resolve: {
    alias: {
      Components: path.resolve(__dirname, 'src/components/'),
      Utils: path.resolve(__dirname, 'src/utils/'),
      react: path.resolve(__dirname, './node_modules/react/dist/react.min.js'),
    },
  },
};
```

例如这样就可以直接使用 React 的压缩版本，每次构建时不必再次解析。还可以通过别名引用文件，而不必再打复杂的引用路径。

```js
import ReactComponent from 'Components/ReactComponent';
```

**应用于 React**

发布出去的 React 库中包含两套代码。

- 一套采用 CommonJS 规范的模块化代码，这些文件都放在 lib 目录下，以 package.json 中指定的入口文件 react.js 为模块入口
- 一套是将 React 的相关代码打包好的完整代码放到一个单独的文件中，这些代码没有采用模块化，可以直接执行。其中 dist/react.js 用于开发环境，里面包含检查和警告代码。dist/react.min.js 用于线上环境，被最小化了。

```js
// webpack.config.js
module.export = {
  resolve: {
    // 使用 alias 将导入 react 的语句换成直接使用单独、完整的 react.min.js 文件
    // 减少耗时的递归解析操作
    alias: {
      react: path.resolve(__dirname, './node_modules/react/dist/react.min.js'),
    },
  },
};
```

但这样设置的缺点是会无法使用 Tree-Shaking 优化输出的打包文件，所以一般对 React 这种整体性比较强的使用比较好，而像 lodash 这样的工具库还是建议使用 Tree-Shaking 去除多余代码。

##### resolve.extensions

`resolve.extensions` 用于确定需要 Webpack 解析的文件类型，指定文件扩展名能加快寻找速度。而当导入语句没带文件后缀时，Webpack 会根据 extensions 定义的扩展名列表进行文件查找。

```js
module.exports = {
  // 默认
  resolve: {
    extensions: ['.wasm', '.mjs', '.js', '.json'],
  },
  // 改进
  resolve: {
    extensions: ['.js', '.json', 'jsx'],
  },
};
```

同时，也能够在引入模块时不带扩展。

```js
import File from '../path/file';
```

**总结**

- 列表值尽量少
- 频率高的文件扩展名写在前面
- 源码中的导入语句尽可能的加上文件后缀，如 `require(./data)` 要写成 `require(./data.json)`

#### `module.noParse`

`module.noParse` 配置项能让 Webpack 忽略那些文件，可用于排除对非模块化库文件的解析。

如 jQuery、ChartJS 一些没有采用模块化标准的库，另外如果是用 `resovle.alias` 配置了 `react.min.js`，则也应该排除解析，因为 `react.min.js` 已是经过构建，并且可直接运行在浏览器的、非模块化的文件。

`module.noParse` 可以是 `RegExp`、`[RegExp]`、`function`

注意，被忽略掉的文件里不应该包含 import、 require、 define 等模块化语句，不 然会导致在构建出的代码中包含无法在浏览器环境下执行的模块化语句。

#### `loader`

- 尽量少使用不同的 loader / plugins
- 使用 `include` 配置项指明要转换的文件目录，使用 `exclude` 排除不必解析的文件目录

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: path.resolve(__dirname, 'node_modules'),
        loader: 'babel-loader',
      },
    ],
  },
};
```

### 使用 DllPlugin 减少基础模块编译次数

DllPlugin 动态链接库插件，其原理是把网页依赖的基础模块抽离出来打包到 dll 文件中，当需要导入的模块存在于某个 dll 中时，这个模块不再被打包，而是去 dll 中获取。

由于 dll 中大多包含的是常用的第三方模块，如 react、react-dom，所以只要这些模块版本不升级，就只需被编译一次，在之后的构建过程中被动态链接库包含的模块将不会重新编译，而是直接使用动态链接库中的代码。

我认为这样做和配置 `resolve.alias` 和 `module.noParse` 的效果有异曲同工的效果。

**使用方法：**

准备两个插件：

- DllPlugin - 用于打包出一个个单独的动态链接库文件
- DllReferencePlugin - 用于在主要的配置文件中引入 DllPlugin 插件打包好的动态链接库文件

1. 使用 DllPlguin 配置一个 webpack_dll.config.js 来构建 dll 文件

```js
// webpack_dll.config.js
const path = require('path');

module.exports = {
  entry: {
    react: ['react', 'react-dom'],
    polyfill: ['core-js/fn/promise', 'whatwg-fetch'],
  },
  output: {
    filename: '[name].dll.js',
    path: path.resolve(__dirname, 'dist'),
    library: '_dll_[name]', // dll 的全局变量名
  },
  plugins: [
    new DllPlugin({
      name: '_dll_[name]', // dll 的全局变量名
      path: path.join(__dirname, 'dist', '[name].manifest.json'), // 描述生成的 manifest 文件
    }),
  ],
};
```

需要注意 DllPlugin 的参数重 `name` 值必须和 `output.library` 保持一致，并且声称的 manifest 文件中会引用 `output.library` 值。

最终构建出的文件：

```
 |-- polyfill.dll.js
 |-- polyfill.manifest.json
 |-- react.dll.js
 └── react.manifest.json
```

其中 `xx.dll.js` 包含打包的 n 多模块，这些模块存在一个数组里，并以数组索引作为 ID，通过一个变量假设为 `__xx_dll` 暴露在全局中，可以通过 `window._xx_dll` 访问这些模块。`xx.manifest.json` 文件描述 `dll` 文件包含哪些模块、每个模块的路径和 ID。然后再在项目的主 config 文件里使用 DllReferencePlugin 插件引入 `xx.manifest.json` 文件。

2. 在主 config 文件里使用 DllPlugin 插件引入 `xx.manifest.json` 文件：

```js
// webpack.config.js
const path = require('path');

module.reports = {
  entry: { main: './main.js' },
  plugins: [
    new DllReferencePlugin({
      manifest: require('./dist/react.manifest.json'),
    }),
    new DllReferencePlugin({
      manifest: require('./dist/polyfill.manifest.json'),
    }),
  ],
};
```

最终构建声称 `main.js`

### 使用 HappyPack 开启多进程 Loader 转换

在整个构建流程中，最耗时的就是 Loader 对文件的转换操作了，而运行在 NodeJS 之上的 Webpack 是单线程模型的，也就是只能一个一个文件进行处理，不能并行处理。HappyPack 可以将任务分解给多个子进程，最后将结果发给主进程。JS 是单线程模型，只能通过这种多进程的方式提高性能。

```bash
npm i happypack --save-dev
```

```js
const path = require('path');
const HappyPack = require('happypack');

module.exports = {
  rules: [
    {
      test: /\.(js|jsx)$/,
      include: path.resolve(__dirname, 'src'),
      // 排除 node_modules 目录下的文件，node_modules 目录下的文件都采用了 ES5 语法，没必要再通过 Babel 去转换
      exclude: path.resolve(__dirname, 'node_modules'),
      // 将 JS 文件的处理转交给 id 为 babel 的 HappyPack 实例
      use: 'happypacl/loader?id=babel',
    },
    {
      test: /\.css/,
      // 将 CSS 文件的处理转交给 id 为 css 的 HappyPack 实例
      use: ['happypack/loader?id=css'],
    },
  ],
  plugins: [
    new HappyPack({
      // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
      id: 'babel',
      // 如何处理该类文件，与 loader 配置一样
      loaders: ['babel-loader?cacheDirectory'],
    }),
    new HappyPack({
      id: 'css',
      loaders: ['css-loader'],
    }),
  ],
};
```

**其他参数：**

- threads：代表开启几个子进程去处理这一类型的文件，默认是 3 个，必须是整数 。
- verbose：是否允许 HappyPack 输出日志，默认是 true。
- threadpool：代表共享进程池 ，即多个 HappyPack 实例都使用同一个共享进程池中的子进程去处理任务，以防止资源占用过多

### 使用 ParallelUglifyPlugin 开启多进程压缩 JS 文件

使用 UglifyJS 插件压缩 JS 时，需要先将代码解析成 Object 表示的 AST（抽象语法树），再去应用各种规则去分析和处理 AST，所以这个过程计算量大耗时较多。ParallelUglifyPlugin 可以开启多个子进程，每个子进程使用 UglifyJS 压缩代码，可以并行执行，能显著缩短压缩时间。

使用也很简单，把原来的 UglifyJS 插件换成本插件即可。

```bash
npm i webpack-parallel-uglify-plugin --save-dev
```

```js
// webpack.config.js
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')

module.exports = {
    //...
    plugins: [
        // 使用 ParallelUglifyPlugin 并行压缩输出的 JavaScript 代码
        new ParallelUglifyPlugin({
            // 传递给 UglifyJS 的参数
            uglifyJS: {
                //...uglifyjs参数
                output: {
                    // 最紧凑的输出
                    beutify: false,
                    // 删除所有注释
                    comments: false
                },
                compress: {
                    // 在 UglifyJS 删除没有用到的代码时不输出警告
                    warnings: false,
                    // 删除所有 console 语句，可兼容 IE
                    drop_console: true,
                    // 内嵌已定义但是只用到一次的变量
                    collapse_vars: true
                    // 提取出出现多次但是没有定义成变量去引用的静态值
                    reduce_vars: true
                }
            }
        })
        //...其他ParallelUglifyPlugin的参数，设置cacheDir可以开启缓存，加快构建速度
    ]
}
```

ParallelUglifyPlugin 参数：

- test - 正则匹配需被压缩文件
- include - 正则命中需被压缩文件 默认 `[]`
- exclude - 正则命中不需被压缩文件 默认 `[]`
- cacheDir - 缓存压缩后结果，下次遇到一样的输入时直接从缓存中获取压缩后的结果并返回。cacheDir 用于配置缓存存放的目录路径。默认不会缓存。
- workcount - 子进程数量。默认计算机 CPU 核数减一
- sourceMap - 是否输出 SourceMap
- uglifyJS - 压缩 ES5 代码
- uglifyES - 压缩 ES6 代码

UglifyES 是 UglifyJS 的变种，专门用于压缩 ES6 代码。不能同时使用。

## 优化开发体验

通过自动化手段完成一些重复的工作，让我们专注于解决问题本身。

### 使用自动刷新

#### 文件监听

Webpack 可以使用两种方式开启文件监听：

- 启动 Webpack 时配置 `--watch` 参数
- 在配置文件中设置 `watch: true`

此外还有如下配置参数。合理设置 `watchOptions` 可以优化监听体验。

```js
module.exports = {
  watch: true,
  watchOptions: {
    // 支持正则匹配
    // 默认为空
    ignored: /node_modules/,
    // 文件变动后多久发起构建，越大越好
    aggregateTimeout: 300,
    poll: 1000, // 每秒询问次数，越小越好
  },
};
```

- `ignored`：设置不监听的文件目录，排除 `node_modules` 后可以显著减少 Webpack 消耗的内存
- `aggregateTimeout`：文件变动后多久发起构建，截流，避免文件更新太快而造成频繁编译以至卡死，越大越好
- `poll`：通过向系统轮询文件是否变化来判断文件是否改变，`poll` 为每秒询问次数，越小越好

**文件监听的工作原理**

原理：定时获取文件的最后编辑时间，每次都存下最新的最后编辑时间，如果发现当前获取的和最后保存的不一致，就认为文件有变化。

当发现某个文件发生了变化时，并不会立刻告诉监昕者，而是先缓存起来，收集一段时间的变化后，再一次性告诉监听者。

确定监听文件列表：Webpack 会从 Entry 出发，递归解析出 Entry 文件所依赖的文件，将这些依赖的文件都加入监听列表中。

由于保存文件的路径和最后的编辑时间需要占用内存，定时检查周期检查需要占用 CPU 及文 件 110，所以最好减少需要监昕的文件数量和降低检查频率。

#### DevServer 刷新浏览器

DevServer 刷新浏览器有两种方式：

1. 向网页注入代理客户端代码，通过客户端发起刷新
2. 向网页装入一个 iframe，通过刷新 iframe 实现刷新效果

默认情况下，以及 `devserver: {inline: true}` 都是采用第一种方式刷新页面。第一种方式 DevServer 因为不知道网页依赖哪些 Chunk，所以会向每个 Chunk 中都注入客户端代码，当要输出很多 Chunk 时，会导致构建变慢。而一个页面只需要一个客户端，所以关闭 inline 模式可以减少构建时，Chunk 越多提升越明显。

关闭方式：

1. 启动时使用 `webpack-dev-server --inline false`
2. 配置 `devserver: {inline: false}`

关闭 inline 后入口网址变为 `http://localhost:8080/webpack-dev-server/`

另外 `devServer.compress` 参数可配置是否采用 Gzip 压缩，默认为 false。

### 开启模块热替换 HMR

模块热替换不刷新整个网页而只重新编译发生变化的模块，并用新模块替换老模块，所以预览反应更快，等待时间更少，同时不刷新页面能保留当前网页的运行状态。原理也是向每一个 Chunk 中注入代理客户端来连接 DevServer 和网页，不同在于模块热替换的独特的模块替换机制。

优势：

- 实时预览反应更快，等待时间更矩。
- 不刷新浏览器时能保留当前网页的运行状态，例如在使用 Redux 管理数据的 应用 中搭配模块热替换能做到在代码更新时 Redux 中的数据保持不变。

开启方式：

1. `webpack-dev-server --hot`
2. 使用 HotModuleReplacementPlugin

```js
module.export = {
  entry: {
    // 为每个入口都注入代理客户端
    main: [
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/dev-server',
      './src/main.js',
    ],
  },
  plugins: [
    // //该插件的作用就是实现模块热替换，实际上若启动时带上 --hot 参数，就会注入该插件，生成 .hot-update.json 文件。
    new webpack.HotModuleReplacement(),
  ],
  devServer: {
    // 告诉 devServer 要开启模块热替换模式
    hot: true,
  },
};
```

在启动 Webpack 时带上 `--hot` 参数，其实是自动完成以上配置。

```js
{
    "script": webpack --hot
}
```

开启后如果修改子模块就可以实现局部刷新，但如果修改的是根 JS 文件，会整页刷新，原因在于，子模块更新时，事件一层层向上传递，直到某层的文件接收了当前变化的模块，然后执行回调函数。如果一层层向外抛知道最外层都没有文件接收，就会刷新整页。

使用 NamedModulePlugin 可以使控制台打印出被替换的模块的名称而非数学 ID，另外同 Webpack 监听，忽略 `node_modules` 目录的文件可以提升性能。

```js
module.export = {
  plugins: [
    // 显示出被替换模块的名称
    new webpack.NamedModulesPlugin(),
  ],
};
```

除此之外，模块热替换还面临和自动刷新一样的性能 问题，因为它们都需要监昕文件的变化和注入客户端。

### devtool

使用 `devtool` 是很耗性能的，如果不需要用到它的话就不要设置它，如果需要用到且质量要很好可设为 `source-map`，不过这是非常耗时的，如果可以接受质量比较差的话，可使用 `cheap-source-map`，官方推荐使用的是性能比较好质量比较差的 `cheap-module-eval-source-map`。

- 去除 sourmap

### 避免使用构建时才使用到的工具

有一些工具在开发时是不需要用到的，如果用了可能会大大减慢生成代码的速度，如 UglifyJsPlugin，在开发时不需要将代码进行压缩，还有以下工具也避免在开发时用到：

- UglifyJsPlugin
- ExtractTextPlugin
- [hash]/[chunkhash]
- AggressiveSplittingPlugin
- AggressiveMergingPlugin
- ModuleConcatenationPlugin

### 不要输出路径信息

```js
module.exports = {
  // ...
  output: {
    pathinfo: false,
  },
};
```

### 关闭部分构建优化

```js
module.exports = {
  ...
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  }
}
```

## 优化输出质量 - 压缩文件体积

### 区分环境：减少生产环境代码体积

代码运行环境分为开发环境和生产环境，代码需要根据不同环境做不同的操作，许多第三方库中也有大量的根据开发环境判断的 `if-else` 代码，构建也需要根据不同环境输出不同的代码，所以需要一套机制可以在源码中区分环境，区分环境之后可以使输出的生产环境的代码体积减少。Webpack 中使用 [webpack.DefinePlugin](https://webpack.js.org/plugins/define-plugin/) 内置插件来定义配置文件适用的环境。

```js
module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true),
      VERSION: JSON.stringify('5fa3b9'),
      BROWSER_SUPPORTS_HTML5: true,
      TWO: '1+1',
      'typeof window': JSON.stringify('object'),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
};
```

⚠️ 注意，需要 JSON 序列化 `JSON.stringify('production')` 的原因是，环境变量值需要一个双引号包裹的字符串，而 stringify 后的值时 `'production'`。

然后就可以在源码中使用定义的环境：

```js
if (process.env.NODE_ENV === 'production') {
  console.log('你在生产环境');
  doSth();
} else {
  console.log('你在开发环境');
  doSthElse();
}
```

当代码中使用 `process` 时，Webpack 会自动打包进 `process` 模块的代码以支持非 Node.js 的运行环境，这个模块的作用时模拟 Node.js 中的 `process`，以支持 `process.env.NODE_ENV === 'procution'` 语句。

### 压缩代码：JS、ES、CSS

#### 压缩 JavaScript：Webpack 内置 UglifyJS 插件、ParallelUglifyPlugin

会分析 JavaScript 代码语法树，理解代码的含义，从而做到去除无效代码、去掉日志输出代码、缩短变量名等优化。

```js
module.exports = {
  plugins: [
    new webpack.UglifyJSPlugin({
      compress: {
        warnings: false, // 删除无用代码时不输出警告
        drop_console: true, // 删除所有console语句，可兼容IE
        collapse_vars: true, // 内嵌已定义但只使用一次的变量
        reduce_vars: true, // 提取使用多次但没定义的静态值到变量
      },
      output: {
        beautify: false, // 最紧凑的输出，不保留空格和制表符
        comments: false, // 删除所有注释
      },
    }),
  ],
};
```

使用 `webpack --optimize-minimize` 启动 webpack，可以注入默认配置的 UglifyJSPlugin。

#### 压缩 ES6：第三方 UglifyJS 插件

随着越来越多的浏览器支持直接执行 ES6 代码，应尽可能的运行原生 ES6，这样比起转换后的 ES5 代码，代码量更少，且 ES6 代码性能更好。直接运行 ES6 代码时，也需要代码压缩，第三方的 `uglify-webpack-plugin` 提供了压缩 ES6 代码的功能：

```bash
npm i uglify-webpack-plugin@beta --save-dev
```

```js
const UglifyESPlugin = require('uglify-webpack-plugin')

module.exports = {
    plugins: [
        new UglifyESPlugin({
            uglifyOptions: { // 比UglifyJS多嵌套一层
                compress：{
                    warnings: false,
                    drop_console: true,
                    collapse_vars: true,
                    reduce_vars: true
                }
                output: {
                    beautify: false,
                    comments: false
                }
            }
        })
    ]
}
```

另外要防止 babel-loader 转换 ES6 代码，要在 `.babelrc` 中去掉 babel-loader-env，因为正是 babel-preset-env 负责 ES6 转换为 ES5。

生产环境必备
压缩混淆代码
降低浏览加载资源体积
降低页面渲染时间
也防止反向编译工程的可能性

#### 压缩 CSS：css-loader?minimize、PurifyCSSPlugin

cssnano 基于 PostCSS，不仅是删掉空格，还能理解代码含义，例如把 `color:#ff0000` 转换成 `color: red`，css-loader 内置了 cssnano，只需要使用 `css-loader?minimize` 就可以开启 cssnano 压缩。

```js
const path = require('path');
const { WebPlugin } = require('web-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.export = {
  module: {
    rules: [
      {
        test: /\.css$/,
        // 提取 Chunk 中的 CSS 代码到单独的文件中
        use: ExtractTextPlugin.extract({
          // 通过 minimize 选项压缩 CSS 代码
          use: ['css-loader?minimize'],
        }),
      },
    ],
  },
  plugins: [
    // 用 WebPlugin 生成对应的 HTML 文件
    new WebPlugin({
      template: './template.html',
      filename: 'index.html',
    }),
    new ExtractTextPlugin({
      filename: '[name]_[contenthash:8].css',
    }),
  ],
};
```

另外一种压缩 CSS 的方式是使用 PurifyCSSPlugin，需要配置 `extract-text-webpack-plugin` 使用，它主要的作用是可以去除没有用到的 CSS 代码，类似 JS 的 TreeShaking。

### 使用 TreeShaking 去除无效代码

TreeShaking 可以去除无用代码，它依赖于 ES6 的 `import`、`export` 的模块化语法，最先在 Rollup 中出现，Webpack2.0 开始引入使用。适合用于 `lodash`、`utils.js` 等工具类较分散的文件。

它正常工作的前提是代码必须采用 ES6 的模块化语法，因为 ES6 模块化语法是静态的（在导入、导出语句中的路径必须是静态字符串，且不能放入其他代码块中）。

如果采用了 ES5 中的模块化，例如 `module.export = {...}`、`require(x+y)`、`if(x){require('./util')}`，则 Webpack 无法分析出可以去除哪些嗲吗。

在项目中使用大量第三方库时，我们会发现 TreeShaking 似乎不生效了，原因是大部分 NPM 中的代码都采用了 CommonJS 语法，这导致 TreeShaking 无法正常工作而降级处理。但幸运的是，有些库考虑到了这一点，这些库在发布到 NPM 上时会同时提供两份代码，一份采用 CommonJS 模块化语法，一份采用 ES6 模块化语法。并且在 package.json 文件中分别指出这两份代码的入口。

为了让 TreeShaking 有效，需要配置 Webpack 的文件寻找规则。

```js
module.export = {
  resolve: {
    // 针对 NPM 中的第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件
    mainFields: ['jsnext:main', 'browser', 'main'],
  },
};
```

虽然并不是每个 NPM 中的第三方模块都会提供 ES6 模块化语法的代码，但对于已提供了的代码要尽量优化。

采用 `jsnext:main` 作为 ES6 模块化代码的入口时社区的一个约定。

### 公共代码提取

CommonChunksPlugin => SplitChunksPlugin（webpack4+）

📌 方法一：分开 vendor 和 app（区分第三方代码和业务代码）不打包第三方代码
DLLPlugin
DLLReferencePlugin
映射关系 打包业务代码映射
通过第三方库打包 不用打包第三方库
把打包第三方库的时间节省下来

- 相同资源重复加载，浪费用户流量和服务器成本
- 每个页面需要加载的资源太大，导致网页首屏加载缓慢，影响用户体验

提取策略：

- 根据网站所使用的技术栈，找出网站的所有页面都需要用到的基础库，以采用 React 技术栈的网站为例，所有页面都会依赖 react、react-dom 等库，将它们提取到一个单独的文件 base.js 中，该文件包含了所有网页的基础运行环境。（为了长期缓存 base.js 文件）
- 在剔除了个页面中被 base.js 包含的部分代码后，再找出所有页面都依赖的公共部分代码，将它们提取出来并放到 common.js 中。
- 再为每个页面都生成一个单独的文件，而只包含各个页面单独需要的部分代码。

### 压缩和混淆

UglifyJsPlugin 压缩和混淆

- 删除多余的代码、注释、简化代码
- 平行处理
- 从向上下 处理很慢
- parallel-webpack
- cache 利用缓存

## 优化输出质量 - 加速网络请求

### 使用 CDN 加速静态资源加载

**CDN 加速的原理**

CDN 通过资源部署到世界各地，使得用户可以就近访问资源，加快访问速度。要接入 CDN，需要把网页的静态资源上传到 CDN 服务上，在访问这些资源时，使用 CDN 服务提供的 URL。CDN 其实是通过优化物理链路层传输过程中的光速有限、丢包等问题来提升网速的。

由于 CDN 会为资源开启长时间的缓存，例如用户从 CDN 上获取了 `index.html`，即使之后替换了 CDN 上的 `index.html`，用户那边仍会在使用之前的版本直到缓存时间过期。业界做法：

- **HTML 文件：放在自己的服务器上且关闭服务器上的缓存，不接入 CDN**
- **静态的 JS、CSS、图片等资源：开启 CDN 和缓存，同时文件名带上由内容计算出的 Hash 值**，这样只要内容变化 hash 就会变化，文件名就会变化，就会被重新下载而不论缓存时间多长。

另外，HTTP1.x 版本的协议下，浏览器会对于向同一域名并行发起的请求数限制在 4~8 个。那么把所有静态资源放在同一域名下的 CDN 服务上就会遇到这种限制，所以可以把他们分散放在不同的 CDN 服务上，例如 JS 文件放在 `js.cdn.com` 下，将 CSS 文件放在 `css.cdn.com` 下等。这样又会带来一个新的问题：增加了域名解析时间，这个可以通过 **dns-prefetch** 来解决 `<link rel='dns-prefetch' href='//js.cdn.com'>` 来缩减域名解析的时间。形如`//xx.com` 这样的 URL 省略了协议，这样做的好处是，浏览器在访问资源时会自动根据当前 URL 采用的模式来决定使用 HTTP 还是 HTTPS 协议。

**总之，构建需要满足以下几点：**

- 静态资源导入的 URL 要变成指向 CDN 服务的绝对路径的 URL
- 静态资源的文件名需要带上根据内容计算出的 Hash 值
- 不同类型资源放在不同域名的 CDN 上

**最终配置**

```js
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { WebPlugin } = require('web-webpack-plugin');

module.exports = {
  output: {
    filename: '[name]_[chunkhash:8].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '//js.cdn.com/id/', // 指定CSS文件中导入的图片等资源存放的CDN地址
  },
  module: {
    rules: [
      {
        test: /\.css/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader?minimize'],
          publicPath: '//img.cdn.com/id/', // 指定CSS文件中导入的图片等资源存放的CDN地址
        }),
      },
      {
        test: /\.png/,
        use: ['file-loader?name=[name]_[hash:8].[ext]'], // 为输出的PNG文件名加上Hash值
      },
    ],
  },
  plugins: [
    new WebPlugin({
      template: './template.html',
      filename: 'index.html',
      stylePublicPath: '//css.cdn.com/id/', //指定存放CSS文件的CDN地址
    }),
    new ExtractTextPlugin({
      filename: `[name]_[contenthash:8].css`, //为输出的CSS文件加上Hash
    }),
  ],
};
```

---

使用 `externals` 可以防止某些库被打包，而通过其他方式引用库（如 CDN），这样做的好处是当更新代码时不会影响库代码的缓存，用户只需下载新的代码即可。当然我们也可以使用 chunk 来把不常更新的库打包在另一个文件。

例如：从 CDN 引入 React

```js
<script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js" defer></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js" defer></script>
<script src="./dist/index.js" defer></script>
```

```js
module.exports = {
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
};
```

### 多页面应用提取页面间公共代码

**原理**

大型网站通常由多个页面组成，每个页面都是一个独立的单页应用，多个页面间肯定会依赖同样的样式文件、技术栈等。如果不把这些公共文件提取出来，那么每个单页打包出来的 chunk 中都会包含公共代码，相当于要传输 n 份重复代码。如果把公共文件提取出一个文件，那么当用户访问了一个网页，加载了这个公共文件，再访问其他依赖公共文件的网页时，就直接使用文件在浏览器的缓存，这样公共文件就只用被传输一次。

**应用方法**

1. 把多个页面依赖的公共代码提取到 `common.js` 中，此时 `common.js` 包含基础库的代码

```js
module.exports = {
  //...
  plugins: [
    new webpack.CommonsChunkPlugin({
      chunks: ['a', 'b'], // 从哪些chunk中提取
      name: 'common', // 提取出的公共部分形成一个新的chunk
    }),
  ],
};
```

2. 找出依赖的基础库，写一个 `base.js` 文件，再与 `common.js` 提取公共代码到 `base` 中，`common.js` 就去除了基础库代码，而 `base.js` 保持不变。

```js
// base.js
import 'react';
import 'react-dom';
import './base.css';

// webapck.config.js
module.exports = {
  entry: {
    base: './base.js',
  },
  plugins: [
    new CommonsChunkPlugin({
      chunks: ['base', 'common'],
      name: 'base',
      // minChunks: 2 表示文件要被提取出来需要在指定的chunks中出现的最小次数，防止common.js中没有代码的情况
    }),
  ],
};
```

3. 得到基础代码 `base.js`，不含基础库的公共代码 `common.js`，和页面个字的代码文件 `xx.js`。

页面引用顺序如下：

`base.js => common.js => xx.js`

### 分割代码以按需加载

**原理**

单页应用的一个问题在于使用一个页面承载复杂的功能，要加载的文件体积很大，不进行优化的话会导致首屏加载时间过长，影响用户体验。做按需加载可以解决这个问题。具体方法如下：

将网站功能按照相关程度划分成几类

每一类合并成一个 Chunk，按需加载对应的 Chunk
例如，只把首屏相关的功能放入执行入口所在的 Chunk，这样首次加载少量的代码，其他代码要用到的时候再去加载。最好提前预估用户接下来的操作，提前加载对应代码，让用户感知不到网络加载

**实现方案**

一个最简单的例子：网页首次只加载 `main.js`，网页展示一个按钮，点击按钮时加载分割出去的 `show.js`，加载成功后执行 `show.js` 里的函数

```js
//main.js
document.getElementById('btn').addEventListener('click', function () {
  import(/* webpackChunkName:"show" */ './show').then((show) => {
    show('Webpack');
  });
});
//show.js
module.exports = function (content) {
  window.alert('Hello ' + content);
};
```

`import(/* webpackChunkName:show */ './show').then()` 是实现按需加载的关键，Webpack 内置对 `import(*)` 语句的支持，Webpack 会以 `./show.js` 为入口重新生成一个 Chunk。代码在浏览器上运行时只有点击了按钮才会开始加载 `show.js`，且 import 语句会返回一个 Promise，加载成功后可以在 then 方法中获取加载的内容。这要求浏览器支持 Promise API，对于不支持的浏览器，需要注入 `Promise polyfill`。`/* webpackChunkName:show */` 是定义动态生成的 Chunk 的名称，默认名称是 `[id].js`，定义名称方便调试代码。为了正确输出这个配置的 ChunkName，还需要配置 Webpack：

```js
//...
output:{
    filename:'[name].js',
    chunkFilename:'[name].js', //指定动态生成的Chunk在输出时的文件名称
}
```

### 长缓存优化

https://sebastianblade.com/using-webpack-to-achieve-long-term-cache/#hash

long-time cache 也叫做 持久化缓存方案

什么是长缓存?
为什么需要长缓存?
怎么做?

开发过程，从 url 访问资源，服务器返回请求时，控制 http 协议，带版本号，告诉该资源是否需要重新向服务器请求新资源。

希望开发的过程中，如果代码有更新，版本号发生变化，说明这部分代码，不影响代码，如果被浏览器被缓存。

场景：
改变 app 代码，vendor 变化（不被 app 变化而改变版本号，因为只是改变业务代码）
解决：
提取 vendor
hash（这次打包的 hash）=>chunkhash（）
提取 webpack runtime

场景：
引入新模块，模块顺序变化，vendor.hash 变化
解决：
NamedChunksPlugin
NamedModulesPlugin

场景：
非静态引入，动态引入 vendor hash 变化
解决：
定义动态模块的 chunkname

总结：
独立打包 vendor
抽出 manifest（webpack runtime）
使用 NamedChunksPlugin
使用 NamedModulesPlugin
动态模块给定模块名称

hash 会在每次打包时变化
原因是 Webpack 使用自增的数字作为每一个模块的标识

HashedModuleIdsPlugin 使用模块路径作为 hash
index 改变 => hash 变化
vendor 第三方库引用不变 => vendor 无限期使用缓存

根据第三方库使用的稳定性进一步拆分
stable-vendors 和 vendors

cssnano（css-loader?minimize）压缩 CSS

## 优化输出质量 - 提升代码运行时效率

### 使用 Prepack 提前求值

**原理**

Prepack 是一个部分求值器，编译代码时提前将计算结果放到编译后的代码中，而不是在代码运行时才去求值。通过在便一阶段预先执行源码来得到执行结果，再直接将运行结果输出以提升性能。但是现在 Prepack 还不够成熟，用于线上环境还为时过早。

**使用方法**

```js
const PrepackWebpackPlugin = require('prepack-webpack-plugin').default;
module.exports = {
  plugins: [new PrepackWebpackPlugin()],
};
```

### 使用 Scope Hoisting

**原理**

译作“作用域提升”，是在 Webpack3 中推出的功能，它分析模块间的依赖关系，尽可能将被打散的模块合并到一个函数中，但不能造成代码冗余，所以只有被引用一次的模块才能被合并。由于需要分析模块间的依赖关系，所以源码必须是采用了**ES6 模块化**的，否则 Webpack 会降级处理不采用 Scope Hoisting。

**使用方法**

```js
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');

module.exports = {
    //...
    plugins:[
        new ModuleConcatenationPlugin();
    ],
    resolve:{
        mainFields:['jsnext:main','browser','main']
    }
}
```

## 使用输出分析工具

启动 Webpack 时带上这两个参数可以声称一个 JSON 文件，输出分析工具大多依赖该文件进行分析：

`webpack --profile --json > stats.json` 其中 `--profile` 记录构建过程中的耗时信息，`--json` 以 JSON 的格式输出构建结果，`>stats.json` 是 UNIX / Linux 系统中的管道命令，含义是将内容通过管道输出到 `stats.json` 文件中。

### 官方工具 WebpackAnalyse

打开该工具的官网 [http://webpack.github.io/analyse/](http://webpack.github.io/analyse/) 上传 stats.json，就可以得到分析结果

### webpack-bundle-analyzer

可视化分析工具，比 Webpack Analyzer 更直观。

1. `npm i webpack-bundle-analyzer` 安装插件
2. 按照上面方法声称 stats.json 文件
3. 在项目根目录执行 `webpack-bundle-analyzer` 浏览器会自动打开结果分析页面

## 补充说明

- 配置 `babel-loader` 时，`use: [‘babel-loader?cacheDirectory’]` cacheDirectory 用于缓存 babel 的编译结果，加快重新编译的速度。另外注意排除 node_modules 文件夹，因为文件都使用了 ES5 的语法，没必要再使用 Babel 转换。

- 配置 `externals`，排除因为已使用 `<script>` 标签引入而不用打包的代码，noParse 是排除没使用模块化语句的代码。

- 配置 `performance` 参数可以输出文件的性能检查配置。

- 配置 `profile：true`，是否捕捉 Webpack 构建的性能信息，用于分析是什么原因导致构建性能不佳。

- 配置 `cache：true`，是否启用缓存来提升构建速度。

- 可以使用 `url-loader` 把小图片转换成 base64 嵌入到 JavaScript 或 CSS 中，减少加载次数。

- 通过 `imagemin-webpack-plugin` 压缩图片，通过 `webpack-spritesmith` 制作雪碧图。

- 开发环境下将 devtool 设置为 `cheap-module-eval-source-map`，因为生成这种 source map 的速度最快，能加速构建。在生产环境下将 devtool 设置为 `hidden-source-map`

### Babel

📌 babel-loader 十分耗时间
options.cacheDirectory 开启缓存
indclude 规定范围
exclude 排除范围
减少工作量

babel@7.0 因为现在大多数浏览器都已经支持 ES6 语法，所以如果所有代码都转为 ES5 的话可能产生大量的多余代码，所以这里只转换部分代码，那么兼容低版本的浏览器怎么办。

```js
// .babelrc
{
    "presets": [
        [
            "@babel/react",
            {
                "modules": false // 关闭 babel 的模块转换，才能使用 Webpack 的 tree-shaking 功能
            }
        ]
    ],
    "plugins": [
        "@babel/plugin-proposal-class-properties", // class 这个要放在前面 否则可能报错
        "@babel/plugin-transform-classes", // class
        "@babel/plugin-transform-arrow-functions", // 箭头函数
        "@babel/plugin-transform-template-literals" // 字符串模版
    ]
}
```

当一些库的 `package.json` 的 `sideEffects` 有设置时，就可以很好地支持 Tree-Shaking。

```js
{
    "name": 'lodash',
    "sideEffects": false
}
```

## 其他方法

- 减少 resolve
- devtool 去除 sourcemap
- cache-loader
- 升级 node
- 升级 webpack

能并行处理就并行处理 uglify happy-pack
减少 webpack 打包任务 第三方和业务分离
减少消耗编译时间的 babel 或 uglifyjs
babel 只处理 src 限定范围 尽可能使用缓存
跟进版本

利用 CDN 加速。在构建过程中，将引用的静态资源路径修改为 CDN 上对应的路径，可以利用 webpack 对于 output 参数和各 loader 的 publicPath 参数来修改资源路径

TreeShaking 将代码永远不会运行到的片段删除 可以再在启动 Webpack 时追加参数 `--optimize-minimize` 实现

**把代码构建到 ES6+**

上面说到转换代码到 ES5 的话会很耗时且可能有很多多余代码，因为现在大多数浏览器都已经支持 ES6 语法，现在我们来看看如何兼容较低版本的浏览器。

module、nomodule:

可以使用 `<script type="module" src="index.js"></script>` 来加载 ES6+ 的代码，因为支持这个属性的浏览器必定会支持 `async/await`、`Promise`、`class` 这些属性，而不支持的浏览器则会选择忽略它，不进行加载。
所以也还需要一份 ES5 的脚本来兼容低版本的浏览器，使用 `<script nomodule src="index.es5.js"></script>` 来加载 ES5 代码，可以识别 `nomodule` 的浏览器会忽略它，而不能识别它的低版本浏览器则会加载它。这样就可以做到兼容到低版本的浏览器而较新的浏览器使用代码量少很多的 ES6+代码。
但是这个方法也有缺点：当使用 `splitChunks` 把代码分为较多的模块时，需要产生大量两个版本的代码。

**动态 polyfill**

```js
<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
```

它会通过分析请求头信息中的 UserAgent 实现自动加载浏览器所需的 polyfills。如果你使用较新的版本访问上面的连接会发现没有多少代码，而用 IE 则会产生很多。这样我们就可以使用 ES6+ 的代码和动态 polyfill 来兼容低版本浏览器，但是动态 polyfill 不能支持 `class` 和箭头函数等等这些特性，所以就需要按上面那样配置 babel 来把这些转换成 ES5 的。想知道更多动态 polyfill 可以点这里。

**进阶方案对比**

|                  | 适用于生产 | 首次编译快       | 二次编译快 | 整体尺寸不变大 | 支持拆包到文件级别 | 是否为通用方案   | Webpack 高级功能 |
| ---------------- | ---------- | ---------------- | ---------- | -------------- | ------------------ | ---------------- | ---------------- |
| dll              | X          | X                | Y          | X              | X                  | Y                | Y                |
| external         | X          | Y                | Y          | X              | X                  | Y                | Y                |
| 物理缓存         | X          | X                | Y          | Y              | Y                  | Y                | Y                |
| ModuleFederation | Y          | Y                | Y          | Y              | Y                  | 看方案和社区发展 | Y                |
| systemjs         | 加载会变慢 | 编译快，但加载慢 | Y          | Y              | Y                  | Y                | X                |
| ESM in Browser   | 加载会变慢 | 编译快，但加载慢 | Y          | Y              | Y                  | Y                | X                |
| Pika + Snowpack  | 加载会变慢 | Y                | Y          | X              | Y                  | Y                | X                |
| Gravity          | 加载会变慢 | 编译快，但加载慢 | Y          | Y              | Y                  | Y                | X                |

## 参考文章

- [📝 三十分钟掌握 Webpack 性能优化](https://juejin.im/post/5b652b036fb9a04fa01d616b#heading-13)
- [📝 Webpack 优化总会让你不得不爱](https://juejin.im/post/5cceecb7e51d453ab908717c)
- [Webpack 系列二：优化 90%打包速度](https://github.com/sisterAn/blog/issues/63)
