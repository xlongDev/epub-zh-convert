import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface ClearConfirmModalProps {
  open: boolean;
  uploadCount?: number;
  convertedCount?: number;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * 清空全部确认弹窗（玻璃风格）
 * 用 Portal 渲染到 document.body，避免被 glass-panel / ul 的 overflow 裁切。
 */
const ClearConfirmModal = ({
  open,
  uploadCount = 0,
  convertedCount = 0,
  onConfirm,
  onCancel,
}: ClearConfirmModalProps) => {
  // Esc 关闭
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* 遮罩 */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onCancel}
            aria-hidden="true"
          />

          {/* 弹窗主体 */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="清空全部内容确认"
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="relative w-full max-w-sm glass-panel rounded-2xl p-6 shadow-2xl"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              清空全部内容？
            </h3>

            <div className="mt-3 text-sm text-gray-600 dark:text-gray-300 space-y-1.5">
              <p>
                将清空以下所有内容，且<span className="font-semibold text-red-600 dark:text-red-400">不可撤销</span>：
              </p>
              <ul className="list-disc list-inside pl-1 space-y-1">
                <li>
                  上传列表：<span className="font-semibold">{uploadCount}</span> 个文件
                </li>
                <li>
                  转换结果：<span className="font-semibold">{convertedCount}</span> 个文件
                </li>
              </ul>
              <p className="text-red-600/90 dark:text-red-400/90 text-xs pt-1">
                ⚠️ 未下载到本地的转换结果将永久丢失，请确认已保存所需文件。
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 py-2.5 px-4 rounded-xl glass-btn shadow-sm font-medium"
              >
                取消
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-2.5 px-4 rounded-xl glass-btn-danger shadow-sm font-medium"
              >
                确认清空
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ClearConfirmModal;
