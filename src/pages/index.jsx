import { useState, useEffect, useCallback } from "react";
import { useFileHandling } from "@/hooks/useFileHandling";
import { useFileConversion } from "@/hooks/useFileConversion";
import { titleVariants } from "@/utils/animations";
import backgroundSchemes from "@/config/backgroundSchemes";
import GitHubLink from "@/components/GitHubLink/GitHubLink";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";
import WelcomeAnimation from "@/components/WelcomeAnimation/WelcomeAnimation";
import DirectionSelector from "@/components/DirectionSelector/DirectionSelector";
import UploadSection from "@/components/UploadSection/UploadSection";
import ConvertedSection from "@/components/ConvertedSection/ConvertedSection";
import welcomeAnimation from "public/animations/welcome.json";
import successAnimation from "public/animations/success.json";
import { motion } from "framer-motion";

export default function Home() {
  // Background scheme state
  const [backgroundScheme, setBackgroundScheme] = useState(backgroundSchemes[0]);
  useEffect(() => {
    const savedScheme = sessionStorage.getItem("backgroundScheme");
    if (savedScheme) {
      const randomScheme =
        backgroundSchemes[Math.floor(Math.random() * backgroundSchemes.length)];
      setBackgroundScheme(randomScheme);
    } else {
      sessionStorage.setItem(
        "backgroundScheme",
        JSON.stringify(backgroundSchemes[0])
      );
    }
  }, []);

  // File handling logic
  const { files, isFileSelected, handleFileChange, handleDeleteFile } =
    useFileHandling();
  const [direction, setDirection] = useState("t2s");

  // Use file conversion hook
  const {
    isLoading,
    progress,
    error, // This is crucial for detecting conversion failure
    convertedFiles,
    setConvertedFiles,
    isComplete,
    setIsComplete,
    handleConvert: originalHandleConvert,
    handleCancel: originalHandleCancel,
  } = useFileConversion(files, direction);

  // UI States
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(true);
  const [isFileListOpen, setIsFileListOpen] = useState(false);
  const [showDownloadPrompt, setShowDownloadPrompt] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isClicking, setIsClicking] = useState(false); // Likely internal to Uploader, can remove if not used externally
  const [isHoveringUpload, setIsHoveringUpload] = useState(false); // Likely internal to Uploader, can remove if not used externally

  // New crucial state: Tracks if conversion failed or was cancelled
  const [isConversionFailedOrCancelled, setIsConversionFailedOrCancelled] = useState(false);

  // Effect to manage download prompt and conversion failed/cancelled state
  useEffect(() => {
    // If conversion is complete and successful
    if (isComplete && convertedFiles.length > 0 && !error) {
      setShowDownloadPrompt(true);
      setIsConversionFailedOrCancelled(false); // Reset this state on success
      const timer = setTimeout(() => {
        setShowDownloadPrompt(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
    // If there's an error and not currently loading (i.e., conversion failed)
    else if (error && !isLoading) {
      setIsConversionFailedOrCancelled(true);
      setIsComplete(false); // Ensure isComplete is false if there's an error
    }
    // If loading or just started (e.g., after retry click), reset failed/cancelled
    else if (isLoading) {
      setIsConversionFailedOrCancelled(false);
      setIsComplete(false); // Ensure isComplete is false during loading
    }
    // If no files, or initial state, reset
    else if (files.length === 0) {
      setIsConversionFailedOrCancelled(false);
      setIsComplete(false);
    }
  }, [isComplete, convertedFiles, error, isLoading, files.length]); // Added isLoading and files.length to dependencies

  // Effect to hide download prompt on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (showDownloadPrompt) {
        setShowDownloadPrompt(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showDownloadPrompt]);

  const scrollToConvertedFiles = () => {
    const convertedFilesSection = document.getElementById("converted-files");
    if (convertedFilesSection) {
      convertedFilesSection.scrollIntoView({ behavior: "smooth" });
      setShowDownloadPrompt(false);
    }
  };

  // Callback to handle file deletion
  const handleDeleteFileCallback = useCallback((indexToDelete) => {
    // Call the original handleDeleteFile from useFileHandling
    handleDeleteFile(indexToDelete);
    // If all files are removed, reset conversion states
    if (files.length === 1 && indexToDelete === 0) { // If deleting the last file
      setIsComplete(false);
      setIsConversionFailedOrCancelled(false); // Reset failed/cancelled state
      setShowDownloadPrompt(false);
    }
  }, [handleDeleteFile, files.length]);


  // Handle deletion of a converted file
  const handleDeleteConvertedFile = useCallback((index) => {
    setConvertedFiles((prevFiles) => {
      const newFiles = prevFiles.filter((_, i) => i !== index);

      // If no converted files left, reset completion and failed states
      if (newFiles.length === 0) {
        setIsComplete(false);
        setIsConversionFailedOrCancelled(false); // Important: reset if converted files become empty
        setShowDownloadPrompt(false);
      }
      return newFiles;
    });
  }, [setConvertedFiles, setIsComplete, setShowDownloadPrompt]);


  const handleDownloadAll = async () => {
    convertedFiles.forEach((file, index) => {
      const url = URL.createObjectURL(file.blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
      const downloadButton = document.getElementById(`download-${index}`);
      if (downloadButton) {
        downloadButton.classList.add("animate-ping");
        setTimeout(() => {
          downloadButton.classList.remove("animate-ping");
        }, 500);
      }
    });
  };

  const handleDownloadSingle = async (index) => {
    const file = convertedFiles[index];
    if (!file) return;
    const url = URL.createObjectURL(file.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
    const downloadButton = document.getElementById(`download-${index}`);
    if (downloadButton) {
      downloadButton.classList.add("animate-ping");
      setTimeout(() => {
        downloadButton.classList.remove("animate-ping");
      }, 500);
    }
  };

  // Wrapped handleConvert to reset failure/cancellation state when starting a new conversion
  const handleConvert = useCallback(() => {
    setIsConversionFailedOrCancelled(false); // Reset before starting a new conversion
    originalHandleConvert(); // Call the original conversion logic
  }, [originalHandleConvert]);

  // Wrapped handleCancel to set failure/cancellation state when cancelling
  const handleCancel = useCallback(() => {
    originalHandleCancel(); // Call the original cancel logic
    // Set failed/cancelled state AFTER original handleCancel might have set isLoading to false
    setIsConversionFailedOrCancelled(true);
  }, [originalHandleCancel]);

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${backgroundScheme.light} ${backgroundScheme.dark}`}
    >
      <div className="w-full max-w-2xl mx-4">
        <WelcomeAnimation
          animationData={welcomeAnimation}
          isVisible={isWelcomeVisible}
        />
        <motion.nav
          initial="hidden"
          animate="visible"
          variants={titleVariants}
          className="flex justify-between items-center mb-8"
        >
          <motion.h1
            variants={titleVariants}
            className="text-3xl font-bold text-gray-800 dark:text-gray-100"
          >
            EPUB 繁简转换
          </motion.h1>
          <motion.div variants={titleVariants} className="flex space-x-4">
            <ThemeToggle />
            <GitHubLink />
          </motion.div>
        </motion.nav>
        <DirectionSelector direction={direction} setDirection={setDirection} />
        <UploadSection
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          isClicking={isClicking} // You might want to remove these if not used externally by UploadSection
          setIsClicking={setIsClicking} // They seem to be internal to FileUploader
          isHoveringUpload={isHoveringUpload} //
          setIsHoveringUpload={setIsHoveringUpload} //
          isFileSelected={isFileSelected}
          files={files}
          handleFileChange={handleFileChange}
          handleDeleteFile={handleDeleteFileCallback} // Use the wrapped callback
          isLoading={isLoading}
          progress={progress}
          isComplete={isComplete}
          isFileListOpen={isFileListOpen}
          setIsFileListOpen={setIsFileListOpen}
          handleConvert={handleConvert} // Use the wrapped handler
          handleCancel={handleCancel} // Use the wrapped handler
          // Pass the new state to UploadSection, which then passes to ConversionButtons
          isConversionFailedOrCancelled={isConversionFailedOrCancelled}
        />
        <ConvertedSection
          isComplete={isComplete}
          error={error} // Pass error to ConvertedSection for ErrorDisplay
          successAnimation={successAnimation}
          showDownloadPrompt={showDownloadPrompt}
          scrollToConvertedFiles={scrollToConvertedFiles}
          convertedFiles={convertedFiles}
          handleDownloadSingle={handleDownloadSingle}
          handleDeleteConvertedFile={handleDeleteConvertedFile}
          handleDownloadAll={handleDownloadAll}
        />
      </div>
    </div>
  );
}