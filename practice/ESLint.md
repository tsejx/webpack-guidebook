# ESLint

与 Code Review 相似，但通过机器执行自动化检查成本更低，效率更高。

* 代码风格：让项目成员强制遵守统一的代码风格，例如如何缩进、如何写注释的，保障代码可读性，不讲时间浪费在争论如何让代码更好看上
* 潜在问题：分析代码在运行过程中可能出现的潜在 BUG

## 检查代码方案

按照不同文件类型实施不同检查代码方案。

### JavaScript

社区普遍使用 `ESLint`：

```bash
npm install eslint --save-dev
```

```json
// .eslintrc
{
    // 从 eslint:recommeded 继承所有检查规则
    "extends": "eslint:recommended",
    // 定义规则
    "rules": {
        // 需要在每行结尾加分号
        "semi": ["error", "always"],
        // 需要使用双引号包裹字符
        "quotes": ["error", "double"]
    }
}
```

**结合 Webpack**

```js
module.export = {
    module: {
        rules: [
            {
                test: /\.js$/,
                include: /node_modules/,
                use: [
                    {
                        loader: 'eslint-loader',
                        // 将eslint-loader的执行顺序放在最前面，防止其他 loader 将处理后的代码交给 eslint-loader 去检查
                        enforce: 'pre'
                    }
                ]
            }
        ]
    }
}
```

### TypeScript

```json
npm install tslint --save-dev
```

**结合 Webpack**

与 eslint-loader 基本一致。

### CSS

```bash
npm install stylelint --save-dev
```

```json
// .stylelintrc
{
    //继承 stylelint-config-standard 中所有的检查规则 ”extends”:”s tylelint-config-standard",
    // 再自定义检查规则
    ” rules ” : {
		”at-rule-empty-line-before”: null
	}
}
```

**结合 Webpack**

StyleLintPlugin 能将 stylelint 整合到 Webpack 中。

```js
const StyleLintPlugin = require('stylelint-webpack-plugin')

module.export = {
    // ...
    plugin: [
        new StyleLintPlugin()
    ]
}
```

## 一些建议

将代码检查功能整合到 Webpack 中会导致以下问题:

* 由于执行检查步骤的计算量大，所以整合到 Webpack 中会导致构建变慢
* 在整合代码检查到 Webpack 后，输出的错误信息是通过行号来定位错误的，没有编辑器集成显示错误直观。

为了避免以上问题，还可以这样做 :

* 使用集成了代码检查功能的**编辑器**，让编辑器实时、直观地显示错误
* 将代码检查步骤放到**代码提交**时，也就是说在代码提交前调用以上检查工具去检查代码，只有在检查都通过时才提交代码，这样就能保证提交到仓库的代码都通过了检查。

如果我们的项目是使用 Git 管理的， 则 Git 提供了 Hook 功能做到在提交代码前触发执行脚本。

