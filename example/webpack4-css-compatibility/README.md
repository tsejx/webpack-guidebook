# webpack4-css-compatibility

- PostCSS 插件 autoprefixer 自动补齐 CSS3 前缀
- 移动端 CSS px 自动转成 rem

## autoprefixer

```bash
npm install postcss-loader autoprefixer
```

## px2rem

W3C 对 rem 的定义：font-size of the root element

rem 和 px 对比：

- `rem` 是相对单位
- `px` 是绝对单位

```bash
npm install px2rem-loader -D

npm install lib-flexible -S
```