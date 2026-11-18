import { withBasePath } from "@/utils/basePath";

/**
 * PWA 语言与名称配置。
 *
 * 站点本身未做界面 i18n（UI 文案固定中文），所以这里只按设备语言决定
 * 「安装时」看到的名称：Chrome/Android 读 manifest 的 name/short_name，
 * iOS Safari 读 apple-mobile-web-app-title meta。
 * 浏览器的 document.title 不在本模块范围内（属于网页层，未改）。
 *
 * 注意：PWA 名称是安装那一刻的快照，已安装应用不会随系统语言变化自动改名。
 */
export type AppLanguage = "zh" | "en";

/** zh-* / en-* 分别映射，其余语言默认中文。 */
export function detectAppLanguage(): AppLanguage {
  if (typeof navigator === "undefined") return "zh";
  const lang = (navigator.languages?.[0] ?? navigator.language ?? "zh").toLowerCase();
  return lang.startsWith("en") ? "en" : "zh";
}

const MANIFEST_PATH: Record<AppLanguage, string> = {
  zh: "/manifest-zh.webmanifest",
  en: "/manifest-en.webmanifest",
};

const APPLE_TITLE: Record<AppLanguage, string> = {
  zh: "繁简转换",
  en: "Converter",
};

/** manifest 路径（相对 basePath，兼容 GitHub Pages 的 /epub-zh-convert）。 */
export function getManifestHref(lang: AppLanguage): string {
  return withBasePath(MANIFEST_PATH[lang]);
}

export function getAppleAppTitle(lang: AppLanguage): string {
  return APPLE_TITLE[lang];
}

const MANIFEST_ID = "pwa-manifest";
const APPLE_TITLE_ID = "apple-mobile-web-app-title";

/** 按设备语言改写 manifest link 与 iOS 主屏标题 meta。 */
export function applyPwaLanguage(lang: AppLanguage = detectAppLanguage()): void {
  const manifest = document.getElementById(MANIFEST_ID) as HTMLLinkElement | null;
  if (manifest) manifest.href = getManifestHref(lang);

  let meta = document.getElementById(APPLE_TITLE_ID) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    meta.id = APPLE_TITLE_ID;
    meta.name = "apple-mobile-web-app-title";
    document.head.appendChild(meta);
  }
  meta.content = APPLE_TITLE[lang];
}
