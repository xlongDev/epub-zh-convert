import { Converter } from "opencc-js";

// 创建繁简转换器
const t2sConverter = Converter({ from: "t", to: "cn" }); // 繁转简
const s2tConverter = Converter({ from: "cn", to: "t" }); // 简转繁

/**
 * 转换文本内容
 * @param {string} text - 需要转换的文本
 * @param {string} direction - 转换方向 ('t2s' 或 's2t')
 * @returns {string} - 转换后的文本
 */
export const convertText = (text, direction = "t2s") => {
  if (direction === "t2s") {
    return t2sConverter(text);
  } else if (direction === "s2t") {
    return s2tConverter(text);
  }
  return text; // 默认不转换
};

/**
 * 转换文件名
 * @param {string} filename - 原文件名
 * @param {string} direction - 转换方向 ('t2s' 或 's2t')
 * @returns {string} - 转换后的文件名
 */
export const convertFilename = (filename, direction = "t2s") => {
  // 移除现有的.epub扩展名（如果存在）
  const nameWithoutExt = filename.replace(/\.epub$/i, "");

  // 转换文件名部分
  const convertedName = convertText(nameWithoutExt, direction);

  // 确保返回的文件名有.epub扩展名
  return `${convertedName}.epub`;
};
