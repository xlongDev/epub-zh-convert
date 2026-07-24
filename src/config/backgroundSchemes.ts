/**
 * 全站背景颜色方案常量
 * 包含多种渐变背景选项，每个方案都提供浅色模式和深色模式的对应配置
 * 所有颜色类名均基于 Tailwind CSS v3.x 的默认颜色配置
 * 适用于：页面背景、卡片组件背景、模态框背景等场景
 *
 * colors 字段：礼花(CompletionCelebration)等动画组件据此自动适配背景配色
 *  - light: 该套浅色渐变的真实十六进制 stop（from / via / to）
 *  - dark : 深色模式下背景为统一灰色渐变，此处用同色相但更亮/更饱和的色调，
 *           以便在灰色背景上依然醒目
 */
import type { BackgroundScheme } from "@/types";

const backgroundSchemes: BackgroundScheme[] = [
  {
    // 清新渐变色方案 - 从蓝色过渡到绿色
    light: "bg-gradient-to-r from-blue-300 via-teal-300 to-green-300",
    dark: "dark:from-gray-800 dark:via-gray-700 dark:to-gray-600",
    colors: {
      light: ["#93c5fd", "#5eead4", "#86efac"],
      dark: ["#60a5fa", "#2dd4bf", "#4ade80"],
    },
  },
  {
    // 暖色调渐变方案 - 从橙色过渡到紫色
    light: "bg-gradient-to-r from-orange-200 via-pink-300 to-purple-400",
    dark: "dark:from-gray-900 dark:via-gray-800 dark:to-gray-700",
    colors: {
      light: ["#fed7aa", "#f9a8d4", "#c084fc"],
      dark: ["#fb923c", "#ec4899", "#a855f7"],
    },
  },
  {
    // 复古色系渐变 - amber到stone
    light: "bg-gradient-to-r from-amber-100 via-amber-200 to-stone-300",
    dark: "dark:from-gray-900 dark:via-gray-800 dark:to-gray-700",
    colors: {
      light: ["#fef3c7", "#fde68a", "#d6d3d1"],
      dark: ["#fbbf24", "#fcd34d", "#e5e7eb"],
    },
  },
  {
    // 粉彩双色渐变 - rose到pink
    light: "bg-gradient-to-r from-rose-100 via-pink-200 to-rose-300",
    dark: "dark:from-gray-800 dark:via-gray-700 dark:to-gray-600",
    colors: {
      light: ["#ffe4e6", "#fbcfe8", "#fda4af"],
      dark: ["#fb7185", "#f472b6", "#fda4af"],
    },
  },
  {
    // 海洋主题渐变 - cyan到blue
    light: "bg-gradient-to-r from-cyan-200 via-sky-300 to-blue-400",
    dark: "dark:from-gray-900 dark:via-gray-800 dark:to-gray-700",
    colors: {
      light: ["#a5f3fc", "#7dd3fc", "#60a5fa"],
      dark: ["#22d3ee", "#38bdf8", "#3b82f6"],
    },
  },
  {
    // 星空深蓝渐变 - blue到indigo
    light: "bg-gradient-to-r from-blue-200 via-indigo-300 to-blue-400",
    dark: "dark:from-gray-900 dark:via-gray-800 dark:to-gray-700",
    colors: {
      light: ["#bfdbfe", "#a5b4fc", "#60a5fa"],
      dark: ["#60a5fa", "#818cf8", "#3b82f6"],
    },
  },
  {
    // 极光紫绿渐变 - violet到emerald
    light: "bg-gradient-to-r from-violet-300 via-emerald-200 to-teal-300",
    dark: "dark:from-gray-800 dark:via-gray-700 dark:to-gray-600",
    colors: {
      light: ["#c4b5fd", "#a7f3d0", "#5eead4"],
      dark: ["#8b5cf6", "#34d399", "#2dd4bf"],
    },
  },
  {
    // 傍晚霞光渐变 - red到orange
    light: "bg-gradient-to-r from-red-200 via-orange-300 to-yellow-200",
    dark: "dark:from-gray-900 dark:via-gray-800 dark:to-gray-700",
    colors: {
      light: ["#fecaca", "#fdba74", "#fef08a"],
      dark: ["#f87171", "#fb923c", "#facc15"],
    },
  },
  {
    // 热带日落渐变 - amber到pink
    light: "bg-gradient-to-r from-amber-200 via-pink-300 to-red-200",
    dark: "dark:from-gray-900 dark:via-gray-800 dark:to-gray-700",
    colors: {
      light: ["#fde68a", "#f9a8d4", "#fecaca"],
      dark: ["#fbbf24", "#ec4899", "#f87171"],
    },
  },
  {
    // 科技未来感渐变 - indigo到cyan
    light: "bg-gradient-to-r from-indigo-300 via-blue-300 to-cyan-300",
    dark: "dark:from-gray-900 dark:via-gray-800 dark:to-gray-700",
    colors: {
      light: ["#a5b4fc", "#93c5fd", "#67e8f9"],
      dark: ["#818cf8", "#60a5fa", "#22d3ee"],
    },
  },
  {
    // 森林晨曦 - 柔和的青绿色渐变
    light: "bg-gradient-to-r from-emerald-100 via-teal-100 to-cyan-200",
    dark: "dark:from-gray-900 dark:via-gray-800 dark:to-gray-700",
    colors: {
      light: ["#d1fae5", "#ccfbf1", "#a5f3fc"],
      dark: ["#34d399", "#2dd4bf", "#22d3ee"],
    },
  },
  {
    // 薰衣草庄园 - 梦幻紫粉渐变
    light: "bg-gradient-to-r from-fuchsia-100 via-purple-100 to-indigo-200",
    dark: "dark:from-gray-900 dark:via-gray-800 dark:to-gray-700",
    colors: {
      light: ["#fae8ff", "#f3e8ff", "#c7d2fe"],
      dark: ["#e879f9", "#c084fc", "#818cf8"],
    },
  },
  {
    // 沙漠琥珀 - 暖调大地色渐变
    light: "bg-gradient-to-r from-yellow-50 via-amber-100 to-orange-100",
    dark: "dark:from-gray-900 dark:via-gray-800 dark:to-gray-700",
    colors: {
      light: ["#fefce8", "#fef3c7", "#ffedd5"],
      dark: ["#fde047", "#fcd34d", "#fdba74"],
    },
  },
  {
    // 冰雪极光 - 冷调蓝紫渐变
    light: "bg-gradient-to-r from-sky-100 via-violet-100 to-blue-200",
    dark: "dark:from-gray-900 dark:via-gray-800 dark:to-gray-700",
    colors: {
      light: ["#e0f2fe", "#ede9fe", "#bfdbfe"],
      dark: ["#38bdf8", "#a78bfa", "#60a5fa"],
    },
  },
  {
    // 热带珊瑚 - 活力橙红渐变
    light: "bg-gradient-to-r from-rose-200 via-orange-100 to-pink-200",
    dark: "dark:from-gray-900 dark:via-gray-800 dark:to-gray-700",
    colors: {
      light: ["#fecdd3", "#ffedd5", "#fbcfe8"],
      dark: ["#fb7185", "#fdba74", "#f472b6"],
    },
  },
];

export default backgroundSchemes;
