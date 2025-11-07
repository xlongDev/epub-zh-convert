import { useState, useRef, useEffect } from "react";
import { convertFilename } from "@/utils/opencc";

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
    setConvertedFileNames(new Set());
    abortControllerRef.current = new AbortController();

    try {
      // 动态加载大型库（优化点）
      const [{ Converter }, { default: JSZip }] = await Promise.all([
        import('opencc-js'),
        import('jszip')
      ]);
      
      // 创建转换器实例
      let from, to;
      if (directionRef.current === 't2s') {
        from = 't';
        to = 'cn';
      } else if (directionRef.current === 's2t') {
        from = 'cn';
        to = 't';
      } else {
        // 默认不转换
        from = 't';
        to = 't';
      }
      
      const converter = Converter({ from, to });
      
      // 导入转换函数（按需加载）
      const { convertEpub } = await import("@/utils/zipUtils");
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // 检查是否已取消
        if (abortControllerRef.current.signal.aborted) {
          return;
        }
        
        try {
          const result = await convertEpub(
            file,
            (currentProgress) => {
              const totalProgress = ((i + currentProgress / 100) / files.length) * 100;
              setProgress(totalProgress);
            },
            abortControllerRef.current.signal,
            directionRef.current,
            converter, // 传入转换器实例
            JSZip // 传入JSZip类
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
          // 如果是取消操作，不显示错误
          if (err.name !== 'AbortError') {
            console.error(`文件 ${file.name} 转换失败:`, err.message);
            setError(`文件 ${file.name} 转换失败: ${err.message || "未知错误"}`);
          }
        }
      }
      
      setIsComplete(true);
    } catch (err) {
      // 如果是取消操作，不显示错误
      if (err.name !== 'AbortError') {
        console.error("转换过程出错:", err);
        setError(err.message || "转换过程发生未知错误");
      }
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