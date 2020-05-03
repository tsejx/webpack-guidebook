module.exports = class MyPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.plugin('compile', function(params) {
      console.log('开始编译：`compile` event was executing');
    });

    compiler.plugin('compilation', function(compilation) {
      console.log('编译器对编译ING这个事件进行监听：`compliation` event was executing');
      // 在COmpilation事件监听中，我们可以访问Compilation引用，它是一个代表编译过程的对象引用
      // 我们一定要区分 Compiler 和 Compilation，一个代表编译器实体，一个代表编译过程
      compilation.plugin('optimize', function() {
        console.log('编译过程对优化文件这个事件的监听：`compilation.optimize` event was executing');
      });
    });

    compiler.plugin('emit', function(compilation, callback) {
      compilation.chunks.forEach(function(chunk) {
        // 最终生成文件的集合
        chunk.files.forEach(function(file) {
          const source = compilation.assets[file].source();
          compilation.assets[file].source = function() {
            console.log('Here am I!');
          };
        });
      });

      // 必须调用
      callback();
    });
  }
};
