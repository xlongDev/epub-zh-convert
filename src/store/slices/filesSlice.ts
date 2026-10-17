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

  addFiles: (incoming: FileList | File[]) => Promise<void>;
  deleteFile: (index: number) => void;
  clearFiles: () => void;
}

// 删除已不在源文件列表中的转换结果（源文件名可能带 / 不带 .epub）
const pruneConvertedFiles = (convertedFiles: ConvertedFile[], files: File[]): ConvertedFile[] => {
  if (convertedFiles.length === 0) return convertedFiles;
  const currentNames = new Set(files.map((f) => f.name));
  return convertedFiles.filter(
    (cf) => currentNames.has(cf.name.replace(/\.epub$/, "")) || currentNames.has(cf.name),
  );
};

// EPUB 本质是 ZIP 归档，合法文件以 ZIP 本地文件头签名开头（PK\x03\x04）。
// 用于上传阶段剔除扩展名是 .epub 但实际不是 ZIP 的伪文件。
const isLikelyEpub = async (file: File): Promise<boolean> => {
  try {
    const head = new Uint8Array(await file.slice(0, 4).arrayBuffer());
    return head[0] === 0x50 && head[1] === 0x4b && head[2] === 0x03 && head[3] === 0x04;
  } catch {
    return false;
  }
};

export const createFilesSlice: StateCreator<AppState, [], [], FilesSlice> = (set) => ({
  files: [],
  isFileSelected: false,

  // 仅接收 EPUB 文件：扩展名 + ZIP 魔数双重校验，排除伪 .epub（非真实 ZIP/EPUB）
  addFiles: async (incoming) => {
    const sourceFiles = Array.from(incoming);
    if (sourceFiles.length === 0) return;
    const epubFiles = sourceFiles.filter((file) => file.name.toLowerCase().endsWith(".epub"));
    if (epubFiles.length === 0 && sourceFiles.length > 0) {
      alert("只能上传EPUB格式的文件哦！😊");
      return;
    }
    const valid: File[] = [];
    const invalid: File[] = [];
    for (const file of epubFiles) {
      if (await isLikelyEpub(file)) valid.push(file);
      else invalid.push(file);
    }
    if (valid.length === 0) {
      alert("文件不是有效的 EPUB（ZIP）格式，请检查后重试。");
      return;
    }
    if (invalid.length > 0) {
      alert(`已跳过 ${invalid.length} 个无效文件（非 EPUB/ZIP 格式）。`);
    }
    set((state) => {
      const files = [...state.files, ...valid];
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
