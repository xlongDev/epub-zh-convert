import JSZip from 'jszip';
import { convertText, convertFilename } from './opencc';

/**
 * 转换 EPUB（纯函数核心，不依赖浏览器 File/FileReader）
 * @param {ArrayBuffer} arrayBuffer - EPUB 文件的二进制内容
 * @param {string} direction - 转换方向 ('t2s' 或 's2t')
 * @param {function} onProgress - 进度回调，入参为 0-100 的整数
 * @param {function} isCancelled - 取消判定，返回 true 时中止并抛出 AbortError
 * @returns {Promise<{ blob: Blob }>} - 转换后的 Blob 对象
 */
export const convertEpubBuffer = async (
  arrayBuffer,
  direction = 't2s',
  onProgress = () => {},
  isCancelled = () => false
) => {
  const zip = new JSZip();
  const epubZip = await JSZip.loadAsync(arrayBuffer);
  const totalFiles = Object.keys(epubZip.files).length;
  let processedFiles = 0;

  const isTextFile = (path) =>
    path.endsWith('.html') ||
    path.endsWith('.xhtml') ||
    path.endsWith('.txt') ||
    path.endsWith('toc.ncx') ||
    path.endsWith('nav.xhtml');

  for (const [path, fileEntry] of Object.entries(epubZip.files)) {
    if (isCancelled()) {
      throw new DOMException('转换已取消', 'AbortError');
    }

    if (!fileEntry.dir) {
      let content;
      if (isTextFile(path)) {
        content = await fileEntry.async('text');
        content = convertText(content, direction);
      } else if (path.endsWith('.opf')) {
        // 转换 OPF 文件中的元数据（包括作者信息）
        content = await fileEntry.async('text');
        content = convertOpfMetadata(content, direction);
      } else {
        content = await fileEntry.async('uint8array');
      }

      zip.file(path, content, {
        compression: fileEntry.options.compression,
        compressionOptions: fileEntry.options.compressionOptions,
      });
    }

    processedFiles++;
    onProgress(Math.round((processedFiles / totalFiles) * 100));
  }

  if (isCancelled()) {
    throw new DOMException('转换已取消', 'AbortError');
  }

  const newEpub = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
    platform: 'UNIX',
    comment: '',
  });

  return { blob: newEpub };
};

/**
 * 转换 EPUB 文件（基于 File 的薄包装，供主线程降级路径使用）
 * @param {File} file - 用户上传的 EPUB 文件
 * @param {function} setProgress - 更新进度的回调函数
 * @param {AbortSignal} signal - 取消信号
 * @param {string} direction - 转换方向 ('t2s' 或 's2t')
 * @returns {Promise<{ blob: Blob, name: string }>} - 转换后的 Blob 与文件名
 */
export const convertEpub = async (file, setProgress, signal, direction = 't2s') => {
  const arrayBuffer = await file.arrayBuffer();
  const { blob } = await convertEpubBuffer(
    arrayBuffer,
    direction,
    setProgress,
    () => signal?.aborted
  );
  const name = convertFilename(file.name, direction);
  return { blob, name };
};

/**
 * 转换 OPF 文件中的元数据
 * @param {string} opfContent - OPF 文件内容
 * @param {string} direction - 转换方向 ('t2s' 或 's2t')
 * @returns {string} - 转换后的 OPF 文件内容
 */
const convertOpfMetadata = (opfContent, direction) => {
  // 使用正则表达式匹配需要转换的元数据字段
  // 包括：作者(creator)、标题(title)、主题(subject)、描述(description)等
  const metadataPatterns = [
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
 * @param {string} text - 要检查的文本
 * @returns {boolean} - 是否包含中文
 */
const containsChinese = (text) => {
  return /[一-鿿]/.test(text);
};
