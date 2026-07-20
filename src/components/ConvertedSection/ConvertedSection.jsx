import React from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";

const ConvertedFilesList = dynamic(
  () => import("@/components/ConvertedFilesList/ConvertedFilesList"),
  { ssr: false }
);
const CompletionCelebration = dynamic(
  () => import("@/components/CompletionCelebration/CompletionCelebration"),
  { ssr: false }
);
const CancellationNotice = dynamic(
  () => import("@/components/CancellationNotice/CancellationNotice"),
  { ssr: false }
);
const DownloadPrompt = dynamic(
  () => import("@/components/DownloadPrompt/DownloadPrompt"),
  { ssr: false }
);
const ErrorDisplay = dynamic(
  () => import("@/components/ErrorDisplay/ErrorDisplay"),
  { ssr: false }
);

/**
 * 中性提示卡片（取消 / 全部失败等，非红色错误风格）
 */
const NeutralNotice = ({ tone = "neutral", title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
    className="mt-4 text-center"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`glass-panel p-6 rounded-xl shadow-lg flex flex-col items-center justify-center ${
        tone === "danger"
          ? "!bg-[rgba(239,68,68,0.08)] dark:!bg-[rgba(239,68,68,0.12)] !border-[rgba(239,68,68,0.26)]"
          : ""
      }`}
    >
      <p
        className={`text-md mt-1 font-semibold leading-relaxed ${
          tone === "danger"
            ? "text-red-600 dark:text-red-400"
            : "text-gray-700 dark:text-gray-200"
        }`}
      >
        {title}
      </p>
      {children}
    </motion.div>
  </motion.div>
);

/**
 * 失败文件清单卡片（部分 / 全部失败）
 */
const FailuresSummary = ({ failedFiles }) => (
  <NeutralNotice tone="danger" title={`有 ${failedFiles.length} 个文件转换失败`}>
    <ul className="mt-2 space-y-1 text-left w-full max-w-md">
      {failedFiles.map((f) => (
        <li
          key={f.name}
          className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2"
        >
          <span className="text-red-500 dark:text-red-400 font-semibold flex-shrink-0">
            •
          </span>
          <span className="break-all">
            <span className="font-medium">{f.name}</span>
            {f.message ? `：${f.message}` : ""}
          </span>
        </li>
      ))}
    </ul>
    <p className="text-gray-500 dark:text-gray-400 text-sm mt-3">
      其余文件已转换成功，可正常下载。
    </p>
  </NeutralNotice>
);

const ConvertedSection = React.memo(
  ({
    isComplete,
    error,
    failedFiles = [],
    isCancelled = false,
    showDownloadPrompt,
    scrollToConvertedFiles,
    backgroundScheme,
    convertedFiles,
    handleDownloadSingle,
    handleDeleteConvertedFile,
    handleDownloadAll,
  }) => {
    // 成功状态判定（传递给 ConvertedFilesList 的 header badge 使用）
    const isFullSuccess =
      isComplete && !error && failedFiles.length === 0 && convertedFiles.length > 0;

    return (
      <motion.div
        layout
        className="mt-4"
      >
        <AnimatePresence>
          {showDownloadPrompt && (
            <DownloadPrompt
              showDownloadPrompt={showDownloadPrompt}
              scrollToConvertedFiles={scrollToConvertedFiles}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && <ErrorDisplay error={error} />}
        </AnimatePresence>

        <AnimatePresence>
          {isCancelled && <CancellationNotice show={isCancelled} />}
        </AnimatePresence>

        <AnimatePresence>
          {failedFiles.length > 0 && <FailuresSummary failedFiles={failedFiles} />}
        </AnimatePresence>

        <AnimatePresence>
          {convertedFiles.length > 0 && (
            <>
              <CompletionCelebration show={isFullSuccess} scheme={backgroundScheme} />
              <ConvertedFilesList
                convertedFiles={convertedFiles}
                handleDownloadSingle={handleDownloadSingle}
                handleDeleteConvertedFile={handleDeleteConvertedFile}
                handleDownloadAll={handleDownloadAll}
                isComplete={isFullSuccess}
              />
            </>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);

export default ConvertedSection;
