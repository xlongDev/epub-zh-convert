/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    // 基础渐变方向
    'bg-gradient-to-r',
    
    // 原有背景方案
    'from-pink-50', 'via-orange-50', 'to-yellow-50',
    'from-blue-300', 'via-teal-300', 'to-green-300',
    'from-orange-200', 'via-pink-300', 'to-purple-400',
    'from-teal-100', 'via-cyan-100', 'to-blue-100',
    'from-indigo-200', 'via-violet-300', 'to-blue-200',
    'from-emerald-50', 'via-stone-100', 'to-lime-50',
    'from-amber-100', 'via-amber-200', 'to-stone-300',
    'from-rose-100', 'via-pink-200', 'to-rose-300',
    'from-cyan-200', 'via-sky-300', 'to-blue-400',
    'from-blue-200', 'via-indigo-300', 'to-blue-400',
    'from-violet-300', 'via-emerald-200', 'to-teal-300',
    'from-red-200', 'via-orange-300', 'to-yellow-200',
    'from-sky-100', 'via-gray-200', 'to-slate-300',
    'from-amber-200', 'via-pink-300', 'to-red-200',
    'from-indigo-300', 'via-blue-300', 'to-cyan-300',
    
    // 新增背景方案 (2025-12-24)
    'from-emerald-100', 'via-teal-100', 'to-cyan-200',    // 森林晨曦
    'from-fuchsia-100', 'via-purple-100', 'to-indigo-200', // 薰衣草庄园
    'from-yellow-50', 'via-amber-100', 'to-orange-100',    // 沙漠琥珀
    'from-sky-100', 'via-violet-100', 'to-blue-200',      // 冰雪极光
    'from-rose-200', 'via-orange-100', 'to-pink-200',     // 热带珊瑚
    
    // 深色模式渐变
    'dark:from-gray-800', 'dark:via-gray-700', 'dark:to-gray-600',
    'dark:from-gray-900', 'dark:via-gray-800', 'dark:to-gray-700',
    
    // 动画类
    'animate-fadeIn',
    'animate-slideIn',
    'animate-scaleIn',
    'animate-pulse-slow',
    'animate-spin-slow',
    'animate-ping-slow',
    'animate-ping-slower',
    
    // 透明骨架屏
    'from-blue-200/10', 'to-purple-200/5',
    'dark:from-blue-400/5', 'dark:to-purple-400/5',
    'border-t-blue-300/50', 'dark:border-t-blue-400/30',
    'bg-blue-400/60', 'dark:bg-blue-300/50',
    'border-blue-300/30', 'dark:border-blue-400/20',
    'border-blue-200/40', 'dark:border-blue-300/20',
    'bg-white/20', 'dark:bg-white/10',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        fadeIn: 'fadeIn 1s ease-in-out forwards',
        slideIn: 'slideIn 0.5s ease-out forwards',
        scaleIn: 'scaleIn 0.5s ease-out forwards',
        'pulse-slow': 'pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
        'ping-slow': 'ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'ping-slower': 'ping-slower 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(1rem)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'ping-slow': {
          '75%, 100%': { transform: 'scale(1.8)', opacity: '0' },
        },
        'ping-slower': {
          '75%, 100%': { transform: 'scale(2)', opacity: '0' },
        },
      },
      // 优化深色模式过渡
      transitionProperty: {
        'theme': 'background-color, border-color, color, fill, stroke',
      },
      transitionTimingFunction: {
        'theme': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        'theme': '300ms',
      }
    },
  },
  plugins: [
    // 添加深色模式过渡插件
    function({ addUtilities }) {
      addUtilities({
        '.theme-transition': {
          'transition-property': 'background-color, border-color, color, fill, stroke',
          'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
          'transition-duration': '300ms',
        }
      });
    }
  ],
};