import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 检测系统主题
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const systemTheme = mediaQuery.matches ? 'dark' : 'light';

    // 从 sessionStorage 中获取用户的手动选择
    const savedTheme = sessionStorage.getItem('theme');

    // 如果有手动选择，则使用手动选择的主题
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // 否则使用系统主题
      setTheme(systemTheme);
    }

    // 监听系统主题变化
    const handleSystemThemeChange = (e) => {
      const newSystemTheme = e.matches ? 'dark' : 'light';
      // 如果用户没有手动选择主题，则跟随系统主题变化
      if (!sessionStorage.getItem('theme')) {
        setTheme(newSystemTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    // 清理监听器
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [setTheme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    sessionStorage.setItem('theme', newTheme); // 保存用户的选择到 sessionStorage
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    >
      {theme === 'dark' ? (
        <FaSun className="w-5 h-5 text-yellow-500" />
      ) : (
        <FaMoon className="w-5 h-5 text-gray-800" />
      )}
    </button>
  );
};

export default ThemeToggle;