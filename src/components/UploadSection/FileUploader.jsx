import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * FileUploader 组件
 * 负责文件选择输入框、拖拽区域的UI和交互。
 * 它包含一个隐藏的文件输入框和拖拽区域的视觉反馈。
 */
const FileUploader = React.memo(
  ({
    onFileChange, // 文件选择事件处理器
    onDragOver, // 拖拽进入事件处理器
    onDragLeave, // 拖拽离开事件处理器
    onDrop, // 拖拽释放事件处理器
    isDragging, // 外部传入的拖拽状态
    isLoading, // 外部传入的加载状态
    progress, // 外部传入的转换进度
    conversionDirection, // 转换方向显示
  }) => {
    // 内部状态，用于控制点击时的动画效果
    const [isClicking, setIsClicking] = useState(false);
    // 内部状态，用于控制鼠标悬停时的视觉效果
    const [isHoveringUpload, setIsHoveringUpload] = useState(false);

    return (
      <div className="relative">
        <motion.div
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300
            ${
              isDragging
                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20"
                : isHoveringUpload
                ? "border-blue-400 bg-blue-50/30 dark:bg-blue-900/10"
                : "border-gray-300 dark:border-gray-600 backdrop-blur-lg bg-white/30 dark:bg-gray-700/30" // 将 backdrop-blur-md 改为 backdrop-blur-lg
            }`}
          onClick={() => document.getElementById("file-upload").click()} // 点击区域触发文件输入框
          onMouseDown={() => setIsClicking(true)} // 鼠标按下时设置点击状态
          onMouseUp={() => setIsClicking(false)} // 鼠标松开时取消点击状态
          onMouseEnter={() => setIsHoveringUpload(true)} // 鼠标进入时设置悬停状态
          onMouseLeave={() => setIsHoveringUpload(false)} // 鼠标离开时取消悬停状态
          onDragOver={onDragOver} // 拖拽进入事件
          onDragLeave={onDragLeave} // 拖拽离开事件
          onDrop={onDrop} // 拖拽释放事件
          whileHover={{ scale: 1.01 }} // 悬停时轻微放大
          whileTap={{ scale: 0.99 }} // 点击时轻微缩小
          animate={{
            scale: isClicking ? 0.99 : 1, // 根据点击状态进行动画
          }}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-3 bg-blue-100/50 dark:bg-blue-900/30 rounded-full">
              {/* 文件上传图标 */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 text-blue-500 dark:text-blue-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  点击上传
                </span>{" "}
                或拖放文件到此处
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                仅支持.epub格式文件
              </p>
            </div>
          </div>
        </motion.div>
        {/* 隐藏的文件输入框 */}
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          className="sr-only"
          onChange={onFileChange}
          multiple // 允许选择多个文件
          accept=".epub" // 仅接受.epub文件
        />
        {/* 加载中的覆盖层和进度百分比显示 */}
        {isLoading && (
          <motion.div
            className="absolute inset-0 bg-transparent backdrop-blur-md backdrop-brightness-90 dark:backdrop-brightness-110 rounded-xl flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 relative flex items-center justify-center">
                <div className="absolute w-full h-full flex items-center justify-center">
                  <div className="w-14 h-14 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
                </div>
                <div className="text-blue-600 dark:text-blue-400 font-medium text-sm z-10">
                  {Math.round(progress)}%
                </div>
              </div>
              {/* <p className="text-sm text-gray-800 dark:text-gray-300">
                正在转换中...
              </p> */}
            </div>
          </motion.div>
        )}
      </div>
    );
  }
);

export default FileUploader;