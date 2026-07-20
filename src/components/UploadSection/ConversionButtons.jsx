import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── 按钮状态逻辑（不变） ──
const useButtonState = (isLoading, isComplete, isFailedOrCancelled, isPaused) => {
  if (isLoading && isPaused) {
    return {
      isLoading: true,
      disabled: true,
      icon: <PauseIcon />,
      text: "已暂停"
    };
  }

  if (isLoading) {
    return {
      isLoading: true,
      disabled: true,
      icon: null,
      text: "正在转换"
    };
  }

  if (isComplete) {
    return {
      isLoading: false,
      disabled: false,
      icon: <CompleteIcon />,
      text: "转换完成"
    };
  }

  if (isFailedOrCancelled) {
    return {
      isLoading: false,
      disabled: false,
      icon: <RetryIcon />,
      text: "重试转换"
    };
  }

  return {
    isLoading: false,
    disabled: false,
    icon: <StartIcon />,
    text: "开始转换"
  };
};

// ── 液态玻璃主按钮 ──
const GlassButton = React.memo(({
  children,
  onClick,
  disabled,
  variant = "brand", // brand | neutral
  className = ""
}) => (
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
            background: "linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)",
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
    <span className="relative z-10 flex items-center gap-2">
      {children}
    </span>
  </motion.button>
));

// ── 液态玻璃取消按钮 ──
const GlassCancelButton = React.memo(({ handleCancel }) => (
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
        <CancelIcon />
        取消转换
      </span>
    </motion.button>
  </AnimatePresence>
));

// ── 图标组件 ──
const CompleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const RetryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.928M4.929 16.652H0M12 3a9 9 0 018.66 12.695l-1.396 1.396M12 21a9 9 0 01-8.66-12.695l1.396-1.396" />
  </svg>
);

const StartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
  </svg>
);

const CancelIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const PauseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5M8.25 5.25v13.5" />
  </svg>
);

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.285L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
  </svg>
);

// ── 液态玻璃暂停/继续按钮 ──
const GlassPauseResumeButton = React.memo(({ isPaused, onToggle }) => (
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
));

// ── 主组件 ──
/**
 * ConversionButtons — 液态玻璃风格操作按钮组
 * 包含「开始转换 / 转换中 / 完成 / 重试」+ 可选「取消」按钮
 */
const ConversionButtons = React.memo(
  ({ isLoading, isComplete, isFailedOrCancelled, isPaused, handleConvert, handleCancel, handlePause, handleResume }) => {
    const buttonState = useButtonState(isLoading, isComplete, isFailedOrCancelled, isPaused);
    const shouldDisplay = isLoading || !isComplete || isFailedOrCancelled || isComplete;

    return (
      <AnimatePresence>
        {shouldDisplay && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.45, delay: 0.12, ease: [0.4, 0, 0.2, 1] },
            }}
            exit={{ opacity: 0, y: 8, transition: { duration: 0.25 } }}
            className="mt-4 flex flex-col gap-3"
          >
            {/* 主按钮：非加载时显示（加载时隐藏，只保留暂停/取消） */}
            <AnimatePresence>
              {!isLoading && (
                <GlassButton
                  onClick={handleConvert}
                  disabled={false}
                  variant="brand"
                  layout
                >
                  {buttonState.icon && <>{buttonState.icon}</>}
                  {buttonState.text}
                </GlassButton>
              )}
            </AnimatePresence>

            {isLoading && (
              <div className="grid grid-cols-2 gap-3">
                <GlassPauseResumeButton
                  isPaused={isPaused}
                  onToggle={isPaused ? handleResume : handlePause}
                />
                <GlassCancelButton handleCancel={handleCancel} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  },
  (prevProps, nextProps) =>
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.isComplete === nextProps.isComplete &&
    prevProps.isFailedOrCancelled === nextProps.isFailedOrCancelled &&
    prevProps.isPaused === nextProps.isPaused &&
    // 关键：handleConvert/handleCancel 闭包捕获了最新的 files，
    // 仅比较状态字段会导致新增文件后按钮仍引用旧闭包（只处理首次上传的文件）
    prevProps.handleConvert === nextProps.handleConvert &&
    prevProps.handleCancel === nextProps.handleCancel &&
    prevProps.handlePause === nextProps.handlePause &&
    prevProps.handleResume === nextProps.handleResume
);

export default ConversionButtons;
