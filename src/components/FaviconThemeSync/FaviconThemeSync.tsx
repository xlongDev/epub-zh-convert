import { useEffect } from "react";
import { useTheme } from "next-themes";
import { applyFavicon } from "@/utils/favicon";

/**
 * 让 favicon 跟随站点主题（含用户手动切换）。挂在 ThemeProvider 内部使用。
 * 不渲染任何 DOM，仅在 resolvedTheme 变化时改写 head 中图标 link 的 href。
 */
const FaviconThemeSync = () => {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    applyFavicon(resolvedTheme);
  }, [resolvedTheme]);

  return null;
};

export default FaviconThemeSync;
