# webpack4-css-loader

安裝依赖

```bash
npm install css-loader style-loader
```

webpack 中 module rules 中是从右向左编译，所以 css-loader 要写在后，把文件从 css 编译后，插入 html 文档的 style 标签

```js
module: {
rules: [
    {
      test: /.css$/,
      use: ['style-loader', 'css-loader'],
    },
  ],
}
```

运行命令打包

```bash
npm run build
```