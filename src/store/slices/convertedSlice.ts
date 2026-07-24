import type { StateCreator } from "zustand";
import type { ConvertedFile, FailedFile } from "@/types";
import type { AppState } from "../types";

/**
 * 转换结果 slice：已转换 / 失败文件列表，以及单文件 / 批量下载、删除、清空与滚动定位。
 * 下载的打包逻辑统一委托给 utils/zipUtils 的 buildConvertedZip，
 * 清空会联动 filesSlice.clearFiles 与 conversionSlice.resetConversion。
 */
export interface ConvertedSlice {
  convertedFiles: ConvertedFile[];
  failedFiles: FailedFile[];

  handleDownloadSingle: (index: number) => void;
  handleDownloadAll: () => Promise<void>;
  handleDeleteConvertedFile: (indices: number[]) => void;
  handleClearAll: () => void;
  scrollToConvertedFiles: () => void;
}

export const createConvertedSlice: StateCreator<AppState, [], [], ConvertedSlice> = (
  set,
  get
) => ({
  convertedFiles: [],
  failedFiles: [],

  handleDownloadSingle: (index) => {
    const file = get().convertedFiles[index];
    if (!file) return;
    const url = URL.createObjectURL(file.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  },

  handleDownloadAll: async () => {
    const convertedFiles = get().convertedFiles;
    if (!convertedFiles || convertedFiles.length === 0) return;
    if (convertedFiles.length === 1) {
      get().handleDownloadSingle(0);
      return;
    }
    try {
      const { buildConvertedZip } = await import("@/utils/zipUtils");
      await buildConvertedZip(
        convertedFiles.map((f) => ({ name: f.name, blob: f.blob })),
        `全部文件(${convertedFiles.length}个).zip`
      );
    } catch (err) {
      console.error("打包下载失败，回退为逐个下载:", err);
      convertedFiles.forEach((_, index) => get().handleDownloadSingle(index));
    }
  },

  handleDeleteConvertedFile: (indices) => {
    const convertedFiles = get().convertedFiles;
    const newFiles = convertedFiles.filter((_, index) => !indices.includes(index));
    if (newFiles.length === 0) {
      set({ isComplete: false, isConversionFailedOrCancelled: false });
    }
    set({ convertedFiles: newFiles });
  },

  handleClearAll: () => {
    get().clearFiles();
    get().resetConversion();
    set({
      isConversionFailedOrCancelled: false,
      isFileListOpen: false,
      showDownloadPrompt: false,
    });
  },

  scrollToConvertedFiles: () => {
    const el = document.getElementById("converted-files");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      set({ showDownloadPrompt: false });
    }
  },
});
