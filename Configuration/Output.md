## Output 输出

作用：如何输出、哪里输出。

* path
* pathinfo
* publicPath
* filename
* chunkFilename

### path

输出文件路径（绝对路径）

⚠️ `[hash]` 在参数中被替换为编译过程（compilation）的 hash。

### pathinfo

用于告知 webpack 在 bundle 中引入「所包含模块信」的相关注释。

* `development` => true 对于开发环境阅读生成代码可以提供有用的信息
* `production` => false

### publicPath

此选项指定在浏览器中所引用的「此输出目录对应的**公开 URL**」。相对 URL（relative URL）会被相对于 HTML 页面（或 `<base>` 标签）解析。相对于服务的 URL（Server-relative URL），相对于协议的 URL（protocol-relative URL）或绝对 URL（absolute URL）也可是可能用到的，或者有时必须用到，例如：当将资源托管到 CDN 时。

对于**按需加载**（on-demand-load）或**加载外部资源**（external resource）（如图片、文件等）是十分重要的选项。

### filename

输出 bundle 的名称。

当通过多个入口起点（entry point）、代码拆分（code spilting）或各种插件（plugins）创建多个 bundle。应该以以下一种方式替换。来赋予每个 bundle 唯一的名称。

```js
module.export = {
    //...
    output: {
        filename: '[id].bundle.js',
        filename: '[name].[hash].js',
        filename: '[chunkhash].js'
    }
}
```

### chunkFilename

非入口（chunk）文件的名称



