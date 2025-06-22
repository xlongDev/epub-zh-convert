import { motion, AnimatePresence } from "framer-motion";
import { FaDownload, FaTrash } from "react-icons/fa";
import ShareButton from "@/components/ShareButton/ShareButton";
import { useState } from "react";
import Checkbox from "@/components/Checkbox/Checkbox";

// 新增导入 JSZip 库
import JSZip from "jszip";
import { saveAs } from "file-saver";

const ConvertedFilesList = ({
  convertedFiles,
  handleDownloadSingle,
  handleDeleteConvertedFile,
  handleDownloadAll,
}) => {
  const [selectedFiles, setSelectedFiles] = useState(new Set());

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

  // 修改批量下载逻辑，使用 JSZip 创建压缩包
  const handleDownloadSelected = async () => {
    const selectedIndices = Array.from(selectedFiles);
    
    // 如果只选中了一个文件，直接下载
    if (selectedIndices.length === 1) {
      handleDownloadSingle(selectedIndices[0]);
      setSelectedFiles(new Set());
      return;
    }

    // 创建压缩包
    const zip = new JSZip();
    
    // 添加选中的文件到压缩包
    for (const index of selectedIndices) {
      const file = convertedFiles[index];
      zip.file(file.name, file.blob);
    }

    // 生成压缩包并触发下载
    try {
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "批量下载文件.zip");
      setSelectedFiles(new Set());
    } catch (error) {
      console.error("下载压缩包失败:", error);
      alert("下载失败，请重试");
    }
  };

  // 修改批量下载所有文件的逻辑，使用 JSZip 创建压缩包
  const handleDownloadAllFiles = async () => {
    // 如果没有文件，直接返回
    if (convertedFiles.length === 0) {
      return;
    }

    // 如果只有一个文件，直接下载
    if (convertedFiles.length === 1) {
      handleDownloadSingle(0);
      return;
    }

    // 创建压缩包
    const zip = new JSZip();
    
    // 添加所有文件到压缩包
    for (const file of convertedFiles) {
      zip.file(file.name, file.blob);
    }

    // 生成压缩包并触发下载
    try {
      const content = await zip.generateAsync({ type: "blob" });
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
                      <span
                        className="text-gray-700 dark:text-gray-300 truncate min-w-0"
                        title={file.name}
                      >
                        {file.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-4 flex-shrink-0">
                    <ShareButton file={file.blob} fileName={file.name} />
                    <motion.button
                      id={`download-${index}`}
                      onClick={() => handleDownloadSingle(index)}
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
          
          {/* 修复后的操作按钮区域 */}
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
          
          {/* 修改按钮点击事件为新的压缩下载函数 */}
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