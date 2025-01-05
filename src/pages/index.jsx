import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { convertEpub } from "../utils/zipUtils";
import GitHubLink from "@/components/GitHubLink";
import ThemeToggle from "@/components/ThemeToggle";
import { FaUpload } from "react-icons/fa";
import dynamic from "next/dynamic"; // 引入 dynamic

// 动态导入 LottiePlayer，禁用 SSR
const LottiePlayer = dynamic(() => import("react-lottie-player"), { ssr: false });

// 引入动画文件
const successAnimation = require("public/animations/success.json");

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
  const abortControllerRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length === 0) return;

    setFiles(selectedFiles);
    setError(null);
    setIsComplete(false);
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
          const result = await convertEpub(file, (currentProgress) => {
            setProgress(((i + currentProgress / 100) / files.length) * 100);
          }, abortControllerRef.current.signal);
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
    }
  };

  const handleDeleteFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleDeleteConvertedFile = (index) => {
    setConvertedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
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
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-4">
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
          <motion.div
            variants={titleVariants}
            className="flex space-x-4"
          >
            <ThemeToggle />
            <GitHubLink />
          </motion.div>
        </motion.nav>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={uploadVariants}
          className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl"
        >
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
            className="block w-full p-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800"
          >
            <div className="flex flex-col items-center space-y-4">
              <FaUpload className="w-12 h-12 text-blue-500 dark:text-purple-400" />
              {files.length > 0 ? (
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  已选择 {files.length} 个文件
                </p>
              ) : (
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  点击上传 EPUB 文件（支持批量上传）
                </p>
              )}
            </div>
          </label>

          <AnimatePresence>
            {files.map((file, index) => (
              <motion.div
                key={index}
                variants={fileItemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mt-4 shadow-sm"
              >
                <span className="text-gray-700 dark:text-gray-300">
                  {file.name}
                </span>
                <button
                  onClick={() => handleDeleteFile(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  🗑️
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {files.length > 0 && (
            <div className="mt-6 flex space-x-4">
              <motion.button
                onClick={handleConvert}
                disabled={isLoading}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors shadow-md"
              >
                {isLoading ? `转换中... ${Math.round(progress)}%` : "开始转换"}
              </motion.button>
              {isLoading && (
                <motion.button
                  onClick={handleCancel}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition-colors shadow-md"
                >
                  取消转换
                </motion.button>
              )}
            </div>
          )}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 shadow-inner">
                <motion.div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: `${progress}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {isComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="mt-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {/* 使用动态导入的 LottiePlayer */}
                  <LottiePlayer
                    animationData={successAnimation} // 动画文件
                    loop={false} // 不循环播放
                    play // 自动播放
                    style={{ width: 100, height: 100, margin: "0 auto" }} // 设置动画大小
                  />
                  {/* <p className="text-green-500 text-xl mt-4">转换完成！</p> */}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mt-6 text-red-500 dark:text-red-400 text-center"
              >
                错误: {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {convertedFiles.length > 0 && (
              <div className="mt-8">
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
                      className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm"
                    >
                      <span className="text-gray-700 dark:text-gray-300">
                        {file.name}
                      </span>
                      <div className="flex space-x-4">
                        <motion.button
                          id={`download-${index}`}
                          onClick={() => handleDownloadSingle(index)}
                          whileTap={{ scale: 0.95 }}
                          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors shadow-md"
                        >
                          下载
                        </motion.button>
                        <button
                          onClick={() => handleDeleteConvertedFile(index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          🗑️
                        </button>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
                <motion.button
                  onClick={handleDownloadAll}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 w-full bg-purple-500 text-white py-3 px-6 rounded-lg hover:bg-purple-600 transition-colors shadow-md"
                >
                  批量下载所有文件
                </motion.button>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}