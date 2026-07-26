import { describe, it, expect, vi, afterEach } from "vitest";
import { reportError, installGlobalErrorHandlers } from "./errorReporter";

// 屏蔽测试中的 console.error 噪音（reportError 内部会 console.error 留痕）
afterEach(() => {
  vi.restoreAllMocks();
});

describe("errorReporter", () => {
  it("reportError 接受 Error 与字符串且不抛错", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => reportError(new Error("boom"), "manual")).not.toThrow();
    expect(() => reportError("plain string", "boundary")).not.toThrow();
    expect(spy).toHaveBeenCalled();
  });

  it("node 环境下 installGlobalErrorHandlers 返回清理函数且为空操作", () => {
    const cleanup = installGlobalErrorHandlers();
    expect(typeof cleanup).toBe("function");
    // 不应注册任何 window 监听（node 无 window）
    expect(() => cleanup()).not.toThrow();
  });
});
