import { motion, AnimatePresence } from "framer-motion";
import { FaDownload, FaTrash } from "react-icons/fa";
import ShareButton from "@/components/ShareButton/ShareButton";
import { useState } from "react";
import Checkbox from "@/components/Checkbox/Checkbox";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import ClearConfirmModal from "@/components/ClearConfirmModal/ClearConfirmModal";

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
  isComplete = false,
  onClearAll,
  uploadFileCount = 0,
  isLoading = false,
}) => {
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleConfirmClear = () => {
    setShowClearConfirm(false);
    onClearAll?.();
  };

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

  // 修复删除功能：一次性删除所有选中文件
  const handleDeleteSelected = () => {
    // 创建新数组，过滤掉选中的文件
    const indicesToDelete = Array.from(selectedFiles);
    handleDeleteConvertedFile(indicesToDelete);
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
      // 在文件名后面加上文件个数
      saveAs(content, `批量下载文件(${selectedIndices.length}个).zip`);
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
      // 在文件名后面加上文件个数
      saveAs(content, `全部文件(${convertedFiles.length}个).zip`);
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
      {convertedFiles.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center">
          暂无转换后的文件，请上传并转换文件。
        </p>
      ) : (
        <>
          {/* ── 玻璃面板容器：sticky header + 滚动列表 ── */}
          <div className="glass-panel rounded-xl overflow-hidden">
            {/* Sticky 头部：全选 + 标题 + 成功徽标 + 选中计数 | 清空全部 */}
            <div className="sticky top-0 z-10 flex items-center justify-between py-2.5 px-4 bg-gradient-to-b from-white/55 to-white/25 dark:from-gray-800/55 dark:to-gray-800/25 backdrop-blur-xl border-b border-white/15 dark:border-white/[0.05]">
              <div className="flex items-center gap-2.5 min-w-0">
                {/* 全选 checkbox — 作为列表主控件放在标题左侧 */}
                <Checkbox
                  checked={convertedFiles.length > 0 && selectedFiles.size === convertedFiles.length}
                  onChange={handleSelectAll}
                  title={selectedFiles.size === convertedFiles.length ? "取消全选" : "全选"}
                />
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  转换后的文件
                </h2>
                {/* 成功完成徽标 */}
                {isComplete && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400 bg-green-500/10 dark:bg-green-400/10 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                    <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    {convertedFiles.length} 个文件
                  </span>
                )}
                {/* 已选计数徽标 */}
                <AnimatePresence>
                  {selectedFiles.size > 0 && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 400, damping: 18 }}
                      className="inline-flex items-center text-xs font-semibold text-indigo-700 dark:text-indigo-300 glass-btn-brand px-2.5 py-0.5 rounded-full whitespace-nowrap"
                    >
                      已选 {selectedFiles.size} 项
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <motion.button
                  onClick={() => setShowClearConfirm(true)}
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.04 }}
                  whileTap={{ scale: isLoading ? 1 : 0.96 }}
                  transition={{ type: "spring", stiffness: 350, damping: 14 }}
                  className="px-3 py-1.5 rounded-xl glass-btn-danger shadow-sm text-xs font-medium whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="清空全部内容"
                >
                  清空全部
                </motion.button>
              </div>
            </div>

            {/* 可滚动文件列表 */}
            <ul className="max-h-[60vh] overflow-y-auto overflow-x-hidden scroll-glass px-4 pb-4 pt-3 space-y-2.5">
              <AnimatePresence>
                {convertedFiles.map((file, index) => (
                  <motion.li
                    key={file.name}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, translateX: "100%" }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="flex justify-between items-center p-3 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200
                      bg-white/25 dark:bg-gray-800/35 backdrop-blur-lg border border-white/30 dark:border-white/[0.06]"
                  >
                    <div className="flex items-center min-w-0 flex-1">
                      <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                        <Checkbox
                          checked={selectedFiles.has(index)}
                          onChange={() => handleSelectFile(index)}
                          className="flex-shrink-0"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm text-gray-700 dark:text-gray-300 truncate min-w-0" title={file.name}>
                            {file.name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatFileSize(file.blob.size)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 flex-shrink-0">
                      <ShareButton file={file.blob} fileName={file.name} />
                      <motion.button
                        id={`download-${index}`}
                        onClick={() => wrappedHandleDownloadSingle(index)}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        transition={{ type: "spring", stiffness: 350, damping: 12 }}
                        className="p-2 rounded-xl glass-btn-success shadow-sm"
                        aria-label={`下载 ${file.name}`}
                      >
                        <FaDownload className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteConvertedFile([index])}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        transition={{ type: "spring", stiffness: 350, damping: 12 }}
                        className="p-2 rounded-xl glass-btn-danger shadow-sm"
                        aria-label={`删除 ${file.name}`}
                      >
                        <FaTrash className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>

          {/* ── 操作按钮区（面板外部，始终可见）── */}
          
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
                className="mt-3 space-y-3"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <motion.button
                    onClick={handleDeleteSelected}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.975 }}
                    transition={{ type: "spring", stiffness: 350, damping: 14 }}
                    className="w-full py-2.5 px-6 rounded-xl glass-btn-danger shadow-sm font-medium"
                  >
                    删除所选 ({selectedFiles.size})
                  </motion.button>
                  <motion.button
                    onClick={handleDownloadSelected}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.975 }}
                    transition={{ type: "spring", stiffness: 350, damping: 14 }}
                    className="w-full py-2.5 px-6 rounded-xl glass-btn-success shadow-sm font-medium"
                  >
                    下载所选 ({selectedFiles.size})
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* 「全部下载」— 未全选时显示（全选时与「下载所选」功能重复） */}
          <AnimatePresence>
            {selectedFiles.size < convertedFiles.length && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={handleDownloadAllFiles}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.975 }}
                transition={{ type: "spring", stiffness: 350, damping: 14 }}
                className="mt-4 w-full py-2.5 px-6 rounded-xl glass-btn-accent shadow-sm font-medium"
              >
                全部下载
              </motion.button>
            )}
          </AnimatePresence>
        </>
      )}

      <ClearConfirmModal
        open={showClearConfirm}
        uploadCount={uploadFileCount}
        convertedCount={convertedFiles.length}
        onConfirm={handleConfirmClear}
        onCancel={() => setShowClearConfirm(false)}
      />
    </motion.div>
  );
};

export default ConvertedFilesList;