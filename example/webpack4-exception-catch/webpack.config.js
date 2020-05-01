'use stritc';

const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  plugins: [
    function() {
      this.hooks.done.tap('done', stats => {
        console.log('--------DONE---------');
        // 构建错误会执行下面这段代码
        if (
          stats.compilation.errors &&
          stats.compilation.errors.length &&
          process.argv.indexOf('--watch') == -1
        ) {
          console.log('build error');
          process.exit(1);
        }
      });
    },
  ],
};
