import { useState, useRef, useEffect, useCallback } from "react";

export const useFileConversion = (files, direction) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [failedFiles, setFailedFiles] = useState([]); // 聚合单文件失败清单
  const [isCancelled, setIsCancelled] = useState(false); // 用户主动取消（非错误）
  const [currentFileIndex, setCurrentFileIndex] = useState(0); // 当前正在转换的文件序号
  const abortControllerRef = useRef(null);
  const workerRef = useRef(null);
  // 跟踪当前在途 Promise 的 reject，便于在 worker 被终止（取消）时主动 reject，
  // 避免 Promise 永久悬挂导致 isLoading 卡死。
  const pendingRejectRef = useRef(null);

  // 使用 ref 来跟踪最新的 direction 值
  const directionRef = useRef(direction);

  // 当 direction 变化时更新 ref
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  // 跟踪最新的待转换文件队列，避免转换函数闭包捕获过期的 files，
  // 否则新增文件后点击「开始转换」只会处理首次上传的文件
  const filesRef = useRef(files);
  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  // 用于记录已经转换过的文件名
  const [convertedFileNames, setConvertedFileNames] = useState(new Set());

  // 清除已转换的文件（当文件列表变化时）—— 来自远程的健壮性改进
  useEffect(() => {
    const currentFileNames = new Set(files.map((file) => file.name));
    setConvertedFiles((prevConvertedFiles) =>
      prevConvertedFiles.filter(
        (convertedFile) =>
          currentFileNames.has(convertedFile.name.replace(/\.epub$/, "")) ||
          currentFileNames.has(convertedFile.name)
      )
    );
    setConvertedFileNames((prevNames) => {
      const newNames = new Set(prevNames);
      for (const name of newNames) {
        if (!currentFileNames.has(name)) {
          newNames.delete(name);
        }
      }
      return newNames;
    });
  }, [files]);

  // 在主线程降级路径下转换单个文件
  const convertOnMainThread = async (file, index, total) => {
    const { convertEpub } = await import("@/utils/zipUtils");
    return convertEpub(
      file,
      (currentProgress) => {
        const totalProgress =
          ((index + currentProgress / 100) / total) * 100;
        setProgress(totalProgress);
      },
      abortControllerRef.current.signal,
      directionRef.current
    );
  };

  // 在 Web Worker 中转换单个文件（顺序处理，逐个 await）
  const convertInWorker = (worker, file, index, total) =>
    new Promise((resolve, reject) => {
      pendingRejectRef.current = reject;

      const cleanup = () => {
        worker.removeEventListener("message", onMessage);
        worker.removeEventListener("error", onError);
        worker.removeEventListener("messageerror", onMessageError);
        pendingRejectRef.current = null;
      };

      const onMessage = (e) => {
        const { type, percent, buffer, name, message, name: errName } = e.data;
        if (type === "progress") {
          const totalProgress =
            ((index + percent / 100) / total) * 100;
          setProgress(totalProgress);
        } else if (type === "done") {
          cleanup();
          resolve({
            blob: new Blob([buffer]),
            // 文件名由 Worker 回传（已包含方向转换后的名称）
            name: name || file.name,
          });
        } else if (type === "error") {
          cleanup();
          const err = new Error(message);
          err.name = errName || "Error";
          reject(err);
        }
      };

      // worker 传输/脚本错误兜底：避免在 worker 崩溃时 Promise 永久悬挂
      const onError = (e) => {
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
        direction: directionRef.current,
      });
    });

  const handleConvert = useCallback(async () => {
    // 始终读取最新的待转换队列（filesRef），避免闭包捕获过期列表
    const currentFiles = filesRef.current;
    if (currentFiles.length === 0) return;

    setIsLoading(true);
    setError(null);
    setIsCancelled(false);
    setFailedFiles([]);
    setCurrentFileIndex(0);
    setProgress(0);
    setIsComplete(false);
    setConvertedFileNames(new Set());
    abortControllerRef.current = new AbortController();

    // 优先尝试 Web Worker，失败则降级到主线程
    let worker = null;
    if (typeof Worker !== "undefined") {
      try {
        worker = new Worker(
          new URL("../workers/convert.worker.js", import.meta.url),
          { type: "module" }
        );
      } catch {
        worker = null;
      }
    }
    workerRef.current = worker;

    const runOne = (file, index) =>
      worker
        ? convertInWorker(worker, file, index, currentFiles.length)
        : convertOnMainThread(file, index, currentFiles.length);

    const failedList = [];
    try {
      for (let i = 0; i < currentFiles.length; i++) {
        const file = currentFiles[i];
        // 检查是否已取消
        if (abortControllerRef.current.signal.aborted) {
          break;
        }

        setCurrentFileIndex(i); // 更新当前处理文件序号，供进度区展示「第 i/N」
        try {
          const result = await runOne(file, i);

          setConvertedFiles((prevFiles) => {
            const existingFileIndex = prevFiles.findIndex(
              (f) => f.name === result.name
            );
            if (existingFileIndex !== -1) {
              const newFiles = [...prevFiles];
              newFiles[existingFileIndex] = {
                name: result.name,
                blob: result.blob,
              };
              return newFiles;
            } else {
              return [...prevFiles, { name: result.name, blob: result.blob }];
            }
          });

          setConvertedFileNames((prevNames) =>
            new Set(prevNames).add(file.name)
          );
        } catch (err) {
          // 如果是取消操作，不显示为错误；否则聚合进失败清单
          if (err.name !== "AbortError") {
            console.error(`文件 ${file.name} 转换失败:`, err.message);
            failedList.push({ name: file.name, message: err.message || "未知错误" });
          }
        }
      }

      if (!abortControllerRef.current.signal.aborted) {
        setIsComplete(true);
      }
    } catch (err) {
      // 如果是取消操作，不显示错误
      if (err.name !== "AbortError") {
        console.error("转换过程出错:", err);
        setError(err.message || "转换过程发生未知错误");
      }
    } finally {
      if (worker) worker.terminate();
      workerRef.current = null;
      setIsLoading(false);
      setFailedFiles(failedList); // 统一提交失败清单
    }
  }, []);

  const handleCancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      if (workerRef.current) {
        // 终止 worker 后原 Promise 不会再收到消息，需手动 reject 避免悬挂
        const reject = pendingRejectRef.current;
        workerRef.current.postMessage({ type: "cancel" });
        workerRef.current.terminate();
        workerRef.current = null;
        pendingRejectRef.current = null;
        if (reject) reject(new DOMException("转换已取消", "AbortError"));
      }
      setIsLoading(false);
      setIsCancelled(true); // 用户主动取消，视为中性状态而非错误
      setIsComplete(false);
    }
  }, []);

  return {
    isLoading,
    progress,
    error,
    convertedFiles,
    setConvertedFiles,
    isComplete,
    setIsComplete,
    failedFiles,
    isCancelled,
    currentFileIndex,
    handleConvert,
    handleCancel,
  };
};
