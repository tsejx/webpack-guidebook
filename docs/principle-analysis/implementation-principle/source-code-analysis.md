---
nav:
  title: 原理分析
  order: 2
group:
  title: 底层原理
  order: 2
title: 源码分析
order: 3
---

# 源码分析

## 执行命令

```bash
npm run dev

npm run build
```

## 查找 webpack 入口文件

在命令行运行以上命令后，npm 会让命令行工具进入 `node_modules/.bin` 目录查找是否存在 webpack.sh 或者 webpack.cmd 文件，如果存在，就执行，不存在，就抛错误。

实际的入口文件是：`node_modules/webpack/bin/webpack.js`

## 分析 webpack 的入口文件

1. 正常执行返回
2. 运行某个命令
3. 判断某个包是否安装
4. webpack 可用的 CLI
5. 判断是否两个 CLI 是否安装
6. 根据安装数量进行处理

## webpack-cli 做的事情

- 引入 yargs 对命令进行定制
- 分析命令行参数，对各个参数进行转换，组成编译配置项
- 引入 webpack，根据配置项进行编译和构建

## 从 NON_COMPILATION_CMD 分析出不需要编译的命令

webpack-cli 处理不需要经过编译的命令

## webpack-cli 使用 args 分析

参数分组（config/config-args.js）将命令划分为 9 类：

- Config options：配置相关参数（文件名称、运行环境等）
- Basic Options：基础参数（entry 设置、debug 模式设置、watch 监听设置、devtool 设置）
- Module options：模块参数，给 loader 设置扩展
- Output options：输出参数（输出路径、输出文件名称）
- Advanced options：高级用法（记录设置、缓存设置、监听频率、bail 等）
- Resolving options：解析参数（alias 和 解析的文件后缀设置）
- Optimizaing options：优化参数
- Stats options：统计参数
- options 通用参数（帮助命令、版本信息等）

## webpack-cli 执行的结果

webpack-cli 对配置文件和命令行参数进行转换最终生成配置选项参数 options

最终会根据配置参数实例化 webpack 对象，然后执行构建流程

## webpack 的本质

可以将其理解为一种基于事件流的编程范例，一系列的插件运行

webpack 启动过程分析
webpack-cli 源码阅读
Tapable 插件架构与 Hooks 设计
Tapable 是如何和 Webpack 进行关联起来的

webpack 流程篇：准备阶段
webpack 流程篇：模块构建和 chunk 生成阶段
webpack 流程篇：文件生成

Module：

- NormalModule：普通模块
  - 使用 loader-runner 运行 loaders
  - 通过 Parser 解析（内部是 acron）
  - ParserPlugins 添加依赖
- ContextModule：`./src/a`、`./src/b`
- ExternalModule：`module.exports = jQuery`
- DelegatedModule：manifest
- MultiModule：`entry: ['a', 'b']`
