import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CancellationNoticeProps {
  show: boolean;
}

/**
 * CancellationNotice — 取消转换提示（停止图标横幅）
 *
 * - 停止方块图标（⏹）+ 横幅式文字
 * - 入场：卡片弹性缩放淡入
 * - 无持续动画（静态展示）
 * - 容器：glass-panel 全宽，与上传区/文件列表等宽
 */
const CancellationNotice = ({ show }: CancellationNoticeProps) => {
  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.95 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 22,
        }}
        className="mt-4 text-center"
      >
        {/* 外层玻璃面板 —— 全宽横幅 */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="glass-panel py-3.5 px-5 rounded-xl shadow-md flex flex-row items-center justify-start gap-3.5 w-full"
        >
          {/* 停止图标 */}
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 14,
              delay: 0.25,
            }}
            className="w-9 h-9 rounded-lg flex items-center justify-center z-10 flex-shrink-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(59,130,246,.15), rgba(99,102,241,.12))",
              border: "1px solid rgba(59,130,246,.28)",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="#3b82f6"
              aria-hidden="true"
            >
              <rect x="5" y="5" width="14" height="14" rx="3" />
            </svg>
          </motion.div>

          {/* 文字 —— 单行 */}
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              已取消转换
            </span>
            <span className="text-gray-500 dark:text-gray-400 ml-1.5">
              已转换的文件仍可在下方下载。
            </span>
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default React.memo(CancellationNotice);
