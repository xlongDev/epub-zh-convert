import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DirectionSelector = React.memo(({ direction, setDirection }) => {
  const [activePosition, setActivePosition] = useState({ x: 0, width: 0 });
  const [isMounted, setIsMounted] = useState(false);

  // 获取激活项的位置信息
  useEffect(() => {
    setIsMounted(true);
    const activeElement = document.querySelector(
      `[data-direction="${direction}"]`
    );
    if (activeElement) {
      const { offsetLeft, offsetWidth } = activeElement;
      setActivePosition({ x: offsetLeft, width: offsetWidth });
    }
  }, [direction]);

  // 处理方向切换
  const handleDirectionChange = (dir) => {
    setDirection(dir);
    const activeElement = document.querySelector(`[data-direction="${dir}"]`);
    if (activeElement) {
      const { offsetLeft, offsetWidth } = activeElement;
      setActivePosition({ x: offsetLeft, width: offsetWidth });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mb-8"
      role="radiogroup"
      aria-label="选择转换方向"
    >
      <div className="relative bg-white/20 dark:bg-gray-800/30 backdrop-blur-lg rounded-xl p-1 border border-white/20 dark:border-gray-700/50 shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
        {/* 流动背景效果 */}
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 dark:from-blue-600/15 dark:to-purple-600/15"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 8,
              ease: "linear",
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>

        {/* 激活状态指示器 */}
        <AnimatePresence>
          <motion.div
            className="absolute top-1 bottom-1 rounded-lg bg-white dark:bg-gray-700/80 shadow-md z-0"
            initial={isMounted ? false : { x: activePosition.x, width: activePosition.width }}
            animate={{
              x: activePosition.x,
              width: activePosition.width,
            }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          />
        </AnimatePresence>

        <div className="relative flex z-10">
          {[
            { value: "t2s", label: "繁体转简体" },
            { value: "s2t", label: "简体转繁体" },
          ].map((option) => (
            <motion.button
              key={option.value}
              data-direction={option.value}
              className={`relative flex-1 py-3 px-6 rounded-lg text-center cursor-pointer select-none ${
                direction === option.value
                  ? "text-blue-600 dark:text-blue-300 font-medium"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              } transition-colors duration-200`}
              onClick={() => handleDirectionChange(option.value)}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {option.label}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
});

export default DirectionSelector;