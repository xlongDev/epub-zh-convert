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

/* ----------------------------- 颜色工具 ----------------------------- */
// 将 #rrggbb 转为 {h,s,l}（h: 0-360, s/l: 0-1）；非法输入返回 null
function hexToHsl(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "");
  if (!m) return null;
  const r = parseInt(m[1], 16) / 255;
  const g = parseInt(m[2], 16) / 255;
  const b = parseInt(m[3], 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s, l };
}

// 将 {h,s,l} 转回 #rrggbb
function hslToHex({ h, s, l }) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const mm = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const to = (v) =>
    Math.round((v + mm) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

// 保留背景色相，但强制拉满饱和与对比，使礼花在淡背景下清晰可见
function getContrastColor(hex, theme) {
  const hsl = hexToHsl(hex);
  if (!hsl) return hex; // 解析失败回退原值
  const s = Math.max(hsl.s, 0.7);
  const l = theme === "dark" ? Math.max(hsl.l, 0.6) : 0.55;
  return hslToHex({ h: hsl.h, s, l });
}

/**
 * 转换完成庆祝礼花（方案 C）
 * - 仅作庆祝点缀：从区块中心迸发一轮粒子，约 2.6s 播放一次后淡出
 * - 配色自动适配当前随机背景：由 scheme.colors 提供色相，再程序化提升对比度
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

  // 根据当前背景方案 + 主题解析粒子调色板（取色相后提升对比度）
  const palette = useMemo(() => {
    const schemeColors = scheme?.colors;
    const key = resolvedTheme === "dark" ? "dark" : "light";
    const base = schemeColors?.[key] ?? DEFAULT_COLORS;
    return base.map((c) => getContrastColor(c, resolvedTheme));
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
              boxShadow:
                resolvedTheme === "dark"
                  ? "0 1px 4px rgba(0,0,0,0.4)"
                  : "0 1px 4px rgba(15,23,42,0.25)",
              border:
                resolvedTheme === "dark"
                  ? "1px solid rgba(255,255,255,0.18)"
                  : "1px solid rgba(255,255,255,0.5)",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CompletionCelebration;
