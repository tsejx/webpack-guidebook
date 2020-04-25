---
title: module 模块
order: 7
group:
  title: 配置
  order: 2
nav:
  title: 配置
  order: 2
---

# module 模块

[中文文档](https://webpack.docschina.org/configuration/module/)

module 配置处理模块的规则。

## rules

rules 配置模块的读取和解析规则，通常用来配置 Loader。

- **条件匹配**：通过 test、include、exclude 三个配置项来选中 Loader 要应用规则的文件
- **应用规则**：对选中的文件通过 use 配置项来应用 Loader，可以只应用一个 Loader 或者按照从后往前的顺序应用一组 Loader，同时可以分别向 Loader 传入参数
- **重置顺序**：一组 Loader 的执行顺序默认是从右到左执行的，通过 enforce 选项可以将其中一个 Loader 的执行顺序放到最前或最后

```js
module.exports = {
  rules: [
    {
      // 命中 JavaScript 文件
      test: /\.js$/,
      // 用 babel-loader 转换 JavaScript 文件
      // ?cacheDirectory 表示传给 babel-loader 的参数，用于缓存 babel 的编译结果，加快重新编译的速度
      use: ['babel-loader?cacheDirectory'],
      // 只命中 src 目录里的 JavaScript 文件，加快 Webpack 的搜索速度
      include: path.resolve(__dirname, 'src'),
    },
    {
      // 命中 SCSS 文件
      test: /\.scss$/,
      // 使用一组 Loader 去处理 SCSS 文件
      // 处理顺序为从后到前，即先交给 sass-loader 处理，再将结果交给 css-loader，最后交给 style-loader
      use: ['style-loader', 'css-loader', 'sass-loader'],
      // 排除 node_modules 目录下的文件
      exclude: path.resolve(__dirname, 'node_modules'),
    },
    {
      // 对非文本文件采用 file-loader 加载
      test: /\.(gif|png|jpe?g|eot|woff|ttf|svg|pdf)$/,
      use: ['file-loader'],
    },
  ],
};
```

在 loader 需要传入多个参数时，可以通过 Object 来描述。

```js
use: [
  {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
    },
    // enforce: 'post' 的含义是将该 Loader 的执行顺序放到最后
    // enforce 的值还可以是 pre，代表将 Loader 的执行顺序放到最前面
    enforce: 'post',
  },
];
```

test、include、exclude 这三个命中文件的配置项之传入了一个字符串或正则，其实他们也支持数组类型。

```js
{
    test: [
        /\.jsx?$/,
        /\.tsx?$/
    ],
    include: [
		path.resolve(__dirname, 'src'),
        path.resolve(__dirname, 'tests')
	],
    exclude: [
		path.resolve(__driname, 'node_modules'),
        path.resolve(__dirname, 'bower_modules')
	]
}
```

只要文件的路径满足其中任何一个条件，就会被命中。

## noParse

noParse 配置项可以让 Webpack 忽略对部分没采用模块化的文件的递归解析和处理，这样做的好处是能提高构建性能。原因是一些库如 jQuery、ChartJS 庞大又没有采用模块化标准，让 Webpack 去解析这些既耗时又没有意义。

noParse 是可选的配置项，类型需要是 RegExp、[RegExp]、function 中的一种。

被忽略的文件里不应该包含 import、require、define 等模块化语句，不然会导致在构建出的代码中包含无法在浏览器环境下执行的模块化语句。

## parser

与 noParse 配置项的区别在于，parser 可以精确到语法层面，而 noParse 只能控制哪些文件不被解析。

```js
module: {
  rules: [
    {
      test: /\.js$/,
      use: ['babel-loader'],
      parser: {
        amd: false, // 禁用AMD
        commonjs: false, // 禁用CommonJS
        system: false, // 禁用SystemJS
        harmony: false, // 禁用ES6 import/export
        requireInclude: false, // 禁用 require.include
        requireEnsure: false, // 禁用 require.ensure
        requireContext: false, // 禁用 require.context
        browserify: false, // 禁用 browserify
        requireJs: false, // 禁用 requirejs
      },
    },
  ];
}
```

⚠️ 配置 Loader 需要注意：

- loader 执行的顺序由后向前
- 每个 loader 都可以通过 URL querystring 的方式传入参数，例如 `css-loader?minimize`
