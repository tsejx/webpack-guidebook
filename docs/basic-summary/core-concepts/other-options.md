---
nav:
  title: 基本综述
  order: 1
group:
  title: 核心概念
  order: 2
title: otherOptions 其他配置
order: 8
---

# 其他配置项

## target

指定构建出不同运行环境的代码。

| 值                 | 描述                                       |
| ------------------ | ------------------------------------------ |
| web                | 浏览器（默认），所有代码都集中在一个文件里 |
| node               | NodeJS 使用 `require` 语句加载 Chunk 代码  |
| async-node         | NodeJS 异步加载 Chunk 代码                 |
| webworker          | WebWorker                                  |
| electron-main      | Electron 主线程                            |
| exlectron-renderer | Electron 渲染线程                          |

## devTool

**用于控制是否生成以及如何生成 SourceMap**

主要用于 development 模式下，但也可以作用于 production 模式下。

```js
module.export = {
  devtool: 'source-map',
};
```

**SourceMap**

调试工具可通过 SourceMap 映射代码，在源代码上断点调试。Webpack 支持声称 SourceMap，只需在启动时带上 `--devtool source-map` 参数。

#### development

七种 SourceMap 模式。详细信息看 [传送门](https://webpack.docschina.org/configuration/devtool/)

#### production

可以使用 `source-map` 或者 `cheap-source-map`

## watch/watchOptions

支持监听文件更新，在文件发生变化时重新编译。在使用 Webpack 时，监听模式默认时关闭的。

使用 DevServer 时，监听模式默认是开启的。

```js
module.export = {
  // 只有在开启监听模式时，watchOptions 才有意义
  // 默认为 false，也就是不开启
  watch: true,
  // 监听模式运行时的参数
  // 在开启监听模式时，才有意义
  watchOptions: {
    // 不监听的文件或文件夹，支持正则匹配
    // 默认为空
    ignored: /node_modules/,
    // 监听到变化会等 300ms 再去执行动作，防止文件更新太快导致重新编译频率太高
    // 默认为300ms
    aggregateTimeout: 300,
    // 判断文件是否发生变化是通过不停地询问系统指定文件有没有变化实现的
    // 默认每秒询问 1000 次
    poll: 1000,
  },
};
```

## externals

构建中无须打包的模块，也就是这些模块是外部环境提供的。

例如通过内置一些全局变量或模块。

```html
<script src="path/to/jquery.js"></script>
```

如果想使用模块化的源代码里导入和使用 jQuery。

```js
import $ from 'jquery';
$('.my-element');
```

打包后发现输出 Chunk 中包含该库内容。

解决方法：

```js
module.export = {
  externals: {
    // 将导入语句里的 jQuery 替换成运行环境里的全局变量 jQuery
    jquery: 'jQuery',
  },
};
```

## resolveLoader

如何寻找 Loader。

默认配置

```js
module.export = {
  resolveLoader: {
    // 去哪个目录下寻找 loader
    modules: ['node_modules'],
    // 入口文件的后缀
    extensions: ['.js', '.json'],
    // 指明入口文件位置的字段
    mainFields: ['loader', 'main'],
  },
};
```

## performance 性能

用于控制 webpack 如何通知「资源（asset）和入口起点超过指定文件限制」

- `hints` - 打开/关闭提示 （默认 `warning`）
- `maxEntrypointSize` - 根据入口起点的最大体积，控制 webpack 何时生成性能提示（默认 `250000` bytes）
- `maxAssetSize` - 根据单个资源体积，控制 webpack 何时生成性能提示（默认 `250000` bytes）
- `assetFilter` - 允许 webpack 控制用于计算性能提示的文件

## stats 统计

配置打包过程中输出的内容。

- none 没有输出
- normal 标准输出
- verbose 全部输出
- errors-only 只输出错误
