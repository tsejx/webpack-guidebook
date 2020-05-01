# webpack4-basic-library-demo

webpack 除了可以用来打包应用，也可以用来打包 JS 库

- 需要打包压缩版和非压缩版
- 支持 AMD/CJS/ESM 模块引入

## 库的目录结构和打包要求

打包输出的库的名称：

- 未压缩版：`xx.js`
- 压缩版：`xx.min.js`

## 支持的使用方式

```js
// ES Module
import * as largeNumber from 'large-number'
largeNumber.add('999', '1')


// CJS
const largeNumbers = require('large-number');
largeNumber.add('999', '1')

// AMD
require(['large-number'], function(large-number) {
    largeNumber.add('999', '1')
})
```

支持 script 引入：

```html
<script src="https://unpkg.com/large-number"></script>
<script type="text/javascript">
  // Global Variable
  largeNumber.add('999', '1');

  // Property in the window object
  window.largeNumber.add('999', '1');
</script>
```

## 如何将库暴露出去

library： 指定库的全局变量

libraryTarget：支持库的引入方式

```js
module.exports = {
  mode: 'production',
  entry: {
    'large-number': './src/index.js',
    'large-number.min': './src/index.js',
  },
  output: {
    filename: '[name].js',
    library: 'largeNumber',
    libraryExport: 'default',
    libraryTarget: 'umd',
  },
};
```

