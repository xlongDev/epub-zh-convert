// 全局共享类型定义

/** 转换方向：繁体转简体 / 简体转繁体 */
export type ConversionDirection = "t2s" | "s2t";

/** 单个已转换完成的文件 */
export interface ConvertedFile {
  name: string;
  blob: Blob;
}

/** 转换失败的文件（单文件失败，整体仍可能部分成功） */
export interface FailedFile {
  name: string;
  message: string;
}

/** 背景配色方案 */
export interface BackgroundScheme {
  light: string;
  dark: string;
  colors: {
    light: string[];
    dark: string[];
  };
}

/** 方向选择项 */
export interface DirectionOption {
  value: ConversionDirection;
  label: string;
}

/** Web Worker 入站消息（主线程 → Worker） */
export type WorkerRequest =
  | { type: "convert"; file: File; direction: ConversionDirection }
  | { type: "cancel" };

/** Web Worker 出站消息（Worker → 主线程） */
export type WorkerResponse =
  | { type: "progress"; percent: number }
  | { type: "done"; buffer: ArrayBuffer; name: string }
  | { type: "error"; message: string; name: string };
