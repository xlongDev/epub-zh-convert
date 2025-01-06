import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { convertEpub } from "../utils/zipUtils";
import GitHubLink from "@/components/GitHubLink";
import ThemeToggle from "@/components/ThemeToggle";
import {
  FaUpload,
  FaChevronDown,
  FaChevronUp,
  FaArrowDown,
  FaFile,
  FaTrash,
} from "react-icons/fa";
import dynamic from "next/dynamic";
import styles from "@/styles/Home.module.css";

const LottiePlayer = dynamic(() => import("react-lottie-player"), {
  ssr: false,
});

const welcomeAnimation = require("public/animations/welcome.json");
const successAnimation = require("public/animations/success.json");
const loadingAnimation = require("public/animations/loading.json");
const errorAnimation = require("public/animations/error.json");

const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } },
};

const uploadVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.4 } },
};

const fileItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
};

const errorVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10 },
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState([]);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(true);
  const [isFileListOpen, setIsFileListOpen] = useState(false);
  const [showDownloadPrompt, setShowDownloadPrompt] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [direction, setDirection] = useState("t2s");
  const abortControllerRef = useRef(null);

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

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length === 0) return;
    setFiles(droppedFiles);
    setError(null);
    setIsComplete(false);
    setIsFileListOpen(false);
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length === 0) return;
    setFiles(selectedFiles);
    setError(null);
    setIsComplete(false);
    setIsFileListOpen(false);
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    setIsLoading(true);
    setError(null);
    setProgress(0);
    setIsComplete(false);
    const converted = [];
    abortControllerRef.current = new AbortController();
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const result = await convertEpub(
            file,
            (currentProgress) => {
              setProgress(((i + currentProgress / 100) / files.length) * 100);
            },
            abortControllerRef.current.signal,
            direction
          );
          converted.push({ name: result.name, blob: result.blob });
          setConvertedFiles([...converted]);
        } catch (err) {
          console.error(`文件 ${file.name} 转换失败:`, err.message);
          setError(`文件 ${file.name} 转换失败: ${err.message}`);
        }
      }
      setIsComplete(true);
    } catch (err) {
      setError(err.message);
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

  const handleDeleteFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
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
    <div className="min-h-screen bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-4">
        {/* 欢迎动画 */}
        {isWelcomeVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mb-4 text-center"
          >
            <LottiePlayer
              animationData={welcomeAnimation}
              loop={true}
              play
              style={{ width: 150, height: 150, margin: "0 auto" }}
            />
          </motion.div>
        )}

        {/* 下载提示 */}
        <AnimatePresence>
          {showDownloadPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="fixed bottom-4 left-4 right-4 sm:bottom-4 sm:right-4 sm:left-auto bg-green-500 text-white p-3 rounded-lg shadow-lg flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 z-50"
            >
              <p className="text-sm text-center sm:text-left">
                转换成功！下拉或点击以下载文件。
              </p>
              <button
                onClick={scrollToConvertedFiles}
                className="bg-white text-green-500 px-3 py-1 rounded-md hover:bg-green-100 transition-colors flex items-center"
              >
                <FaArrowDown className="mr-1" />
                <span className="text-sm">下载</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 导航栏 */}
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

        {/* 主要内容区域 */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={uploadVariants}
          className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-white/50 dark:border-gray-700/50 relative"
        >
          {/* 转换方向选择 */}
          <div className="mb-6">
            <label
              htmlFor="direction"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              转换方向
            </label>
            <select
              id="direction"
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-[#60A5FA] focus:border-[#60A5FA] bg-white/60 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300"
            >
              <option value="t2s">繁体转简体</option>
              <option value="s2t">简体转繁体</option>
            </select>
          </div>

          {/* 文件上传区域 */}
          <div className="relative">
            <input
              type="file"
              accept=".epub"
              onChange={handleFileChange}
              disabled={isLoading}
              className="hidden"
              id="fileInput"
              multiple
            />
            <label
              htmlFor="fileInput"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`block w-full p-8 text-center border-2 border-dashed ${
                isDragging
                  ? "border-[#60A5FA] bg-[#DBEAFE]/60 dark:bg-[#1E3A8A]/60"
                  : "border-gray-300 dark:border-gray-600"
              } rounded-lg cursor-pointer hover:bg-gray-50/60 dark:hover:bg-gray-700/60 transition-colors bg-white/60 dark:bg-gray-800/60`}
            >
              <div className="flex flex-col items-center space-y-4">
                <FaUpload className="w-12 h-12 text-[#60A5FA] dark:text-[#818CF8]" />
                {files.length > 0 ? (
                  <p className="text-gray-700 dark:text-gray-300 text-lg">
                    已选择 {files.length} 个文件
                  </p>
                ) : (
                  <p className="text-gray-700 dark:text-gray-300 text-lg">
                    {isDragging ? "释放文件以上传" : "点击或拖拽文件以上传"}
                  </p>
                )}
              </div>
            </label>

            {/* 进度条 */}
            {isLoading && (
              <motion.div
                className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none"
                style={{
                  border: "4px solid transparent",
                  borderRadius: "0.75rem",
                }}
              >
                <motion.div
                  className="absolute inset-0 border-4 border-transparent rounded-lg"
                  style={{
                    borderImage: `linear-gradient(to right, #34D399 ${progress}%, transparent ${progress}%) 1`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                  }}
                />
              </motion.div>
            )}
          </div>

          {/* 文件列表 */}
          {files.length > 0 && (
            <div className="mt-6">
              <button
                onClick={() => setIsFileListOpen(!isFileListOpen)}
                className="w-full flex justify-between items-center p-3 bg-gray-100/60 dark:bg-gray-700/60 rounded-lg hover:bg-gray-200/60 dark:hover:bg-gray-600/60 transition-colors"
              >
                <span className="text-gray-700 dark:text-gray-300">
                  已选择 {files.length} 个文件
                </span>
                {isFileListOpen ? (
                  <FaChevronUp className="text-gray-500 dark:text-gray-400" />
                ) : (
                  <FaChevronDown className="text-gray-500 dark:text-gray-400" />
                )}
              </button>

              <AnimatePresence>
                {isFileListOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 space-y-2"
                  >
                    {files.map((file, index) => (
                      <motion.div
                        key={index}
                        variants={fileItemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                      >
                        <FaFile className="text-[#60A5FA] dark:text-[#818CF8] mr-3" />
                        <span
                          className="text-gray-700 dark:text-gray-300 truncate flex-1"
                          title={file.name}
                        >
                          {file.name}
                        </span>
                        <motion.button
                          onClick={() => handleDeleteFile(index)}
                          whileTap={{ scale: 0.9 }}
                          className="text-red-400 hover:text-red-500 transition-colors"
                        >
                          <FaTrash />
                        </motion.button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* 转换按钮 */}
          {files.length > 0 && (
            <div className="mt-6 flex space-x-4">
              <motion.button
                onClick={handleConvert}
                disabled={isLoading}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-[#60A5FA] text-white py-3 px-6 rounded-lg hover:bg-[#3B82F6] active:bg-[#2563EB] transition-colors shadow-md"
              >
                {isLoading ? `转换中... ${Math.round(progress)}%` : "开始转换"}
              </motion.button>
              {isLoading && (
                <motion.button
                  onClick={handleCancel}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-[#EA580C] text-white py-3 px-6 rounded-lg hover:bg-[#C2410C] active:bg-[#9A3412] transition-colors shadow-md"
                >
                  取消转换
                </motion.button>
              )}
            </div>
          )}

          {/* 加载动画 */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-0 text-center"
            >
              <LottiePlayer
                animationData={loadingAnimation}
                loop={true}
                play
                style={{ width: 170, height: 170, margin: "0 auto" }}
              />
            </motion.div>
          )}

          {/* 成功动画 */}
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

          {/* 错误提示 */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="mt-2 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <LottiePlayer
                    animationData={errorAnimation}
                    loop={false}
                    play
                    style={{ width: 140, height: 140, margin: "0 auto" }}
                  />
                  <p className="text-red-500 dark:text-red-400 text-xl mt-4">
                    {error}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 转换后的文件列表 */}
          <AnimatePresence>
            {convertedFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                id="converted-files"
                className="mt-8"
              >
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
                  转换后的文件
                </h2>
                <motion.ul className="space-y-4">
                  {convertedFiles.map((file, index) => (
                    <motion.li
                      key={index}
                      variants={fileItemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex justify-between items-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    >
                      <span
                        className="text-gray-700 dark:text-gray-300 truncate"
                        title={file.name}
                      >
                        {file.name}
                      </span>
                      <div className="flex space-x-4">
                        <motion.button
                          id={`download-${index}`}
                          onClick={() => handleDownloadSingle(index)}
                          whileTap={{ scale: 0.95 }}
                          className="bg-[#34D399] text-white py-2 px-4 rounded-lg hover:bg-[#10B981] active:bg-[#059669] transition-colors shadow-md"
                        >
                          下载
                        </motion.button>
                        <motion.button
                          onClick={() => handleDeleteConvertedFile(index)}
                          whileTap={{ scale: 0.9 }}
                          className="text-red-400 hover:text-red-500 transition-colors"
                        >
                          <FaTrash />
                        </motion.button>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
                <motion.button
                  onClick={handleDownloadAll}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 w-full bg-[#8B5CF6] text-white py-3 px-6 rounded-lg hover:bg-[#7C3AED] active:bg-[#6D28D9] transition-colors shadow-md"
                >
                  批量下载所有文件
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
