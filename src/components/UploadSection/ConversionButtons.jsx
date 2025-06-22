import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// 自定义钩子处理按钮状态逻辑
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

// 动画按钮组件
const AnimatedButton = React.memo(({ 
  children, 
  onClick, 
  disabled, 
  isLoading, 
  className = ""
}) => {
  return (
    <motion.button
      layout
      onClick={onClick}
      disabled={disabled}
      whileHover={{
        scale: 1.05,
        transition: {
          type: "spring",
          stiffness: 500,
          damping: 20,
        },
      }}
      whileTap={{
        scale: 0.95,
        transition: {
          type: "spring",
          stiffness: 600,
          damping: 15,
        },
      }}
      className={`
        w-full relative flex items-center justify-center
        py-3 px-6 rounded-xl shadow-md overflow-hidden
        ${className}
      `}
    >
      {/* 背景动画 */}
      <BackgroundAnimation />
      
      {/* 光晕效果 */}
      <GlowEffect />
      
      <span className="relative z-10 flex items-center">
        {children}
      </span>
    </motion.button>
  );
});

// 按钮背景动画组件
const BackgroundAnimation = () => (
  <motion.div
    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700"
    initial={{ x: "-100%" }}
    whileHover={{
      x: "0%",
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    }}
  />
);

// 光晕效果组件
const GlowEffect = () => (
  <motion.div
    className="absolute inset-0 pointer-events-none"
    initial={{ opacity: 0 }}
    whileHover={{
      opacity: 0.3,
      transition: { duration: 0.3 },
    }}
  >
    <div className="absolute top-0 left-1/2 w-32 h-32 bg-white rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2" />
  </motion.div>
);

// 图标组件
const LoadingIcon = () => (
  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const CompleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const RetryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.928M4.929 16.652H0M12 3a9 9 0 018.66 12.695l-1.396 1.396M12 21a9 9 0 01-8.66-12.695l1.396-1.396" />
  </svg>
);

const StartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
  </svg>
);

const CancelIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// 取消按钮组件
const CancelButton = React.memo(({ handleCancel }) => (
  <AnimatePresence>
    <motion.button
      layout
      onClick={handleCancel}
      initial={{ opacity: 0, x: 20, scale: 0.9 }}
      animate={{
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 15,
          delay: 0.1,
        },
      }}
      exit={{
        opacity: 0,
        x: 20,
        scale: 0.9,
        transition: { duration: 0.25 },
      }}
      whileHover={{
        scale: 1.05,
        transition: {
          type: "spring",
          stiffness: 500,
          damping: 20,
        },
      }}
      whileTap={{
        scale: 0.95,
        transition: {
          type: "spring",
          stiffness: 600,
          damping: 15,
        },
      }}
      className="
        w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl 
        shadow-md dark:bg-gray-700 dark:text-gray-200 
        dark:hover:bg-gray-600 relative overflow-hidden
        flex items-center justify-center
      "
    >
      <motion.div
        className="absolute inset-0 bg-gray-200 dark:bg-gray-600"
        initial={{ x: "-100%" }}
        whileHover={{
          x: "0%",
          transition: {
            duration: 0.4,
            ease: "easeOut",
          },
        }}
      />
      <span className="relative flex items-center z-10">
        <CancelIcon />
        取消转换
      </span>
    </motion.button>
  </AnimatePresence>
));

/**
 * ConversionButtons 组件
 * 包含“开始转换”、“取消转换”或“重试转换”操作按钮。
 * 根据加载、完成、失败或取消状态显示不同的按钮文本和禁用状态。
 */
const ConversionButtons = React.memo(
  ({ isLoading, isComplete, isFailedOrCancelled, handleConvert, handleCancel }) => {
    const buttonState = useButtonState(isLoading, isComplete, isFailedOrCancelled);
    
    // 优化后的显示条件：当组件需要交互时显示
    const shouldDisplay = isLoading || !isComplete || isFailedOrCancelled || isComplete;

    return (
      <AnimatePresence>
        {shouldDisplay && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5,
                delay: 0.15,
                ease: "easeOut",
              },
            }}
            exit={{
              opacity: 0,
              y: 10,
              transition: {
                duration: 0.3,
              },
            }}
            className="mt-4 flex flex-wrap gap-3"
          >
            <AnimatedButton
              onClick={handleConvert}
              disabled={buttonState.isLoading && !isComplete}
              isLoading={buttonState.isLoading}
              className={`
                bg-gradient-to-r from-blue-500 to-indigo-600 text-white
                ${buttonState.isLoading ? "opacity-70 cursor-not-allowed" : ""}
              `}
            >
              {buttonState.icon}
              {buttonState.text}
            </AnimatedButton>

            {isLoading && <CancelButton handleCancel={handleCancel} />}
          </motion.div>
        )}
      </AnimatePresence>
    );
  },
  // 优化React.memo的比较函数
  (prevProps, nextProps) => 
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.isComplete === nextProps.isComplete &&
    prevProps.isFailedOrCancelled === nextProps.isFailedOrCancelled
);

export default ConversionButtons;