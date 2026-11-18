import { FaGithub } from "react-icons/fa";

const GitHubLink = () => {
  return (
    <a
      href="https://github.com/xlongDev/epub-zh-convert"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="在 GitHub 上查看项目源码"
      className="glass-icon-btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70"
    >
      <FaGithub className="w-5 h-5 text-gray-800 dark:text-gray-200" />
    </a>
  );
};

export default GitHubLink;
