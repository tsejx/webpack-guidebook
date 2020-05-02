# webpack4-eslint-demo

推荐：基于 eslint:recommend 配置并改进

能够帮助发现代码错误的规则，全部开启

帮助保持团队的代码风格统一，而不是限制开发体验

## 如何执行落地

- 和 CI/CD 系统集成
  - 在 CI Pipeline 增加 lint pipline
- 和 Webpack 集成

## 本地开发阶段增加 precommit 钩子

安装 husky

```bash
npm install husky --save-dev
```

增加 npm script，通过 lint-staged 增量检查修改的文件：

```json
{
  "scripts": {
    "precommit": "lint-staged"
  },
  "lint-staged": {
    "linters": {
      "*.{js,scss}": ["eslint --fix", "git add"]
    }
  }
}
```

## WEBPACK 与 ESlint 集成

使用 eslint-loader 构建时检查

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader'],
      },
    ],
  },
};
```
