import React, { useState, useEffect, useRef } from "react";
import LottiePlayer from "react-lottie-player";

const WelcomeAnimation = React.memo(({ animationData, isVisible }) => {
  const [isLoading, setIsLoading] = useState(true);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      setIsLoading(true);
      timeoutRef.current = setTimeout(() => {
        setIsLoading(false);
      }, 600);
    } else {
      setIsLoading(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="mb-4 text-center">
      <div className="mx-auto relative" style={{ width: 150, height: 150 }}>
        {/* 动感骨架占位 */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            isLoading ? "opacity-70" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="w-full h-full rounded-full flex items-center justify-center">
            {/* 移除最外层圆圈背景，只保留透明容器 */}
            
            {/* 脉动光晕效果 */}
            <div className="absolute inset-0 rounded-full animate-pulse-slow bg-gradient-to-r from-blue-200/10 to-purple-200/5 dark:from-blue-400/5 dark:to-purple-400/5" />
            
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
                    animationDuration: '0.8s'
                  }}
                />
              ))}
            </div>

            {/* 波纹扩散效果 */}
            <div className="absolute w-20 h-20 border-2 border-blue-300/30 dark:border-blue-400/20 rounded-full animate-ping-slow" />
            <div 
              className="absolute w-16 h-16 border border-blue-200/40 dark:border-blue-300/20 rounded-full animate-ping-slower"
              style={{ animationDelay: '0.3s' }}
            />
            
            {/* 中心微光效果 */}
            <div className="absolute w-8 h-8 bg-white/20 dark:bg-white/10 rounded-full blur-sm" />
          </div>
        </div>

        {/* 实际动画 */}
        <div
          className={`transition-all duration-500 ease-out ${
            isLoading ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        >
          <LottiePlayer
            animationData={animationData}
            loop={true}
            play={!isLoading}
            style={{ width: 150, height: 150 }}
          />
        </div>
      </div>
    </div>
  );
});

WelcomeAnimation.displayName = "WelcomeAnimation";

export default WelcomeAnimation;