import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// 集中动态引入 lottie-web，避免重复在多个组件中各自 dynamic 引入
const LottiePlayer = dynamic(() => import("react-lottie-player"), {
  ssr: false,
});

/**
 * 共享 Lottie 封装
 * - 统一 dynamic 引入与 reduced-motion 处理
 * - 当系统开启「减少动态」时，强制 loop=false（仅播放一次并停在末帧），避免无限循环消耗资源
 */
const Lottie = ({
  animationData,
  loop = true,
  play = true,
  style,
  className,
  ariaLabel,
}) => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  if (!animationData) return null;

  return (
    <LottiePlayer
      animationData={animationData}
      loop={reduced ? false : loop}
      play={play}
      style={style}
      className={className}
      aria-label={ariaLabel}
      role="img"
    />
  );
};

export default Lottie;
