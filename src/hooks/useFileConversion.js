import { useState, useRef, useEffect, useCallback } from "react";
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
  
  // 使用 ref 来跟踪最新的 files 值
  const filesRef = useRef(files);
  
  // 当 direction 或 files 变化时更新 ref
  useEffect(() => {
    directionRef.current = direction;
    filesRef.current = files;
  }, [direction, files]);

  // 用于记录已经转换过的文件名
  const [convertedFileNames, setConvertedFileNames] = useState(new Set());

  // 清除已转换的文件（当文件列表变化时）
  useEffect(() => {
    // 获取当前文件名的集合
    const currentFileNames = new Set(files.map(file => file.name));
    
    // 过滤掉不存在的文件的转换结果
    setConvertedFiles(prevConvertedFiles => 
      prevConvertedFiles.filter(convertedFile => 
        currentFileNames.has(convertedFile.name.replace(/\.epub$/, '')) || 
        currentFileNames.has(convertedFile.name)
      )
    );
    
    // 更新已转换的文件名集合
    setConvertedFileNames(prevNames => {
      const newNames = new Set(prevNames);
      // 只保留当前存在的文件名
      for (const name of newNames) {
        if (!currentFileNames.has(name)) {
          newNames.delete(name);
        }
      }
      return newNames;
    });
  }, [files]); // 当 files 变化时执行

  const handleConvert = useCallback(async () => {
    // 使用最新的 filesRef.current 而不是闭包中的 files
    const currentFiles = filesRef.current;
    if (currentFiles.length === 0) return;
    
    setIsLoading(true);
    setError(null);
    setProgress(0);
    setIsComplete(false);
    
    // 只重置当前不存在的文件的转换状态
    setConvertedFileNames(prevNames => {
      const currentFileNames = new Set(currentFiles.map(file => file.name));
      const newNames = new Set();
      // 只保留当前存在的文件名
      for (const name of prevNames) {
        if (currentFileNames.has(name)) {
          newNames.add(name);
        }
      }
      return newNames;
    });
    
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
      
      // 只转换当前存在的文件
      for (let i = 0; i < currentFiles.length; i++) {
        const file = currentFiles[i];
        
        // 检查是否已取消
        if (abortControllerRef.current.signal.aborted) {
          return;
        }
        
        // 跳过已经转换过的文件（如果用户重新添加了同名文件，需要重新转换）
        // 这里我们总是重新转换，以确保使用最新的文件内容
        // 如果您想优化，可以添加文件内容哈希检查
        
        try {
          const result = await convertEpub(
            file,
            (currentProgress) => {
              const totalProgress = ((i + currentProgress / 100) / currentFiles.length) * 100;
              setProgress(totalProgress);
            },
            abortControllerRef.current.signal,
            directionRef.current,
            converter,
            JSZip
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
  }, []); // 依赖项为空，因为我们都使用 ref 来获取最新值

  const handleCancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      setError("转换已取消");
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
    handleConvert,
    handleCancel,
  };
};