import { useCallback } from "react";

export function useConversionManager({
  originalHandleConvert,
  originalHandleCancel,
  setIsConversionFailedOrCancelled,
}) {
  const handleConvert = useCallback(() => {
    setIsConversionFailedOrCancelled(false);
    originalHandleConvert();
  }, [originalHandleConvert]);

  const handleCancel = useCallback(() => {
    originalHandleCancel();
    setIsConversionFailedOrCancelled(true);
  }, [originalHandleCancel]);

  return {
    handleConvert,
    handleCancel,
  };
}
