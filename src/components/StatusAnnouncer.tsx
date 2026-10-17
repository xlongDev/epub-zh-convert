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
 *
 * 播报文本直接由当前状态**派生**：aria-live 仅在其文本内容发生变化时才播报，
 * 因此无需在 effect 中 setState（避免 set-state-in-effect 级联渲染，也更简单）。
 */
export function StatusAnnouncer() {
  const isLoading = useAppStore((s) => s.isLoading);
  const isComplete = useAppStore((s) => s.isComplete);
  const isCancelled = useAppStore((s) => s.isCancelled);
  const error = useAppStore((s) => s.error);
  const failedFilesLen = useAppStore((s) => s.failedFiles.length);
  const convertedFilesLen = useAppStore((s) => s.convertedFiles.length);

  const assertive = error && !isLoading ? error : "";

  let polite = "";
  if (isLoading) {
    polite = "开始转换，请稍候";
  } else if (isComplete && convertedFilesLen > 0) {
    polite =
      failedFilesLen > 0
        ? `转换完成，成功 ${convertedFilesLen} 个，失败 ${failedFilesLen} 个`
        : `转换完成，成功 ${convertedFilesLen} 个文件`;
  } else if (isCancelled) {
    polite = "已取消转换";
  }

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
