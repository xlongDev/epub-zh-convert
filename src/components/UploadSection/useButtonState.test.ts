import { describe, it, expect } from "vitest";
import { useButtonState } from "./useButtonState";

describe("useButtonState — 按钮状态推导", () => {
  it("加载中且暂停 → 显示「已暂停」并禁用", () => {
    const s = useButtonState(true, false, false, true);
    expect(s.isLoading).toBe(true);
    expect(s.disabled).toBe(true);
    expect(s.text).toBe("已暂停");
    expect(s.icon).not.toBeNull();
  });

  it("加载中（未暂停）→ 显示「正在转换」并禁用", () => {
    const s = useButtonState(true, false, false, false);
    expect(s.isLoading).toBe(true);
    expect(s.disabled).toBe(true);
    expect(s.text).toBe("正在转换");
    expect(s.icon).toBeNull();
  });

  it("完成 → 显示「转换完成」且可用", () => {
    const s = useButtonState(false, true, false, false);
    expect(s.isLoading).toBe(false);
    expect(s.disabled).toBe(false);
    expect(s.text).toBe("转换完成");
    expect(s.icon).not.toBeNull();
  });

  it("失败或取消 → 显示「重试转换」且可用", () => {
    const s = useButtonState(false, false, true, false);
    expect(s.isLoading).toBe(false);
    expect(s.disabled).toBe(false);
    expect(s.text).toBe("重试转换");
    expect(s.icon).not.toBeNull();
  });

  it("默认（未加载/未完成/未失败）→ 显示「开始转换」", () => {
    const s = useButtonState(false, false, false, false);
    expect(s.isLoading).toBe(false);
    expect(s.disabled).toBe(false);
    expect(s.text).toBe("开始转换");
    expect(s.icon).not.toBeNull();
  });

  it("优先级：加载中高于完成与失败（先判加载态）", () => {
    const s = useButtonState(true, true, true, false);
    expect(s.text).toBe("正在转换");
    expect(s.disabled).toBe(true);
  });

  it("优先级：完成高于失败（先判完成态）", () => {
    const s = useButtonState(false, true, true, false);
    expect(s.text).toBe("转换完成");
  });
});
