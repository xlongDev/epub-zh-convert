/**
 * 轻量错误上报工具
 * ----------------------------------------------------------------
 * 设计目标：让线上 Worker 崩溃 / 渲染异常 / 未捕获 Promise 拒绝「可见」，
 * 而无需立即接入 Sentry / Bugly 等外部服务（它们需要凭证与额外配置）。
 *
 * 行为：
 * - 若配置了 `NEXT_PUBLIC_ERROR_REPORTING_ENDPOINT`，则以 POST 方式上报 JSON；
 *   （端点由部署方在环境变量中提供，本工具不硬编码任何凭证，也不处理响应。）
 * - 否则退化为 `console.error`，保证开发/未配置环境下仍能看到错误。
 * - 全部逻辑 SSR 安全：模块加载期不触碰 `window` / `document`。
 */

const ENDPOINT = process.env.NEXT_PUBLIC_ERROR_REPORTING_ENDPOINT;

export interface ErrorReport {
  message: string;
  stack?: string;
  type: "uncaught" | "unhandledrejection" | "boundary" | "manual";
  context?: Record<string, unknown>;
  /** 发生时的时间戳（毫秒） */
  timestamp: number;
  /** 页面 URL（仅浏览器端存在） */
  url?: string;
  userAgent?: string;
}

export function reportError(
  error: unknown,
  type: ErrorReport["type"] = "manual",
  context?: Record<string, unknown>,
): void {
  const err = error instanceof Error ? error : new Error(String(error));
  const report: ErrorReport = {
    message: err.message,
    stack: err.stack,
    type,
    context,
    timestamp: Date.now(),
    url: typeof window !== "undefined" ? window.location.href : undefined,
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
  };

  // 任何情况下都在控制台保留线索（开发环境、未配置端点都可见）
  // eslint-disable-next-line no-console
  console.error("[error-reporter]", report);

  if (!ENDPOINT) return;

  // 上报失败不应影响用户体验，静默吞掉异常
  try {
    void fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(report),
      keepalive: true,
    });
  } catch {
    /* no-op */
  }
}

/**
 * 安装全局错误钩子：捕获渲染之外的运行时异常与未处理 Promise 拒绝。
 * 返回清理函数，便于测试或卸载时移除监听。
 */
export function installGlobalErrorHandlers(): () => void {
  if (typeof window === "undefined") return () => {};

  const onError = (event: ErrorEvent) => {
    // 资源加载错误（img/script 等）没有 error 对象，仅记录消息
    if (event.error) {
      reportError(event.error, "uncaught");
    } else {
      reportError(new Error(event.message), "uncaught", {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    }
  };

  const onUnhandledRejection = (event: PromiseRejectionEvent) => {
    reportError(event.reason, "unhandledrejection");
  };

  window.addEventListener("error", onError);
  window.addEventListener("unhandledrejection", onUnhandledRejection);

  return () => {
    window.removeEventListener("error", onError);
    window.removeEventListener("unhandledrejection", onUnhandledRejection);
  };
}
