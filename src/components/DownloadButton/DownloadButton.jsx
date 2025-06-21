import { FaDownload } from 'react-icons/fa';

const DownloadButton = ({ file, fileName }) => {
  const handleDownload = () => {
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      className="p-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-transform transform hover:scale-105 focus:ring-2 focus:ring-green-400 focus:outline-none"
      aria-label={`下载文件 ${fileName}`}
    >
      <FaDownload className="w-5 h-5" />
    </button>
  );
};

export default DownloadButton;