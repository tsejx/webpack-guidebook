---
nav:
  title: 最佳实践
  order: 3
group:
  title: 实战应用
  order: 1
title: 加载图片
order: 3
---

# 加载图片

加载大量小的资源会使基于 HTTP/1 的应用变慢，因为每个请求都会产生开销。HTTP/2 在这方面有所改善，并且在某种程度上改变了这种情况。除此之外，Webpack 也有一些解决办法。

Webpack 可以使用 [url-loader](https://www.npmjs.com/package/url-loader) 内联资源。它会将您的图像转为 base64 形式的字符串，从而减少 HTTP 请求，但是它会增加打包结果的尺寸。在开发过程中，我们可以使用这种方式，生产环境可能不太适合。

Webpack 可以控制内联过程，然后使用 [file-loader](https://www.npmjs.com/package/file-loader) 对其延迟加载。file-loader 能够将导入的图片存放到特定的目录，并返回图片的路径地址。此技术适用于其他类型的资源，例如字体，后面的章节也会提到。

## 基本方法

### url-loader

`url-loader` 是一个很好的起点，它是开发环境的完美选择，因为您不必关心生成的 bundle 的大小。它带有一个 limit 选项，当达到绝对限制后将图像交给 file loader 处理。这样，您可以将小文件内联到 JavaScript 包中，同时为较大的文件生成单独的请求地址。

如果要使用 limit 选项，则需要在项目中安装 url-loader 和 file-loader。假设您已正确配置样式，webpack 将解析样式中任何包含 url() 的语句。您也可以通过 JavaScript 代码指向图像资源。

在使用 limit 选项的情况下，url-loader 将可能的附加选项传递给 file-loader，从而可以让 file-loader 进一步配置其行为。

要在内联 25kB 以下的文件时加载 `.jpg` 和 `.png` 文件，您可以这样设置 loader：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(jpg|png)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 25000,
          },
        },
      },
    ],
  },
};
```

> 当 `limit` 限制生效时，如果你想使用另一个 loader，而不是 `file-loader` 的话，你可以在配置中添加 `fallback: "some-loader"`。然后 Webpack 就会使用这个 loader 而不是采取默认行为。

### file-loader

如果要完全跳过内联，可以直接使用 `file-loader`。以下配置自定义了生成的文件名。默认情况下，file-loader 使用文件内容的 MD5 哈希值和扩展名组合称新的文件名：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(jpg|png)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[hash].[ext]',
          },
        },
      },
    ],
  },
};
```

> 如果要将图像输出到特定目录下，请在配置中这样设置 `name: "./images/[hash].[ext]"`。

> 注意不要同时在图像上同时应用两个 loader！如果 url-loader `limit` 不够，请使用 `include` 字段进一步控制。

## 加载 SVG

Webpack 允许几种方式加载 SVG。但是，最简单的方法是通过 `file-loader`：

```js
{
  test: /\.svg$/,
  use: "file-loader",
}
```

现在，我们就可以在文件中引入 SVG 了。下面的 SVG 路径是相对于 CSS 文件的：

```css
.icon {
  background-image: url('../assets/icon.svg');
}
```

我们还可以考虑以下 loader：

- [raw-loader]()：允许访问原始 SVG 内容
- [svg-inline-loader]()：更进一步，消除了 SVG 中不必要的标记
- [svg-sprite-loader]()：可以将小的 SVG 文件合并为一个 sprite 文件，从而可以更有效地加载，因为您可以避免请求开销。它也支持 `.jpg` 和 `.png` 格式的图像
- [svg-url-loader]()：将 SVG 加载为 UTF-8 编码的数据 URL。结果比 Base64 更小，解析更快。
- [react-svg-loader]()：可以将 SVG 作为 React 组件发出，这意味着您可以在代码中导入它们，并可能会以这样的编码形式 `<Image width={50} height={50} />` 来渲染 SVG 元素。

## 优化图像

如果你想压缩图片，请使用 [image-webpack-loader](https://www.npmjs.com/package/image-webpack-loader)、[svgo-loader](https://www.npmjs.com/package/svgo-loader)（专用于 SVG）或 [imagemin-webpack-plugin](https://www.npmjs.com/package/imagemin-webpack-plugin)。注意，此类型的 loader 应用于最终的数据，因此请记住，将其作为 `use` 列表中的最后一个来执行。

压缩对于生产构建特别有价值，因为它减少了下载图像时所需的带宽量，从而加快了站点或应用程序的速度。

## 利用 srcset

[resize-image-loader](https://www.npmjs.com/package/resize-image-loader) 和 [responsevie-loader](https://www.npmjs.com/package/responsive-loader) 允许您为现代浏览器生成 `srcset` 属性所需要的图像集合。`srcset` 属性可以让浏览器决定加载哪些图像以及何时提高性能。

## 加载 Sprite

Spriting 技术允许您将多个较小的图像组合成单个图像。它已经被用于游戏中的动画，但对于 Web 开发也很有价值，因为它节省了很多请求开销。

[webpack-spritesmith](https://www.npmjs.com/package/webpack-spritesmith) 将提供的图像转换为 sprite 图和一些 Sass/Less/Stylus mixin。您必须设置 SpritesmithPlugin 插件，将其指向目标图像，并设置生成的 mixin 的名称。之后，你的 样式就可以使用它了：

## 使用图片占位符

[image-trace-loader](https://www.npmjs.com/package/image-trace-loader) 加载图像并将结果编码为 `image/svg+xml` 格式的 URL 数据。它可以于 `file-loader` 和 `url-loader` 一起使用，以便在加载实际图像时显示占位符。

[lqip-loader](https://www.npmjs.com/package/lqip-loader) 实现了类似的功能，它不显示占位符，而是 i 工一个模糊的图像。

## 获得图像尺寸

有时只获得对图像的引用是不够的。除了返回图像本身的引用之外，[image-size-loader](https://www.npmjs.com/package/image-size-loader) 还会返回图像尺寸、类型和大小。

## 引用图像

如果配置好了 `css-loader`，Webpack 可以通过 `@import` 从样式表中获取图像。JS 代码中也可以引用图像。在这种情况下，您必须在文件中显式地导入：

```js
import src from './avatar.png';

// 在代码中可以使用图片了
const Profile = () => <img src={src} />;
```

如果您使用的是 React，那么您可以使用 [babel-plugin-transform-react-jsx-img-import]() 自动生成 `require`。在这种情况下，您的代码可以精简成下面的样式。

```js
const Profile = () => <img src="avatar.png" />;
```
