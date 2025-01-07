import { useState, useRef } from "react";
import { convertEpub } from "@/utils/zipUtils";

export const useFileConversion = (files, direction) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const abortControllerRef = useRef(null);

  const handleConvert = async () => {
    if (files.length === 0) return;
    setIsLoading(true);
    setError(null);
    setProgress(0);
    setIsComplete(false);
    abortControllerRef.current = new AbortController();

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const result = await convertEpub(
            file,
            (currentProgress) => {
              // 计算总进度
              const totalProgress = ((i + currentProgress / 100) / files.length) * 100;
              setProgress(totalProgress);
            },
            abortControllerRef.current.signal,
            direction
          );
          setConvertedFiles((prevFiles) => [...prevFiles, { name: result.name, blob: result.blob }]);
        } catch (err) {
          console.error(`文件 ${file.name} 转换失败:`, err.message);
          setError(`文件 ${file.name} 转换失败: ${err.message}`);
        }
      }
      setIsComplete(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
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