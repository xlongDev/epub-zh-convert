import { describe, it, expect, beforeEach, vi, type Mock } from "vitest";
import { createConversionSlice, _engineRefs } from "./conversionSlice";
import type { AppState, ConvertedFile } from "../types";

// 拦截主线程降级路径的动态 import（node 环境无 Worker，必然走此路径）
vi.mock("@/utils/zipUtils", () => ({
  convertEpub: vi.fn(),
}));

import { convertEpub } from "@/utils/zipUtils";

interface TestState extends Partial<AppState> {
  files: File[];
  direction: "s2t" | "t2s";
  convertedFiles: ConvertedFile[];
  failedFiles: Array<{ name: string; message: string }>;
  isConversionFailedOrCancelled: boolean;
}

function makeStore(initial: Partial<TestState> = {}) {
  const base: Record<string, unknown> = {
    files: [],
    direction: "s2t",
    convertedFiles: [],
    failedFiles: [],
    isConversionFailedOrCancelled: false,
    // ConversionSlice 初始 state（createConversionSlice 的混合对象里也含这些，
    // 但本测试用自定义 get/set，需手动并入以便 get() 能读到）
    isLoading: false,
    progress: 0,
    error: null,
    isComplete: false,
    isCancelled: false,
    currentFileIndex: 0,
    isPaused: false,
    ...initial,
  };
  let state = base as unknown as AppState;
  const get = () => state;
  const set = (partial: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => {
    const next = typeof partial === "function" ? partial(state) : partial;
    state = { ...state, ...next };
  };
  // zustand 的 StateCreator 类型要求 (set, get, api) 三参，测试里只需前两个，
  // 这里把 creator 适配为两参调用，避免类型报错。
  const creator = createConversionSlice as unknown as (
    set: (partial: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => void,
    get: () => AppState,
  ) => ReturnType<typeof createConversionSlice>;
  const slice = creator(set, get);
  return { slice, getState: () => state as unknown as TestState };
}

beforeEach(() => {
  _engineRefs.abortController = null;
  _engineRefs.worker = null;
  _engineRefs.pendingReject = null;
  _engineRefs.paused = false;
  _engineRefs.resumeResolver = null;
  vi.clearAllMocks();
});

describe("conversionSlice — 状态机", () => {
  it("空文件列表时 handleConvert 直接返回，不改变 loading 状态", async () => {
    const { slice, getState } = makeStore({ files: [] });
    await slice.handleConvert();
    expect(getState().isLoading).toBe(false);
    expect(_engineRefs.abortController).toBeNull();
  });

  it("handlePause 设置暂停标志（响应式 + 引擎引用）", () => {
    const { slice, getState } = makeStore();
    slice.handlePause();
    expect(getState().isPaused).toBe(true);
    expect(_engineRefs.paused).toBe(true);
  });

  it("handleResume 清除暂停并触发被挂起的 resume resolver", () => {
    const { slice, getState } = makeStore();
    let resolved = false;
    _engineRefs.resumeResolver = () => {
      resolved = true;
    };
    slice.handleResume();
    expect(getState().isPaused).toBe(false);
    expect(_engineRefs.paused).toBe(false);
    expect(_engineRefs.resumeResolver).toBeNull();
    expect(resolved).toBe(true);
  });

  it("handleCancel 在存在 abortController 时中止并标记取消状态", () => {
    const { slice, getState } = makeStore({ isLoading: true });
    _engineRefs.abortController = new AbortController();
    slice.handleCancel();
    expect(_engineRefs.abortController.signal.aborted).toBe(true);
    expect(getState().isCancelled).toBe(true);
    expect(getState().isLoading).toBe(false);
    expect(getState().isPaused).toBe(false);
  });

  it("handleCancel 在无进行中转换时是安全空操作（不报错）", () => {
    const { slice, getState } = makeStore();
    expect(() => slice.handleCancel()).not.toThrow();
    expect(getState().isCancelled).toBe(false);
  });

  it("resetConversion 重置全部转换状态并销毁引擎引用", () => {
    const { slice, getState } = makeStore({
      isLoading: true,
      isPaused: true,
      progress: 50,
      convertedFiles: [{ name: "a", blob: new Blob() }],
      failedFiles: [{ name: "b", message: "x" }],
      currentFileIndex: 2,
    });
    _engineRefs.abortController = new AbortController();
    slice.resetConversion();
    const s = getState();
    expect(s.isPaused).toBe(false);
    expect(s.convertedFiles).toEqual([]);
    expect(s.failedFiles).toEqual([]);
    expect(s.isComplete).toBe(false);
    expect(s.isCancelled).toBe(false);
    expect(s.progress).toBe(0);
    expect(s.error).toBeNull();
    expect(s.isLoading).toBe(false);
    expect(s.currentFileIndex).toBe(0);
    expect(_engineRefs.abortController).toBeNull();
  });

  it("resetConversion 若存在挂起的 resume 也一并放行，避免循环悬挂", () => {
    const { slice } = makeStore();
    let resolved = false;
    _engineRefs.resumeResolver = () => {
      resolved = true;
    };
    slice.resetConversion();
    expect(resolved).toBe(true);
    expect(_engineRefs.resumeResolver).toBeNull();
  });

  it("handleConvert 主线程降级成功：标记完成并收集结果", async () => {
    const fakeFile = new File(["x"], "test.epub", { type: "application/epub+zip" });
    const { slice, getState } = makeStore({ files: [fakeFile] });
    (convertEpub as unknown as Mock).mockImplementation(
      (file: File, onProgress: (p: number) => void) => {
        onProgress(100);
        return Promise.resolve({ name: file.name, blob: new Blob() });
      },
    );
    await slice.handleConvert();
    expect(getState().isComplete).toBe(true);
    expect(getState().convertedFiles).toHaveLength(1);
    expect(getState().convertedFiles[0].name).toBe("test.epub");
    expect(getState().isLoading).toBe(false);
    expect(_engineRefs.abortController).not.toBeNull();
  });

  it("handleConvert 单个文件失败：收集到 failedFiles 而非中断整体流程", async () => {
    const fakeFile = new File(["x"], "bad.epub");
    const { slice, getState } = makeStore({ files: [fakeFile] });
    (convertEpub as unknown as Mock).mockRejectedValue(new Error("boom"));
    await slice.handleConvert();
    expect(getState().failedFiles).toHaveLength(1);
    expect(getState().failedFiles[0].message).toBe("boom");
    // 全部文件处理完（即使失败）仍标记完成
    expect(getState().isComplete).toBe(true);
  });

  it("handleRetryFailed 成功移除 failedFiles 并写入 convertedFiles", async () => {
    const file = new File(["x"], "retry.epub", { type: "application/epub+zip" });
    const { slice, getState } = makeStore({
      files: [file],
      failedFiles: [{ name: "retry.epub", message: "boom" }],
      isComplete: true,
    });
    (convertEpub as unknown as Mock).mockResolvedValue({
      name: "retry.epub",
      blob: new Blob(),
    });
    await slice.handleRetryFailed();
    expect(getState().isLoading).toBe(false);
    expect(getState().failedFiles).toHaveLength(0);
    expect(getState().convertedFiles).toHaveLength(1);
    expect(getState().convertedFiles[0].name).toBe("retry.epub");
  });

  it("handleRetryFailed 部分失败：成功的写入、失败的重回 failedFiles", async () => {
    const good = new File(["x"], "good.epub", { type: "application/epub+zip" });
    const bad = new File(["x"], "bad.epub", { type: "application/epub+zip" });
    const { slice, getState } = makeStore({
      files: [good, bad],
      failedFiles: [
        { name: "good.epub", message: "boom" },
        { name: "bad.epub", message: "boom" },
      ],
      isComplete: true,
    });
    (convertEpub as unknown as Mock).mockImplementation((file: File) => {
      if (file.name === "bad.epub") return Promise.reject(new Error("still bad"));
      return Promise.resolve({ name: file.name, blob: new Blob() });
    });
    await slice.handleRetryFailed();
    const s = getState();
    expect(s.convertedFiles).toHaveLength(1);
    expect(s.convertedFiles[0].name).toBe("good.epub");
    expect(s.failedFiles).toHaveLength(1);
    expect(s.failedFiles[0].name).toBe("bad.epub");
    expect(s.failedFiles[0].message).toBe("still bad");
  });
});
