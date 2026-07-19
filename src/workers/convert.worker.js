// EPUB 转换 Web Worker：在后台线程执行繁简转换，避免大文件冻结主线程 UI。
import { convertEpubBuffer } from "../utils/zipUtils";
import { convertFilename } from "../utils/opencc";

let cancelled = false;

self.onmessage = async (e) => {
  const { type, file, direction } = e.data;

  if (type === "cancel") {
    cancelled = true;
    return;
  }

  if (type !== "convert") return;

  cancelled = false;
  try {
    const arrayBuffer = await file.arrayBuffer();
    const { blob } = await convertEpubBuffer(
      arrayBuffer,
      direction,
      (percent) => self.postMessage({ type: "progress", percent }),
      () => cancelled
    );

    const buffer = await blob.arrayBuffer();
    // 文件名转换在 Worker 内完成并随消息回传，主线程无需再打包 opencc-js
    self.postMessage(
      { type: "done", buffer, name: convertFilename(file.name, direction) },
      [buffer]
    );
  } catch (err) {
    self.postMessage({
      type: "error",
      message: err.message,
      name: err.name,
    });
  }
};
