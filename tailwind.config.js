/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    'bg-gradient-to-r',
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
    'dark:from-gray-800', 'dark:via-gray-700', 'dark:to-gray-600',
    'dark:from-gray-900', 'dark:via-gray-800', 'dark:to-gray-700',
    
    // 新增的动画类名
    'animate-pulse-slow',
    'animate-spin-slow',
    'animate-ping-slow',
    'animate-ping-slower',
    
    // 新增的颜色类名（用于透明骨架屏）
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
        fadeIn: 'fadeIn 1s ease-in-out',
        slideIn: 'slideIn 0.5s ease-out',
        scaleIn: 'scaleIn 0.5s ease-out',
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
        'spin-slow': 'spin-slow 3s linear infinite',
        'ping-slow': 'ping-slow 2s ease-out infinite',
        'ping-slower': 'ping-slower 2.5s ease-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'ping-slow': {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
        'ping-slower': {
          '0%': { transform: 'scale(0.9)', opacity: '0.6' },
          '100%': { transform: 'scale(1.8)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};