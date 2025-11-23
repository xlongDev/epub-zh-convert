import JSZip from 'jszip';
import { convertText, convertFilename } from './opencc';

/**
 * 转换 EPUB 文件
 * @param {File} file - 用户上传的 EPUB 文件
 * @param {function} setProgress - 更新进度的回调函数
 * @param {AbortSignal} signal - 取消信号
 * @param {string} direction - 转换方向 ('t2s' 或 's2t')
 * @returns {Promise<{ blob: Blob, name: string }>} - 返回转换后的 Blob 对象和文件名
 */
export const convertEpub = async (file, setProgress, signal, direction = 't2s') => {
  try {
    const zip = new JSZip();
    const reader = new FileReader();

    // 读取文件内容
    const arrayBuffer = await new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsArrayBuffer(file);
    });

    // 检查是否取消
    if (signal.aborted) throw new Error('转换已取消');

    // 加载 ZIP 文件
    const epubZip = await JSZip.loadAsync(arrayBuffer);
    const totalFiles = Object.keys(epubZip.files).length;
    let processedFiles = 0;

    // 遍历 ZIP 文件中的每个文件
    for (const [path, fileEntry] of Object.entries(epubZip.files)) {
      if (signal.aborted) throw new Error('转换已取消'); // 检查是否取消

      if (!fileEntry.dir) {
        let content;
        
        // 处理文本文件
        if (path.endsWith('.html') || path.endsWith('.xhtml') || path.endsWith('.txt')) {
          // 转换文本内容
          content = await fileEntry.async('text');
          content = convertText(content, direction);
        } else if (path.endsWith('toc.ncx') || path.endsWith('nav.xhtml')) {
          // 转换目录文件内容
          content = await fileEntry.async('text');
          content = convertText(content, direction);
        } else if (path.endsWith('.opf')) {
          // 转换 OPF 文件中的元数据（包括作者信息）
          content = await fileEntry.async('text');
          content = convertOpfMetadata(content, direction);
        } else {
          // 直接复制非文本文件
          content = await fileEntry.async('uint8array');
        }

        // 使用原始文件的压缩参数
        zip.file(path, content, {
          compression: fileEntry.options.compression,
          compressionOptions: fileEntry.options.compressionOptions,
        });
      }

      // 更新进度
      processedFiles++;
      setProgress(Math.round((processedFiles / totalFiles) * 100));
    }

    // 检查是否取消
    if (signal.aborted) throw new Error('转换已取消');

    // 生成新的 EPUB 文件
    const newEpub = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 },
      platform: 'UNIX',
      comment: '',
    });

    // 转换文件名
    const originalFilename = file.name;
    const convertedFilename = convertFilename(originalFilename, direction);

    return { blob: newEpub, name: convertedFilename };
  } catch (err) {
    throw new Error(err.message);
  }
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

  metadataPatterns.forEach(pattern => {
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
  return /[\u4e00-\u9fff]/.test(text);
};