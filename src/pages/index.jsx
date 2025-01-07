import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { FileUploader } from "@/components/FileUploader/FileUploader";
import { FileList } from "@/components/FileList/FileList";
import { ConvertedFilesList } from "@/components/ConvertedFilesList/ConvertedFilesList";
import { ProgressIndicator } from "@/components/ProgressIndicator/ProgressIndicator";
import { useFileHandling } from "@/hooks/useFileHandling";
import { useFileConversion } from "@/hooks/useFileConversion";
import { titleVariants, uploadVariants } from "@/utils/animations";
import GitHubLink from "@/components/GitHubLink/GitHubLink";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";

const LottiePlayer = dynamic(() => import("react-lottie-player"), { ssr: false });
const DynamicErrorDisplay = dynamic(() => import("@/components/ErrorDisplay/ErrorDisplay").then(mod => mod.ErrorDisplay), { ssr: false });
const DynamicDownloadPrompt = dynamic(() => import("@/components/DownloadPrompt/DownloadPrompt"), { ssr: false });

import welcomeAnimation from "public/animations/welcome.json";
import successAnimation from "public/animations/success.json";

// 背景颜色方案
const backgroundSchemes = [
  {
    // 默认颜色方案
    // 浅色：从蓝绿色到蓝色的渐变，充满活力和现代感
    // 深色：从深灰色到灰色的渐变，适合夜间模式
    light: "bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600",
    dark: "dark:from-gray-800 dark:via-gray-700 dark:to-gray-600",
  },
  {
    // 浅色：从蓝色到绿色的渐变，清新自然，适合自然主题
    // 深色：从深灰色到灰色的渐变，适合夜间模式
    light: "bg-gradient-to-r from-blue-300 via-teal-300 to-green-300",
    dark: "dark:from-gray-800 dark:via-gray-700 dark:to-gray-600",
  },
  {
    // 浅色：从灰色到蓝色的渐变，带有科技感和冷静氛围
    // 深色：从深灰色到灰色的渐变，适合夜间模式
    light: "bg-gradient-to-r from-gray-200 via-blue-300 to-gray-400",
    dark: "dark:from-gray-900 dark:via-gray-800 dark:to-gray-700",
  },
  {
    // 浅色：从橙色到紫色的渐变，温暖且富有活力，适合创意主题
    // 深色：从深灰色到灰色的渐变，适合夜间模式
    light: "bg-gradient-to-r from-orange-200 via-pink-300 to-purple-400",
    dark: "dark:from-gray-900 dark:via-gray-800 dark:to-gray-700",
  },
  {
    // 浅色：从浅青色到浅蓝色的渐变，清新柔和，适合轻松的氛围
    // 深色：从深灰色到灰色的渐变，适合夜间模式
    light: "bg-gradient-to-r from-teal-100 via-cyan-100 to-blue-100",
    dark: "dark:from-gray-800 dark:via-gray-700 dark:to-gray-600",
  },
  {
    // 浅色：从浅紫色到浅粉色的渐变，温柔浪漫，适合女性化设计
    // 深色：从深灰色到灰色的渐变，适合夜间模式
    light: "bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50",
    dark: "dark:from-gray-800 dark:via-gray-700 dark:to-gray-600",
  },
  {
    // 浅色：从浅绿色到浅青色的渐变，自然清新，适合环保或健康主题
    // 深色：从深灰色到灰色的渐变，适合夜间模式
    light: "bg-gradient-to-r from-green-50 via-teal-50 to-cyan-50",
    dark: "dark:from-gray-800 dark:via-gray-700 dark:to-gray-600",
  },
  {
    // 浅色：从浅粉色到浅黄色的渐变，温暖柔和，适合温馨的场景
    // 深色：从深灰色到灰色的渐变，适合夜间模式
    light: "bg-gradient-to-r from-pink-50 via-orange-50 to-yellow-50",
    dark: "dark:from-gray-800 dark:via-gray-700 dark:to-gray-600",
  },
];

export default function Home() {
  // 使用默认背景颜色方案
  const [backgroundScheme, setBackgroundScheme] = useState(backgroundSchemes[0]);

  useEffect(() => {
    // 检查 localStorage 中是否已经保存了背景颜色方案
    const savedScheme = localStorage.getItem("backgroundScheme");
    if (savedScheme) {
      // 如果已经保存过，则随机选择一个背景颜色方案
      const randomScheme = backgroundSchemes[Math.floor(Math.random() * backgroundSchemes.length)];
      setBackgroundScheme(randomScheme);
    } else {
      // 如果是第一次加载，则使用默认背景颜色方案，并保存到 localStorage
      localStorage.setItem("backgroundScheme", JSON.stringify(backgroundSchemes[0]));
    }
  }, []);

  const { files, isFileSelected, handleFileChange, handleDeleteFile } = useFileHandling();
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
    <div className={`min-h-screen flex items-center justify-center ${backgroundScheme.light} ${backgroundScheme.dark}`}>
      <div className="w-full max-w-2xl mx-4">
        {isWelcomeVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mb-4 text-center"
            style={{ willChange: "opacity, transform" }}
          >
            <LottiePlayer
              animationData={welcomeAnimation}
              loop={true}
              play
              style={{ width: 150, height: 150, margin: "0 auto" }}
            />
          </motion.div>
        )}

        {/* 下载提示条 */}
        <AnimatePresence>
          {showDownloadPrompt && (
            <DynamicDownloadPrompt
              showDownloadPrompt={showDownloadPrompt}
              scrollToConvertedFiles={scrollToConvertedFiles}
            />
          )}
        </AnimatePresence>

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

        <motion.div
          initial="hidden"
          animate="visible"
          variants={uploadVariants}
          className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-white/50 dark:border-gray-700/50 relative"
        >
          {isDragging && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 dark:bg-white/10 rounded-xl">
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">松开以上传文件</p>
            </div>
          )}

          <div className="mb-6">
            <label
              htmlFor="direction"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              转换方向
            </label>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <select
                id="direction"
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-[#60A5FA] focus:border-[#60A5FA] bg-white/60 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300"
              >
                <option value="t2s">繁体转简体</option>
                <option value="s2t">简体转繁体</option>
              </select>
            </motion.div>
          </div>

          <FileUploader
            onFileChange={handleFileChange}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFileChange(e);
            }}
            isDragging={isDragging}
            isClicking={isClicking}
            setIsClicking={setIsClicking}
            isFileSelected={isFileSelected}
            isHoveringUpload={isHoveringUpload}
            files={files}
            onMouseEnter={() => setIsHoveringUpload(true)}
            onMouseLeave={() => setIsHoveringUpload(false)}
            isLoading={isLoading}
            progress={progress}
            isComplete={isComplete}
          />

          {files.length > 0 && (
            <FileList
              files={files}
              isFileListOpen={isFileListOpen}
              setIsFileListOpen={setIsFileListOpen}
              handleDeleteFile={handleDeleteFile}
            />
          )}

          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6 flex space-x-4"
            >
              <motion.button
                onClick={handleConvert}
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                className="w-full bg-[#60A5FA] text-white py-3 px-6 rounded-lg hover:bg-[#3B82F6] active:bg-[#2563EB] transition-colors shadow-md"
              >
                {isLoading ? `转换中... ${Math.round(progress)}%` : "开始转换"}
              </motion.button>
              {isLoading && (
                <motion.button
                  onClick={handleCancel}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  className="w-full bg-[#EA580C] text-white py-3 px-6 rounded-lg hover:bg-[#C2410C] active:bg-[#9A3412] transition-colors shadow-md"
                >
                  取消转换
                </motion.button>
              )}
            </motion.div>
          )}

          {isLoading && <ProgressIndicator progress={progress} />}

          <AnimatePresence>
            {isComplete && !error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="mt-4 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <LottiePlayer
                    animationData={successAnimation}
                    loop={false}
                    play
                    style={{ width: 120, height: 120, margin: "0 auto" }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && <DynamicErrorDisplay error={error} />}
          </AnimatePresence>

          <AnimatePresence>
            {convertedFiles.length > 0 && (
              <ConvertedFilesList
                convertedFiles={convertedFiles}
                handleDownloadSingle={handleDownloadSingle}
                handleDeleteConvertedFile={handleDeleteConvertedFile}
                handleDownloadAll={handleDownloadAll}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}