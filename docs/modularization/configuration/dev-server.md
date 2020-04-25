---
title: devServer 开发服务器
order: 3
group:
  title: 配置
  order: 2
nav:
  title: 配置
  order: 2
---

# devServer 开发服务器

[中文文档](https://webpack.docschina.org/configuration/dev-server/)

* 提供 HTTP 服务，而非使用本地文件预览
* 监听文件的变化并自动刷新网页，做到实时预览
* 支持 SourceMap 方便调试

📌 devServer 会将 Webpack 构建出的文件保存在内存中

Webpack 在启动时可以开启**监听模式**，之后 Webpack 会监听本地文件系统的变化，在发生变化时重新构建出新的结果。Webpack 默认关闭监听模式，我们可以在启动 Webpack 时通过 `webpack --watch` 来开启监听模式。

通过 devServer 启动的 Webpack 会开启监听模式，当发生变化时重新执行构建，然后通知 devServer 会让 Webpack 在构建出的 JavaScript 代码里注入一个代理客户端用于控制网页，网页和 devServer 之间通过 WebSocket 协议通信，以方便 devServer 主动向客户端发送命令。devServer 在收到来自 Webpack 的文件变化通知时，通过注入的客户端控制网页刷新。

如果尝试修改 `index.html` 文件并保存，则我们会发现这并不会触发以上机制，导致这个问题的原因是 Webpack 在启动时会以配置的 entry 为入口去递归解析出 entry 所依赖的文件，只有 entry 本身和依赖的文件才会被 Webpack 添加到监听列表里。而 `index.html` 文件时脱离了 JavaScript 模块化系统的，所以 Webpack 不知道他的存在。

## hot

配置是否启用**模块热替换**功能。

默认行为是发现源码变更后自动刷新整个页面来做到实时预览，开启后，将在不刷新页面的情况下通过新模块替换老模块来做到实时预览。

**模块热替换**

除了通过重新刷新整个网页来实现实时预览，devServer 还有一种被称作模块热替换的刷新技术。模块热替换能做到在不重新加载整个网页的情况下，通过将己更新的模块替换老模块，再重新执行一次来实现实时预览。模块热替换相对于默认的刷新机制能提供更快的响应速度和更好的开发体验。模块热替换默认是关闭的，要开启模块热替换，我们只需在启动 devServer 时带上 `--hot` 参数，重启 devServer 后再去更新文件就能体验到模块热替换的神奇了。

## inline

devServer 的实时预览功能依赖一个注入页面里的代理客户端，去接收来自 devServer 的命令并负责刷新网页的工作。 `devServer.inline` 用于配置是否将这个代理客户端**自动注入**将运行在页面中的 Chunk 里，默认自动注入。 devServer 会根据我们是否开启 inline 来调整它的自动刷新策略。

- 如果开启 inline，则 devServer 会在构建变化后的代码时通过**代理客户端**控制网页刷新。
- 如果关闭 inline，则 devServer 将无法直接控制要开发的网页。这时它会通过 iframe 的方式去运行要开发的网页。在构建完变化后的代码时，会通过刷新 iframe 来实现实时预览，但这时我们需要去 `http://localhost:8080/webpack­-dev-server/` 实时预览自己的网页。

如果想使用 devServer 的模块热替换机制去实现实时预览，则最方便的方法是直接开启 inline 。

## historyApiFallback

用于方便地开发使用 HTML5 History API 的单页应用。

这类单页应用要求服务器在针对任何命中的路由时，都返回一个对应的 HTML 文件。

例如在访问 `http://localhost/user` 和 `http://localhost/home` 时都返回 `index.html` 文件，浏览器端的 JavaScript 代码会从 URL 里解析出当前页面的状态，显示对应的界面。

```js
historyApiFallback: true
```

只能用于只有一个 HTML 文件的应用。

如果是多页应用。

```js
historyApiFallback: {
	// 使用正则匹配命中路由
    rewrites: [
        // /user 开头的都返回 user.html
        { from: /^\/user/, to: '/user.html'},
        { from: /^\/game/, to: '.game.html'},
        // 其他的都返回 index.html
        { from: /./, to: '/index.html'}
    ]
}
```

## contentBase

配置 devServer HTTP 服务器的文件根目录。默认为当前执行目录，一般不必设置，除非有额外的文件需要被 devServer 服务。

例如将 public 目录设置成 devServer 服务器的文件根目录。

```js
devServer: {
    contentBase: path.join(__dirname, 'public')
}
```

devServer 服务器通过 HTTP 服务器暴露文件的方式可分为两类：

*  暴露本地文件
* 暴露 Webpack 构建出的结果，由于构建出的结果交给了 devServer，所以我们在使用 devServer 时，会在本地找不到构建出的文件

## headers

配置 HTTP 相应中注入一些 HTTP 响应头。

```js
devServer: {
    headers: {
        'X-foo': 'bar'
    }
}
```

## host

配置项用于配置 devServer 服务监听的地址，只能通过命令行参数传入。

## port

用于配置 devServer 服务监听的端口，默认使用 8080 端口。

## allowedHosts

配置白名单列表，只有 HTTP 请求的 HOST 在列表里才能正常返回。

```js
allowedHosts: [
    // 匹配单个域名
    'host.com',
    'sub.host.com',
    // host2.com 和所有的子域名 *.host2.com 都将匹配
    '.host2.com'
]
```

## disableHostCheck

用于配置是否关闭用于 DNS 重新绑定的 HTTP 请求的 HOST 检查。

devServer 默认值接收来自本地的请求，关闭后可以接收来自任意 HOST 的请求。它通常用于搭配 `--host 0.0.0.0` 使用，因为想让其他设备访问自己的本地服务，但访问时是直接通过 IP 地址访问而不是通过 HOST 访问，所以需要关闭 HOST 检查。

## https

devServer 默认使用 HTTP 服务。

某些情况必须使用 HTTPS，例如 HTTP2 和 ServiceWorker 就必须运行在 HTTPS 上。自动生成证书。

```js
devServer: {
    https: true
}
```

如果想使用自己的证书。

```js
devServer: {
    https: {
        key: fs.readFileSync('path/to/server.key'),
        cert: fs.readFileSync('path/to/server.crt'),
        ca: fs.readFileSync('path/to/ca.pem')
    }
}
```

## clientLogLevel

配置客户端的日志登记，这回影响到我们在浏览器开发者工具控制台里看到的日志内容。

可取值：

* none - 不输出
* error
* warning
* info（默认）

## compress

配置是否启用 Gzip 压缩，默认为 `false`。

## open

启动项目后自动打开系统默认浏览器。