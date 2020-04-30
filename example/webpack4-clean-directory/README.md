# webpack4-clean-directory

通过 npm scripts 清理构建目录：

```bash
rm -rf ./dist && webpack

rimraf ./dist && webpack
```

## 自动清理构建目录

避免构建前每次都需要手动删除 dist

使用 clean-webpack-plugin，默认会删除 output 指定的输出目录
