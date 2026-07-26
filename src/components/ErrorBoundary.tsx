import React from "react";
import { reportError } from "@/utils/errorReporter";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** 可选自定义兜底 UI，默认提供通用中文提示 */
  fallback?: (error: Error, reset: () => void) => React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary — 应用级错误边界
 * 捕获子树渲染期抛出的异常，避免整页白屏；
 * 同时上报到错误监控（见 errorReporter），并允许用户「重试」恢复。
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    reportError(error, "boundary", { componentStack: info.componentStack });
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error as Error, this.handleReset);
      }
      return (
        <div role="alert" className="min-h-[40vh] flex items-center justify-center p-6">
          <div className="glass-panel p-8 rounded-xl shadow-lg text-center max-w-md">
            <p className="text-lg font-semibold text-red-600 dark:text-red-400">
              页面出现了点小故障
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              转换过程遇到问题，已记录在后台。你可以重试，或刷新页面。
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className="mt-4 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              重试
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
