---
nav:
  title: 基本综述
  order: 1
group:
  title: 核心概念
  order: 2
title: resolve 解析
order: 5
---

# resolve 解析

[Resolve](https://webpack.js.org/configuration/resolve/)

用于配置 Webpack 如何寻找模块所对应的文件。默认采用模块化标准里约定的规则寻找，但是我们也可以自定义。

## 別名

`resolve.alias` 配置项通过别名来将原导入路径映射成一个新的导入路径。

## 引入字段

有些第三方模块会针对不同环境提供几份代码。例如分别采用了 ES5 和 ES6 的两份代码，这两份代码的位置写在 `package.json` 文件里。

```js
{
    "jsnext:main": "es/index.js", // 采用 ES6 语法的代码入口文件
    "main": "lib/index.js" // 采用 ES5 语法的代码入口文件
}
```

Webpack 会根据 mainFields 的配置去决定优先采用哪份代码。默认如下：

```js
mainFields: ['browser', 'main'];
```

Webpack 会按照数组顺序在 `package.json` 文件里寻找，只会使用找到的第一个文件。

## 自动解析确定的扩展 extensions

导入语句没带文件后缀时，Webpack 会自动带上后缀后去尝试访问文件是否存在。

该配置用于配置在尝试过程中用到的后缀列表。

默认：`extensions: ['.js', '.json']`

寻找顺序：`./data.js` => `./data.json`

## 搜索目录

配置从哪个目录下寻找第三方模块，默认值回去 `node_modules` 目录下寻找。

有时我们的项目里会有一些模块被其他模块大量依赖和导入，由于其他模块的位置不定，针对不同的文件都要计算被导入的模块文件的相对路径 ，这个路径有时会很长，就像 `import '../../../components/button'`，这时可以利用 modules 配置项优化 。假如那些被大量导入的模块都在 `./ src/components` 目录下，则将 modules 配置成 `modules : ['./ src/cornponents', 'node modules']` 后，可以简单地通过 `import 'button'` 导入 。

## 用于描述的 JSON 文件

描述第三方模块的文件名称，也就是 `package.json`。默认 `descriptionFiles: ['package.json']`

## enforceExtension

如果配置为 `true`，则导入语句都必须带文件后缀。

## enforceModuleExtension

与 `enforceExtension` 相似，但只对 `node_modules` 下的模块生效。
