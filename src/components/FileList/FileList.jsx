import { FaFile, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa"; // 添加 FaChevronDown 和 FaChevronUp
import { motion, AnimatePresence } from "framer-motion";

export const FileList = ({ files, isFileListOpen, setIsFileListOpen, handleDeleteFile }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-6"
    >
      <motion.button
        onClick={() => setIsFileListOpen(!isFileListOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
        className="w-full flex justify-between items-center p-3 bg-gray-100/60 dark:bg-gray-700/60 rounded-lg hover:bg-gray-200/60 dark:hover:bg-gray-600/60 transition-colors"
      >
        <span className="text-gray-700 dark:text-gray-300">
          已选择 {files.length} 个文件
        </span>
        {isFileListOpen ? (
          <FaChevronUp className="text-gray-500 dark:text-gray-400" />
        ) : (
          <FaChevronDown className="text-gray-500 dark:text-gray-400" />
        )}
      </motion.button>

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
                className="flex items-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};