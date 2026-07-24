import { Converter } from "opencc-js";
import type { ConversionDirection } from "@/types";

// 创建繁简转换器
const t2sConverter = Converter({ from: "t", to: "cn" }); // 繁转简
const s2tConverter = Converter({ from: "cn", to: "t" }); // 简转繁

/**
 * 转换文本内容
 * @param text - 需要转换的文本
 * @param direction - 转换方向 ('t2s' 或 's2t')
 * @returns 转换后的文本
 */
export const convertText = (text: string, direction: ConversionDirection = "t2s"): string => {
  if (!text || typeof text !== "string") {
    return text;
  }

  // 不再静默吞错：转换失败直接抛出，由上层（worker / EPUB 打包）捕获并提示用户，
  // 避免产生「看似成功但内容未转换」的静默错误输出。
  if (direction === "t2s") {
    return t2sConverter(text);
  } else if (direction === "s2t") {
    return s2tConverter(text);
  }
  return text; // 默认不转换
};

/**
 * 转换文件名
 * @param filename - 原文件名
 * @param direction - 转换方向 ('t2s' 或 's2t')
 * @returns 转换后的文件名
 */
export const convertFilename = (
  filename: string,
  direction: ConversionDirection = "t2s"
): string => {
  if (!filename) return filename;

  // 移除现有的 .epub 扩展名（如果存在）
  const nameWithoutExt = filename.replace(/\.epub$/i, "");

  // 转换文件名部分
  const convertedName = convertText(nameWithoutExt, direction);

  // 确保返回的文件名有 .epub 扩展名
  return `${convertedName}.epub`;
};
