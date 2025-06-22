import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ProgressIndicator 组件
 * 显示文件转换的进度条，展示当前转换的百分比。
 */
const ProgressIndicator = React.memo(({ progress }) => {
  return (
    <AnimatePresence>
      {/* 仅当进度大于0且小于100时才显示进度条 */}
      {progress > 0 && progress < 100 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }} // 初始状态：透明且高度为0
          animate={{
            opacity: 1,
            height: "auto", // 动画到：不透明且高度自适应
            transition: {
              duration: 0.4,
              ease: "easeOut",
            },
          }}
          exit={{
            opacity: 0,
            height: 0, // 退出动画：透明且高度为0
            transition: {
              duration: 0.3,
              ease: "easeIn",
            },
          }}
          className="mt-4"
        >
          <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                转换进度
              </span>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
              <motion.div
                className="bg-blue-600 h-2.5 rounded-full"
                initial={{ width: "0%" }} // 初始宽度为0
                animate={{ width: `${progress}%` }} // 动画到当前进度百分比
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default ProgressIndicator;