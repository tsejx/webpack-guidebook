## Performance 性能

用于控制 webpack 如何通知「资源（asset）和入口起点超过指定文件限制」

* `hints` - 打开/关闭提示 （默认 `warning`）
* `maxEntrypointSize`  - 根据入口起点的最大体积，控制 webpack 何时生成性能提示（默认 `250000` bytes）
* `maxAssetSize` - 根据单个资源体积，控制 webpack 何时生成性能提示（默认 `250000` bytes）
* `assetFilter` - 允许 webpack 控制用于计算性能提示的文件

