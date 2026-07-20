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
    onDragEnter, // 拖拽进入事件处理器（计数 +1）
    onDragOver, // 拖拽悬停事件处理器
    onDragLeave, // 拖拽离开事件处理器（计数 -1）
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

    // 根据状态确定显示的文字
    const hintText = isHoveringUpload || isDragging ? "支持批量上传哦~" : "仅支持.epub格式文件";

    return (
      <div className="relative">
        <motion.div
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2
            ${
              isDragging
                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20"
                : isHoveringUpload
                ? "border-blue-400 bg-blue-50/30 dark:bg-blue-900/10"
                : "border-gray-300 dark:border-gray-600 backdrop-blur-lg bg-white/30 dark:bg-gray-700/30" // 将 backdrop-blur-md 改为 backdrop-blur-lg
            }`}
          role="button"
          tabIndex={0}
          aria-label="点击或按回车选择 EPUB 文件，也可将文件拖放至此处"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              document.getElementById("file-upload").click();
            }
          }}
          onClick={() => document.getElementById("file-upload").click()} // 点击区域触发文件输入框
          onMouseDown={() => setIsClicking(true)} // 鼠标按下时设置点击状态
          onMouseUp={() => setIsClicking(false)} // 鼠标松开时取消点击状态
          onMouseEnter={() => setIsHoveringUpload(true)} // 鼠标进入时设置悬停状态
          onMouseLeave={() => setIsHoveringUpload(false)} // 鼠标离开时取消悬停状态
          onDragEnter={onDragEnter} // 拖拽进入事件（计数）
          onDragOver={onDragOver} // 拖拽悬停事件
          onDragLeave={onDragLeave} // 拖拽离开事件（计数）
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
              <div className="h-5 mt-1 relative">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={hintText}
                    className="text-xs text-gray-500 dark:text-gray-400 absolute inset-0"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {hintText}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
        {/* 隐藏的文件输入框 */}
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          className="sr-only"
          aria-label="选择 EPUB 文件上传"
          onChange={onFileChange}
          multiple // 允许选择多个文件
          accept=".epub" // 仅接受.epub文件
        />
        {/* 液态玻璃加载遮罩 — 流体进度环 + 玻璃质感 */}
        {isLoading && (
          <motion.div
            className="absolute inset-0 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px) saturate(140%)",
              WebkitBackdropFilter: "blur(8px) saturate(140%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden="true"
          >
            {/* 流体玻璃进度环 — 纯视觉氛围动画（无数字，数据由底部进度条承载） */}
            <div className="relative w-24 h-24">
              {/* 外层光晕 — 慢速旋转增加流动感 */}
              <div
                className="absolute -inset-3 rounded-full opacity-30 blur-lg"
                style={{
                  background: "conic-gradient(from 0deg, #60a5fa, #a78bfa, #34d399, #60a5fa)",
                  animation: "glass-glow-rotate 10s linear infinite",
                }}
              />
              {/* SVG 环形进度 */}
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
                {/* 背景轨道 */}
                <circle
                  cx="40" cy="40" r="34"
                  fill="none"
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth="6"
                  className="dark:stroke-white/[0.08]"
                />
                {/* 动画填充环 — 加粗更有分量感 */}
                <motion.circle
                  cx="40" cy="40" r="34"
                  fill="none"
                  stroke="url(#glass-progress-gradient)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 34}
                  initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - progress / 100) }}
                  transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                />
                {/* 渐变定义 */}
                <defs>
                  <linearGradient id="glass-progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="50%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>
              </svg>
              {/* 双层旋转外圈装饰 — 错向错速 */}
              <div
                className="absolute inset-0 rounded-full border-[2.5px] border-transparent"
                style={{
                  borderTopColor: "rgba(96,165,250,0.45)",
                  borderRightColor: "rgba(167,139,250,0.25)",
                  animation: "glass-ring-spin 2s linear infinite",
                }}
              />
              {/* 外圈反向慢旋 */}
              <div
                className="absolute -inset-2 rounded-full border-[1.5px] border-transparent"
                style={{
                  borderTopColor: "rgba(52,211,153,0.20)",
                  borderBottomColor: "rgba(96,165,250,0.15)",
                  animation: "glass-ring-spin-reverse 3s linear infinite",
                }}
              />
              {/* 中心呼吸光点 — 柔和脉动替代数字 */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                animate={{
                  scale: [1, 1.35, 1],
                  opacity: [0.45, 0.8, 0.45],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-3 h-3 rounded-full bg-white/50 dark:bg-white/25 shadow-sm" />
              </motion.div>
              <style>{`
                @keyframes glass-ring-spin {
                  to { transform: rotate(360deg); }
                }
                @keyframes glass-ring-spin-reverse {
                  to { transform: rotate(-360deg); }
                }
                @keyframes glass-glow-rotate {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          </motion.div>
        )}
      </div>
    );
  }
);

export default FileUploader;