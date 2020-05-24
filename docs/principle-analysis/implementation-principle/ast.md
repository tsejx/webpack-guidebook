---
nav:
  title: 原理分析
  order: 2
group:
  title: 底层原理
  order: 2
title: 抽象语法树
order: 20
---

# 抽象语法树

> In computer science, an abstract syntax tree (AST), or just syntax tree, is a tree representation of the abstract syntactic structure of source code written in a programming language.

抽象语法树（Abstract Syntax Tree 或者缩写为 AST），或者语法树（Syntax Tree），是 **源代码的抽象语法结构的树状表现形式**，这里特指编程语言的源代码。树上的每个节点都表示源代码中的一种结构。

## 编译原理

编译原理的流程：

1. **词法分析**：单词与记号、正则表达式、有限自动机、从正则表达式到有限自动机的转换、词法分析器的实现
2. **语法分析**：上下文无关文法、递归下降分析、LR 分析、错误处理、语法分析器自动生成
3. **语义分析**：类型系统、属性文法、语法制导翻译、符号表管理、抽象语法树、线性中间表示、图中间表示
4. **中间代码生成**：变量地址分配、算术表达式翻译、布尔表达式翻译、数组、结构体和字符串的翻译、控制流的翻译、函数调用的翻译
5. **目标代码优化与生成**：目标体系结构、树匹配代码生成、基于动态规划的代码生成、寄存器分配、指令调度、控制流分析数据流分析、死代码删除、常量传播、拷贝传播、静态单赋值形式

JavaScript 是解释型语言，但其在执行过程中仍然需要即时编译（JIT），其编译过程也遵循这些流程：

1. **分词/词法分析**（tokenize）：把字符串分解成有意义的代码块，这些代码块被称为词法单元
2. **解析/语法分析**（parse）：词法单元流（数组）转换成一个由元素逐级嵌套所组成的代表了程序语法结构的树，即 AST
3. **代码生成**：将 AST 转换为可执行代码

以 `var foo = 1` 为例子，分词后可以得到如下的效果：

```js
[
  { type: 'identifier', value: 'var' },
  { type: 'whitespace', value: ' ' },
  { type: 'identifier', value: 'foo' },
  { type: 'whitespace', value: ' ' },
  { type: 'operator', value: '=' },
  { type: 'whitespace', value: ' ' },
  { type: 'num', value: '1' },
  { type: 'sep', value: ';' },
];
```

实际使用 `babylon6` 解析这段代码时，分词结果为：

```
- token: [
  + Token (var) { type, value, strat, end, loc }
  + Token (name) { type, value, strat, end, loc }
  + Token (=) { type, value, strat, end, loc }
  + Token (num) { type, value, strat, end, loc }
  + Token (eof) { type, value, strat, end, loc }
]
```

生成的抽象语法树为：

```js
{
  "type":"Program",
  "body":[
    {
      "type":"VariableDeclaration",
      "kind":"var",
      "declarations":{
        "type":"VariableDeclarator",
        "id":{
            "type":"Identifier",
            "value":"a"
        },
        "init":{
            "type":"Literal",
            "value":42
        }
      }
    }
  ]
}
```

总结：通过 Parser 把代码转化为抽象语法树（AST），该树定义了代码的结构，通过对树的处理，能实现对代码的分析、优化等操作。

## AST in ESLint

ESLint 是一个用来检查和报告 JavaScript 编写规范的插件化工具，通过配置规则来规范代码，以 `no-cond-assign` 规则为例，启用这一规则时，代码中不允许在条件语句中赋值，这一规则可以避免在条件语句中，错误的将判断写成赋值。

```js
if(user.jobTitle = "manager"){
  user.jobTitle is now incorrect
}
```

ESLint 的检查基于 AST，除了这些内置规则外，ESLint 为我们提供了 API，使得我们可以利用源代码生成的 AST，开发自定义插件和自定义规则。

```js
module.exports = {
  rules: {
    'var-length': {
      create: function(context) {
        // 规则实现
      },
    },
  },
};
```

自定义规则插件的结构如上，在 create 方法中，我们可以定义我们关注的语法单元类型并且实现相关的规则逻辑，ESLint 会在遍历语法树时，进入对应的单元类型时，执行我们的检查逻辑。

比如我们要实现一条规则，要求赋值语句中，变量名长度大于两位。

```js
module.exports = {
  rules: {
    'var-length': {
      create: function(context) {
        return {
          VariableDeclarator: node => {
            if (node.id.name.length < 2) {
              context.report(node, 'Variable names should be longer than 1 character');
            }
          },
        };
      },
    },
  },
};
```

为这一插件编写 `package.json`。

```json
{
  "name": "eslint-plugin-my-eslist-plugin",
  "version": "0.0.1",
  "main": "index.js",
  "devDependencies": {
    "eslint": "~2.6.0"
  },
  "engines": {
    "node": ">=0.10.0"
  }
}
```

在项目中使用时，通过 NPM 安装依赖后，在配置中启用插件和对应规则。

```json
"plugins": [
    "my-eslint-plugin"
],
"rules": {
    "my-eslint-plugin/var-length": "warn"
}
```

通过这些配置，便可以使用上述自定义插件。

有时我们不想要发布新的插件，而仅想编写本地自定义规则，这时我们可以通过自定义规则来实现。自定义规则与插件结构大致相同，如下是一个自定义规则，禁止在代码中使用 `console` 的方法调用。

```js
const disallowedMethods = ['log', 'info', 'warn', 'error', 'dir'];

module.exports = {
  meta: {
    docs: {
      description: 'Disallow use of console',
      category: 'Best Practices',
      recommended: true,
    },
  },
  create(context) {
    return {
      Identifier(node) {
        const isConsoleCall = looksLike(node, {
          name: 'console',
          parent: {
            type: 'MemberExpression',
            property: {
              name: val => disallowedMethods.includes(val),
            },
          },
        });
        // find the identifier with name 'console'
        if (!isConsoleCall) {
          return;
        }

        context.report({
          node,
          message: 'Using console is not allowed',
        });
      },
    };
  },
};
```

## AST in Babel

Babel 是为使用下一代 JavaScript 语法特性来开发而存在的编译工具，最初这个项目名为 `6to5`，意为将 ES6 语法转换为 ES5。发展到现在，Babel 已经形成了一个强大的生态。

Babel 的工作过程经过三个阶段，`parse`、`transform`、`generate`，具体来说，如下图所示，在 `parse` 阶段，使用 `babylon` 库将源代码转换为 AST，在 `transform` 阶段，利用各种插件进行代码转换，如图中的 JSX transform 将 React JSX 转换为 plain object，在 `generator` 阶段，再利用代码生成工具，将 AST 转换成代码。

Babel 为我们提供了 API 让我们可以对代码进行 AST 转换并且进行各种操作：

```js
import * as babylon from 'babylon';
import traverse from 'babel-traverse';
import generate from 'babel-generator';

const code = `function square(n) {
    return n * n;
}`;

const ast = babylon.parse(code);
traverse(ast, {
  enter(path) {
    if (path.node.type === 'Identifier' && path.node.name === 'n') {
      path.node.name = 'x';
    }
  },
});
generate(ast, {}, code);
```

直接使用这些 API 的场景倒不多，项目中经常用到的，是各种 Babel 插件，比如 `babel-plugin-transform-remove-console` 插件，可以去除代码中所有对 console 的方法调用，主要代码如下：

```js
module.exports = function({ types: t }) {
  return {
    name: "transform-remove-console",
    visitor: {
      CallExpression(path, state) {
        const callee = path.get("callee");

        if (!callee.isMemberExpression()) return;

        if (isIncludedConsole(callee, state.opts.exclude)) {
          // console.log()
          if (path.parentPath.isExpressionStatement()) {
            path.remove();
          } else {
          //var a = console.log()
            path.replaceWith(createVoid0());
          }
        } else if (isIncludedConsoleBind(callee, state.opts.exclude)) {
          // console.log.bind()
          path.replaceWith(createNoop());
        }
      },
      MemberExpression: {
        exit(path, state) {
          if (
            isIncludedConsole(path, state.opts.exclude) &&
            !path.parentPath.isMemberExpression()
          ) {
          //console.log = func
            if (
              path.parentPath.isAssignmentExpression() &&
              path.parentKey === "left"
            ) {
              path.parentPath.get("right").replaceWith(createNoop());
            } else {
            //var a = console.log
              path.replaceWith(createNoop());
            }
          }
        }
      }
    }
  };
```

使用这一插件，可以将程序中如下调用进行转换：

```js
console.log();
var a = console.log();
console.log.bind();
var b = console.log;
console.log = func;

// Output
var a = void 0(function() {});
var b = function() {};
console.log = function() {};
```

上述 Babel 插件的工作方式与前述的 ESLint 自定义插件/规则类似，工具在遍历源码生成的 AST 时，根据我们指定的节点类型进行对应的检查。

在我们开发插件时，是如何确定代码 AST 树形结构呢？可以利用 AST explorer 方便的查看源码生成的对应 AST 结构。

## AST in Webpack

Webpack 是一个 JavaScript 生态的打包工具，其打出 bundle 结构是一个 IIFE（立即执行函数）。

```js
(function(module) {})([function() {}, function() {}]);
```

Webpack 在打包流程中也需要 AST 的支持，它借助 Acorn 库解析源码，生成 AST，提取模块的依赖关系。

```js
Parser.prototype.parse = function parse(source, initialState) {
  var ast;
  if (!ast) {
    // Acorn 以 ES6 语法进行解析
    ranges: true,
    locations: true,
    ecmaVersion: 6,
    sourceType: 'module'
  }
}
```

---

**参考资料：**

- [🛠 Esprima：在线解析生产 AST 语法树](https://esprima.org/demo/parse.html)
- [🛠 Acorn：Esprima 后的轮子，目前使用最多，WebPack 也使用此工具](https://github.com/acornjs/acorn)
- [🛠 AST Explorer：AST 可视化工具](https://astexplorer.net/)
- [🛠 Espree：最初从 Esprima fork 出来，来自 ESlint，用于 ESlint](https://github.com/eslint/espree)
- [🛠 babel-parser：原 babylon，最初从 acorn fork 出来](https://github.com/babel/babel/tree/master/packages/babel-parser/src/parser)
- [🛠 UglifyJS2：自带 parser](https://github.com/mishoo/UglifyJS)
- [📝 AST 与前端工程化实战](https://juejin.im/post/5d50d1d9f265da03aa25607b)
- [📝 AST in Modern JavaScript](https://zhuanlan.zhihu.com/p/32189701)
- [📝 使用 Acorn 来解析 JavaScript](https://juejin.im/post/582425402e958a129926fcb4)
- [📝 JavaScript 语法树与代码转化（2018-04-26）](https://zhuanlan.zhihu.com/p/28054817)
