import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

// 兜底配色（scheme 缺失时使用），取自全局液态玻璃品牌色板
const DEFAULT_COLORS = [
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#22c55e",
  "#10b981",
  "#f59e0b",
  "#ec4899",
];

/**
 * 转换完成庆祝礼花（方案 C）
 * - 仅作庆祝点缀：从区块中心迸发一轮粒子，约 2.6s 播放一次后淡出
 * - 配色自动适配当前随机背景：由 scheme.colors 提供，按当前主题(light/dark)取对应底色板
 * - 不显示文字：文件数量已由列表头部绿色徽标承载，避免信息重复
 * - prefers-reduced-motion 下完全不渲染
 * - 容器 pointer-events-none，不阻挡列表交互
 */
const CompletionCelebration = ({ show, scheme }) => {
  const [reduced, setReduced] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  // 根据当前背景方案 + 主题解析粒子调色板
  const palette = useMemo(() => {
    const schemeColors = scheme?.colors;
    if (!schemeColors) return DEFAULT_COLORS;
    const key = resolvedTheme === "dark" ? "dark" : "light";
    return schemeColors[key] ?? DEFAULT_COLORS;
  }, [scheme, resolvedTheme]);

  const particles = useMemo(
    () =>
      Array.from({ length: 48 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const dist = 130 + Math.random() * 250;
        return {
          id: i,
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist,
          size: 11 + Math.random() * 13,
          color: palette[i % palette.length],
          rotate: (Math.random() - 0.5) * 720,
          delay: Math.random() * 0.18,
        };
      }),
    [palette]
  );

  if (!show || reduced) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-0 right-0 z-50"
    >
      <div className="absolute left-1/2 top-[-90px]" style={{ transform: "translateX(-50%)" }}>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
            animate={{ x: p.dx, y: p.dy - 60, opacity: 0, rotate: p.rotate }}
            transition={{ duration: 2.4, delay: p.delay, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: p.size,
              height: p.size * 0.75,
              borderRadius: 3,
              background: p.color,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CompletionCelebration;
