import { FaFile, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export const FileList = ({ files, isFileListOpen, setIsFileListOpen, handleDeleteFile }) => {
  const [selectedFiles, setSelectedFiles] = useState(new Set());

  // 处理全选/取消全选
  const handleSelectAll = () => {
    if (selectedFiles.size === files.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(files.map((_, index) => index)));
    }
  };

  // 处理单个文件选择
  const handleSelectFile = (index) => {
    setSelectedFiles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // 删除所选文件
  const handleDeleteSelected = () => {
    const sortedIndices = Array.from(selectedFiles).sort((a, b) => b - a);
    sortedIndices.forEach((index) => handleDeleteFile(index));
    setSelectedFiles(new Set());
  };

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
          <input
            type="checkbox"
            checked={files.length > 0 && selectedFiles.size === files.length}
            onChange={(e) => {
              e.stopPropagation(); // 防止点击复选框触发展开/收起
              handleSelectAll();
            }}
            className="h-5 w-5 text-green-600 focus:ring-green-500 rounded"
            title={selectedFiles.size === files.length ? "取消全选" : "全选"}
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
            {files.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <input
                  type="checkbox"
                  checked={selectedFiles.has(index)}
                  onChange={() => handleSelectFile(index)}
                  className="h-5 w-5 text-green-600 focus:ring-green-500 rounded mr-3"
                />
                <FaFile className="text-[#60A5FA] dark:text-[#818CF8] mr-3" />
                <span
                  className="text-gray-700 dark:text-gray-300 truncate flex-1"
                  title={file.name}
                >
                  {file.name}
                </span>
                <motion.button
                  onClick={() => handleDeleteFile(index)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 10,
                  }}
                  className="text-red-400 hover:text-red-500 transition-colors"
                >
                  <FaTrash />
                </motion.button>
              </motion.div>
            ))}
            {selectedFiles.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-4"
              >
                <motion.button
                  onClick={handleDeleteSelected}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  className="w-full bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-600 transition-colors shadow-md"
                >
                  删除所选 ({selectedFiles.size})
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};