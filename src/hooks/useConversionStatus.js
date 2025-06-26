import { useState, useRef } from "react";

export default function useConversionStatus() {
  const [isConversionFailedOrCancelled, setIsConversionFailedOrCancelled] = useState(false);
  const prevIsComplete = useRef(false);
  
  const updateStatus = (isComplete, error, isLoading, filesExist) => {
    if (error && !isLoading) {
      setIsConversionFailedOrCancelled(true);
    } else if (isLoading) {
      setIsConversionFailedOrCancelled(false);
    } else if (!filesExist) {
      setIsConversionFailedOrCancelled(false);
    }
    
    prevIsComplete.current = isComplete;
  };

  return {
    isConversionFailedOrCancelled,
    setIsConversionFailedOrCancelled,
    prevIsComplete,
    updateStatus
  };
}