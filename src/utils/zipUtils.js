import JSZip from 'jszip';
import { convertText, convertFilename } from './opencc';

/**
 * 转换 EPUB 文件
 * @param {File} file - 用户上传的 EPUB 文件
 * @param {function} setProgress - 更新进度的回调函数
 * @param {AbortSignal} signal - 取消信号
 * @returns {Promise<{ blob: Blob, name: string }>} - 返回转换后的 Blob 对象和文件名
 */
export const convertEpub = async (file, setProgress, signal) => {
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
        if (path.endsWith('.html') || path.endsWith('.xhtml') || path.endsWith('.txt')) {
          // 转换文本内容
          content = await fileEntry.async('text');
          content = convertText(content);
        } else if (path.endsWith('toc.ncx') || path.endsWith('nav.xhtml')) {
          // 转换目录文件内容
          content = await fileEntry.async('text');
          content = convertText(content);
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
    const convertedFilename = convertFilename(originalFilename);

    return { blob: newEpub, name: convertedFilename }; // 返回转换后的 Blob 对象和文件名
  } catch (err) {
    throw new Error(err.message);
  }
};