# webpack4-treeshaking-class-test-demo

打包构建后，在构建产物搜索 `foo` 和 `bar` 均能找到对应方法，但是在 `index.js` 中只使用了 `foo` 方法，而 `bar` 方法没有被使用，但是其在 Util 类中，所以不会被删除。