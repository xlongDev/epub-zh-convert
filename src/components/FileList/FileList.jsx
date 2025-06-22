import { FaFile, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa"; // 基础图标

import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useState, useCallback, useMemo } from "react";
import Checkbox from "@/components/Checkbox/Checkbox"; // 确保路径正确

// 辅助函数：根据文件扩展名返回对应的图标
const getFileIcon = (fileName) => {
  const extension = fileName.split(".").pop().toLowerCase();
  switch (extension) {
    case "epub":
      return <FaFileEpub className="text-blue-500 text-xl" />;
    case "pdf":
      return <FaFilePdf className="text-red-500 text-xl" />;
    case "doc":
    case "docx":
      return <FaFileWord className="text-blue-700 text-xl" />;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return <FaFileImage className="text-green-500 text-xl" />;
    default:
      return (
        <FaFile className="text-gray-500 text-xl" /> // 默认图标
      );
  }
};

export const FileList = ({ files, isFileListOpen, setIsFileListOpen, handleDeleteFile }) => {
  const [selectedFiles, setSelectedFiles] = useState(new Set());

  // 添加调试日志
  console.log("--- FileList Render ---");
  console.log("FileList received files.length:", files.length);
  console.log("FileList current files:", files); // 打印实际的文件对象
  console.log("------------------------");

  // 使用 useCallback 优化事件处理函数
  const handleSelectAll = useCallback((e) => {
    // 阻止事件冒泡到父 div，避免同时触发文件列表的开关
    e.stopPropagation();
    setSelectedFiles(prev =>
      prev.size === files.length ? new Set() : new Set(files.map((_, i) => i))
    );
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

    setSelectedFiles(new Set()); // 清空选中状态
  }, [selectedFiles, handleDeleteFile]);

  // 计算选中文件数量
  const selectedCount = useMemo(() => selectedFiles.size, [selectedFiles.size]);

  // 计算全选状态
  const isAllSelected = useMemo(() =>
    files.length > 0 && selectedFiles.size === files.length,
    [files.length, selectedFiles.size]
  );

  // 如果没有文件，直接返回 null，不渲染列表
  if (files.length === 0) {
    console.log("FileList: No files, returning null.");
    return null;
  }

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
        <div className="pointer-events-none"> {/* 阻止鼠标事件穿透到子元素 */}
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
                    // 使用 file.name + index 作为 key，更稳定
                    key={file.name + "-" + index} 
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
                    {getFileIcon(file.name)} {/* 调用辅助函数获取图标 */}
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

// 如果在 UploadSection.jsx 中不是命名导出，则保持默认导出
// export default FileList;