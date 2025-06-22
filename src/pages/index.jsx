// 📁 src/pages/index.jsx
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

  useEffect(() => {
    // 初始化提示音
    completedSoundRef.current = new Audio("/completed.mp3");
  }, []);

  useEffect(() => {
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

  // 使用封装的下载管理逻辑
  const { handleDownloadSingle, handleDownloadAll, handleDeleteConvertedFile } =
    useFileDownloadManager(setIsComplete, setIsConversionFailedOrCancelled);

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
    [handleDeleteFile, files.length]
  );

  // 滚动至转换结果区域
  const scrollToConvertedFiles = () => {
    const convertedFilesSection = document.getElementById("converted-files");
    if (convertedFilesSection) {
      convertedFilesSection.scrollIntoView({ behavior: "smooth" });
      setShowDownloadPrompt(false);
    }
  };

  useEffect(() => {
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
    
    // 添加转换成功提示音逻辑
    if (isComplete && !prevIsComplete.current && !error) {
      // 确保音频对象已初始化
      if (completedSoundRef.current) {
        completedSoundRef.current.play().catch((e) => {
          console.error("播放转换成功提示音失败:", e);
        });
      }
    }
    
    prevIsComplete.current = isComplete;
  }, [isComplete, error, isLoading, files.length]);

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
        handleDeleteConvertedFile={(index) =>
          handleDeleteConvertedFile(convertedFiles, index, setConvertedFiles)
        }
        handleDownloadAll={() => handleDownloadAll(convertedFiles)}
      />

      <DownloadPromptHandler
        isComplete={isComplete}
        convertedFiles={convertedFiles}
        error={error}
        setShowDownloadPrompt={setShowDownloadPrompt}
        prevIsCompleteRef={prevIsComplete} // 👈 传递引用
      />
    </LayoutWrapper>
  );
}