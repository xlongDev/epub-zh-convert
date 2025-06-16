import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import errorAnimation from "public/animations/error.json";

// 动态导入 LottiePlayer，并禁用 SSR
const LottiePlayer = dynamic(() => import("react-lottie-player"), {
  ssr: false,
});

const ErrorDisplay = ({ error }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="mt-2 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <LottiePlayer
          animationData={errorAnimation}
          loop={false}
          play
          style={{ width: 140, height: 140, margin: "0 auto" }}
        />
        <p className="text-red-500 dark:text-red-400 text-xl mt-4">{error}</p>
      </motion.div>
    </motion.div>
  );
};

export default ErrorDisplay;
