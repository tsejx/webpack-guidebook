---
nav:
  title: 最佳实践
  order: 3
group:
  title: 构建优化
  order: 2
title: 分割打包 Bundle Spliting
order: 11
---

# 分割打包 Bundle Spliting

目前，生产环境下的打包结果是单个 JavaScript 文件。如果更改了代码，则客户端也必须重新下载整个包，包括一些外部依赖包。

最好的结果是只下载更改的部分。如果外部依赖包发生更改，则客户端应仅获取依赖包。对于应用本身的代码也是如此。在 Webpack4 我们可以使用 `optimization.splitChunks.cacheGroups` 来进行 `分割打包`。

Webpack 提供了提取公共代码的分包插件，根据版本不同使用不同的插件：

- Webpack 4+：SplitChunksPlugin
- Webpack 3：CommonsChunkPlugin

> 要正确使打包结果无效，必须将哈希附加到生成的 bundle 中。

## 分割打包的思想

通过拆分打包，您可以将外包依赖项单独打包，并从客户端级别缓存中受益。执行了该过程，应用程序的整个大小依然保持不变。尽管需要执行的请求越多，会产生轻微的开销，但缓存的好处弥补了这一成本。

一个模块化的 JS 文件就是一个模块，若干个 JS 模块会打包成一个总的 JS 文件，这个 JS 文件称作 Bundle。但如果是多页面应用，往往会安排为一个 HTML 对应一个 Bundle，那么两个 HTML 的 Bundle 之间重复的模块就是重复代码。此时我们会把这两个 Bundle 重复的模块抽出来，称为 Common Chunk，余下的两部分直接称作两个 Chunk。即此时一共有 3 个 Chunk，但依然只有两个 Bundle。

**Chunk 和 Bundle 的关系**

- Chunk（块）：指若干个 JS Module 的集合
- Bundle：形式上是块的集合，意义是代表一个可以运行的整体

单页面应用中异步加载，或者单纯想分离出不变的第三方库，均可采用该手段进行优化。

Webpack 处理三种类型的块：

1. **入口块**：入口块包含 Webpack 运行时和它随后加载的模块。
2. **正常块**：正常块不包含 Webpack 运行时。相反，这些可以在应用程序运行时动态加载，Webpack 为这些块生成合适的包装器（例如 JSONP）。
3. **初始块**：初始块是正常的块，计入应用程序的初始加载时间。作为用户，您不必关心这些。这是入口块和正常块之间的重要的分割点。

### 生成算法

1. Webpack 先将 entry 中对应的 module 都生成一个新的 Chunk
2. 遍历 module 的依赖列表，将依赖的 module 也加入到 Chunk 中
3. 如果一个依赖 module 是动态引入的模块，那么就会根据这个 module 创建一个新的 Chunk，继续遍历依赖
4. 重复上面的过程，直至得到所有的 Chunks

## SplitChunksPlugin

升级了 Webpack4 之后，`mode: production` 模式下，SplitChunksPlugin 插件是默认被启用的，默认配置如下：

```js
optimization: {
  splitChunks: {
    //
    // async -> 针对异步加载的 Chunk 做切割
    // initial -> 针对初始 Chunk
    // all -> 针对所有 Chunk
    chunks: "async",
    // 切割完要生成的新 Chunk 要大于该值，否则不生成新 Chunk
    minSize: 30000,
    // 共享该 module 的最小 Chunk 数
    minChunks: 1,
    // 最多异步加载请求该模块
    maxAsyncRequests: 5,
    // 初始化的时候最多请求该模块
    maxInitialRequests: 3,
    // ：名字中间的间隔符
    automaticNameDelimiter: '~',
    // Chunk 的名字，如果设为 `true`，会根据被提取的 Chunk 自动生成
    name: true,
    //（要切割成的每个新 Chunk 就是一个 Cache Group）
    cacheGroups: {
      vendors: {
          // 和 CommonsChunkPlugin 里的 minChunks 非常像，用来决定提取哪些模块
          // 可以接受字符串，正则表达式，或者函数，函数的一个参数是 module，第二个参数为引用这个 module 的 chunk（数组）
          test: /[\\/]node_modules[\\/]/,
          // 优先级高的 Chunk 为被优先选择，优先级一样的话，`size` 大的优先被选择
          priority: -10
      },
    	default: {
          minChunks: 2,
          priority: -20,
          //当 module 未变时，是否可以使用之前的 Chunk
          reuseExistingChunk: true
      }
    }
  }
}
```

## CommonsChunkPlugin

每个 CommonsChunkPlugin 实例都会生成一个新的 Chunk，在这个 Chunk 中包含了被提取的代码，在使用的过程中必须指定 name 属性，以告诉插件新生成的 Chunk 的名称。其中 chunks 属性指明从哪些已有的 Chunk 中提取，如果不填该属性，则默认会从所有已知的 Chunk 中提取。

Chunk 时一系列文件的集合，在一个 Chunk 中会包含这个 Chunk 的入口文件和该入口文件依赖的文件。

在通过以上配置输出的 common Chunk 中会包含所有页面都依赖的基础运行库 react、react-dom，为了将基础运行库从 common 中抽离到 base 中，还需要做一些处理。

首先需要配置一个 Chunk，在这个 Chunk 中只依赖所有页面都依赖的基础库及所有页面都使用的样式，为此需要在项目中写一 个 文件 `base.js` 来描述 base Chunk 所依赖的模块，文件 的内容如下:

```js
// 所有页面都依赖的基础库
import 'react';
import 'react-dom';
// 所有页面都使用的样式
import './base.css';
```

修改 Webpack 的配置。

```js
module.export = {
  entry: {
    base: './base.js',
  },
};
```

为了从 common 中提取出 base 也包含的部分，还需要配置一个 CommonsChunkPlugin。

```js
new CommonsChunkPlugin({
  // 从 common 和 base 两个现成的 Chunk 中提取公共部分
  chunks: ['common', 'base'],
  // 将公共部分放到 base 中
  name: 'base',
});
```

由于 common 和 base 的公共部分就是 base 目前已包含的部分，所以这样配置后 common 将会变小，而 base 将保持不变。

如此配置，需要在其 HTML 中按照顺序引入文件。

采用以上方法后可能会出现 common.js 中没有代码的情况，原因是去掉基础运行库后，很难再找到所有页面都会用上的模块。

**解决方案：**

- CommonsChunkPlugin 提供了 一个选项 minChunks，表示文件要被提取出 来时需 要在指定的 Chunks 中出 现的最小次数。假如 `minChunks=2`、 `chunks=['a'， '吧'，'c'，'吁']`，则任何一个文件只要在 `['a'，'币'，'c'，'d']` 中两个 以上的 Chunk 中都出现过，这个文件就会被提取出来 。我们可以根据自己的需求 去调整 minChunks 的值， minChunks 越小，被提取到 `common.js` 中的文件就会越多 ，但 这也会导致部分页面加载的不相关的资源越多：minChunks 越大，被提取到 `common.js` 中的文件就会越少，但这会导致 `common.js` 变小、效果变弱。
- 根据各个页面之间的相关性选取其中的部分页面时，可用 CommonsChunkPlugin 提取这部分被选出的页面的公共部分，而不是提取所有页面的公共部分，而且这样的操作可以叠加多次。这样做的效果会很好，但缺点是配置复杂， 需要根据页面之间的关系去思考如何配置，该方法并不通用 。

## 激进合并 HTTP/2

Webpack 通过两个插件提供对生成的块的更多控制：AggressiveSplittingPlugin 和 AggressiveMergingPlugin。前者允许您发出更多更小的包。由于 HTTP/2 新标准的工作方式，这种处理是非常方便的。

以下是一种更激进的分割打包方式：

```js
{
  plugins: [
    new webpack.optimize.AggressiveSplittingPlugin({
        minSize: 10000,
        maxSize: 30000,
    }),
  ],
}
```

如果你分成多个小的块，对于客户端缓存来说是比较有利的；但是，在 HTTP/1 环境中还会有额外的请求开销。目前，由于 `HtmlWebpackPlugin` 中的 BUG，如果启用该插件，这个方法不会起作用。

使用这项技术的应用不再输出包含在 HTML 文件中的单独文件，相反，它输出多个需要被加载的块（chunk），应用就能使用多个 `<script>` 标签（并行）加载每个块。就像这样：

```html
<script src="1ea296932eacbe248905.js"></script>
<script src="0b3a074667143853404c.js"></script>
<script src="0dd8c061aff2a2791815.js"></script>
<script src="191b812fa5f7504151f7.js"></script>
<script src="08702f45497539ef6ea6.js"></script>
```

Webpack 按时间先后顺序输出这些块。最旧的文件先执行，最新的在最后。浏览器可以先执行已被缓存的块，同时加载最新的文件，旧文件更可能已经被缓存。

当 HTML 文件被请求时，HTTP/2 服务端推送可以将这些块推送给客户端。也是因为旧文件更可能已经被缓存，最好能先推送最新的文件。如果已经有缓存，客户端可以取消服务端的推送，但这需要一次往返。

Webpack 将代码分离用于 **按需加载**，可以处理并行请求。

这个激进的插件还能够以相反的方式工作，允许您将小的块组合成更大的块：

```js
{
  plugins: [
    new AggressiveMergingPlugin({
      minSizeReduce: 2,
      moveToParents: true,
    }),
  ];
}
```


---

**参考资料：**

- [what-are-module-chunk-and-bundle-in-webpack](https://stackoverflow.com/questions/42523436/what-are-module-chunk-and-bundle-in-webpack)
- [Webpack & HTTP/2](https://blog.csdn.net/weixin_34273481/article/details/87956102)

* [激进合并](https://medium.com/webpack/webpack-http-2-7083ec3f3ce6)
