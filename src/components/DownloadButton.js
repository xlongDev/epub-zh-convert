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
      className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-transform transform hover:scale-105"
    >
      <FaDownload className="w-5 h-5" />
    </button>
  );
};

export default DownloadButton;