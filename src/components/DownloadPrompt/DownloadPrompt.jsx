import { motion } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";

const DownloadPrompt = ({ showDownloadPrompt, scrollToConvertedFiles }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-4 left-4 right-4 sm:bottom-4 sm:right-4 sm:left-auto bg-green-500 text-white p-3 rounded-xl shadow-lg flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 z-50"
    >
      <p className="text-sm text-center sm:text-left">
        转换成功！下拉或点击以下载文件。
      </p>
      <motion.button
        onClick={scrollToConvertedFiles}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
        className="bg-white text-green-500 px-3 py-1 rounded-xl hover:bg-green-100 transition-colors flex items-center"
      >
        <FaArrowDown className="mr-1" />
        <span className="text-sm">下载</span>
      </motion.button>
    </motion.div>
  );
};

export default DownloadPrompt; // 默认导出