# webpack4-ssr-demo

## 服务端渲染（SSR）

渲染：HTML + CSS + JS + Data -> 渲染后的 HTML

服务端：

- 所有模块等资源都存储在服务端
- 内网及其拉取速度更快
- 单个 HTML 返回所有数据

## 客户端渲染 vs 服务端渲染

- 客户端渲染
  - 请求：多个请求（HTML、数据等）
  - 加载过程：HTML&数据串行加载
  - 渲染：前端渲染
- 服务端渲染
  - 请求：1 个请求
  - 加载过程：1 个请求返回 HTML&数据
  - 渲染：服务端渲染

总结：服务端渲染（SSR）的核心是减少请求

SSR 优势：

- 减少白屏时间
- 对于 SEO 友好

## 实现思路

服务端

- 使用 `react-dom/server` 的 renderToString 方法将 React 组件渲染成字符串
- 服务端路由返回对应的模块

客户端

- 打包出针对服务端的组件

## webpack ssr 打包存在的問題

浏览器的全局变量（Node.js 中没有 document、window）

- 组件适配：将不兼容的组件根据打包环境进行适配
- 请求适配：将 fetch 或者 ajax 发送请求的写法改成 isomorphic-fetch 或者 axios

样式问题（Node.js 无法解析 CSS）

- 方案一：服务端打包通过 ignore-loader 忽略掉 CSS 的解析
- 方案二：将 style-loader 替换成 isomorphic-style-loader

## 如何解决样式不显示的问题

使用打包出来的浏览器端 HTML 为模版

设置占位符，动态插入组件

## 启动项目

```bash
node server/index.js
```

浏览器打开 `localhost:4321/index`
