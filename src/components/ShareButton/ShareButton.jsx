import { useState } from "react";
import { FaShareAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const ShareButton = ({ file, fileName }) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);

    try {
      let validFile = file;
      if (!(file instanceof File)) {
        console.warn("文件不是 File 类型，尝试转换...");
        validFile = new File([file], fileName || "default.epub", {
          type: "application/epub+zip",
        });
      }

      // 检查是否在桌面环境
      const isDesktop =
        typeof navigator.userAgent === "string" &&
        /Mac|Windows|Linux/.test(navigator.userAgent) &&
        !/Mobi|Android/i.test(navigator.userAgent);

      // 检查是否在桌面 Chrome
      const isDesktopChrome =
        isDesktop && navigator.userAgent.includes("Chrome");

      if (isDesktopChrome) {
        alert(
          "桌面版 Chrome 不完全支持分享功能，请尝试使用移动设备或 Safari 浏览器。"
        );
        setIsSharing(false);
        return; // 停止流程，不触发下载
      }

      // 检查分享支持情况
      if (navigator.canShare && navigator.canShare({ files: [validFile] })) {
        await navigator.share({
          title: "分享 EPUB 文件",
          files: [validFile],
        });
      } else {
        const url = URL.createObjectURL(validFile);
        await navigator.clipboard.writeText(url);
        alert("浏览器不支持文件分享，文件链接已复制到剪贴板！");
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      if (error.name === "AbortError" || error.name === "NotAllowedError") {
        console.log("用户取消了分享操作。");
        // 不显示错误提示，静默处理用户取消分享的情况
      } else {
        console.error("分享失败:", error);
        alert("分享失败，请检查文件类型或浏览器支持。");
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <motion.button
      onClick={handleShare}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
      className={`p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors shadow-md ${
        isSharing ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={isSharing}
    >
      <FaShareAlt className="w-5 h-5" />
    </motion.button>
  );
};

export default ShareButton;
