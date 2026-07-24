import type { StateCreator } from "zustand";
import type { FailedFile, WorkerResponse } from "@/types";
import type { AppState, ConvertedFile } from "../types";

/**
 * 转换引擎 slice：转换中 / 进度 / 错误 / 完成 / 取消 / 暂停等状态，
 * 以及 handleConvert（Worker 编排，含主线程降级）、暂停 / 继续 / 取消 / 重置。
 *
 * 引擎需要的非序列化引用（AbortController、Worker、暂停/继续 Promise resolver）
 * 放在模块级 `engineRefs`，不进入 store 的响应式部分；store action 内部统一通过
 * `get()` 读取最新 files / direction，天然规避闭包过期问题。
 */
export interface ConversionSlice {
  isLoading: boolean;
  progress: number;
  error: string | null;
  isComplete: boolean;
  isCancelled: boolean;
  currentFileIndex: number;
  isPaused: boolean;

  handleConvert: () => Promise<void>;
  handleCancel: () => void;
  handlePause: () => void;
  handleResume: () => void;
  resetConversion: () => void;
  setIsComplete: (value: boolean) => void;
}

// ── 转换引擎的非响应式引用（单例，不进入 store 状态） ──
interface EngineRefs {
  abortController: AbortController | null;
  worker: Worker | null;
  pendingReject: ((reason?: unknown) => void) | null;
  paused: boolean;
  resumeResolver: (() => void) | null;
}

const engineRefs: EngineRefs = {
  abortController: null,
  worker: null,
  pendingReject: null,
  paused: false,
  resumeResolver: null,
};

export const createConversionSlice: StateCreator<AppState, [], [], ConversionSlice> = (
  set,
  get
) => ({
  isLoading: false,
  progress: 0,
  error: null,
  isComplete: false,
  isCancelled: false,
  currentFileIndex: 0,
  isPaused: false,

  setIsComplete: (value) => set({ isComplete: value }),

  handleConvert: async () => {
    const currentFiles = get().files;
    if (currentFiles.length === 0) return;

    set({
      isLoading: true,
      error: null,
      isCancelled: false,
      failedFiles: [],
      currentFileIndex: 0,
      progress: 0,
      isComplete: false,
      isConversionFailedOrCancelled: false,
    });
    engineRefs.abortController = new AbortController();

    // 优先尝试 Web Worker，失败则降级到主线程
    let worker: Worker | null = null;
    if (typeof Worker !== "undefined") {
      try {
        worker = new Worker(
          new URL("../../workers/convert.worker.ts", import.meta.url),
          { type: "module" }
        );
      } catch {
        worker = null;
      }
    }
    engineRefs.worker = worker;

    const runOne = (file: File, index: number): Promise<ConvertedFile> =>
      worker
        ? convertInWorker(worker, file, index, currentFiles.length, get, set)
        : convertOnMainThread(file, index, currentFiles.length, get, set);

    const failedList: FailedFile[] = [];
    try {
      for (let i = 0; i < currentFiles.length; i++) {
        const file = currentFiles[i];
        // 暂停等待：处理下一个文件前挂起，直到 handleResume 放行
        if (engineRefs.paused) {
          await new Promise<void>((resolve) => {
            engineRefs.resumeResolver = resolve;
          });
        }
        // 检查是否已取消
        if (engineRefs.abortController.signal.aborted) {
          break;
        }

        set({ currentFileIndex: i });
        try {
          const result = await runOne(file, i);

          set((state) => {
            const existingIndex = state.convertedFiles.findIndex(
              (f) => f.name === result.name
            );
            if (existingIndex !== -1) {
              const newFiles = [...state.convertedFiles];
              newFiles[existingIndex] = { name: result.name, blob: result.blob };
              return { convertedFiles: newFiles };
            }
            return {
              convertedFiles: [
                ...state.convertedFiles,
                { name: result.name, blob: result.blob },
              ],
            };
          });
        } catch (err) {
          const error = err as Error;
          if (error.name !== "AbortError") {
            console.error(`文件 ${file.name} 转换失败:`, error.message);
            failedList.push({
              name: file.name,
              message: error.message || "未知错误",
            });
          }
        }
      }

      if (!engineRefs.abortController.signal.aborted) {
        set({ isComplete: true });
      }
    } catch (err) {
      const error = err as Error;
      if (error.name !== "AbortError") {
        console.error("转换过程出错:", error);
        set({ error: error.message || "转换过程发生未知错误" });
      }
    } finally {
      if (worker) worker.terminate();
      engineRefs.worker = null;
      set({ isLoading: false, failedFiles: failedList });
    }
  },

  handlePause: () => {
    engineRefs.paused = true;
    set({ isPaused: true });
  },

  handleResume: () => {
    engineRefs.paused = false;
    set({ isPaused: false });
    const resolver = engineRefs.resumeResolver;
    engineRefs.resumeResolver = null;
    if (resolver) resolver();
  },

  handleCancel: () => {
    // 若处于暂停挂起状态，先放行被阻塞的循环，使其落到 aborted 检查后 break
    if (engineRefs.resumeResolver) {
      const resolver = engineRefs.resumeResolver;
      engineRefs.resumeResolver = null;
      resolver();
    }
    engineRefs.paused = false;
    if (engineRefs.abortController) {
      engineRefs.abortController.abort();
      if (engineRefs.worker) {
        const reject = engineRefs.pendingReject;
        engineRefs.worker.postMessage({ type: "cancel" });
        engineRefs.worker.terminate();
        engineRefs.worker = null;
        engineRefs.pendingReject = null;
        if (reject) reject(new DOMException("转换已取消", "AbortError"));
      }
      set({
        isLoading: false,
        isCancelled: true, // 用户主动取消，视为中性状态而非错误
        isComplete: false,
        isPaused: false,
      });
    }
  },

  resetConversion: () => {
    // 兜底：若循环正因暂停而挂起，先放行并中止，避免残留循环永久悬挂
    if (engineRefs.resumeResolver) {
      const resolver = engineRefs.resumeResolver;
      engineRefs.resumeResolver = null;
      resolver();
    }
    engineRefs.paused = false;
    if (engineRefs.abortController) {
      engineRefs.abortController.abort();
      engineRefs.abortController = null;
    }
    if (engineRefs.worker) {
      engineRefs.worker.terminate();
      engineRefs.worker = null;
    }
    engineRefs.pendingReject = null;
    set({
      isPaused: false,
      convertedFiles: [],
      failedFiles: [],
      isComplete: false,
      isCancelled: false,
      progress: 0,
      error: null,
      isLoading: false,
      currentFileIndex: 0,
    });
  },
});

// ── 引擎辅助函数（模块级，避免进入 store 状态） ──

// 主线程降级路径：转换单个文件
async function convertOnMainThread(
  file: File,
  index: number,
  total: number,
  get: () => AppState,
  set: (partial: Partial<AppState>) => void
): Promise<ConvertedFile> {
  const { convertEpub } = await import("@/utils/zipUtils");
  return convertEpub(
    file,
    (currentProgress) => {
      const totalProgress = ((index + currentProgress / 100) / total) * 100;
      set({ progress: totalProgress });
    },
    engineRefs.abortController!.signal,
    get().direction
  );
}

// Web Worker 路径：转换单个文件（顺序处理，逐个 await）
function convertInWorker(
  worker: Worker,
  file: File,
  index: number,
  total: number,
  get: () => AppState,
  set: (partial: Partial<AppState>) => void
): Promise<ConvertedFile> {
  return new Promise<ConvertedFile>((resolve, reject) => {
    engineRefs.pendingReject = reject;

    const cleanup = () => {
      worker.removeEventListener("message", onMessage);
      worker.removeEventListener("error", onError);
      worker.removeEventListener("messageerror", onMessageError);
      engineRefs.pendingReject = null;
    };

    const onMessage = (e: MessageEvent<WorkerResponse>) => {
      const data = e.data;
      if (data.type === "progress") {
        const totalProgress = ((index + data.percent / 100) / total) * 100;
        set({ progress: totalProgress });
      } else if (data.type === "done") {
        cleanup();
        resolve({
          blob: new Blob([data.buffer]),
          name: data.name || file.name,
        });
      } else {
        cleanup();
        const err = new Error(data.message);
        err.name = data.name || "Error";
        reject(err);
      }
    };

    const onError = (e: ErrorEvent) => {
      cleanup();
      reject(new Error(e.message || "转换 Worker 运行出错"));
    };
    const onMessageError = () => {
      cleanup();
      reject(new Error("转换 Worker 消息解析失败"));
    };

    worker.addEventListener("message", onMessage);
    worker.addEventListener("error", onError);
    worker.addEventListener("messageerror", onMessageError);
    worker.postMessage({
      type: "convert",
      file,
      direction: get().direction,
    });
  });
}
