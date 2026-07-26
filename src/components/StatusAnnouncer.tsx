import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/store/useAppStore";

/**
 * StatusAnnouncer — 屏幕阅读器播报器
 * ----------------------------------------------------------------
 * 订阅全局 store 的转换状态，在「开始 / 完成 / 取消 / 错误」等关键节点
 * 通过 aria-live 区域向辅助技术播报。视觉上完全隐藏（sr-only），
 * 不干扰正常 UI（进度条本身的 role=progressbar 已由 ProgressIndicator 提供）。
 *
 * - polite 区域：常规状态变更（开始、完成、取消），不打断当前播报
 * - assertive 区域：错误，立即播报
 */
export function StatusAnnouncer() {
  const isLoading = useAppStore((s) => s.isLoading);
  const isComplete = useAppStore((s) => s.isComplete);
  const isCancelled = useAppStore((s) => s.isCancelled);
  const error = useAppStore((s) => s.error);
  const failedFilesLen = useAppStore((s) => s.failedFiles.length);
  const convertedFilesLen = useAppStore((s) => s.convertedFiles.length);

  const [polite, setPolite] = useState("");
  const [assertive, setAssertive] = useState("");

  // 记录上一帧状态，仅在「状态发生有意义变化」时更新播报，避免重复朗读
  const prev = useRef({ isLoading, isComplete, isCancelled, error, convertedFilesLen });

  useEffect(() => {
    const p = prev.current;

    // 错误优先（assertive）
    if (error && !isLoading) {
      setAssertive(error);
      setPolite("");
    } else if (!error && p.error) {
      // 错误被清除（如重试），清空 assertive
      setAssertive("");
    }

    // 离散状态播报（polite）
    if (isLoading && !p.isLoading) {
      setPolite("开始转换，请稍候");
    } else if (isComplete && !p.isComplete && convertedFilesLen > 0) {
      const ok = convertedFilesLen;
      const fail = failedFilesLen;
      setPolite(
        fail > 0 ? `转换完成，成功 ${ok} 个，失败 ${fail} 个` : `转换完成，成功 ${ok} 个文件`,
      );
    } else if (isCancelled && !p.isCancelled) {
      setPolite("已取消转换");
    } else if (!isLoading && !isComplete && !isCancelled && !error && p.isLoading) {
      // 从「进行中」回到初始，清空（例如重置）
      setPolite("");
    }

    prev.current = { isLoading, isComplete, isCancelled, error, convertedFilesLen };
  }, [isLoading, isComplete, isCancelled, error, failedFilesLen, convertedFilesLen]);

  return (
    <>
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {polite}
      </div>
      <div aria-live="assertive" aria-atomic="true" className="sr-only">
        {assertive}
      </div>
    </>
  );
}

export default StatusAnnouncer;
