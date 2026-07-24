[English](README.md) · [繁體中文](README_zh-Hant.md) · 简体中文

# EPUB 繁简转换工具

一个基于 React 和 Next.js 的网页工具，可将 EPUB 文件中的中文在繁体与简体之间互转。它提供友好的界面，支持拖拽上传、批量转换、实时进度与单独 / 批量下载。**所有转换都在你的浏览器本地完成，文件不会上传到任何服务器。**

## 简介

这是一个基于 React 和 Next.js 的 EPUB 繁简转换工具，支持将 EPUB 文件中的繁体中文转换为简体中文，或简体中文转换为繁体中文。工具提供了友好的用户界面，支持拖拽上传、批量转换和下载功能。

## 功能

- **繁简互转**：支持繁体转简体，或简体转繁体。
- **拖拽上传**：直接将 EPUB 文件拖入上传区域。
- **批量转换**：一次上传多个 EPUB 文件并批量转换。
- **实时进度**：转换过程中显示实时进度条与动画。
- **灵活下载**：转换完成后可单独或批量下载文件。
- **暂停 / 继续**：转换过程中可暂停队列（当前文件处理完即停），再点击继续从中断处恢复，已转换的结果不会丢失。
- **清空全部**：结果区提供「清空全部」按钮，经二次确认后一次性清空上传列表与转换结果，方便快速开始新一批任务。
- **主题支持**：通过 next-themes 提供浅色 / 深色 / 跟随系统主题。
- **本地私密**：转换在浏览器内完成，文件不会离开你的电脑。下载完成的对象 URL 会立即释放，剪贴板分享的链接在页面卸载时统一回收，内存占用始终有界。

## 技术栈

- **前端**：React 19、Next.js 16（Pages Router）、TypeScript、Tailwind CSS v4、Framer Motion
- **工具库**：JSZip、opencc-js、Zustand
- **动画**：Framer Motion、react-lottie-player
- **测试**：Vitest
- **运行时**：转换优先在 Web Worker 中执行，保证大文件不冻结 UI
- **状态管理**：全局 UI / 文件 / 转换状态集中在一个 Zustand store 中（按 `ui` / `files` / `converted` / `conversion` 四个 slice 拆分，位于 `src/store`），组件通过选择器订阅，不再层层透传 props。

## 安装

```bash
pnpm install
# 或
npm install
# 或
yarn install
```

## 使用方法

1. **启动开发服务器**

   ```bash
   pnpm dev
   ```

   然后打开终端打印的本地地址（默认 http://localhost:3000）。

2. **选择方向** —— 使用选择器切换「繁 → 简」（`t2s`）或「简 → 繁」（`s2t`）。

3. **添加 EPUB 文件** —— 将 EPUB 文件拖入上传区域，或点击选择。可一次添加多个文件批量转换。

4. **开始转换** —— 点击转换按钮，进度条会实时显示状态。大体积书籍在后台 Web Worker 中处理，界面始终流畅。

5. **下载** —— 单个文件完成后可单独下载，或使用「全部下载」一次获取所有结果。

6. **暂停 / 继续** —— 转换过程中点击「暂停」，当前文件处理完即暂停队列，进度区显示「已暂停」；点击「继续」从中断处恢复。暂停是中性操作，不会丢弃已转换的文件。

7. **清空全部** —— 转换完成后，结果区头部出现「清空全部」按钮（转换中禁用）。点击后弹出确认框，列出将移除的上传列表与结果文件数量；确认后一次性清空两类列表，回到干净的初始状态。

## 配置选项

多数行为由界面控制，但以下几个位置便于在代码中自定义：

- **转换方向** —— `t2s`（繁 → 简）与 `s2t`（简 → 繁）定义在 [`src/utils/opencc.ts`](src/utils/opencc.ts)，当前方向由界面上的 `DirectionSelector` 选择。
- **背景渐变方案** —— 编辑 [`src/config/backgroundSchemes.ts`](src/config/backgroundSchemes.ts)。每个条目是一对 `{ light, dark }` 的 Tailwind 渐变类名字符串，每次会话随机选取（存入 `sessionStorage`）。向数组追加对象即可新增方案。
- **主题** —— 由 `next-themes` 驱动。`ThemeToggle` 组件可切换浅色 / 深色，并自动检测系统偏好；手动选择会存入 `sessionStorage` 的 `theme` 键。
- **转换引擎** —— 核心纯函数 [`convertEpubBuffer(arrayBuffer, direction, onProgress, isCancelled)`](src/utils/zipUtils.ts) 刻意不依赖浏览器 `File` / `FileReader` API，因此可在 Web Worker（[`src/workers/convert.worker.ts`](src/workers/convert.worker.ts)）中运行。若 Worker 创建失败，会自动降级回主线程。

## 开发与测试

常用脚本：

```bash
pnpm install        # 安装依赖
pnpm dev            # 本地开发（Turbopack）
pnpm build          # 生产构建
pnpm start          # 启动生产服务
pnpm typecheck      # 类型检查（tsc --noEmit，严格模式）
pnpm test           # 单元测试（Vitest）
```

**代码检查**：`pnpm lint`（ESLint）当前不可用，因为 typescript-eslint 尚未支持 TypeScript 7；类型安全改由 `pnpm typecheck`（严格 `tsc --noEmit`）把关。

**构建环境注意**：若在强制注入 `--use-system-ca` 等 Node 选项的沙箱环境中运行 `pnpm build`，Turbopack 启动 Worker 时可能报 `ERR_WORKER_INVALID_EXEC_ARGV`。请先剥离该选项（仅保留必要的 shim）再构建；普通本地环境无需此操作。

## 贡献指南

欢迎提交 Issue 或 Pull Request！请确保代码风格一致，并附上详细的改动说明。

## 许可证

本项目采用 MIT 许可证，详情请参阅 [LICENSE](LICENSE) 文件。

## 联系

- 邮箱：byte7956@gmail.com
- GitHub：xlongDev
