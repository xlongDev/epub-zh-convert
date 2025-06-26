import React from "react";
import { motion } from "framer-motion";
import { titleVariants } from "@/utils/animations";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";
import GitHubLink from "@/components/GitHubLink/GitHubLink";

/**
 * 文本动画配置 - 用于实现字符级别的动画效果
 * hidden: 初始状态 - 不可见且位置偏移
 * visible: 可见状态 - 带索引延迟的弹簧动画
 * hover: 悬停状态 - 轻微放大效果
 * tap: 点击状态 - 轻微缩小效果
 */
const textAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08, // 每个字符延迟0.08秒
      type: "spring", // 弹簧动画类型
      damping: 12, // 阻尼系数
      stiffness: 300, // 弹性系数
    },
  }),
  hover: {
    scale: 1.02, // 悬停时放大2%
    transition: {
      duration: 0.3, // 动画持续时间
      type: "spring", // 弹簧动画类型
      stiffness: 400, // 弹性系数
    },
  },
  tap: {
    scale: 0.95, // 点击时缩小5%
  },
};

/**
 * 应用头部组件
 * 包含标题动画和功能按钮(主题切换、GitHub链接)
 */
export default function Header() {
  const title = "EPUB 繁简转换器";

  return (
    <motion.nav
      initial="hidden" // 初始动画状态
      animate="visible" // 目标动画状态
      variants={titleVariants} // 应用标题动画配置
      className="flex justify-between items-center mb-8"
      aria-label="导航栏"
    >
      {/* 标题区域 - 字符级动画效果 */}
      <motion.div
        className="text-3xl font-bold text-gray-800 dark:text-gray-100"
        initial="hidden"
        animate="visible"
        whileHover="hover" // 悬停时触发动画
        whileTap="tap" // 点击时触发动画
        aria-label={title}
      >
        {/* 将标题字符串拆分为单个字符并应用动画 */}
        {title.split("").map((char, index) => (
          <motion.span
            key={index}
            custom={index} // 传递索引用于动画延迟
            variants={textAnimation}
            className="inline-block whitespace-pre"
            style={{
              position: "relative",
              // 处理空格字符的特殊样式
              display: char === " " ? "inline" : "inline-block",
            }}
            aria-hidden="true"
          >
            {/* 使用不间断空格替代普通空格 */}
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.div>

      {/* 功能按钮区域 - 包含主题切换和GitHub链接 */}
      <motion.div variants={titleVariants} className="flex space-x-4">
        <ThemeToggle /> 
        <GitHubLink /> 
      </motion.div>
    </motion.nav>
  );
}
