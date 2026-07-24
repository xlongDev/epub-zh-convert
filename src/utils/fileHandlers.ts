export const handleDeleteFileCallback = (
  deleteFn: (index: number) => void,
  files: File[],
  setComplete: (value: boolean) => void,
  setFailed: (value: boolean) => void,
  setPrompt: (value: boolean) => void
): ((indexToDelete: number) => void) =>
  (indexToDelete: number) => {
    deleteFn(indexToDelete);
    if (files.length === 1 && indexToDelete === 0) {
      setComplete(false);
      setFailed(false);
      setPrompt(false);
    }
  };

export const scrollToConvertedFiles = (
  setShowDownloadPrompt: (value: boolean) => void
): void => {
  const section = document.getElementById("converted-files");
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
    setShowDownloadPrompt(false);
  }
};
