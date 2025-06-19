import React from "react";
import { motion } from "framer-motion";
import { FileUploader } from "@/components/FileUploader/FileUploader";
import { FileList } from "@/components/FileList/FileList";
import { ProgressIndicator } from "@/components/ProgressIndicator/ProgressIndicator";

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
  }) => (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-white/50 dark:border-gray-700/50 relative">
      {isDragging && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 dark:bg-white/10 rounded-xl">
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            松开以上传文件
          </p>
        </div>
      )}
      <FileUploader
        onFileChange={handleFileChange}
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
          handleFileChange(e);
        }}
        isDragging={isDragging}
        isClicking={isClicking}
        setIsClicking={setIsClicking}
        isFileSelected={isFileSelected}
        isHoveringUpload={isHoveringUpload}
        files={files}
        onMouseEnter={() => setIsHoveringUpload(true)}
        onMouseLeave={() => setIsHoveringUpload(false)}
        isLoading={isLoading}
        progress={progress}
        isComplete={isComplete}
      />
      {files.length > 0 && (
        <FileList
          files={files}
          isFileListOpen={isFileListOpen}
          setIsFileListOpen={setIsFileListOpen}
          handleDeleteFile={handleDeleteFile}
        />
      )}
      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6 flex space-x-4"
        >
          <motion.button
            onClick={handleConvert}
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
            className="w-full bg-[#60A5FA] text-white py-3 px-6 rounded-xl hover:bg-[#3B82F6] active:bg-[#2563EB] transition-colors shadow-md"
          >
            {isLoading ? `转换中... ${Math.round(progress)}%` : "开始转换"}
          </motion.button>
          {isLoading && (
            <motion.button
              onClick={handleCancel}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
              className="w-full bg-[#EA580C] text-white py-3 px-6 rounded-xl hover:bg-[#C2410C] active:bg-[#9A3412] transition-colors shadow-md"
            >
              取消转换
            </motion.button>
          )}
        </motion.div>
      )}
      {isLoading && <ProgressIndicator progress={progress} />}
    </div>
  )
);

export default UploadSection;
