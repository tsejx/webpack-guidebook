## Framework

* React
* Vue
* Angular

### React

需要 babel 转换 JSX 格式代码，通过插件 `babel-preset-react` 实现。

```json
// .babelrc
{
    "presets": [
        "react"
    ]
}
```

### Vue

渐进式 MVVM 框架。

**接入 Webpack：**

```js
// webpack.config.js
module.export = {
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: ['vue-loader']
            }
        ]
    }
}
```

**安装需要的库：**

```bash
npm install vue-loader css-loader vue-template-compiler
```

* vue-loader - 解析和转换 vue 文件，提取出其中的逻辑代码 `script`、样式代码 `style` 及 HTML 模版 `template`，然后分别处理
* css-loader - 加载 vue-loader 提取出来的 css 代码
* vue-template-compiler - 将 vue-loader 提取出的 HTML 模板编译成对应的可执行的 JavaScript 代码，这和  React 中的 JSX 语法被编译成 JavaScript 代码类 似 。 预先编译好 HTML 模板相对于在浏览器中编译 HTML 模板，性能更好 。 