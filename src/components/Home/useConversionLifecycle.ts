import { useEffect, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";

// 浏览器可能未统一暴露标准 AudioContext 构造函数（如旧版 Safari 挂在 webkit 上）
type WebkitWindow = Window & {
  webkitAudioContext?: { new (): AudioContext };
};

const getAudioContextCtor = (): { new (): AudioContext } | null => {
  if (typeof window === "undefined") return null;
  const w = window as WebkitWindow;
  return window.AudioContext || w.webkitAudioContext || null;
};

/**
 * useConversionLifecycle
 * ----------------------------------------------------------------
 * 将原先散落在 Home 组件与 DownloadPromptHandler 中的「副作用」统一收口：
 *  1. 转换成功提示音的初始化与播放（含用户交互解锁音频）
 *  2. 由 error / failedFiles / isCancelled / isLoading / files 推导出
 *     isConversionFailedOrCancelled 与 isComplete 的中性状态
 *  3. 首次转换完成时弹出下载提示，5s 后或页面滚动时自动收起
 *
 * 这些逻辑只依赖全局 store，因此只在应用根部挂载一次即可。
 */
export function useConversionLifecycle() {
  // 转换成功提示音引用
  const completedSoundRef = useRef<HTMLAudioElement | null>(null);
  // 用户交互标记（用于解锁音频自动播放）
  const userInteractedRef = useRef(false);
  // 记录上一次 isComplete，确保提示音只在「首次完成」时播放
  const prevIsComplete = useRef(false);
  // 下载提示独立的「首次完成」判定（避免与提示音的 prevIsComplete 互相覆盖）
  const downloadPromptPrevComplete = useRef(false);

  // ── 1. 提示音初始化 + 用户交互解锁 ──
  useEffect(() => {
    completedSoundRef.current = new Audio("/completed.mp3");

    const handleUserInteraction = () => {
      if (!userInteractedRef.current && completedSoundRef.current) {
        const AudioContextCtor = getAudioContextCtor();
        if (AudioContextCtor) {
          const audioContext = new AudioContextCtor();
          audioContext.close();
        }
        userInteractedRef.current = true;
        window.removeEventListener("click", handleUserInteraction);
        window.removeEventListener("keydown", handleUserInteraction);
      }
    };

    window.addEventListener("click", handleUserInteraction);
    window.addEventListener("keydown", handleUserInteraction);
    return () => {
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
    };
  }, []);

  const playCompletedSound = () => {
    if (!completedSoundRef.current) return;
    completedSoundRef.current.currentTime = 0;
    completedSoundRef.current.volume = 0.4;
    completedSoundRef.current
      .play()
      .catch((e: unknown) => {
        console.error("播放转换成功提示音失败:", e);
        const AudioContextCtor = getAudioContextCtor();
        if (!AudioContextCtor) return;
        try {
          const audioContext = new AudioContextCtor();
          audioContext.resume().then(() => {
            completedSoundRef.current?.play();
          });
        } catch (err) {
          console.error("无法恢复 AudioContext:", err);
        }
      });
  };

  // ── 2. 由底层状态推导 isConversionFailedOrCancelled / isComplete ──
  const error = useAppStore((s) => s.error);
  const failedFiles = useAppStore((s) => s.failedFiles);
  const isLoading = useAppStore((s) => s.isLoading);
  const isCancelled = useAppStore((s) => s.isCancelled);
  const filesLength = useAppStore((s) => s.files.length);
  const setIsComplete = useAppStore((s) => s.setIsComplete);
  const setIsConversionFailedOrCancelled = useAppStore(
    (s) => s.setIsConversionFailedOrCancelled
  );

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (isCancelled) {
        setIsConversionFailedOrCancelled(false);
        setIsComplete(false);
      } else if (error && !isLoading) {
        setIsConversionFailedOrCancelled(true);
        setIsComplete(false);
      } else if (failedFiles.length > 0 && !isLoading) {
        setIsConversionFailedOrCancelled(true);
      } else if (isLoading) {
        setIsConversionFailedOrCancelled(false);
        setIsComplete(false);
      } else if (filesLength === 0) {
        setIsConversionFailedOrCancelled(false);
        setIsComplete(false);
      }
    });
    return () => cancelAnimationFrame(id);
  }, [
    error,
    failedFiles,
    isLoading,
    isCancelled,
    filesLength,
    setIsComplete,
    setIsConversionFailedOrCancelled,
  ]);

  // ── 3. 转换成功提示音 ──
  const isComplete = useAppStore((s) => s.isComplete);
  useEffect(() => {
    if (isComplete && !prevIsComplete.current && !error) {
      if (completedSoundRef.current && userInteractedRef.current) {
        playCompletedSound();
      }
    }
    prevIsComplete.current = isComplete;
  }, [isComplete, error]);

  // ── 4. 下载提示：首次完成弹出，5s 后 / 页面滚动自动收起 ──
  const convertedFilesLength = useAppStore((s) => s.convertedFiles.length);
  const setShowDownloadPrompt = useAppStore((s) => s.setShowDownloadPrompt);

  useEffect(() => {
    const isFirstTimeComplete =
      isComplete &&
      !downloadPromptPrevComplete.current &&
      convertedFilesLength > 0 &&
      !error;
    if (isFirstTimeComplete) {
      setShowDownloadPrompt(true);
      const timer = setTimeout(() => setShowDownloadPrompt(false), 5000);
      return () => clearTimeout(timer);
    }
    downloadPromptPrevComplete.current = isComplete;
  }, [isComplete, convertedFilesLength, error, setShowDownloadPrompt]);

  useEffect(() => {
    const handleScroll = () => setShowDownloadPrompt(false);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setShowDownloadPrompt]);
}
