---
title: 提取公共代码
order: 10
nav:
  title: 原理
  order: 3
---

# 提取公共代码

每个 CommonsChunkPlugin 实例都会生成一个新的 Chunk，在这个 Chunk 中包含了被提取的代码，在使用的过程中必须指定 name 属性，以告诉插件新生成的 Chunk 的名称。其中 chunks 属性指明从哪些已有的 Chunk 中提取，如果不填该属性，则默认会从所有已知的 Chunk 中提取。

Chunk 时一系列文件的集合，在一个 Chunk 中会包含这个 Chunk 的入口文件和该入口文件依赖的文件。

在通过以上配置输出的 common Chunk 中会包含所有页面都依赖的基础运行库 react、react-dom，为了将基础运行库从 common 中抽离到 base 中，还需要做一些处理。

首先需要配置一个 Chunk，在这个 Chunk 中只依赖所有页面都依赖的基础库及所有页面都使用的样式，为此需要在项目中写一 个 文件 `base.js` 来描述 base Chunk 所依赖的模块，文件 的内容如下:

```js
// 所有页面都依赖的基础库
import 'react'
import 'react-dom'
// 所有页面都使用的样式
import './base.css'
```

修改 Webpack 的配置。

```js
module.export = {
    entry: {
        base: './base.js'
    }
}
```

为了从 common 中提取出 base 也包含的部分，还需要配置一个 CommonsChunkPlugin。

```js
new CommonsChunkPlugin({
	// 从 common 和 base 两个现成的 Chunk 中提取公共部分
    chunks: ['common', 'base'],
    // 将公共部分放到 base 中
    name: 'base'
})
```

由于 common 和 base 的公共部分就是 base 目前已包含的部分，所以这样配置后 common 将会变小，而 base 将保持不变。

如此配置，需要在其 HTML 中按照顺序引入文件。

采用以上方法后可能会出现 common.js 中没有代码的情况，原因是去掉基础运行库后，很难再找到所有页面都会用上的模块。

**解决方案：**

* CommonsChunkPlugin 提供了 一个选项 minChunks，表示文件要被提取出 来时需 要在指定的 Chunks 中出 现的最小次数。假如 `minChunks=2`、 `chunks=['a'， '吧'，'c'，'吁']`，则任何一个文件只要在 `['a'，'币'，'c'，'d']` 中两个 以上的 Chunk 中都出现过，这个文件就会被提取出来 。我们可以根据自己的需求 去调整 minChunks 的值， minChunks 越小，被提取到 `common.js` 中的文件就会越多 ，但 这也会导致部分页面加载的不相关的资源越多：minChunks 越大，被提取到 `common.js` 中的文件就会越少，但这会导致 `common.js` 变小、效果变弱。
* 根据各个页面之间的相关性选取其中的部分页面时，可用 CommonsChunkPlugin 提取这部分被选出的页面的公共部分，而不是提取所有页面的公共部分，而且这样的操作可以叠加多次。这样做的效果会很好，但缺点是配置复杂， 需要根据页面之间的关系去思考如何配置，该方法并不通用 。