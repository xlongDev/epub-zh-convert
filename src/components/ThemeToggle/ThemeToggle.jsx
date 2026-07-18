import { useEffect, useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  // 用 useSyncExternalStore 判断是否已完成客户端挂载：服务端快照为 false、客户端为 true，
  // React 会在水合后自动切换到客户端值，避免 hydration 不匹配；同时消除 effect 内同步 setState 的告警
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
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
      className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="切换主题"
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