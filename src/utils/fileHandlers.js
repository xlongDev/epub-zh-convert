export const handleDeleteFileCallback = (deleteFn, files, setComplete, setFailed, setPrompt) => 
  (indexToDelete) => {
    deleteFn(indexToDelete);
    if (files.length === 1 && indexToDelete === 0) {
      setComplete(false);
      setFailed(false);
      setPrompt(false);
    }
  };

export const scrollToConvertedFiles = (setShowDownloadPrompt) => {
  const section = document.getElementById("converted-files");
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
    setShowDownloadPrompt(false);
  }
};