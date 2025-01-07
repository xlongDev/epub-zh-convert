import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import loadingAnimation from "public/animations/loading.json";

// 动态导入 LottiePlayer，并禁用 SSR
const LottiePlayer = dynamic(() => import("react-lottie-player"), { ssr: false });

export const ProgressIndicator = ({ progress }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="mt-0 text-center"
    >
      <LottiePlayer
        animationData={loadingAnimation} // 确保传递正确的动画文件
        loop={true}
        play // 确保动画播放
        style={{ width: 170, height: 170, margin: "0 auto" }}
      />
      <p className="text-gray-700 dark:text-gray-300 mt-4">
        转换中... {Math.round(progress)}%
      </p>
    </motion.div>
  );
};