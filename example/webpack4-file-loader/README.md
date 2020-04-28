# webpack4-file-loader

安裝依赖：

```bash
npm install file-loader
```

添加解析器：

```js
module: {
  rules: [
    {
      test: /.(woff|woff2|eot|ttf|otf)$/,
      use: 'file-loader',
    },
  ];
}
```

图片和字体除了 file-loader 也能用 url-loader 处理
