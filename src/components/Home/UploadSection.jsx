import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileUploader } from "@/components/FileUploader/FileUploader";
import { FileList } from "@/components/FileList/FileList";
import { ProgressIndicator } from "@/components/ProgressIndicator/ProgressIndicator";

// 上传区域组件，包含文件上传、文件列表和转换按钮
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
    // 主容器，使用motion.div实现更柔和的入场动画
    <motion.div
      className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-white/50 dark:border-gray-700/50 relative overflow-hidden"
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
      {/* 背景装饰元素，创建动态模糊光晕效果 */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="absolute top-1/4 -left-20 w-40 h-40 rounded-full bg-blue-200/30 dark:bg-blue-800/20 blur-[80px]"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 -right-24 w-48 h-48 rounded-full bg-purple-200/30 dark:bg-purple-800/20 blur-[90px]"
          animate={{
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.5,
          }}
        />
      </motion.div>

      {/* 拖拽覆盖层，显示拖拽提示 */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/10 dark:bg-white/10 rounded-xl backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.2 },
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.15 },
            }}
            key="drag-overlay"
          >
            <motion.div
              className="flex flex-col items-center justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                transition: {
                  type: "spring",
                  damping: 10,
                  stiffness: 300,
                  delay: 0.1,
                },
              }}
            >
              <motion.div
                className="w-16 h-16 mb-4 bg-white/90 dark:bg-gray-700/90 rounded-2xl flex items-center justify-center shadow-lg"
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-blue-500 dark:text-blue-300"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
              </motion.div>
              <motion.p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                松开以上传文件
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 文件上传组件 */}
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

      {/* 文件列表，显示已上传文件 */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                duration: 0.4,
                ease: "easeOut",
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                duration: 0.3,
                ease: "easeIn",
              },
            }}
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

      {/* 提示信息：上传后显示隐私安全，转换成功后显示成功提示 */}
      <AnimatePresence>
        {files.length > 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.4,
                delay: 0.1,
              },
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.2 },
            }}
            className={`mt-4 mb-2 flex items-start p-3 rounded-lg border ${
              isComplete
                ? "bg-green-50/60 dark:bg-green-900/30 border-green-200 dark:border-green-700/50"
                : "bg-blue-50/60 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700/50"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-5 h-5 flex-shrink-0 mr-2 ${
                isComplete
                  ? "text-green-500 dark:text-green-300"
                  : "text-blue-500 dark:text-blue-300"
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={
                  isComplete
                    ? "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    : "M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                }
              />
            </svg>
            <p
              className={`text-xs sm:text-sm ${
                isComplete
                  ? "text-green-700 dark:text-green-200"
                  : "text-blue-700 dark:text-blue-200"
              }`}
            >
              {isComplete
                ? "转换成功~😄 下拉页面下载哦~ 如果觉得对您有用 欢迎 GitHub start ⭐️⭐️⭐️ 😎"
                : "隐私安全: 仅在本地处理，不会上传到服务器, 请放心使用。"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 按钮区域，包含转换和取消按钮 */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5,
                delay: 0.15,
                ease: "easeOut",
              },
            }}
            exit={{
              opacity: 0,
              y: 10,
              transition: {
                duration: 0.3,
              },
            }}
            className="mt-4 flex flex-wrap gap-3"
          >
            {/* 转换按钮，带优雅的动画效果 */}
            <motion.button
              layout
              onClick={handleConvert}
              disabled={isLoading}
              whileHover={{
                scale: 1.05,
                transition: {
                  type: "spring",
                  stiffness: 500,
                  damping: 20,
                },
              }}
              whileTap={{
                scale: 0.95,
                transition: {
                  type: "spring",
                  stiffness: 600,
                  damping: 15,
                },
              }}
              className={`
                ${isLoading ? "w-full" : "w-full"} 
                relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-xl 
                overflow-hidden shadow-md flex items-center justify-center
              `}
            >
              {/* 按钮背景动画层 */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700"
                initial={{ x: "-100%" }}
                whileHover={{
                  x: "0%",
                  transition: {
                    duration: 0.4,
                    ease: "easeOut",
                  },
                }}
              />
              {/* 光晕效果 */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{
                  opacity: 0.3,
                  transition: { duration: 0.3 },
                }}
              >
                <div className="absolute top-0 left-1/2 w-32 h-32 bg-white rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2" />
              </motion.div>
              {/* 按钮内容 */}
              <motion.span
                className="relative flex items-center z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    转换中... {Math.round(progress)}%
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 mr-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                      />
                    </svg>
                    开始转换
                  </>
                )}
              </motion.span>
            </motion.button>

            {/* 取消按钮，带平滑动画 */}
            <AnimatePresence>
              {isLoading && (
                <motion.button
                  layout
                  onClick={handleCancel}
                  initial={{ opacity: 0, x: 20, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 15,
                      delay: 0.1,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    x: 20,
                    scale: 0.9,
                    transition: { duration: 0.25 },
                  }}
                  whileHover={{
                    scale: 1.05,
                    transition: {
                      type: "spring",
                      stiffness: 500,
                      damping: 20,
                    },
                  }}
                  whileTap={{
                    scale: 0.95,
                    transition: {
                      type: "spring",
                      stiffness: 600,
                      damping: 15,
                    },
                  }}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl shadow-md dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 flex items-center justify-center relative overflow-hidden"
                >
                  {/* 取消按钮背景动画 */}
                  <motion.div
                    className="absolute inset-0 bg-gray-200 dark:bg-gray-600"
                    initial={{ x: "-100%" }}
                    whileHover={{
                      x: "0%",
                      transition: {
                        duration: 0.4,
                        ease: "easeOut",
                      },
                    }}
                  />
                  <span className="relative flex items-center z-10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 mr-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    取消转换
                  </span>
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 进度指示器 */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: "auto",
              transition: {
                duration: 0.4,
                ease: "easeOut",
              },
            }}
            exit={{
              opacity: 0,
              height: 0,
              transition: {
                duration: 0.3,
                ease: "easeIn",
              },
            }}
          >
            <ProgressIndicator progress={progress} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
);

export default UploadSection;