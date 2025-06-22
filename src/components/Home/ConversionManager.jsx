/**
 * 转换管理钩子，用于处理转换操作的状态管理和回调封装
 * 
 * @param {Object} options - 选项对象
 * @param {Function} options.originalHandleConvert - 原始转换处理函数
 * @param {Function} options.originalHandleCancel - 原始取消处理函数
 * @param {Function} options.setIsConversionFailedOrCancelled - 用于设置转换失败或取消状态的函数
 * 
 * @returns {Object} - 包含封装后的转换和取消处理函数的对象
 */
import { useCallback } from "react";

export function useConversionManager({
  originalHandleConvert,
  originalHandleCancel,
  setIsConversionFailedOrCancelled,
}) {
  /**
   * 封装后的转换处理函数
   * 在调用原始转换函数前，将转换失败或取消状态设置为false
   * 使用useCallback确保引用稳定性
   */
  const handleConvert = useCallback(() => {
    setIsConversionFailedOrCancelled(false);
    originalHandleConvert();
  }, [originalHandleConvert]);

  /**
   * 封装后的取消处理函数
   * 在调用原始取消函数后，将转换失败或取消状态设置为true
   * 使用useCallback确保引用稳定性
   */
  const handleCancel = useCallback(() => {
    originalHandleCancel();
    setIsConversionFailedOrCancelled(true);
  }, [originalHandleCancel]);

  return {
    handleConvert,
    handleCancel,
  };
}