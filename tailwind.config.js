/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    // 浅色背景
    "bg-gradient-to-tl",
    "from-gray-300",
    "via-gray-100",
    "to-gray-200",
    "bg-gradient-to-r",
    "from-blue-300",
    "via-teal-300",
    "to-green-300",
    "from-gray-200",
    "via-blue-300",
    "to-gray-400",
    "from-orange-200",
    "via-pink-300",
    "to-purple-400",
    "from-teal-100",
    "via-cyan-100",
    "to-blue-100",
    "from-purple-50",
    "via-pink-50",
    "to-indigo-50",
    "from-green-50",
    "via-teal-50",
    "to-cyan-50",
    "from-pink-50",
    "via-orange-50",
    "to-yellow-50",

    // 深色背景
    "dark:from-gray-800",
    "dark:via-gray-900",
    "dark:to-black",
    "dark:via-gray-700",
    "dark:to-gray-600",
    "dark:from-gray-900",
    "dark:via-gray-800",
    "dark:to-gray-700",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};