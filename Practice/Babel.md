## Babel

JavaScript 编译器 ES6 => ES5

**使用 ES6 语言：**

* 将新的 ES6 语法用 ES5 实现，例如 ES6 的 class 语法用 ES5 的 prototype 实现
* 为新的 API 注入 polyfill，例如使用新的 fetch API 时在注入对应的 polyfill 后才能让低端浏览器运行

### Plugins

plugins 告诉 babel 使用哪些插件，这些插件可以控制如何转换代码。

以上配置文件里的 `transform-runtime` 对应的插件全名叫作 `babel-plugin­-transform-runtime`，即在前面加上了 `babel-plugin-`。 要让 Babel 正常运行 ，我们必 须先安装这个插件: 

```bash
npm i babel-plugin-transform-runtime --save-dev
```

`babel-plugin-transform-runtime` 是 Babel 官方提供的一个插件，作用是减少冗余的代码。 

同时需要注意的是，由于 `babel-plugin-transform-runtime` 注入了 `require ('babel-runtime/helpers/ extent')` 语句到编译后的代码里，需要安装 `babel­ runtime` 依赖到我们的项目后，代码才能正常运行 。 也就是说 `babel-plugin-transform­-runtime` 和 `babel-runtime` 需要配套使用，在使用 `babel-plugin-transform-runtime` 后一定需要使用 `babel-runtime`。 

### Presets

presets 属性告诉 Babel 要转换的源码使用了哪些新的语法特性，一个 Presets 对一组新语法的特性提供了支持，多个 Presets 可以叠加。 Presets 其实是 一 组 Plugins 的 集合，每个 Plugin 完成一个新语法的转换工作 。 Presets 是按照 ECMAScript 草案来组织的，通常可以分 为以下三 大类 。 

**年度标准**

* ES2015 - 包含2015年加入的新特性
* ES2016 - 包含2016年加入的新特性
* ES2017 - 包含2017年加入的新特性
* env - 包含当前所有 ECMAScript 标准的新特性

**被社区提出未写入标准**

* stage0 一些 Babel 插件实现了对这些特性的支持，但是不确定是否会被定为标准
* stage1 值得被纳入标准的特性
* stage2 已被起草，将被纳入标准里
* stage3 已定稿，各大浏览器厂商和 NodeJS 社区开始着手实现
* stage4 在接下来一年会纳入标准

**支持特定场景的语法特征**

* babel-plugin-react 支持 React 开发里的 JSX 语法
* babel-plugin-import