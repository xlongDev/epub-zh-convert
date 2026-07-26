import type { ReactNode } from "react";
import { CompleteIcon, PauseIcon, RetryIcon, StartIcon } from "@/components/icons";

// ── 按钮状态逻辑（纯函数，可独立测试） ──
export interface ButtonState {
  isLoading: boolean;
  disabled: boolean;
  icon: ReactNode;
  text: string;
}

export const useButtonState = (
  isLoading: boolean,
  isComplete: boolean,
  isFailedOrCancelled: boolean,
  isPaused: boolean,
): ButtonState => {
  if (isLoading && isPaused) {
    return {
      isLoading: true,
      disabled: true,
      icon: <PauseIcon />,
      text: "已暂停",
    };
  }

  if (isLoading) {
    return {
      isLoading: true,
      disabled: true,
      icon: null,
      text: "正在转换",
    };
  }

  if (isComplete) {
    return {
      isLoading: false,
      disabled: false,
      icon: <CompleteIcon />,
      text: "转换完成",
    };
  }

  if (isFailedOrCancelled) {
    return {
      isLoading: false,
      disabled: false,
      icon: <RetryIcon />,
      text: "重试转换",
    };
  }

  return {
    isLoading: false,
    disabled: false,
    icon: <StartIcon />,
    text: "开始转换",
  };
};
