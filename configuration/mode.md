# mode 模式

🎉 Webpack4+ 支持该配置

**作用：** 省去一些不必要的配置（如何要实现精细化的控制，还是需要自定义配置文件）

## development

**开启开发模式。**

✨**新特性：**

- 方便于浏览器调试的工具；
- 可以快速地对增加的内容进行编译；
- 提供了更精确、更有用的运行时错误提示机制

🛠 **功能：**

- 自动设置 `process.env.NODE_ENV = development`
- 启用 NamedChunksPlugin 和 NamedModulesPlugin 为所有的模块（源文件）和块（构建输出的文件）定义一个名字

## production

**生产模式。**

✨**新特性：**

- 自动压缩构建输出的文件
- 快速的运行时处理
- 不暴露源代码和源文件的路径
- 快速的静态资源输出

🛠 **功能：**

- 自动设置 `process.env.NDOE_ENV`
- 启用插件（最后一个为非内置插件）
  - FlagDependencyUsagePlugin：检测并标记模块之间的从属关系
  - FlagIncludeChunksPlugin：可以让 Webpack 根据模块间的关系依赖图中，将所有的模块连接成一个模块
  - ModuleConcatenationPlugin：告诉 Webapck 去清除一个大的模块文件中的未使用的代码，这个大的文件模块可以是自定义的，也可以是第三方的（注意：一定要 `package.json` 文件中添加 `"sideEffects": false`）
  - NoEmitOnErrorsPlugin
  - OccurrenceOrderPlugin：
  - SideEffectsFlagPlugin：告诉 Webapck 各个模块间的先后顺序，这样可以实现最优的构建输出
  - TerserPlugin：替代 `uglifyjs-webpack-plugin` 插件。它的作用依然是对构建输出的代码进行压缩

## none

**不做任何优化。**
