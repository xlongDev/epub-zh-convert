/**
 * 全站背景颜色方案常量
 * 包含多种渐变背景选项，每个方案都提供浅色模式和深色模式的对应配置
 * 所有颜色类名均基于Tailwind CSS v3.x的默认颜色配置
 * 适用于：页面背景、卡片组件背景、模态框背景等场景
 */
const backgroundSchemes = [
  {
    // 清新渐变色方案 - 从蓝色过渡到绿色
    light: "bg-gradient-to-r from-blue-300 via-teal-300 to-green-300",
    dark: "dark:from-gray-800 dark:via-gray-700 dark:to-gray-600",
  },
  {
    // 暖色系渐变方案 - 欢快活泼氛围
    light: "bg-gradient-to-r from-pink-50 via-orange-50 to-yellow-50",
    dark: "dark:from-gray-800 dark:via-gray-700 dark:to-gray-600",
  },
  {
    // 暖色调渐变方案 - 从橙色过渡到紫色
    light: "bg-gradient-to-r from-orange-200 via-pink-300 to-purple-400",
    dark: "dark:from-gray-900 dark:via-gray-800 dark:to-gray-700",
  },
  {
    // 浅蓝绿色渐变方案 - 适合柔和背景需求
    light: "bg-gradient-to-r from-teal-100 via-cyan-100 to-blue-100",
    dark: "dark:from-gray-800 dark:via-gray-700 dark:to-gray-600",
  },
  {
    // 冷调科技感渐变 - indigo到violet
    light: "bg-gradient-to-r from-indigo-200 via-violet-300 to-blue-200",
    dark: "dark:from-gray-900 dark:via-gray-800 dark:to-gray-700",
  },
  {
    // 自然生态色系 - emerald到stone
    light: "bg-gradient-to-r from-emerald-50 via-stone-100 to-lime-50",
    dark: "dark:from-gray-800 dark:via-gray-700 dark:to-gray-600",
  },
  {
    // 复古色系渐变 - amber到stone
    light: "bg-gradient-to-r from-amber-100 via-amber-200 to-stone-300",
    dark: "dark:from-gray-900 dark:via-gray-800 dark:to-gray-700",
  },
  {
    // 粉彩双色渐变 - rose到pink
    light: "bg-gradient-to-r from-rose-100 via-pink-200 to-rose-300",
    dark: "dark:from-gray-800 dark:via-gray-700 dark:to-gray-600",
  },
  {
    // 海洋主题渐变 - cyan到blue
    light: "bg-gradient-to-r from-cyan-200 via-sky-300 to-blue-400",
    dark: "dark:from-gray-900 dark:via-gray-800 dark:to-gray-700",
  },
  {
    // 星空深蓝渐变 - blue到indigo
    light: "bg-gradient-to-r from-blue-200 via-indigo-300 to-blue-400",
    dark: "dark:from-gray-900 dark:via-gray-800 dark:to-gray-700",
  },
  {
    // 极光紫绿渐变 - violet到emerald
    light: "bg-gradient-to-r from-violet-300 via-emerald-200 to-teal-300",
    dark: "dark:from-gray-800 dark:via-gray-700 dark:to-gray-600",
  },
  {
    // 傍晚霞光渐变 - red到orange
    light: "bg-gradient-to-r from-red-200 via-orange-300 to-yellow-200",
    dark: "dark:from-gray-900 dark:via-gray-800 dark:to-gray-700",
  },
  {
    // 深海蓝灰渐变 - sky到gray
    light: "bg-gradient-to-r from-sky-100 via-gray-200 to-slate-300",
    dark: "dark:from-gray-800 dark:via-gray-700 dark:to-gray-600",
  },
  {
    // 热带日落渐变 - amber到pink
    light: "bg-gradient-to-r from-amber-200 via-pink-300 to-red-200",
    dark: "dark:from-gray-900 dark:via-gray-800 dark:to-gray-700",
  },
  {
    // 科技未来感渐变 - indigo到cyan
    light: "bg-gradient-to-r from-indigo-300 via-blue-300 to-cyan-300",
    dark: "dark:from-gray-900 dark:via-gray-800 dark:to-gray-700",
  },
];

export default backgroundSchemes;
