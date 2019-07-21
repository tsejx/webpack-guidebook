# Tree Shaking

ES6 的模块引入是静态分析的，故而可以在编译时正确判断到底加载了什么代码

分析程序流，判断哪些变量未被使用、引用，进而删除此代码

减少代码包的体积意味着减少每次网络传输的耗时，对用户体验有比较大的提升。

对于一个包管理工具来说，DCE 是必不可少的 feature 之一。

Webpack 的 DCE 通过 UglifyJS 完成，而 TreeShaking 则是在打包的时候，通过模块之间的信息打包必须的代码。

webpack-deep-scope-plugin

合理模块设计才是减少代码体积的关键

TreeShaking 其实只是一个打包器的特性，良好的模块拆分才是减少代码体积的关键。

对于 ES6 模块来说，会有 _default export_ 和 _named export_ 的区别。有些开发者喜欢把所有东西都弄成一个对象塞到 default 里面。_default export_ 在概念上来说并不仅仅一个名字叫做 default 的 export，虽然它会被这样转译。把一切东西都塞到 default 里面是一个错误的选择，会让 TreeShaking 无效。从语意上上来说，_default export_ 用来说明这个模块是什么，_named export_ 用来说明这个模块有什么。合理的模块拆分是一定可以让编译器只打包到所需的代码的。

- 使用 ES6 Module：不仅是项目本身，引入的库最好也是 es 版本，比如用 lodash-es 代替 lodash。另外注意 TypeScript 和 Babel 的配置是否会把代码编译成非 es module 版本。
- 最纯函数调用使用 PURE 注释：由于无法判断副作用，所以对于导出的函数调用最好使用 PURE 注释，不过一般来说有个相关的 babel 插件自动添加。

---

**参考资料：**

- [Tree Shaking versus dead code elimination](https://medium.com/@Rich_Harris/tree-shaking-versus-dead-code-elimination-d3765df85c80)
- [Tree Shaking](https://webpack.js.org/guides/tree-shaking/)
