import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import errorAnimation from "public/animations/error.json";

// 动态导入 LottiePlayer，并禁用 SSR，提高客户端渲染性能
const LottiePlayer = dynamic(() => import("react-lottie-player"), {
  ssr: false,
});

/**
 * ErrorDisplay 组件
 * 用于以视觉友好的方式显示错误信息。
 * 结合 Lottie 动画和 Framer Motion，提供更流畅的用户体验。
 * UI 设计与项目的整体风格保持一致，采用柔和的背景、圆角和阴影。
 *
 * @param {object} props - 组件的属性
 * @param {string} props.error - 要显示的错误消息
 */
const ErrorDisplay = ({ error }) => {
  return (
    <motion.div
      // 容器动画：从下方淡入，增加视觉流畅感
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      // 容器样式：居中显示，顶部增加外边距
      className="mt-4 text-center" // 将 mt-2 增加到 mt-4，增加与上方内容的间距
    >
      {/* 错误显示卡片：采用半透明背景、圆角、边框和阴影，与 UploadSection 等组件风格统一 */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }} // 初始状态：缩小且透明
        animate={{ scale: 1, opacity: 1 }} // 动画到：正常大小且不透明
        transition={{ duration: 0.5, delay: 0.2 }} // 动画持续时间和延迟
        // 核心样式：白色/深色模式下的半透明背景，轻微阴影，圆角，边框，以及内边距
        className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-6 rounded-xl shadow-lg border border-red-200 dark:border-red-700/50 flex flex-col items-center justify-center"
      >
        {/* Lottie 错误动画播放器 */}
        <LottiePlayer
          animationData={errorAnimation} // 动画数据
          loop={false} // 不循环播放
          play // 播放动画
          style={{ width: 100, height: 100, margin: "0 auto" }} // 动画尺寸和居中
        />
        {/* 错误文本：使用红色系，与错误主题相符，并提供深色模式支持 */}
        <p className="text-red-600 dark:text-red-400 text-md mt-1 font-semibold leading-relaxed">
          {error}
        </p>
        {/* 建议：可以根据实际情况添加更多提示，例如引导用户重试或检查网络 */}
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
          请检查文件，再重试。
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ErrorDisplay;