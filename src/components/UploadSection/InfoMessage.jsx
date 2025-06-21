// src/components/InfoMessage.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * InfoMessage 组件
 * 根据文件的选择状态、加载状态和转换完成状态显示不同的提示信息。
 * 例如：隐私提示、转换成功提示。
 */
const InfoMessage = React.memo(({ isComplete, isLoading, filesLength }) => {
  // 如果没有文件或正在加载中，则不显示提示信息
  if (filesLength === 0 || isLoading) return null;

  // 根据完成状态选择不同的SVG图标路径
  const iconPath = isComplete
    ? "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    : "M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12_Unnamed: 12V8.25z";
  // 根据完成状态选择不同的消息文本
  const message = isComplete
    ? "转换成功~ 😄 请下拉页面下载~ 如果觉得对您有帮助 可在 GitHub 给个 star ⭐️ 哦 ! 😊"
    : "隐私: 仅在本地处理，不会上传到服务器, 请放心使用。";
  // 根据完成状态选择不同的背景颜色
  const bgColor = isComplete
    ? "bg-green-50/60 dark:bg-green-900/30 border-green-200 dark:border-green-700/50"
    : "bg-blue-50/60 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700/50";
  // 根据完成状态选择不同的文本颜色
  const textColor = isComplete
    ? "text-green-700 dark:text-green-200"
    : "text-blue-700 dark:text-blue-200";
  // 根据完成状态选择不同的图标颜色
  const iconColor = isComplete
    ? "text-green-500 dark:text-green-300"
    : "text-blue-500 dark:text-blue-300";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }} // 初始状态：透明且向上偏移
        animate={{
          opacity: 1,
          y: 0, // 动画到：不透明且回到原位
          transition: {
            duration: 0.4,
            delay: 0.1,
          },
        }}
        exit={{
          opacity: 0, // 退出动画：透明
          transition: { duration: 0.2 },
        }}
        className={`mt-4 mb-2 flex items-start p-3 rounded-lg border ${bgColor}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`w-5 h-5 flex-shrink-0 mr-2 ${iconColor}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
        </svg>
        <p className={`text-xs sm:text-sm ${textColor}`}>{message}</p>
      </motion.div>
    </AnimatePresence>
  );
});

export default InfoMessage;