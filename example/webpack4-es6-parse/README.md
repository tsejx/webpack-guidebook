# webpack4-es6-parse

## 安装依赖

安装 `@babel/core`、`@babel/preset-env` 和 `babel-loader`

```bash
npm install @babel/core @babel/preset babel-loader -D
```

## 配置 babel

配置 `.babelrc`

```json
{
  "presets": ["@babel/preset-env"]
}
```

## 执行

```bash
npm run build
```

## babel-loader 缓存

二次构建时，babel-loader 转换将会缓存

```js
'babel-loader?cacheDirectory=true';
```
