export function useFileDownloadManager(setIsComplete, setIsConversionFailedOrCancelled) {
  const animateDownloadButton = (id) => {
    const button = document.getElementById(id);
    if (button) {
      button.classList.add("animate-ping");
      setTimeout(() => {
        button.classList.remove("animate-ping");
      }, 500);
    }
  };

  const handleDownloadSingle = (convertedFiles, index) => {
    const file = convertedFiles[index];
    if (!file) return;
    const url = URL.createObjectURL(file.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
    animateDownloadButton(`download-${index}`);
  };

  const handleDownloadAll = (convertedFiles) => {
    convertedFiles.forEach((file, index) => {
      const url = URL.createObjectURL(file.blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
      animateDownloadButton(`download-${index}`);
    });
  };

  const handleDeleteConvertedFile = (convertedFiles, index, setConvertedFiles) => {
    const newFiles = convertedFiles.filter((_, i) => i !== index);
    if (newFiles.length === 0) {
      setIsComplete(false);
      setIsConversionFailedOrCancelled(false);
    }
    setConvertedFiles(newFiles);
  };

  return {
    handleDownloadSingle,
    handleDownloadAll,
    handleDeleteConvertedFile,
  };
}
