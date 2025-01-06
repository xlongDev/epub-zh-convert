import { useState } from "react";
import { FaShareAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const ShareButton = ({ file, fileName }) => {
  const [isSharing, setIsSharing] = useState(false); // 用于控制分享按钮的禁用状态

  const handleShare = async () => {
    if (isSharing) return; // 如果正在分享，则直接返回
    setIsSharing(true); // 开始分享，禁用按钮

    try {
      // 生成文件的下载链接
      const url = URL.createObjectURL(file);

      if (navigator.share) {
        // 如果支持 navigator.share，则分享下载链接
        await navigator.share({
          title: '下载转换后的文件',
          text: `我已将文件 "${fileName}" 转换为 EPUB 格式，点击链接下载：${url}`,
        });
      } else {
        // 如果不支持 navigator.share，则复制链接到剪贴板
        navigator.clipboard.writeText(url);
        alert('链接已复制到剪贴板，您可以手动分享。');
      }

      // 释放 URL 对象
      URL.revokeObjectURL(url);
    } catch (error) {
      // 如果用户取消分享，忽略错误
      if (error.name !== "AbortError") {
        console.error('分享失败:', error);
        alert('分享失败，请手动复制链接后分享。');
      }
    } finally {
      setIsSharing(false); // 分享完成，重新启用按钮
    }
  };

  return (
    <motion.button
      onClick={handleShare}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
      className={`p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md ${
        isSharing ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={isSharing} // 禁用按钮
    >
      <FaShareAlt className="w-5 h-5" />
    </motion.button>
  );
};

export default ShareButton;