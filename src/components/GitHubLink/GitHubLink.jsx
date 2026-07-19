import { FaGithub } from 'react-icons/fa';

const GitHubLink = () => {
  return (
    <a
      href="https://github.com/xlongDev/epub-zh-convert"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="在 GitHub 上查看项目源码"
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
    >
      <FaGithub className="w-6 h-6 text-gray-800 dark:text-gray-200" />
    </a>
  );
};

export default GitHubLink;
