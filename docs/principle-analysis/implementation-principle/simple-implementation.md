---
nav:
  title: 原理分析
  order: 2
group:
  title: 底层原理
  order: 2
title: 简易实现
order: 2
---

# 简易实现

## 定义 Compiler

```js
class Compiler {
  constructor(options) {
    // Webpack 配置
    const { entry, output } = options;
    // 入口
    this.entry = entry;
    // 出口
    this.output = output;
    // 模块
    this.modules = [];
  }
  // 构建启动
  run() {
    // ...
  }
  // 重写 require 函数，输出 bundle
  generate() {
    // ...
  }
}
```

## 解析入口文件获取 AST

这里使用 `@babel/parser` 实现分析内部的语法，包括 ES6，返回 AST 抽象语法树。

```js
// webpack.config.js

const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'main.js',
  },
};
```

```js
const fs = require('fs');
const parser = require('@babel/parser');
const options = require('./webpack.config.js');

const Parser = {
  getAst: path => {
    // 读取入口文件
    const content = fs.readFileSync(path, 'utf-8');
    // 将文件内容转为 AST 抽象语法树
    return parser.parse(content, {
      sourceType: 'module',
    });
  },
};

class Compiler {
  constructor(options) {
    // Webpack 配置
    const { entry, output } = options;
    // 入口
    this.entry = entry;
    // 出口
    this.output = output;
    // 模块
    this.modules = [];
  }
  // 构建启动
  run() {
    const ast = Parser.getAst(this.entry);
  }
  // 重写 require 函数，输出 bundle
  generate() {
    // ...
  }
}

new Compiler(options).run();
```

## 找出所有依赖模块

Babel 提供了 `@babel/traverse`（遍历）方法维护 AST 树的整体状态，我们这里使用它帮助我们找出依赖模块。

```js
const fs = require('fs');
const path = require('path');
const options = require('./webpack.config.js');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const Parser = {
  getAst: path => {
    // 读取入口文件
    const content = fs.readFileSync(path, 'utf-8');
    // 将文件内容转为 AST 抽象语法树
    return (
      parser.parse(content),
      {
        sourceType: 'module',
      }
    );
  },
  getDependencies: (ast, filename) => {
    const dependencies = {};
    // 遍历所有 import 模块，存入 dependencies
    traverse(ast, {
      // 类型为 ImportDeclaration 的 AST 节点（即为 import 语句）
      ImportDeclaration({ node }) {
        const dirname = path.dirname(filename);
        // 保存依赖模块路径，之后生成依赖关系图需要用到
        const filepath = './' + path.join(dirname, node.source.value);
        dependencies[node.source.value] = filepath;
      },
    });
    return dependencies;
  },
};

class Compiler {
  construcor(options) {
    // Webpack 配置
    const { entry, output } = options;
    // 入口
    this.entry = entry;
    // 出口
    this.output = output;
    // 模块
    this.modules = [];
  }
  // 构建启动
  run() {
    const { getAst, getDependencies } = Parser;
    const ast = getAst(this.entry);
    const dependencies = getDependencies(ast, this.entry);
  }
  // 重写 require 函数，输出 bundle
  generate() {
    // ...
  }
}

new Compiler(options).run();
```

## AST 转译

将 AST 语法树转换为浏览器可执行代码，我们这里使用 `@babel/core` 和 `@babel/preset-env`。

```js
const fs = require('fs');
const path = require('path');
const options = require('./webpack.config');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { transformFromAst } = require('@babel/core');

const Parser = {
  getASt: path => {
    // 读取入口文件
    const content = fs.readFileSync(path, 'utf-8');
    // 将文件内容转为 AST 抽象语法树
    return parser.parse(content, {
      sourceType: 'module',
    });
  },
  getDependencies: (ast, filename) => {
    const dependencies = {};
    // 遍历所有的 import 模块，存入 dependencies
    traverse(ast, {
      // 类型为 ImportDeclaration 的 AST 节点（即为 improt 语句）
      ImportDeclaration({ node }) {
        const dirname = path.dirname(filename);
        // 保存依赖模块路径，之后生成依赖关系图需要用到
        const filepath = './' + path.join(dirname, node.source.value);
        dependencies[node.source.value] = filepath;
      },
    });
    return dependencies;
  },
  getCode: ast => {
    // AST 转换为 Code
    const { code } = transformFromAst(ast, null, {
      parsets: ['@babel/preset-env'],
    });
    return code;
  },
};

class Compiler {
  constructor(options) {
    // webpack 配置
    const { entry, output } = options;
    // 入口
    this.entry = entry;
    // 出口
    this.output = output;
    // 模块
    this.modules = [];
  }
  // 构建启动
  run() {
    const { getAst, getDependecies, getCode } = Parser;
    const ast = getAst(this.entry);
    const dependecies = getDependecies(ast, this.entry);
    const code = getCode(ast);
  }
  // 重写 require 函数，输出 bundle
  generate() {}
}

new Compiler(options).run();
```

## 递归解析生成依赖关系

```js
const fs = require('fs');
const path = require('path');
const options = require('./webpack.config');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { transformFromAst } = require('@babel/core');

const Parser = {
  getASt: path => {
    // 读取入口文件
    const content = fs.readFileSync(path, 'utf-8');
    // 将文件内容转为 AST 抽象语法树
    return parser.parse(content, {
      sourceType: 'module',
    });
  },
  getDependencies: (ast, filename) => {
    const dependencies = {};
    // 遍历所有的 import 模块，存入 dependencies
    traverse(ast, {
      // 类型为 ImportDeclaration 的 AST 节点（即为 improt 语句）
      ImportDeclaration({ node }) {
        const dirname = path.dirname(filename);
        // 保存依赖模块路径，之后生成依赖关系图需要用到
        const filepath = './' + path.join(dirname, node.source.value);
        dependencies[node.source.value] = filepath;
      },
    });
    return dependencies;
  },
  getCode: ast => {
    // AST 转换为 Code
    const { code } = transformFromAst(ast, null, {
      parsets: ['@babel/preset-env'],
    });
    return code;
  },
};

class Compiler {
  constructor(options) {
    // webpack 配置
    const { entry, output } = options;
    // 入口
    this.entry = entry;
    // 出口
    this.output = output;
    // 模块
    this.modules = [];
  }
  // 构建启动
  run() {
    // 解析入口文件
    const info = this.build(this.entry);
    this.modules.push(info);
    this.modules.forEach(({ dependencies }) => {
      // 判断有依赖对象，递归解析所有依赖项
      if (dependencies) {
        for (const dependency in dependencies) {
          this.modules.push(this.build(dependencies[dependency]));
        }
      }
    });
    // 生成依赖关系图
    const dependencyGraph = this.modules.reduce(
      (graph, item) => ({
        ...graph,
        // 使用文件路径作为每个模块的唯一标识符，保存对应模块的依赖对象和文件内容
        [item.filename]: {
          dependencies: item.dependencies,
          code: item.code,
        },
      }),
      {}
    );
  }
  build(filename) {
    const { getAst, getDependecies, getCode } = Parser;
    const ast = getAst(filename);
    const dependecies = getDependecies(ast, filename);
    const code = getCode(ast);
    return {
      // 文件路径，可以作为每个模块的唯一标识符
      filename,
      // 依赖对象，保存着依赖模块路径
      dependencies,
      // 文件内容
      code,
    };
  }
  // 重写 require 函数，输出 bundle
  generate() {}
}

new Compiler(options).run();
```

## 重写加载函数输出 bundle

```js
const fs = require('fs');
const path = require('path');
const options = require('./webpack.config');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { transformFromAst } = require('@babel/core');

const Parser = {
  getASt: path => {
    // 读取入口文件
    const content = fs.readFileSync(path, 'utf-8');
    // 将文件内容转为 AST 抽象语法树
    return parser.parse(content, {
      sourceType: 'module',
    });
  },
  getDependencies: (ast, filename) => {
    const dependencies = {};
    // 遍历所有的 import 模块，存入 dependencies
    traverse(ast, {
      // 类型为 ImportDeclaration 的 AST 节点（即为 improt 语句）
      ImportDeclaration({ node }) {
        const dirname = path.dirname(filename);
        // 保存依赖模块路径，之后生成依赖关系图需要用到
        const filepath = './' + path.join(dirname, node.source.value);
        dependencies[node.source.value] = filepath;
      },
    });
    return dependencies;
  },
  getCode: ast => {
    // AST 转换为 Code
    const { code } = transformFromAst(ast, null, {
      parsets: ['@babel/preset-env'],
    });
    return code;
  },
};

class Compiler {
  constructor(options) {
    // webpack 配置
    const { entry, output } = options;
    // 入口
    this.entry = entry;
    // 出口
    this.output = output;
    // 模块
    this.modules = [];
  }
  // 构建启动
  run() {
    // 解析入口文件
    const info = this.build(this.entry);
    this.modules.push(info);
    this.modules.forEach(({ dependencies }) => {
      // 判断有依赖对象，递归解析所有依赖项
      if (dependencies) {
        for (const dependency in dependencies) {
          this.modules.push(this.build(dependencies[dependency]));
        }
      }
    });
    // 生成依赖关系图
    const dependencyGraph = this.modules.reduce(
      (graph, item) => ({
        ...graph,
        // 使用文件路径作为每个模块的唯一标识符，保存对应模块的依赖对象和文件内容
        [item.filename]: {
          dependencies: item.dependencies,
          code: item.code,
        },
      }),
      {}
    );
    this.generate(dependencyGraph);
  }
  build(filename) {
    const { getAst, getDependecies, getCode } = Parser;
    const ast = getAst(filename);
    const dependecies = getDependecies(ast, filename);
    const code = getCode(ast);
    return {
      // 文件路径，可以作为每个模块的唯一标识符
      filename,
      // 依赖对象，保存着依赖模块路径
      dependencies,
      // 文件内容
      code,
    };
  }
  // 重写 require 函数（浏览器不能识别 CommonJS 语法），输出 bundle
  generate() {
    // 输出文件路径
    const filePath = path.join(this.output.path, this.output.filename);

    const bundle = `(function(graph){
      function require(module) {
        function localRequire(relativePath) {
          return require(graph[module].dependencies[relativePath])
        }
        var exports = {};
        (function(require, exports, code) {
          eval(code)
        })(localRequire, exports, graph[module].code);
        return exports;
      }
      require('${this.entry}')
    })(${JSON.stringify(code)})`;

    // 把文件内容写入到文件系统
    fs.writeFileSync(filePath, bundle, 'utf-8');
  }
}

new Compiler(options).run();
```

## bundle 实现

```js
(function(graph) {
  function require(moduleId) {
    function localRequire(relativePath) {
      return require(graph[moduleId].dependecies[relativePath]);
    }
    var exports = {};
    (function(require, exports, code) {
      eval(code);
    })(localRequire, exports, graph[moduleId].code);
    return exports;
  }
  require('./src/index.js');
})({
  './src/index.js': {
    dependecies: {
      './hello.js': './src/hello.js',
    },
    code:
      '"use strict";\n\nvar _hello = require("./hello.js");\n\ndocument.write((0, _hello.say)("webpack"));',
  },
  './src/hello.js': {
    dependecies: {},
    code:
      '"use strict";\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nexports.say = say;\n\nfunction say(name) {\n  return "hello ".concat(name);\n}',
  },
});
```

### 第一步：从入口文件开始执行

```js
// 定义一个立即执行函数，传入生成的依赖关系图
(function(graph) {
  // 重写 require 函数
  function require(moduleId) {
    // ./src/index.js
    console.log(moduleId);
  }
  // 从入口文件开始执行
  require('./src/index.js');
})({
  './src/index.js': {
    dependencies: {
      './hello.js': './src/hello.js',
      code:
        '"use strict";\n\nvar _hello = require("./hello.js");\n\ndocument.write((0, _hello.say)("webpack"));',
    },
  },
  './src/hello.js': {
    dependencies: {},
    code:
      '"use strict";\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nexports.say = say;\n\nfunction say(name) {\n  return "hello ".concat(name);\n}',
  },
});
```

### 第二步：使用 eval 执行代码

```js
// 定义一个立即执行函数，传入生成的依赖关系图
(function(graph) {
  // 重写 require 函数
  function require(moduleId) {
    (function(code) {
      console.log(code);
      eval(code);
    })(graph[moduleId].code);
  }
  // 从入口文件开始执行
  require('./src/index.js');
})({
  './src/index.js': {
    dependencies: {
      './hello.js': './src/hello.js',
      code:
        '"use strict";\n\nvar _hello = require("./hello.js");\n\ndocument.write((0, _hello.say)("webpack"));',
    },
  },
  './src/hello.js': {
    dependencies: {},
    code:
      '"use strict";\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nexports.say = say;\n\nfunction say(name) {\n  return "hello ".concat(name);\n}',
  },
});
```

### 第三步：依赖对象寻址映射，获取 exports 对象

```js
// 定义一个立即执行函数，传入生成的依赖关系图
(function(graph) {
  // 重写 require 函数
  function require(moduleId) {
    // 找到对应 moduleId 的依赖对象，调用 require 函数，eval 执行，拿到 exports 对象
    function localRequire(relativePath) {
      return require(graph[moduleId].dependencies[relativePath]); // {__esModule: true, say: f say(name)}
    }
    // 定义 exports 对象
    var exports = {};

    (function(require, exports, code) {
      // CommonJS 语法使用 module.exports 暴露实现，我们传入的 exports 对象会捕获依赖对象（Hello.js）暴露的实现（exports.say = say）并写入
      eval(code);
    })(localRequire, exports, graph[moduleId].code);

    return exports;
  }
  // 从入口文件开始执行
  require('./src/index.js');
})({
  './src/index.js': {
    dependencies: {
      './hello.js': './src/hello.js',
      code:
        '"use strict";\n\nvar _hello = require("./hello.js");\n\ndocument.write((0, _hello.say)("webpack"));',
    },
  },
  './src/hello.js': {
    dependencies: {},
    code:
      '"use strict";\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nexports.say = say;\n\nfunction say(name) {\n  return "hello ".concat(name);\n}',
  },
});
```

---

**参考资料：**

- [Webpack 打包原理？看完这篇你就懂了！（2020-01-06）](https://juejin.im/post/5e116fce6fb9a047ea7472a6)
