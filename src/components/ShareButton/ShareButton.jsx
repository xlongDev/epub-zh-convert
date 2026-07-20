import { useState } from "react";
import { FaShareAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const ShareButton = ({ file, fileName }) => {
  const [isSharing, setIsSharing] = useState(false);
  const [message, setMessage] = useState("");

  // 用非阻塞的轻提示替代 alert()：不中断操作，且对屏幕阅读器友好
  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);

    try {
      let validFile = file;
      if (!(file instanceof File)) {
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
        showMessage("桌面版 Chrome 不完全支持分享，请尝试移动设备或 Safari。");
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
        // 复制到剪贴板的是 blob: URL，必须保留对象引用，
        // 因此这里不能立即 revoke，否则用户粘贴出的链接会失效。
        showMessage("浏览器不支持文件分享，文件链接已复制到剪贴板！");
      }
    } catch (error) {
      if (error.name === "AbortError" || error.name === "NotAllowedError") {
        // 用户主动取消分享，静默处理
      } else {
        showMessage("分享失败，请检查文件类型或浏览器支持。");
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="relative flex flex-col items-end">
      <motion.button
        onClick={handleShare}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 350, damping: 12 }}
        className={`p-2 rounded-xl glass-btn-brand shadow-sm ${
          isSharing ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isSharing}
        aria-label="分享文件"
      >
        <FaShareAlt className="w-4 h-4" />
      </motion.button>
      {message && (
        <div
          role="status"
          aria-live="polite"
          className="mt-2 text-xs text-gray-700 dark:text-gray-200 glass rounded-lg px-3 py-1.5 shadow-lg max-w-[200px] text-center"
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default ShareButton;
