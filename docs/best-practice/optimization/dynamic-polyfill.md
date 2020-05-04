---
nav:
  title: 最佳实践
  order: 3
group:
  title: 构建优化
  order: 2
title: 动态 Ployfill
order: 15
---

# 动态 Ployfill

动态 Polyfill 是根据不同浏览器的特性，载入需要的特性补丁。Polyfill.io 通过尝试使用 polyfill 重新创建缺少的功能，可以轻松地支持不同的浏览器，并且可以大幅度地减少构建体积。

动态 Polyfill 方案对比：

| 方案                           | 优点                                       | 缺点                                                                                                                       | 是否采用 |
| ------------------------------ | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- | -------- |
| babel-polyfill                 | React16 官方推荐                           | 1. 包体积 200K+，难以单独抽离 Map、Set<br/>2. 项目里 React 是单独引用的 CDN，如果要用它，需要单独构建一份放在 React 前加载 | ❌       |
| babel-plugin-transform-runtime | 能只 polyfill 用到的类或方法，相对体积较小 | 不能 polyfill 原型上的方法，不适用于业务项目的复杂开发环境                                                                 | ❌       |
| 自己写 Map、Set 的 Polyfill    | 定制化高，体积小                           | 1. 重复造轮子，容易在日后年久失修成为坑<br/>2. 即使体积小，依然所有用户都要加载                                            | ❌       |
| polyfill-service               | 只给用户返回需要的 polyfill，社区维护      | 部分国内奇葩浏览器 UA 可能无法识别（但可以降级返回所需全部 Polyfill）                                                      | ✅       |

## 使用方法

直接引入代码即可使用默认配置的 Polyfill：

```html
<script crossorigin="anonymous" src="https://polyfill.io/v3/polyfill.min.js"></script>
```

Polyfill.io 通过分析请求头信息中的 UserAgent 实现自动加载浏览器所需的 polyfill。

## 高级用法

Polyfill.io 有一份默认捆绑列表，包括了最常见的 HTML5 中的 `document.querySelector`、`Element.classList`、ES5、ES6、ES7 中的 `Promise`、`fetch`、`Array.from` 等等。

你可以通过传递 `features` 参数来自定义功能列表：

```html
<!-- 加载 Promise&fetch -->
<script src="https://cdn.polyfill.io/v3/polyfill.min.js?features=Promise,fetch"></script>

<!-- 加载所有 ES5&ES6 新特性 -->
<script src="https://cdn.polyfill.io/v3/polyfill.min.js?features=es5,es6,es7"></script>
```

Polyfill.io 还提供了其他 API，具体请查阅官方文档：

```html
<!-- 异步加载 -->
<script src="https://cdn.polyfill.io/v3/polyfill.min.js?callback=main" async defer></script>
<!-- 无视 UA，始终加载 -->
<script src="https://cdn.polyfill.io/v3/polyfill.js?features=modernizr:es5array|always"></script>
```

阿里提供的动态 Polyfill 服务：

```html
<script src="https://polyfill.alicdn.com/polyfill.min.js?features=Promise%2CArray.prototype.includes"></script>
```
