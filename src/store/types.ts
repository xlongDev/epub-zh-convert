import type { BackgroundScheme, ConvertedFile, FailedFile, ConversionDirection } from "@/types";
import type { UISlice } from "./slices/uiSlice";
import type { FilesSlice } from "./slices/filesSlice";
import type { ConvertedSlice } from "./slices/convertedSlice";
import type { ConversionSlice } from "./slices/conversionSlice";

/**
 * 全局应用状态仓库的聚合类型。
 * 由四个 slice 组合而成（ui / files / converted / conversion），
 * 每个 slice 在 src/store/slices/* 中独立定义，useAppStore 负责组合。
 */
export type AppState = UISlice & FilesSlice & ConvertedSlice & ConversionSlice;

// 仅用于 slice 内引擎辅助函数的参数类型声明
export type { BackgroundScheme, ConvertedFile, FailedFile, ConversionDirection };
