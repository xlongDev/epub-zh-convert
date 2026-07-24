// EPUB 转换 Web Worker：在后台线程执行繁简转换，避免大文件冻结主线程 UI。
import { convertEpubBuffer } from "../utils/zipUtils";
import { convertFilename } from "../utils/opencc";
import type { WorkerRequest } from "@/types";

// 由于项目 tsconfig 使用 dom lib（与 webworker lib 冲突），
// 这里用最小作用域的 WorkerScope 接口来描述 worker 全局，避免 lib 冲突。
interface WorkerScope {
  onmessage:
    | ((this: WorkerScope, ev: MessageEvent<WorkerRequest>) => unknown)
    | null;
  postMessage(message: unknown, transfer?: Transferable[]): void;
}

const ctx = self as unknown as WorkerScope;

let cancelled = false;

ctx.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  const data = e.data;

  if (data.type === "cancel") {
    cancelled = true;
    return;
  }

  if (data.type !== "convert") return;

  const { file, direction } = data;
  cancelled = false;
  try {
    const arrayBuffer = await file.arrayBuffer();
    const { blob } = await convertEpubBuffer(
      arrayBuffer,
      direction,
      (percent) => ctx.postMessage({ type: "progress", percent }),
      () => cancelled
    );

    const buffer = await blob.arrayBuffer();
    // 文件名转换在 Worker 内完成并随消息回传，主线程无需再打包 opencc-js
    ctx.postMessage(
      { type: "done", buffer, name: convertFilename(file.name, direction) },
      [buffer]
    );
  } catch (err) {
    const error = err as Error;
    ctx.postMessage({
      type: "error",
      message: error.message,
      name: error.name,
    });
  }
};
