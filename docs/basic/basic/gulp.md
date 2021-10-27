---
nav:
  title: 基本综述
  order: 1
group:
  title: 基本概念
  order: 1
title: Gulp
order: 4
---

# Gulp

Gulp 与 Grunt 一样，也是一个 **自动任务运行器**。它充分借鉴了 Unix 操作系统的管道（pipe）思想，很多人认为，在操作上，它要比 Grunt 简单。

Gulp 采取了不同的策略。您不必依赖每个插件的配置，而是处理实际代码。通过 `sources` 匹配文件，`filters` 来操作这些文件，以及 `sinks` 传入管道构建结果。

代码示例：

```js
const gulp = require('gulp');
const coffee = require('gulp-coffee');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');

const paths = {
  scripts: ['client/js/**/*.coffee', '!client/external/**/*.coffee'],
};

// Not all tasks need to use streams.
// A gulpfile is another node program
// and you can use all packages available on npm.
gulp.task('clean', () => del(['build']));
gulp.task(
  'scripts',
  ['clean'],
  () =>
    // Minify and copy all JavaScript (except vendor scripts)
    // with source maps all the way down.
    gulp
      .src(paths.scripts) // 读取源文件
      // Pipeline within pipeline
      .pipe(sourcemaps.init())
      .pipe(coffee())
      .pipe(uglify())
      .pipe(concat('all.min.js'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('build/js')) // 写到 dist 文件夹中
);
gulp.task('watch', () => gulp.watch(paths.scripts, ['scripts']));

// The default task (called when you run `gulp` from CLI).
gulp.task('default', ['watch', 'scripts']);
```

## 构建工具的对比分析

> Webpack 与 Glup / Grunt 的区别是什么？

其实 Webpack 和另外两个并没有太多的可比性。

- Gulp / Grunt 是一种能够优化前端的开发流程的工具，而 WebPack 是一种模块化的解决方案，不过 Webpack 的优点使得 Webpack 在很多场景下可以替代 Gulp / Grunt 类的工具
- Gulp / Grunt 是基于任务和流的（Task、Stream）。类似于 jQuery 的链式函数的写法，通过一系列链式操作，更新流上的数据，整条链式操作构成了一个任务，多个任务就构成了整个网页应用的构建流程
- Grunt 和 Gulp 的工作方式是：在一个配置文件中，指明对某些文件进行类似编译、组合、压缩等任务的具体步骤，工具之后可以自动替你完成这些任务。

```jsx | inline
import React from 'react';
import img from '../../assets/basic/task-runner-workflow.jpg';

export default () => <img alt="任务运行器执行流程" src={img} width={720} />;
```

- Webpack 是基于入口的。Webpack 会递归解析入口所需要加载的所有资源文件，然后用不同的 Loader 处理不同类型的文件，用 Plugin 扩展 Webpack 的功能。
- Webpack 的工作方式是：把你的项目当做一个整体，通过一个给定的主文件（如：index.js），Webpack 将从这个文件开始找到你的项目的所有依赖文件，使用 loaders 处理它们，最后打包为一个（或多个）浏览器可识别的 JavaScript 文件。

```jsx | inline
import React from 'react';
import img from '../../assets/basic/webpack-workflow.jpg';

export default () => <img alt="Webpack执行流程" src={img} width={720} />;
```

三者都是前端构建工具，Grunt 和 Gulp 在早期比较流行，现在 Webpack 相对来说比较主流，不过一些轻量化的任务还是会用 Gulp 来处理，比如单独打包 CSS 文件等。

## 参考资料

- [📖 Gulp Github Repository](https://github.com/gulpjs/gulp)
- [📖 Gulp 中文文档](https://www.gulpjs.com.cn/)
- [📝 Gulp：任务自动管理工具](https://javascript.ruanyifeng.com/tool/gulp.html)
- [📝 构建工具之间的比较](https://www.timsrc.com/article/48/comparison-of-build-tools)
