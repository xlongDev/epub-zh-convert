// 统一动画令牌（T10）：集中时长与缓动，避免各处魔法值漂移
import type { Variants } from "framer-motion";

export const durations = {
  fast: 0.2,
  base: 0.3,
  slow: 0.5,
  slower: 0.6,
};

interface SpringConfig {
  type: "spring";
  damping: number;
  stiffness: number;
}

export const easings = {
  // Material 标准缓动曲线，与全局 theme-transition 保持一致
  standard: [0.4, 0, 0.2, 1] as [number, number, number, number],
  out: "easeOut",
  inOut: "easeInOut",
  springSoft: { type: "spring", damping: 25, stiffness: 300 } as SpringConfig,
};

// 入场编排：Header → Direction → Upload 阶梯式 stagger
export const entranceStagger = {
  header: 0,
  direction: 0.15,
  upload: 0.3,
};

// 通用「上移淡入」变体，供各区块复用
export const fadeInUp = (delay = 0, y = 20): Variants => ({
  hidden: { opacity: 0, y },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.base, ease: easings.standard, delay },
  },
});

export const titleVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.slow,
      delay: entranceStagger.header,
      ease: easings.standard,
    },
  },
};

export const uploadVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.slow,
      delay: entranceStagger.upload,
      ease: easings.standard,
    },
  },
};

export const fileItemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10, transition: { duration: durations.base } },
};

export const errorVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: durations.base } },
  exit: { opacity: 0, y: -10 },
};
