import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";

// 业务逻辑 hooks
import { useFileHandling } from "@/hooks/useFileHandling";
import { useFileConversion } from "@/hooks/useFileConversion";

// 动画与配置
import backgroundSchemes from "@/config/backgroundSchemes";
import welcomeAnimation from "public/animations/welcome.json";
import successAnimation from "public/animations/success.json";

// 子组件
import LayoutWrapper from "@/components/Home/LayoutWrapper";
import Header from "@/components/Home/Header";
import DownloadPromptHandler from "@/components/Home/DownloadPromptHandler";
import { useConversionManager } from "@/components/Home/ConversionManager";
import { useFileDownloadManager } from "@/components/Home/FileDownloadManager";

// 主功能组件
import WelcomeAnimation from "@/components/WelcomeAnimation/WelcomeAnimation";
import DirectionSelector from "@/components/DirectionSelector/DirectionSelector";
import UploadSection from "@/components/UploadSection/UploadSection";
import ConvertedSection from "@/components/ConvertedSection/ConvertedSection";

export default function Home() {
  const [backgroundScheme, setBackgroundScheme] = useState(
    backgroundSchemes[0]
  );
  const [direction, setDirection] = useState("t2s");
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(true);
  const [isFileListOpen, setIsFileListOpen] = useState(false);
  const [showDownloadPrompt, setShowDownloadPrompt] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHoveringUpload, setIsHoveringUpload] = useState(false);
  const [isConversionFailedOrCancelled, setIsConversionFailedOrCancelled] =
    useState(false);

  const prevIsComplete = useRef(false);
  // 添加转换成功提示音引用
  const completedSoundRef = useRef(null);
  // 新增用户交互标记
  const userInteractedRef = useRef(false);

  useEffect(() => {
    // 初始化提示音
    completedSoundRef.current = new Audio("/completed.mp3");

    // 监听用户交互以解锁音频
    const handleUserInteraction = () => {
      if (!userInteractedRef.current && completedSoundRef.current) {
        // 创建空的 AudioContext 来解锁音频
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        // 立即关闭以节省资源
        audioContext.close();
        userInteractedRef.current = true;
        // 移除事件监听
        window.removeEventListener("click", handleUserInteraction);
        window.removeEventListener("keydown", handleUserInteraction);
      }
    };

    // 添加用户交互监听
    window.addEventListener("click", handleUserInteraction);
    window.addEventListener("keydown", handleUserInteraction);

    // 清理函数
    return () => {
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    // 延迟到下一帧读取 sessionStorage 并随机选取背景，避免 effect 内同步 setState 的级联渲染告警；
    // effect 不执行于服务端，首帧仍为默认值，因此 SSR 安全且水合一致
    const id = requestAnimationFrame(() => {
      const savedScheme = sessionStorage.getItem("backgroundScheme");
      if (savedScheme) {
        const randomScheme =
          backgroundSchemes[Math.floor(Math.random() * backgroundSchemes.length)];
        setBackgroundScheme(randomScheme);
      } else {
        sessionStorage.setItem(
          "backgroundScheme",
          JSON.stringify(backgroundSchemes[0])
        );
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const { files, isFileSelected, handleFileChange, handleDeleteFile } =
    useFileHandling();

  const {
    isLoading,
    progress,
    error,
    convertedFiles,
    setConvertedFiles,
    isComplete,
    setIsComplete,
    handleConvert: originalHandleConvert,
    handleCancel: originalHandleCancel,
  } = useFileConversion(files, direction);

  // 使用封装的转换管理逻辑
  const { handleConvert, handleCancel } = useConversionManager({
    originalHandleConvert,
    originalHandleCancel,
    setIsConversionFailedOrCancelled,
  });

  // 使用封装的下载管理逻辑，并添加 handleDeleteMultiple
  const {
    handleDownloadSingle,
    handleDownloadAll,
    handleDeleteConvertedFile,
    handleDeleteMultiple, // 新增
  } = useFileDownloadManager(setIsComplete, setIsConversionFailedOrCancelled);

  // 删除待转换文件
  const handleDeleteFileCallback = useCallback(
    (indexToDelete) => {
      handleDeleteFile(indexToDelete);
      if (files.length === 1 && indexToDelete === 0) {
        setIsComplete(false);
        setIsConversionFailedOrCancelled(false);
        setShowDownloadPrompt(false);
      }
    },
    [handleDeleteFile, files.length, setIsComplete, setIsConversionFailedOrCancelled, setShowDownloadPrompt]
  );

  // 滚动至转换结果区域
  const scrollToConvertedFiles = () => {
    const convertedFilesSection = document.getElementById("converted-files");
    if (convertedFilesSection) {
      convertedFilesSection.scrollIntoView({ behavior: "smooth" });
      setShowDownloadPrompt(false);
    }
  };

  // 播放提示音的辅助函数（用 useCallback 稳定引用，避免每次渲染重建）
  const playCompletedSound = useCallback(() => {
    if (!completedSoundRef.current) return;
    // 重置音频
    completedSoundRef.current.currentTime = 0;
    // 设置音量为60%
    completedSoundRef.current.volume = 0.4;

    // 播放音频
    completedSoundRef.current
      .play()
      .then(() => {
        console.log("提示音播放成功");
      })
      .catch((e) => {
        console.error("播放转换成功提示音失败:", e);
        // 尝试恢复 AudioContext
        try {
          const audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
          audioContext.resume().then(() => {
            console.log("AudioContext 已恢复");
            // 再次尝试播放
            completedSoundRef.current.play();
          });
        } catch (err) {
          console.error("无法恢复 AudioContext:", err);
        }
      });
  }, []);

  // 复位「失败/取消」与「完成」状态：延迟到下一帧执行 setState，
  // 既避免 effect 内同步 setState 的级联渲染告警，又保持原有行为不变
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (error && !isLoading) {
        setIsConversionFailedOrCancelled(true);
        setIsComplete(false);
      } else if (isLoading) {
        setIsConversionFailedOrCancelled(false);
        setIsComplete(false);
      } else if (files.length === 0) {
        setIsConversionFailedOrCancelled(false);
        setIsComplete(false);
      }
    });
    return () => cancelAnimationFrame(id);
  }, [error, isLoading, files.length, setIsComplete, setIsConversionFailedOrCancelled]);

  // 转换成功提示音（副作用，不在渲染期同步 setState）
  useEffect(() => {
    if (isComplete && !prevIsComplete.current && !error) {
      // 确保音频对象已初始化
      if (completedSoundRef.current && userInteractedRef.current) {
        playCompletedSound();
      }
    }
    prevIsComplete.current = isComplete;
  }, [isComplete, error, playCompletedSound]);

  return (
    <LayoutWrapper backgroundScheme={backgroundScheme}>
      <WelcomeAnimation
        animationData={welcomeAnimation}
        isVisible={isWelcomeVisible}
      />

      <Header />

      <DirectionSelector direction={direction} setDirection={setDirection} />

      <UploadSection
        isDragging={isDragging}
        setIsDragging={setIsDragging}
        isClicking={isClicking}
        setIsClicking={setIsClicking}
        isHoveringUpload={isHoveringUpload}
        setIsHoveringUpload={setIsHoveringUpload}
        isFileSelected={isFileSelected}
        files={files}
        handleFileChange={handleFileChange}
        handleDeleteFile={handleDeleteFileCallback}
        isLoading={isLoading}
        progress={progress}
        isComplete={isComplete}
        isFileListOpen={isFileListOpen}
        setIsFileListOpen={setIsFileListOpen}
        handleConvert={handleConvert}
        handleCancel={handleCancel}
        isConversionFailedOrCancelled={isConversionFailedOrCancelled}
      />

      <ConvertedSection
        isComplete={isComplete}
        error={error}
        successAnimation={successAnimation}
        showDownloadPrompt={showDownloadPrompt}
        scrollToConvertedFiles={scrollToConvertedFiles}
        convertedFiles={convertedFiles}
        handleDownloadSingle={(index) =>
          handleDownloadSingle(convertedFiles, index)
        }
        handleDeleteConvertedFile={(
          indices // 修改为接收索引数组
        ) =>
          handleDeleteConvertedFile(convertedFiles, indices, setConvertedFiles)
        }
        handleDownloadAll={() => handleDownloadAll(convertedFiles)}
      />

      <DownloadPromptHandler
        isComplete={isComplete}
        convertedFiles={convertedFiles}
        error={error}
        setShowDownloadPrompt={setShowDownloadPrompt}
        prevIsCompleteRef={prevIsComplete}
      />
    </LayoutWrapper>
  );
}
