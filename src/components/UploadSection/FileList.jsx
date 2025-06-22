// src/components/FileList.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * FileList 组件
 * 显示用户已选择的文件列表，并提供展开/收起功能和删除文件的操作。
 * 优化了毛玻璃效果和文件项视觉层次
 */
const FileList = React.memo(
  ({ files, isFileListOpen, setIsFileListOpen, handleDeleteFile }) => {
    // Helper function to format file size
    const formatFileSize = (sizeInBytes) => {
      if (sizeInBytes === 0) return "0 MB";
      const sizeInMB = sizeInBytes / (1024 * 1024);
      return `${sizeInMB.toFixed(2)} MB`;
    };

    return (
      <motion.div
        className="bg-white/10 dark:bg-gray-800/10 backdrop-blur-xl backdrop-saturate-150 rounded-2xl border border-white/40 dark:border-gray-700/60 shadow-xl overflow-hidden"
        layout // 添加布局动画
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* 文件列表头部，点击可展开/收起 */}
        <div
          className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/30 dark:hover:bg-gray-700/30 transition-colors rounded-t-2xl backdrop-blur-lg shadow-sm"
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
              已选文件 ({files.length})
            </h3>
          </div>
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
              <div className="border-t border-white/40 dark:border-gray-700/60 p-3 bg-gradient-to-b from-white/10 to-transparent dark:from-gray-800/10">
                <ul className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                  {files.map((file, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: {
                          delay: index * 0.05,
                          duration: 0.3,
                        },
                      }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-center justify-between bg-white/60 dark:bg-gray-700/50 backdrop-blur-md backdrop-saturate-150 p-3 rounded-xl border border-white/50 dark:border-gray-600/60 shadow-sm hover:shadow transition-all duration-200"
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
                      {/* 删除文件按钮 */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFile(index);
                        }}
                        className="text-gray-600 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400 p-1.5 rounded-full hover:bg-red-100/60 dark:hover:bg-red-900/30 backdrop-blur-sm transition-colors flex-shrink-0"
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
                  ))}
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