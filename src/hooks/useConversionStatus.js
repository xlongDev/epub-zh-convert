import { useState, useRef } from "react";

/**
 * 自定义钩子：管理文件转换状态（成功、失败、取消等）
 * @returns {Object} 包含状态和更新方法的对象
 */
export default function useConversionStatus() {
  // 转换失败或被取消的状态
  const [isConversionFailedOrCancelled, setIsConversionFailedOrCancelled] = useState(false);
  
  // 使用ref存储上一次的转换完成状态，避免状态更新导致的循环渲染
  const prevIsComplete = useRef(false);
  
  /**
   * 更新转换状态
   * @param {boolean} isComplete - 当前转换是否完成
   * @param {Error|null} error - 错误对象（存在时表示转换失败）
   * @param {boolean} isLoading - 是否正在加载/转换
   * @param {boolean} filesExist - 是否存在转换后的文件
   */
  const updateStatus = (isComplete, error, isLoading, filesExist) => {
    // 如果发生错误且不在加载中，标记为转换失败
    if (error && !isLoading) {
      setIsConversionFailedOrCancelled(true);
    } 
    // 如果正在加载，重置失败/取消状态
    else if (isLoading) {
      setIsConversionFailedOrCancelled(false);
    } 
    // 如果没有转换后的文件，重置失败/取消状态
    else if (!filesExist) {
      setIsConversionFailedOrCancelled(false);
    }
    
    // 更新上一次的完成状态（用于后续比较）
    prevIsComplete.current = isComplete;
  };

  return {
    isConversionFailedOrCancelled,  // 当前转换失败或取消状态
    setIsConversionFailedOrCancelled,  // 手动更新失败/取消状态的方法
    prevIsComplete,  // 上一次的转换完成状态（只读ref）
    updateStatus  // 更新所有状态的方法
  };
}// src/hooks/useFileConversion/useConversionState.js
import { useState, useRef, useEffect } from "react";

/**
 * 管理文件转换的状态
 */
export const useConversionState = (files) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [convertedFileNames, setConvertedFileNames] = useState(new Set());

  // 使用 ref 跟踪最新状态
  const stateRef = useRef({
    isLoading,
    error,
    convertedFiles,
    isComplete,
    convertedFileNames
  });

  // 同步 ref 与 state
  useEffect(() => {
    stateRef.current = {
      isLoading,
      error,
      convertedFiles,
      isComplete,
      convertedFileNames
    };
  }, [isLoading, error, convertedFiles, isComplete, convertedFileNames]);

  // 当文件列表变化时，清理不存在的转换结果
  useEffect(() => {
    const currentFileNames = new Set(files.map(file => file.name));
    
    setConvertedFiles(prev => 
      prev.filter(convertedFile => 
        currentFileNames.has(convertedFile.name.replace(/\.epub$/, '')) || 
        currentFileNames.has(convertedFile.name)
      )
    );
    
    setConvertedFileNames(prev => {
      const newNames = new Set();
      for (const name of prev) {
        if (currentFileNames.has(name)) {
          newNames.add(name);
        }
      }
      return newNames;
    });
  }, [files]);

  // 更新转换文件（支持合并）
  const updateConvertedFiles = (newFile) => {
    setConvertedFiles(prevFiles => {
      const existingFileIndex = prevFiles.findIndex((f) => f.name === newFile.name);
      if (existingFileIndex !== -1) {
        const newFiles = [...prevFiles];
        newFiles[existingFileIndex] = newFile;
        return newFiles;
      } else {
        return [...prevFiles, newFile];
      }
    });
  };

  // 重置所有状态
  const resetState = () => {
    setIsLoading(false);
    setError(null);
    setConvertedFiles([]);
    setIsComplete(false);
    setConvertedFileNames(new Set());
  };

  // 设置加载状态
  const setLoading = (loading) => {
    setIsLoading(loading);
    if (loading) {
      setError(null);
      setIsComplete(false);
    }
  };

  return {
    // 状态
    isLoading,
    error,
    convertedFiles,
    isComplete,
    convertedFileNames,
    
    // 状态引用（用于回调中获取最新值）
    stateRef,
    
    // 更新方法
    setIsLoading,
    setError,
    setConvertedFiles,
    setIsComplete,
    setConvertedFileNames,
    updateConvertedFiles,
    resetState,
    setLoading
  };
};