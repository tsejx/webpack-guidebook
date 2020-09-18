(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[14],{CvoW:function(e,l,n){"use strict";n.r(l);var a=n("q1tI"),t=n.n(a),c=(n("B2uJ"),n("+su7"),n("qOys")),r=n.n(c);n("5Yjd");l["default"]=function(){return t.a.createElement(t.a.Fragment,null,t.a.createElement("div",{className:"markdown"},t.a.createElement("h1",{id:"plugins-\u63d2\u4ef6"},t.a.createElement("a",{"aria-hidden":"true",href:"#plugins-\u63d2\u4ef6"},t.a.createElement("span",{className:"icon icon-link"})),"plugins \u63d2\u4ef6"),t.a.createElement("p",null,t.a.createElement("a",{href:"https://webpack.docschina.org/configuration/plugins/",target:"_blank",rel:"noopener noreferrer"},"\u4e2d\u6587\u6587\u6863",t.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg","aria-hidden":!0,x:"0px",y:"0px",viewBox:"0 0 100 100",width:"15",height:"15",className:"__dumi-default-external-link-icon"},t.a.createElement("path",{fill:"currentColor",d:"M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"}),t.a.createElement("polygon",{fill:"currentColor",points:"45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"})))),t.a.createElement("p",null,"\u7528\u4e8e\u6269\u5c55 Webpack \u529f\u80fd\u3002"),t.a.createElement("p",null,"\u4f7f\u7528 Plugin \u7684\u96be\u70b9\u5728\u4e8e\u638c\u63e1 Plugin \u672c\u8eab\u63d0\u4f9b\u7684\u914d\u7f6e\u9879\uff0c\u800c\u4e0d\u662f\u5982\u4f55\u5728 Webpack \u4e2d\u63a5\u5165 Plugin\u3002"),t.a.createElement("h2",{id:"minicssextractplugin"},t.a.createElement("a",{"aria-hidden":"true",href:"#minicssextractplugin"},t.a.createElement("span",{className:"icon icon-link"})),"MiniCssExtractPlugin"),t.a.createElement("p",null,t.a.createElement("strong",null,"\u7528\u4e8e\u63d0\u53d6 CSS")),t.a.createElement("ul",null,t.a.createElement("li",null,t.a.createElement("code",null,"extract-text-webpack-plugin")," \u6839\u636e\u521b\u5efa\u5b9e\u4f8b\u6216\u914d\u7f6e\u591a\u4e2a\u5165\u53e3 chunk")),t.a.createElement("p",null,"\u6bd4\u5982\u4e00\u4e2a\u5165\u53e3\u6587\u4ef6 => \u6240\u6709 CSS \u63d0\u53d6\u5728\u4e00\u4e2a\u6837\u5f0f\u6587\u4ef6\u91cc"),t.a.createElement("ul",null,t.a.createElement("li",null,t.a.createElement("code",null,"min-css-extract-plugin")," \u9ed8\u8ba4\u5bf9\u6837\u5f0f\u8fdb\u884c\u6a21\u5757\u62c6\u5206\u3002")),t.a.createElement(r.a,{code:'// extract-text-webpack-plugin\nconfig.module.rules.push({\n    test: /\\.(scs|sas|cs)s$/,\n    use: ExtractTextPlugin.extrac({\n        use: [\n            "css-loader",\n            {\n                loader: "postcss-loader",\n                options: {\n                    plugins: [\n                        require(\'autoprefixer\')({ // \u6dfb\u52a0\u524d\u7f00\n                            browsers: CSS_BROWSERS\n                        })\n                    ],\n                    minimize: true\n                }\n            },\n            "sass-loader"\n        ]\n    })\n})\nconfig.plugins.push(new ExtractTextPlugin({\n    filename: \'css/[name].css\',\n    disable: false,\n    allChunks: true\n}))\n',lang:"js"}),t.a.createElement("p",null,t.a.createElement("code",null,"postcss-loader")," \u7528\u4e8e\u4e0e\u5df2\u6709\u5de5\u5177\u96c6\u6210\u4e00\u8d77\u4f7f\u7528\uff0c\u5f88\u5c11\u6709\u5355\u72ec\u4f7f\u7528\u3002"),t.a.createElement("p",null,"\u901a\u5e38\u4f1a\u914d\u5408 ",t.a.createElement("code",null,"autoprefixer")," \u6765\u6dfb\u52a0\u4e2a\u6d4f\u89c8\u5668\u7684\u524d\u7f00\uff0c\u4ee5\u8fbe\u5230\u66f4\u597d\u7684\u517c\u5bb9\u3002"),t.a.createElement("p",null,"\u5728\u6df1\u5165\u5c31\u662f ",t.a.createElement("code",null,"cssnext")," \u5141\u8bb8\u5f00\u53d1\u8005\u81ea\u5b9a\u4e49\u5c5e\u6027\u548c\u53d8\u91cf\u3002"),t.a.createElement(r.a,{code:"// mini-css-extract-plugin\nconfig.module.rules.push({\n    test: /\\.(scs|cs)s$/,\n    use: [\n        {\n            loader: MiniExtractPlugin.loader\n        },\n        \"css-loader\",\n        {\n            loader: 'postcss-loader',\n            options: {\n                plugins: [\n                    require('autofixer')({\n                        browsers: CSS_BROWSERS\n                    })\n                ]\n            }\n        }\uff0c\n        \"sass-loader\"\n    ]\n})\n",lang:"js"}),t.a.createElement("h2",{id:"optimizecssassetswebpackplugin"},t.a.createElement("a",{"aria-hidden":"true",href:"#optimizecssassetswebpackplugin"},t.a.createElement("span",{className:"icon icon-link"})),"OptimizeCssAssetsWebpackPlugin"),t.a.createElement("p",null,t.a.createElement("strong",null,"\u7528\u4e8e\u538b\u7f29 CSS \u6587\u4ef6\u3002")),t.a.createElement(r.a,{code:"new OptimizeCssAssetsPlugin({\n    assetNameRegExp: /\\.optimize\\.css$/g,\n    cssProcessor: require('cssnano'),\n    cssProcessorpluginOptions: {\n        preset: ['default', { discardComments: { removeAll: true } }],\n        // autoprefixer: { browsers: CSS_BROWSERS } \u4e5f\u53ef\u6307\u5b9a\u524d\u7f00\n    }\n})\n",lang:"js"}),t.a.createElement("h2",{id:"splitchunksplugin--runtimechunkplugin"},t.a.createElement("a",{"aria-hidden":"true",href:"#splitchunksplugin--runtimechunkplugin"},t.a.createElement("span",{className:"icon icon-link"})),"SplitChunksPlugin / RuntimeChunkPlugin"),t.a.createElement("p",null,t.a.createElement("code",null,"CommonsChunkPlugin")," \u66ff\u4ee3\u54c1\uff0c\u7528\u4e8e\u63d0\u53d6\u516c\u5171\u6a21\u5757\u3002"),t.a.createElement("ul",null,t.a.createElement("li",null,t.a.createElement("code",null,"chunks"),"\uff1a\u8868\u793a\u663e\u793a\u5757\u7684\u8303\u56f4\uff0c\u4e09\u4e2a\u53ef\u9009\u503c ",t.a.createElement("code",null,"all"),"\uff08\u5168\u90e8\u5757\uff09 ",t.a.createElement("code",null,"async"),"\uff08\u6309\u9700\u52a0\u8f7d\u5757\uff09 ",t.a.createElement("code",null,"initial"),"\uff08\u521d\u59cb\u5757\uff09"),t.a.createElement("li",null,t.a.createElement("code",null,"minSize"),"\uff1a\u8868\u793a\u5728\u538b\u7f29\u524d\u7684\u6700\u5c0f\u6a21\u5757\u5927\u5c0f\uff08\u9ed8\u8ba4\u4e3a 0\uff09"),t.a.createElement("li",null,t.a.createElement("code",null,"maxSize"),"\uff1a\u8868\u793a\u5728\u538b\u7f29\u524d\u7684\u6700\u5927\u6a21\u5757\u5927\u5c0f"),t.a.createElement("li",null,t.a.createElement("code",null,"minChunks")," \uff1a\u8868\u793a\u88ab\u5f15\u7528\u6b21\u6570\uff08\u9ed8\u8ba4\u4e3a 1\uff09"),t.a.createElement("li",null,t.a.createElement("code",null,"maxAsyncRequests"),"\uff1a\u8868\u793a\u6700\u5927\u7684\u6309\u9700\uff08\u5f02\u6b65\uff09\u52a0\u8f7d\u6b21\u6570\uff08\u9ed8\u8ba4\u4e3a 1\uff09"),t.a.createElement("li",null,t.a.createElement("code",null,"maxInitialRequests"),"\uff1a\u6700\u5927\u7684\u521d\u59cb\u5316\u52a0\u8f7d\u6b21\u6570\uff08\u9ed8\u8ba4\u4e3a 1\uff09"),t.a.createElement("li",null,t.a.createElement("code",null,"name"),"\uff1a\u62c6\u5206\u51fa\u6765\u5757\u7684\u540d\u5b57\uff08Chunk Names\uff09\u9ed8\u8ba4\u7531\u5757\u540d\u548c hash \u503c\u81ea\u52a8\u751f\u6210"),t.a.createElement("li",null,t.a.createElement("code",null,"cacheGroups"),"\uff1a\u7f13\u5b58\u7ec4")),t.a.createElement("p",null,"\u5982\u679c\u4e0d\u5728\u7f13\u5b58\u7ec4\u4e2d\u91cd\u65b0\u8d4b\u503c\uff0c\u7f13\u5b58\u7ec4\u9ed8\u8ba4\u7ee7\u627f\u4e0a\u8ff0\u9009\u9879\uff0c\u4f46\u8fd8\u6709\u4e00\u4e9b\u53c2\u6570\u5fc5\u987b\u5728\u7f13\u5b58\u7ec4\u8fdb\u884c\u914d\u7f6e\u3002"),t.a.createElement("ul",null,t.a.createElement("li",null,t.a.createElement("code",null,"priority"),"\uff1a\u8868\u793a\u7f13\u5b58\u7684\u4f18\u5148\u7ea7"),t.a.createElement("li",null,t.a.createElement("code",null,"test"),"\uff1a\u7f13\u5b58\u7ec4\u7684\u89c4\u5219\uff0c\u8868\u793a\u7b26\u5408\u6761\u4ef6\u7684\u653e\u5165\u5f53\u524d\u7f13\u5b58\u7ec4\uff0c\u503c\u53ef\u662f ",t.a.createElement("code",null,"function")," ",t.a.createElement("code",null,"boolean")," ",t.a.createElement("code",null,"string")," ",t.a.createElement("code",null,"RegExp")," \u9ed8\u8ba4\u4e3a\u7a7a"),t.a.createElement("li",null,t.a.createElement("code",null,"reuseExistingChunk"),"\uff1a\u8868\u793a\u53ef\u4ee5\u4f7f\u7528\u5df2\u7ecf\u5b58\u5728\u7684\u5757\uff0c\u5373\u5982\u679c\u6ee1\u8db3\u6761\u4ef6\u7684\u5757\u5df2\u7ecf\u5b58\u5728\u5c31\u4f7f\u7528\u5df2\u6709\u7684\uff0c\u4e0d\u518d\u521b\u5efa\u4e00\u4e2a\u65b0\u7684\u5757")),t.a.createElement("h2",{id:"hotmodulereplacementplugin"},t.a.createElement("a",{"aria-hidden":"true",href:"#hotmodulereplacementplugin"},t.a.createElement("span",{className:"icon icon-link"})),"HotModuleReplacementPlugin"),t.a.createElement("p",null,t.a.createElement("strong",null,"\u70ed\u66f4\u65b0\u66ff\u6362\u3002")),t.a.createElement("h2",{id:"htmlwebpackplugin"},t.a.createElement("a",{"aria-hidden":"true",href:"#htmlwebpackplugin"},t.a.createElement("span",{className:"icon icon-link"})),"HtmlWebpackPlugin"),t.a.createElement("p",null,t.a.createElement("strong",null,"\u63d2\u5165\u5f15\u7528\uff0c\u6839\u636e\u6a21\u7248\u751f\u6210 HTML\u3002")),t.a.createElement("ul",null,t.a.createElement("li",null,t.a.createElement("code",null,"filename"),"\uff1a\u8868\u793a\u8f93\u51fa\u7684\u6587\u4ef6\u540d"),t.a.createElement("li",null,t.a.createElement("code",null,"template"),"\uff1a\u6a21\u7248\u6587\u4ef6"),t.a.createElement("li",null,t.a.createElement("code",null,"removeComments"),"\uff1a\u79fb\u9664 HTML \u4e2d\u7684\u6ce8\u91ca"),t.a.createElement("li",null,t.a.createElement("code",null,"collapseWhitespace"),"\uff1a\u5220\u9664\u7a7a\u767d\u7b26\u4e0e\u6362\u884c\u7b26"),t.a.createElement("li",null,t.a.createElement("code",null,"inlineSource"),"\uff1a\u63d2\u5165\u5230 HTML \u7684 CSS\u3001JS \u6587\u4ef6\u8981\u5185\u8054\uff0c\u5373\u4e0d\u662f\u4ee5 link\u3001script \u5f62\u5f0f\u5f15\u5165"),t.a.createElement("li",null,t.a.createElement("code",null,"inject"),"\uff1a\u662f\u5426\u80fd\u6ce8\u5165\u5185\u5bb9\u5230\u8f93\u51fa\u7684\u9875\u9762"),t.a.createElement("li",null,t.a.createElement("code",null,"chunks"),"\uff1a\u6307\u5b9a\u63d2\u5165\u67d0\u4e9b\u6a21\u5757"),t.a.createElement("li",null,t.a.createElement("code",null,"hash"),"\uff1a\u6bcf\u6b21\u4f1a\u5728\u63d2\u5165\u7684\u6587\u4ef6\u540e\u9762\u52a0\u4e0a hash\uff0c\u7528\u4e8e\u5904\u7406\u7f13\u5b58"),t.a.createElement("li",null,"\u5176\u4ed6\uff1a",t.a.createElement("code",null,"favicon"),"\u3001",t.a.createElement("code",null,"meta"),"\u3001",t.a.createElement("code",null,"title"))),t.a.createElement(r.a,{code:"new HtmlWebPackPlugin({\n  filename: path.resolve(__dirname, '../assets/index.html'),\n  template: path.resolve(__dirname,\"../views/temp.html\"),\n  minify:{ // \u538b\u7f29HTML\u6587\u4ef6\u3000\n     removeComments:true,\n     collapseWhitespace:true\n  },\n  inlineSource:  '.(js|css)',\n  inject: false,\n  chunks: ['vendors', 'index'],\n  hash:true,\n  // favicon\u3001meta\u3001title\u7b49\u90fd\u53ef\u4ee5\u914d\u7f6e\uff0c\u9875\u9762\u5185\u4f7f\u7528\u300c<%= htmlWebpackPlugin.options.title %>\u300d\u5373\u53ef\n})\n",lang:"js"}),t.a.createElement("h2",{id:"uglifyjswebpackplugin"},t.a.createElement("a",{"aria-hidden":"true",href:"#uglifyjswebpackplugin"},t.a.createElement("span",{className:"icon icon-link"})),"UglifyjsWebpackPlugin"),t.a.createElement("p",null,t.a.createElement("strong",null,"\u7528\u4e8e\u4ee3\u7801\u538b\u7f29\u3002")," \u9ed8\u8ba4\u4f7f\u7528 ",t.a.createElement("code",null,"optimization.minimizer")),t.a.createElement("ul",null,t.a.createElement("li",null,t.a.createElement("code",null,"cache"),"\uff1aBoolean / String \u5b57\u7b26\u5373\u7f13\u5b58\u6587\u4ef6\u5b58\u653e\u7684\u8def\u5f84"),t.a.createElement("li",null,t.a.createElement("code",null,"test"),"\uff1a\u5339\u914d\u67d0\u4e9b\u6587\u4ef6"),t.a.createElement("li",null,t.a.createElement("code",null,"parallel"),"\uff1a\u542f\u7528\u591a\u7ebf\u7a0b\u5e76\u884c\u63d0\u9ad8\u7f16\u8bd1\u901f\u5ea6"),t.a.createElement("li",null,t.a.createElement("code",null,"output.comments"),"\uff1a\u5220\u9664\u6240\u6709\u6ce8\u91ca"),t.a.createElement("li",null,t.a.createElement("code",null,"compress.warnings"),"\uff1a\u63d2\u4ef6\u5220\u9664\u65e0\u7528\u4ee3\u7801\u4e0d\u62a5\u9519"),t.a.createElement("li",null,t.a.createElement("code",null,"compress.drop_console"),"\uff1a\u8fc7\u6ee4 ",t.a.createElement("code",null,"console")," \u4ee3\u7801"),t.a.createElement("li",null,"\u5176\u4ed6\uff1a\u5b9a\u4e49\u538b\u7f29\u7a0b\u5ea6\u3001\u63d0\u51fa\u591a\u6b21\u51fa\u73b0\u4f46\u6ca1\u6709\u53d8\u91cf\u7684\u503c\u7684\u914d\u7f6e")),t.a.createElement("h2",{id:"preloadwebpackplugin"},t.a.createElement("a",{"aria-hidden":"true",href:"#preloadwebpackplugin"},t.a.createElement("span",{className:"icon icon-link"})),"PreloadWebpackPlugin"),t.a.createElement("p",null,t.a.createElement("strong",null,"\u7528\u4e8e\u9884\u52a0\u8f7d\u8d44\u6e90\u3002")," \u5339\u914d\u5176\u4ed6\u9875\u9762\u53ef\u80fd\u7528\u5230\u7684\u8d44\u6e90\u8fdb\u884c\u9884\u5148\u52a0\u8f7d\uff0c\u4ece\u800c\u8fbe\u5230\u65e0 loading\uff0c\u7528\u6237\u65e0\u611f\u77e5\u7684\u8df3\u8f6c\u3002"),t.a.createElement(r.a,{code:"// 1. \u914d\u7f6e\u7f6e\u4e8e HtmlWebpackPlugin \u4e4b\u540e\n// 2. Webpack4\u4e4b\u540e\uff0c\u8bf7\u4f7f\u7528\u6700\u65b0\u7248 npm install --save-dev preload-webpack-plugin@next\nnew PreloadWebpackPlugin({\n    rel: 'prefetch',\n    as: 'script',\n    // as(entry){\n    //   if(/\\.css$/.test(entry)) return 'style';\n    //   return 'script'\n    // }\n    include: 'asyncChunks',\n    // fileBlacklist: [\"index.css\"]\n    fileBlackList: [/\\index.css|index.js|vendors.js]/,/\\.whatever/]\n})\n",lang:"js"}),t.a.createElement("h2",{id:"webpackbundleanalyzer"},t.a.createElement("a",{"aria-hidden":"true",href:"#webpackbundleanalyzer"},t.a.createElement("span",{className:"icon icon-link"})),"WebpackBundleAnalyzer"),t.a.createElement("p",null,t.a.createElement("strong",null,"\u6784\u5efa\u7ed3\u679c\u5206\u6790\u3002")," \u6709\u5229\u4e8e\u6211\u4eec\u5feb\u901f\u67e5\u627e\u5305\u8fc7\u5927\u3001\u5185\u5bb9\u662f\u5426\u91cd\u590d\u3001\u95ee\u9898\u5b9a\u4f4d\u4f18\u5316\u7b49\u3002"),t.a.createElement("ul",null,t.a.createElement("li",null,t.a.createElement("code",null,"analyzerHost")," ",t.a.createElement("code",null,"analyzerPort"),"\uff1a\u81ea\u5b9a\u4e49\u914d\u7f6e\u6253\u5f00\u7684\u5730\u5740\u3001\u7aef\u53e3\uff0c\u9ed8\u8ba4\u4f7f\u7528 127.0.0.1:8888"),t.a.createElement("li",null,t.a.createElement("code",null,"reportFilename"),"\uff1a\u62a5\u544a\u751f\u6210\u7684\u8def\u5f84\uff0c\u9ed8\u8ba4\u4ee5\u9879\u76ee\u7684 ",t.a.createElement("code",null,"output.path")," \u8f93\u51fa"),t.a.createElement("li",null,t.a.createElement("code",null,"openAnalyzer"),"\uff1a\u662f\u5426\u8981\u81ea\u52a8\u6253\u5f00\u5206\u6790\u7a97\u53e3")),t.a.createElement("h2",{id:"copywebpackplugin"},t.a.createElement("a",{"aria-hidden":"true",href:"#copywebpackplugin"},t.a.createElement("span",{className:"icon icon-link"})),"CopyWebpackPlugin"),t.a.createElement("p",null,t.a.createElement("strong",null,"\u6587\u4ef6\u62f7\u8d1d"))))}}}]);