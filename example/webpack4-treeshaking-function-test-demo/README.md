# wepback4-treeshaking-function-test-demo1

打包后，`index.js` 只有 `foo` 方法被使用到了，而 `bar` 没有，所以 `bar` 在构建过程中被摇树优化了。
