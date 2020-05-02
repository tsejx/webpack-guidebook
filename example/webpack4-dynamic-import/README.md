# webpack4-dynamic-import

安装 babel 及其相关 presets 和 plugins

```bash
npm install @babel/plugin-syntax-dynamic-import
```

使用这样的写法，返回的是 Promise：

```js
import('./foo.js')
  .then(res => /* do something */)
  .catch(/* catch error */)
```

实际上是使用 JSONP 的请求获取资源的。
