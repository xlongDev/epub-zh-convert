import { Converter } from 'opencc-js';

// 创建繁简转换器
const converter = Converter({ from: 't', to: 'cn' });

/**
 * 转换文本内容
 * @param {string} text - 需要转换的文本
 * @returns {string} - 转换后的文本
 */
export const convertText = (text) => {
  return converter(text);
};

/**
 * 转换文件名（如果是繁体则转换为简体）
 * @param {string} filename - 原文件名
 * @returns {string} - 转换后的文件名
 */
export const convertFilename = (filename) => {
  const [name, ext] = filename.split('.');
  const convertedName = converter(name);
  return `${convertedName}.${ext}`;
};