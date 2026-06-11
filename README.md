# Pi Web — Web UI for Pi Coding Agent

一个基于 Next.js 的 Web 界面，用于 [pi coding agent](https://github.com/LQFHUB/pi-coding-agent) 的交互式编程协作。

## 快速开始

```bash
npx @npm-liqingfeng/pi-web -p 13030
```

或者本地开发：

```bash
npm run dev
```

## 功能

- **对话界面** — 与 AI 编程助手实时交互
- **会话管理** — 历史会话树状浏览、分支管理
- **模型切换** — 在线切换 AI 模型和推理强度
- **工具控制** — 启停 AI 的工具权限（读/写/执行）
- **计划模式** — `/plan` 只读分析模式，防止 AI 直接写代码
- **文件浏览** — 内置文件查看器
- **主题** — 钢蓝配色的暗色主题
- **声音通知** — 任务完成提示音

## 技术栈

|  |  |
|---|-----|
| 框架 | Next.js 16 (App Router) |
| AI 引擎 | @earendil-works/pi-coding-agent |
| 语言 | TypeScript |
| 端口 | 13030 |

## 发布

```bash
npm run release
```

包名：`@npm-liqingfeng/pi-web`

## License

MIT
