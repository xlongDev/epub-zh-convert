import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Lottie from "@/components/Lottie/Lottie";

interface WelcomeAnimationProps {
  isVisible: boolean;
}

const WelcomeAnimation = React.memo(({ isVisible }: WelcomeAnimationProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [animationData, setAnimationData] = useState<unknown>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // 延迟到下一帧再设置加载态，避免 effect 内同步 setState
    const raf = requestAnimationFrame(() => setIsLoading(isVisible));
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    if (isVisible) {
      // 动画 JSON 改为运行时 fetch，避免 ~534KB 被打进首屏 JS 包
      fetch("/animations/welcome.json")
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then((data) => {
          if (active) setAnimationData(data);
        })
        .catch(() => {
          // 加载失败时仅保留骨架占位，不影响其余功能
        });
      timer = setTimeout(() => {
        setIsLoading(false);
      }, 600);
    }
    return () => {
      active = false;
      cancelAnimationFrame(raf);
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="mb-4 text-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.5 } }}
    >
      <div className="mx-auto relative" style={{ width: 150, height: 150 }}>
        {/* 动感骨架占位 */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            isLoading ? "opacity-70" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="w-full h-full rounded-full flex items-center justify-center">
            {/* 脉动光晕效果 */}
            <div className="absolute inset-0 animate-pulse-slow bg-gradient-to-r from-blue-200/10 to-purple-200/5 dark:from-blue-400/5 dark:to-purple-400/5" />

            {/* 旋转圆环 */}
            <div className="absolute w-24 h-24 border-2 border-transparent border-t-blue-300/50 dark:border-t-blue-400/30 rounded-full animate-spin-slow" />

            {/* 跳动圆点 */}
            <div className="absolute flex space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-blue-400/60 dark:bg-blue-300/50 rounded-full animate-bounce"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: "0.8s",
                  }}
                />
              ))}
            </div>

            {/* 波纹扩散效果 */}
            <div className="absolute w-20 h-20 border-2 border-blue-300/30 dark:border-blue-400/20 rounded-full animate-ping-slow" />
            <div
              className="absolute w-16 h-16 border border-blue-200/40 dark:border-blue-300/20 rounded-full animate-ping-slower"
              style={{ animationDelay: "0.3s" }}
            />

            {/* 中心微光效果 */}
            <div className="absolute w-8 h-8 bg-white/20 dark:bg-white/10 rounded-full blur-sm" />
          </div>
        </div>

        {/* 实际动画（数据就绪后才渲染 Lottie 播放器） */}
        {animationData ? (
          <div
            className={`transition-all duration-500 ease-out ${
              isLoading ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
          >
            <Lottie
              animationData={animationData}
              loop={true}
              play={!isLoading}
              style={{ width: 150, height: 150 }}
              ariaLabel="欢迎"
            />
          </div>
        ) : null}
      </div>
    </motion.div>
  );
});

WelcomeAnimation.displayName = "WelcomeAnimation";

export default WelcomeAnimation;
