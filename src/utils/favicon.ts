import { withBasePath } from "@/utils/basePath";

/**
 * 站点图标（favicon）配置：两套设计（A / C）各有深浅两版，随站点主题自动切换。
 *
 * 切换下方 FAVICON_SET 即可在两套设计间切换，无需改动其它文件：
 *   - "a"：双页 · 繁简流动（当前默认，与已上线版本一致）
 *   - "c"：双玻璃页 · 互转（备选）
 *
 * 主题跟随说明：本站主题由 next-themes 管理，用户可手动切换，因此不能靠
 * <link media="(prefers-color-scheme)">（只跟系统、不跟手动选择），
 * 需在客户端监听 resolvedTheme 并改写 head 中 link 的 href（见 FaviconThemeSync）。
 */
export type FaviconSet = "a" | "c";
export type ThemeVariant = "dark" | "light";

export const FAVICON_SET: FaviconSet = "a";

type IconHrefs = { ico: string; svg: string; apple: string };

const RESOURCES: Record<FaviconSet, Record<ThemeVariant, IconHrefs>> = {
  a: {
    dark: {
      ico: "/favicon.ico",
      svg: "/favicon.svg",
      apple: "/apple-touch-icon.png",
    },
    light: {
      ico: "/favicon-light.ico",
      svg: "/favicon-light.svg",
      apple: "/apple-touch-icon-light.png",
    },
  },
  c: {
    dark: {
      ico: "/favicon-c.ico",
      svg: "/favicon-c.svg",
      apple: "/apple-touch-icon-c.png",
    },
    light: {
      ico: "/favicon-c-light.ico",
      svg: "/favicon-c-light.svg",
      apple: "/apple-touch-icon-c-light.png",
    },
  },
};

/** 返回指定主题下、当前激活设计的图标路径（相对路径，兼容 GitHub Pages basePath）。 */
export function getFaviconHrefs(theme: string | undefined): IconHrefs {
  const variant: ThemeVariant = theme === "light" ? "light" : "dark";
  const src = RESOURCES[FAVICON_SET][variant];
  return {
    ico: withBasePath(src.ico),
    svg: withBasePath(src.svg),
    apple: withBasePath(src.apple),
  };
}

const LINK_IDS = {
  ico: "favicon-ico",
  svg: "favicon-svg",
  apple: "apple-touch-icon",
} as const;

/** 客户端按当前主题改写 <head> 中三条图标 link 的 href。 */
export function applyFavicon(theme: string | undefined): void {
  const hrefs = getFaviconHrefs(theme);
  const ico = document.getElementById(LINK_IDS.ico) as HTMLLinkElement | null;
  const svg = document.getElementById(LINK_IDS.svg) as HTMLLinkElement | null;
  const apple = document.getElementById(LINK_IDS.apple) as HTMLLinkElement | null;
  if (ico) ico.href = hrefs.ico;
  if (svg) svg.href = hrefs.svg;
  if (apple) apple.href = hrefs.apple;
}
