import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatFileSize } from "@/utils/format";
import { DocumentIcon, CloseIcon, ChevronIcon } from "@/components/icons";

interface FileListProps {
  files: File[];
  isFileListOpen: boolean;
  setIsFileListOpen: (open: boolean) => void;
  handleDeleteFile: (index: number) => void;
  isLoading?: boolean;
  currentFileIndex?: number;
  onClearUploads?: () => void;
}

/**
 * FileList 组件
 * 显示用户已选择的文件列表，并提供展开/收起功能和删除文件的操作。
 * 优化了毛玻璃效果和文件项视觉层次
 */
const FileList = React.memo(
  ({
    files,
    isFileListOpen,
    setIsFileListOpen,
    handleDeleteFile,
    isLoading = false,
    currentFileIndex = 0,
    onClearUploads,
  }: FileListProps) => {
    // 文件列表直接由父级 files 驱动，退出动画交由 AnimatePresence 处理
    const [clearPulseKey, setClearPulseKey] = useState(0);

    // 清空全部上传文件：触发脉冲环后直接通知父级清空（退出动画由 AnimatePresence 负责）
    const handleClearUploads = () => {
      if (!onClearUploads || files.length === 0) return;
      setClearPulseKey((k) => k + 1); // 触发脉冲环
      onClearUploads();
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
              <DocumentIcon className="w-5 h-5 text-blue-600 dark:text-blue-300" />
            </div>
            <h3 className="font-medium text-gray-800 dark:text-gray-200 ml-3">
              已选文件 ({files.length})
            </h3>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* 清空全部上传文件按钮 — 复用文件项小叉叉图标风格 */}
            {files.length > 0 && !isLoading && onClearUploads && (
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
                  <CloseIcon className="w-4 h-4" />
                </motion.button>
              </div>
            )}
            {/* 展开/收起指示箭头 */}
            <motion.div
              animate={{ rotate: isFileListOpen ? 180 : 0 }} // 旋转箭头以指示状态
              transition={{ duration: 0.3 }}
            >
              <ChevronIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
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
                    {files.map((file, index) => {
                      // 逐文件状态（顺序转换）：已完成 / 转换中 / 待转换（T6）
                      const status =
                        !isLoading
                          ? null
                          : index < (currentFileIndex ?? 0)
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
                              <DocumentIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
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
                            <CloseIcon className="w-4 h-4" />
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
