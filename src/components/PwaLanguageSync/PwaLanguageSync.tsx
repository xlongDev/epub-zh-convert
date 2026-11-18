import { useEffect } from "react";
import { applyPwaLanguage } from "@/utils/pwa";

/**
 * 按设备语言设置安装时使用的 PWA 名称（manifest + iOS 主屏标题）。
 * 不渲染 DOM，挂载即执行一次。
 */
const PwaLanguageSync = () => {
  useEffect(() => {
    applyPwaLanguage();
  }, []);

  return null;
};

export default PwaLanguageSync;
