import { Html, Head, Main, NextScript } from "next/document";
import { getFaviconHrefs } from "@/utils/favicon";
import { getAppleAppTitle, getManifestHref } from "@/utils/pwa";

export default function Document() {
  // SSR 首帧用深色版（与 next-themes 挂载前的默认一致）；客户端由 FaviconThemeSync 按实际主题改写
  const favicon = getFaviconHrefs("dark");

  return (
    <Html lang="zh-CN" suppressHydrationWarning>
      <Head>
        <meta charSet="UTF-8" />
        <link id="favicon-ico" rel="icon" href={favicon.ico} sizes="any" />
        <link id="favicon-svg" rel="icon" type="image/svg+xml" href={favicon.svg} />
        <link id="apple-touch-icon" rel="apple-touch-icon" href={favicon.apple} />
        {/* SSR 首帧按中文输出，客户端 PwaLanguageSync 按设备语言纠正（安装时名称取当时快照） */}
        <link id="pwa-manifest" rel="manifest" href={getManifestHref("zh")} />
        <meta
          id="apple-mobile-web-app-title"
          name="apple-mobile-web-app-title"
          content={getAppleAppTitle("zh")}
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="EPUB 繁简转换 | epub-zh-convert" />
        <meta
          property="og:description"
          content="在线 EPUB 繁简（繁体/简体）转换工具，支持批量上传、实时进度与一键下载。"
        />
        <meta property="og:locale" content="zh_CN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="EPUB 繁简转换 | epub-zh-convert" />
        <meta
          name="twitter:description"
          content="在线 EPUB 繁简（繁体/简体）转换工具，支持批量上传、实时进度与一键下载。"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
