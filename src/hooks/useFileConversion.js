import { useState, useRef, useEffect } from "react"; // 添加 useEffect 导入
import { convertEpub } from "@/utils/zipUtils";

export const useFileConversion = (files, direction) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const abortControllerRef = useRef(null);

  // 使用 ref 来跟踪最新的 direction 值
  const directionRef = useRef(direction);
  
  // 当 direction 变化时更新 ref
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  // 用于记录已经转换过的文件名
  const [convertedFileNames, setConvertedFileNames] = useState(new Set());

  const handleConvert = async () => {
    if (files.length === 0) return;
    setIsLoading(true);
    setError(null);
    setProgress(0);
    setIsComplete(false);
    setConvertedFileNames(new Set()); // 清空已转换文件名，允许重新转换
    abortControllerRef.current = new AbortController();

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          // 使用 directionRef.current 而不是闭包中的 direction
          const result = await convertEpub(
            file,
            (currentProgress) => {
              const totalProgress = ((i + currentProgress / 100) / files.length) * 100;
              setProgress(totalProgress);
            },
            abortControllerRef.current.signal,
            directionRef.current // 使用 ref 的当前值
          );

          setConvertedFiles((prevFiles) => {
            const existingFileIndex = prevFiles.findIndex((f) => f.name === result.name);
            if (existingFileIndex !== -1) {
              const newFiles = [...prevFiles];
              newFiles[existingFileIndex] = { name: result.name, blob: result.blob };
              return newFiles;
            } else {
              return [...prevFiles, { name: result.name, blob: result.blob }];
            }
          });

          setConvertedFileNames((prevNames) => new Set(prevNames).add(file.name));
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