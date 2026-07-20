import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * FileList 组件
 * 显示用户已选择的文件列表，并提供展开/收起功能和删除文件的操作。
 * 优化了毛玻璃效果和文件项视觉层次
 */
const FileList = React.memo(
  ({ files, isFileListOpen, setIsFileListOpen, handleDeleteFile, isLoading = false, currentFileIndex = 0, onClearUploads }) => {
    // Helper function to format file size
    const formatFileSize = (sizeInBytes) => {
      if (sizeInBytes === 0) return "0 MB";
      const sizeInMB = sizeInBytes / (1024 * 1024);
      return `${sizeInMB.toFixed(2)} MB`;
    };

    // 本地文件列表（用于清空时的退出动画）
    const [displayFiles, setDisplayFiles] = useState(files);
    const [clearPulseKey, setClearPulseKey] = useState(0);

    // 同步父级 files 变化到本地（非清空场景）
    useEffect(() => {
      if (files.length > 0 || displayFiles.length === 0) {
        setDisplayFiles(files);
      }
    }, [files]);

    // 清空全部上传文件：先触发退出动画，动画结束后真正清空父级
    const handleClearUploads = () => {
      if (!onClearUploads || displayFiles.length === 0) return;
      setClearPulseKey(k => k + 1);   // 触发脉冲环
      setDisplayFiles([]);              // 触发文件项退出动画
      // 等待退出动画完成后调用父级真正清空
      setTimeout(() => onClearUploads(), 450);
    };

    return (
      <motion.div
        className="glass rounded-2xl shadow-lg overflow-hidden"
        layout // 添加布局动画
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* 文件列表头部，点击可展开/收起 */}
        <div
          className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/20 dark:hover:bg-white/[0.04] transition-colors duration-200 rounded-t-2xl"
          onClick={() => setIsFileListOpen(!isFileListOpen)}
        >
          <div className="flex items-center">
            {/* 文件图标 */}
            <div className="bg-blue-100/70 dark:bg-blue-900/40 p-1.5 rounded-xl backdrop-blur-sm shadow-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="w-5 h-5 text-blue-600 dark:text-blue-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <h3 className="font-medium text-gray-800 dark:text-gray-200 ml-3">
              已选文件 ({displayFiles.length})
            </h3>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* 清空全部上传文件按钮 — 复用文件项小叉叉图标风格 */}
            {displayFiles.length > 0 && !isLoading && onClearUploads && (
              <div className="relative">
                {/* 脉冲环：每次点击扩散一圈 */}
                <AnimatePresence>
                  <motion.div
                    key={`clear-pulse-${clearPulseKey}`}
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-full border-2 border-red-400"
                    initial={{ opacity: 0.5, scale: 0.9 }}
                    animate={{ opacity: 0, scale: 1.35 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                  />
                </AnimatePresence>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearUploads();
                  }}
                  className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 p-1.5 rounded-full hover:bg-red-100/50 dark:hover:bg-red-900/25 backdrop-blur-sm transition-colors duration-200 flex-shrink-0"
                  aria-label="清空全部上传文件"
                  title="清空全部上传文件"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>
              </div>
            )}
            {/* 展开/收起指示箭头 */}
          <motion.div
            animate={{ rotate: isFileListOpen ? 180 : 0 }} // 旋转箭头以指示状态
            transition={{ duration: 0.3 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 text-gray-600 dark:text-gray-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </motion.div>
          </div>
        </div>

        {/* 文件列表内容，根据 isFileListOpen 状态显示或隐藏 */}
        <AnimatePresence>
          {isFileListOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: 1,
                height: "auto",
                transition: {
                  duration: 0.4,
                  ease: "easeInOut",
                },
              }}
              exit={{
                opacity: 0,
                height: 0,
                transition: {
                  duration: 0.4, // Increased duration for smoother collapse
                  ease: "easeOut", // Changed ease for smoother exit
                },
              }}
              className="overflow-hidden"
            >
              <div className="border-t border-white/20 dark:border-white/[0.05] p-3 bg-white/5 dark:bg-black/10">
                <ul className="space-y-2.5 max-h-60 overflow-y-auto custom-scrollbar">
                  <AnimatePresence>
                  {displayFiles.map((file, index) => {
                    // 逐文件状态（顺序转换）：已完成 / 转换中 / 待转换（T6）
                    const status = !isLoading
                      ? null
                      : index < currentFileIndex
                      ? "done"
                      : index === currentFileIndex
                      ? "active"
                      : "pending";
                    return (
                    <motion.li
                      key={file.name}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: {
                          delay: index * 0.04,
                          duration: 0.28,
                        },
                      }}
                      exit={{ opacity: 0, x: 60, scale: 0.92 }}
                      className={`flex items-center justify-between p-3 rounded-xl border backdrop-blur-md transition-all duration-200 shadow-sm hover:shadow ${
                        status === "active"
                          ? "bg-blue-50/40 dark:bg-blue-900/15 border-blue-300/50 dark:border-blue-500/30 ring-1 ring-blue-300/40 dark:ring-blue-500/25"
                          : "glass-btn bg-white/18 dark:bg-white/[0.04] border-white/25 dark:border-white/08"
                      }`}
                    >
                      <div className="flex items-center truncate min-w-0 flex-1">
                        {/* 文件类型图标 */}
                        <div className="bg-indigo-100/60 dark:bg-indigo-900/40 p-1.5 rounded-lg flex-shrink-0 backdrop-blur-sm mr-3 shadow-inner">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.8}
                            stroke="currentColor"
                            className="w-5 h-5 text-indigo-600 dark:text-indigo-300"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                            />
                          </svg>
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-sm truncate text-gray-800 dark:text-gray-200 font-medium">
                            {file.name}
                          </span>
                          {file.size && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {formatFileSize(file.size)}
                            </span>
                          )}
                        </div>
                      </div>
                      {/* 逐文件状态徽标（T6） */}
                      {status && (
                        <span
                          className={`mr-2 inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                            status === "active"
                              ? "bg-blue-100/70 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300"
                              : status === "done"
                              ? "bg-green-100/70 dark:bg-green-900/40 text-green-600 dark:text-green-300"
                              : "bg-gray-100/70 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {status === "active" && (
                            <span className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                          )}
                          {status === "done" && "✓ "}
                          {status === "active" ? "转换中" : status === "done" ? "已完成" : "待转换"}
                        </span>
                      )}
                      {/* 删除文件按钮 — 玻璃风格 */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFile(index);
                        }}
                        className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 p-1.5 rounded-full hover:bg-red-100/50 dark:hover:bg-red-900/25 backdrop-blur-sm transition-colors duration-200 flex-shrink-0"
                        aria-label="删除文件"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.8}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </motion.button>
                    </motion.li>
                  );
                  })}
                  </AnimatePresence>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);

export default FileList;