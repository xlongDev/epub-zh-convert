import { motion, AnimatePresence } from "framer-motion";
import { FaDownload, FaTrash } from "react-icons/fa";
import ShareButton from "@/components/ShareButton/ShareButton";
import { useState } from "react";
import Checkbox from "@/components/Checkbox/Checkbox";
import JSZip from "jszip";
import { saveAs } from "file-saver";

// 音效文件路径
const downloadSound = "/download-sound.mp3";

// 文件大小格式化函数
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 B";
  
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const ConvertedFilesList = ({
  convertedFiles,
  handleDownloadSingle,
  handleDeleteConvertedFile,
  handleDownloadAll,
}) => {
  const [selectedFiles, setSelectedFiles] = useState(new Set());

  // 播放下载音效
  const playDownloadSound = () => {
    const audio = new Audio(downloadSound);
    audio.play().catch((error) => {
      console.error("播放音效失败:", error);
    });
  };

  const handleSelectAll = (e) => {
    if (selectedFiles.size === convertedFiles.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(convertedFiles.map((_, index) => index)));
    }
  };

  const handleSelectFile = (index) => {
    setSelectedFiles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleDeleteSelected = () => {
    const sortedIndices = Array.from(selectedFiles).sort((a, b) => b - a);
    sortedIndices.forEach((index) => handleDeleteConvertedFile(index));
    setSelectedFiles(new Set());
  };

  // 修改单文件下载，添加音效
  const wrappedHandleDownloadSingle = (index) => {
    playDownloadSound(); // 播放音效
    handleDownloadSingle(index);
  };

  // 修改批量下载所选文件，添加音效
  const handleDownloadSelected = async () => {
    const selectedIndices = Array.from(selectedFiles);

    if (selectedIndices.length === 1) {
      wrappedHandleDownloadSingle(selectedIndices[0]); // 复用单文件下载，包含音效
      setSelectedFiles(new Set());
      return;
    }

    const zip = new JSZip();

    for (const index of selectedIndices) {
      const file = convertedFiles[index];
      zip.file(file.name, file.blob);
    }

    try {
      const content = await zip.generateAsync({ type: "blob" });
      playDownloadSound(); // 播放音效
      saveAs(content, "批量下载文件.zip");
      setSelectedFiles(new Set());
    } catch (error) {
      console.error("下载压缩包失败:", error);
      alert("下载失败，请重试");
    }
  };

  // 修改下载所有文件，添加音效
  const handleDownloadAllFiles = async () => {
    if (convertedFiles.length === 0) {
      return;
    }

    if (convertedFiles.length === 1) {
      wrappedHandleDownloadSingle(0); // 复用单文件下载，包含音效
      return;
    }

    const zip = new JSZip();

    for (const file of convertedFiles) {
      zip.file(file.name, file.blob);
    }

    try {
      const content = await zip.generateAsync({ type: "blob" });
      playDownloadSound(); // 播放音效
      saveAs(content, "全部文件.zip");
    } catch (error) {
      console.error("下载压缩包失败:", error);
      alert("下载失败，请重试");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      id="converted-files"
      className="mt-8 pb-12"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          转换后的文件
        </h2>
        <Checkbox
          checked={convertedFiles.length > 0 && selectedFiles.size === convertedFiles.length}
          onChange={handleSelectAll}
          title={selectedFiles.size === convertedFiles.length ? "取消全选" : "全选"}
        />
      </div>
      {convertedFiles.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center">
          暂无转换后的文件，请上传并转换文件。
        </p>
      ) : (
        <>
          <ul className="space-y-4">
            <AnimatePresence>
              {convertedFiles.map((file, index) => (
                <motion.li
                  key={file.name}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, translateX: "100%" }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="flex justify-between items-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <Checkbox
                        checked={selectedFiles.has(index)}
                        onChange={() => handleSelectFile(index)}
                        className="flex-shrink-0"
                      />
                      <div className="flex flex-col min-w-0">
                        <span
                          className="text-gray-700 dark:text-gray-300 truncate min-w-0"
                          title={file.name}
                        >
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFileSize(file.blob.size)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-4 flex-shrink-0">
                    <ShareButton file={file.blob} fileName={file.name} />
                    <motion.button
                      id={`download-${index}`}
                      onClick={() => wrappedHandleDownloadSingle(index)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 10,
                      }}
                      className="p-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors shadow-md"
                    >
                      <FaDownload className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDeleteConvertedFile(index)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 10,
                      }}
                      className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-md"
                    >
                      <FaTrash className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          
          <AnimatePresence>
            {selectedFiles.size > 0 && (
              <motion.div
                key="action-buttons"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  duration: 0.3
                }}
                className="mt-4 space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.button
                    onClick={handleDeleteSelected}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    className="w-full mt-2 bg-red-500 text-white py-3 px-6 rounded-xl hover:bg-red-600 transition-colors shadow-md"
                  >
                    删除所选 ({selectedFiles.size})
                  </motion.button>
                  <motion.button
                    onClick={handleDownloadSelected}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    className="w-full mt-2 bg-green-500 text-white py-3 px-6 rounded-xl hover:bg-green-600 transition-colors shadow-md"
                  >
                    批量下载所选 ({selectedFiles.size})
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.button
            onClick={handleDownloadAllFiles}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
            className="mt-6 w-full bg-[#8B5CF6] text-white py-3 px-6 rounded-xl hover:bg-[#7C3AED] active:bg-[#6D28D9] transition-colors shadow-md"
          >
            批量下载所有文件
          </motion.button>
        </>
      )}
    </motion.div>
  );
};

export default ConvertedFilesList;