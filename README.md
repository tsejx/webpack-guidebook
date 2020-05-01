# Webpack Guidebook

📦A note-book about webpack

## 目录

- **基本综述**
  - **基本概念**
    - [构建工具](modularization/build-tool.md)
    - [模块化](modularization/modularization.md)
    - [理想化配置](modularization/idealized-configuration.md)
  - **核心概念**
    - [mode](configuration/mode.md)
    - [entry](configuration/entry.md)
    - [devServer](configuration/dev-server.md)
    - [output](configuration/output.md)
    - [resolve](configuration/resolve.md)
    - [plugins](configuration/plugins.md)
    - [module](configuration/module.md)
    - [otherOptions](configuration/other-ptions.md)
- **原理分析**
  - **工作原理**
    - [运作机制](mechanism/workflow.md)
    - [Loader 机制](mechanism/loader.md)
    - [Plugin 机制](mechanism/plugin.md)
    - [提取公共代码](mechanism/commons-chunk-plugin)
    - [模块热更新](mechanism/hot-module-replacement)
    - [其他扩展](mechanism/extensions)
  - **实现原理**
    - 自定义 Loader 实现
    - 自定义 Plugin 实现
    - Webpack 打包原理
    - Webpack 打包手写实现
    - Babel 核心 API
    - AST 抽象语法树
- **最佳实践**
  - **实战应用**
    - [优化手段](practice/optimization)
    - [ESlint](practice/ESLint)
    - [Babel](practice/Babel)
    - [Framework](practice/Framework)
    - 构建 React、Vue 开发环境
    - 构建骨架屏应用
    - 构建多页面应用
    - 构建公共组件库
    - 构建 PWA 离线应用
  - **构建优化**
    - 缩小文件的搜索范围优化
    - 使用 HappyPack
    - 使用 DllPlugin
    - 使用 HardSourceWebpackPlugin
    - 开发与生产环境配置
    - 抽离公共代码
    - 压缩代码

插件化设计
https://zhuanlan.zhihu.com/p/26955349
