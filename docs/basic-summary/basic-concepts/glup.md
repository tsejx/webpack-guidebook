# Glup

Webpack 与 Glup / Grunt 的区别是什么？

三者都是前端构建工具，Grunt 和 Gulp 在早期比较流行，现在 Webpack 相对来说比较主流，不过一些轻量化的任务还是会用 Gulp 来处理，比如单独打包 CSS 文件等。

- Gulp / Grunt 是基于任务和流的（Task、Stream）。类似于 jQuery 的链式函数的写法，通过一系列链式操作，更新流上的数据，整条链式操作构成了一个任务，多个任务就构成了整个 Web 的构建流程
- Webpack 是基于入口的。Webpack 会递归解析入口所需要加载的所有资源文件，然后用不同的 Loader 处理不同类型的文件，用 Plugin 扩展 Webpack 的功能。

构建工具之间的比较
https://www.timsrc.com/article/48/comparison-of-build-tools
