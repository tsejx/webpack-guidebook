---
nav:
  title: 基本综述
  order: 1
group:
  title: 核心概念
  order: 2
title: entry 输入
order: 2
---

# entry 输入

[Entry and Context](https://webpack.js.org/configuration/entry-context/)

- 起点或是应用程序的起点入口。
- 从这个起点开始，应用程序启动执行。
- 如果传递一个数组，那么数组的每一项都会执行。
- 📌 **动态加载**的模块**不是**入口起点。

简单规则：每个 HTML 页面都有一个入口起点。

- 单页应用（SPA）：一个入口起点
- 多页应用（MPA）：多个入口起点

## 基础目录

Webpack 寻找相对路径的文件时会以 `context` 字段为根目录，默认为执行启动 Webpack 时所在当前工作目录。

`context` 必须是 **绝对路径** 字符串。

```js
module.exports = {
  context: path.resolve(__dirname, 'app'),
};
```

`entry` 路径及其依赖的模块的路径可能采用相对于 `context` 的路径来描述，`context` 会影响到这些相对路径所指向的真实文件。

## 入口文件

`entry` 配置项用于定义应用程序的入口文件。

### 单入口语法

配置语法：

```ts
entry: string | [string];
```

配置示例：

```js
module.exports = {
  entry: './path/to/my/entry/file.js',
};
```

<br />

```js
module.exports = {
  entry: {
    main: './path/to/my/entry/file.js',
  },
};
```

<br />

```js
module.exports = {
  entry: ['./src/file_1.js', './src/file_2.js'],
  output: {
    filename: 'bundle.js',
  },
};
```

当你希望通过一个入口（例如一个库）为应用程序或工具快速设置 webpack 配置时，单一入口的语法方式是不错的选择。然而，使用这种语法方式来扩展或调整配置的灵活性不大。

### 多入口语法

配置多个入口，每个入口声称一个 Chunk 块。

> 如果传入一个字符串或字符串数组，`chunk` 会被命名为  <strong style="color:red">main</strong>。如果传入一个对象，则每个键（key）为 <strong style="color:red">chunk</strong> 的名称，该值描述了 **chunk** 的入口起点。
>
> - 如果 `entry` 是一个 `string` 或 `array`，就只会声称一个 Chunk，这时 Chunk 的名称是 `main`
> - 如果 `entry` 是一个 `object`，就可能会出现多个 Chunk，这时 Chunk 的名称是 `object` 键值中键的名称

配置语法：

```ts
entry: { <entryChunkName> string | [string] } | {}
```

描述符：

| 描述符       | 说明                                                              |
| :----------- | :---------------------------------------------------------------- |
| `dependOn`   | 当前入口所依赖的入口，它们必须在该入口被加载前被加载              |
| `filename`   | 指定要输出的文件名称                                              |
| `import`     | 启动时需要加载的模块                                              |
| `library`    | 为当前 `entry` 构建一个 `library`                                 |
| `runtime`    | 运行时 `chunk` 名称，如果设置了，就会创建一个新的运行时 `chunk`   |
| `publicPath` | 当该入口的输出文件在浏览器中被引用时，为它们指定一个公共 URL 地址 |

配置示例：

```js
module.exports = {
  entry: {
    home: './home.js',
    shared: ['react', 'react-dom', 'redux', 'react-redux'],
    catalog: {
      import: './catalog.js',
      filename: 'pages/catalog.js',
      dependOn: 'shared',
    },
    personal: {
      import: './personal.js',
      filename: 'pages/personal.js',
      dependOn: 'shared',
      chunkLoading: 'jsonp',
      layer: 'name of layer', // set the layer for an entry point
    },
  },
};
```

说明：

- 默认情况下，入口 `chunk` 的输出文件名是从 `output.filename` 中提取的，但你可以为特定的入口指定一个自定义的输出文件名。

注意：

- `runtime` 和 `dependOn` 不应在同一个入口上同时使用
- 确保 `runtime` 不能指向已存在的入口名称
- `dependOn` 不能是循环引用的

> **Webpack 配置的可扩展** 是指，这些配置可以重复使用，并且可以与其他配置组合使用。这是一种流行的技术，用于将关注点从环境(environment)、构建目标(build target)、运行时(runtime)中分离。然后使用专门的工具（如 [webpack-merge](https://github.com/survivejs/webpack-merge)）将它们合并起来。

#### 共享模块

默认情况下，每个入口 `chunk` 保存了全部其用的模块。使用 `dependOn` 选项你可以与另一个入口 `chunk` 共享模块。

配置示例：

```js
module.exports = {
  entry: {
    app: { import: './app.js', dependOn: 'react-vendors' },
    'react-vendors': ['react', 'react-dom', 'prop-types'],
  },
};
```

示例说明：

`app` 这个 `chunk` 就不会抱憾 `react-vendors` 拥有的模块了。

其他示例：

```js
module.exports = {
  //...
  entry: {
    moment: { import: 'moment-mini', runtime: 'runtime' },
    reactvendors: { import: ['react', 'react-dom'], runtime: 'runtime' },
    testapp: {
      import: './wwwroot/component/TestApp.tsx',
      dependOn: ['reactvendors', 'moment'],
    },
  },
};
```

### 动态入口语法

如果传入一个函数，那么它将会在每次 `make` 事件中被调用。`make` 事件在 Webpack 启动和每当监听文件变化时都会触发。

配置示例：

```js
// 同步函数
module.exports = {
  // ...
  entry: () => './demo',
};
```

<br />

```js
// 异步函数
module.exports = {
  entrt: () =>
    new Promise((resolve) => {
      resolve({
        a: './page/a',
        b: './page/b',
      });
    }),
};
```

<br />

```js
module.exports = {
  entry() {
    // 返回一个会被用像 ['src/main-layout.js', 'src/admin-layout.js'] 的东西 resolve 的 promise
    return fetchPathsFromSomeExternalSource();
  },
};
```
