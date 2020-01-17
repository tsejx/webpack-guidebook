# 理想化配置

配置多份 Webpack 配置，通过 `webpack-merge` 合并。

```js
├── common.js
├── dll.config.js
├── webpack.base.config.js
├── webpack.dev.config.js
├── webpack.prod.config.js
// etc 同构配置，node middleware 等等
```

通过 `npm scripts` 执行 Webpack 命令。

```js
{
  "scripts": {
    "dev": "webpack-dev-server --config ./webpack.dev.config.js",
    "build": "webpack --config ./webpack.prod.config.js",
    "start": "npm run dev",
    "pre": "webpack --config ./dll.config.js"
  },
}
```

优化特点：

* 公共变量，公共配置抽离，方便以后进行开发的人进行修改配置
* 方便开发人员查看配置，不用手动输入 `node_modules/.bin/webpack-dev-server`，`npm scripts` 会自动把 `node_modules/.bin` 下的指令添加到环境中
* 易扩展，如果需要新增配置文件，如同构配置，node middleware 配置，只需添加新配置文件，合并公有部分

## 开发阶段

* 自动打开浏览器
* 自动刷新 => 模块热更新

