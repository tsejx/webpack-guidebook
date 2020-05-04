---
nav:
  title: 最佳实践
  order: 3
group:
  title: 构建优化
  order: 2
title: 代码拆分 Code Spliting
order: 12
---

# 代码拆分 Code Spliting

代码拆分的意义：对于大的 Web 应用来讲，将所有的代码都放在一个文件中显然是不够有效的，特别是当你的某些代码块是在某些特殊的时候才会被使用到。Webpack 有一个功能就是将你的代码库分割成 Chunks（语块），当代码运行到需要它们的时候再进行加载。

适用的场景：

- 抽离相同代码到单个共享块
- 脚本懒加载，使得初始加载的文件更小

> 顺便说一下，使用 Webpack 的延迟加载可以实现 Google 的 [PRPL](https://developers.google.com/web/fundamentals/performance/prpl-pattern/) 模式。PRPL（推送，渲染，预缓存，延迟加载）的设计考虑了移动网络。

## 代码拆分格式

我们可以在 Webpack 中以两种主要方式完成代码拆分：

- CommonJS：`require.ensure`
- ES6：动态 `import`（目前还没有原生支持，需要 Babel 转换）

我们的最终目标是得到一个 **按需加载的分割点**。分割内部也可以再次分割，您可以根据分割构建整个应用程序。这样做的好处是，应用程序的初始有效负载会更小。

```jsx | inline
import React from 'react';
import img from '../../assets/performance/code-spliting-chart.png';

export default () => <img alt="webpack-bundle-analyzer-compilation" src={img} width={520} />;
```

## 动态加载

### 动态加载语法

Babel 本身不支持动态 import 语法，它需要 `@babel/plugin-syntax-dynamic-import` 配合才能工作。

```bash
npm install @babel/plugin-syntax-dynamic-import --save-dev
```

ES6 动态 `import`

```json
// .babelrc
{
  "plugins": ["@babel/plugin-syntax-dynamic-import"]
}
```

> 如果您使用的是 ESLint，你需要安装 `babel-eslint`，并且在 ESLint 中设置 `parser: "babel-eslint"`，此外，你还要设置 `parserOptions.allowImportExportEverywhere: true`。

### React 中的代码拆分

代码拆分逻辑可以包装到 React 组件中：

```js
import React from 'react';

// Somewhere in code
<AsyncComponent loader={() => import('./SomeComponent')} />;

class AsyncComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = { Component: null };
  }
  componentDidMount() {
    this.props.loader().then(Component => this.setState({ Component }));
  }
  render() {
    const { Component } = this.state;
    const { Placeholder, ...props } = this.props;

    return Component ? <Component {...props} /> : <Placeholder />;
  }
}
```

> [react-async-component]()