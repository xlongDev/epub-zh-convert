import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProgressIndicatorProps {
  progress: number;
  currentFileIndex?: number;
  totalFiles?: number;
  isPaused?: boolean;
}

/**
 * ProgressIndicator — 液态玻璃风格进度条
 * 展示转换百分比与「第 i / N」序号，带流体光泽扫过动画。
 */
const ProgressIndicator = React.memo(
  ({
    progress,
    currentFileIndex = 0,
    totalFiles = 1,
    isPaused = false,
  }: ProgressIndicatorProps) => {
    const percent = Math.round(progress);
    const showFileIndex = totalFiles > 1;

    return (
      <AnimatePresence>
        {progress > 0 && progress < 100 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto", transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } }}
            exit={{ opacity: 0, height: 0, transition: { duration: 0.28, ease: [0.4, 0, 1, 1] } }}
            className="mt-4"
          >
            {/* 玻璃容器 */}
            <div className="glass-panel p-4">
              {/* 标签行 */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  {/* 暂停态脉动琥珀圆点 */}
                  <AnimatePresence>
                    {isPaused && (
                      <motion.span
                        key="paused-dot"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 18 }}
                      >
                        <motion.span
                          className="block w-2 h-2 rounded-full bg-amber-400"
                          style={{ boxShadow: "0 0 8px 1px rgba(251,191,36,0.6)" }}
                          animate={{ opacity: [1, 0.35, 1], scale: [1, 0.78, 1] }}
                          transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {/* 标签文字：切换时弹簧弹入 */}
                  <motion.span
                    key={isPaused ? "p" : "c"}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className={`text-sm font-medium ${
                      isPaused
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                    aria-live="polite"
                  >
                    {isPaused
                      ? "已暂停"
                      : showFileIndex
                      ? `正在转换第 ${currentFileIndex + 1} / ${totalFiles} 个`
                      : "正在转换中…"}
                  </motion.span>
                </div>
                {/* 百分比数字 — 玻璃内嵌胶囊 */}
                <span className="
                  text-sm font-semibold tabular-nums px-2.5 py-0.5 rounded-lg
                  bg-white/40 dark:bg-white/[0.08]
                  border border-white/30 dark:border-white/10
                  shadow-sm backdrop-blur-md
                  text-indigo-600 dark:text-indigo-400
                ">
                  {percent}%
                </span>
              </div>

              {/* 进度轨道 — 玻璃凹槽 */}
              <div
                className="
                  relative w-full h-2.5 rounded-full overflow-hidden
                  bg-white/30 dark:bg-black/20
                  border border-white/25 dark:border-white/8
                  shadow-inner
                "
                role="progressbar"
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={
                  showFileIndex
                    ? `第 ${currentFileIndex + 1} / ${totalFiles} 个文件转换进度`
                    : "转换进度"
                }
              >
                {/* 填充条 — 渐变 + 流体光泽 */}
                <motion.div
                  className={`absolute inset-y-0 left-0 rounded-full ${
                    isPaused
                      ? "bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500"
                      : "bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"
                  }`}
                  style={{ boxShadow: isPaused ? "0 0 12px 1px rgba(251,191,36,0.45)" : "none" }}
                  initial={{ width: "0%" }}
                  animate={{
                    width: `${progress}%`,
                    opacity: isPaused ? [0.62, 0.95, 0.62] : 1,
                  }}
                  transition={{
                    width: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
                    opacity: isPaused
                      ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
                      : { duration: 0.3 },
                  }}
                >
                  {/* 流体光泽扫过层（仅运行中显示，暂停时停止） */}
                  {!isPaused && (
                    <motion.div
                      className="absolute inset-0 -translate-x-full overflow-hidden"
                      style={{
                        background: "linear-gradient(90deg, transparent 15%, rgba(255,255,255,0.45) 50%, transparent 85%)",
                      }}
                      animate={{ translateX: ["-100%", "250%"] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 0.8,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                  {/* 内部高光边缘 */}
                  <div className="absolute top-0.5 left-1 right-1 h-[3px] rounded-full bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                </motion.div>

                {/* 轨道内微光点（装饰） */}
                <div className="absolute inset-0 flex items-center justify-end pr-0.5 pointer-events-none">
                  <div className="w-1 h-1 rounded-full bg-white/20 dark:bg-white/5" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

export default ProgressIndicator;
