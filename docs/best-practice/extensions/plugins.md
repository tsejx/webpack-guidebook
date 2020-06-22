---
nav:
  title: 最佳实践
  order: 3
group:
  title: 扩展资料
  order: 3
title: 插件合集
order: 3
---

# 插件合集

## HTML

- `html-webpack-plugin`
- `favicons-webpack-plugin`：能够生成 favicon
- `script-ext-html-webpack-plugin`：使您可以更好地控制 `script` 标签，并允许您进一步调整脚本的加载
- `style-ext-html-webpack-plugin`：将 CSS 引用转换为内联 CSS，这项技术可以把那些重要的 CSS 作为初始内容的一部分发送给客户端
- `resource-hints-webpack-pliugin`：为您的 HTML 文件添加资源提示，以提升加载速度
- `preload-webpack-plugin`：支持脚本的 `rel=preload` 属性并有助于懒加载，并且它与本书 `构建` 部分中讨论的技术能够很好地结合
- `webpack-cdn-plugin`：允许您指定哪些依赖项通过 CDN（内容交付网络）加载，这种技术常用于加载流行库
- `dynamic-cdn-webpack-plugin` 实现了类似 `webpack-cdn-plugin` 的功能

## 开始常用插件

- `case-sensitive-paths-webpack-plugin`：当你在不区分大小写的环境（如 macOS 或 Windows）下开发，但生产部署是用像 Linux 这样的区分大小写的环境时，这个插件会非常的方便
- `npm-install-webpack-plugin`：当您在项目里导入新的包时，这个插件会自动为您安装这个包，并在 `package.json` 中保存依赖
- `react-dev-utils`：包含为 Create React App 开发的 Webpack 使用程序。尽管它的名字含有 React，但它的用途不限于 React。如果只想要格式化的 WEbpack 信息，可以考虑 `webpack-format-messages`
- `start-server-webpack-plugin`：能够在 Webpack 构建完成后启动您的服务器

## 输出相关插件

- `system-bell-webpack-plugin`：失败时响铃，而不是让 Webpack 无声地失败
- `webpack-notifier`：使用系统通知来通知你 Webpack 的状态
- `nyan-progress-webpack-plugin`：可用于在构建过程中获得更整洁的输出。如果您使用像 Travis 这样的持续集成（CI）系统，请小心，因为它们可能破坏输出结果。Webpack 提供的 ProgressPlugin 也可以达到同样的效果
- `friendly-errors-webpack-plugin`：改进了 Webpack 的错误报告，它捕获常见错误并以更友好的方式显示它们。
- `webpack-dashboard`：在标准 Webpack 输出上提供了一个完整的基于终端的仪表板。如果你喜欢清晰的视觉输出，这个就派上用场了。

## 文件操作

- `clean-webpack-plugin`：清理构建目录
- `copy-webpack-plugin`：复制文件

## 其他插件

- `git-revision-webpack-plugin`
- `write-file-webpack-plugin`
- `error-overlay-webpack-plugin`：更好地显示错误的起源
- `compression-webpack-plugin` - gzip 压缩插件
- `webpack-manifest-plugin` - 缓存配置插件
- `chunk-manifest-webpack-plugin` - 缓存配置相关插件
- `webpack-parallel-uglify-plugin` - JavaScript 压缩插件
- `optimize-css-assets-webpack-plugin` - CSS 压缩插件
- `mini-css-extract-plugin` - CSS 压缩插件
- `extract-text-webpack-plugin` - CSS 压缩插件
- `open-browser-webpack-plugin` - 项目启动自动打开浏览器

## 内置插件

- `webpack.BannerPlugin`
- `webpack.DefinePlugin`
