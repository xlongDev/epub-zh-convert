import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ⬇️ 拆分后的子组件
import DragOverlay from "./DragOverlay";
import FileUploader from "./FileUploader";
import FileList from "./FileList";
import InfoMessage from "./InfoMessage";
import ConversionButtons from "./ConversionButtons";
import ProgressIndicator from "./ProgressIndicator";

/**
 * 📦 UploadSection - 文件上传区域的容器组件
 * 管理文件上传、拖拽、列表展示、转换操作、提示信息等 UI
 */
const UploadSection = React.memo(
  ({
    isDragging,
    setIsDragging,
    isClicking,
    setIsClicking,
    isHoveringUpload,
    setIsHoveringUpload,
    isFileSelected,
    files,
    handleFileChange,
    handleDeleteFile,
    isLoading,
    progress,
    isComplete,
    isFileListOpen,
    setIsFileListOpen,
    handleConvert,
    handleCancel,
    isConversionFailedOrCancelled,
  }) => {
    // 🎯 仅接收 EPUB 文件的封装逻辑
    const handleFilteredFileChange = (e) => {
      const files = e.target.files || e.dataTransfer.files;
      const epubFiles = Array.from(files).filter(file =>
        file.name.toLowerCase().endsWith(".epub")
      );
      if (epubFiles.length === 0 && files.length > 0) {
        alert("只能上传EPUB格式的文件哦！😊");
        return;
      }
      const event = {
        ...e,
        target: { ...e.target, files: epubFiles },
        dataTransfer: { ...e.dataTransfer, files: epubFiles },
      };
      handleFileChange(event);
    };

    return (
      <motion.div
        className="relative p-6 rounded-xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1],
            delay: 0.2,
          },
        }}
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
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFilteredFileChange(e);
            }}
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
                  handleDeleteFile={handleDeleteFile}
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
              />
            )}
          </AnimatePresence>

          <ProgressIndicator progress={progress} />
        </div>
      </motion.div>
    );
  }
);

export default UploadSection;
