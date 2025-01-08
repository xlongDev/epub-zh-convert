import { useState, useRef } from "react";
import { convertEpub } from "@/utils/zipUtils";

export const useFileConversion = (files, direction) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const abortControllerRef = useRef(null);

  // 用于记录已经转换过的文件名
  const [convertedFileNames, setConvertedFileNames] = useState(new Set());

  const handleConvert = async () => {
    if (files.length === 0) return;
    setIsLoading(true);
    setError(null);
    setProgress(0);
    setIsComplete(false);
    abortControllerRef.current = new AbortController();

    try {
      // 过滤出未转换的文件
      const filesToConvert = files.filter((file) => !convertedFileNames.has(file.name));

      if (filesToConvert.length === 0) {
        // 如果没有需要转换的文件，直接完成
        setIsComplete(true);
        return;
      }

      for (let i = 0; i < filesToConvert.length; i++) {
        const file = filesToConvert[i];
        try {
          const result = await convertEpub(
            file,
            (currentProgress) => {
              // 计算总进度
              const totalProgress = ((i + currentProgress / 100) / filesToConvert.length) * 100;
              setProgress(totalProgress);
            },
            abortControllerRef.current.signal,
            direction
          );

          // 更新转换后的文件列表
          setConvertedFiles((prevFiles) => {
            const existingFileIndex = prevFiles.findIndex((f) => f.name === result.name);
            if (existingFileIndex !== -1) {
              // 如果文件已存在，替换它
              const newFiles = [...prevFiles];
              newFiles[existingFileIndex] = { name: result.name, blob: result.blob };
              return newFiles;
            } else {
              // 如果文件不存在，添加它
              return [...prevFiles, { name: result.name, blob: result.blob }];
            }
          });

          // 记录已经转换过的文件名
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