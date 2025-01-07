import { FaDownload, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import ShareButton from "@/components/ShareButton/ShareButton";

export const ConvertedFilesList = ({
  convertedFiles,
  handleDownloadSingle,
  handleDeleteConvertedFile,
  handleDownloadAll,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      id="converted-files" // 确保 id 正确设置
      className="mt-8"
    >
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
        转换后的文件
      </h2>
      <motion.ul className="space-y-4">
        {convertedFiles.map((file, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex justify-between items-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <span
              className="text-gray-700 dark:text-gray-300 truncate"
              title={file.name}
            >
              {file.name}
            </span>
            <div className="flex space-x-4">
              <ShareButton file={file.blob} fileName={file.name} />
              <motion.button
                id={`download-${index}`}
                onClick={() => handleDownloadSingle(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 10,
                }}
                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md"
              >
                <FaDownload className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={() => handleDeleteConvertedFile(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 10,
                }}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md"
              >
                <FaTrash className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.li>
        ))}
      </motion.ul>
      {/* 添加批量下载按钮 */}
      <motion.button
        onClick={handleDownloadAll}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
        className="mt-6 w-full bg-[#8B5CF6] text-white py-3 px-6 rounded-lg hover:bg-[#7C3AED] active:bg-[#6D28D9] transition-colors shadow-md"
      >
        批量下载所有文件
      </motion.button>
    </motion.div>
  );
};