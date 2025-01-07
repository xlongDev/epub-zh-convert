import { FaUpload } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export const FileUploader = ({
  onFileChange,
  onDragOver,
  onDragLeave,
  onDrop,
  isDragging,
  isClicking,
  setIsClicking,
  isFileSelected,
  isHoveringUpload,
  files,
  onMouseEnter,
  onMouseLeave,
  isLoading,
  progress,
  isComplete,
}) => {
  return (
    <div className="relative">
      <input
        type="file"
        accept=".epub"
        onChange={onFileChange}
        className="hidden"
        id="fileInput"
        multiple
      />
      <label
        htmlFor="fileInput"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => {
          setIsClicking(true); // 触发点击动画
          setTimeout(() => setIsClicking(false), 300); // 300ms 后重置状态
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`block w-full p-8 text-center border-2 border-dashed ${
          isDragging
            ? "border-[#60A5FA] bg-[#DBEAFE]/60 dark:bg-[#1E3A8A]/60"
            : "border-gray-300 dark:border-gray-600"
        } rounded-lg cursor-pointer hover:bg-gray-50/60 dark:hover:bg-gray-700/60 transition-colors`}
      >
        <div className="flex flex-col items-center space-y-4">
          <motion.div
            animate={{
              rotate:
                isDragging || isClicking || isFileSelected || isHoveringUpload
                  ? 360
                  : 0,
              scale:
                isDragging || isClicking || isFileSelected || isHoveringUpload
                  ? 1.2
                  : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <FaUpload
              className={`w-12 h-12 ${
                isDragging || isClicking || isFileSelected || isHoveringUpload
                  ? "text-[#60A5FA] dark:text-[#818CF8]"
                  : "text-[#60A5FA] dark:text-[#818CF8]"
              } transition-colors`}
            />
          </motion.div>

          {/* 文字变化逻辑 */}
          <AnimatePresence mode="wait">
            {files.length > 0 ? (
              isHoveringUpload ? (
                <motion.p
                  key="add-more-files"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-gray-700 dark:text-gray-300 text-lg"
                >
                  点击可再次添加文件哦~
                </motion.p>
              ) : (
                <motion.p
                  key="selected-files"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-gray-700 dark:text-gray-300 text-lg"
                >
                  已选择 {files.length} 个文件
                </motion.p>
              )
            ) : isHoveringUpload ? (
              <motion.p
                key="batch-upload"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-gray-700 dark:text-gray-300 text-lg"
              >
                支持批量上传哦~
              </motion.p>
            ) : (
              <motion.p
                key="default-text"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-gray-700 dark:text-gray-300 text-lg"
              >
                {isDragging ? "释放文件以上传" : "点击或拖拽文件以上传"}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </label>

      {/* 转换过程中的动画进度条 */}
      {isLoading && (
        <motion.div
          className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none"
          style={{
            border: "4px solid transparent",
            borderRadius: "0.75rem",
          }}
        >
          <motion.div
            className="absolute inset-0 border-4 border-transparent rounded-lg"
            style={{
              borderImage: `linear-gradient(to right, #34D399 ${progress}%, transparent ${progress}%) 1`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
            }}
          />
        </motion.div>
      )}
    </div>
  );
};