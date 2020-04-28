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