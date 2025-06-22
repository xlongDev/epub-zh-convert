import { useState, useEffect, useCallback, useRef } from "react"; // 新增导入 useRef
import { useFileHandling } from "@/hooks/useFileHandling";
import { useFileConversion } from "@/hooks/useFileConversion";
import { titleVariants } from "@/utils/animations";
import backgroundSchemes from "@/config/backgroundSchemes";
import GitHubLink from "@/components/GitHubLink/GitHubLink";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";
import WelcomeAnimation from "@/components/WelcomeAnimation/WelcomeAnimation";
import DirectionSelector from "@/components/DirectionSelector/DirectionSelector";
import UploadSection from "@/components/UploadSection/UploadSection";
import ConvertedSection from "@/components/ConvertedSection/ConvertedSection";
import welcomeAnimation from "public/animations/welcome.json";
import successAnimation from "public/animations/success.json";
import { motion } from "framer-motion";

export default function Home() {
  // 背景方案状态
  const [backgroundScheme, setBackgroundScheme] = useState(
    backgroundSchemes[0]
  );
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

  // 文件处理逻辑
  const { files, isFileSelected, handleFileChange, handleDeleteFile } =
    useFileHandling();
  const [direction, setDirection] = useState("t2s");

  // 文件转换钩子
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

  // UI 状态
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(true);
  const [isFileListOpen, setIsFileListOpen] = useState(false);
  const [showDownloadPrompt, setShowDownloadPrompt] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHoveringUpload, setIsHoveringUpload] = useState(false);
  const [isConversionFailedOrCancelled, setIsConversionFailedOrCancelled] =
    useState(false);

  // 【修复第一步】: 新增一个 ref 来追踪 isComplete 的上一个状态。
  // 这能帮助我们检测 isComplete 从 false 变为 true 的“瞬间”。
  const prevIsComplete = useRef(false);

  // 【修复第二步】: 拆分并重构 useEffect 逻辑，使其更清晰且无误。

  // 这个 Effect 专门负责处理下载提示的显示逻辑
  useEffect(() => {
    // 关键条件变更：只有当 isComplete 从 false 变为 true 时（即转换刚刚成功完成），才触发提示。
    if (isComplete && !prevIsComplete.current && convertedFiles.length > 0 && !error) {
      setShowDownloadPrompt(true);
      const timer = setTimeout(() => {
        setShowDownloadPrompt(false);
      }, 5000); // 5秒后自动隐藏
      return () => clearTimeout(timer); // 组件卸载或Effect重新运行时清除计时器
    }
  }, [isComplete, convertedFiles.length, error]); // 依赖项现在是 convertedFiles.length，更高效

  // 这个 Effect 负责处理其他状态逻辑（如错误、加载中等）
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

    // 在 Effect 的末尾，用当前 isComplete 的值更新 ref，为下一次渲染做准备。
    prevIsComplete.current = isComplete;
  }, [isComplete, error, isLoading, files.length, setIsComplete]);


  // Effect：当用户滚动页面时，隐藏下载提示
  useEffect(() => {
    const handleScroll = () => {
      if (showDownloadPrompt) {
        setShowDownloadPrompt(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showDownloadPrompt]);

  // 平滑滚动到转换文件列表区域
  const scrollToConvertedFiles = () => {
    const convertedFilesSection = document.getElementById("converted-files");
    if (convertedFilesSection) {
      convertedFilesSection.scrollIntoView({ behavior: "smooth" });
      setShowDownloadPrompt(false);
    }
  };

  // Callback：处理待上传文件的删除
  const handleDeleteFileCallback = useCallback(
    (indexToDelete) => {
      handleDeleteFile(indexToDelete);
      if (files.length === 1 && indexToDelete === 0) {
        setIsComplete(false);
        setIsConversionFailedOrCancelled(false);
        setShowDownloadPrompt(false);
      }
    },
    [handleDeleteFile, files.length, setIsComplete]
  );

  // 【修复第三步】: 优化已转换文件的删除逻辑
  const handleDeleteConvertedFile = useCallback(
    (index) => {
      // 核心修复：在执行删除操作时，立即主动隐藏下载提示。
      // 这可以防止任何因状态更新延迟而导致的闪烁问题。
      setShowDownloadPrompt(false);

      setConvertedFiles((prevFiles) => {
        const newFiles = prevFiles.filter((_, i) => i !== index);
        if (newFiles.length === 0) {
          setIsComplete(false);
          setIsConversionFailedOrCancelled(false);
        }
        return newFiles;
      });
    },
    // 修正依赖项数组，确保所有用到的外部状态函数都被包括在内
    [setConvertedFiles, setIsComplete, setIsConversionFailedOrCancelled]
  );

  // 下载所有转换后的文件
  const handleDownloadAll = async () => {
    convertedFiles.forEach((file, index) => {
      const url = URL.createObjectURL(file.blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
      const downloadButton = document.getElementById(`download-${index}`);
      if (downloadButton) {
        downloadButton.classList.add("animate-ping");
        setTimeout(() => {
          downloadButton.classList.remove("animate-ping");
        }, 500);
      }
    });
  };

  // 下载单个转换后的文件
  const handleDownloadSingle = async (index) => {
    const file = convertedFiles[index];
    if (!file) return;
    const url = URL.createObjectURL(file.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
    const downloadButton = document.getElementById(`download-${index}`);
    if (downloadButton) {
      downloadButton.classList.add("animate-ping");
      setTimeout(() => {
        downloadButton.classList.remove("animate-ping");
      }, 500);
    }
  };

  // 封装的 handleConvert 函数
  const handleConvert = useCallback(() => {
    setIsConversionFailedOrCancelled(false);
    originalHandleConvert();
  }, [originalHandleConvert]);

  // 封装的 handleCancel 函数
  const handleCancel = useCallback(() => {
    originalHandleCancel();
    setIsConversionFailedOrCancelled(true);
  }, [originalHandleCancel]);

  // 返回组件的 JSX 结构
  return (
    <div
      className={`min-h-screen flex items-center justify-center ${backgroundScheme.light} ${backgroundScheme.dark}`}
    >
      <div className="w-full max-w-2xl mx-4">
        <WelcomeAnimation
          animationData={welcomeAnimation}
          isVisible={isWelcomeVisible}
        />
        <motion.nav
          initial="hidden"
          animate="visible"
          variants={titleVariants}
          className="flex justify-between items-center mb-8"
        >
          <motion.h1
            variants={titleVariants}
            className="text-3xl font-bold text-gray-800 dark:text-gray-100"
          >
            EPUB 繁简转换
          </motion.h1>
          <motion.div variants={titleVariants} className="flex space-x-4">
            <ThemeToggle />
            <GitHubLink />
          </motion.div>
        </motion.nav>
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
          handleDownloadSingle={handleDownloadSingle}
          handleDeleteConvertedFile={handleDeleteConvertedFile}
          handleDownloadAll={handleDownloadAll}
        />
      </div>
    </div>
  );
}