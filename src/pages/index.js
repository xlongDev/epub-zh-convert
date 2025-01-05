import { useState } from "react";
import { motion } from "framer-motion";
import { convertEpub } from "../utils/zipUtils";
import GitHubLink from "@/components/GitHubLink";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length === 0) return;

    setFiles(selectedFiles);
    setError(null);
  };

  const handleConvert = async () => {
    if (files.length === 0) return;

    setIsLoading(true);
    setError(null);
    setProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        await convertEpub(file, (currentProgress) => {
          setProgress(((i + currentProgress / 100) / files.length) * 100);
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-400 via-yellow-500 to-lime-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-4">
        {/* 导航栏 */}
        <nav className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white dark:text-gray-100">
            EPUB 繁简转换
          </h1>
          <div className="flex space-x-4">
            <ThemeToggle />
            <GitHubLink />
          </div>
        </nav>

        {/* 文件上传区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-2xl"
        >
          <input
            type="file"
            accept=".epub"
            onChange={handleFileChange}
            disabled={isLoading}
            className="hidden"
            id="fileInput"
            multiple
          />
          <label
            htmlFor="fileInput"
            className="block w-full p-6 text-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {files.length > 0 ? (
              <p className="text-gray-700 dark:text-gray-300">
                已选择 {files.length} 个文件
              </p>
            ) : (
              <p className="text-gray-700 dark:text-gray-300">
                点击上传 EPUB 文件（支持批量上传）
              </p>
            )}
          </label>

          {files.length > 0 && (
            <button
              onClick={handleConvert}
              disabled={isLoading}
              className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              {isLoading ? `转换中... ${Math.round(progress)}%` : "开始转换"}
            </button>
          )}

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