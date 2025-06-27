/**
 * 自定义钩子：管理文件下载相关操作
 * @param {Function} setIsComplete - 更新转换完成状态的函数
 * @param {Function} setIsConversionFailedOrCancelled - 更新转换失败或取消状态的函数
 * @returns {Object} 包含文件下载和删除方法的对象
 */
export function useFileDownloadManager(setIsComplete, setIsConversionFailedOrCancelled) {
  /**
   * 为下载按钮添加动画效果
   * @param {string} id - 按钮的ID
   */
  const animateDownloadButton = (id) => {
    const button = document.getElementById(id);
    if (button) {
      button.classList.add("animate-ping"); // 添加脉冲动画类
      setTimeout(() => {
        button.classList.remove("animate-ping"); // 500ms后移除动画类
      }, 500);
    }
  };

  /**
   * 下载单个转换后的文件
   * @param {Array} convertedFiles - 转换后的文件数组
   * @param {number} index - 文件在数组中的索引
   */
  const handleDownloadSingle = (convertedFiles, index) => {
    const file = convertedFiles[index];
    if (!file) return; // 文件不存在则退出
    const url = URL.createObjectURL(file.blob); // 创建Blob对象的URL
    const a = document.createElement("a"); // 创建隐藏的下载链接
    a.href = url;
    a.download = file.name; // 设置文件名
    a.click(); // 触发下载
    URL.revokeObjectURL(url); // 释放URL资源
    animateDownloadButton(`download-${index}`); // 添加下载按钮动画
  };

  /**
   * 下载所有转换后的文件
   * @param {Array} convertedFiles - 转换后的文件数组
   */
  const handleDownloadAll = (convertedFiles) => {
    convertedFiles.forEach((file, index) => {
      const url = URL.createObjectURL(file.blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
      animateDownloadButton(`download-${index}`); // 为每个下载按钮添加动画
    });
  };

  /**
   * 删除转换后的文件
   * @param {Array} convertedFiles - 转换后的文件数组
   * @param {Array} indices - 要删除的文件索引数组
   * @param {Function} setConvertedFiles - 更新文件数组的状态函数
   */
  const handleDeleteConvertedFile = (convertedFiles, indices, setConvertedFiles) => {
    // 一次性过滤掉所有选中的文件
    const newFiles = convertedFiles.filter((_, index) => !indices.includes(index));
    
    if (newFiles.length === 0) {
      setIsComplete(false); // 文件全部删除后重置完成状态
      setIsConversionFailedOrCancelled(false); // 重置失败/取消状态
    }
    setConvertedFiles(newFiles); // 更新文件数组
  };

  return {
    handleDownloadSingle,
    handleDownloadAll,
    handleDeleteConvertedFile,
  };
}