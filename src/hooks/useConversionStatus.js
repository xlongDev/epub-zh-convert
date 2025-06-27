import { useState, useRef } from "react";

/**
 * 自定义钩子：管理文件转换状态（成功、失败、取消等）
 * @returns {Object} 包含状态和更新方法的对象
 */
export default function useConversionStatus() {
  // 转换失败或被取消的状态
  const [isConversionFailedOrCancelled, setIsConversionFailedOrCancelled] = useState(false);
  
  // 使用ref存储上一次的转换完成状态，避免状态更新导致的循环渲染
  const prevIsComplete = useRef(false);
  
  /**
   * 更新转换状态
   * @param {boolean} isComplete - 当前转换是否完成
   * @param {Error|null} error - 错误对象（存在时表示转换失败）
   * @param {boolean} isLoading - 是否正在加载/转换
   * @param {boolean} filesExist - 是否存在转换后的文件
   */
  const updateStatus = (isComplete, error, isLoading, filesExist) => {
    // 如果发生错误且不在加载中，标记为转换失败
    if (error && !isLoading) {
      setIsConversionFailedOrCancelled(true);
    } 
    // 如果正在加载，重置失败/取消状态
    else if (isLoading) {
      setIsConversionFailedOrCancelled(false);
    } 
    // 如果没有转换后的文件，重置失败/取消状态
    else if (!filesExist) {
      setIsConversionFailedOrCancelled(false);
    }
    
    // 更新上一次的完成状态（用于后续比较）
    prevIsComplete.current = isComplete;
  };

  return {
    isConversionFailedOrCancelled,  // 当前转换失败或取消状态
    setIsConversionFailedOrCancelled,  // 手动更新失败/取消状态的方法
    prevIsComplete,  // 上一次的转换完成状态（只读ref）
    updateStatus  // 更新所有状态的方法
  };
}