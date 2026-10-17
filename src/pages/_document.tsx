import { Html, Head, Main, NextScript } from "next/document";
import { withBasePath } from "@/utils/basePath";

export default function Document() {
  return (
    <Html lang="zh-CN" suppressHydrationWarning>
      <Head>
        <meta charSet="UTF-8" />
        <link rel="icon" href={withBasePath("/favicon.ico")} />
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
