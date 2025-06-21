import { FaFile, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useState, useCallback, useMemo } from "react";
import Checkbox from "@/components/Checkbox/Checkbox";

export const FileList = ({ files, isFileListOpen, setIsFileListOpen, handleDeleteFile }) => {
  const [selectedFiles, setSelectedFiles] = useState(new Set());

  // 使用 useCallback 优化事件处理函数
  const handleSelectAll = useCallback((e) => {
    setSelectedFiles(prev =>
      prev.size === files.length ? new Set() : new Set(files.map((_, i) => i))
    );
    e.stopPropagation();
  }, [files.length]);

  const handleSelectFile = useCallback((index) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev);
      newSet.has(index) ? newSet.delete(index) : newSet.add(index);
      return newSet;
    });
  }, []);

  const handleDeleteSelected = useCallback(() => {
    // 从后往前删除以避免索引问题
    Array.from(selectedFiles)
      .sort((a, b) => b - a)
      .forEach(handleDeleteFile);

    setSelectedFiles(new Set());
  }, [selectedFiles, handleDeleteFile]);

  // 计算选中文件数量
  const selectedCount = useMemo(() => selectedFiles.size, [selectedFiles.size]);

  // 计算全选状态
  const isAllSelected = useMemo(() =>
    files.length > 0 && selectedFiles.size === files.length,
    [files.length, selectedFiles.size]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-6"
    >
      <div
        onClick={() => setIsFileListOpen(!isFileListOpen)}
        className="flex items-center justify-between w-full p-3 bg-gray-100/60 dark:bg-gray-700/60 rounded-xl hover:bg-gray-200/60 dark:hover:bg-gray-600/60 transition-colors cursor-pointer"
      >
        <div className="flex items-center space-x-3">
          <Checkbox
            checked={isAllSelected}
            onChange={handleSelectAll}
            title={isAllSelected ? "取消全选" : "全选"}
          />
          <span className="text-gray-700 dark:text-gray-300">
            已选择 {files.length} 个文件
          </span>
        </div>
        <div className="pointer-events-none">
          {isFileListOpen ? (
            <FaChevronUp className="text-gray-500 dark:text-gray-400" />
          ) : (
            <FaChevronDown className="text-gray-500 dark:text-gray-400" />
          )}
        </div>
      </div>

      <AnimatePresence>
        {isFileListOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-2"
          >
            <LayoutGroup>
              <AnimatePresence initial={false}>
                {files.map((file, index) => (
                  <motion.div
                    key={index}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.2,
                        delay: index * 0.03,
                        type: "spring",
                        stiffness: 300,
                      },
                    }}
                    exit={{
                      opacity: 0,
                      x: 50,
                      scale: 0.9,
                      transition: { duration: 0.3 },
                    }}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 15,
                      boxShadow: { duration: 0.2 },
                    }}
                    className="flex items-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl shadow-md"
                  >
                    <Checkbox
                      checked={selectedFiles.has(index)}
                      onChange={() => handleSelectFile(index)}
                      className="mr-3"
                    />
                    <FaFile className="text-[#60A5FA] dark:text-[#818CF8] mr-3 min-w-[16px]" />
                    <span
                      className="text-gray-700 dark:text-gray-300 truncate flex-1"
                      title={file.name}
                    >
                      {file.name}
                    </span>
                    <motion.button
                      onClick={() => handleDeleteFile(index)}
                      whileHover={{
                        scale: 1.15,
                        rotate: [0, -5, 5, 0],
                      }}
                      whileTap={{ scale: 0.9 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 10,
                        rotate: { duration: 0.4 },
                      }}
                      className="text-red-400 hover:text-red-500 transition-colors"
                      aria-label={`删除文件 ${file.name}`}
                    >
                      <FaTrash />
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </LayoutGroup>

            {selectedCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-4"
              >
                <motion.button
                  onClick={handleDeleteSelected}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="w-full bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-600 transition-colors shadow-md flex justify-center items-center"
                >
                  删除所选 ({selectedCount})
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};