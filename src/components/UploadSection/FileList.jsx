// src/components/FileList.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * FileList 组件
 * 显示用户已选择的文件列表，并提供展开/收起功能和删除文件的操作。
 */
const FileList = React.memo(
  ({ files, isFileListOpen, setIsFileListOpen, handleDeleteFile }) => {
    return (
      <div className="bg-white/50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
        {/* 文件列表头部，点击可展开/收起 */}
        <div
          className="flex items-center justify-between p-3 cursor-pointer"
          onClick={() => setIsFileListOpen(!isFileListOpen)}
        >
          <div className="flex items-center">
            {/* 文件图标 */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-blue-500 dark:text-blue-300 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
            <h3 className="font-medium text-gray-700 dark:text-gray-200">
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
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="border-t border-gray-200 dark:border-gray-600 p-3">
                <ul className="space-y-2 max-h-60 overflow-y-auto">
                  {files.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-gray-50 dark:bg-gray-600/30 p-3 rounded-lg"
                    >
                      <div className="flex items-center truncate">
                        {/* 文件类型图标 */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5 text-indigo-500 dark:text-indigo-300 mr-2 flex-shrink-0"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                          />
                        </svg>
                        <span className="text-sm truncate text-gray-700 dark:text-gray-300">
                          {file.name}
                        </span>
                      </div>
                      {/* 删除文件按钮 */}
                      <button
                        onClick={() => handleDeleteFile(index)}
                        className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

export default FileList;