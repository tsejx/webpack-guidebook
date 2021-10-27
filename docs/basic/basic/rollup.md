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

## 插件

Rollup 官方提供了用于构建的插件：[rollup-plugin](https://github.com/rollup/plugins)

| 插件                                                                        | 说明                                                                                      |
| :-------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------- |
| [alias](packages/alias)                                                     | Define and resolve aliases for bundle dependencies                                        |
| [auto-install](packages/auto-install)                                       | Automatically install dependencies that are imported by a bundle                          |
| [babel](https://github.com/rollup/plugins/tree/master/packages/babel)       | Compile your files with Babel                                                             |
| [beep](packages/beep)                                                       | System beeps on errors and warnings                                                       |
| [buble](https://github.com/rollup/plugins/tree/master/packages/buble)       | Compile ES2015 with buble                                                                 |
| [commonjs](https://github.com/rollup/plugins/tree/master/packages/commonjs) | Convert CommonJS modules to ES6                                                           |
| [data-uri](packages/data-uri)                                               | Import modules from Data URIs                                                             |
| [dsv](packages/dsv)                                                         | Convert .csv and .tsv files into JavaScript modules with d3-dsv                           |
| [html](packages/html)                                                       | Create HTML files to serve Rollup bundles                                                 |
| [image](packages/image)                                                     | Import JPG, PNG, GIF, SVG, and WebP files                                                 |
| [inject](packages/inject)                                                   | Scan modules for global variables and injects `import` statements where necessary         |
| [json](packages/json)                                                       | Convert .json files to ES6 modules                                                        |
| [legacy](packages/legacy)                                                   | Add `export` declarations to legacy non-module scripts                                    |
| [multi-entry](packages/multi-entry)                                         | Use multiple entry points for a bundle                                                    |
| [node-resolve](packages/node-resolve)                                       | Locate and bundle third-party dependencies in node_modules                                |
| [replace](packages/replace)                                                 | Replace strings in files while bundling                                                   |
| [run](packages/run)                                                         | Run your bundles in Node once they're built                                               |
| [strip](packages/strip)                                                     | Remove debugger statements and functions like assert.equal and console.log from your code |
| [sucrase](packages/sucrase)                                                 | Compile TypeScript, Flow, JSX, etc with Sucrase                                           |
| [typescript](packages/typescript)                                           | Integration between Rollup and Typescript                                                 |
| [url](packages/url)                                                         | Import files as data-URIs or ES Modules                                                   |
| [virtual](packages/virtual)                                                 | Load virtual modules from memory                                                          |
| [wasm](packages/wasm)                                                       | Import WebAssembly code with Rollup                                                       |
| [yaml](packages/yaml)                                                       | Convert YAML files to ES6 modules                                                         |

## 参考资料

- [📖 roolup.js 中文文档](https://www.rollupjs.com/guide/en)
- [📝 关于 Rollup 那些事](https://juejin.im/post/5adc7f915188256715473cea)
- [📝 10 分钟快速入门 Rollup](https://juejin.im/post/5bed8b26e51d4560336ca5b3)
