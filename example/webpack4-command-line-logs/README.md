# webpack4-command-line-logs

## 统计

| Preset        | Alternative | Description                   |
| ------------- | ----------- | ------------------------------|
| `errors-only` | `none`      | 只有发生错误时输出              |
| `minimal`     | `none`      | 只在发生错误或有新的编译时输出   |
| `none`        | `false`     | 没有输出                       |
| `normal`      | `true`      | 标准输出                       |
| `verbose`     | `none`      | 全部数据                       |

## 如何优化命令行的构建日志

使用 friendly-errors-webpack-plugin

- success 构建成功
- warning 构建警告
- error 构建错误

stats 设置成 `errors-only`
