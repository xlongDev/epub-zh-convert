/**
 * 将字节数格式化为人类可读的文件大小（二进制单位 B / KB / MB / GB）。
 * 统一替换原先在 FileList 与 ConvertedFilesList 中重复且输出不一致的实现。
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
