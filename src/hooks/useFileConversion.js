import { useState, useRef, useEffect } from "react";
import { convertFilename } from "@/utils/opencc";

export const useFileConversion = (files, direction) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const abortControllerRef = useRef(null);
  const workerRef = useRef(null);

  // 使用 ref 来跟踪最新的 direction 值
  const directionRef = useRef(direction);

  // 当 direction 变化时更新 ref
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

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
      const onMessage = (e) => {
        const { type, percent, buffer, message, name: errName } = e.data;
        if (type === "progress") {
          const totalProgress =
            ((index + percent / 100) / total) * 100;
          setProgress(totalProgress);
        } else if (type === "done") {
          worker.removeEventListener("message", onMessage);
          resolve({
            blob: new Blob([buffer]),
            name: convertFilename(file.name, directionRef.current),
          });
        } else if (type === "error") {
          worker.removeEventListener("message", onMessage);
          const err = new Error(message);
          err.name = errName || "Error";
          reject(err);
        }
      };
      worker.addEventListener("message", onMessage);
      worker.postMessage({
        type: "convert",
        file,
        direction: directionRef.current,
      });
    });

  const handleConvert = async () => {
    if (files.length === 0) return;

    setIsLoading(true);
    setError(null);
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
        ? convertInWorker(worker, file, index, files.length)
        : convertOnMainThread(file, index, files.length);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // 检查是否已取消
        if (abortControllerRef.current.signal.aborted) {
          break;
        }

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
          // 如果是取消操作，不显示错误
          if (err.name !== "AbortError") {
            console.error(`文件 ${file.name} 转换失败:`, err.message);
            setError(`文件 ${file.name} 转换失败: ${err.message || "未知错误"}`);
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
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      if (workerRef.current) {
        workerRef.current.postMessage({ type: "cancel" });
        workerRef.current.terminate();
        workerRef.current = null;
      }
      setIsLoading(false);
      setError("转换已取消");
      setIsComplete(false);
    }
  };

  return {
    isLoading,
    progress,
    error,
    convertedFiles,
    setConvertedFiles,
    isComplete,
    setIsComplete,
    handleConvert,
    handleCancel,
  };
};
