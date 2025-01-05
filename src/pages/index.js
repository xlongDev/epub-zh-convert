import { useState } from 'react';
import { motion } from 'framer-motion';
import { convertEpub } from '../utils/zipUtils';
// import ThemeToggle from '@/components/ThemeToggle'; 
import GitHubLink from '@/components/GitHubLink';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setProgress(0);

    try {
      await convertEpub(file, setProgress);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <div className="container mx-auto p-4">
        {/* 导航栏 */}
        <nav className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">EPUB 繁简转换</h1>
          <div className="flex space-x-4">
            {/* <ThemeToggle /> */}
            <GitHubLink />
          </div>
        </nav>

        {/* 文件上传区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
        >
          <input
            type="file"
            accept=".epub"
            onChange={handleFileChange}
            disabled={isLoading}
            className="hidden"
            id="fileInput"
          />
          <label
            htmlFor="fileInput"
            className="block w-full p-4 text-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {isLoading ? (
              <div className="space-y-2">
                <p>转换中... {progress}%</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <p>点击上传 EPUB 文件</p>
            )}
          </label>
          {error && (
            <p className="mt-4 text-red-500 dark:text-red-400 text-center">
              错误: {error}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}