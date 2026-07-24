import React, { useRef } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { uploadVariants } from "@/utils/animations";
import { useAppStore } from "@/store/useAppStore";

// ⬇️ 拆分后的子组件
import DragOverlay from "./DragOverlay";
import FileUploader from "./FileUploader";
import FileList from "./FileList";
import InfoMessage from "./InfoMessage";
import ConversionButtons from "./ConversionButtons";
import ProgressIndicator from "./ProgressIndicator";

/**
 * 📦 UploadSection - 文件上传区域「容器组件」
 * 直接从全局 store 订阅所需状态与 action，不再由 Home 一级级下钻 props。
 * 子组件（FileUploader / FileList / …）仍由本组件以组合方式传入派生值，
 * 这是正常的组件组合，而非跨层 prop drilling。
 */
const UploadSection = React.memo(() => {
  // ── 从 store 订阅状态切片（按需取值，避免无关重渲染） ──
  const isDragging = useAppStore((s) => s.isDragging);
  const setIsDragging = useAppStore((s) => s.setIsDragging);
  const isFileSelected = useAppStore((s) => s.isFileSelected);
  const files = useAppStore((s) => s.files);
  const isLoading = useAppStore((s) => s.isLoading);
  const progress = useAppStore((s) => s.progress);
  const currentFileIndex = useAppStore((s) => s.currentFileIndex);
  const isComplete = useAppStore((s) => s.isComplete);
  const isFileListOpen = useAppStore((s) => s.isFileListOpen);
  const setIsFileListOpen = useAppStore((s) => s.setIsFileListOpen);
  const handleConvert = useAppStore((s) => s.handleConvert);
  const handleCancel = useAppStore((s) => s.handleCancel);
  const isPaused = useAppStore((s) => s.isPaused);
  const handlePause = useAppStore((s) => s.handlePause);
  const handleResume = useAppStore((s) => s.handleResume);
  const isConversionFailedOrCancelled = useAppStore(
    (s) => s.isConversionFailedOrCancelled
  );
  const addFiles = useAppStore((s) => s.addFiles);
  const deleteFile = useAppStore((s) => s.deleteFile);
  const handleClearAll = useAppStore((s) => s.handleClearAll);

  // 🎯 仅接收 EPUB 文件的封装逻辑
  const handleFilteredFileChange = (
    e: ChangeEvent<HTMLInputElement> | DragEvent
  ) => {
    const sourceFiles =
      "dataTransfer" in e && e.dataTransfer
        ? e.dataTransfer.files
        : (e.target as HTMLInputElement).files;
    const epubFiles = Array.from(sourceFiles ?? []).filter((file) =>
      file.name.toLowerCase().endsWith(".epub")
    );
    if (epubFiles.length === 0 && (sourceFiles?.length ?? 0) > 0) {
      alert("只能上传EPUB格式的文件哦！😊");
      return;
    }
    addFiles(epubFiles);
  };

  // 🖱️ 拖拽计数器：规避子元素边界 dragenter/leave 互相抵消导致的遮罩闪烁
  const dragCounter = useRef(0);
  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    dragCounter.current += 1;
    setIsDragging(true);
  };
  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  };
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    handleFilteredFileChange(e);
  };

  return (
    <motion.div
      className="relative p-6 rounded-xl shadow-2xl overflow-hidden"
      variants={uploadVariants}
      initial="hidden"
      animate="visible"
      exit={{
        opacity: 0,
        y: 20,
        transition: { duration: 0.3 },
      }}
      key="upload-section"
      whileHover={{
        boxShadow: "0 20px 50px -10px rgba(0, 0, 0, 0.1)",
        transition: { duration: 0.4 },
      }}
    >
      {/* 💧 背景液态玻璃层 + 流动光效 */}
      <div
        className="absolute inset-0 z-0 
          bg-white/30 dark:bg-gray-800/30 
          backdrop-blur-xl border border-white/50 dark:border-gray-700/50
          rounded-xl [mask-image:linear-gradient(white,transparent)]"
      >
        <div
          className="absolute inset-0 
            [background:radial-gradient(at_30%_20%,rgba(180,220,255,0.3)_0px,transparent_50%), 
                     radial-gradient(at_70%_80%,rgba(220,180,255,0.2)_0px,transparent_50%)] 
            dark:[background:radial-gradient(at_30%_20%,rgba(100,150,255,0.2)_0px,transparent_50%), 
                     radial-gradient(at_70%_80%,rgba(180,100,255,0.15)_0px,transparent_50%)]"
        />
        <div className="absolute top-0 left-0 w-full h-20 
            bg-gradient-to-b from-white/60 to-transparent 
            dark:from-gray-800/40 dark:to-transparent" />
        <div className="absolute inset-0 border border-white/30 dark:border-white/10 rounded-xl" />
      </div>

      {/* 📦 内容主体区域 */}
      <div className="relative z-10">
        <DragOverlay isDragging={isDragging} />

        <FileUploader
          onFileChange={handleFilteredFileChange}
          onDragEnter={handleDragEnter}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          isDragging={isDragging}
          isFileSelected={isFileSelected}
          isLoading={isLoading}
          progress={progress}
        />

        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: {
                  duration: 0.4,
                  ease: "easeOut",
                },
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.3,
                  ease: "easeIn",
                },
              }}
              className="mt-4"
            >
              <FileList
                files={files}
                isFileListOpen={isFileListOpen}
                setIsFileListOpen={setIsFileListOpen}
                handleDeleteFile={deleteFile}
                isLoading={isLoading}
                currentFileIndex={currentFileIndex}
                onClearUploads={handleClearAll}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <InfoMessage
          isComplete={isComplete}
          isLoading={isLoading}
          filesLength={files.length}
          isConversionFailedOrCancelled={isConversionFailedOrCancelled}
        />

        <AnimatePresence>
          {files.length > 0 && (
            <ConversionButtons
              isLoading={isLoading}
              isComplete={isComplete}
              handleConvert={handleConvert}
              handleCancel={handleCancel}
              isPaused={isPaused}
              handlePause={handlePause}
              handleResume={handleResume}
            />
          )}
        </AnimatePresence>

        <ProgressIndicator
          progress={progress}
          currentFileIndex={currentFileIndex}
          totalFiles={files.length}
          isPaused={isPaused}
        />
      </div>
    </motion.div>
  );
});

export default UploadSection;
