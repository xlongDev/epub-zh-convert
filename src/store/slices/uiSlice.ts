import type { StateCreator } from "zustand";
import type { BackgroundScheme, ConversionDirection } from "@/types";
import type { AppState } from "../types";
import backgroundSchemes from "@/config/backgroundSchemes";

/**
 * UI 状态 slice：主题背景、转换方向、各类 UI 开关与提示态。
 */
export interface UISlice {
  backgroundScheme: BackgroundScheme;
  direction: ConversionDirection;
  isFileListOpen: boolean;
  showDownloadPrompt: boolean;
  isDragging: boolean;
  isConversionFailedOrCancelled: boolean;

  setBackgroundScheme: (scheme: BackgroundScheme) => void;
  setDirection: (direction: ConversionDirection) => void;
  setIsFileListOpen: (open: boolean) => void;
  setShowDownloadPrompt: (show: boolean) => void;
  setIsDragging: (dragging: boolean) => void;
  setIsConversionFailedOrCancelled: (value: boolean) => void;
}

export const createUISlice: StateCreator<AppState, [], [], UISlice> = (set) => ({
  backgroundScheme: backgroundSchemes[0],
  direction: "t2s",
  isFileListOpen: false,
  showDownloadPrompt: false,
  isDragging: false,
  isConversionFailedOrCancelled: false,

  setBackgroundScheme: (scheme) => set({ backgroundScheme: scheme }),
  setDirection: (direction) => set({ direction }),
  setIsFileListOpen: (open) => set({ isFileListOpen: open }),
  setShowDownloadPrompt: (show) => set({ showDownloadPrompt: show }),
  setIsDragging: (dragging) => set({ isDragging: dragging }),
  setIsConversionFailedOrCancelled: (value) =>
    set({ isConversionFailedOrCancelled: value }),
});
