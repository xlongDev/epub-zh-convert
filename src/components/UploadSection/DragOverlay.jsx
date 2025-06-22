import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * DragOverlay 组件
 * 当用户将文件拖拽到上传区域上方时显示的覆盖层。
 * 提供友好的视觉反馈。
 */
const DragOverlay = React.memo(({ isDragging }) => {
  return (
    <AnimatePresence>
      {isDragging && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/40 dark:bg-gray-900/80 rounded-xl backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 0.2 },
          }}
          exit={{
            opacity: 0,
            transition: { duration: 0.15 },
          }}
          key="drag-overlay"
        >
          <motion.div
            className="flex flex-col items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: {
                type: "spring",
                damping: 10,
                stiffness: 300,
                delay: 0.1,
              },
            }}
          >
            <motion.p className="text-lg font-semibold text-white dark:text-gray-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
              松开以上传文件
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default DragOverlay;