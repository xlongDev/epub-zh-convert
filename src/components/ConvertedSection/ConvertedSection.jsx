import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import Lottie from "@/components/Lottie/Lottie";

const ConvertedFilesList = dynamic(
  () => import("@/components/ConvertedFilesList/ConvertedFilesList"),
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
      className={`backdrop-blur-md p-6 rounded-xl shadow-lg border flex flex-col items-center justify-center ${
        tone === "danger"
          ? "bg-red-50/70 dark:bg-red-900/30 border-red-200 dark:border-red-700/50"
          : "bg-white/60 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700/50"
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
    convertedFiles,
    handleDownloadSingle,
    handleDeleteConvertedFile,
    handleDownloadAll,
  }) => {
    // 成功动画 JSON 改为运行时 fetch，避免打进首屏主包
    const [successAnimation, setSuccessAnimation] = useState(null);
    // 仅「全部成功」时才展示成功 Lottie，避免与失败清单冲突
    const isFullSuccess =
      isComplete && !error && failedFiles.length === 0 && convertedFiles.length > 0;

    useEffect(() => {
      if (isFullSuccess) {
        fetch("/animations/success.json")
          .then((res) => (res.ok ? res.json() : Promise.reject()))
          .then(setSuccessAnimation)
          .catch(() => setSuccessAnimation(null));
      }
    }, [isFullSuccess]);

    return (
      <motion.div
        layout
        className="mt-4 min-h-[200px]" // 添加最小高度
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
          {isFullSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              layout
              className="text-center converted-section"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {successAnimation && (
                  <Lottie
                    animationData={successAnimation}
                    loop={false}
                    play
                    style={{ width: 120, height: 120, margin: "0 auto" }}
                    ariaLabel="转换成功"
                  />
                )}
              </motion.div>
              <p className="text-green-600 dark:text-green-400 font-semibold mt-1">
                转换完成，共 {convertedFiles.length} 个文件
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && <ErrorDisplay error={error} />}
        </AnimatePresence>

        <AnimatePresence>
          {isCancelled && (
            <NeutralNotice title="已取消转换">
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                已转换的文件仍可在下方下载。
              </p>
            </NeutralNotice>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {failedFiles.length > 0 && <FailuresSummary failedFiles={failedFiles} />}
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
      </motion.div>
    );
  }
);

export default ConvertedSection;
