# output 输出

[中文文档](https://webpack.docschina.org/configuration/output/)

作用：如何输出、哪里输出。

* path
* pathinfo
* publicPath
* filename
* chunkFilename

## path

输出文件路径（绝对路径）

⚠️ `[hash]` 在参数中被替换为编译过程（compilation）的 hash。

## pathinfo

用于告知 webpack 在 bundle 中引入「所包含模块信」的相关注释。

* `development` => true 对于开发环境阅读生成代码可以提供有用的信息
* `production` => false

## publicPath

此选项指定在浏览器中所引用的「此输出目录对应的**公开 URL**」。相对 URL（relative URL）会被相对于 HTML 页面（或 `<base>` 标签）解析。相对于服务的 URL（Server-relative URL），相对于协议的 URL（protocol-relative URL）或绝对 URL（absolute URL）也可是可能用到的，或者有时必须用到，例如：当将资源托管到 CDN 时。

对于**按需加载**（on-demand-load）或**加载外部资源**（external resource）（如图片、文件等）是十分重要的选项。

## filename

输出 bundle 的名称。

当通过多个入口起点（entry point）、代码拆分（code spilting）或各种插件（plugins）创建多个 bundle。应该以以下一种方式替换。来赋予每个 bundle 唯一的名称。

| 变量名    | 含义                         | 其他                 |
| --------- | ---------------------------- | -------------------- |
| id        | Chunk 的唯一标志性，从 0 开始  |                      |
| name      | Chunk 的名称                 |                      |
| hash      | Chunk 的唯一标志性的 Hash 值 | 长度可指定，默认 20 位 |
| chunkhash | Chunk 内容的 Hash 值         | 长度可指定，默认 20 位 |

```js
module.export = {
    //...
    output: {
        filename: '[id].bundle.js',
        filename: '[name].[hash:5].js',
        filename: '[chunkhash:5].js'
    }
}
```

⚠️ ExtractTextWebpackPlugin 插件使用 contenthash 而不是 chunkhash 来代表哈希值，原因在于 ExtractTextWebpackPlugin 提取出来的内容是代码内容本身，而不是由一组模块组成的 Chunk。

## chunkFilename

配置无入口的 Chunk 在输出时的文件名称。

只用于指定在运行过程中生成的 Chunk 在输出时的文件名称。

会在运行时生成 Chunk 的常见场景包括：

* 使用 CommonsChunkPlugin
* 使用 `import('path/to/module')` 动态加载等

## crossOriginLoading

异步加载通过 JSONP 方式实现。JSONP 的原理是动态地向 HTML 中插入一个 `<script="url"></script>` 标签去加载异步资源。

`output.crossOriginLoading` 则是用于配置这个异步插入的标签的 crossorigin 值。

`<script>` 标签的 crossorigin 属性可以取以下值：

* anonymous（默认），在加载此脚本资源时不会带上用户的 Cookies
* use-credentials，在加载此脚本资源时会带上用户的 Cookies

通常用设置 crossorigin 来获取异步加载的脚本执行时的详细错误信息。

## libraryTarget 和 library

当用 Webpack 去构建一个可以被其他模块导入使用的库时，需要用到 libraryTarget 和 library。

* `output.libraryTarget` 配置以何种方式导出库
* `output.library` 配置导出库的名称

通常搭配使用。

`output.libraryTarget` 是字符串的枚举类型，支持以下配置。

### var（默认）

```js
// Webpack 输出的代码
var LibraryName = lb_code
// 使用库的方法
LibraryName.doSomething()
```

假如 `output.library` 为空，则直接输出：`lib_code`

其中 `lib_code` 是指导出库的代码内容，是有返回值的一个自执行函数。

### commonjs

```js
// Webpack 输出的代码
exports['LibraryName'] = lib_code
// 使用库的方法
require('library-name-in-npm')['LibraryName'].doSomething()
```

其中，library-name-in-npm 是指模块被发布到 NPM 代码仓库时的名称。

### commonjs2

编写的库将通过 CommonJS2 规范导出。

```js
// Webpack 输出的代码
module.exports = lib_code
// 使用库的方法
require('library-name-in-npm').doSomething()
```

### this

编写的库将通过 this 被赋值给通过 library 指定的名称。

```js
// Webpack 输出的代码
this['LibraryName'] = lib_code
// 使用库的方法
this.LibraryName.doSomething()
```

### window

编写的库将通过 window 赋值给通过 library 指定的名称。

```js
// Webpack 输出的代码
window['LibraryName'] = lib_code
// 使用库的方法
window.LibraryName.doSomething()
```

### global

编写的库将通过 window 赋值给通过 library 指定的名称。

```js
// Webpack 输出的代码
global['LibraryName'] = lib_code
// 使用库的方法
global.LibraryName.doSomething()
```

## libraryExport

用于配置要导出的模块中哪些子模块需要被导出。

只有在 `output.libraryTarget` 被设置成 commonjs 或者 commonjs2 时使用才有意义。

