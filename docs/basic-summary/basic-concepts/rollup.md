---
nav:
  title: 基本综述
  order: 1
group:
  title: 基本概念
  order: 1
title: Rollup
order: 5
---

# Rollup

Rollup 可以将我们自己编写的 Javascript 代码（通过插件可以支持更多语言，如 Tyepscript）与第三方模块打包在一起，形成一个文件，该文件可以是一个库（Library）或者一个应用（App），在打包过程中可以应用各类插件实现特定功能。下图揭示了 Rollup 的运行机制：

```jsx | inline
import React from 'react';
import img from '../../assets/basic/rollup-workflow.jpg';

export default () => <img alt="Rollup执行流程" src={img} width={720} />;
```

Rollup 默认采用 ES 模块标准，我们可以通过 [rollup-plugin-commonjs](https://www.npmjs.com/package/@rollup/plugin-commonjs) 插件使之支持 CommonJS 标准。

---

**参考资料：**

- [📖 roolup.js 中文文档](https://www.rollupjs.com/guide/en)
- [📝 关于 Rollup 那些事](https://juejin.im/post/5adc7f915188256715473cea)
- [📝 10 分钟快速入门 Rollup](https://juejin.im/post/5bed8b26e51d4560336ca5b3)
