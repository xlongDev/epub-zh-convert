// src/components/UploadSection.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 导入所有拆分后的子组件
import DragOverlay from "./DragOverlay";
import FileUploader from "./FileUploader";
import FileList from "./FileList";
import InfoMessage from "./InfoMessage";
import ConversionButtons from "./ConversionButtons";
import ProgressIndicator from "./ProgressIndicator";

/**
 * UploadSection 组件
 * 作为应用程序的主要文件上传和转换界面。
 * 它管理文件选择、拖拽状态、转换进度和UI展示。
 */
const UploadSection = React.memo(
  ({
    isDragging, // 是否正在拖拽文件
    setIsDragging, // 设置拖拽状态的函数
    isFileSelected, // 是否有文件被选中
    files, // 已选择的文件列表
    handleFileChange, // 处理文件选择或拖拽的函数
    handleDeleteFile, // 处理删除文件从列表的函数
    isLoading, // 是否正在进行转换
    progress, // 转换进度
    isComplete, // 转换是否完成
    isFileListOpen, // 文件列表是否展开
    setIsFileListOpen, // 设置文件列表展开状态的函数
    handleConvert, // 处理开始转换的函数
    handleCancel, // 处理取消转换的函数
    conversionDirection, // 转换方向 (例如：简体到繁体)
    setConversionDirection, // 设置转换方向的函数 (如果此组件不需要直接设置，可以从父组件传入)
  }) => {
    // 注意：isHoveringUpload 和 isClicking 等状态已内化到 FileUploader 组件中

    return (
      <motion.div
        className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-6 rounded-xl shadow-2xl border border-white/50 dark:border-gray-700/50 relative overflow-hidden"
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
        {/* 拖拽覆盖层组件 */}
        <DragOverlay isDragging={isDragging} />

        {/* 文件上传核心组件 */}
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
          isFileSelected={isFileSelected}
          isLoading={isLoading}
          progress={progress} // 传入进度，尽管 FileUploader 内部也有自己的进度条显示
          conversionDirection={conversionDirection}
        />

        {/* 文件列表组件，仅当有文件时显示 */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ maxHeight: 0, opacity: 0 }}
              animate={{
                maxHeight: isFileListOpen ? 300 : 50, // 控制列表展开/收起的高度
                opacity: 1,
                transition: {
                  duration: 0.4,
                  ease: "easeOut",
                },
              }}
              exit={{
                maxHeight: 0,
                opacity: 0,
                transition: {
                  duration: 0.3,
                  ease: "easeIn",
                },
              }}
              className="mt-4 overflow-hidden"
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

        {/* 提示信息组件，根据状态显示不同的提示 */}
        <InfoMessage
          isComplete={isComplete}
          isLoading={isLoading}
          filesLength={files.length}
        />

        {/* 转换操作按钮组件，仅当有文件时显示 */}
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

        {/* 进度指示器组件，仅当加载中时显示 */}
        <ProgressIndicator progress={progress} />
      </motion.div>
    );
  }
);

export default UploadSection;