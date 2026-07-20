import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── 按钮状态逻辑（不变） ──
const useButtonState = (isLoading, isComplete, isFailedOrCancelled) => {
  if (isLoading) {
    return {
      isLoading: true,
      disabled: true,
      icon: <LoadingIcon />,
      text: "转换中..."
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
      ${disabled ? "opacity-60 cursor-not-allowed pointer-events-none" : ""}
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
const LoadingIcon = () => (
  <svg className="animate-spin h-5 w-5" style={{ color: "inherit" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

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

// ── 主组件 ──
/**
 * ConversionButtons — 液态玻璃风格操作按钮组
 * 包含「开始转换 / 转换中 / 完成 / 重试」+ 可选「取消」按钮
 */
const ConversionButtons = React.memo(
  ({ isLoading, isComplete, isFailedOrCancelled, handleConvert, handleCancel }) => {
    const buttonState = useButtonState(isLoading, isComplete, isFailedOrCancelled);
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
            <GlassButton
              onClick={handleConvert}
              disabled={buttonState.isLoading && !isComplete}
              variant="brand"
            >
              {buttonState.icon}
              {buttonState.text}
            </GlassButton>

            {isLoading && <GlassCancelButton handleCancel={handleCancel} />}
          </motion.div>
        )}
      </AnimatePresence>
    );
  },
  (prevProps, nextProps) =>
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.isComplete === nextProps.isComplete &&
    prevProps.isFailedOrCancelled === nextProps.isFailedOrCancelled
);

export default ConversionButtons;
