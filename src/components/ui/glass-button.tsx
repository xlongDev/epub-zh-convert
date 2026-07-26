import React from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloseIcon, PauseIcon, PlayIcon } from "@/components/icons";

// ── 液态玻璃主按钮 ──
export interface GlassButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled: boolean;
  variant?: "brand" | "neutral";
  className?: string;
}

export const GlassButton = React.memo(
  ({ children, onClick, disabled, variant = "brand", className = "" }: GlassButtonProps) => (
    <motion.button
      layout
      onClick={onClick}
      disabled={disabled}
      whileHover={{
        scale: disabled ? 1 : 1.02,
        transition: { type: "spring", stiffness: 400, damping: 20 },
      }}
      whileTap={{
        scale: disabled ? 1 : 0.975,
        transition: { type: "spring", stiffness: 500, damping: 15 },
      }}
      className={`
      w-full relative flex items-center justify-center
      py-3 px-6 rounded-xl overflow-hidden
      ${variant === "brand" ? "glass-btn-brand" : "glass-btn"}
      ${disabled ? "opacity-85 cursor-not-allowed" : ""}
      ${className}
    `}
    >
      {/* 顶部高光带 */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/10" />
      {/* 内部光泽扫过效果 */}
      {!disabled && (
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <motion.div
            className="absolute inset-0 -translate-x-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)",
            }}
            animate={{ translateX: ["-100%", "200%"] }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              repeatDelay: 1.5,
              ease: "easeInOut",
            }}
          />
        </div>
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  ),
);

// ── 液态玻璃取消按钮 ──
export interface GlassCancelButtonProps {
  handleCancel: () => void;
}

export const GlassCancelButton = React.memo(({ handleCancel }: GlassCancelButtonProps) => (
  <AnimatePresence>
    <motion.button
      layout
      onClick={handleCancel}
      initial={{ opacity: 0, x: 20, scale: 0.92 }}
      animate={{
        opacity: 1,
        x: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 300, damping: 20, delay: 0.08 },
      }}
      exit={{
        opacity: 0,
        x: 20,
        scale: 0.92,
        transition: { duration: 0.22 },
      }}
      whileHover={{
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 18 },
      }}
      whileTap={{
        scale: 0.97,
        transition: { type: "spring", stiffness: 500, damping: 14 },
      }}
      className="
        w-full px-6 py-3 rounded-xl relative overflow-hidden
        glass-btn text-gray-600 dark:text-gray-300
      "
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent dark:via-white/8" />
      <span className="relative z-10 flex items-center gap-2">
        <CloseIcon />
        取消转换
      </span>
    </motion.button>
  </AnimatePresence>
));

// ── 液态玻璃暂停/继续按钮 ──
export interface GlassPauseResumeButtonProps {
  isPaused: boolean;
  onToggle: () => void;
}

export const GlassPauseResumeButton = React.memo(
  ({ isPaused, onToggle }: GlassPauseResumeButtonProps) => (
    <div className="relative">
      {/* 暂停态琥珀光环：暂停时浮出，继续时淡出 */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-0.5 rounded-xl border-2 border-amber-400"
        initial={false}
        animate={{
          opacity: isPaused ? 0.9 : 0,
          boxShadow: isPaused
            ? "0 0 0 3px rgba(251,191,36,0.22), 0 0 14px 2px rgba(251,191,36,0.35)"
            : "0 0 0 0 rgba(251,191,36,0)",
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      />
      {/* 切换脉冲：每次暂停/继续都从按钮扩散一圈，确认操作生效 */}
      <AnimatePresence>
        <motion.div
          key={isPaused ? "pulse-paused" : "pulse-resume"}
          aria-hidden
          className={`pointer-events-none absolute inset-0 rounded-xl border-2 ${
            isPaused ? "border-amber-400" : "border-indigo-400"
          }`}
          initial={{ opacity: 0.55, scale: 0.96 }}
          animate={{ opacity: 0, scale: 1.28 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </AnimatePresence>

      <AnimatePresence>
        <motion.button
          layout
          onClick={onToggle}
          initial={{ opacity: 0, x: -20, scale: 0.92 }}
          animate={{
            opacity: 1,
            x: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 300, damping: 20, delay: 0.08 },
          }}
          exit={{
            opacity: 0,
            x: -20,
            scale: 0.92,
            transition: { duration: 0.22 },
          }}
          whileHover={{
            scale: 1.02,
            transition: { type: "spring", stiffness: 400, damping: 18 },
          }}
          whileTap={{
            scale: 0.97,
            transition: { type: "spring", stiffness: 500, damping: 14 },
          }}
          className="
            w-full px-6 py-3 rounded-xl relative overflow-hidden
            glass-btn text-gray-600 dark:text-gray-300
          "
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent dark:via-white/8" />
          <span className="relative z-10 flex items-center justify-center gap-2">
            {/* 图标形变：暂停↔继续 交叉淡入 + 旋转 + 缩放 */}
            <span className="relative inline-flex w-5 h-5 items-center justify-center">
              <AnimatePresence>
                <motion.span
                  key={isPaused ? "play" : "pause"}
                  initial={{ opacity: 0, rotate: -90, scale: 0.4 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.4 }}
                  transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {isPaused ? <PlayIcon /> : <PauseIcon />}
                </motion.span>
              </AnimatePresence>
            </span>
            {isPaused ? "继续" : "暂停"}
          </span>
        </motion.button>
      </AnimatePresence>
    </div>
  ),
);
