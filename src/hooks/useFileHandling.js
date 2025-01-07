import { useState } from "react";

export const useFileHandling = () => {
  const [files, setFiles] = useState([]);
  const [isFileSelected, setIsFileSelected] = useState(false);

  const handleFileChange = (event) => {
    let selectedFiles;
    if (event.dataTransfer) {
      // 处理拖拽事件
      selectedFiles = Array.from(event.dataTransfer.files);
    } else {
      // 处理文件选择事件
      selectedFiles = Array.from(event.target.files);
    }

    if (selectedFiles.length === 0) return;
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]); // 追加新文件
    setIsFileSelected(true);
  };

  const handleDeleteFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return {
    files,
    isFileSelected,
    handleFileChange,
    handleDeleteFile,
  };
};