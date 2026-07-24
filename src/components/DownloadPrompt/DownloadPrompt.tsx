import { motion } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";

interface DownloadPromptProps {
  showDownloadPrompt: boolean;
  scrollToConvertedFiles: () => void;
}

const DownloadPrompt = ({ showDownloadPrompt, scrollToConvertedFiles }: DownloadPromptProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-4 left-4 right-4 sm:bottom-4 sm:right-4 sm:left-auto glass-btn-success p-3.5 rounded-xl shadow-lg flex flex-col sm:flex-row items-center gap-2 z-50"
    >
      <p className="text-sm text-center sm:text-left text-[#15803d] dark:text-[#86efac]">
        转换成功！下拉或点击以下载文件。
      </p>
      <motion.button
        onClick={scrollToConvertedFiles}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
        className="glass-btn-brand px-3 py-1.5 rounded-xl flex items-center font-medium"
      >
        <FaArrowDown className="mr-1" />
        <span className="text-sm">下载</span>
      </motion.button>
    </motion.div>
  );
};

export default DownloadPrompt; // 默认导出