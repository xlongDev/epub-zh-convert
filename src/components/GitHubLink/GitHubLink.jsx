import { FaGithub } from 'react-icons/fa';

const GitHubLink = () => {
  return (
    <a
      href="https://github.com/xlongDev/epub-zh-transform.git"
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    >
      <FaGithub className="w-6 h-6 text-gray-800 dark:text-gray-200" />
    </a>
  );
};

export default GitHubLink;
