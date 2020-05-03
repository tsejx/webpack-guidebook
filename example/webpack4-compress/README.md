# webpack4-compress

安装依赖：

```bash
npm install optimize-css-assets-webpack-plugin cssnano html-webpack-plugin -D
```

使用到的压缩工具：

- JS：uglify-js
- CSS：
  - optimize-css-assets-webpack-plugin
  - cssnano
- HTML：html-webpack-plugin

## 拆分多個 CSS

目前 mini-css-extract-plugin 不支持拆分一一对应的多个 CSS 文件，需要使用 `extract-text-webpack-plugin` 支持该功能。