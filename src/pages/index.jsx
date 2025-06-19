import { useState, useEffect } from "react";
import { useFileHandling } from "@/hooks/useFileHandling";
import { useFileConversion } from "@/hooks/useFileConversion";
import backgroundSchemes from "@/utils/backgroundSchemes";
import { titleVariants } from "@/utils/animations";
import GitHubLink from "@/components/GitHubLink/GitHubLink";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";
import WelcomeAnimation from "@/components/Home/WelcomeAnimation";
import DirectionSelector from "@/components/Home/DirectionSelector";
import UploadSection from "@/components/Home/UploadSection";
import ConvertedSection from "@/components/Home/ConvertedSection";
import welcomeAnimation from "public/animations/welcome.json";
import successAnimation from "public/animations/success.json";
import { motion } from "framer-motion";

export default function Home() {
  // 背景方案
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
  const {
    isLoading,
    progress,
    error,
    convertedFiles,
    setConvertedFiles,
    isComplete,
    setIsComplete,
    handleConvert,
    handleCancel,
  } = useFileConversion(files, direction);

  // UI 状态
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(true);
  const [isFileListOpen, setIsFileListOpen] = useState(false);
  const [showDownloadPrompt, setShowDownloadPrompt] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHoveringUpload, setIsHoveringUpload] = useState(false);

  useEffect(() => {
    if (isComplete && convertedFiles.length > 0 && !error) {
      setShowDownloadPrompt(true);
      const timer = setTimeout(() => {
        setShowDownloadPrompt(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isComplete, convertedFiles, error]);

  useEffect(() => {
    const handleScroll = () => {
      if (showDownloadPrompt) {
        setShowDownloadPrompt(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showDownloadPrompt]);

  const scrollToConvertedFiles = () => {
    const convertedFilesSection = document.getElementById("converted-files");
    if (convertedFilesSection) {
      convertedFilesSection.scrollIntoView({ behavior: "smooth" });
      setShowDownloadPrompt(false);
    }
  };

  const handleDeleteConvertedFile = (index) => {
    setConvertedFiles((prevFiles) => {
      const newFiles = prevFiles.filter((_, i) => i !== index);
      if (newFiles.length === 0) {
        setIsComplete(false);
        setShowDownloadPrompt(false);
      }
      return newFiles;
    });
  };

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
          handleDeleteFile={handleDeleteFile}
          isLoading={isLoading}
          progress={progress}
          isComplete={isComplete}
          isFileListOpen={isFileListOpen}
          setIsFileListOpen={setIsFileListOpen}
          handleConvert={handleConvert}
          handleCancel={handleCancel}
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
