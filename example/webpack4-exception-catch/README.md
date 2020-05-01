# webpack4-exception-catch

## 构建异常和中断处理

webpack4 之前的版本构建失败不会抛出错误码（error code）

Node.js 中的 process.exit 规范

- 0 表示成功完成，回调函数中，err 为 null
- 非 0 表示执行失败，回调函数中，err 不为 null，err.code 就是传给 exit 的数字

## 如何主动捕获并处理构建错误

compiler 在每次构建结束后会触发 done 这个 hook

process.exit 主动处理构建报错