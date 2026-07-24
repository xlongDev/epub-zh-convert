import { create } from "zustand";
import type { AppState } from "./types";
import { createUISlice } from "./slices/uiSlice";
import { createFilesSlice } from "./slices/filesSlice";
import { createConvertedSlice } from "./slices/convertedSlice";
import { createConversionSlice } from "./slices/conversionSlice";

/**
 * 全局应用状态仓库（Zustand，按 slice 拆分）
 * ----------------------------------------------------------------
 * 将原先散落在 Home 组件与若干 hooks 中的 UI / 文件 / 转换状态统一收口，
 * 作为单一数据源（single source of truth）。
 *
 * 设计要点：
 * - 按职责拆分为 4 个 slice（ui / files / converted / conversion），
 *   各自在 src/store/slices/* 中独立定义，本文件仅负责组合，便于后续按需扩展。
 * - 组件通过选择器订阅所需切片，避免从 Home 一级级下钻 props。
 * - 转换引擎需要的非序列化引用（AbortController、Worker、暂停/继续
 *   Promise resolver 等）放在 conversionSlice 的模块级 `engineRefs`，
 *   不进入 store 的响应式部分。
 * - store action 是稳定引用，内部一律通过 `get()` 读取最新 files / direction，
 *   因此天然规避了原 hooks 用 ref 追踪最新值以避免闭包过期的写法。
 */

export const useAppStore = create<AppState>()((...a) => ({
  ...createUISlice(...a),
  ...createFilesSlice(...a),
  ...createConvertedSlice(...a),
  ...createConversionSlice(...a),
}));

export type { AppState } from "./types";
