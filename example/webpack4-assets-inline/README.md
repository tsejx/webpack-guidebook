# webpack4-assets-inline

 资源内联的意义：

 代码层面：

- 页面框架的初始化脚本
- 上报相关打点
- CSS 内敛避免页面闪动

请求层面：减少 HTTP 网络请求数

- 小图片或者字体内联（url-loader）

## HTML 和 JS 内联

raw-loader 内联 html

```html
<script>${require('raw-loader!babel-loader!./meta.html')}</script>
```

raw-loader 内联 JS

```html
<script>${require('raw-loader!babel-loader!../node_modules/lib-flexible')}</script>
```

## CSS 内联

方案一：借助 style-loader

方案二：`html-inline-css-webpack-plugin`