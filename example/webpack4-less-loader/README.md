# webpack4-less-loader

安装依赖：

```bash
npm install less less-loader -D
```

与 webpack4-css-loader 操作基本一致，只是 module rules 检测的是 `.less` 为文件后缀的文件

同时，在文件处理中 `style-loader` 和 `css-loader` 后添加 `less-loader`

最后构建：

```bash
npm run build
```
