---
nav:
  title: 最佳实践
  order: 3
group:
  title: 实战应用
  order: 1
title: 加载字体
order: 4
---

# 加载字体

加载字体与加载图像类似，但它确实带来了独特的挑战。如何知道浏览器支持哪种字体格式？如果要为每个浏览器都提供字体支持，我们要关心四种字体格式。

我们可以为一组特定的浏览器和平台提供字体支持来解决这个问题，其余的可以使用系统字体。

在 Webpack 中您可以通过多种方式解决这个问题。您仍然可以像处理图像一样使用 `url-loader` 和 `file-loader`。但是，字体的 `test` 字段设置往往更复杂，您必须要关心如何查找相关的字体文件。

> [canifont](https://www.npmjs.com/package/canifont) 可以帮助您找出应该支持的字体格式。它接受 `.browserslistrc` 定义，然后根据定义检查每个浏览器的对字体格式的支持情况。

## 选择字体格式

如果排除 Opera Mini，则所有浏览器都支持 `.woff` 格式。它的新版本 `.woff2` 得到了现代浏览器的广泛支持，可以作为一个很好的选择。

在选择格式时，和图片配置一样，您可以依赖 file-loader 和 url-loader 并设置 limit 选项：

```js
{
  test: /\.woff$/,
  use: {
    loader: "url-loader",
    options: {
      limit: 50000,
    }
  }
}
```

还可以设置一个更精细的规则来实现类似的结果，匹配了以 `.woff2` 和一些特定结尾的字体文件：

```js
{
  // 除了 .woff?v=1.1.1 这样的格式以外，还要匹配 woff2.
  test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
  use: {
    loader: "url-loader",
    options: {
      // 限制为 50k. 超过它就生成独立的文件
      limit: 50000,

      // 设置 mimetype
      // 如果没有这一项，默认会根据文件扩展名来获取
      mimetype: "application/font-woff",

      // 输出字体到文件夹
      name: "./fonts/[name].[ext]",
    }
  },
},
```

## 支持多种格式

如果您想确保网站在绝大多数的浏览器上看起来很好，您可以使用 `_file-loader_` 而不是内联。再次，这是一个权衡，因为你得发出额外的请求，但也许这是正确的举措。这里是一个 loader 配置：

```js
{
  test: /\.(ttf|eot|woff|woff2)$/,
  use: {
    loader: "file-loader",
    options: {
      name: "fonts/[name].[ext]",
    },
  },
}
```

编写 CSS 规则的方式很重要，为了确保您从较新的格式中获益，它们应该成为定义中的第一个。这样浏览器就可以优先使用它们。

```css
@font-face {
  font-family: 'myfontfamily';
  src: url('./fonts/myfontfile.woff2') format('woff2'), url('./fonts/myfontfile.woff') format('woff'),
    url('./fonts/myfontfile.eot') format('embedded-opentype'), url('./fonts/myfontfile.ttf') format('truetype');
  /* 还可以添加你认为合适的其他格式 */
}
```

[MDN 详细讨论了 font-family 规则](https://developer.mozilla.org/en/docs/Web/CSS/@font-face)

## 操作输出路径和公共资源路径

如 webpack 问题跟踪 和上面所谈到的那样，file-loader 允许对输出进行调整。这样，您可以把字体文件输出到 fonts/ 下，把图像输出到 images/ 下，甚至可以把它们放到根路径下。

此外，我们还可以操作 publicPath，覆盖每个 loader 的默认定义。下面的例子展示了如何将这些技术结合在一起：

```js
{
  // 除了 .woff?v=1.1.1 这样的格式以外，还要匹配 woff2.
  test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
  use: {
    loader: "url-loader",
    options: {
      limit: 50000,
      mimetype: "application/font-woff",
      name: "./fonts/[name].[ext]", // 输出到 ./fonts
      publicPath: "../", // 输出时基于这个目录
    },
  },
},
```

## 基于 SVG 生成字体文件

如果您更喜欢基于 SVG 的字体，可以使用 [webfonts-loader](https://www.npmjs.com/package/webfonts-loader) 将它们打包为单个字体文件。

## 使用 Google 字体

[google-fonts-webpack-plugin](https://www.npmjs.com/package/google-fonts-webpack-plugin) 可以将 Google 字体下载到 Webpack 构建目录或使用 CDN 连接到它们。

## 使用字体图标

[iconfont-webpack-plugin](https://www.npmjs.com/package/iconfont-webpack-plugin) 旨在简化加载字体图标。它在 CSS 文件中的通过内联的方式引用 SVG。
