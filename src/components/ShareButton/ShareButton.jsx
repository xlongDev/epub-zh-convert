import { useState, useRef, useEffect } from "react";
import { FaShareAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

const TOOLTIP_WIDTH = 220;
const TOOLTIP_GAP = 8;
const SHOW_DURATION = 3500;

const ShareButton = ({ file, fileName }) => {
  const [isSharing, setIsSharing] = useState(false);
  const [message, setMessage] = useState("");
  const [tipPos, setTipPos] = useState(null);
  const buttonRef = useRef(null);
  const timerRef = useRef(null);

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  // 同步计算 tooltip 屏幕位置（不依赖 React re-render）
  const calcTipPosition = () => {
    if (!buttonRef.current) return null;
    const rect = buttonRef.current.getBoundingClientRect();
    let left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - TOOLTIP_WIDTH - 8));
    return {
      top: rect.bottom + TOOLTIP_GAP,
      left,
    };
  };

  // 用非阻塞的轻提示替代 alert()：不中断操作，且对屏幕阅读器友好
  const showMessage = (text) => {
    // 清理上一次残留的定时器
    clearTimeout(timerRef.current);

    // 同步设置：state 触发渲染，ref 供同步读取
    setMessage(text);

    // 立即同步计算位置（buttonRef 已在 DOM 中，无需等 rAF / React 更新）
    setTipPos(calcTipPosition());

    // 定时清除（3.5 秒，补偿动画入场时间）
    timerRef.current = setTimeout(() => {
      setMessage("");
      setTipPos(null);
    }, SHOW_DURATION);
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
    <>
      <div className="relative">
        <motion.button
          ref={buttonRef}
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
      </div>
      {/* 通过 Portal 渲染到 body，彻底脱离父容器 overflow 裁切 */}
      {message &&
        tipPos &&
        createPortal(
          <AnimatePresence mode="wait">
            <motion.div
              key="share-tip"
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, y: -6, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="z-[9999] text-xs text-gray-700 dark:text-gray-200 glass rounded-lg px-3 py-1.5 shadow-xl max-w-[220px] text-center leading-snug pointer-events-none"
              style={{
                position: "fixed",
                top: tipPos.top,
                left: tipPos.left,
              }}
            >
              {/* 小箭头 — 居中指向按钮 */}
              <span
                className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 glass border-t-0 border-l-0 rounded-tl-none"
              />
              {message}
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};

export default ShareButton;
