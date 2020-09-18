(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[42],{"r/i3":function(e,n,t){"use strict";t.r(n);var r=t("q1tI"),a=t.n(r),s=(t("B2uJ"),t("+su7"),t("qOys")),o=t.n(s);t("5Yjd");n["default"]=function(){return a.a.createElement(a.a.Fragment,null,a.a.createElement("div",{className:"markdown"},a.a.createElement("h1",{id:"\u7b80\u6613\u5b9e\u73b0"},a.a.createElement("a",{"aria-hidden":"true",href:"#\u7b80\u6613\u5b9e\u73b0"},a.a.createElement("span",{className:"icon icon-link"})),"\u7b80\u6613\u5b9e\u73b0"),a.a.createElement("h2",{id:"\u5b9a\u4e49-compiler"},a.a.createElement("a",{"aria-hidden":"true",href:"#\u5b9a\u4e49-compiler"},a.a.createElement("span",{className:"icon icon-link"})),"\u5b9a\u4e49 Compiler"),a.a.createElement(o.a,{code:"class Compiler {\n  constructor(options) {\n    // Webpack \u914d\u7f6e\n    const { entry, output } = options;\n    // \u5165\u53e3\n    this.entry = entry;\n    // \u51fa\u53e3\n    this.output = output;\n    // \u6a21\u5757\n    this.modules = [];\n  }\n  // \u6784\u5efa\u542f\u52a8\n  run() {\n    // ...\n  }\n  // \u91cd\u5199 require \u51fd\u6570\uff0c\u8f93\u51fa bundle\n  generate() {\n    // ...\n  }\n}\n",lang:"js"}),a.a.createElement("h2",{id:"\u89e3\u6790\u5165\u53e3\u6587\u4ef6\u83b7\u53d6-ast"},a.a.createElement("a",{"aria-hidden":"true",href:"#\u89e3\u6790\u5165\u53e3\u6587\u4ef6\u83b7\u53d6-ast"},a.a.createElement("span",{className:"icon icon-link"})),"\u89e3\u6790\u5165\u53e3\u6587\u4ef6\u83b7\u53d6 AST"),a.a.createElement("p",null,"\u8fd9\u91cc\u4f7f\u7528 ",a.a.createElement("code",null,"@babel/parser")," \u5b9e\u73b0\u5206\u6790\u5185\u90e8\u7684\u8bed\u6cd5\uff0c\u5305\u62ec ES6\uff0c\u8fd4\u56de AST \u62bd\u8c61\u8bed\u6cd5\u6811\u3002"),a.a.createElement(o.a,{code:"// webpack.config.js\n\nconst path = require('path');\n\nmodule.exports = {\n  entry: './src/index.js',\n  output: {\n    path: path.resolve(__dirname, './dist'),\n    filename: 'main.js',\n  },\n};\n",lang:"js"}),a.a.createElement(o.a,{code:"const fs = require('fs');\nconst parser = require('@babel/parser');\nconst options = require('./webpack.config.js');\n\nconst Parser = {\n  getAst: path => {\n    // \u8bfb\u53d6\u5165\u53e3\u6587\u4ef6\n    const content = fs.readFileSync(path, 'utf-8');\n    // \u5c06\u6587\u4ef6\u5185\u5bb9\u8f6c\u4e3a AST \u62bd\u8c61\u8bed\u6cd5\u6811\n    return parser.parse(content, {\n      sourceType: 'module',\n    });\n  },\n};\n\nclass Compiler {\n  constructor(options) {\n    // Webpack \u914d\u7f6e\n    const { entry, output } = options;\n    // \u5165\u53e3\n    this.entry = entry;\n    // \u51fa\u53e3\n    this.output = output;\n    // \u6a21\u5757\n    this.modules = [];\n  }\n  // \u6784\u5efa\u542f\u52a8\n  run() {\n    const ast = Parser.getAst(this.entry);\n  }\n  // \u91cd\u5199 require \u51fd\u6570\uff0c\u8f93\u51fa bundle\n  generate() {\n    // ...\n  }\n}\n\nnew Compiler(options).run();\n",lang:"js"}),a.a.createElement("h2",{id:"\u627e\u51fa\u6240\u6709\u4f9d\u8d56\u6a21\u5757"},a.a.createElement("a",{"aria-hidden":"true",href:"#\u627e\u51fa\u6240\u6709\u4f9d\u8d56\u6a21\u5757"},a.a.createElement("span",{className:"icon icon-link"})),"\u627e\u51fa\u6240\u6709\u4f9d\u8d56\u6a21\u5757"),a.a.createElement("p",null,"Babel \u63d0\u4f9b\u4e86 ",a.a.createElement("code",null,"@babel/traverse"),"\uff08\u904d\u5386\uff09\u65b9\u6cd5\u7ef4\u62a4 AST \u6811\u7684\u6574\u4f53\u72b6\u6001\uff0c\u6211\u4eec\u8fd9\u91cc\u4f7f\u7528\u5b83\u5e2e\u52a9\u6211\u4eec\u627e\u51fa\u4f9d\u8d56\u6a21\u5757\u3002"),a.a.createElement(o.a,{code:"const fs = require('fs');\nconst path = require('path');\nconst options = require('./webpack.config.js');\nconst parser = require('@babel/parser');\nconst traverse = require('@babel/traverse').default;\n\nconst Parser = {\n  getAst: path => {\n    // \u8bfb\u53d6\u5165\u53e3\u6587\u4ef6\n    const content = fs.readFileSync(path, 'utf-8');\n    // \u5c06\u6587\u4ef6\u5185\u5bb9\u8f6c\u4e3a AST \u62bd\u8c61\u8bed\u6cd5\u6811\n    return (\n      parser.parse(content),\n      {\n        sourceType: 'module',\n      }\n    );\n  },\n  getDependencies: (ast, filename) => {\n    const dependencies = {};\n    // \u904d\u5386\u6240\u6709 import \u6a21\u5757\uff0c\u5b58\u5165 dependencies\n    traverse(ast, {\n      // \u7c7b\u578b\u4e3a ImportDeclaration \u7684 AST \u8282\u70b9\uff08\u5373\u4e3a import \u8bed\u53e5\uff09\n      ImportDeclaration({ node }) {\n        const dirname = path.dirname(filename);\n        // \u4fdd\u5b58\u4f9d\u8d56\u6a21\u5757\u8def\u5f84\uff0c\u4e4b\u540e\u751f\u6210\u4f9d\u8d56\u5173\u7cfb\u56fe\u9700\u8981\u7528\u5230\n        const filepath = './' + path.join(dirname, node.source.value);\n        dependencies[node.source.value] = filepath;\n      },\n    });\n    return dependencies;\n  },\n};\n\nclass Compiler {\n  construcor(options) {\n    // Webpack \u914d\u7f6e\n    const { entry, output } = options;\n    // \u5165\u53e3\n    this.entry = entry;\n    // \u51fa\u53e3\n    this.output = output;\n    // \u6a21\u5757\n    this.modules = [];\n  }\n  // \u6784\u5efa\u542f\u52a8\n  run() {\n    const { getAst, getDependencies } = Parser;\n    const ast = getAst(this.entry);\n    const dependencies = getDependencies(ast, this.entry);\n  }\n  // \u91cd\u5199 require \u51fd\u6570\uff0c\u8f93\u51fa bundle\n  generate() {\n    // ...\n  }\n}\n\nnew Compiler(options).run();\n",lang:"js"}),a.a.createElement("h2",{id:"ast-\u8f6c\u8bd1"},a.a.createElement("a",{"aria-hidden":"true",href:"#ast-\u8f6c\u8bd1"},a.a.createElement("span",{className:"icon icon-link"})),"AST \u8f6c\u8bd1"),a.a.createElement("p",null,"\u5c06 AST \u8bed\u6cd5\u6811\u8f6c\u6362\u4e3a\u6d4f\u89c8\u5668\u53ef\u6267\u884c\u4ee3\u7801\uff0c\u6211\u4eec\u8fd9\u91cc\u4f7f\u7528 ",a.a.createElement("code",null,"@babel/core")," \u548c ",a.a.createElement("code",null,"@babel/preset-env"),"\u3002"),a.a.createElement(o.a,{code:"const fs = require('fs');\nconst path = require('path');\nconst options = require('./webpack.config');\nconst parser = require('@babel/parser');\nconst traverse = require('@babel/traverse').default;\nconst { transformFromAst } = require('@babel/core');\n\nconst Parser = {\n  getASt: path => {\n    // \u8bfb\u53d6\u5165\u53e3\u6587\u4ef6\n    const content = fs.readFileSync(path, 'utf-8');\n    // \u5c06\u6587\u4ef6\u5185\u5bb9\u8f6c\u4e3a AST \u62bd\u8c61\u8bed\u6cd5\u6811\n    return parser.parse(content, {\n      sourceType: 'module',\n    });\n  },\n  getDependencies: (ast, filename) => {\n    const dependencies = {};\n    // \u904d\u5386\u6240\u6709\u7684 import \u6a21\u5757\uff0c\u5b58\u5165 dependencies\n    traverse(ast, {\n      // \u7c7b\u578b\u4e3a ImportDeclaration \u7684 AST \u8282\u70b9\uff08\u5373\u4e3a improt \u8bed\u53e5\uff09\n      ImportDeclaration({ node }) {\n        const dirname = path.dirname(filename);\n        // \u4fdd\u5b58\u4f9d\u8d56\u6a21\u5757\u8def\u5f84\uff0c\u4e4b\u540e\u751f\u6210\u4f9d\u8d56\u5173\u7cfb\u56fe\u9700\u8981\u7528\u5230\n        const filepath = './' + path.join(dirname, node.source.value);\n        dependencies[node.source.value] = filepath;\n      },\n    });\n    return dependencies;\n  },\n  getCode: ast => {\n    // AST \u8f6c\u6362\u4e3a Code\n    const { code } = transformFromAst(ast, null, {\n      parsets: ['@babel/preset-env'],\n    });\n    return code;\n  },\n};\n\nclass Compiler {\n  constructor(options) {\n    //\xa0webpack\xa0\u914d\u7f6e\n    const { entry, output } = options;\n    //\xa0\u5165\u53e3\n    this.entry = entry;\n    //\xa0\u51fa\u53e3\n    this.output = output;\n    //\xa0\u6a21\u5757\n    this.modules = [];\n  }\n  //\xa0\u6784\u5efa\u542f\u52a8\n  run() {\n    const { getAst, getDependecies, getCode } = Parser;\n    const ast = getAst(this.entry);\n    const dependecies = getDependecies(ast, this.entry);\n    const code = getCode(ast);\n  }\n  //\xa0\u91cd\u5199\xa0require \u51fd\u6570\uff0c\u8f93\u51fa bundle\n  generate() {}\n}\n\nnew Compiler(options).run();\n",lang:"js"}),a.a.createElement("h2",{id:"\u9012\u5f52\u89e3\u6790\u751f\u6210\u4f9d\u8d56\u5173\u7cfb"},a.a.createElement("a",{"aria-hidden":"true",href:"#\u9012\u5f52\u89e3\u6790\u751f\u6210\u4f9d\u8d56\u5173\u7cfb"},a.a.createElement("span",{className:"icon icon-link"})),"\u9012\u5f52\u89e3\u6790\u751f\u6210\u4f9d\u8d56\u5173\u7cfb"),a.a.createElement(o.a,{code:"const fs = require('fs');\nconst path = require('path');\nconst options = require('./webpack.config');\nconst parser = require('@babel/parser');\nconst traverse = require('@babel/traverse').default;\nconst { transformFromAst } = require('@babel/core');\n\nconst Parser = {\n  getASt: path => {\n    // \u8bfb\u53d6\u5165\u53e3\u6587\u4ef6\n    const content = fs.readFileSync(path, 'utf-8');\n    // \u5c06\u6587\u4ef6\u5185\u5bb9\u8f6c\u4e3a AST \u62bd\u8c61\u8bed\u6cd5\u6811\n    return parser.parse(content, {\n      sourceType: 'module',\n    });\n  },\n  getDependencies: (ast, filename) => {\n    const dependencies = {};\n    // \u904d\u5386\u6240\u6709\u7684 import \u6a21\u5757\uff0c\u5b58\u5165 dependencies\n    traverse(ast, {\n      // \u7c7b\u578b\u4e3a ImportDeclaration \u7684 AST \u8282\u70b9\uff08\u5373\u4e3a improt \u8bed\u53e5\uff09\n      ImportDeclaration({ node }) {\n        const dirname = path.dirname(filename);\n        // \u4fdd\u5b58\u4f9d\u8d56\u6a21\u5757\u8def\u5f84\uff0c\u4e4b\u540e\u751f\u6210\u4f9d\u8d56\u5173\u7cfb\u56fe\u9700\u8981\u7528\u5230\n        const filepath = './' + path.join(dirname, node.source.value);\n        dependencies[node.source.value] = filepath;\n      },\n    });\n    return dependencies;\n  },\n  getCode: ast => {\n    // AST \u8f6c\u6362\u4e3a Code\n    const { code } = transformFromAst(ast, null, {\n      parsets: ['@babel/preset-env'],\n    });\n    return code;\n  },\n};\n\nclass Compiler {\n  constructor(options) {\n    //\xa0webpack\xa0\u914d\u7f6e\n    const { entry, output } = options;\n    //\xa0\u5165\u53e3\n    this.entry = entry;\n    //\xa0\u51fa\u53e3\n    this.output = output;\n    //\xa0\u6a21\u5757\n    this.modules = [];\n  }\n  //\xa0\u6784\u5efa\u542f\u52a8\n  run() {\n    // \u89e3\u6790\u5165\u53e3\u6587\u4ef6\n    const info = this.build(this.entry);\n    this.modules.push(info);\n    this.modules.forEach(({ dependencies }) => {\n      // \u5224\u65ad\u6709\u4f9d\u8d56\u5bf9\u8c61\uff0c\u9012\u5f52\u89e3\u6790\u6240\u6709\u4f9d\u8d56\u9879\n      if (dependencies) {\n        for (const dependency in dependencies) {\n          this.modules.push(this.build(dependencies[dependency]));\n        }\n      }\n    });\n    // \u751f\u6210\u4f9d\u8d56\u5173\u7cfb\u56fe\n    const dependencyGraph = this.modules.reduce(\n      (graph, item) => ({\n        ...graph,\n        // \u4f7f\u7528\u6587\u4ef6\u8def\u5f84\u4f5c\u4e3a\u6bcf\u4e2a\u6a21\u5757\u7684\u552f\u4e00\u6807\u8bc6\u7b26\uff0c\u4fdd\u5b58\u5bf9\u5e94\u6a21\u5757\u7684\u4f9d\u8d56\u5bf9\u8c61\u548c\u6587\u4ef6\u5185\u5bb9\n        [item.filename]: {\n          dependencies: item.dependencies,\n          code: item.code,\n        },\n      }),\n      {}\n    );\n  }\n  build(filename) {\n    const { getAst, getDependecies, getCode } = Parser;\n    const ast = getAst(filename);\n    const dependecies = getDependecies(ast, filename);\n    const code = getCode(ast);\n    return {\n      // \u6587\u4ef6\u8def\u5f84\uff0c\u53ef\u4ee5\u4f5c\u4e3a\u6bcf\u4e2a\u6a21\u5757\u7684\u552f\u4e00\u6807\u8bc6\u7b26\n      filename,\n      // \u4f9d\u8d56\u5bf9\u8c61\uff0c\u4fdd\u5b58\u7740\u4f9d\u8d56\u6a21\u5757\u8def\u5f84\n      dependencies,\n      // \u6587\u4ef6\u5185\u5bb9\n      code,\n    };\n  }\n  //\xa0\u91cd\u5199\xa0require \u51fd\u6570\uff0c\u8f93\u51fa bundle\n  generate() {}\n}\n\nnew Compiler(options).run();\n",lang:"js"}),a.a.createElement("h2",{id:"\u91cd\u5199\u52a0\u8f7d\u51fd\u6570\u8f93\u51fa-bundle"},a.a.createElement("a",{"aria-hidden":"true",href:"#\u91cd\u5199\u52a0\u8f7d\u51fd\u6570\u8f93\u51fa-bundle"},a.a.createElement("span",{className:"icon icon-link"})),"\u91cd\u5199\u52a0\u8f7d\u51fd\u6570\u8f93\u51fa bundle"),a.a.createElement(o.a,{code:"const fs = require('fs');\nconst path = require('path');\nconst options = require('./webpack.config');\nconst parser = require('@babel/parser');\nconst traverse = require('@babel/traverse').default;\nconst { transformFromAst } = require('@babel/core');\n\nconst Parser = {\n  getASt: path => {\n    // \u8bfb\u53d6\u5165\u53e3\u6587\u4ef6\n    const content = fs.readFileSync(path, 'utf-8');\n    // \u5c06\u6587\u4ef6\u5185\u5bb9\u8f6c\u4e3a AST \u62bd\u8c61\u8bed\u6cd5\u6811\n    return parser.parse(content, {\n      sourceType: 'module',\n    });\n  },\n  getDependencies: (ast, filename) => {\n    const dependencies = {};\n    // \u904d\u5386\u6240\u6709\u7684 import \u6a21\u5757\uff0c\u5b58\u5165 dependencies\n    traverse(ast, {\n      // \u7c7b\u578b\u4e3a ImportDeclaration \u7684 AST \u8282\u70b9\uff08\u5373\u4e3a improt \u8bed\u53e5\uff09\n      ImportDeclaration({ node }) {\n        const dirname = path.dirname(filename);\n        // \u4fdd\u5b58\u4f9d\u8d56\u6a21\u5757\u8def\u5f84\uff0c\u4e4b\u540e\u751f\u6210\u4f9d\u8d56\u5173\u7cfb\u56fe\u9700\u8981\u7528\u5230\n        const filepath = './' + path.join(dirname, node.source.value);\n        dependencies[node.source.value] = filepath;\n      },\n    });\n    return dependencies;\n  },\n  getCode: ast => {\n    // AST \u8f6c\u6362\u4e3a Code\n    const { code } = transformFromAst(ast, null, {\n      parsets: ['@babel/preset-env'],\n    });\n    return code;\n  },\n};\n\nclass Compiler {\n  constructor(options) {\n    //\xa0webpack\xa0\u914d\u7f6e\n    const { entry, output } = options;\n    //\xa0\u5165\u53e3\n    this.entry = entry;\n    //\xa0\u51fa\u53e3\n    this.output = output;\n    //\xa0\u6a21\u5757\n    this.modules = [];\n  }\n  //\xa0\u6784\u5efa\u542f\u52a8\n  run() {\n    // \u89e3\u6790\u5165\u53e3\u6587\u4ef6\n    const info = this.build(this.entry);\n    this.modules.push(info);\n    this.modules.forEach(({ dependencies }) => {\n      // \u5224\u65ad\u6709\u4f9d\u8d56\u5bf9\u8c61\uff0c\u9012\u5f52\u89e3\u6790\u6240\u6709\u4f9d\u8d56\u9879\n      if (dependencies) {\n        for (const dependency in dependencies) {\n          this.modules.push(this.build(dependencies[dependency]));\n        }\n      }\n    });\n    // \u751f\u6210\u4f9d\u8d56\u5173\u7cfb\u56fe\n    const dependencyGraph = this.modules.reduce(\n      (graph, item) => ({\n        ...graph,\n        // \u4f7f\u7528\u6587\u4ef6\u8def\u5f84\u4f5c\u4e3a\u6bcf\u4e2a\u6a21\u5757\u7684\u552f\u4e00\u6807\u8bc6\u7b26\uff0c\u4fdd\u5b58\u5bf9\u5e94\u6a21\u5757\u7684\u4f9d\u8d56\u5bf9\u8c61\u548c\u6587\u4ef6\u5185\u5bb9\n        [item.filename]: {\n          dependencies: item.dependencies,\n          code: item.code,\n        },\n      }),\n      {}\n    );\n    this.generate(dependencyGraph);\n  }\n  build(filename) {\n    const { getAst, getDependecies, getCode } = Parser;\n    const ast = getAst(filename);\n    const dependecies = getDependecies(ast, filename);\n    const code = getCode(ast);\n    return {\n      // \u6587\u4ef6\u8def\u5f84\uff0c\u53ef\u4ee5\u4f5c\u4e3a\u6bcf\u4e2a\u6a21\u5757\u7684\u552f\u4e00\u6807\u8bc6\u7b26\n      filename,\n      // \u4f9d\u8d56\u5bf9\u8c61\uff0c\u4fdd\u5b58\u7740\u4f9d\u8d56\u6a21\u5757\u8def\u5f84\n      dependencies,\n      // \u6587\u4ef6\u5185\u5bb9\n      code,\n    };\n  }\n  //\xa0\u91cd\u5199\xa0require \u51fd\u6570\uff08\u6d4f\u89c8\u5668\u4e0d\u80fd\u8bc6\u522b CommonJS \u8bed\u6cd5\uff09\uff0c\u8f93\u51fa bundle\n  generate() {\n    // \u8f93\u51fa\u6587\u4ef6\u8def\u5f84\n    const filePath = path.join(this.output.path, this.output.filename);\n\n    const bundle = `(function(graph){\n      function require(module) {\n        function localRequire(relativePath) {\n          return require(graph[module].dependencies[relativePath])\n        }\n        var exports = {};\n        (function(require, exports, code) {\n          eval(code)\n        })(localRequire, exports, graph[module].code);\n        return exports;\n      }\n      require('${this.entry}')\n    })(${JSON.stringify(code)})`;\n\n    // \u628a\u6587\u4ef6\u5185\u5bb9\u5199\u5165\u5230\u6587\u4ef6\u7cfb\u7edf\n    fs.writeFileSync(filePath, bundle, 'utf-8');\n  }\n}\n\nnew Compiler(options).run();\n",lang:"js"}),a.a.createElement("h2",{id:"bundle-\u5b9e\u73b0"},a.a.createElement("a",{"aria-hidden":"true",href:"#bundle-\u5b9e\u73b0"},a.a.createElement("span",{className:"icon icon-link"})),"bundle \u5b9e\u73b0"),a.a.createElement(o.a,{code:"(function(graph) {\n  function require(moduleId) {\n    function localRequire(relativePath) {\n      return require(graph[moduleId].dependecies[relativePath]);\n    }\n    var exports = {};\n    (function(require, exports, code) {\n      eval(code);\n    })(localRequire, exports, graph[moduleId].code);\n    return exports;\n  }\n  require('./src/index.js');\n})({\n  './src/index.js': {\n    dependecies: {\n      './hello.js': './src/hello.js',\n    },\n    code:\n      '\"use\xa0strict\";\\n\\nvar\xa0_hello\xa0=\xa0require(\"./hello.js\");\\n\\ndocument.write((0,\xa0_hello.say)(\"webpack\"));',\n  },\n  './src/hello.js': {\n    dependecies: {},\n    code:\n      '\"use\xa0strict\";\\n\\nObject.defineProperty(exports,\xa0\"__esModule\",\xa0{\\n\xa0\xa0value:\xa0true\\n});\\nexports.say\xa0=\xa0say;\\n\\nfunction\xa0say(name)\xa0{\\n\xa0\xa0return\xa0\"hello\xa0\".concat(name);\\n}',\n  },\n});\n",lang:"js"}),a.a.createElement("h3",{id:"\u7b2c\u4e00\u6b65\uff1a\u4ece\u5165\u53e3\u6587\u4ef6\u5f00\u59cb\u6267\u884c"},a.a.createElement("a",{"aria-hidden":"true",href:"#\u7b2c\u4e00\u6b65\uff1a\u4ece\u5165\u53e3\u6587\u4ef6\u5f00\u59cb\u6267\u884c"},a.a.createElement("span",{className:"icon icon-link"})),"\u7b2c\u4e00\u6b65\uff1a\u4ece\u5165\u53e3\u6587\u4ef6\u5f00\u59cb\u6267\u884c"),a.a.createElement(o.a,{code:"// \u5b9a\u4e49\u4e00\u4e2a\u7acb\u5373\u6267\u884c\u51fd\u6570\uff0c\u4f20\u5165\u751f\u6210\u7684\u4f9d\u8d56\u5173\u7cfb\u56fe\n(function(graph) {\n  // \u91cd\u5199 require \u51fd\u6570\n  function require(moduleId) {\n    // ./src/index.js\n    console.log(moduleId);\n  }\n  // \u4ece\u5165\u53e3\u6587\u4ef6\u5f00\u59cb\u6267\u884c\n  require('./src/index.js');\n})({\n  './src/index.js': {\n    dependencies: {\n      './hello.js': './src/hello.js',\n      code:\n        '\"use strict\";\\n\\nvar _hello = require(\"./hello.js\");\\n\\ndocument.write((0, _hello.say)(\"webpack\"));',\n    },\n  },\n  './src/hello.js': {\n    dependencies: {},\n    code:\n      '\"use\xa0strict\";\\n\\nObject.defineProperty(exports,\xa0\"__esModule\",\xa0{\\n\xa0\xa0value:\xa0true\\n});\\nexports.say\xa0=\xa0say;\\n\\nfunction\xa0say(name)\xa0{\\n\xa0\xa0return\xa0\"hello\xa0\".concat(name);\\n}',\n  },\n});\n",lang:"js"}),a.a.createElement("h3",{id:"\u7b2c\u4e8c\u6b65\uff1a\u4f7f\u7528-eval-\u6267\u884c\u4ee3\u7801"},a.a.createElement("a",{"aria-hidden":"true",href:"#\u7b2c\u4e8c\u6b65\uff1a\u4f7f\u7528-eval-\u6267\u884c\u4ee3\u7801"},a.a.createElement("span",{className:"icon icon-link"})),"\u7b2c\u4e8c\u6b65\uff1a\u4f7f\u7528 eval \u6267\u884c\u4ee3\u7801"),a.a.createElement(o.a,{code:"// \u5b9a\u4e49\u4e00\u4e2a\u7acb\u5373\u6267\u884c\u51fd\u6570\uff0c\u4f20\u5165\u751f\u6210\u7684\u4f9d\u8d56\u5173\u7cfb\u56fe\n(function(graph) {\n  // \u91cd\u5199 require \u51fd\u6570\n  function require(moduleId) {\n    (function(code) {\n      console.log(code);\n      eval(code);\n    })(graph[moduleId].code);\n  }\n  // \u4ece\u5165\u53e3\u6587\u4ef6\u5f00\u59cb\u6267\u884c\n  require('./src/index.js');\n})({\n  './src/index.js': {\n    dependencies: {\n      './hello.js': './src/hello.js',\n      code:\n        '\"use strict\";\\n\\nvar _hello = require(\"./hello.js\");\\n\\ndocument.write((0, _hello.say)(\"webpack\"));',\n    },\n  },\n  './src/hello.js': {\n    dependencies: {},\n    code:\n      '\"use\xa0strict\";\\n\\nObject.defineProperty(exports,\xa0\"__esModule\",\xa0{\\n\xa0\xa0value:\xa0true\\n});\\nexports.say\xa0=\xa0say;\\n\\nfunction\xa0say(name)\xa0{\\n\xa0\xa0return\xa0\"hello\xa0\".concat(name);\\n}',\n  },\n});\n",lang:"js"}),a.a.createElement("h3",{id:"\u7b2c\u4e09\u6b65\uff1a\u4f9d\u8d56\u5bf9\u8c61\u5bfb\u5740\u6620\u5c04\uff0c\u83b7\u53d6-exports-\u5bf9\u8c61"},a.a.createElement("a",{"aria-hidden":"true",href:"#\u7b2c\u4e09\u6b65\uff1a\u4f9d\u8d56\u5bf9\u8c61\u5bfb\u5740\u6620\u5c04\uff0c\u83b7\u53d6-exports-\u5bf9\u8c61"},a.a.createElement("span",{className:"icon icon-link"})),"\u7b2c\u4e09\u6b65\uff1a\u4f9d\u8d56\u5bf9\u8c61\u5bfb\u5740\u6620\u5c04\uff0c\u83b7\u53d6 exports \u5bf9\u8c61"),a.a.createElement(o.a,{code:"// \u5b9a\u4e49\u4e00\u4e2a\u7acb\u5373\u6267\u884c\u51fd\u6570\uff0c\u4f20\u5165\u751f\u6210\u7684\u4f9d\u8d56\u5173\u7cfb\u56fe\n(function(graph) {\n  // \u91cd\u5199 require \u51fd\u6570\n  function require(moduleId) {\n    // \u627e\u5230\u5bf9\u5e94 moduleId \u7684\u4f9d\u8d56\u5bf9\u8c61\uff0c\u8c03\u7528 require \u51fd\u6570\uff0ceval \u6267\u884c\uff0c\u62ff\u5230 exports \u5bf9\u8c61\n    function localRequire(relativePath) {\n      return require(graph[moduleId].dependencies[relativePath]); // {__esModule: true, say: f say(name)}\n    }\n    // \u5b9a\u4e49 exports \u5bf9\u8c61\n    var exports = {};\n\n    (function(require, exports, code) {\n      // CommonJS \u8bed\u6cd5\u4f7f\u7528 module.exports \u66b4\u9732\u5b9e\u73b0\uff0c\u6211\u4eec\u4f20\u5165\u7684 exports \u5bf9\u8c61\u4f1a\u6355\u83b7\u4f9d\u8d56\u5bf9\u8c61\uff08Hello.js\uff09\u66b4\u9732\u7684\u5b9e\u73b0\uff08exports.say = say\uff09\u5e76\u5199\u5165\n      eval(code);\n    })(localRequire, exports, graph[moduleId].code);\n\n    return exports;\n  }\n  // \u4ece\u5165\u53e3\u6587\u4ef6\u5f00\u59cb\u6267\u884c\n  require('./src/index.js');\n})({\n  './src/index.js': {\n    dependencies: {\n      './hello.js': './src/hello.js',\n      code:\n        '\"use strict\";\\n\\nvar _hello = require(\"./hello.js\");\\n\\ndocument.write((0, _hello.say)(\"webpack\"));',\n    },\n  },\n  './src/hello.js': {\n    dependencies: {},\n    code:\n      '\"use\xa0strict\";\\n\\nObject.defineProperty(exports,\xa0\"__esModule\",\xa0{\\n\xa0\xa0value:\xa0true\\n});\\nexports.say\xa0=\xa0say;\\n\\nfunction\xa0say(name)\xa0{\\n\xa0\xa0return\xa0\"hello\xa0\".concat(name);\\n}',\n  },\n});\n",lang:"js"}),a.a.createElement("hr",null),a.a.createElement("p",null,a.a.createElement("strong",null,"\u53c2\u8003\u8d44\u6599\uff1a")),a.a.createElement("ul",null,a.a.createElement("li",null,a.a.createElement("a",{href:"https://juejin.im/post/5e116fce6fb9a047ea7472a6",target:"_blank",rel:"noopener noreferrer"},"Webpack \u6253\u5305\u539f\u7406\uff1f\u770b\u5b8c\u8fd9\u7bc7\u4f60\u5c31\u61c2\u4e86\uff01\uff082020-01-06\uff09",a.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg","aria-hidden":!0,x:"0px",y:"0px",viewBox:"0 0 100 100",width:"15",height:"15",className:"__dumi-default-external-link-icon"},a.a.createElement("path",{fill:"currentColor",d:"M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"}),a.a.createElement("polygon",{fill:"currentColor",points:"45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"})))))))}}}]);