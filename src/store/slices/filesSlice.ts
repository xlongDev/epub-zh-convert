import type { StateCreator } from "zustand";
import type { ConvertedFile } from "@/types";
import type { AppState } from "../types";

/**
 * 文件状态 slice：上传文件列表与增删/清空操作。
 * 增删文件时会联动裁剪已转换结果（pruneConvertedFiles），
 * 并更新 isComplete / isConversionFailedOrCancelled / showDownloadPrompt 等跨 slice 状态。
 */
export interface FilesSlice {
  files: File[];
  isFileSelected: boolean;

  addFiles: (incoming: FileList | File[]) => void;
  deleteFile: (index: number) => void;
  clearFiles: () => void;
}

// 删除已不在源文件列表中的转换结果（源文件名可能带 / 不带 .epub）
const pruneConvertedFiles = (
  convertedFiles: ConvertedFile[],
  files: File[]
): ConvertedFile[] => {
  if (convertedFiles.length === 0) return convertedFiles;
  const currentNames = new Set(files.map((f) => f.name));
  return convertedFiles.filter(
    (cf) =>
      currentNames.has(cf.name.replace(/\.epub$/, "")) || currentNames.has(cf.name)
  );
};

export const createFilesSlice: StateCreator<AppState, [], [], FilesSlice> = (set) => ({
  files: [],
  isFileSelected: false,

  // 仅接收 EPUB 文件；若混入非 EPUB 则提示并忽略
  addFiles: (incoming) => {
    const sourceFiles = Array.from(incoming);
    if (sourceFiles.length === 0) return;
    const epubFiles = sourceFiles.filter((file) =>
      file.name.toLowerCase().endsWith(".epub")
    );
    if (epubFiles.length === 0 && sourceFiles.length > 0) {
      alert("只能上传EPUB格式的文件哦！😊");
      return;
    }
    set((state) => {
      const files = [...state.files, ...epubFiles];
      return {
        files,
        isFileSelected: true,
        convertedFiles: pruneConvertedFiles(state.convertedFiles, files),
      };
    });
  },

  deleteFile: (index) => {
    set((state) => {
      const files = state.files.filter((_, i) => i !== index);
      const convertedFiles = pruneConvertedFiles(state.convertedFiles, files);
      return {
        files,
        isFileSelected: files.length > 0,
        convertedFiles,
        // 清空上传列表后，重置完成 / 失败 / 下载提示状态
        isComplete: files.length === 0 ? false : state.isComplete,
        isConversionFailedOrCancelled:
          files.length === 0 ? false : state.isConversionFailedOrCancelled,
        showDownloadPrompt: files.length === 0 ? false : state.showDownloadPrompt,
      };
    });
  },

  clearFiles: () => set({ files: [], isFileSelected: false }),
});
