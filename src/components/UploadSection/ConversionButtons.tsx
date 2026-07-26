import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  GlassButton,
  GlassCancelButton,
  GlassPauseResumeButton,
} from "@/components/ui/glass-button";
import { useButtonState } from "./useButtonState";

// ── 主组件 ──
/**
 * ConversionButtons — 液态玻璃风格操作按钮组
 * 包含「开始转换 / 转换中 / 完成 / 重试」+ 可选「取消」按钮
 */
interface ConversionButtonsProps {
  isLoading: boolean;
  isComplete: boolean;
  isFailedOrCancelled?: boolean;
  isPaused: boolean;
  handleConvert: () => void;
  handleCancel: () => void;
  handlePause: () => void;
  handleResume: () => void;
}

const ConversionButtons = React.memo(
  ({
    isLoading,
    isComplete,
    isFailedOrCancelled,
    isPaused,
    handleConvert,
    handleCancel,
    handlePause,
    handleResume,
  }: ConversionButtonsProps) => {
    const buttonState = useButtonState(
      isLoading,
      isComplete,
      isFailedOrCancelled ?? false,
      isPaused,
    );
    const shouldDisplay = isLoading || !isComplete || isFailedOrCancelled || isComplete;

    return (
      <AnimatePresence>
        {shouldDisplay && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.45, delay: 0.12, ease: [0.4, 0, 0.2, 1] },
            }}
            exit={{ opacity: 0, y: 8, transition: { duration: 0.25 } }}
            className="mt-4 flex flex-col gap-3"
          >
            {/* 主按钮：非加载时显示（加载时隐藏，只保留暂停/取消） */}
            <AnimatePresence>
              {!isLoading && (
                <GlassButton onClick={handleConvert} disabled={false} variant="brand">
                  {buttonState.icon && <>{buttonState.icon}</>}
                  {buttonState.text}
                </GlassButton>
              )}
            </AnimatePresence>

            {isLoading && (
              <div className="grid grid-cols-2 gap-3">
                <GlassPauseResumeButton
                  isPaused={isPaused}
                  onToggle={isPaused ? handleResume : handlePause}
                />
                <GlassCancelButton handleCancel={handleCancel} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  },
  (prevProps, nextProps) =>
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.isComplete === nextProps.isComplete &&
    prevProps.isFailedOrCancelled === nextProps.isFailedOrCancelled &&
    prevProps.isPaused === nextProps.isPaused &&
    // 关键：handleConvert/handleCancel 闭包捕获了最新的 files，
    // 仅比较状态字段会导致新增文件后按钮仍引用旧闭包（只处理首次上传的文件）
    prevProps.handleConvert === nextProps.handleConvert &&
    prevProps.handleCancel === nextProps.handleCancel &&
    prevProps.handlePause === nextProps.handlePause &&
    prevProps.handleResume === nextProps.handleResume,
);

export default ConversionButtons;
