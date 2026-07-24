[中文](README_zh.md) · [繁體中文](README_zh-Hant.md) · English

# EPUB Traditional-Simplified Converter

A React + Next.js web tool that converts the Chinese text inside EPUB files between Traditional and Simplified scripts. It offers a friendly UI with drag-and-drop upload, batch conversion, real-time progress, and individual / bulk download. **All conversion runs entirely in your browser — no files are uploaded to any server.**

## Introduction

This is a React and Next.js-based EPUB Traditional-Simplified Chinese converter. It supports converting Traditional Chinese to Simplified Chinese, or Simplified Chinese to Traditional Chinese, inside EPUB files. The tool provides a user-friendly interface with drag-and-drop upload, batch conversion, and download features.

## Features

- **Traditional ⇄ Simplified conversion**: convert Traditional Chinese to Simplified Chinese, or vice versa.
- **Drag-and-drop upload**: drop EPUB files directly onto the upload area.
- **Batch conversion**: upload and convert multiple EPUB files at once.
- **Live progress**: real-time progress bar and animations during conversion.
- **Flexible download**: download each converted file individually or all at once.
- **Pause / resume**: pause the conversion queue mid-run (the current file finishes, then the queue waits) and resume to continue — already-converted results are never lost.
- **Clear all**: a single "Clear all" action in the result area wipes both the upload list and the converted files after a confirmation, so you can start a fresh batch quickly.
- **Theme support**: light / dark / system themes via `next-themes`.
- **Client-side & private**: conversion happens in the browser; nothing leaves your machine. Blob URLs are released as soon as downloads finish, and clipboard-shared URLs are reclaimed when the page unloads, so memory stays bounded.

## Tech Stack

- **Frontend**: React 19, Next.js 16 (Pages Router), TypeScript, Tailwind CSS v4, Framer Motion
- **Libraries**: JSZip, opencc-js, Zustand
- **Animation**: Framer Motion, react-lottie-player
- **Testing**: Vitest
- **Runtime**: conversion runs in a Web Worker when available, keeping the UI responsive for large books
- **State**: global UI / file / conversion state is centralized in a Zustand store, split into `ui` / `files` / `converted` / `conversion` slices under `src/store`; components subscribe via selectors instead of prop drilling.

## Installation

```bash
pnpm install
# or
npm install
# or
yarn install
```

## Usage

1. **Start the dev server**

   ```bash
   pnpm dev
   ```

   Then open the printed local URL (default http://localhost:3000).

2. **Choose a direction** — use the selector to pick Traditional → Simplified (`t2s`) or Simplified → Traditional (`s2t`).

3. **Add EPUB files** — drag EPUB files into the upload area, or click to select them. You may add multiple files for batch conversion.

4. **Convert** — click the convert button. A progress bar shows the live status. Large books are processed in a background Web Worker so the UI stays responsive.

5. **Download** — once a file finishes, download it individually, or use "download all" to grab everything at once.

6. **Pause / resume** — while converting, click **暂停** to pause the queue after the current file; the progress area shows "已暂停". Click **继续** to resume from where it stopped. Pausing is a neutral action and never discards the files already converted.

7. **Clear all** — after conversion, the result area header shows a **清空全部** button (disabled while converting). Clicking it opens a confirmation dialog listing how many upload-list and result files will be removed; confirming clears both lists at once and returns you to a clean upload state.

## Configuration Options

Most behavior is driven by the UI, but a few areas are easy to customize in code:

- **Conversion direction** — `t2s` (Traditional → Simplified) and `s2t` (Simplified → Traditional) are defined in [`src/utils/opencc.ts`](src/utils/opencc.ts). The active direction is chosen via the on-screen `DirectionSelector`.
- **Background gradient schemes** — edit [`src/config/backgroundSchemes.ts`](src/config/backgroundSchemes.ts). Each entry is a `{ light, dark }` pair of Tailwind gradient class strings. A scheme is picked at random per session (persisted in `sessionStorage`). Append a new object to the array to add your own.
- **Theme** — powered by `next-themes`. The `ThemeToggle` component lets users switch between light / dark, and the system preference is auto-detected. A manual choice is stored in `sessionStorage` under the `theme` key.
- **Conversion engine** — the core pure function [`convertEpubBuffer(arrayBuffer, direction, onProgress, isCancelled)`](src/utils/zipUtils.ts) performs the work and is intentionally free of browser `File` / `FileReader` APIs, so it can run inside the Web Worker ([`src/workers/convert.worker.ts`](src/workers/convert.worker.ts)). If Worker creation fails, the app transparently falls back to the main thread.

## Development & Testing

Common scripts:

```bash
pnpm install        # install dependencies
pnpm dev            # local dev server (Turbopack)
pnpm build          # production build
pnpm start          # start the production server
pnpm typecheck      # type checking (tsc --noEmit, strict mode)
pnpm test           # run unit tests with Vitest
```

**Build environment note:** if you run `pnpm build` inside a sandboxed environment that forces Node options such as `--use-system-ca`, Turbopack may fail to spawn its Worker with `ERR_WORKER_INVALID_EXEC_ARGV`. Strip that option (keep only the necessary shim) before building; a normal local environment does not need this.

**Linting note:** `pnpm lint` (ESLint) is currently unavailable because `typescript-eslint` does not yet support TypeScript 7; type safety is enforced through `pnpm typecheck` (strict `tsc --noEmit`) instead.

## Contributing

Issues and Pull Requests are welcome! Please keep the code style consistent and include a clear description of your change.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

- Email: byte7956@gmail.com
- GitHub: xlongDev
