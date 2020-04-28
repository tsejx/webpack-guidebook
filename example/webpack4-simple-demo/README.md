# webpack4-simgple-demo

安装依赖

```bash
npm install webpack webpack-cli -D
```

## 直接打包

```bash
# 执行打包
./node_modules/.bin/webpack
```

## 用 npm script 运行 webpack

在 package.json 的 scripts 添加

```json
{
  "scripts": {
    "build": "webpack"
  }
}
```

执行打包

```bash
npm run build
```
