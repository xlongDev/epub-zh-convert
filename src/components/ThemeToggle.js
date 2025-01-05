import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
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