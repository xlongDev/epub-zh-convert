/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    // 渐变方向类
    'bg-gradient-to-r',

    // ===== Light 模式中的颜色停止类 =====
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
    
    // ===== Dark 模式中的颜色停止类 =====
    'dark:from-gray-800', 'dark:via-gray-700', 'dark:to-gray-600',
    'dark:from-gray-900', 'dark:via-gray-800', 'dark:to-gray-700',
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};