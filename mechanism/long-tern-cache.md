# 持久化缓存

缓存（cache）一直是前端性能优化的重头戏，利用好静态资源的缓存机制，可以使我们的 Web 应用更加快速和稳定。仅仅是简单的资源缓存是不够的，我们需要为不断更新的资源做持久化缓存。

使用 hash 值解决缓存问题

问题：即便内容物修改，hash 仍会变化，因为是计算所有 chunks 的 hash。

每次编译生成一个唯一 hash，适合 chunk 拆分不多的小项目，但所有资源有同一个 hash，无法完成持久化缓存的需求。

chunkhash 为每个项目创建自己的 hash

Webpack 为每个 chunk 资源都生成与其内容相关的 hash 摘要，为不同的资源打上不同的 hash。

contenthash 专业为 css 配置 hash 值

`extract-text-plugin` 为抽离出来的内容提供了 contenthash

构建出来的代码中，每个入口的文件都隐藏一个 ID，每个 module.id 会基于默认的解析顺序（resolve order）进行增量。

也就是，解析顺序发生变化，ID 也会随之改变，所以 hash 值也会发生变化。

模块的增减或者引用权重的变更肯定会导致 ID 的变更，我们需要再找一个能保持唯一性的内容，并在构建期间进行 ID 订正。

使用路径替代 module.id => 内置插件 NamedModulesPlugin
