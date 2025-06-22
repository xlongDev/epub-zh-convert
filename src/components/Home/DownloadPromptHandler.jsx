// src/components/Home/DownloadPromptHandler.jsx
import { useEffect } from "react";

/**
 * 下载提示控制组件 - 控制提示出现与消失，仅在首次转换完成时显示
 */
export default function DownloadPromptHandler({
  isComplete,
  convertedFiles,
  error,
  setShowDownloadPrompt,
  prevIsCompleteRef // 新增：用于检测首次完成
}) {
  useEffect(() => {
    const isFirstTimeComplete =
      isComplete &&
      !prevIsCompleteRef.current &&
      convertedFiles.length > 0 &&
      !error;

    if (isFirstTimeComplete) {
      setShowDownloadPrompt(true);
      const timer = setTimeout(() => {
        setShowDownloadPrompt(false);
      }, 5000);
      return () => clearTimeout(timer);
    }

    // 每次更新 isComplete，都同步 prev 值
    prevIsCompleteRef.current = isComplete;
  }, [isComplete, convertedFiles.length, error]);

  useEffect(() => {
    const handleScroll = () => setShowDownloadPrompt(false);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return null;
}
