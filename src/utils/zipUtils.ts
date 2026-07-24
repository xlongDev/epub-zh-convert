import JSZip, { type JSZipFileOptions } from "jszip";
import { saveAs } from "file-saver";
import { convertText, convertFilename } from "./opencc";
import type { ConversionDirection, ConvertedFile } from "@/types";

/**
 * 将多个已转换文件打包成 zip 并触发浏览器下载。
 * 统一了原先散落在 store.handleDownloadAll 与 ConvertedFilesList 内的重复实现，
 * 作为「批量/全部下载」的唯一实现入口。调用方自行 try/catch 以处理打包失败。
 *
 * @param files 待打包文件（name + blob）
 * @param zipName 下载用的 zip 文件名
 */
export const buildConvertedZip = async (
  files: { name: string; blob: Blob }[],
  zipName: string
): Promise<void> => {
  const zip = new JSZip();
  for (const file of files) {
    zip.file(file.name, file.blob);
  }
  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, zipName);
};

/**
 * 转换 EPUB（纯函数核心，不依赖浏览器 File/FileReader）
 * @param arrayBuffer - EPUB 文件的二进制内容
 * @param direction - 转换方向 ('t2s' 或 's2t')
 * @param onProgress - 进度回调，入参为 0-100 的整数
 * @param isCancelled - 取消判定，返回 true 时中止并抛出 AbortError
 * @returns 转换后的 Blob 对象
 */
export const convertEpubBuffer = async (
  data: ArrayBuffer | Uint8Array,
  direction: ConversionDirection = "t2s",
  onProgress: (percent: number) => void = () => {},
  isCancelled: () => boolean = () => false
): Promise<{ blob: Blob }> => {
  const zip = new JSZip();
  const epubZip = await JSZip.loadAsync(data);
  let totalFiles = Object.keys(epubZip.files).length;
  let processedFiles = 0;

  // EPUB 规范要求 mimetype 必须为 ZIP 首个条目且以 STORED（不压缩）方式存储，
  // 否则部分阅读器会判定为不合规 EPUB。这里先把 mimetype 以 STORED 固定写入首位，
  // 并在下方循环中跳过它（进度计数相应减一）。
  const mimetypeEntry = epubZip.files["mimetype"];
  if (mimetypeEntry && !mimetypeEntry.dir) {
    const mimetypeContent = await mimetypeEntry.async("uint8array");
    zip.file("mimetype", mimetypeContent, { compression: "STORE" });
    totalFiles -= 1;
  }

  const isTextFile = (path: string): boolean =>
    path.endsWith(".html") ||
    path.endsWith(".xhtml") ||
    path.endsWith(".txt") ||
    path.endsWith("toc.ncx") ||
    path.endsWith("nav.xhtml");

  for (const [path, fileEntry] of Object.entries(epubZip.files)) {
    if (path === "mimetype") continue; // 已在循环外首位固定写入
    if (isCancelled()) {
      throw new DOMException("转换已取消", "AbortError");
    }

    if (!fileEntry.dir) {
      let content: string | Uint8Array;
      if (isTextFile(path)) {
        content = await fileEntry.async("text");
        content = convertText(content, direction);
      } else if (path.endsWith(".opf")) {
        // 转换 OPF 文件中的元数据（包括作者信息）
        content = await fileEntry.async("text");
        content = convertOpfMetadata(content, direction);
      } else {
        content = await fileEntry.async("uint8array");
      }

      const entryOptions = fileEntry.options as typeof fileEntry.options & {
        compressionOptions?: { level?: number };
      };
      const fileOptions: JSZipFileOptions = {
        compression: entryOptions.compression,
      };
      if (entryOptions.compressionOptions?.level !== undefined) {
        fileOptions.compressionOptions = { level: entryOptions.compressionOptions.level };
      }
      zip.file(path, content, fileOptions);
    }

    processedFiles++;
    onProgress(Math.round((processedFiles / totalFiles) * 100));
  }

  if (isCancelled()) {
    throw new DOMException("转换已取消", "AbortError");
  }

  const newEpub = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 9 },
    platform: "UNIX",
    comment: "",
  });

  return { blob: newEpub };
};

/**
 * 转换 EPUB 文件（基于 File 的薄包装，供主线程降级路径使用）
 * @param file - 用户上传的 EPUB 文件
 * @param setProgress - 更新进度的回调函数
 * @param signal - 取消信号
 * @param direction - 转换方向 ('t2s' 或 's2t')
 * @returns 转换后的 Blob 与文件名
 */
export const convertEpub = async (
  file: File,
  setProgress: (percent: number) => void,
  signal: AbortSignal,
  direction: ConversionDirection = "t2s"
): Promise<ConvertedFile> => {
  const arrayBuffer = await file.arrayBuffer();
  const { blob } = await convertEpubBuffer(
    arrayBuffer,
    direction,
    setProgress,
    () => signal.aborted
  );
  const name = convertFilename(file.name, direction);
  return { blob, name };
};

/**
 * 转换 OPF 文件中的元数据
 * @param opfContent - OPF 文件内容
 * @param direction - 转换方向 ('t2s' 或 's2t')
 * @returns 转换后的 OPF 文件内容
 */
const convertOpfMetadata = (
  opfContent: string,
  direction: ConversionDirection
): string => {
  // 使用正则表达式匹配需要转换的元数据字段
  // 包括：作者(creator)、标题(title)、主题(subject)、描述(description)等
  const metadataPatterns: RegExp[] = [
    // 匹配 <dc:creator> 作者信息
    /<dc:creator[^>]*>([^<]*)<\/dc:creator>/gi,
    // 匹配 <dc:title> 标题
    /<dc:title[^>]*>([^<]*)<\/dc:title>/gi,
    // 匹配 <dc:subject> 主题
    /<dc:subject[^>]*>([^<]*)<\/dc:subject>/gi,
    // 匹配 <dc:description> 描述
    /<dc:description[^>]*>([^<]*)<\/dc:description>/gi,
    // 匹配 <dc:publisher> 出版者
    /<dc:publisher[^>]*>([^<]*)<\/dc:publisher>/gi,
    // 匹配 <dc:contributor> 贡献者
    /<dc:contributor[^>]*>([^<]*)<\/dc:contributor>/gi,
  ];

  let convertedContent = opfContent;

  metadataPatterns.forEach((pattern) => {
    convertedContent = convertedContent.replace(pattern, (match, content) => {
      // 只转换中文字符内容
      if (containsChinese(content)) {
        const convertedText = convertText(content, direction);
        return match.replace(content, convertedText);
      }
      return match;
    });
  });

  return convertedContent;
};

/**
 * 检查字符串是否包含中文字符
 * @param text - 要检查的文本
 * @returns 是否包含中文
 */
const containsChinese = (text: string): boolean => {
  return /[一-鿿]/.test(text);
};
