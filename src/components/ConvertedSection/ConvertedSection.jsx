import React from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";

const LottiePlayer = dynamic(() => import("react-lottie-player"), {
  ssr: false,
});
const ConvertedFilesList = dynamic(
  () => import("@/components/ConvertedFilesList/ConvertedFilesList"),
  {
    ssr: false,
  }
);
const DownloadPrompt = dynamic(
  () => import("@/components/DownloadPrompt/DownloadPrompt"),
  {
    ssr: false,
  }
);
const ErrorDisplay = dynamic(
  () => import("@/components/ErrorDisplay/ErrorDisplay"),
  {
    ssr: false,
  }
);

const ConvertedSection = React.memo(
  ({
    isComplete,
    error,
    successAnimation,
    showDownloadPrompt,
    scrollToConvertedFiles,
    convertedFiles,
    handleDownloadSingle,
    handleDeleteConvertedFile,
    handleDownloadAll,
  }) => (
    <>
      <AnimatePresence>
        {showDownloadPrompt && (
          <DownloadPrompt
            showDownloadPrompt={showDownloadPrompt}
            scrollToConvertedFiles={scrollToConvertedFiles}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isComplete && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            layout
            className="mt-4 text-center converted-section"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <LottiePlayer
                animationData={successAnimation}
                loop={false}
                play
                style={{ width: 120, height: 120, margin: "0 auto" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {error && <ErrorDisplay error={error} />}
      </AnimatePresence>
      <AnimatePresence>
        {convertedFiles.length > 0 && (
          <ConvertedFilesList
            convertedFiles={convertedFiles}
            handleDownloadSingle={handleDownloadSingle}
            handleDeleteConvertedFile={handleDeleteConvertedFile}
            handleDownloadAll={handleDownloadAll}
          />
        )}
      </AnimatePresence>
    </>
  )
);

export default ConvertedSection;