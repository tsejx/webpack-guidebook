---
nav:
  title: 原理分析
  order: 2
group:
  title: 工作原理
  order: 1
title: 文件指纹策略
order: 7
---

# 文件指纹策略

按照现在构建方式，它使用的文件名是有问题的。它无法有效利用客户端级别的缓存，因为无法判断文件是否已更改。可以通过在文件名中包含哈希来实现缓存失效。

## 占位符

Webpack 为此提供**占位符**。这些字符串用于将特定信息附加到 Webpack 输出。

最有价值的是：

- `[hash]`：和整个项目的构建相关，只要项目文件有修改，整个项目构建的 hash 值就会更改
- `[chunkhash]`：和 Webpack 打包的 chunk 有关，不同的 entry 会生成不同的 chunkhash 值
- `[contenthash]`：根据文件内容来定义 Hash，文件内容不变，则 contenthash 不变

hash 和 chunkhash 仅用于生产目的，因为哈希值在开发期间没有太大的用处。

> 我们可以使用特定的语法，对 `hash` 和 `chunkhash` 进行切片：`[chunkhash:4]`，像 `8c4cbfdb91ff93f3f3c5` 这样的哈希会最后会变为 `8c4c`。

其他占位符的含义：

| 占位符          | 含义                             |
| --------------- | -------------------------------- |
| `[ext]`         | 资源后缀名                       |
| `[name]`        | 文件名称                         |
| `[path]`        | 文件的相对路径                   |
| `[folder]`      | 文件所在的文件夹                 |
| `[contenthash]` | 文件的内容 hash，默认是 md5 生成 |
| `[hash]`        | 文件内容的 hash，默认是 md5 生成 |
| `[emoji]`       | 一个随机的指代文件内容的 emoji   |

## 配置示例

```js
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[chunkhash:4].js',
    chunkFilename: '[name].[chunkhash:4].js',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:4].css',
    }),
  ],
};
```
